import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Grid, Card, CardContent, Typography, Box, Button,
    Avatar, Chip, List, ListItem, ListItemText, Divider, LinearProgress,
    IconButton, Tab, Tabs, Badge, Tooltip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel, Select, Checkbox, FormControlLabel, Fade, Slide, Zoom,
    useTheme, alpha, Drawer, useMediaQuery, Stack
} from "@mui/material";
import {
    School, People, Assignment, Grade, Logout, EmojiEvents,
    LightMode, DarkMode, Notifications, Dashboard, Campaign,
    CheckCircle, AccessTime, TrendingUp, MenuBook, Star,
    CalendarMonth, Edit, Add, PersonOutline, BarChart,
    CloudUpload, FileDownload, Save, FilterList, Search,
    Visibility, Close, CheckCircleOutline, HighlightOff,
    ChevronLeft, ChevronRight, LibraryBooks, AssignmentInd,
    AccountBalance, SwapHoriz, Schedule, Menu as MenuIcon, LockReset,
    Terminal, Hub, Security, Layers, AutoAwesome
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import {
    coursesAPI, usersAPI, attendanceAPI,
    assignmentsAPI, announcementsAPI
} from "../../services/api";

// Import modular tabs
import { OverviewTab, AttendanceTab, RosterTab, GradeTab, AssignmentTab, ProfileTab } from "./tabs";

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

// 13 Modules from the Lecturer Portal Roadmap
const NAV_ITEMS = [
    { label: "Overview", icon: <Dashboard />, idx: 0 }, // Not in the original list but necessary for landing
    { label: "Profile & Account", icon: <PersonOutline />, idx: 1 },
    { label: "Course Management", icon: <LibraryBooks />, idx: 2 },
    { label: "Course Materials", icon: <CloudUpload />, idx: 3 },
    { label: "Assignments & Assessments", icon: <Assignment />, idx: 4 },
    { label: "Attendance", icon: <CalendarMonth />, idx: 5 },
    { label: "Grading & Results", icon: <Grade />, idx: 6 },
    { label: "Communication", icon: <Campaign />, idx: 7 },
    { label: "Schedule & Calendar", icon: <Schedule />, idx: 8 },
    { label: "Student Management", icon: <People />, idx: 9 },
    { label: "Leave & Workload", icon: <AssignmentInd />, idx: 10 },
    { label: "Research", icon: <Hub />, idx: 11 },
    { label: "Reports & Analytics", icon: <BarChart />, idx: 12 },
    { label: "Notifications", icon: <Notifications />, idx: 13 },
];

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
            }
        };

        syncMatrix();
    }, [user?.id]);

    /* ── Aggregation Logic ───────────────────────────────────────────── */
    const metrics = useMemo(() => {
        const totalStudents = students.length;
        const activeCourses = courses.length;
        const totalAssignments = assignments.length;
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
                {NAV_ITEMS.map(item => (
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
                        {activeTab === 0 && <OverviewTab user={user} metrics={metrics} performanceData={performanceData} recentComms={recentComms} />}
                        {activeTab === 1 && <ProfileTab user={user} />}
                        {activeTab === 4 && <AssignmentTab assignments={assignments} setAssignDialogOpen={setAssignDialogOpen} />}
                        {activeTab === 5 && (
                            <AttendanceTab
                                courses={courses} selectedCourseId={selectedCourseId} setSelectedCourseId={setSelectedCourseId}
                                attendanceDate={attendanceDate} setAttendanceDate={setAttendanceDate} handleSaveAttendance={handleSaveAttendance}
                                students={students} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog}
                            />
                        )}
                        {activeTab === 6 && <GradeTab />}
                        {activeTab === 9 && <RosterTab students={students} />}
                        {/* Placeholder for un-implemented tabs */}
                        {![0, 1, 4, 5, 6, 9].includes(activeTab) && (
                            <Box sx={{ textAlign: "center", py: 20, opacity: 0.5 }}>
                                <Typography variant="h4" fontWeight={1000}>Module Offline</Typography>
                                <Typography variant="body1">This sector is currently undergoing engineering enhancements according to the Lecturer Roadmap Phase specs.</Typography>
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
