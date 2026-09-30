import React, { useState } from "react";
import {
  Box, Card, Typography, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Avatar, Chip, Stack, Tooltip, IconButton,
  useTheme, Tabs, Tab, Button, TextField, Divider, Grid
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Person, CheckCircle, Block, Password, History, VpnKey,
  TrendingUp, Security, VerifiedUser, FlashOn
} from "@mui/icons-material";

const PasswordResetsTab = ({
  passwordResetsList = [],
  handleApproveReset,
  handleManualCredentialReset,
  handleRejectReset,
  glassStyle
}) => {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Emergency Credential Recovery</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE PASSWORDS RESETS, GENERATE TEMPORARY ACCESS TOKENS, AND MONITOR SECURE RECOVERY TRENDS</Typography>
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
        <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Request Queue" />
        <Tab icon={<VpnKey sx={{ fontSize: 20 }} />} iconPosition="start" label="Emergency Tokens" />
        <Tab icon={<TrendingUp sx={{ fontSize: 20 }} />} iconPosition="start" label="Recovery Analytics" />
      </Tabs>

      {subTab === 0 && (
        <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
          <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={900}>Pending Recovery Requests</Typography>
            <Chip label={`${passwordResetsList.filter(r => r.status === "pending").length} PENDING`} color="warning" sx={{ fontWeight: 900 }} />
          </Box>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["User Identity", "Role", "Timestamp", "Status", "Manual Control"].map((h) => (
                    <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {passwordResetsList.map((req, i) => (
                  <TableRow key={i} sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                    <TableCell sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900 }}>
                          {req.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={900}>{req.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{req.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 3 }}>
                      <Chip label={req.role?.toUpperCase()} size="small" sx={{ fontWeight: 1000, fontSize: '0.6rem' }} />
                    </TableCell>
                    <TableCell sx={{ p: 3 }}>
                      <Typography variant="caption" fontWeight={800}>{req.requestedAt?.toDate()?.toLocaleString() || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status?.toUpperCase()} size="small"
                        color={req.status === 'approved' ? 'success' : 'warning'}
                        sx={{ fontWeight: 1000, fontSize: '0.6rem' }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ p: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => handleApproveReset(req)} sx={{ color: 'success.main' }}><CheckCircle /></IconButton>
                        <IconButton size="small" onClick={() => handleManualCredentialReset(req.email, req.name)} sx={{ color: 'primary.main' }}><Password /></IconButton>
                        <IconButton size="small" onClick={() => handleRejectReset(req)} sx={{ color: 'error.main' }}><Block /></IconButton>
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Typography variant="h6" fontWeight={900} gutterBottom>Temporary Bypass Key Generation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Generate emergency single-use tokens for high-level administrative access during credential loss.</Typography>
              <Stack spacing={3}>
                <TextField fullWidth label="Reference Identity" placeholder="Enter user email or ID..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth select label="Token Expiry" defaultValue="1h" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      <MenuItem value="1h">1 Hour</MenuItem>
                      <MenuItem value="4h">4 Hours</MenuItem>
                      <MenuItem value="24h">24 Hours</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth select label="Security Tier" defaultValue="Standard" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      <MenuItem value="Standard">Standard (OTP)</MenuItem>
                      <MenuItem value="Admin">Admin (Multi-Point)</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Button fullWidth variant="contained" startIcon={<FlashOn />} sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}>Generate Emergency Key</Button>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), p: 4, borderRadius: 5, border: '1px dashed rgba(245,158,11,0.3)' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Security color="warning" />
                <Typography variant="subtitle2" fontWeight={1000} color="warning.main">BYPASS_PROTOCOL_NOTICE</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ lineHeight: 1.6 }}>
                Generating an emergency token bypasses standard MFA for 120 seconds. This action is logged with CRITICAL severity in the audit trail.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {subTab === 2 && (
        <Grid container spacing={3}>
          {[
            { label: 'Weekly Reset Volume', val: 142, trend: '+4%', icon: <History /> },
            { label: 'Avg Recovery Time', val: '12 min', trend: '-2 min', icon: <FlashOn /> },
            { label: 'Successful Validations', val: '98.2%', trend: '+0.4%', icon: <VerifiedUser /> },
            { label: 'Blocked Fraudulent', val: 14, trend: '+2', icon: <Block /> },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, textAlign: 'center' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, mx: 'auto', mb: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</Box>
                <Typography variant="caption" color="text.secondary" fontWeight={1000}>{stat.label.toUpperCase()}</Typography>
                <Typography variant="h5" fontWeight={1000} sx={{ my: 0.5 }}>{stat.val}</Typography>
                <Typography variant="caption" fontWeight={900} color="success.main">{stat.trend} VS LW</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PasswordResetsTab;
