import React from "react";
import {
  Box, Typography, Grid, Card, LinearProgress, Stack, Chip, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Tooltip, IconButton, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Shield, GppGood, Warning, Error as ErrorIcon, ManageAccounts, Refresh, Visibility, ReportProblem, Terminal, History, SecurityOutlined
} from "@mui/icons-material";

const SecurityTab = ({
  threatLogs,
  securityScore,
  securityAlerts,
  criticalLast24h = 0,
  gradients,
  neonColors,
  glassStyle,
  handleRunHealthCheck,
  handleGenerateSecurityReport
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Main Security Status */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...glassStyle, borderRadius: 6, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000}>System Defense Posture</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                  REAL-TIME THREAT MITIGATION ENGINE
                </Typography>
              </Box>
              <Chip
                icon={<GppGood />}
                label="ACTIVE DEFENSE"
                color="success"
                sx={{ fontWeight: 900, borderRadius: 2 }}
              />
            </Box>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <Box sx={{
                    position: 'absolute', inset: -10, borderRadius: '50%',
                    background: `conic-gradient(${theme.palette.success.main} ${securityScore}%, transparent 0)`,
                    opacity: 0.1, filter: 'blur(8px)'
                  }} />
                  <Box sx={{
                    width: 140, height: 140, borderRadius: '50%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: `4px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    bgcolor: 'rgba(255,255,255,0.03)'
                  }}>
                    <Typography variant="h3" fontWeight={1000} color="success.main">{securityScore}</Typography>
                    <Typography variant="caption" fontWeight={900} color="text.secondary">SCORE</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Stack spacing={2.5}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={900}>ENCRYPTION STRENGTH</Typography>
                      <Typography variant="caption" fontWeight={900}>AES-256-GCM</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={900}>FIREWALL INTEGRITY</Typography>
                      <Typography variant="caption" fontWeight={900}>98.2%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={98} color="primary" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" fontWeight={900}>ACCESS CONTROL</Typography>
                      <Typography variant="caption" fontWeight={900}>MFA ENFORCED</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Action Center */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Button
              fullWidth variant="contained" startIcon={<Refresh />}
              onClick={handleRunHealthCheck}
              sx={{ py: 2, borderRadius: 4, fontWeight: 1000, background: gradients[1], boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
            >
              RUN SECURITY AUDIT
            </Button>
            <Button
              fullWidth variant="outlined" startIcon={<History />}
              onClick={handleGenerateSecurityReport}
              sx={{ py: 2, borderRadius: 4, fontWeight: 1000, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              GENERATE REPORT
            </Button>
            <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" fontWeight={900} gutterBottom>Critical Incidents</Typography>
              <Typography variant="h3" fontWeight={1000} color={criticalLast24h > 0 ? "error.main" : "success.main"}>
                {String(criticalLast24h).padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>PAST 24 HOURS</Typography>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Threat Intelligence Table */}
      <Card sx={{ ...glassStyle, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Terminal color="primary" />
            <Typography variant="h6" fontWeight={900}>Threat Intelligence Log</Typography>
          </Box>
          <Chip label="Real-time Feed" size="small" variant="outlined" sx={{ fontWeight: 900, borderStyle: 'dashed' }} />
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Timestamp", "Severity", "Event", "User", "Source IP", "Action"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {threatLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 700 }}>
                    No security events recorded yet.
                  </TableCell>
                </TableRow>
              ) : threatLogs.map((log) => (
                <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="caption" fontWeight={900} sx={{ fontFamily: 'monospace' }}>{log.timestamp}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={log.severity} size="small"
                      color={log.severity === 'CRITICAL' ? 'error' : log.severity === 'HIGH' ? 'warning' : 'info'}
                      sx={{ fontWeight: 900, fontSize: '0.65rem', height: 20, borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="body2" fontWeight={800}>{log.event}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="caption" fontWeight={900} sx={{ fontFamily: 'monospace' }}>{log.user}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="caption" fontWeight={900} sx={{ fontFamily: 'monospace', bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.5, borderRadius: 1 }}>{log.source}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip label={log.action} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default SecurityTab;
