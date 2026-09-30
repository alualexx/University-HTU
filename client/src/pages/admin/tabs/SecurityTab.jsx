import React, { useState } from "react";
import {
  Box, Typography, Grid, Card, LinearProgress, Stack, Chip, Button,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Tooltip, IconButton, useTheme, Tabs, Tab, Switch, FormControlLabel,
  TextField, InputAdornment, Divider, Slider, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Shield, GppGood, Warning, ManageAccounts, Refresh, Visibility,
  ReportProblem, Terminal, History, SecurityOutlined, Lan, Lock,
  VpnKey, Public, Block, FiberManualRecord, Add, Close
} from "@mui/icons-material";

const SecurityTab = ({
  threatLogs = [],
  securityScore = 100,
  criticalLast24h = 0,
  glassStyle,
  handleRunHealthCheck,
}) => {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const [ipNodes, setIpNodes] = useState([
    { ip: "192.168.1.1", label: "Primary Campus Gateway", status: "Whitelisted" },
    { ip: "10.0.0.8", label: "Admin Command Center", status: "Whitelisted" },
    { ip: "172.16.0.42", label: "Remote VPN Node", status: "Temporary" },
  ]);
  const [addIpDialog, setAddIpDialog] = useState(false);
  const [newIpForm, setNewIpForm] = useState({ ip: "", label: "", status: "Whitelisted" });

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const handleBlockIp = (idx) => {
    if (!window.confirm(`Block ${ipNodes[idx].ip}?`)) return;
    setIpNodes(prev => prev.filter((_, i) => i !== idx));
    showSnack(`IP ${ipNodes[idx].ip} blocked and removed from whitelist.`);
  };

  const handleAddIp = () => {
    if (!newIpForm.ip) return showSnack("IP address is required.", "warning");
    setIpNodes(prev => [...prev, { ...newIpForm }]);
    setAddIpDialog(false);
    setNewIpForm({ ip: "", label: "", status: "Whitelisted" });
    showSnack(`IP ${newIpForm.ip} added to whitelist.`);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Tactical Security & Defense Intelligence</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE REAL-TIME THREAT MITIGATION, MFA ENFORCEMENT, AND NETWORK ORCHESTRATION</Typography>
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
        <Tab icon={<Terminal sx={{ fontSize: 20 }} />} iconPosition="start" label="Tactical Monitoring" />
        <Tab icon={<VpnKey sx={{ fontSize: 20 }} />} iconPosition="start" label="Access Protocols" />
        <Tab icon={<Lan sx={{ fontSize: 20 }} />} iconPosition="start" label="Network Infrastructure" />
      </Tabs>

      {subTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={1000}>System Defense Posture</Typography>
                <Chip icon={<FiberManualRecord sx={{ fontSize: 10, animation: 'pulse 2s infinite' }} />} label="LIVE_FEED" color="success" size="small" sx={{ fontWeight: 900 }} />
              </Box>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ width: 140, height: 140, borderRadius: '50%', mx: 'auto', border: '5px solid', borderColor: alpha(theme.palette.success.main, 0.2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h3" fontWeight={1000} color="success.main">{securityScore}</Typography>
                    <Typography variant="caption" fontWeight={900}>SCORE</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Stack spacing={2}>
                    {['Encryption (AES-256)', 'Firewall Integrity', 'Access Control (MFA)'].map((label, i) => (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" fontWeight={900}>{label.toUpperCase()}</Typography>
                          <Typography variant="caption" fontWeight={1000}>100%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3 }} />
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <Divider sx={{ my: 4, opacity: 0.1 }} />
              <Typography variant="subtitle2" fontWeight={1000} gutterBottom>Real-time Threat Intelligence</Typography>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader>
                  <TableBody>
                    {threatLogs.map((log, i) => (
                      <TableRow key={i} sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="caption" fontWeight={900} sx={{ fontFamily: 'monospace' }}>
                            {log.timestamp || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Chip label={log.severity} size="small" color={log.severity === 'CRITICAL' ? 'error' : 'warning'} sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="body2" fontWeight={700}>{log.event}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Button fullWidth variant="contained" startIcon={<Refresh />} onClick={() => { handleRunHealthCheck(); showSnack("Global audit triggered. Report will be ready shortly.", "info"); }} sx={{ py: 2, borderRadius: 4, fontWeight: 1000 }}>TRIGGER GLOBAL AUDIT</Button>
              <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, border: '1px solid rgba(255,75,75,0.2)' }}>
                <Typography variant="subtitle2" fontWeight={1000} gutterBottom>Critical Vectors</Typography>
                <Typography variant="h3" fontWeight={1000} color="error.main">{String(criticalLast24h).padStart(2, '0')}</Typography>
                <Typography variant="caption" fontWeight={800} color="text.secondary">INFILTRATION ATTEMPTS (24H)</Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}

      {subTab === 1 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Typography variant="h6" fontWeight={1000} gutterBottom>Identity Access Protocols</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Configure MFA requirements, session TTL, and password complexity across roles.</Typography>
          <Grid container spacing={4}>
            {['Admin', 'Dean', 'Registrar', 'Teacher', 'Student'].map((role, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={1000}>{role} Access Node</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>MFA_ENFORCED • SESSION_8H</Typography>
                  </Box>
                  <FormControlLabel control={<Switch defaultChecked={i < 3} />} label={<Typography variant="caption" fontWeight={1000}>ENFORCE MFA</Typography>} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {subTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" fontWeight={1000}>Network Ingress Rules</Typography>
                <Button variant="outlined" startIcon={<Add />} onClick={() => setAddIpDialog(true)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add IP Node</Button>
              </Box>
              <Stack spacing={2}>
                {ipNodes.map((node, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.03), borderRadius: 3 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={1000} sx={{ fontFamily: "monospace" }}>{node.ip}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>{node.label.toUpperCase()}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip label={node.status} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem" }} />
                      <Tooltip title="Block IP"><IconButton size="small" color="error" onClick={() => handleBlockIp(i)}><Block fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, height: '100%' }}>
              <Typography variant="h6" fontWeight={1000} gutterBottom>Firewall Orchestration</Typography>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant="body2" fontWeight={900}>Enable Brute-Force Shield</Typography>} />
                <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant="body2" fontWeight={900}>DDoS Mitigation Level 4</Typography>} />
                <Divider sx={{ opacity: 0.1 }} />
                <Typography variant="caption" fontWeight={800} color="text.secondary">GLOBAL_THREAT_THRESHOLD</Typography>
                <Slider defaultValue={80} step={10} marks min={0} max={100} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add IP Dialog */}
      <Dialog open={addIpDialog} onClose={() => setAddIpDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
        <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
          Add IP Node
          <IconButton onClick={() => setAddIpDialog(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="IP Address" value={newIpForm.ip} onChange={e => setNewIpForm({ ...newIpForm, ip: e.target.value })} placeholder="e.g. 10.0.0.25" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, fontFamily: "monospace" } }} />
            <TextField fullWidth label="Label / Description" value={newIpForm.label} onChange={e => setNewIpForm({ ...newIpForm, label: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
            <TextField select fullWidth label="Status" value={newIpForm.status} onChange={e => setNewIpForm({ ...newIpForm, status: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
              <MenuItem value="Whitelisted">Whitelisted</MenuItem>
              <MenuItem value="Temporary">Temporary</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddIpDialog(false)} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddIp} sx={{ borderRadius: 2, fontWeight: 900 }}>Add Node</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SecurityTab;

