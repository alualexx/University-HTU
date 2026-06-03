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
            {/* Table Header Header */}
            <Grid container spacing={0} sx={{ px: 4, mb: 1.5, display: { xs: 'none', md: 'flex' }, opacity: 0.8 }}>
              {["CANDIDATE IDENTITY", "SOURCE INSTITUTION", "CLEARANCE STATUS", "ACTION PROTOCOL"].map((h, i) => (
                <Grid item xs={i === 0 ? 3.5 : i === 1 ? 3 : i === 2 ? 2.5 : 3} key={h}>
                  <Typography variant="caption" fontWeight={1000} color="text.secondary" sx={{ letterSpacing: 2, fontSize: '0.6rem' }}>
                    {h}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* List Items */}
            <Stack spacing={2.5}>
              {applications.map((app) => {
                const appId = app._id || app.id;
                return (
                  <Card
                    key={appId}
                    sx={{
                      p: 0,
                      borderRadius: 5,
                      background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37, 99, 235, 0.04)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                        boxShadow: isDark ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}` : `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                        '& .action-overlay': { opacity: 1 }
                      }
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: 'primary.main', opacity: 0.6 }} />

                    <Grid container spacing={0} alignItems="center" sx={{ p: 3 }}>
                      {/* Identity Section */}
                      <Grid item xs={12} md={3.5}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box sx={{ position: 'relative' }}>
                            <Avatar
                              sx={{
                                width: 56, height: 56, borderRadius: 4,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 1000, fontSize: '1.4rem',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                              }}
                            >
                              {app.name?.[0]}
                            </Avatar>
                            <Box sx={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: '50%', bgcolor: 'success.main', border: `3px solid ${isDark ? '#1e293b' : '#fff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <VerifiedUser sx={{ fontSize: 10, color: 'white' }} />
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={1000} sx={{ lineHeight: 1.2, mb: 0.5 }}>{app.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5, display: 'block' }}>
                              {app.email || `REF: ${app.referenceId?.slice(-8).toUpperCase()}`}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Institution Section */}
                      <Grid item xs={12} md={3}>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                            <Typography variant="body2" fontWeight={900} color="text.primary">
                              {app.college || app.intendedMajor || "University Dept"}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ pl: 3 }}>
                            ROLE: <span style={{ color: theme.palette.primary.main }}>STUDENT CANDIDATE</span>
                          </Typography>
                        </Stack>
                      </Grid>

                      {/* Clearance Status Section */}
                      <Grid item xs={12} md={2.5}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Chip
                            label={app.status?.replace(/_/g, ' ').toUpperCase() || "PENDING"}
                            sx={{
                              width: 'fit-content',
                              fontWeight: 1000,
                              fontSize: '0.6rem',
                              borderRadius: 2,
                              height: 24,
                              bgcolor: alpha(theme.palette.warning.main, 0.08),
                              color: theme.palette.warning.main,
                              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                              letterSpacing: 1
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>
                            LAST UPDATED: {new Date(app.updatedAt || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Action Protocol Section */}
                      <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={1.5}>
                          <Button
                            variant="contained" fullWidth
                            onClick={() => handleReviewApplication(app)}
                            startIcon={<AssignmentTurnedIn sx={{ fontSize: 18 }} />}
                            sx={{
                              borderRadius: 3,
                              textTransform: 'none',
                              fontWeight: 1000,
                              py: 1.2,
                              fontSize: '0.8rem',
                              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.2)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                                transform: 'scale(1.02)'
                              }
                            }}
                          >
                            Authenticate
                          </Button>
                          <Button
                            variant="outlined" color="error"
                            onClick={() => handleRejectApplication(app)}
                            sx={{
                              borderRadius: 3,
                              textTransform: 'none',
                              fontWeight: 1000,
                              minWidth: 90,
                              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                              '&:hover': { border: '1px solid', color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        ) : (
          <Box sx={{
            py: 12, textAlign: 'center',
            borderRadius: 6,
            bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)',
            border: `1px dashed ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}`
          }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <AssignmentTurnedIn sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
            </Box>
            <Typography variant="h6" fontWeight={1000} color="text.secondary">PROTOCOL QUEUE CLEAR</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.6 }}>Synchronizing with University Mainframe...</Typography>
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
