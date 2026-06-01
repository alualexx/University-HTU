import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Divider,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Timeline,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/Firebase';
import { applicationsAPI } from '../../services/api';

// Internal status codes used across the system
const STATUS_STEPS = [
  { label: 'Application Submitted', key: 'submitted' },
  { label: 'Department Review', key: 'pending_dept_review' },
  { label: 'Department Decision', key: 'dept_decision' },
  { label: 'Registrar Final Decision', key: 'registrar_decision' },
  { label: 'Student Account Issued', key: 'enrolled' },
  { label: 'Semester Registration', key: 'reg_submitted' },
  { label: 'Registration Verified', key: 'reg_approved' }
];

// Map internal status codes to human-readable labels
const STATUS_LABELS = {
  'pending_dept_review': 'Pending Department Review',
  'approved_by_dept': 'Approved by Department',
  'rejected_by_dept': 'Rejected by Department',
  'approved_by_registrar': 'Approved by Registrar',
  'final_approved': 'Approved by Registrar',
  'rejected_by_registrar': 'Rejected by Registrar',
  'enrolled': 'Student Account Issued',
  'setup_completed': 'Account Setup Completed',
  'id_issued': 'Student ID Issued',
  'rejected': 'Rejected (Registrar)',
};

const TrackApplication = () => {
  const theme = useTheme();
  const [applicationId, setApplicationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationData, setApplicationData] = useState(null);

  /**
   * Normalize the Protocol Reference ID entered by user.
   * Stored format in Firestore: 'DQHD—W4HEG5' (em-dash).
   * User might type with em-dash, hyphen, or no separator at all.
   * We normalize to 'XXXX—XXXXXX' format to match what's stored.
   */
  const normalizeReferenceId = (input) => {
    // Remove whitespace and em-dashes and hyphens, uppercase everything
    const clean = input.replace(/[\u2014\-\s]/g, '').toUpperCase();
    if (clean.length >= 10) {
      // Re-insert em-dash between char 4 and 5
      return clean.slice(0, 4) + '\u2014' + clean.slice(4, 10);
    }
    return clean;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!applicationId.trim()) {
      setError('Please enter your Protocol Reference ID.');
      return;
    }

    setLoading(true);
    setError('');
    setApplicationData(null);

    // Normalize to match stored format
    const normalizedRef = normalizeReferenceId(applicationId.trim());

    try {
      // Query the API instead of direct Firestore
      const response = await applicationsAPI.track(normalizedRef);
      const appData = response.data;

      if (appData) {
        // If the application is fully enrolled, check registration status in Firestore
        // (Tuition payments are still currently tracked in Firestore)
        if (appData.status === 'enrolled' && appData.studentId) {
          try {
            const paymentsRef = collection(db, "tuition_payments");
            const pq = query(paymentsRef, where("studentId", "==", appData.studentId), orderBy("timestamp", "desc"), limit(1));
            const paymentSnap = await getDocs(pq);

            if (!paymentSnap.empty) {
              const latestPayment = paymentSnap.docs[0].data();
              appData.registrationStatus = latestPayment.status;
            } else {
              appData.registrationStatus = 'not_submitted';
            }
          } catch (paymentErr) {
            console.error("Error fetching registration payments for tracker:", paymentErr);
            appData.registrationStatus = 'unknown';
          }
        }

        setApplicationData(appData);
      } else {
        setError('Application not found. Please check your Protocol Reference ID and try again.');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      if (err.response?.status === 404) {
        setError('Application not found. Please check your Protocol Reference ID and try again.');
      } else {
        setError('An error occurred while fetching your application. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status, registrationStatus) => {
    if (!status) return 0;

    switch (status) {
      case 'pending_dept_review':
        return 1; // Submitted, under dept review
      case 'approved_by_dept':
        return 2; // Dept approved, pending registrar
      case 'rejected_by_dept':
        return 2; // Rejected at dept step
      case 'approved_by_registrar':
      case 'final_approved':
        return 3; // Registrar approved
      case 'rejected_by_registrar':
      case 'rejected':
        return 3; // Rejected at registrar step
      case 'enrolled':
      case 'setup_completed':
      case 'id_issued':
        if (registrationStatus === 'approved') return 6;     // Fully registered (Step 7 - index 6)
        if (registrationStatus === 'pending_approval' || registrationStatus === 'pending_payment_approval') return 5; // Submitted, awaiting approval (Step 6 - index 5)
        return 4; // Account issued, waiting for student to register (Step 5 - index 4)
      default:
        return 0;
    }
  };

  const isRejected = applicationData?.status === 'rejected_by_dept' || applicationData?.status === 'rejected_by_registrar';
  const activeStep = getActiveStep(applicationData?.status, applicationData?.registrationStatus);
  const rejectedStep = applicationData?.status === 'rejected_by_dept' ? 2 : applicationData?.status === 'rejected_by_registrar' ? 3 : -1;
  const displayStatus = STATUS_LABELS[applicationData?.status] || applicationData?.status || '';

  return (
    <Box sx={{
      minHeight: '100vh',
      pt: { xs: 12, md: 16 },
      pb: 8,
      px: { xs: 2, sm: 4 },
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="md">
        <Paper elevation={24} sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          background: theme.palette.mode === 'dark'
            ? alpha('#1e293b', 0.9)
            : alpha('#ffffff', 0.9),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 3
            }}>
              <Timeline sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h3" fontWeight="900" gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Track Your Application
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight="500">
              Enter your Reference ID to check your current admission status.
            </Typography>
          </Box>

          {/* Search Form */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Protocol Reference ID"
                placeholder="e.g., ABC1—23XYZ7"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                autoFocus
                InputProps={{
                  sx: { borderRadius: 3, fontWeight: 600, bgcolor: theme.palette.background.paper }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !applicationId.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{
                  px: 4, py: 1.5, borderRadius: 3, fontWeight: 800,
                  whiteSpace: 'nowrap',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {loading ? 'Searching...' : 'Track Application'}
              </Button>
            </Box>

            <Collapse in={Boolean(error)}>
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </Collapse>
          </Box>

          <Divider sx={{ mb: 6, opacity: 0.5 }} />

          {/* Results Area */}
          <Collapse in={Boolean(applicationData)}>
            {applicationData && (
              <Box>
                {/* Applicant Info Summary */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 3,
                  p: 4,
                  mb: 6,
                  borderRadius: 4,
                  bgcolor: theme.palette.mode === 'dark' ? alpha('#0f172a', 0.6) : alpha('#f1f5f9', 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="700">
                      Applicant Name
                    </Typography>
                    <Typography variant="h5" fontWeight="800" gutterBottom>
                      {applicationData.firstName} {applicationData.lastName}
                    </Typography>

                    <Typography variant="overline" color="text.secondary" fontWeight="700">
                      Prospective Department
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                      {applicationData.intendedMajor}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography variant="overline" color="text.secondary" fontWeight="700" display="block">
                      Current Status
                    </Typography>
                    <Chip
                      label={displayStatus.toUpperCase()}
                      color={isRejected ? 'error' : (applicationData.status === 'enrolled' || applicationData.status === 'approved_by_registrar' ? 'success' : 'primary')}
                      sx={{ fontWeight: 900, fontSize: '0.85rem', px: 2, py: 2.5, borderRadius: 3 }}
                    />
                  </Box>
                </Box>

                {/* Status Timeline */}
                <Typography variant="h5" fontWeight="800" mb={4}>
                  Application Progress
                </Typography>
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{
                    '& .MuiStepConnector-line': {
                      minHeight: 40,
                      borderLeftWidth: 3,
                    }
                  }}
                >
                  {STATUS_STEPS.map((step, index) => {
                    const isStepRejected = isRejected && rejectedStep === index;
                    const isActive = activeStep === index;
                    const isCompleted = activeStep > index && !isStepRejected;

                    return (
                      <Step key={step.label} completed={isCompleted} expanded={true}>
                        <StepLabel
                          error={isStepRejected}
                          StepIconComponent={({ active, completed, error }) => {
                            if (isStepRejected) return <Cancel color="error" sx={{ fontSize: 32 }} />;
                            if (isCompleted) return <CheckCircle color="success" sx={{ fontSize: 32 }} />;
                            if (isActive) return <Pending color="primary" sx={{ fontSize: 32 }} />;
                            return <div style={{ width: 16, height: 16, margin: 8, borderRadius: '50%', backgroundColor: theme.palette.divider }} />;
                          }}
                        >
                          <Typography variant="h6" fontWeight={isActive ? 800 : 500}
                            color={isStepRejected ? 'error.main' : (isActive ? 'primary.main' : 'text.primary')}>
                            {step.label}
                          </Typography>
                          {isStepRejected && (
                            <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
                              Unfortunately, your application was not approved at this stage.
                            </Typography>
                          )}
                          {isActive && !isStepRejected && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                              {step.label === "Registrar Final Decision"
                                ? "Awaiting final review by the Registrar's office."
                                : step.label === "Student Account Issued"
                                  ? "Your account is being provisioned. You will receive an email shortly with your credentials."
                                  : step.label === "Semester Registration"
                                    ? "Please log in to your Student Portal to complete your semester course registration."
                                    : step.label === "Registration Verified"
                                      ? "Your registration is under review by the finance/registrar office."
                                      : "Your application is currently being processed."}
                            </Typography>
                          )}
                          {isCompleted && (
                            <Typography variant="body2" color="success.main" sx={{ mt: 0.5, fontWeight: 600 }}>
                              Completed
                            </Typography>
                          )}
                          {index === 6 && activeStep === 7 && (
                            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 700 }}>
                              Congratulations! Your enrollment is fully certified and you are officially registered for the semester.
                            </Typography>
                          )}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
            )}
          </Collapse>
        </Paper>
      </Container>
    </Box>
  );
};

export default TrackApplication;
