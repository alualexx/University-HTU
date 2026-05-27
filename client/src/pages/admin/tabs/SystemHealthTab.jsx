import React from "react";
import {
  Box, Grid, Card, Typography, Chip, Stack, Button, CircularProgress, useTheme, LinearProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Memory as MemoryIcon, CloudQueue, Router as NetworkIcon, Speed, Storage, Security
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

  const cpu = serverHealth.cpu ?? 0;
  const memory = serverHealth.memory ?? 0;
  const uptime = serverHealth.uptime ?? "N/A";
  const memUsedMB = serverHealth.memoryUsedMB ?? 0;
  const memTotalMB = serverHealth.memoryTotalMB ?? 0;
  const heapUsedMB = serverHealth.heapUsedMB ?? 0;
  const platform = serverHealth.platform ?? "—";

  const metrics = [
    {
      label: "CPU UTILIZATION",
      value: `${cpu}%`,
      icon: <MemoryIcon />,
      color: cpu > 80 ? "#ef4444" : cpu > 50 ? "#f59e0b" : "#3b82f6",
      detail: `${serverHealth.nodeVersion || 'Node.js'} · ${platform}`,
      progress: cpu
    },
    {
      label: "MEMORY CAPACITY",
      value: `${memory}%`,
      icon: <CloudQueue />,
      color: memory > 80 ? "#ef4444" : memory > 60 ? "#f59e0b" : "#8b5cf6",
      detail: `${memUsedMB} MB / ${memTotalMB} MB`,
      progress: memory
    },
    {
      label: "HEAP USAGE",
      value: `${heapUsedMB} MB`,
      icon: <Storage />,
      color: "#10b981",
      detail: "Node.js heap allocation",
      progress: memTotalMB > 0 ? Math.round((heapUsedMB / memTotalMB) * 100) : 0
    },
    {
      label: "INSTANCE UPTIME",
      value: uptime,
      icon: <Speed />,
      color: "#f59e0b",
      detail: "Server process runtime",
      progress: 100
    },
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {metrics.map((m, i) => (
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
              <Typography variant="caption" sx={{ color: m.color, fontWeight: 900, fontSize: '0.65rem', mt: 1, display: 'block', mb: 1.5 }}>{m.detail}</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, m.progress)}
                sx={{
                  height: 4, borderRadius: 2,
                  bgcolor: alpha(m.color, 0.1),
                  '& .MuiLinearProgress-bar': { bgcolor: m.color, borderRadius: 2 }
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Live Trend Chart */}
      {healthData.length > 0 && (
        <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
          <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900}>Live Performance Trend</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>Real server metrics — updated every 30s</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {[{ label: 'CPU', color: theme.palette.primary.main }, { label: 'MEM', color: '#8b5cf6' }].map(({ label, color }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="caption" fontWeight={900}>{label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box sx={{ px: 2, pb: 4, height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="healthCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="healthMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  formatter={(value, name) => [`${value}%`, name === 'cpu' ? 'CPU' : 'Memory']}
                />
                <Area type="monotone" dataKey="cpu" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#healthCpu)" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#healthMem)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      )}

      {/* Advanced Troubleshooting Suite */}
      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" fontWeight={900}>Troubleshooting Protocol</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>Emergency System Maintenance & Cache Control</Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {[
              { label: "Clear System Cache", desc: "Flush global application data and re-initialize CDN edge nodes.", icon: <Storage />, color: "primary" },
              { label: "Reset Static Assets", desc: "Force re-deployment of static resources and media blobs.", icon: <CloudQueue />, color: "info" },
              { label: "Audit DB Indices", desc: "Scan collections for missing composite indices.", icon: <Security />, color: "warning" },
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
                    disabled={healthExecuting === tool.label}
                    onClick={() => handleHealthExecute(tool.label)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 900, mt: 'auto' }}
                  >
                    {healthExecuting === tool.label ? <CircularProgress size={16} /> : "Execute"}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default SystemHealthTab;
