import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Grid, Card, CardContent, Typography, Box, Button,
    Avatar, Chip, List, ListItem, ListItemText, Divider, LinearProgress,
    IconButton, Tab, Tabs, Badge, Tooltip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, MenuItem,
} from "@mui/material";
import {
    School, People, Assignment, Grade, Logout, EmojiEvents,
    LightMode, DarkMode, Notifications, Dashboard, Campaign,
    CheckCircle, AccessTime, TrendingUp, MenuBook, Star,
    CalendarMonth, Edit, Add, PersonOutline, BarChart,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme } from "@mui/material";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend,
} from "recharts";

/* ─── Constants ────────────────────────────────────────────────────────── */
const gradients = [
    "linear-gradient(135deg,#2e7d32,#66bb6a)",
    "linear-gradient(135deg,#1976d2,#42a5f5)",
    "linear-gradient(135deg,#6a1b9a,#ba68c8)",
    "linear-gradient(135deg,#e65100,#ffa726)",
];
const courseColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
const gradeMap = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, F: 0 };

/* ─── useCountUp ──────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1600) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let raf;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(p * target));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return count;
}

/* ─── StatCard ────────────────────────────────────────────────────────── */
function StatCard({ stat }) {
    const animated = useCountUp(stat.raw);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Card elevation={0} sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            overflow: "hidden",
            transition: "all 0.3s",
            bgcolor: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            "&:hover": { transform: "translateY(-6px)", boxShadow: isDark ? "0 20px 48px rgba(0,0,0,0.4)" : "0 20px 48px rgba(0,0,0,0.1)" }
        }}>
            <Box sx={{ height: 5, background: stat.gradient }} />
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2.5 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ mt: 0.4, lineHeight: 1 }}>
                        {animated}
                        {stat.suffix && <Typography component="span" variant="h6" color="text.secondary" fontWeight={400} sx={{ ml: 0.5 }}>{stat.suffix}</Typography>}
                    </Typography>
                </Box>
                <Box sx={{ width: 56, height: 56, borderRadius: 3, background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    {stat.icon}
                </Box>
            </CardContent>
        </Card>
    );
}

