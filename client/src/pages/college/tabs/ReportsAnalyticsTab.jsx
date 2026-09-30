import React from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Stack, Avatar, Divider, alpha,
} from "@mui/material";
import { Download, AutoGraph, School, People, MenuBook, Science } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    purple: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
};

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export default function ReportsAnalyticsTab({ college, departments = [], dashboardData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    // ── KPI data derived from live props ──────────────────────────────
    const kpis = [
        { label: "Total Students", value: dashboardData?.studentCount ?? "—", icon: <School />, grad: GRADIENTS.premium },
        { label: "Faculty Members", value: dashboardData?.facultyCount ?? "—", icon: <People />, grad: GRADIENTS.success },
        { label: "Active Courses", value: dashboardData?.courseCount ?? (dashboardData?.courses?.length ?? "—"), icon: <MenuBook />, grad: GRADIENTS.warning },
        { label: "Research Projects", value: dashboardData?.researchProjects?.length ?? "—", icon: <Science />, grad: GRADIENTS.purple },
    ];

    // ── Department enrollment bar chart ───────────────────────────────
    const deptEnrollData = departments.map(d => ({
        name: d.code || d.name?.slice(0, 8),
        students: d.studentCount || 0,
        color: d.color || "#6366f1",
    }));

    // ── Dept distribution pie chart ───────────────────────────────────
    const pieData = departments.map((d, i) => ({
        name: d.name?.replace("Department", "").trim() || d.code,
        value: d.studentCount || 1,
    }));

    // ── Enrollment trend (use dashboardData.enrollmentTrend if available) ─
    const enrollTrend = dashboardData?.enrollmentTrend || [
        { month: "Jan", students: 0 },
        { month: "Feb", students: 0 },
        { month: "Mar", students: 0 },
        { month: "Apr", students: 0 },
        { month: "May", students: 0 },
        { month: "Jun", students: dashboardData?.studentCount || 0 },
    ];

    const coreReports = [
        { title: "Enrollment Trends Report", desc: "Breakdown of new intakes, continuations, and graduations by department." },
        { title: "Financial Utilization Audit", desc: "Expenditure vs Budget variance analysis across all college sectors." },
        { title: "Accreditation Readiness Score", desc: "Automated assessment against core accreditation standards metrics." },
        { title: "Faculty Productivity Matrix", desc: "Combined teaching load, research output, and service contributions." },
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Reports & Analytics Factory</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        ENROLLMENT • PERFORMANCE • FINANCIALS • ACCREDITATION READINESS
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AutoGraph />}
                    sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Custom Report Builder
                </Button>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {kpis.map((k, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
                                <Avatar sx={{ background: k.grad, width: 52, height: 52 }}>{k.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>{k.label}</Typography>
                                    <Typography variant="h5" fontWeight={1000}>{k.value}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Enrollment Trend */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Enrollment Overview</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {college?.name || "College"} — current academic period
                            </Typography>
                            <Box sx={{ height: 240, mt: 2 }}>
                                {deptEnrollData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={deptEnrollData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis dataKey="name" tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Bar dataKey="students" radius={[6, 6, 0, 0]} barSize={32}>
                                                {deptEnrollData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography color="text.secondary" fontWeight={700}>No department enrollment data available</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Dept Distribution Pie */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Department Distribution</Typography>
                            <Box sx={{ height: 240, mt: 1 }}>
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                                                paddingAngle={3} dataKey="value">
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Legend iconType="circle" iconSize={8}
                                                formatter={(value) => <span style={{ fontWeight: 700, fontSize: "0.75rem" }}>{value}</span>} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography color="text.secondary" fontWeight={700}>No departments yet</Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ opacity: 0.1, mb: 4 }} />

            {/* Standard Report Cards */}
            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Standard Reporting Suites</Typography>
            <Grid container spacing={3}>
                {coreReports.map((r, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" fontWeight={900}>{r.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>{r.desc}</Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" variant="outlined" startIcon={<Download />}
                                        sx={{ borderRadius: 2, fontWeight: 800 }}>Export PDF</Button>
                                    <Button size="small" variant="text"
                                        sx={{ borderRadius: 2, fontWeight: 800 }}>Export CSV</Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
