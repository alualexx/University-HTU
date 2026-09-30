import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, TextField, Button,
  CircularProgress, Alert, Collapse, Stepper, Step, StepLabel,
  useTheme, alpha, Chip, Fade, Stack
} from '@mui/material';
import {
  Search as SearchIcon, Timeline, CheckCircle, Pending, Cancel,
  ArrowBack, School, LockOutlined, TrackChanges,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/Firebase';
import { applicationsAPI } from '../../services/api';

const STATUS_STEPS = [
  { label: 'Application Initialized', key: 'submitted', description: 'Data packets received and encrypted securely.' },
  { label: 'Departmental Processing', key: 'pending_dept_review', description: 'Subject under review by the academic core.' },
  { label: 'Registrar Finalization', key: 'registrar_decision', description: 'Final verification protocol by the Central Registrar.' },
  { label: 'Identity Provisioned', key: 'enrolled', description: 'Institutional access credentials deployed.' },
];

const STATUS_LABELS = {
  'pending_dept_review': 'Protocol Analyzing',
  'approved_by_dept': 'Department Authorized',
  'rejected_by_dept': 'Application Terminated',
  'approved_by_registrar': 'Registration Cleared',
  'final_approved': 'Admission Secured',
  'rejected_by_registrar': 'Application Terminated',
  'enrolled': 'Active Enrollment',
};

export default function TrackApplication() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [applicationId, setApplicationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationData, setApplicationData] = useState(null);

  const normalizeReferenceId = (input) => input.trim().toUpperCase();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!applicationId.trim()) return setError('Please enter your Protocol Reference ID.');

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
            if (!paymentSnap.empty) appData.registrationStatus = paymentSnap.docs[0].data().status;
          } catch (paymentErr) {
            console.error("Error fetching registration payments", paymentErr);
          }
        }
        setApplicationData(appData);
      } else {
        setError('Application not found. Please re-enter your Reference Node ID.');
      }
    } catch (err) {
      setError(err.response?.status === 404 ? 'Application not found. Verify your Protocol ID.' : 'Connection unstable. Retry transmission.');
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
      minHeight: '100vh', bgcolor: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? 'white' : 'text.primary',
      pt: { xs: 15, md: 22 }, pb: 15,
      position: 'relative', overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', width: "60vw", height: "60vw", borderRadius: '50%', top: "-20%", right: "-10%", background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
      <Box sx={{ position: 'absolute', width: "50vw", height: "50vw", borderRadius: '50%', bottom: "-10%", left: "-10%", background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 60%)', filter: 'blur(100px)' }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={6}>
              <Button
                startIcon={<ArrowBack />} component={RouterLink} to="/apply"
                sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', textTransform: 'none', fontWeight: 800, borderRadius: 50, px: 2, '&:hover': { color: isDark ? 'white' : 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}
              >
                Abort & Return
              </Button>
              <Chip icon={<TrackChanges sx={{ fontSize: '1rem !important', color: isDark ? 'white !important' : 'inherit !important' }} />} label="LIVE TRACKING" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : alpha(theme.palette.primary.main, 0.1), color: isDark ? 'white' : 'primary.main', fontWeight: 900, border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : alpha(theme.palette.primary.main, 0.2)}`, letterSpacing: 1 }} />
            </Stack>

            <Card sx={{
              borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'}`,
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(30px)',
              overflow: 'hidden', mb: 6, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)"
            }}>
              <Box sx={{ height: 4, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                  <Typography variant="h2" fontWeight={1000} sx={{ color: isDark ? 'white' : 'text.primary', fontFamily: 'Outfit', letterSpacing: '-0.02em', mb: 2 }}>
                    Locate Your <Box component="span" sx={{ background: "linear-gradient(90deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admission</Box>
                  </Typography>
                  <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', fontWeight: 500, maxWidth: 500, mx: 'auto' }}>
                    Deploy your Protocol Reference ID to visualize your structural journey towards academic excellence.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSearch}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <TextField
                      fullWidth variant="outlined" placeholder="REFERENCE NODE (e.g. ABCD—123456)"
                      value={applicationId} onChange={(e) => setApplicationId(e.target.value)}
                      helperText="Hyphens (-) or em-dashes (—) are valid connectors."
                      FormHelperTextProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary', fontWeight: 600, mt: 1.5 } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 50, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', color: isDark ? 'white' : 'text.primary', fontWeight: 800,
                          "& fieldset": { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                          "&:hover fieldset": { borderColor: 'rgba(99, 102, 241, 0.5)' },
                          "&.Mui-focused fieldset": { borderColor: '#6366f1' },
                        },
                        "& .MuiInputBase-input::placeholder": { color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", opacity: 1, fontWeight: 600 }
                      }}
                    />
                    <Button
                      type="submit" variant="contained" disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <SearchIcon />}
                      sx={{ borderRadius: 50, px: 5, py: 2, height: 56, fontWeight: 900, textTransform: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', "&:hover": { filter: "brightness(1.2)" } }}
                    >
                      {loading ? 'Decrypting...' : 'Initiate Scan'}
                    </Button>
                  </Stack>
                  <Collapse in={Boolean(error)}>
                    <Alert severity="error" sx={{ mt: 4, borderRadius: 4, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 800 }}>
                      {error}
                    </Alert>
                  </Collapse>
                </Box>
              </CardContent>
            </Card>

            <Collapse in={Boolean(applicationData)}>
              {applicationData && (
                <Box>
                  <Card sx={{ borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(30px)', mb: 5, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)" }}>
                    <CardContent sx={{ p: 5 }}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ width: 64, height: 64, borderRadius: 4, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                              <School sx={{ color: 'white', fontSize: 32 }} />
                            </Box>
                            <Box>
                              <Typography variant="h4" fontWeight={1000} sx={{ color: isDark ? 'white' : 'text.primary', fontFamily: 'Outfit' }}>
                                {applicationData.firstName} {applicationData.lastName}
                              </Typography>
                              <Typography variant="body2" fontWeight={900} color="#3b82f6" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                                {applicationData.intendedMajor}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ textAlign: { md: 'right' } }}>
                          <Typography variant="caption" fontWeight={900} sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary', textTransform: 'uppercase', letterSpacing: 3, display: 'block', mb: 1.5 }}>
                            CURRENT STATUS
                          </Typography>
                          <Chip
                            label={displayStatus}
                            sx={{
                              fontWeight: 1000, px: 2, py: 3, borderRadius: 50, letterSpacing: 1, textTransform: "uppercase",
                              bgcolor: isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: isRejected ? '#ef4444' : '#10b981',
                              border: `1px solid ${isRejected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(30px)', boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)" }}>
                    <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                      <Typography variant="h5" fontWeight={900} sx={{ color: isDark ? 'white' : 'text.primary', mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Timeline sx={{ color: '#3b82f6', fontSize: 30 }} /> Progression Log
                      </Typography>

                      <Stepper
                        activeStep={activeStep} orientation="vertical"
                        sx={{
                          '& .MuiStepConnector-line': { minHeight: 60, borderLeft: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` },
                          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': { borderLeft: '2px solid #3b82f6' },
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
                                    width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: isFail ? 'rgba(239, 68, 68, 0.1)' : isDone ? 'rgba(16, 185, 129, 0.1)' : isActive ? 'rgba(59, 130, 246, 0.1)' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                                    border: '2px solid',
                                    borderColor: isFail ? '#ef4444' : isDone ? '#10b981' : isActive ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                    color: isFail ? '#ef4444' : isDone ? '#10b981' : isActive ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
                                    transition: 'all 0.3s ease', boxShadow: isActive ? "0 0 20px rgba(59, 130, 246, 0.4)" : "none"
                                  }}>
                                    {isFail ? <Cancel sx={{ fontSize: 26 }} /> : isDone ? <CheckCircle sx={{ fontSize: 26 }} /> : <Pending sx={{ fontSize: 26, animation: isActive ? 'pulse 2s infinite' : 'none' }} />}
                                  </Box>
                                )}
                              >
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="h6" fontWeight={900} color={isFail ? '#ef4444' : isDone ? '#10b981' : isActive ? (isDark ? 'white' : 'text.primary') : (isDark ? 'rgba(255,255,255,0.3)' : 'text.disabled')}>
                                    {step.label}
                                  </Typography>
                                  <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary', mt: 1, fontWeight: 500, lineHeight: 1.6 }}>
                                    {isFail ? 'Unfortunately, your journey ends here for this term.' : isActive ? step.description : isDone ? 'Stage successfully cleared.' : 'Awaiting clearance...'}
                                  </Typography>
                                </Box>
                              </StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>

                      {applicationData.status === 'enrolled' && (
                        <Box sx={{ mt: 8, p: 4, borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', gap: 3, alignItems: 'center' }}>
                          <Box sx={{ width: 56, height: 56, borderRadius: 4, bgcolor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                            <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={1000} color="#10b981">ACTION REQUIRED: SECURE LOGIN</Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', lineHeight: 1.5, display: 'block', mt: 1, fontWeight: 500 }}>
                              Your student account is initialized. Utilize the credentials beamed to your registered communication device to access the Portal.
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
          0% { transform: scale(1); opacity: 1; boxShadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); opacity: 1; boxShadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); opacity: 1; boxShadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </Box>
  );
}
