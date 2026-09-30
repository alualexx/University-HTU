import React, { useState } from "react";
import {
  Box, Card, Typography, Stack, Switch, Button, CircularProgress,
  useTheme, Tabs, Tab, Divider, Grid, TextField, MenuItem, FormControlLabel
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Security, Settings, SettingsSuggest, Backup, FlashOn, Hub,
  LockClock, Public, AdminPanelSettings, Campaign
} from "@mui/icons-material";

const SystemProtocolsTab = ({
  maintenanceMode,
  toggleMaintenanceMode,
  maintenanceSuccess,
  sessionPersistence,
  ipWhitelisting,
  dbOptimization,
  handleToggleSystemFlag,
  handleHealthExecute,
  setOpenBroadcast,
  glassStyle
}) => {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Core System Protocols</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE GLOBAL INFRASTRUCTURE OVERRIDES, DATA INTEGRITY TASKS, AND TERMINAL SECURITY NODES</Typography>
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
        <Tab icon={<SettingsSuggest sx={{ fontSize: 20 }} />} iconPosition="start" label="Strategic Overrides" />
        <Tab icon={<Backup sx={{ fontSize: 20 }} />} iconPosition="start" label="Data Governance" />
        <Tab icon={<AdminPanelSettings sx={{ fontSize: 20 }} />} iconPosition="start" label="Terminal Config" />
      </Tabs>

      {subTab === 0 && (
        <Stack spacing={3}>
          <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={1000} color="error.main">MAINTENANCE_MODE_ALPHA</Typography>
                <Typography variant="body2" color="text.secondary">Intercept all external traffic and display localized maintenance intercept. Admins retain access.</Typography>
              </Box>
              <Switch color="error" checked={maintenanceMode} onChange={(e) => toggleMaintenanceMode(e.target.checked)} />
            </Box>
            {maintenanceSuccess && <Typography variant="caption" color="success.main" fontWeight={1000} sx={{ mt: 2, display: 'block' }}>{maintenanceSuccess}</Typography>}
          </Card>

          <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={1000} color="primary.main">GLOBAL_DISPATCH_BANNER</Typography>
                <Typography variant="body2" color="text.secondary">Deploy persistent high-priority alerts to all active system terminals (Student, Faculty, Admin).</Typography>
              </Box>
              <Button variant="contained" startIcon={<Campaign />} onClick={() => setOpenBroadcast(true)} sx={{ borderRadius: 3, fontWeight: 900 }}>Launch Comms</Button>
            </Box>
          </Card>
        </Stack>
      )}

      {subTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Firestore Index Optimization</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Triggers a global re-indexing task to improve complex query latency by up to 40%.</Typography>
              <Button
                fullWidth variant="outlined" startIcon={<FlashOn />} disabled={dbOptimization}
                onClick={() => handleHealthExecute("DB_OPTIMIZATION")}
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}
              >
                {dbOptimization ? <CircularProgress size={20} /> : "Trigger Cold Query Sync"}
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Manual Data Snapshot</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Perform an immediate immutable backup of the central database clusters to secure cloud storage.</Typography>
              <Button fullWidth variant="contained" color="success" startIcon={<Backup />} sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}>Execute Vault Snapshot</Button>
            </Card>
          </Grid>
        </Grid>
      )}

      {subTab === 2 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Typography variant="h6" fontWeight={1000} gutterBottom>Terminal Persistence & Safety</Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={1000}>Extended Session Persistence</Typography>
                    <Typography variant="caption" color="text.secondary">Extend session duration to 72H for verified IPs.</Typography>
                  </Box>
                  <Switch checked={sessionPersistence} onChange={(e) => handleToggleSystemFlag("SESSION_PERSISTENCE", null, e.target.checked)} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={1000}>IP Whitelist Enforcement</Typography>
                    <Typography variant="caption" color="text.secondary">Strictly block all non-provisioned network nodes.</Typography>
                  </Box>
                  <Switch checked={ipWhitelisting} onChange={(e) => handleToggleSystemFlag("IP_WHITELIST", null, e.target.checked)} />
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Default Terminal TTL" select defaultValue="8h" size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <MenuItem value="1h">1 Hour (High Security)</MenuItem>
                <MenuItem value="8h">8 Hours (Standard)</MenuItem>
                <MenuItem value="24h">24 Hours (Flexible)</MenuItem>
              </TextField>
              <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }}>Audit Terminal Credentials</Button>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default SystemProtocolsTab;
