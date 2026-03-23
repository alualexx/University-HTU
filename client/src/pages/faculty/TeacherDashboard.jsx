import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Grid, Card, CardContent, Typography, Box, Button,
    Avatar, Chip, List, ListItem, ListItemText, Divider, LinearProgress,
    IconButton, Tab, Tabs, Badge, Tooltip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, 
    InputLabel, Select, Checkbox, FormControlLabel,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
    School, People, Assignment, Grade, Logout, EmojiEvents,
    LightMode, DarkMode, Notifications, Dashboard, Campaign,
    CheckCircle, AccessTime, TrendingUp, MenuBook, Star,
    CalendarMonth, Edit, Add, PersonOutline, BarChart,
    CloudUpload, FileDownload, Save, FilterList, Search,
    Visibility, MoreVert as MoreVertIcon, Close, 
    CheckCircleOutline, HighlightOff,
    ChevronLeft, ChevronRight, LibraryBooks, AssignmentInd, 
    AccountBalance, SwapHoriz, Schedule, Menu as MenuIcon, LockReset
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { db } from "../../services/Firebase";
import {
    collection, query, where, onSnapshot, doc, updateDoc,
    addDoc, serverTimestamp, getDocs, deleteDoc, orderBy, limit, setDoc
} from "firebase/firestore";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend, LineChart, Line,
} from "recharts";

/* ─── Constants ────────────────────────────────────────────────────────── */
const gradients = [
    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
        <Card
            sx={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 6,
                overflow: "hidden",
                position: 'relative',
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    borderColor: "rgba(255,255,255,0.2)"
                },
            }}
        >
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: stat.gradient }} />
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ textTransform: "uppercase", letterSpacing: 2, fontSize: '0.65rem', opacity: 0.8 }}>
                            {stat.label}
                        </Typography>
                        <Typography variant="h3" fontWeight={1000} sx={{ mt: 0.5, letterSpacing: -1.5, fontFamily: 'Outfit, sans-serif' }}>
                            {animated}
                            {stat.suffix && (
                                <Typography component="span" variant="caption" color="text.secondary" fontWeight={900} sx={{ ml: 1, fontSize: '0.75rem', verticalAlign: 'middle' }}>
                                    {stat.suffix}
                                </Typography>
                            )}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 56, height: 56, borderRadius: 3.5,
                            background: stat.gradient,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                        {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                    </Box>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", '& .MuiLinearProgress-bar': { background: stat.gradient, borderRadius: 3 } }}
                />
            </CardContent>
        </Card>
    );
}


