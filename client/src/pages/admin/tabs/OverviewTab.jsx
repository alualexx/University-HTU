import React from "react";
import {
  Grid, Card, Typography, Box, Stack, Chip, CircularProgress, useTheme, alpha
} from "@mui/material";
import {
  People, School, Book, Assessment,
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Tooltip as ChartTooltip
} from "recharts";

const DEFAULT_NEON_COLORS = ["#38bdf8", "#34d399", "#fb7185", "#c084fc", "#fbbf24"];

const StatCard = ({ label, value, icon, gradient, glassStyle }) => (
  <Card sx={{
    ...glassStyle,
    borderRadius: 5,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: '1px solid rgba(255,255,255,0.1)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: `0 20px 40px rgba(0,0,0,0.2)`,
      borderColor: 'primary.main'
    }
  }}>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 1, display: 'block' }}>
            {label}
          </Typography>
          <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{
          width: 64, height: 64, borderRadius: 3.5,
          background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white",
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>
      </Box>
    </Box>
  </Card>
);

const OverviewTab = ({
  statsData,
  healthData,
  gradients,
  neonColors: propNeonColors,
  glassStyle,
}) => {
  const theme = useTheme();
  const neonColors = propNeonColors || DEFAULT_NEON_COLORS;
  return (
    <Box>
      {/* High Impact Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: "Total Students", value: statsData.students, icon: <People />, gradient: gradients[0] },
          { label: "Academic Faculty", value: statsData.faculty, icon: <School />, gradient: gradients[1] },
          { label: "Active Modules", value: "348", icon: <Book />, gradient: gradients[2] },
          { label: "Departments", value: statsData.departments, icon: <Assessment />, gradient: gradients[3] },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...stat} glassStyle={glassStyle} />
          </Grid>
        ))}
      </Grid>

      {/* Command Intelligence Suite */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Massive Center Chart: System Pulse */}
        <Grid item xs={12} md={6}>
          <Card className="glass-panel" sx={{ borderRadius: 6, overflow: "hidden", height: '100%' }}>
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ fontFamily: 'Outfit, sans-serif' }}>Infrastructure Pulse</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1 }}>REAL-TIME THROUGHPUT</Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }} />
                  <Typography variant="caption" fontWeight={900}>CPU</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }} />
                  <Typography variant="caption" fontWeight={900}>TRAFFIC</Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ px: 2, pb: 4, height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Area type="monotone" dataKey="cpu" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#colorCpu)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Side Metric: User Growth */}
        <Grid item xs={12} md={3}>
          <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle1" fontWeight={900} gutterBottom>Core User Mix</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 3, display: 'block' }}>Distribution by Roles</Typography>

            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Student', count: statsData.students, color: gradients[0] },
                  { name: 'Faculty', count: statsData.faculty, color: gradients[1] },
                  { name: 'Admin', count: 4, color: gradients[3] }
                ]} barSize={30}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                  <YAxis hide />
                  <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                     { [0,1,2].map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === 0 ? theme.palette.primary.main : index === 1 ? '#10b981' : '#8b5cf6'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={800}>PEAK</Typography>
                <Typography variant="caption" fontWeight={900} color="primary">4.2 GB/s</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* NEW: Resource Optimization IQ Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle1" fontWeight={900} gutterBottom>Resource IQ</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 3, display: 'block' }}>System Efficiency Delta</Typography>

            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <CircularProgress variant="determinate" value={88} size={140} thickness={4} sx={{ color: 'primary.main', opacity: 0.1, position: 'absolute' }} />
              <CircularProgress variant="determinate" value={72} size={140} thickness={4} sx={{ color: '#10b981', filter: 'drop-shadow(0 0 8px #10b981)' }} />
              <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={1000}>72%</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={900}>OPTIMIZED</Typography>
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={800}>THREAT BLOCKER</Typography>
                <Typography variant="caption" fontWeight={900} color="success.main">ACTIVE</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Analytical Visualization Cluster */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>Real-time Network Throughput</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>System data transfer across global edge nodes</Typography>
              </Box>
              <Chip label="Stable" size="small" color="success" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
            </Box>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData.slice(-20)}>
                  <defs>
                    <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={neonColors[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={neonColors[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <ChartTooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} />
                  <Area type="monotone" dataKey="requests" stroke={neonColors[0]} strokeWidth={4} fillOpacity={1} fill="url(#colorThroughput)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>Security Threat Index</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Detected anomalies & intrusion attempts</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData.slice(-10)}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Bar dataKey="cpu" fill={neonColors[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;
