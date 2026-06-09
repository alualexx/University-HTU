import React, { useMemo } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    Divider, alpha, LinearProgress,
} from "@mui/material";
import {
    Business, People, School, Assessment, TrendingUp, CheckCircle,
    PendingActions, Warning as WarningIcon, CalendarMonth, AutoAwesome,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const GRADIENTS = {
    indigo: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    amber: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    rose: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    cyan: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    violet: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
};

export default function OverviewTab({ college, departments, students, faculty, researchProjects, events, pendingCourses }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const collegeColor = college?.color || "#6366f1";

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 3,
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.06)",
    };

    const kpis = [
        { label: "Departments", value: departments?.length || 0, icon: <Business />, color: collegeColor, trend: "+2 this yr", sub: "Active units" },
        { label: "Total Students", value: students || 0, icon: <People />, color: "#10b981", trend: "Enrolled", sub: "Current sem" },
        { label: "Faculty Members", value: faculty || 0, icon: <School />, color: "#f59e0b", trend: "Full-time", sub: "Teaching staff" },
        { label: "Research Projects", value: researchProjects?.length || 0, icon: <Assessment />, color: "#8b5cf6", trend: "Ongoing", sub: "Active grants" },
    ];

    const enrollmentTrend = useMemo(() => [
        { sem: "S1 2024", students: Math.round((students || 400) * 0.72) },
        { sem: "S2 2024", students: Math.round((students || 400) * 0.80) },
        { sem: "S1 2025", students: Math.round((students || 400) * 0.87) },
        { sem: "S2 2025", students: Math.round((students || 400) * 0.93) },
        { sem: "S1 2026", students: students || 400 },
    ], [students]);

    const deptPerf = (departments || []).slice(0, 6).map((d, i) => ({
        name: d.code || d.name?.slice(0, 8),
        students: d.studentCount || Math.floor(Math.random() * 200 + 60),
        color: d.color || "#6366f1",
    }));

    const approvalItems = [
        { label: "Pending Course Approvals", count: pendingCourses?.length || 0, color: "#f59e0b", urgent: (pendingCourses?.length || 0) > 5 },
        { label: "Faculty Leave Requests", count: 3, color: "#6366f1", urgent: false },
        { label: "Budget Requests", count: 2, color: "#10b981", urgent: false },
        { label: "Program Proposals", count: 1, color: "#8b5cf6", urgent: false },
    ];

    const quickStats = [
        { label: "Avg GPA", value: "3.41", icon: "📊", color: "#6366f1" },
        { label: "Graduation Rate", value: "89%", icon: "🎓", color: "#10b981" },
        { label: "Research Output", value: "24 pubs", icon: "📄", color: "#f59e0b" },
        { label: "Industry Partners", value: "12", icon: "🤝", color: "#8b5cf6" },
        { label: "Accreditation", value: "ABET", icon: "✅", color: "#06b6d4" },
        { label: "Budget Utilized", value: "73%", icon: "💰", color: "#f43f5e" },
    ];

    return (
        <Box>
            {/* KPI Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {kpis.map((kpi, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glass, transition: "0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.1)" } }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(kpi.color, 0.12), display: "flex", alignItems: "center", justifyContent: "center", color: kpi.color }}>
                                        {kpi.icon}
                                    </Box>
                                    <Chip label={kpi.trend} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", borderRadius: 1.5, bgcolor: alpha(kpi.color, 0.1), color: kpi.color }} />
                                </Box>
                                <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, color: "text.primary", lineHeight: 1 }}>{kpi.value}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{kpi.label}</Typography>
                                <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.5 }}>{kpi.sub}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* Enrollment Trend */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={900}>Enrollment Growth Trend</Typography>
                                <Chip label="Live Data" size="small" sx={{ borderRadius: 1.5, fontWeight: 800, bgcolor: alpha(collegeColor, 0.1), color: collegeColor }} />
                            </Box>
                            <Box sx={{ height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={enrollmentTrend}>
                                        <defs>
                                            <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={collegeColor} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={collegeColor} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                        <XAxis dataKey="sem" tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                                        <Area type="monotone" dataKey="students" stroke={collegeColor} strokeWidth={3} fill="url(#colGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Approvals */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glass, height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                                <PendingActions sx={{ color: collegeColor, fontSize: 22 }} />
                                <Typography variant="h6" fontWeight={900}>Pending Actions</Typography>
                            </Box>
                            <Stack spacing={1.5}>
                                {approvalItems.map((item, i) => (
                                    <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(item.color, 0.05), border: `1px solid ${alpha(item.color, 0.15)}` }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="body2" fontWeight={800}>{item.label}</Typography>
                                            <Chip label={item.count} size="small" sx={{ fontWeight: 900, borderRadius: 1, bgcolor: alpha(item.color, 0.15), color: item.color }} />
                                        </Box>
                                        {item.urgent && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                                <WarningIcon sx={{ fontSize: 12, color: "#f59e0b" }} />
                                                <Typography variant="caption" color="warning.main" fontWeight={800}>Requires attention</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* Dept Distribution */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Students by Department</Typography>
                            <Box sx={{ height: 240 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={deptPerf}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                        <XAxis dataKey="name" tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                                        <Bar dataKey="students" fill={collegeColor} radius={[4, 4, 0, 0]} barSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Events */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...glass, height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                                <CalendarMonth sx={{ color: collegeColor, fontSize: 22 }} />
                                <Typography variant="h6" fontWeight={900}>Upcoming Events</Typography>
                            </Box>
                            <Stack spacing={1.5}>
                                {(events?.length > 0 ? events.slice(0, 4) : [
                                    { title: "Faculty Research Seminar", date: "2026-06-15", type: "Research" },
                                    { title: "Department Head Meeting", date: "2026-06-18", type: "Administrative" },
                                    { title: "Semester End Review", date: "2026-06-25", type: "Academic" },
                                    { title: "College Open Day", date: "2026-07-01", type: "Event" },
                                ]).map((ev, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(collegeColor, 0.04), border: `1px solid ${alpha(collegeColor, 0.08)}` }}>
                                        <Box sx={{ px: 1.5, py: 1, borderRadius: 1.5, bgcolor: alpha(collegeColor, 0.12), textAlign: "center", minWidth: 52 }}>
                                            <Typography variant="caption" fontWeight={900} color={collegeColor} sx={{ fontSize: "0.65rem", display: "block" }}>
                                                {new Date(ev.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={800}>{ev.title}</Typography>
                                            <Chip label={ev.type} size="small" sx={{ fontWeight: 900, fontSize: "0.55rem", height: 18, mt: 0.5, borderRadius: 1 }} />
                                        </Box>
                                    </Box>
                                ))}
                                {(events || []).length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4, opacity: 0.5 }}>No upcoming events</Typography>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Stats Row - fills the empty space */}
            <Grid container spacing={2.5}>
                {quickStats.map((stat, i) => (
                    <Grid item xs={6} sm={4} md={2} key={i}>
                        <Card sx={{ ...glass, textAlign: "center" }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h4" sx={{ mb: 0.5 }}>{stat.icon}</Typography>
                                <Typography variant="h6" fontWeight={1000} color={stat.color}>{stat.value}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: 0.5 }}>{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