/* ─── Main ────────────────────────────────────────────────────────────── */
export default function TeacherDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { mode, toggleColorMode } = useColorMode();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState("CS301");
    const isDark = theme.palette.mode === 'dark';

    /* ── Data ─────────────────────────────────────────────────────────── */
    const teacher = {
        name: user?.name || "Dr. Sarah Mills",
        dept: "Department of Computer Science",
        title: "Course Instructor",
    };

    const courses = [
        { code: "CS301", name: "Data Structures & Algorithms", students: 42, enrolled: 45, schedule: "Mon/Wed 10:00–11:30", room: "CS-204", color: courseColors[0], avgGrade: "B+", completion: 78 },
        { code: "CS401", name: "Operating Systems", students: 28, enrolled: 30, schedule: "Tue/Thu 10:00–11:30", room: "CS-105", color: courseColors[1], avgGrade: "B", completion: 65 },
        { code: "CS501", name: "Advanced Algorithms", students: 18, enrolled: 20, schedule: "Fri 13:00–16:00", room: "CS-301", color: courseColors[2], avgGrade: "A-", completion: 85 },
    ];

    const allStudents = [
        { name: "Alice Johnson", id: "STU-001", course: "CS301", grade: "A", progress: 92, status: "Active", attendance: 96 },
        { name: "Bob Martinez", id: "STU-002", course: "CS301", grade: "B+", progress: 78, status: "Active", attendance: 88 },
        { name: "Carol Smith", id: "STU-003", course: "CS401", grade: "B", progress: 65, status: "At Risk", attendance: 72 },
        { name: "David Wang", id: "STU-004", course: "CS301", grade: "A-", progress: 85, status: "Active", attendance: 94 },
        { name: "Emma Davis", id: "STU-005", course: "CS501", grade: "A", progress: 91, status: "Active", attendance: 100 },
        { name: "Frank Lee", id: "STU-006", course: "CS401", grade: "C+", progress: 52, status: "At Risk", attendance: 68 },
        { name: "Grace Kim", id: "STU-007", course: "CS501", grade: "A-", progress: 88, status: "Active", attendance: 95 },
        { name: "Henry Brown", id: "STU-008", course: "CS301", grade: "B", progress: 71, status: "Active", attendance: 82 },
    ];

    const recentGrades = [
        { student: "Alice Johnson", course: "CS301", assignment: "Assignment 4", grade: "A", date: "Mar 4" },
        { student: "Bob Martinez", course: "CS301", assignment: "Assignment 4", grade: "B+", date: "Mar 4" },
        { student: "Emma Davis", course: "CS501", assignment: "Project Milestone 2", grade: "A", date: "Mar 3" },
        { student: "Carol Smith", course: "CS401", assignment: "Lab 3", grade: "B-", date: "Mar 3" },
        { student: "Frank Lee", course: "CS401", assignment: "Lab 3", grade: "C", date: "Mar 3" },
    ];

    const pendingItems = [
        { title: "Grade CS301 Assignment 5", course: "CS301", due: "Mar 8", count: 42 },
        { title: "Review CS401 Lab 4 Submissions", course: "CS401", due: "Mar 10", count: 28 },
        { title: "CS501 Project Presentations", course: "CS501", due: "Mar 15", count: 18 },
    ];

    const announcements = [
        { title: "CS301 — Assignment 5 Posted", body: "Assignment 5 on Sorting Algorithms has been posted.", course: "CS301", date: "Mar 5", isNew: true, color: courseColors[0] },
        { title: "Staff Meeting", body: "Departmental meeting regarding final exam schedules.", course: "Faculty", date: "Mar 4", isNew: true, color: "#1976d2" },
    ];

    const gradeDistData = [
        { grade: "A", count: 12, color: "#22c55e" },
        { grade: "A-", count: 8, color: "#4ade80" },
        { grade: "B+", count: 10, color: "#3b82f6" },
        { grade: "B", count: 7, color: "#60a5fa" },
        { grade: "B-", count: 4, color: "#93c5fd" },
        { grade: "C+", count: 3, color: "#f59e0b" },
        { grade: "C", count: 2, color: "#fb923c" },
    ];

    const totalStudents = courses.reduce((a, c) => a + c.students, 0);
    const pendingGrades = recentGrades.length + 7;
    const atRiskCount = allStudents.filter((s) => s.status === "At Risk").length;

    const stats = [
        { label: "My Courses", raw: courses.length, suffix: "active", gradient: gradients[0], icon: <School sx={{ fontSize: 30 }} /> },
        { label: "Total Students", raw: totalStudents, gradient: gradients[1], icon: <People sx={{ fontSize: 30 }} /> },
        { label: "Pending Grades", raw: pendingGrades, gradient: gradients[2], icon: <Assignment sx={{ fontSize: 30 }} /> },
        { label: "At-Risk Students", raw: atRiskCount, gradient: gradients[3], icon: <EmojiEvents sx={{ fontSize: 30 }} /> },
    ];

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
    const scheduleBlocks = [
        { day: "Mon", start: 10, end: 11.5, code: "CS301", room: "CS-204", color: courseColors[0] },
        { day: "Tue", start: 10, end: 11.5, code: "CS401", room: "CS-105", color: courseColors[1] },
        { day: "Wed", start: 10, end: 11.5, code: "CS301", room: "CS-204", color: courseColors[0] },
        { day: "Thu", start: 10, end: 11.5, code: "CS401", room: "CS-105", color: courseColors[1] },
        { day: "Fri", start: 13, end: 16, code: "CS501", room: "CS-301", color: courseColors[2] },
    ];

    const glassStyle = {
        background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
    };

    const handleLogout = async () => { await logout(); navigate("/"); };

    return (
        <Box sx={{ bgcolor: isDark ? "#0f172a" : "#f8fafc", minHeight: "100vh", pb: 10 }}>
            {/* Hero Header */}
            <Box sx={{
                background: isDark
                    ? "linear-gradient(135deg, #166534 0%, #15803d 100%)"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                pt: 6, pb: 12, position: "relative", overflow: "hidden"
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                            <Avatar
                                sx={{
                                    width: 80, height: 80, border: "4px solid rgba(255,255,255,0.2)",
                                    background: 'white', color: 'success.main', fontSize: '2rem', fontWeight: 800
                                }}
                            >
                                {teacher.name[0]}
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                    <Typography variant="h3" fontWeight={900} color="white" letterSpacing="-0.04em">
                                        Teacher Portal
                                    </Typography>
                                    <Chip label="Spring 2025" size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 800 }} />
                                </Box>
                                <Typography variant="h6" color="rgba(255,255,255,0.8)" fontWeight={500}>
                                    Welcome, <span style={{ color: 'white', fontWeight: 700 }}>{user?.name || teacher.name}</span>
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Tooltip title="Toggle Theme">
                                <IconButton onClick={toggleColorMode} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}>
                                    {mode === "dark" ? <LightMode /> : <DarkMode />}
                                </IconButton>
                            </Tooltip>
                            <Button onClick={handleLogout} variant="contained" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 700, borderRadius: 2.5, textTransform: 'none' }}>
                                Sign Out
                            </Button>
                        </Box>
                    </Box>

                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mt: 4, '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 700, p: 2 }, '& .Mui-selected': { color: 'white !important' }, '& .MuiTabs-indicator': { bgcolor: 'white' } }}>
                        <Tab label="Overview" icon={<Dashboard sx={{ mr: 1 }} />} iconPosition="start" />
                        <Tab label="My Courses" icon={<MenuBook sx={{ mr: 1 }} />} iconPosition="start" />
                        <Tab label="Students" icon={<People sx={{ mr: 1 }} />} iconPosition="start" />
                        <Tab label="Grades" icon={<Grade sx={{ mr: 1 }} />} iconPosition="start" />
                        <Tab label="Schedule" icon={<CalendarMonth sx={{ mr: 1 }} />} iconPosition="start" />
                    </Tabs>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 10 }}>
                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        {stats.map((s, i) => <Grid item xs={12} sm={6} md={3} key={i}><StatCard stat={s} /></Grid>)}

                        <Grid item xs={12} md={8}>
                            <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>Recent Grading Activity</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                {recentGrades.map((row, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell><Typography variant="body2" fontWeight={700}>{row.student}</Typography></TableCell>
                                                        <TableCell><Chip label={row.course} size="small" /></TableCell>
                                                        <TableCell><Typography variant="body2" color="text.secondary">{row.assignment}</Typography></TableCell>
                                                        <TableCell><Chip label={row.grade} size="small" color="primary" sx={{ fontWeight: 800 }} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>Upcoming Tasks</Typography>
                                    <List>
                                        {pendingItems.map((item, i) => (
                                            <ListItem key={i} sx={{ px: 0 }}>
                                                <ListItemText primary={item.title} secondary={`Due: ${item.due}`} primaryTypographyProps={{ fontWeight: 700 }} />
                                                <Button size="small" variant="contained" sx={{ borderRadius: 2 }}>Grade</Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Other tabs would follow similar premium patterns ... */}
                {activeTab > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Card sx={{ ...glassStyle, borderRadius: 4, p: 5, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight={700}>Module Content Coming Soon</Typography>
                            <Typography color="text.secondary">We are finalising the detailed view for this tab.</Typography>
                        </Card>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
