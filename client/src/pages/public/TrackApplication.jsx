import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Collapse, Stepper, Step, StepLabel,
  useTheme, alpha, Divider, Chip, Fade, Stack, IconButton,
} from '@mui/material';
import {
  Search as SearchIcon, Timeline, CheckCircle, Pending, Cancel,
  ArrowBack, AssignmentInd, School, LockOutlined, InfoOutlined,
  TrackChanges,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/Firebase';
import { applicationsAPI } from '../../services/api';

const STATUS_STEPS = [
  { label: 'Application Submitted', key: 'submitted', description: 'Application received and securely encrypted.' },
  { label: 'Department Review', key: 'pending_dept_review', description: 'Under review by the academic department.' },
  { label: 'Registrar Final Decision', key: 'registrar_decision', description: 'Final verification by the Office of the Registrar.' },
  { label: 'Student Account Issued', key: 'enrolled', description: 'Institutional email and login provisioned.' },
];

const STATUS_LABELS = {
  'pending_dept_review': 'Under Review',
  'approved_by_dept': 'Dept Approved',
  'rejected_by_dept': 'Application Declined',
  'approved_by_registrar': 'Registration Authorized',
  'final_approved': 'Admission Confirmed',
  'rejected_by_registrar': 'Application Declined',
  'enrolled': 'Enrolled / Active',
};

const TrackApplication = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const [applicationId, setApplicationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationData, setApplicationData] = useState(null);

  const normalizeReferenceId = (input) => {
    // Just trim and uppercase, let the backend handle dash-insensitivity
    return input.trim().toUpperCase();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!applicationId.trim()) {
      setError('Please enter your Protocol Reference ID.');
      return;
    }

    setLoading(true);
    setError('');
    const normalizedRef = normalizeReferenceId(applicationId.trim());

    try {
      const response = await applicationsAPI.track(normalizedRef);
      const appData = response.data;

      if (appData) {
        if (appData.status === 'enrolled' && appData.studentId) {
          try {
            const paymentsRef = collection(db, "tuition_payments");
            const pq = query(paymentsRef, where("studentId", "==", appData.studentId), orderBy("timestamp", "desc"), limit(1));
            const paymentSnap = await getDocs(pq);
            if (!paymentSnap.empty) {
              appData.registrationStatus = paymentSnap.docs[0].data().status;
            }
          } catch (paymentErr) {
            console.error("Error fetching registration payments:", paymentErr);
          }
        }
        setApplicationData(appData);
      } else {
        setError('Application not found. Please check your Protocol Reference ID.');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.status === 404
        ? 'Application not found. Verify your Reference ID.'
        : 'Connection lost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status) => {
    if (!status) return 0;
    switch (status) {
      case 'pending_dept_review': return 1;
      case 'approved_by_dept': return 2;
      case 'final_approved': return 3;
      case 'enrolled': return 4;
      default: return 0;
    }
  };

  const isRejected = applicationData?.status?.includes('rejected');
  const activeStep = getActiveStep(applicationData?.status);
  const displayStatus = STATUS_LABELS[applicationData?.status] || applicationData?.status || 'Processing';

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      pt: { xs: 12, md: 20 },
      pb: 10,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: -150, right: -150, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: -100, left: -100, background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Box>
            {/* Nav Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={6}>
              <Button
                startIcon={<ArrowBack />} component={RouterLink} to="/"
                sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontWeight: 700, '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
              >
                Back to Home
              </Button>
              <Chip icon={<TrackChanges sx={{ fontSize: '1rem !important', color: 'primary.main !important' }} />} label="Real-time Tracking" sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: 'primary.main', fontWeight: 800, border: '1px solid rgba(99,102,241,0.2)' }} />
            </Stack>

            {/* Search Card */}
            <Card elevation={0} sx={{
              borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)',
              bgcolor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)',
              overflow: 'hidden', mb: 6
            }}>
              <Box sx={{ height: 6, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', mb: 2 }}>
                    Track Your <Box component="span" sx={{ color: 'primary.main' }}>Admission</Box>
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.5)" fontWeight={500} sx={{ maxWidth: 500, mx: 'auto' }}>
                    Enter your Protocol Reference ID to visualize your journey towards academic excellence.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSearch}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth variant="outlined" placeholder="e.g. ABCD—123456"
                      value={applicationId} onChange={(e) => setApplicationId(e.target.value)}
                      helperText="You can use a hyphen (-) or an em-dash (—)"
                      FormHelperTextProps={{ sx: { color: 'rgba(255,255,255,0.4)', fontWeight: 600 } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3, bgcolor: 'rgba(0,0,0,0.2)', color: 'white', fontWeight: 600,
                          "& fieldset": { borderColor: 'rgba(255,255,255,0.1)' },
                          "&:hover fieldset": { borderColor: 'primary.main' },
                          "&.Mui-focused fieldset": { borderColor: 'primary.main' },
                        }
                      }}
                    />
                    <Button
                      type="submit" variant="contained" disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                      sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
                    >
                      {loading ? 'Decrypting...' : 'Track Status'}
                    </Button>
                  </Stack>
                  <Collapse in={Boolean(error)}>
                    <Alert severity="error" sx={{ mt: 3, borderRadius: 3, bgcolor: 'rgba(244,67,54,0.08)', color: '#f44336', border: '1px solid rgba(244,67,54,0.2)' }}>
                      {error}
                    </Alert>
                  </Collapse>
                </Box>
              </CardContent>
            </Card>

            {/* Results Area */}
            <Collapse in={Boolean(applicationData)}>
              {applicationData && (
                <Box>
                  {/* Summary Block */}
                  <Card elevation={0} sx={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', bgcolor: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Stack direction="row" spacing={2.5} alignItems="center">
                            <Box sx={{ width: 64, height: 64, borderRadius: 4, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(99,102,241,0.3)' }}>
                              <School sx={{ color: 'white', fontSize: 32 }} />
                            </Box>
                            <Box>
                              <Typography variant="h5" fontWeight={900} color="white" sx={{ fontFamily: 'Outfit, sans-serif' }}>
                                {applicationData.firstName} {applicationData.lastName}
                              </Typography>
                              <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                {applicationData.intendedMajor}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ textAlign: { md: 'right' } }}>
                          <Typography variant="caption" fontWeight={800} color="rgba(255,255,255,0.3)" sx={{ textTransform: 'uppercase', letterSpacing: 2, display: 'block', mb: 1 }}>
                            Current Protocol
                          </Typography>
                          <Chip
                            label={displayStatus}
                            sx={{
                              fontWeight: 900, px: 2, py: 2.5, borderRadius: 3,
                              bgcolor: isRejected ? 'rgba(244,67,54,0.1)' : 'rgba(16,185,129,0.1)',
                              color: isRejected ? '#f44336' : '#10b981',
                              border: `1px solid ${isRejected ? 'rgba(244,67,54,0.2)' : 'rgba(16,185,129,0.2)'}`
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Journey Stepper */}
                  <Card elevation={0} sx={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', bgcolor: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(20px)' }}>
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                      <Typography variant="h6" fontWeight={800} color="white" mb={5} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Timeline sx={{ color: 'primary.main' }} /> Admission Journey
                      </Typography>

                      <Stepper
                        activeStep={activeStep} orientation="vertical"
                        sx={{
                          '& .MuiStepConnector-line': { minHeight: 60, borderLeft: '2px dashed rgba(255,255,255,0.1)' },
                          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': { borderLeft: '2px solid #6366f1' },
                          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': { borderLeft: '2px solid #10b981' },
                        }}
                      >
                        {STATUS_STEPS.map((step, index) => {
                          const isActive = activeStep === index;
                          const isDone = activeStep > index;
                          const isFail = isRejected && activeStep === index;

                          return (
                            <Step key={step.label} expanded>
                              <StepLabel
                                StepIconComponent={() => (
                                  <Box sx={{
                                    width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: isFail ? 'rgba(244,67,54,0.1)' : isDone ? 'rgba(16,185,129,0.1)' : isActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)',
                                    border: '2px solid',
                                    borderColor: isFail ? '#f44336' : isDone ? '#10b981' : isActive ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                    color: isFail ? '#f44336' : isDone ? '#10b981' : isActive ? '#6366f1' : 'rgba(255,255,255,0.3)',
                                    transition: 'all 0.3s ease'
                                  }}>
                                    {isFail ? <Cancel sx={{ fontSize: 24 }} /> : isDone ? <CheckCircle sx={{ fontSize: 24 }} /> : <Pending sx={{ fontSize: 24, animation: isActive ? 'pulse 2s infinite' : 'none' }} />}
                                  </Box>
                                )}
                              >
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="subtitle1" fontWeight={800} color={isFail ? '#f44336' : isDone ? '#10b981' : isActive ? 'white' : 'rgba(255,255,255,0.35)'}>
                                    {step.label}
                                  </Typography>
                                  <Typography variant="body2" color="rgba(255,255,255,0.4)" sx={{ mt: 0.5, fontWeight: 500, lineHeight: 1.6 }}>
                                    {isFail ? 'Unfortunately, your journey ends here for this term.' : isActive ? step.description : isDone ? 'Stage successfully cleared.' : 'Waiting for previous stages...'}
                                  </Typography>
                                </Box>
                              </StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>

                      {applicationData.status === 'enrolled' && (
                        <Box sx={{ mt: 6, p: 3, borderRadius: 4, bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', gap: 2.5, alignItems: 'center' }}>
                          <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <LockOutlined sx={{ color: 'white' }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800} color="#10b981">Action Required: Portal Access</Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ lineHeight: 1.5, display: 'block', mt: 0.5 }}>
                              Your student account is active. Please use the credentials sent to your registered contact number to login to the Portal.
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Collapse>
          </Box>
        </Fade>
      </Container>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default TrackApplication;
