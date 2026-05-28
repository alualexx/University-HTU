import React from "react";
import {
  Grid, Card, Typography, Box, Stack, Chip, CircularProgress, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  People, School, Book, Assessment,
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Tooltip as ChartTooltip
} from "recharts";

import { Card as ShadcnCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as ShadcnBadge } from "@/components/ui/badge";

const DEFAULT_NEON_COLORS = ["#38bdf8", "#34d399", "#fb7185", "#c084fc", "#fbbf24"];

const StatCard = ({ label, value, icon, gradient, glassStyle }) => (
  <ShadcnCard className="transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl border-white/10 dark:bg-slate-900/50 bg-white/50 backdrop-blur-md rounded-[20px]">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-[1.5px] mb-2">
            {label}
          </p>
          <h3 className="text-4xl font-black tracking-tighter text-foreground">
            {value}
          </h3>
        </div>
        <div 
          className="w-16 h-16 rounded-[14px] flex items-center justify-center text-white shadow-lg"
          style={{ background: gradient }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </div>
      </div>
    </CardContent>
  </ShadcnCard>
);

const OverviewTab = ({
  statsData,
  healthData,
  serverHealth = {},
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
          { label: "Active Courses", value: statsData.courses || '—', icon: <Book />, gradient: gradients[2] },
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
                  { name: 'Student', count: statsData.students },
                  { name: 'Faculty', count: statsData.faculty },
                  { name: 'Admin', count: statsData.admins || 0 }
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
                <Typography variant="caption" fontWeight={800}>UPTIME</Typography>
                <Typography variant="caption" fontWeight={900} color="primary">{serverHealth.uptime || '—'}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* NEW: Resource Optimization IQ Card */}
        <Grid item xs={12} md={3}>
          <ShadcnCard className="h-full border-white/10 dark:bg-slate-900/50 bg-white/50 backdrop-blur-md rounded-[20px]">
            <CardHeader className="pb-0">
              <CardTitle className="font-black text-lg">Resource IQ</CardTitle>
              <p className="text-sm font-bold text-muted-foreground">System Efficiency Delta</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[180px] flex items-center justify-center relative">
                <CircularProgress variant="determinate" value={100} size={140} thickness={4} sx={{ color: 'primary.main', opacity: 0.1, position: 'absolute' }} />
                <CircularProgress variant="determinate" value={serverHealth.memory ?? 0} size={140} thickness={4} sx={{ color: '#10b981', filter: 'drop-shadow(0 0 8px #10b981)' }} />
                <div className="absolute text-center">
                  <h4 className="text-4xl font-black text-foreground">{serverHealth.memory ?? 0}%</h4>
                  <p className="text-xs font-black text-muted-foreground mt-1">MEM USED</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-foreground tracking-wider">THREAT BLOCKER</span>
                  <ShadcnBadge className="bg-emerald-500 hover:bg-emerald-600 font-bold border-none">ACTIVE</ShadcnBadge>
                </div>
              </div>
            </CardContent>
          </ShadcnCard>
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
