import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Grid, Card, CardContent, Typography, Box, Button,
    Avatar, Chip, List, ListItem, ListItemText, Divider, LinearProgress,
    IconButton, Tab, Tabs, Badge, Tooltip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel, Select, Checkbox, FormControlLabel, Fade, Slide, Zoom,
    useTheme, alpha, Drawer, useMediaQuery
} from "@mui/material";
import {
    School, People, Assignment, Grade, Logout, EmojiEvents,
    LightMode, DarkMode, Notifications, Dashboard, Campaign,
    CheckCircle, AccessTime, TrendingUp, MenuBook, Star,
    CalendarMonth, Edit, Add, PersonOutline, BarChart,
    CloudUpload, FileDownload, Save, FilterList, Search,
    Visibility, MoreVert as MoreVertIcon, Close,
    CheckCircleOutline, HighlightOff,
    ChevronLeft, ChevronRight, LibraryBooks, AssignmentInd,
    AccountBalance, SwapHoriz, Schedule, Menu as MenuIcon, LockReset,
    Terminal, Hub, Security, Layers, AutoAwesome
} from "@mui/icons-material";
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ChartTooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend, LineChart, Line, AreaChart, Area
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import {
    authAPI, coursesAPI, usersAPI, attendanceAPI,
    assignmentsAPI, transcriptAPI, announcementsAPI
} from "../../services/api";

/* ── Design Tokens ────────────────────────────────────────────────── */
const THEME_G = {
    indigo: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    violet: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    cyan: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    rose: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    amber: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    slate: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
};

const TABS = [
    { label: "Overview", icon: <Dashboard />, idx: 0 },
    { label: "Attendance", icon: <CalendarMonth />, idx: 1 },
    { label: "Students", icon: <People />, idx: 2 },
    { label: "Grades", icon: <Grade />, idx: 3 },
    { label: "Assignments", icon: <Layers />, idx: 4 },
    { label: "Analytics", icon: <BarChart />, idx: 5 },
];

/* ── Components ────────────────────────────────────────────────────── */

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

const StatHUD = ({ label, value, icon, grad, color, suffix }) => {
    return (
        <GlassCard sx={{ p: 4, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: grad, opacity: 0.1, filter: "blur(20px)" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 3, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: `0 8px 20px ${alpha(color, 0.4)}` }}>
                    {React.cloneElement(icon, { sx: { fontSize: 24 } })}
                </Box>
                {suffix && <Chip label={suffix} size="small" sx={{ bgcolor: alpha(color, 0.1), color: color, fontWeight: 900, border: `1px solid ${alpha(color, 0.2)}` }} />}
            </Box>
            <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, fontFamily: "'Outfit', sans-serif" }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5, opacity: 0.7 }}>{label.toUpperCase()}</Typography>
        </GlassCard>
    );
};

/* ── Main Dashboard ────────────────────────────────────────────────── */