/* ─── Main ────────────────────────────────────────────────────────────── */
export default function TeacherDashboard() {
    const { user, logout, sendPasswordReset } = useAuth();
    const navigate = useNavigate();
    const { mode, toggleColorMode } = useColorMode();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [activeTab, setActiveTab] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState("CS301");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", deadline: "", marks: 100, file: null });
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userIp, setUserIp] = useState("unknown");
    const [courses, setCourses] = useState([]);

    /* ── Firestore Listeners ────────────────────────────────────────── */
    const [allStudents, setAllStudents] = useState([]);
    const [recentGrades, setRecentGrades] = useState([]);
    const [pendingItems, setPendingItems] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (!user?.uid) return;

        const unsubs = [];

        // Fetch courses where user is instructor
        const qCourses = query(collection(db, "courses"), where("instructorId", "==", user.uid));
        unsubs.push(onSnapshot(qCourses, (snap) => {
            const courseList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setCourses(courseList);
            if (courseList.length > 0 && !selectedCourse) {
                setSelectedCourse(courseList[0].code);
            }
        }));

        // Fetch students (all for now, should be filtered by enrollment eventually)
        unsubs.push(onSnapshot(query(collection(db, "users"), where("role", "==", "student")), (snap) => {
            setAllStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }));

        // Fetch assignments/pending items
        const qAssignments = query(collection(db, "assignments"), where("createdBy", "==", user.uid), orderBy("createdAt", "desc"));
        unsubs.push(onSnapshot(qAssignments, (snap) => {
            setPendingItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }));

        // Fetch User IP for auditing
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setUserIp(data.ip))
            .catch(err => {
                console.warn("IP fetch failed:", err);
                setUserIp("unknown");
            });

        return () => unsubs.forEach(u => u());
    }, [user?.uid]);

    const handleDirectPasswordReset = async (email, name) => {
        if (!window.confirm(`Are you sure you want to trigger a password reset for student ${name} (${email})?`)) return;
        
        try {
            await sendPasswordReset(email);
            // Audit log
            await addDoc(collection(db, "audit_logs"), {
                action: "Manual Password Reset (Teacher)",
                targetUser: email,
                processedBy: user?.email || "Teacher",
                timestamp: serverTimestamp(),
                ip: userIp || "unknown",
                color: "#10b981"
            });
            alert(`Password reset email sent to ${email}`);
        } catch (err) {
            console.error("Error sending direct password reset:", err);
            alert("Failed to send password reset email.");
        }
    };

    /* ── Handlers ────────────────────────────────────────────────────── */
    const handleDeployTask = async () => {
        try {
            await addDoc(collection(db, "assignments"), {
                ...assignmentForm,
                course: selectedCourse,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
                submissions: 0
            });
            setOpenAssignmentDialog(false);
            setAssignmentForm({ title: "", description: "", deadline: "", marks: 100, file: null });
        } catch (err) {
            console.error("Error deploying task:", err);
        }
    };

    const handleSaveAttendance = async () => {
        try {
            const attendanceRef = doc(db, "attendance", `${selectedCourse}_${attendanceDate}`);
            await setDoc(attendanceRef, {
                course: selectedCourse,
                date: attendanceDate,
                logs: attendanceData,
                updatedAt: serverTimestamp(),
                updatedBy: user.uid
            });
            alert("Attendance saved successfully!");
        } catch (err) {
            console.error("Error saving attendance:", err);
        }
    };

    /* ── UI Logic ────────────────────────────────────────────────────── */
    const teacher = {
        name: user?.name || "Dr. Sarah Mills",
        dept: "Department of Computer Science",
        title: "Course Instructor",
    };

    const totalStudents = courses.reduce((a, c) => a + (c.students || 0), 0);
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

    const gradeDistData = [
        { grade: 'A', count: 12, color: '#10b981' },
        { grade: 'B', count: 18, color: '#3b82f6' },
        { grade: 'C', count: 7, color: '#f59e0b' },
        { grade: 'D', count: 3, color: '#ef4444' },
    ];

    const glassStyle = {
        background: isDark ? "rgba(20, 24, 48, 0.6)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)" : "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
    };

    const handleLogout = async () => { await logout(); navigate("/"); };

    const Sidebar = () => (
        <Box sx={{
            width: sidebarOpen ? 280 : 80,
            flexShrink: 0,
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            background: isDark
                ? 'linear-gradient(180deg, #0f1225 0%, #05060f 100%)'
                : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            backdropFilter: 'blur(24px)',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            display: "flex",
            flexDirection: "column",
            zIndex: 1200,
            boxShadow: "10px 0 30px rgba(0,0,0,0.05)"
        }}>
            <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 80 }}>
                {sidebarOpen && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontWeight: 800 }}>{user?.name?.[0]}</Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={800} color="#fff" noWrap>{user?.name || "Dr. Sarah"}</Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }} fontWeight={700}>INSTRUCTOR</Typography>
                        </Box>
                    </Box>
                )}
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: 'white' }}>
                    {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </Box>

            <Divider sx={{ opacity: 0.1, bgcolor: 'rgba(255,255,255,0.1)' }} />

            <List sx={{ px: 2, py: 2, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                {[
                    { label: "Overview", icon: <Dashboard />, index: 0 },
                    { label: "Attendance", icon: <CalendarMonth />, index: 1 },
                    { label: "Course Units", icon: <LibraryBooks />, index: 2 },
                    { label: "Student Roster", icon: <People />, index: 3 },
                    { label: "Gradebook", icon: <Grade />, index: 4 },
                    { label: "Assignments", icon: <Assignment />, index: 5 },
                    { label: "Performance", icon: <BarChart />, index: 6 },
                ].map((item) => (
                    <ListItem key={item.index} disablePadding sx={{ mb: 0.5 }}>
                        <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
                            <Button
                                fullWidth
                                onClick={() => setActiveTab(item.index)}
                                sx={{
                                    justifyContent: sidebarOpen ? "flex-start" : "center",
                                    px: sidebarOpen ? 2 : 0,
                                    py: 1.5,
                                    borderRadius: 3,
                                    minWidth: 0,
                                    color: activeTab === item.index ? "#fff" : "rgba(255,255,255,0.6)",
                                    bgcolor: activeTab === item.index ? "rgba(255,255,255,0.08)" : "transparent",
                                    border: activeTab === item.index ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                                    "& .MuiButton-startIcon": {
                                        marginRight: sidebarOpen ? 1.5 : 0,
                                        color: activeTab === item.index ? "primary.light" : "inherit"
                                    },
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                                }}
                                startIcon={item.icon}
                            >
                                {sidebarOpen && (
                                    <Typography variant="body2" fontWeight={activeTab === item.index ? 800 : 600}>{item.label}</Typography>
                                )}
                            </Button>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <Divider sx={{ mb: 2, opacity: 0.1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Button
                    fullWidth
                    onClick={toggleColorMode}
                    startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
                    sx={{
                        justifyContent: sidebarOpen ? "flex-start" : "center",
                        color: "rgba(255,255,255,0.6)",
                        py: 1.2,
                        borderRadius: 3,
                        textTransform: 'none'
                    }}
                >
                    {sidebarOpen && <Typography variant="body2" fontWeight={600}>{mode === "dark" ? "Light Mode" : "Dark Mode"}</Typography>}
                </Button>
                <Button
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{
                        justifyContent: sidebarOpen ? "flex-start" : "center",
                        color: "#ef4444",
                        mt: 1,
                        py: 1.2,
                        borderRadius: 3,
                        textTransform: 'none',
                        "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" }
                    }}
                >
                    {sidebarOpen && <Typography variant="body2" fontWeight={800}>Sign Out</Typography>}
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", bgcolor: isDark ? "#05060f" : "#f8fafc", minHeight: "100vh" }}>
            <Sidebar />

            <Box component="main" sx={{
                flexGrow: 1,
                ml: `${sidebarOpen ? 280 : 80}px`,
                transition: theme.transitions.create("margin", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                width: `calc(100% - ${sidebarOpen ? 280 : 80}px)`
            }}>
            {/* ── TOP BAR ────────────────────────────────────────────────────── */}
            <Box sx={{
                height: 80,
                px: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 1100,
                background: isDark ? alpha("#05060f", 0.8) : alpha("#ffffff", 0.8),
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                color: isDark ? 'white' : 'text.primary'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {!sidebarOpen && (
                        <IconButton onClick={() => setSidebarOpen(true)} color="inherit">
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, fontFamily: 'Outfit, sans-serif' }}>
                        {[
                            "Overview", "Attendance", "Course Units", "Student Roster",
                            "Gradebook", "Assignments", "Performance"
                        ][activeTab]}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Tooltip title="Notifications">
                        <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: "primary.main" }}>
                            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900 } }}>
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Avatar src={user?.photoURL} sx={{ width: 40, height: 40, border: '2px solid rgba(0,0,0,0.05)' }} />
                </Box>
            </Box>

            {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
            {activeTab === 0 && (
                <Box sx={{
                    background: isDark ? "linear-gradient(135deg, #0f1225 0%, #05060f 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    pt: 6, pb: 12, position: "relative", overflow: "hidden",
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <Avatar
                                src={user?.profileImage}
                                sx={{
                                    width: 88, height: 88,
                                    bgcolor: 'primary.main', color: 'white',
                                    fontWeight: 1000, fontSize: '2.2rem',
                                    border: '4px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                                }}
                            >
                                {(user?.name || "S")[0].toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight={1000} color={isDark ? "white" : "text.primary"} sx={{ letterSpacing: -2, fontFamily: 'Outfit, sans-serif' }}>
                                    Welcome, {user?.name?.split(' ')[0] || "Sarah"}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                    Monitoring <span style={{ color: theme.palette.primary.main, fontWeight: 900 }}>{courses.length}</span> Active Modules and <span style={{ color: theme.palette.primary.main, fontWeight: 900 }}>{totalStudents}</span> Students.
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            )}

            <Container maxWidth="lg" sx={{ mt: activeTab === 0 ? -6 : 4, pb: 10, position: 'relative', zIndex: 1 }}>
                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        {stats.map((s, i) => <Grid item xs={12} sm={6} md={3} key={i}><StatCard stat={s} /></Grid>)}

                        <Grid item xs={12} md={8}>
                            <Card sx={{ ...glassStyle, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Grading Operations</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>RECENT EVALUATIONS</Typography>
                                        </Box>
                                        <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 900, px: 3 }}>View All Log</Button>
                                    </Box>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                {recentGrades.map((row, i) => (
                                                    <TableRow key={i} sx={{ '& td, & th': { borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
                                                        <TableCell sx={{ py: 2 }}><Typography variant="subtitle2" fontWeight={800} color="white">{row.student}</Typography></TableCell>
                                                        <TableCell sx={{ py: 2 }}><Chip label={row.course} size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", fontWeight: 800, fontSize: '0.7rem' }} /></TableCell>
                                                        <TableCell sx={{ py: 2 }}><Typography variant="body2" color="rgba(255,255,255,0.7)" fontWeight={600}>{row.assignment}</Typography></TableCell>
                                                        <TableCell sx={{ py: 2 }} align="right"><Chip label={row.grade} size="small" sx={{ background: gradients[0], color: 'white', fontWeight: 900, fontSize: '0.8rem', minWidth: 40 }} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ ...glassStyle, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Action Items</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>PENDING TASKS</Typography>
                                    </Box>
                                    <List sx={{ p: 0 }}>
                                        {pendingItems.map((item, i) => (
                                            <ListItem key={i} sx={{
                                                px: 2.5, py: 2, mb: 2, borderRadius: 4,
                                                background: "rgba(255,255,255,0.03)", border: '1px solid rgba(255,255,255,0.08)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                                transition: 'all 0.3s', '&:hover': { background: "rgba(255,255,255,0.06)", transform: 'translateX(4px)' }
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={900} color="white">{item.title}</Typography>
                                                    <Chip label={`${item.count} Left`} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900, bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }} />
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={700}>Due: {item.due}</Typography>
                                                    <Button size="small" sx={{
                                                        textTransform: 'none', fontWeight: 900, fontSize: '0.75rem', px: 2,
                                                        background: 'white', color: 'black', '&:hover': { background: '#f8fafc' }, borderRadius: 2
                                                    }}>Evaluate</Button>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* ── ATTENDANCE TAB ─────────────────────────────────────────────── */}
                {activeTab === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Attendance Oracle</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>CHRONOLOGICAL TRACKING</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <TextField
                                        select
                                        size="small"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                                    >
                                        {courses.map(c => <MenuItem key={c.code} value={c.code}>{c.code} - {c.name}</MenuItem>)}
                                    </TextField>
                                    <TextField
                                        type="date"
                                        size="small"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        startIcon={<Save />} 
                                        onClick={handleSaveAttendance}
                                        sx={{ borderRadius: 3, background: gradients[1], fontWeight: 800 }}
                                    >
                                        Save Log
                                    </Button>
                                </Box>
                            </Box>
                            <TableContainer sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>STUDENT</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>ID</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 900, color: 'text.secondary' }}>STATUS</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary' }}>ACTIONS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStudents.filter(s => (s.courses || []).includes(selectedCourse) || s.course === selectedCourse).map((s) => (
                                            <TableRow key={s.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                                <TableCell sx={{ py: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>{s.name[0]}</Avatar>
                                                        <Typography variant="subtitle2" fontWeight={800}>{s.name || s.username}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{s.id.slice(-6)}</TableCell>
                                                <TableCell align="center">
                                                    <FormControlLabel
                                                        control={<Checkbox 
                                                            checked={attendanceData[s.id] || false} 
                                                            onChange={(e) => setAttendanceData({...attendanceData, [s.id]: e.target.checked})}
                                                            sx={{ color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: '#10b981' } }}
                                                        />}
                                                        label={attendanceData[s.id] ? "Present" : "Absent"}
                                                        sx={{ '& .MuiFormControlLabel-label': { fontWeight: 800, fontSize: '0.85rem', color: attendanceData[s.id] ? '#10b981' : 'text.secondary' } }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" sx={{ color: 'text.secondary' }}><MoreVertIcon /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Box>
                )}

                {/* ── COURSE UNITS TAB ────────────────────────────────────────────── */}
                {activeTab === 2 && (
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                        {courses.map((course, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Card sx={{ ...glassStyle, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                                    <Box sx={{ height: 120, background: course.color, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <Typography variant="h6" fontWeight={900} color="white">{course.code}</Typography>
                                        <Typography variant="body2" color="rgba(255,255,255,0.8)" fontWeight={700}>{course.name}</Typography>
                                    </Box>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={900}>ENROLLMENT</Typography>
                                                <Typography variant="h6" fontWeight={900}>{course.students}/{course.enrolled}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={900}>CREDITS</Typography>
                                                <Typography variant="h6" fontWeight={900}>{course.credits || 3}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ mb: 1, display: 'block' }}>RESOURCES</Typography>
                                        <List size="small">
                                            <ListItem sx={{ px: 0, py: 0.5 }}>
                                                <ListItemText primary="Syllabus.pdf" primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} />
                                                <IconButton size="small"><FileDownload sx={{ fontSize: 18 }} /></IconButton>
                                            </ListItem>
                                            <ListItem sx={{ px: 0, py: 0.5 }}>
                                                <ListItemText primary="Lecture_01_Intro.pptx" primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} />
                                                <IconButton size="small"><FileDownload sx={{ fontSize: 18 }} /></IconButton>
                                            </ListItem>
                                        </List>
                                        <Button fullWidth variant="outlined" startIcon={<CloudUpload />} sx={{ mt: 2, borderRadius: 3, borderStyle: 'dashed', textTransform: 'none', fontWeight: 900 }}>Upload Material</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* ── ROSTER TAB ──────────────────────────────────────────────────── */}
                {activeTab === 3 && (
                    <Box sx={{ mt: 3 }}>
                        <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Student Roster</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>ACADEMIC TALENT LIST</Typography>
                                </Box>
                                <TextField
                                    placeholder="Search by name or ID..."
                                    variant="outlined"
                                    size="small"
                                    InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
                                    sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                                />
                            </Box>
                            <TableContainer sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>STUDENT</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>COURSE</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>PROGRESS</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>STATUS</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary' }}>ACTIONS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStudents.filter(s => (s.courses || []).includes(selectedCourse) || s.course === selectedCourse).map((s) => (
                                            <TableRow key={s.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 900 }}>{s.name ? s.name[0] : 'S'}</Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={900}>{s.name || s.username}</Typography>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{s.id.slice(-8)}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Chip label={selectedCourse} size="small" sx={{ fontWeight: 900, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} /></TableCell>
                                                <TableCell sx={{ minWidth: 150 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress variant="determinate" value={s.progress || 0} sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }} />
                                                        <Typography variant="caption" fontWeight={900}>{s.progress || 0}%</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={s.status || 'Active'} 
                                                        size="small" 
                                                        sx={{ 
                                                            fontWeight: 900, 
                                                            bgcolor: (s.status === 'Active' || !s.status) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                            color: (s.status === 'Active' || !s.status) ? '#34d399' : '#f87171'
                                                        }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none' }}>View File</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Box>
                )}

                {/* ── GRADEBOOK TAB ───────────────────────────────────────────────── */}
                {activeTab === 4 && (
                    <Box sx={{ mt: 3 }}>
                        <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Evaluation Matrix</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>GRADEBOOK MANAGEMENT</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        select
                                        size="small"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' } }}
                                    >
                                        {courses.map(c => <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>)}
                                    </TextField>
                                    <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 3, background: gradients[2], fontWeight: 800 }}>New Entry</Button>
                                </Box>
                            </Box>
                            <TableContainer sx={{ borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>STUDENT</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>ATTENDANCE</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>MIDTERM</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>FINAL</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.secondary' }}>OVERALL</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary' }}>GRADE</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStudents.filter(s => (s.courses || []).includes(selectedCourse) || s.course === selectedCourse).map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Typography variant="subtitle2" fontWeight={800}>{s.name || s.username}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{s.id.slice(-8)}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>{s.attendance}%</TableCell>
                                                <TableCell><TextField placeholder="--" size="small" variant="standard" sx={{ width: 40, '& .MuiInput-input': { fontWeight: 900, textAlign: 'center' } }} /></TableCell>
                                                <TableCell><TextField placeholder="--" size="small" variant="standard" sx={{ width: 40, '& .MuiInput-input': { fontWeight: 900, textAlign: 'center' } }} /></TableCell>
                                                <TableCell sx={{ fontWeight: 900 }}>{s.progress}%</TableCell>
                                                <TableCell align="right">
                                                    <Chip label={s.grade} size="small" sx={{ background: gradients[0], color: 'white', fontWeight: 900, minWidth: 35 }} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Box>
                )}

                {/* ── ASSIGNMENTS TAB ────────────────────────────────────────────── */}
                {activeTab === 5 && (
                    <Box sx={{ mt: 3 }}>
                        <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Task Command</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>ASSIGNMENT DEPLOYMENT</Typography>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    startIcon={<Add />} 
                                    onClick={() => setOpenAssignmentDialog(true)}
                                    sx={{ borderRadius: 3, background: gradients[3], fontWeight: 800 }}
                                >
                                    Deploy Task
                                </Button>
                            </Box>
                            
                            <Grid container spacing={3}>
                                {pendingItems.map((item, idx) => (
                                    <Grid item xs={12} key={idx}>
                                        <Card sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <Chip label={item.course} size="small" sx={{ fontWeight: 900, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                                                        <Typography variant="h6" fontWeight={900}>{item.title}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Deadline: {item.due} · Total Points: 100</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h5" fontWeight={1000}>{item.count}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={900}>SUBMISSIONS</Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ my: 2, opacity: 0.1 }} />
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button size="small" startIcon={<Visibility />} sx={{ fontWeight: 800, textTransform: 'none' }}>View Submissions</Button>
                                                <Button size="small" startIcon={<Edit />} sx={{ fontWeight: 800, textTransform: 'none' }}>Edit Task</Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>

                        {/* Task Deployment Dialog */}
                        <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 6, minWidth: 500 } }}>
                            <DialogTitle sx={{ fontWeight: 1000, fontFamily: 'Outfit, sans-serif' }}>Deploy New Task</DialogTitle>
                            <DialogContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Select Course"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    >
                                        {courses.map(c => <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>)}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        label="Task Title"
                                        variant="outlined"
                                        value={assignmentForm.title}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={assignmentForm.description}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Deadline"
                                            value={assignmentForm.deadline}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Marks"
                                            value={assignmentForm.marks}
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, marks: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                    </Box>

                                    <Box sx={{
                                        p: 3,
                                        border: '2px dashed rgba(255,255,255,0.1)',
                                        borderRadius: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                        bgcolor: 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'primary.main' }
                                    }} component="label">
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => setAssignmentForm({ ...assignmentForm, file: e.target.files[0] })}
                                        />
                                        <CloudUpload sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="subtitle2" fontWeight={800}>
                                                {assignmentForm.file ? assignmentForm.file.name : "Click to upload assignment resources"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                PDF, ZIP, DOCX supported (Max 50MB)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ p: 3 }}>
                                <Button onClick={() => setOpenAssignmentDialog(false)} sx={{ fontWeight: 800, color: 'text.secondary' }}>Abort</Button>
                                <Button variant="contained" sx={{ borderRadius: 3, background: gradients[1], fontWeight: 800, px: 4 }}>Deploy Task</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}

                {/* ── ANALYTICS TAB ───────────────────────────────────────────────── */}
                {activeTab === 6 && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 4 }}>Performance Trend</Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { name: 'Week 1', avg: 72 },
                                                { name: 'Week 2', avg: 75 },
                                                { name: 'Week 3', avg: 68 },
                                                { name: 'Week 4', avg: 82 },
                                                { name: 'Week 5', avg: 78 },
                                                { name: 'Week 6', avg: 85 },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                                                <YAxis stroke="rgba(255,255,255,0.3)" />
                                                <ChartTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                                <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 4 }}>Grade Spectrum</Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={gradeDistData}
                                                    dataKey="count"
                                                    nameKey="grade"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    paddingAngle={5}
                                                >
                                                    {gradeDistData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Legend />
                                                <ChartTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    </Box>
    );
}
