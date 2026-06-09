import React from "react";
import { Box, Typography, Grid, Card, Avatar, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Layers, People, Assignment, EmojiEvents } from "@mui/icons-material";
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer
} from "recharts";

const THEME_G = {
    indigo: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    violet: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    cyan: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    rose: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    amber: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    slate: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
};

const GlassCard = ({ children, sx = {}, hover = true }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Card sx={{
            borderRadius: 6,
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(99, 102, 241, 0.05)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": hover ? {
                transform: "translateY(-6px)",
                boxShadow: isDark ? "0 20px 48px rgba(0, 0, 0, 0.5)" : "0 20px 48px rgba(99, 102, 241, 0.12)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(99, 102, 241, 0.3)",
            } : {},
            ...sx
        }}>
            {children}
        </Card>
    );
};

const StatHUD = ({ label, value, icon, grad, color }) => (
    <GlassCard sx={{ p: 4, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: grad, opacity: 0.1, filter: "blur(20px)" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: `0 8px 20px ${alpha(color, 0.4)}` }}>
                {React.cloneElement(icon, { sx: { fontSize: 24 } })}
            </Box>
        </Box>
        <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, fontFamily: "'Outfit', sans-serif" }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5, opacity: 0.7 }}>{label.toUpperCase()}</Typography>
    </GlassCard>
);

export default function OverviewTab({ user, metrics, performanceData, recentComms }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" fontWeight={1000} sx={{ letterSpacing: -3, lineHeight: 1, mb: 1 }}>Neural<span style={{ color: "#06b6d4" }}>.</span>Link</Typography>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1.5, opacity: 0.7 }}>INSTRUCTOR: {user?.name?.toUpperCase()} // SECTOR: {user?.department?.toUpperCase()}</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatHUD label="Live Modules" value={metrics.activeCourses} icon={<Layers />} grad={THEME_G.cyan} color="#06b6d4" suffix="ACTIVE" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatHUD label="Target Students" value={metrics.totalStudents} icon={<People />} grad={THEME_G.indigo} color="#6366f1" suffix="CONNECTED" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatHUD label="Task Nodes" value={metrics.totalAssignments} icon={<Assignment />} grad={THEME_G.violet} color="#8b5cf6" suffix="DEPLOYED" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatHUD label="Performance Index" value={metrics.avgGpa} icon={<EmojiEvents />} grad={THEME_G.emerald} color="#10b981" suffix="NORM" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <GlassCard sx={{ p: 4, height: "100%" }}>
                        <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>Student Performance Pulse</Typography>
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.05)} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontWeight: 700 }} />
                                    <ChartTooltip contentStyle={{ borderRadius: 20, background: isDark ? "#0f172a" : "white", border: "none" }} />
                                    <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={4} fill="url(#scoreGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </GlassCard>
                </Grid>
                <Grid item xs={12} md={4}>
                    <GlassCard sx={{ p: 4, height: "100%" }}>
                        <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>Channel Frequency</Typography>
                        <Stack spacing={3}>
                            {recentComms?.slice(0, 5).map((ann, i) => (
                                <Box key={ann._id || i} sx={{ display: "flex", gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, background: ann.priority === "high" ? THEME_G.rose : THEME_G.slate, fontSize: "0.8rem", fontWeight: 900 }}>HUD</Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle2" fontWeight={1000} noWrap>{ann.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ann.body}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            {(recentComms?.length || 0) === 0 && <Typography variant="caption" sx={{ opacity: 0.5 }}>No data found in transmission buffer.</Typography>}
                        </Stack>
                    </GlassCard>
                </Grid>
            </Grid>
        </Box>
    );
}