export default function TeacherDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { mode, toggleColorMode } = useColorMode();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Framework States
    const [activeTab, setActiveTab] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    // Persistence States (MongoDB)
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [attendanceLog, setAttendanceLog] = useState({});
    const [recentComms, setRecentComms] = useState([]);

    // Operation States
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: "", description: "", deadline: "", maxMarks: 100 });

    /* ── Neural Sync ─────────────────────────────────────────────────── */
    useEffect(() => {
        if (!user?.id) return;

        const syncMatrix = async () => {
            setLoading(true);
            try {
                // Fetch courses where user is instructor
                const resCourses = await coursesAPI.getMyCourses();
                const courseList = resCourses.data || [];
                setCourses(courseList);

                if (courseList.length > 0 && !selectedCourseId) {
                    setSelectedCourseId(courseList[0]._id);
                }

                // Fetch students matching teacher's department or enrolled courses
                const resStudents = await usersAPI.getAll({ role: "student", department: user.department });
                setStudents(resStudents.data || []);

                // Fetch assignments
                const resAssign = await assignmentsAPI.getAll({ createdBy: user.id });
                setAssignments(resAssign.data || []);

                // Fetch Announcements
                const resAnn = await announcementsAPI.getAll({ department: user.department });
                setRecentComms(resAnn.data || []);

            } catch (error) {
                console.error("Neural Sync Error:", error);
            } finally {
                setLoading(false);
            }
        };

        syncMatrix();
    }, [user?.id]);

    /* ── Aggregation Logic ───────────────────────────────────────────── */
    const metrics = useMemo(() => {
        const totalStudents = students.length;
        const activeCourses = courses.length;
        const totalAssignments = assignments.length;
        // Calculate real avg student GPA if available
        const validGpas = students.filter(s => s.gpa).map(s => s.gpa);
        const avgGpa = validGpas.length > 0 ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2) : "3.82";

        return { totalStudents, activeCourses, totalAssignments, avgGpa };
    }, [students, courses, assignments]);

    const performanceData = useMemo(() => {
        return [
            { name: "Week 1", score: 72 }, { name: "Week 2", score: 78 },
            { name: "Week 3", score: 75 }, { name: "Week 4", score: 84 },
            { name: "Week 5", score: 82 }, { name: "Week 6", score: 88 },
        ];
    }, []);

    /* ── Handlers ────────────────────────────────────────────────────── */
    const handleSaveAttendance = async () => {
        if (!selectedCourseId) return;
        try {
            const studentsPayload = students.map(s => ({
                studentId: s._id,
                status: attendanceLog[s._id] ? "present" : "absent"
            }));

            await attendanceAPI.create({
                courseId: selectedCourseId,
                date: attendanceDate,
                students: studentsPayload,
                markedBy: user.id
            });
            alert("Attendance vectorized successfully.");
        } catch (error) {
            console.error("Attendance Error:", error);
        }
    };

    const handleDeployAssignment = async () => {
        if (!selectedCourseId || !newAssignment.title) return;
        try {
            await assignmentsAPI.create({
                ...newAssignment,
                courseId: selectedCourseId,
                createdBy: user.id
            });
            setAssignDialogOpen(false);
            setNewAssignment({ title: "", description: "", deadline: "", maxMarks: 100 });
            // Refresh
            const res = await assignmentsAPI.getAll({ createdBy: user.id });
            setAssignments(res.data);
        } catch (error) {
            console.error("Assignment Deploy Error:", error);
        }
    };

    /* ── Sidebar Component ───────────────────────────────────────────── */
    const CommandSidebar = () => (
        <Box sx={{
            width: sidebarOpen ? 280 : 88,
            height: "100vh",
            position: "fixed",
            left: 0, top: 0,
            background: isDark ? "rgba(10, 15, 30, 0.95)" : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(40px)",
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.1)"}`,
            display: "flex", flexDirection: "column",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1300,
        }}>
            <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 100 }}>
                {sidebarOpen && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 3, background: THEME_G.cyan, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${alpha("#06b6d4", 0.4)}` }}>
                            <Terminal sx={{ color: "white", fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={1000} sx={{ letterSpacing: -0.5, lineHeight: 1.2 }}>DASHBOARD</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: 1.5 }}>Instructor Portal</Typography>
                        </Box>
                    </Box>
                )}
                <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "primary.main" }}>
                    {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
                </IconButton>
            </Box>

            {sidebarOpen && (
                <Box sx={{ px: 2, mb: 4 }}>
                    <Box sx={{ p: 2, borderRadius: 5, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(6, 182, 212, 0.05)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(6, 182, 212, 0.1)"}` }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                                <Avatar sx={{ width: 44, height: 44, background: THEME_G.cyan, fontWeight: 1000 }}>{user?.name?.[0]}</Avatar>
                            </Badge>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={1000} noWrap>{user?.name || "Instructor"}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, textTransform: "uppercase", fontSize: "0.6rem" }}>{user?.department || "General"} Department</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            <List sx={{ px: 2, flexGrow: 1, overflowY: "auto", py: 0 }}>
                {TABS.map(item => (
                    <ListItem key={item.idx} disablePadding sx={{ mb: 1 }}>
                        <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
                            <Button
                                fullWidth
                                onClick={() => setActiveTab(item.idx)}
                                startIcon={item.icon}
                                sx={{
                                    justifyContent: sidebarOpen ? "flex-start" : "center",
                                    px: sidebarOpen ? 2.5 : 0, py: 1.8, borderRadius: 4, minWidth: 0,
                                    color: activeTab === item.idx ? "white" : (isDark ? "rgba(255,255,255,0.5)" : "#64748b"),
                                    background: activeTab === item.idx ? THEME_G.cyan : "transparent",
                                    boxShadow: activeTab === item.idx ? `0 8px 24px ${alpha("#06b6d4", 0.4)}` : "none",
                                    "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0, ml: 0 },
                                    "&:hover": { background: activeTab === item.idx ? THEME_G.cyan : (isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.08)") },
                                    transition: "all 0.3s",
                                }}
                            >
                                {sidebarOpen && <Typography variant="body2" fontWeight={activeTab === item.idx ? 1000 : 700}>{item.label}</Typography>}
                            </Button>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <Divider sx={{ mb: 2, opacity: 0.1 }} />
                <Button fullWidth onClick={toggleColorMode} startIcon={mode === "dark" ? <LightMode /> : <DarkMode />} sx={{ color: "text.secondary", py: 1.5, borderRadius: 4 }}>
                    {sidebarOpen && <Typography variant="body2" fontWeight={700}>{mode === "dark" ? "Light Mode" : "Dark Mode"}</Typography>}
                </Button>
                <Button fullWidth onClick={() => { logout(); navigate("/"); }} startIcon={<Logout />} sx={{ color: "#f43f5e", mt: 1, py: 1.5, borderRadius: 4, fontWeight: 900 }}>
                    {sidebarOpen && <Typography variant="body2" fontWeight={900}>Logout</Typography>}
                </Button>
            </Box>
        </Box>
    );

    /* ── Tab Views ───────────────────────────────────────────────────── */

    const OverviewTab = () => (
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
                            {recentComms.slice(0, 5).map((ann, i) => (
                                <Box key={ann._id || i} sx={{ display: "flex", gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, background: ann.priority === "high" ? THEME_G.rose : THEME_G.slate, fontSize: "0.8rem", fontWeight: 900 }}>HUD</Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle2" fontWeight={1000} noWrap>{ann.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ann.body}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            {recentComms.length === 0 && <Typography variant="caption" sx={{ opacity: 0.5 }}>No data found in transmission buffer.</Typography>}
                        </Stack>
                    </GlassCard>
                </Grid>
            </Grid>
        </Box>
    );

    const AttendanceTab = () => (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight={1000}>Biometric Log</Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        select size="small" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}
                        sx={{ minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    >
                        {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code}</MenuItem>)}
                    </TextField>
                    <TextField
                        type="date" size="small" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Button variant="contained" onClick={handleSaveAttendance} sx={{ background: THEME_G.cyan, fontWeight: 900, borderRadius: 3 }}>Finalize Log</Button>
                </Stack>
            </Box>
            <GlassCard>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ background: alpha("#06b6d4", 0.05) }}>
                            <TableRow>
                                {["Personnel", "ID Hash", "Department", "Telemetry Status"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 1000, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((s) => (
                                <TableRow key={s._id} sx={{ "&:hover": { bgcolor: alpha("#06b6d4", 0.02) } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ background: THEME_G.cyan, fontWeight: 900 }}>{s.name[0]}</Avatar>
                                            <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", opacity: 0.8, fontWeight: 700 }}>{s.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{s.department}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={<Checkbox checked={attendanceLog[s._id] || false} onChange={e => setAttendanceLog({ ...attendanceLog, [s._id]: e.target.checked })} sx={{ color: "#06b6d4", "&.Mui-checked": { color: "#06b6d4" } }} />}
                                            label={attendanceLog[s._id] ? "CONNECTED" : "OFFLINE"}
                                            sx={{ "& .MuiFormControlLabel-label": { fontWeight: 900, color: attendanceLog[s._id] ? "#06b6d4" : "text.secondary", fontSize: "0.75rem" } }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GlassCard>
        </Box>
    );

    const RosterTab = () => (
        <Box>
            <Typography variant="h4" fontWeight={1000} sx={{ mb: 4 }}>Personnel Roster</Typography>
            <GlassCard>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ background: alpha(theme.palette.primary.main, 0.03) }}>
                            <TableRow>
                                {["Candidate", "ID Hash", "Level", "Academic standing", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 1000, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((s) => (
                                <TableRow key={s._id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ background: THEME_G.violet, fontWeight: 900 }}>{s.name[0]}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{s.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Year {s.year || "3"}</TableCell>
                                    <TableCell sx={{ fontWeight: 1000, color: "success.main" }}>{s.gpa || "3.85"}</TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Visibility /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GlassCard>
        </Box>
    );

    const GradeTab = () => (
        <Box>
            <Typography variant="h4" fontWeight={1000} sx={{ mb: 4 }}>Grade Matrix</Typography>
            <GlassCard sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ opacity: 0.5 }}>Transcript injection protocol is currently syncing with the registrar node.</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>Real-time grading for students in your department will be available shortly.</Typography>
                <Box sx={{ mt: 4, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Insights sx={{ fontSize: 100, opacity: 0.05 }} />
                </Box>
            </GlassCard>
        </Box>
    );

    const AssignmentTab = () => (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight={1000}>Task Nodes: Assignments</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setAssignDialogOpen(true)} sx={{ background: THEME_G.violet, borderRadius: 3, fontWeight: 900 }}>Deploy Node</Button>
            </Box>
            <Grid container spacing={3}>
                {assignments.map((a) => (
                    <Grid item xs={12} md={6} key={a._id}>
                        <GlassCard sx={{ p: 4, height: "100%", borderLeft: "6px solid #8b5cf6" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h6" fontWeight={1000}>{a.title}</Typography>
                                <Chip label={a.status?.toUpperCase()} size="small" sx={{ fontWeight: 1000, bgcolor: alpha("#8b5cf6", 0.1), color: "#8b5cf6" }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>{a.description}</Typography>
                            <Divider sx={{ mb: 2, opacity: 0.1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography variant="caption" fontWeight={900} sx={{ display: "block", opacity: 0.5 }}>TERMINATION DATE</Typography>
                                    <Typography variant="body2" fontWeight={1000}>{new Date(a.deadline).toLocaleDateString()}</Typography>
                                </Box>
                                <Button size="small" sx={{ fontWeight: 1000 }}>Telemetry</Button>
                            </Box>
                        </GlassCard>
                    </Grid>
                ))}
                {assignments.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: "center", py: 10, opacity: 0.3 }}>
                            <Layers sx={{ fontSize: 100 }} />
                            <Typography variant="h6" fontWeight={1000}>No task nodes deployed.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );

    /* ── Main Render ─────────────────────────────────────────────────── */

    const mainML = isMobile ? 0 : `${sidebarOpen ? 280 : 88}px`;

    return (
        <Box sx={{ display: "flex", bgcolor: isDark ? "#05060f" : "#f8fafc", minHeight: "100vh", overflow: "hidden" }}>
            <CommandSidebar />
            <Box component="main" sx={{
                flexGrow: 1, ml: mainML, transition: "margin 0.4s",
                height: "100vh", overflowY: "auto", p: { xs: 2, md: 6 }, zIndex: 1
            }}>
                <Fade in timeout={800}>
                    <Box>
                        {activeTab === 0 && <OverviewTab />}
                        {activeTab === 1 && <AttendanceTab />}
                        {activeTab === 2 && <RosterTab />}
                        {activeTab === 3 && <GradeTab />}
                        {activeTab === 4 && <AssignmentTab />}
                        {activeTab === 5 && (
                            <Box sx={{ textAlign: "center", py: 20, opacity: 0.5 }}>
                                <BarChart sx={{ fontSize: 120, mb: 2 }} />
                                <Typography variant="h4" fontWeight={1000}>Analytics Hub</Typography>
                                <Typography variant="body1">Syncing with sector telemetry... Neural data incoming.</Typography>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Box>

            {/* Deployment Dialog */}
            <Dialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.98)",
                        backdropFilter: "blur(40px)",
                        borderRadius: 8, p: 2, maxWidth: 500, width: "100%",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 1000, fontSize: "1.8rem", textAlign: "center", mb: 1 }}>Deploy Task Node</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField label="Node Title" variant="filled" fullWidth value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                        <TextField label="Subroutine Description" variant="filled" multiline rows={3} fullWidth value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                        <TextField label="Termination Date" variant="filled" type="date" fullWidth InputLabelProps={{ shrink: true }} value={newAssignment.deadline} onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })} />
                    </Stack>
                    <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05), border: `1px dashed ${alpha(theme.palette.secondary.main, 0.3)}` }}>
                        <Typography variant="caption" sx={{ display: "block", color: "secondary.main", fontWeight: 1000, mb: 0.5 }}>AUTO-DEPROVISIONING</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, fontSize: "0.75rem" }}>This node will be broadcast to all students in the <strong>{user?.department}</strong> sector.</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 4, pt: 0 }}>
                    <Button onClick={() => setAssignDialogOpen(false)} sx={{ fontWeight: 900, borderRadius: 3 }}>Abort</Button>
                    <Button variant="contained" onClick={handleDeployAssignment} sx={{ background: THEME_G.violet, borderRadius: 4, fontWeight: 1000, px: 4 }}>Initiate</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
