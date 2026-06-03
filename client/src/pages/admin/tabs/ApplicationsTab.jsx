import React from "react";
import {
  Box, Card, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, useTheme, Avatar, Stack, Grid
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AssignmentTurnedIn, Warning, Shield, AccountCircle, School as SchoolIcon, VerifiedUser, Cancel
} from "@mui/icons-material";

const ApplicationsTab = ({
  applications,
  handleReviewApplication,
  handleRejectApplication,
  clearanceStudents = [],
  handleDeactivateStudent,
  glassStyle,
  mode
}) => {
  const theme = useTheme();
  const isDark = mode === "dark";

  const itemStyle = {
    p: 3,
    mb: 2,
    borderRadius: 4,
    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: theme.palette.primary.main,
      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.1)}`
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, fontFamily: 'Outfit, sans-serif' }}>
            Admissions Protocol Queue
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ mt: 0.5, opacity: 0.8 }}>
            VERIFICATION OF COLLEGE-LEVEL ADMINISTRATIVE CANDIDATES
          </Typography>
        </Box>
        <Chip
          label={`${applications.length} PENDING`}
          sx={{
            fontWeight: 1000,
            height: 32,
            px: 1,
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}
        />
      </Box>

      {/* Applications List */}
      <Box sx={{ mb: 6 }}>
        {applications.length > 0 ? (
          <Box>
            <Grid container spacing={0} sx={{ px: 3, mb: 2, display: { xs: 'none', md: 'flex' } }}>
              {["CANDIDATE IDENTITY", "SOURCE INSTITUTION", "CLEARANCE STATUS", "ACTION PROTOCOL"].map((h, i) => (
                <Grid item xs={3} key={h}>
                  <Typography variant="caption" fontWeight={1000} color="text.secondary" sx={{ letterSpacing: 1.5, fontSize: '0.65rem' }}>
                    {h}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            {applications.map((app) => (
              <Card key={app.id || app._id} sx={itemStyle}>
                <Grid container spacing={2} alignItems="center">
                  {/* Identity */}
                  <Grid item xs={12} md={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 44, height: 44, fontWeight: 1000 }}>
                        {app.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={1000}>{app.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ wordBreak: 'break-all' }}>{app.email || 'pending_email—' + app.referenceId}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Institution */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ pl: { md: 2 } }}>
                      <Typography variant="body2" fontWeight={800} color="text.primary">{app.college || app.intendedMajor}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Role: {app.role || 'Student'}</Typography>
                    </Box>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} md={3}>
                    <Chip
                      label={app.status?.toUpperCase() || "PENDING"}
                      size="small"
                      sx={{
                        fontWeight: 1000,
                        fontSize: '0.65rem',
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                      }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={3}>
                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="contained" fullWidth
                        onClick={() => handleReviewApplication(app)}
                        sx={{
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 1000,
                          py: 1,
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
                          '&:hover': { boxShadow: '0 12px 20px rgba(99, 102, 241, 0.3)' }
                        }}
                      >
                        Authenticate
                      </Button>
                      <Button
                        variant="outlined" color="error"
                        onClick={() => handleRejectApplication(app)}
                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, minWidth: 100 }}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
            <AssignmentTurnedIn sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" fontWeight={1000}>PROTOCOL QUEUE CLEAR</Typography>
          </Box>
        )}
      </Box>

      {/* Student Clearance Queue Section */}
      <Box sx={{ mt: 8 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, fontFamily: 'Outfit, sans-serif' }}>
              Student Clearance Queue
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ mt: 0.5, opacity: 0.8 }}>
              MANAGE ACCOUNT DEACTIVATION PROTOCOLS
            </Typography>
          </Box>
          <Chip label={`${clearanceStudents.length} PENDING`} color="error" size="small" sx={{ fontWeight: 1000, borderRadius: 1 }} />
        </Box>

        <Card sx={{ ...glassStyle, borderRadius: 6, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                  {["Student Identity", "Department / Role", "Clearance Status", "Action Protocol"].map((h) => (
                    <TableCell key={h} sx={{ borderBottom: 'none', py: 2.5, fontWeight: 1000, color: "text.secondary", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {clearanceStudents.length > 0 ? clearanceStudents.map((student, i) => (
                  <TableRow key={i} sx={{ '& td': { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body2" fontWeight={1000}>{student.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>{student.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={800}>{student.department || "N/A"}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Role: {student.role?.toUpperCase()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status?.toUpperCase()}
                        size="small"
                        sx={{ fontWeight: 1000, borderRadius: 1, fontSize: '0.6rem', color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeactivateStudent && handleDeactivateStudent(student)}
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 1000, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                      >
                        Deactivate Account
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 10, opacity: 0.3 }}>
                      <VerifiedUser sx={{ fontSize: 40, mb: 1 }} />
                      <Typography fontWeight={1000}>ALL CLEARANCE PROTOCOLS RESOLVED</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Security Disclaimer */}
      <Box sx={{
        mt: 6, p: 3,
        borderRadius: 4,
        bgcolor: alpha(theme.palette.warning.main, 0.05),
        border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
        display: 'flex', alignItems: 'center', gap: 3
      }}>
        <Shield color="warning" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={1000} color="warning.main">SECURITY PROTOCOL NOTICE</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            All administrative candidates must pass biometric verification before final provisioning. Provisioning will force a password rotation on first student login.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ApplicationsTab;
