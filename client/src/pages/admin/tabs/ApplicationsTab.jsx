import React from "react";
import {
  Box, Card, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AssignmentTurnedIn, Warning
} from "@mui/icons-material";

const ApplicationsTab = ({
  applications,
  handleReviewApplication,
  handleRejectApplication,
  clearanceStudents = [],
  handleDeactivateStudent,
  glassStyle
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Admissions Protocol Queue</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>Verification of college-level administrative candidates.</Typography>
          </Box>
          <Chip label={`${applications.length} PENDING`} color="warning" size="small" sx={{ fontWeight: 1000, borderRadius: 1 }} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Candidate Identity", "Source Institution", "Clearance Status", "Action Protocol"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? applications.map((app, i) => (
                <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ p: 3 }}>
                    <Typography variant="body2" fontWeight={900}>{app.name}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{app.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={800}>{app.college}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Role: {app.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.status?.toUpperCase() || "PENDING_REVIEW"} size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                        fontWeight: 1000, borderRadius: 1.5, fontSize: '0.65rem', border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained" size="small" color="primary"
                      onClick={() => handleReviewApplication(app)}
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 1000, px: 2 }}
                    >
                      Authenticate
                    </Button>
                    {handleRejectApplication && (
                      <Button
                        variant="outlined" size="small" color="error"
                        onClick={() => handleRejectApplication(app)}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 1000, px: 2 }}
                      >
                        Reject
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <AssignmentTurnedIn sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                    <Typography color="text.secondary" fontWeight={800}>Clearance Queue Clear</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Student Clearance Queue */}
      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden", mt: 3 }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Student Clearance Queue</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>Manage account deactivation for students on leave, suspended, graduated, or withdrawn.</Typography>
          </Box>
          <Chip label={`${clearanceStudents.length} PENDING`} color="error" size="small" sx={{ fontWeight: 1000, borderRadius: 1 }} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Student Identity", "Department / Role", "Clearance Status", "Action Protocol"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clearanceStudents.length > 0 ? clearanceStudents.map((student, i) => (
                <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ p: 3 }}>
                    <Typography variant="body2" fontWeight={900}>{student.name}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{student.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={800}>{student.department || "N/A"}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Role: {student.role?.toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.status?.toUpperCase() || "UNKNOWN"} size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                        fontWeight: 1000, borderRadius: 1.5, fontSize: '0.65rem', border: '1px solid rgba(244, 63, 94, 0.2)'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained" size="small" color="error"
                      onClick={() => handleDeactivateStudent && handleDeactivateStudent(student)}
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 1000, px: 3 }}
                    >
                      Deactivate Account
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <AssignmentTurnedIn sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                    <Typography color="text.secondary" fontWeight={800}>Clearance Queue Clear</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      
      <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <Warning color="info" sx={{ fontSize: 20 }} />
        <Typography variant="caption" color="info.main" fontWeight={800}>CRITICAL: All administrative candidates must pass biometric verification before final provisioning.</Typography>
      </Box>
    </Box>
  );
};

export default ApplicationsTab;
