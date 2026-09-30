import React from "react";
import {
  Box, Grid, Card, Typography, Chip, Stack, Button, CircularProgress,
  useTheme, LinearProgress, Divider, Avatar
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Memory as MemoryIcon, CloudQueue, Router as NetworkIcon, Speed,
  Storage, Security, Speed as UptimeIcon, CheckCircle, Warning,
  Dns, Public
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer
} from "recharts";

const SystemHealthTab = ({
  healthExecuting,
  handleHealthExecute,
  glassStyle,
  serverHealth = {},
  healthData = []
}) => {
  const theme = useTheme();

  const mockTelemetry = [
    { label: "CPU Performance", value: "34%", icon: <Speed />, color: "#3b82f6" },
    { label: "Memory Usage", value: "4.2 GB / 16 GB", icon: <MemoryIcon />, color: "#8b5cf6" },
    { label: "Database Connections", value: "82 Active", icon: <Storage />, color: "#10b981" },
    { label: "Network Ingress", value: "1.2 Gbps", icon: <NetworkIcon />, color: "#f59e0b" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={1000}>Infrastructure Health & Telemetry</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>LIVE MONITORING OF SERVER PERFORMANCE, CONNECTION POOLS, AND NETWORK TOPOLOGY</Typography>
        </Box>
        <Button
          variant="contained" startIcon={healthExecuting ? <CircularProgress size={16} color="inherit" /> : <Speed />}
          onClick={handleHealthExecute} disabled={healthExecuting}
          sx={{ borderRadius: 3, fontWeight: 900 }}
        >
          {healthExecuting ? 'DIAGNOSING...' : 'RUN DEEP DIAGNOSTICS'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockTelemetry.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, border: `1px solid ${alpha(stat.color, 0.1)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, width: 40, height: 40, borderRadius: 2.5 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={1000}>{stat.label.toUpperCase()}</Typography>
                  <Typography variant="h5" fontWeight={1000}>{stat.value}</Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={45} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(stat.color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: stat.color } }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Performance Graph */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...glassStyle, p: 4, borderRadius: 6, height: 400 }}>
            <Typography variant="h6" fontWeight={1000} gutterBottom>Historical Resource Topology</Typography>
            <Box sx={{ height: 320, mt: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <ChartTooltip
                    contentStyle={{ borderRadius: 12, background: 'rgba(15,23,42,0.9)', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorCpu)" strokeWidth={3} />
                  <Area type="monotone" dataKey="ram" stroke="#8b5cf6" fillOpacity={0} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* System Nodes */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, p: 4, borderRadius: 6, height: '100%' }}>
            <Typography variant="h6" fontWeight={1000} gutterBottom>Active Service Nodes</Typography>
            <Stack spacing={3} sx={{ mt: 3 }}>
              {[
                { name: 'API Gateway (Node.JS)', status: 'Operational', ping: '12ms', icon: <Public /> },
                { name: 'Core DB (MongoDB)', status: 'Operational', ping: '4ms', icon: <Storage /> },
                { name: 'Auth Node (LDAP)', status: 'Syncing', ping: '24ms', icon: <Security /> },
                { name: 'Media CDN (AWS)', status: 'Operational', ping: '8ms', icon: <CloudQueue /> },
              ].map((node, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ color: 'text.secondary', opacity: 0.5 }}>{node.icon}</Box>
                    <Box>
                      <Typography variant="body2" fontWeight={1000}>{node.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>{node.ping} LATENCY</Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={node.status.toUpperCase()} size="small"
                    sx={{ fontWeight: 1000, fontSize: '0.6rem', bgcolor: alpha(node.status === 'Operational' ? '#10b981' : '#3b82f6', 0.1), color: node.status === 'Operational' ? '#10b981' : '#3b82f6' }}
                  />
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 4, opacity: 0.1 }} />
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Typography variant="caption" fontWeight={900} color="primary.main">UPTIME_PROJECTION</Typography>
              <Typography variant="h6" fontWeight={1000}>99.982%</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemHealthTab;
