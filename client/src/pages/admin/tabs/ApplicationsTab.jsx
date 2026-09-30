import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Chip, Button, useTheme, Avatar, Stack, Fade,
  TextField, InputAdornment, Table, TableBody, TableCell, CircularProgress,
  TableContainer, TableHead, TableRow, Tooltip, Tabs, Tab, Divider, Grid, Card, Snackbar, Alert
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AssignmentTurnedIn, VerifiedUser, School as SchoolIcon,
  Search, CheckCircle, GroupAdd, DocumentScanner, History
} from "@mui/icons-material";
import { enrollmentsAPI, applicationsAPI } from "../../../services/api";

const ApplicationsTab = ({
  applications = [],
  handleReviewApplication,
  handleRejectApplication,
  clearanceStudents = [],
  handleDeactivateStudent,
  glassStyle
}) => {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);
  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const fetchEnrollments = useCallback(async () => {
    setEnrollLoading(true);
    try {
      const res = await enrollmentsAPI.getAll();
      setEnrollments(res.data || []);
    } catch { /* ignore */ }
    finally { setEnrollLoading(false); }
  }, []);

  useEffect(() => {
    if (subTab === 1) fetchEnrollments();
  }, [subTab, fetchEnrollments]);

  const filteredApps = applications.filter(app =>
    app.name?.toLowerCase().includes(search.toLowerCase()) ||
    app.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Group enrollments by semester/batch
  const batches = enrollments.reduce((acc, e) => {
    const key = e.semester || e.batch || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const handleFinalizeEnrollment = async (batchKey) => {
    if (!window.confirm(`Finalize enrollment for ${batchKey}? This locks the batch.`)) return;
    try {
      const batchItems = batches[batchKey] || [];
      await Promise.all(batchItems.map(e => enrollmentsAPI.update(e._id || e.id, { status: "finalized" })));
      showSnack(`Batch ${batchKey} finalized (${batchItems.length} students).`);
      fetchEnrollments();
    } catch (err) {
      showSnack(err.response?.data?.message || "Failed to finalize batch.", "error");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Operational Governance & Admissions</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>ORCHESTRATE STUDENT LIFECYCLES, DOCUMENT VERIFICATION, AND ENROLLMENT COHORTS</Typography>
      </Box>

      <Tabs
        value={subTab}
        onChange={(_, v) => setSubTab(v)}
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
          '& .MuiTab-root': { fontWeight: 900, textTransform: 'none', fontSize: '0.9rem' }
        }}
      >
        <Tab icon={<DocumentScanner sx={{ fontSize: 20 }} />} iconPosition="start" label="Admissions Dashboard" />
        <Tab icon={<GroupAdd sx={{ fontSize: 20 }} />} iconPosition="start" label="Enrollment Orchestration" />
        <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Clearance Archive" />
      </Tabs>

      {subTab === 0 && (
        <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={900}>Admissions Queue</Typography>
            <TextField
              placeholder="Search candidates..." size="small" value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
            />
          </Box>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Candidate", "Program/Major", "Documents", "Status", "Actions"].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApps.map((app, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>{app.name?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={900}>{app.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{app.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{app.intendedMajor || "Undeclared"}</TableCell>
                    <TableCell>
                      <Chip label="Verified" size="small" icon={<VerifiedUser sx={{ fontSize: 12 }} />} sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status?.toUpperCase()} size="small"
                        sx={{
                          fontWeight: 900, fontSize: '0.6rem',
                          bgcolor: alpha(app.status === 'registrar_approved' ? '#f59e0b' : '#10b981', 0.1),
                          color: app.status === 'registrar_approved' ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {app.status === 'registrar_approved' ? (
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="contained" onClick={() => handleReviewApplication(app)} sx={{ borderRadius: 2, fontWeight: 900 }}>Authenticate</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleRejectApplication(app)} sx={{ borderRadius: 2, fontWeight: 900 }}>Reject</Button>
                        </Stack>
                      ) : (
                        <Typography variant="caption" fontWeight={1000} color="text.disabled">PROVISIONED</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {subTab === 1 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={900}>Batch Enrollment Orchestrator</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Organize provisioned candidates into operational cohorts and finalize enrollment batches.</Typography>
            </Box>
            <Button variant="outlined" size="small" onClick={fetchEnrollments} sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Refresh</Button>
          </Box>
          {enrollLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>
          ) : Object.keys(batches).length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8, opacity: 0.4 }}>
              <GroupAdd sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={900}>No Enrollment Batches Found</Typography>
              <Typography variant="body2">Enrollments will appear here when students register for courses.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {Object.entries(batches).map(([batchKey, items]) => {
                const finalized = items.filter(e => e.status === "finalized").length;
                return (
                  <Grid item xs={12} md={4} key={batchKey}>
                    <Card sx={{ bgcolor: "rgba(255,255,255,0.02)", p: 3, borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <Typography variant="subtitle2" fontWeight={1000} color="primary.main" noWrap>{batchKey.toUpperCase()}</Typography>
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" fontWeight={800}>Total Students</Typography><Typography variant="caption" fontWeight={1000}>{items.length}</Typography></Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" fontWeight={800}>Finalized</Typography><Typography variant="caption" fontWeight={1000} color="success.main">{finalized}</Typography></Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" fontWeight={800}>Pending</Typography><Typography variant="caption" fontWeight={1000} color="warning.main">{items.length - finalized}</Typography></Box>
                        <Divider sx={{ opacity: 0.1 }} />
                        <Button fullWidth variant="outlined" sx={{ borderRadius: 2, fontWeight: 900 }} onClick={() => handleFinalizeEnrollment(batchKey)} disabled={finalized === items.length}>
                          {finalized === items.length ? "Batch Finalized" : "Finalize Enrollment"}
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Card>
      )}

      {subTab === 2 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={900}>Student Clearance & Archive</Typography>
            <Chip label={`${clearanceStudents.length} PENDING DEACTIVATION`} color="error" sx={{ fontWeight: 900 }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Student Entity", "Clearance Status", "Protocol"].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {clearanceStudents.map((student, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>{student.name?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={900}>{student.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={student.status?.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }} />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" size="small" onClick={() => handleDeactivateStudent(student)} sx={{ borderRadius: 2, fontWeight: 900 }}>Deactivate Account</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

export default ApplicationsTab;

