import React from "react";
import {
  Box, Grid, Card, Typography, Chip, Stack, Button, CircularProgress, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Memory as MemoryIcon, CloudQueue, Router as NetworkIcon, Speed, Storage, Security
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer
} from "recharts";

const SystemHealthTab = ({
  healthData,
  healthExecuting,
  handleHealthExecute,
  glassStyle
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: "CPU OPTIMIZATION", value: `${healthData[healthData.length - 1]?.cpu}%`, icon: <MemoryIcon />, color: "#3b82f6", detail: "4 Cores active" },
          { label: "MEMORY CAPACITY", value: `${healthData[healthData.length - 1]?.memory}%`, icon: <CloudQueue />, color: "#8b5cf6", detail: "3.2GB / 8GB" },
          { label: "NETWORK LATENCY", value: "84ms", icon: <NetworkIcon />, color: "#10b981", detail: "STABLE" },
          { label: "INSTANCE UPTIME", value: "114d 6h", icon: <Speed />, color: "#f59e0b", detail: "NO REBOOTS" },
        ].map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: alpha(m.color, 0.1), color: m.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {m.icon}
                </Box>
                <Chip label="LIVE" size="small" sx={{ height: 20, bgcolor: alpha(m.color, 0.1), color: m.color, fontSize: 10, fontWeight: 900, borderRadius: 1 }} />
              </Box>
              <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1, mb: 1 }}>{m.value}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1.5, display: 'block' }}>{m.label}</Typography>
              <Typography variant="caption" sx={{ color: m.color, fontWeight: 900, fontSize: '0.65rem', mt: 1, display: 'block' }}>{m.detail}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Advanced Troubleshooting Suite */}
      <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" fontWeight={900}>Troubleshooting Protocol</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>Emergency System Maintenance & Cache Control</Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {[
              { label: "Clear System Cache", desc: "Flush global application data and re-initialize CDN edge nodes.", icon: <Storage />, color: "primary" },
              { label: "Reset Static Assets", desc: "Force re-deployment of static resources and media blobs.", icon: <CloudQueue />, color: "info" },
              { label: "Audit DB Indices", desc: "Scan Firestore collections for missing composite indices.", icon: <Security />, color: "warning" },
              { label: "Force System Sync", desc: "Re-synchronize all active client sessions with global state.", icon: <Speed />, color: "success" }
            ].map((tool, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{
                  p: 3, borderRadius: 4, height: '100%',
                  bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                  transition: '0.3s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.04)' }
                }}>
                  <Box sx={{ color: `${tool.color}.main`, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tool.icon}
                    <Typography variant="subtitle2" fontWeight={900}>{tool.label}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, height: 40, overflow: 'hidden' }}>{tool.desc}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    color={tool.color}
                    disabled={healthExecuting !== null}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 1000, mt: 'auto' }}
                    onClick={() => handleHealthExecute(tool.label)}
                  >
                    {healthExecuting === tool.label ? <CircularProgress size={16} color="inherit" /> : "Execute"}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Tactical Resource Performance</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>Full-cycle infrastructure telemetrics</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip label="CPU UTILIZATION" size="small" sx={{ fontWeight: 900, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6', borderRadius: 1.5 }} />
            <Chip label="MEMORY ALLOCATION" size="small" sx={{ fontWeight: 900, bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6', borderRadius: 1.5 }} />
          </Box>
        </Box>
        <Box sx={{ p: 4, height: 440 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthData}>
              <defs>
                <linearGradient id="colorCpu2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMem2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis hide domain={[0, 100]} />
              <ChartTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCpu2)" />
              <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorMem2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
};

export default SystemHealthTab;
