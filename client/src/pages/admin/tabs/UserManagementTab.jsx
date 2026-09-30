import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Card, Typography, Stack, TextField, Button, Avatar, Chip, Tooltip, IconButton,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useTheme,
  Tabs, Tab, Divider, Grid, CircularProgress, Snackbar, Alert
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Search, PersonAdd, CheckCircle, Block, LockReset, Password, Delete,
  CloudUpload, Security as SecurityIcon, History, ExitToApp, Group, Warning
} from "@mui/icons-material";
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../services/Firebase";

const UserManagementTab = ({
  usersList,
  userSearch,
  setUserSearch,
  handleOpenDialog,
  handleToggleUserActive,
  handleDirectPasswordReset,
  handleManualCredentialReset,
  handleDeleteUser,
  glassStyle
}) => {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const filteredUsers = (usersList || []).filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "sessions"), orderBy("createdAt", "desc")));
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      // Sessions collection may not exist yet — fall back gracefully
      console.warn("Sessions fetch:", err.message);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subTab === 3) fetchSessions();
  }, [subTab, fetchSessions]);

  const handleForceLogout = async (sess) => {
    if (!window.confirm(`Force logout ${sess.email || sess.user}?`)) return;
    try {
      await deleteDoc(doc(db, "sessions", sess.id));
      showSnack(`Session for ${sess.email || sess.user} terminated.`);
      setSessions(prev => prev.filter(s => s.id !== sess.id));
    } catch (err) {
      showSnack(`Failed to terminate session: ${err.message}`, "error");
    }
  };

  const timeSince = (ts) => {
    if (!ts) return "Unknown";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Identity & Access Management</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE USER LIFECYCLE, ROLE PERMISSIONS, AND OPERATIONAL SESSIONS</Typography>
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
        <Tab icon={<Group sx={{ fontSize: 20 }} />} iconPosition="start" label="Identity Directory" />
        <Tab icon={<CloudUpload sx={{ fontSize: 20 }} />} iconPosition="start" label="Bulk Ingestion" />
        <Tab icon={<SecurityIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Role Matrix" />
        <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Session Control" />
      </Tabs>

      {subTab === 0 && (
        <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={900}>Identity Directory</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>Managing {(usersList || []).length} Registered Entities</Typography>
            </Box>
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <TextField
                placeholder="Search identity..." size="small" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' } }}
                InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
              />
              <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenDialog} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3 }}>Deploy User</Button>
            </Stack>
          </Box>

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Operational Identity", "Classification", "Access Status", "Protocol Date", "Command"].map((h) => (
                    <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((row) => (
                  <TableRow key={row._id || row.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{
                          width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main',
                          fontWeight: 900, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.05)'
                        }}>
                          {row.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={900}>{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>{row.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                      <Chip
                        label={row.role} size="small"
                        sx={{
                          fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem',
                          borderRadius: 1.5,
                          bgcolor: alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.1),
                          color: row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981',
                          border: `1px solid ${alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.2)}`
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{
                          width: 8, height: 8, borderRadius: "50%",
                          bgcolor: row.disabled ? "#ef4444" : "#10b981",
                          boxShadow: `0 0 10px ${row.disabled ? '#ef4444' : '#10b981'}`
                        }} />
                        <Typography variant="caption" fontWeight={900} color={row.disabled ? "error" : "success"}>
                          {row.disabled ? "REVOKED" : "VERIFIED"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '---'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title={row.disabled ? "Grant Access" : "Revoke Access"}>
                          <IconButton size="small" onClick={() => handleToggleUserActive(row._id || row.id, row.disabled)} sx={{ color: row.disabled ? "success.main" : "warning.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            {row.disabled ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email Reset Link">
                          <IconButton size="small" onClick={() => handleDirectPasswordReset(row.email, row.name)} sx={{ color: "primary.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <LockReset fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manual Override (Custom Pass)">
                          <IconButton size="small" onClick={() => handleManualCredentialReset(row.email, row.name)} sx={{ color: "info.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Password fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Emergency Purge">
                          <IconButton size="small" onClick={() => handleDeleteUser(row._id || row.id)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {subTab === 1 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, textAlign: 'center' }}>
          <Box sx={{ py: 6 }}>
            <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" fontWeight={900}>Bulk User Ingestion</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Upload a CSV file containing user datasets to provision multiple identities simultaneously.</Typography>
            <Box sx={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 4, p: 8, mb: 4 }}>
              <Button variant="outlined" component="label" sx={{ borderRadius: 3, fontWeight: 900, borderStyle: 'dashed' }}>
                Select CSV Source Matrix
                <input type="file" hidden accept=".csv" />
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>REQUIRED FIELDS: Full Name, Email, Role, Department</Typography>
          </Box>
        </Card>
      )}

      {subTab === 2 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Typography variant="h6" fontWeight={900} gutterBottom>Role Permission Matrix</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ mb: 4, display: 'block' }}>DEFINE GRANULAR ACCESS PROTOCOLS FOR EACH SYSTEM PERSONA</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 1000 }}>Capability</TableCell>
                  {['Student', 'Teacher', 'Registrar', 'Dean', 'Admin'].map(r => (
                    <TableCell key={r} align="center" sx={{ fontWeight: 1000, color: 'primary.main' }}>{r}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  "Access Academic Records", "Submit Grades", "Modify University Structure",
                  "Approve Applications", "Manage Finances", "System Configuration"
                ].map((cap, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 800 }}>{cap}</TableCell>
                    {[0, 1, 2, 3, 4].map(col => (
                      <TableCell key={col} align="center">
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', mx: 'auto', bgcolor: (col >= 4 - i) ? '#10b981' : alpha('#ef4444', 0.2) }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {subTab === 3 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>Live Session Control</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MONITOR ACTIVE ACCESS NODES AND ENFORCE SECURITY OVERRIDES</Typography>
              </Box>
              <Button variant="outlined" size="small" onClick={fetchSessions} sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}>Refresh</Button>
            </Box>

            {sessionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            ) : sessions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, opacity: 0.4 }}>
                <Warning sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" fontWeight={900}>No Active Sessions</Typography>
                <Typography variant="body2">All nodes are offline or the sessions collection is empty.</Typography>
              </Box>
            ) : (
              sessions.map((sess) => (
                <Card key={sess.id} sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, p: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}><History /></Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={900}>
                          {sess.email || sess.user || 'Unknown User'}{' '}
                          <Chip label={sess.role || 'user'} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900 }} />
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          {sess.device || sess.userAgent || 'Unknown Device'}{' '}·{' '}
                          IP: {sess.ip || sess.ipAddress || '—'}{' '}·{' '}
                          {timeSince(sess.createdAt || sess.loginTime)}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined" color="error" size="small"
                      startIcon={<ExitToApp />}
                      sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}
                      onClick={() => handleForceLogout(sess)}
                    >
                      Force Logout
                    </Button>
                  </Box>
                </Card>
              ))
            )}
          </Stack>
        </Card>
      )}

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagementTab;
