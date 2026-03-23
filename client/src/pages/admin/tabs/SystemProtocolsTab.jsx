import React from "react";
import {
  Box, Card, Typography, Stack, Switch, Button, CircularProgress, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Security, Settings
} from "@mui/icons-material";

const SystemProtocolsTab = ({
  maintenanceMode,
  toggleMaintenanceMode,
  maintenanceSuccess,
  sessionPersistence,
  setSessionPersistence,
  ipWhitelisting,
  setIpWhitelisting,
  dbOptimization,
  setDbOptimization,
  handleToggleSystemFlag,
  handleHealthExecute,
  setOpenBroadcast,
  glassStyle
}) => {
  const theme = useTheme();

  return (
    <Box maxWidth="md">
      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Security sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={900}>Strategic Control Nexus</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 6, fontWeight: 600 }}>Global infrastructure overrides and tactical system flags.</Typography>

          <Stack spacing={4}>
            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="error.main">MAINTENANCE_PROTOCOL_X</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Block all external access points & display static intercept screen.</Typography>
                {maintenanceSuccess && <Typography variant="caption" color="success.main" fontWeight={900} display="block" sx={{ mt: 1 }}>{maintenanceSuccess}</Typography>}
              </Box>
              <Switch color="error" checked={maintenanceMode} onChange={(e) => toggleMaintenanceMode(e.target.checked)} sx={{ '& .MuiSwitch-track': { opacity: 0.3 } }} />
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="primary">GLOBAL_BANNER_ARRAY</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Transmit high-priority tactical alerts to all connected terminals.</Typography>
              </Box>
              <Button variant="contained" color="primary" onClick={() => setOpenBroadcast(true)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}>Deploy Comms</Button>
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="success.main">DATA_SNAPSHOT_VAULT</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Force immutable snapshot of current Firestore state to cold storage.</Typography>
              </Box>
              <Button variant="contained" color="success" onClick={() => handleHealthExecute("DATA_SNAPSHOT_VAULT")} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}>Execute Backup</Button>
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="warning.main">SESSION_PERSISTENCE_LAYER</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Extend login session durations for trusted administrative terminals.</Typography>
              </Box>
              <Switch color="warning" checked={sessionPersistence} onChange={(e) => handleToggleSystemFlag("SESSION_PERSISTENCE", setSessionPersistence, e.target.checked)} />
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="info.main">IP_RESTRICT_WHITELIST</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Strict access restriction based on verified network identity vectors.</Typography>
              </Box>
              <Switch color="info" checked={ipWhitelisting} onChange={(e) => handleToggleSystemFlag("IP_WHITELIST", setIpWhitelisting, e.target.checked)} />
            </Box>

            <Box sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={900} color="primary.main">COLD_QUERY_OPTIMIZATION</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Re-index Firestore collections to improve analytical query performance.</Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                disabled={dbOptimization}
                onClick={() => {
                  setDbOptimization(true);
                  handleToggleSystemFlag("DB_OPTIMIZATION", setDbOptimization, true);
                  setTimeout(() => setDbOptimization(false), 3000);
                }}
                sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}
              >
                {dbOptimization ? <CircularProgress size={20} /> : "Optimize Index"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SystemProtocolsTab;
