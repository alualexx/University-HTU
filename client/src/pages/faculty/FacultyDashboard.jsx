import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Box, Button, Avatar, Chip,
  Divider, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, List, ListItem, ListItemText,
  Tooltip, Stack, Badge, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, useTheme, alpha, Drawer, useMediaQuery,
} from "@mui/material";
import {
  Business, People, School, Assignment, TrendingUp, Assessment,
  Notifications, LightMode, DarkMode, Logout, Dashboard, Groups,
  Settings, CheckCircle, Cancel, Visibility, Search, Grade,
  CalendarToday, ChevronLeft, ChevronRight, Menu as MenuIcon,
  Add as AddIcon, Send as SendIcon, LibraryBooks, SupportAgent,
  Computer, Delete, Edit as EditIcon, Science, AccountBalance,
  EmojiEvents, Announcement, BarChart as BarChartIcon, Close,
  LockReset, Campaign, Public,
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { authAPI, coursesAPI, usersAPI, departmentsAPI, announcementsAPI, researchAPI } from "../../services/api";

/* ── Theme ─────────────────────────────────────────────────────────── */
const g = {
  primary:   "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  secondary: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  success:   "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  warning:   "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  danger:    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  teal:      "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
};

const TABS = [
  { label: "Overview",      icon: <Dashboard />,     idx: 0 },
  { label: "Departments",   icon: <Business />,      idx: 1 },
  { label: "Faculty",       icon: <Groups />,        idx: 2 },
  { label: "Students",      icon: <People />,        idx: 3 },
  { label: "Courses",       icon: <LibraryBooks />,  idx: 4 },
  { label: "Research",      icon: <Science />,       idx: 5 },
  { label: "Announcements", icon: <Campaign />,      idx: 6 },
];

/* ── Stat Card ──────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, grad, chip }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Card sx={{
      borderRadius: 4,
      background: isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.85)",
      backdropFilter: "blur(20px)",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(99,102,241,0.12)",
      boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(99,102,241,0.08)",
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.4)" : "0 16px 40px rgba(99,102,241,0.15)" },
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}>
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          </Box>
          {chip && <Chip label={chip} size="small" sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", fontWeight: 900, fontSize: "0.7rem" }} />}
        </Box>
        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1.5, mb: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>{label}</Typography>
      </CardContent>
    </Card>
  );
}

/* ── Main ───────────────────────────────────────────────────────────── */
export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data
  const [courses, setCourses]           = useState([]);
  const [faculty, setFaculty]           = useState([]);
  const [students, setStudents]         = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [research, setResearch]         = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [loading, setLoading]           = useState(true);

  // Dialogs
  const [addCourseOpen, setAddCourseOpen]         = useState(false);
  const [addAnnouncementOpen, setAddAnnouncementOpen] = useState(false);
  const [addResearchOpen, setAddResearchOpen]     = useState(false);
  const [newCourse, setNewCourse]   = useState({ code: "", name: "", credits: 3 });
  const [newAnn, setNewAnn]         = useState({ title: "", body: "", priority: "normal" });
  const [newResearch, setNewResearch] = useState({ title: "", pi: "", grant: "", status: "Active" });

  const glassStyle = {
    background: isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(99,102,241,0.12)",
    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(99,102,241,0.08)",
  };

  /* ── Fetch Data ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const dept = user?.department || "";
        
        const [resCourses, resFaculty, resStudents, resDepts, resAnn, resResearch] = await Promise.all([
          coursesAPI.getAll({ department: dept }),
          usersAPI.getAll({ role: "teacher", department: dept }),
          usersAPI.getAll({ role: "student" }),
          departmentsAPI.getAll(),
          announcementsAPI.getAll({ department: dept }),
          researchAPI.getAll({ department: dept }),
        ]);

        setCourses(resCourses.data);
        setFaculty(resFaculty.data);
        setStudents(resStudents.data);
        setDepartments(resDepts.data);
        setAnnouncements(resAnn.data);
        setResearch(resResearch.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, user?.department]);

  /* ── Handlers ──────────────────────────────────────────────────────── */
  const handleLogout = async () => { await logout(); navigate("/"); };

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.name) return;
    try {
      await coursesAPI.create({ ...newCourse, department: user.department, status: "draft" });
      setAddCourseOpen(false); 
      setNewCourse({ code: "", name: "", credits: 3 });
      // Refresh
      const res = await coursesAPI.getAll({ department: user.department });
      setCourses(res.data);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnn.title) return;
    try {
      await announcementsAPI.create({ ...newAnn, targetAudience: "all" });
      setAddAnnouncementOpen(false); 
      setNewAnn({ title: "", body: "", priority: "normal" });
      // Refresh
      const res = await announcementsAPI.getAll({ department: user.department });
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleAddResearch = async () => {
    if (!newResearch.title) return;
    try {
      await researchAPI.create(newResearch);
      setAddResearchOpen(false); 
      setNewResearch({ title: "", pi: "", grant: "", status: "Active" });
      // Refresh
      const res = await researchAPI.getAll({ department: user.department });
      setResearch(res.data);
    } catch (error) {
      console.error("Error adding research project:", error);
    }
  };

  /* ── Sidebar ───────────────────────────────────────────────────────── */
  const Sidebar = () => (
    <Box sx={{
      width: sidebarOpen ? 264 : 72,
      height: "100vh",
      position: "fixed",
      left: 0, top: 0,
      background: isDark ? "linear-gradient(180deg,#0f172a,#020617)" : "linear-gradient(180deg,#ffffff,#f8fafc)",
      backdropFilter: "blur(24px)",
      borderRight: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(99,102,241,0.15)",
      boxShadow: isDark ? "4px 0 24px rgba(0,0,0,0.4)" : "4px 0 24px rgba(99,102,241,0.08)",
      display: "flex", flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      zIndex: 1200,
    }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 72 }}>
        {sidebarOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2.5, background: g.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <School sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={900} color={isDark ? "white" : "#1e293b"} noWrap>College Portal</Typography>
              <Typography variant="caption" sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b", fontSize: "0.65rem", fontWeight: 700 }}>
                {user?.department || "Faculty Office"}
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={() => setSidebarOpen(p => !p)} size="small"
          sx={{ color: isDark ? "rgba(255,255,255,0.7)" : "#64748b", bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.06)", "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.12)" } }}>
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* User Info */}
      {sidebarOpen && (
        <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 3, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.06)", border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(99,102,241,0.1)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, background: g.primary, fontWeight: 900, fontSize: "0.9rem" }}>{(user?.name || "F")[0]}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={800} color={isDark ? "white" : "#1e293b"} noWrap>{user?.name || "Faculty Dean"}</Typography>
              <Typography variant="caption" sx={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b", fontWeight: 700 }}>DEAN / FACULTY HEAD</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ opacity: 0.1 }} />

      {/* Nav */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
        {TABS.map(item => (
          <ListItem key={item.idx} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
              <Button fullWidth onClick={() => setActiveTab(item.idx)}
                startIcon={item.icon}
                sx={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  px: sidebarOpen ? 2 : 0, py: 1.3, borderRadius: 2.5, minWidth: 0,
                  color: activeTab === item.idx ? "white" : (isDark ? "rgba(255,255,255,0.6)" : "#64748b"),
                  background: activeTab === item.idx ? g.primary : "transparent",
                  boxShadow: activeTab === item.idx ? "0 4px 16px rgba(99,102,241,0.35)" : "none",
                  "& .MuiButton-startIcon": { mr: sidebarOpen ? 1.5 : 0 },
                  "&:hover": { background: activeTab === item.idx ? g.primary : (isDark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)") },
                  transition: "all 0.2s",
                }}>
                {sidebarOpen && <Typography variant="body2" fontWeight={activeTab === item.idx ? 800 : 600}>{item.label}</Typography>}
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.5, opacity: 0.1 }} />
        <Tooltip title={!sidebarOpen ? (mode === "dark" ? "Light Mode" : "Dark Mode") : ""} placement="right">
          <Button fullWidth onClick={toggleColorMode} startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: isDark ? "rgba(255,255,255,0.6)" : "#64748b", py: 1.2, borderRadius: 2.5, "& .MuiButton-startIcon": { mr: sidebarOpen ? 1.5 : 0 } }}>
            {sidebarOpen && <Typography variant="body2" fontWeight={600}>{mode === "dark" ? "Light Mode" : "Dark Mode"}</Typography>}
          </Button>
        </Tooltip>
        <Tooltip title={!sidebarOpen ? "Sign Out" : ""} placement="right">
          <Button fullWidth onClick={handleLogout} startIcon={<Logout />}
            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: "#ef4444", py: 1.2, borderRadius: 2.5, mt: 0.5, "& .MuiButton-startIcon": { mr: sidebarOpen ? 1.5 : 0 }, "&:hover": { bgcolor: "rgba(239,68,68,0.08)" } }}>
            {sidebarOpen && <Typography variant="body2" fontWeight={700}>Sign Out</Typography>}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  const mainML = isMobile ? 0 : `${sidebarOpen ? 264 : 72}px`;

  /* ── Overview Tab Data ──────────────────────────────────────────────── */
  const enrollmentData = [
    { month: "Sep", students: 1100 }, { month: "Oct", students: 1250 },
    { month: "Nov", students: 1180 }, { month: "Dec", students: 1320 },
    { month: "Jan", students: 1400 }, { month: "Feb", students: 1380 },
  ];
  const deptPieData = [
    { name: "CS", value: 450, fill: "#6366f1" },
    { name: "Engineering", value: 300, fill: "#3b82f6" },
    { name: "Business", value: 250, fill: "#8b5cf6" },
    { name: "Arts", value: 150, fill: "#14b8a6" },
  ];

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <Box sx={{
      display: "flex", minHeight: "100vh",
      background: isDark ? "linear-gradient(135deg,#05060f,#0f172a)" : "linear-gradient(135deg,#f8fafc,#f1f5f9)",
      position: "relative",
    }}>
      {/* Aurora blobs - light mode only */}
      {!isDark && <>
        <Box sx={{ position: "fixed", top: -120, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
        <Box sx={{ position: "fixed", bottom: -100, left: 100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
      </>}

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: sidebarOpen ? 264 : 72, boxSizing: 'border-box' }
        }}
      >
        <Sidebar />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, ml: mainML, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", position: "relative", zIndex: 1, minWidth: 0 }}>

        {/* ── Top Bar ────────────────────────────────────────────────────── */}
        <Box sx={{
          height: 68, px: 4, display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 1100,
          background: isDark ? alpha("#05060f", 0.85) : alpha("#ffffff", 0.88),
          backdropFilter: "blur(20px)",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(99,102,241,0.1)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => isMobile ? setMobileOpen(true) : setSidebarOpen(p => !p)} size="small"><MenuIcon /></IconButton>
            <Typography variant="h6" fontWeight={900} color={isDark ? "white" : "#1e293b"} sx={{ letterSpacing: -0.5 }}>
              {TABS[activeTab]?.label}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton sx={{ bgcolor: alpha("#6366f1", 0.08), color: "#6366f1" }}>
              <Badge badgeContent={announcements?.length || 0} color="error"><Notifications /></Badge>
            </IconButton>
            <Avatar sx={{ width: 36, height: 36, background: g.primary, fontWeight: 900, fontSize: "0.85rem" }}>{(user?.name || "F")[0]}</Avatar>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>

          {/* ── TAB 0: OVERVIEW ────────────────────────────────────────────── */}
          {activeTab === 0 && (
            <Box>
              {/* Welcome Hero */}
              <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: g.primary, position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <Box sx={{ position: "absolute", bottom: -40, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <Typography variant="h4" fontWeight={900} color="white" sx={{ letterSpacing: -1 }}>
                  Welcome back, {user?.name?.split(" ")[0] || "Dean"} 👋
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.75)" fontWeight={600} sx={{ mt: 1 }}>
                  {user?.department || "College"} — Faculty Control Center &nbsp;·&nbsp; {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </Typography>
              </Box>

              {/* Stat Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  { label: "Total Departments",  value: departments?.length || 0,    icon: <Business />,     grad: g.primary,   chip: "Active" },
                  { label: "Faculty Members",     value: faculty?.length || 0,       icon: <Groups />,       grad: g.secondary, chip: "+3 new" },
                  { label: "Enrolled Students",   value: students?.length || 0,    icon: <People />,       grad: g.success,   chip: "+8.2%" },
                  { label: "Active Courses",      value: courses?.length || 0,       icon: <LibraryBooks />, grad: g.warning,   chip: "Semester" },
                  { label: "Research Projects",   value: research?.length || 0,      icon: <Science />,      grad: g.teal,      chip: "Ongoing" },
                  { label: "Avg. GPA",            value: "3.41",                     icon: <EmojiEvents />,  grad: g.danger,    chip: "▲ 0.1" },
                ].map((s, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}><StatCard {...s} /></Grid>
                ))}
              </Grid>

              {/* Charts */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Enrollment Trend</Typography>
                      <Box sx={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.1)} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
                            <RTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
                            <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ ...glassStyle, borderRadius: 4, height: "100%" }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Students by Dept</Typography>
                      <PieChart width={220} height={200}>
                        <Pie data={deptPieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                          {deptPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ── TAB 1: DEPARTMENTS ─────────────────────────────────────────── */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              {(departments.length ? departments : [
                { id: "1", name: "Computer Science", head: "Dr. Alan Turing", students: 450, faculty: 12, programs: 4, status: "active" },
                { id: "2", name: "Electrical Engineering", head: "Dr. N. Tesla", students: 300, faculty: 10, programs: 3, status: "active" },
                { id: "3", name: "Business Administration", head: "Dr. J. Smith", students: 250, faculty: 8, programs: 5, status: "active" },
                { id: "4", name: "Arts & Humanities", head: "Dr. L. Woolf", students: 150, faculty: 6, programs: 4, status: "active" },
                { id: "5", name: "Mechanical Engineering", head: "Dr. H. Ford", students: 200, faculty: 9, programs: 3, status: "active" },
                { id: "6", name: "Mathematics", head: "Dr. E. Noether", students: 180, faculty: 7, programs: 3, status: "active" },
              ]).map((dept, i) => (
                <Grid item xs={12} sm={6} md={4} key={dept.id || i}>
                  <Card sx={{ ...glassStyle, borderRadius: 4, transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
                    <Box sx={{ height: 6, background: Object.values(g)[i % 6] }} />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: Object.values(g)[i % 6], display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Business sx={{ color: "white", fontSize: 22 }} />
                        </Box>
                        <Chip label={dept.status || "Active"} size="small" sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", fontWeight: 800, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>{dept.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Head: {dept.head || "—"}</Typography>
                      <Divider sx={{ my: 2, opacity: 0.4 }} />
                      <Grid container spacing={2}>
                        {[
                          { label: "Students", val: dept.students || 0 },
                          { label: "Faculty",  val: dept.faculty  || 0 },
                          { label: "Programs", val: dept.programs || 0 },
                        ].map(m => (
                          <Grid item xs={4} key={m.label} sx={{ textAlign: "center" }}>
                            <Typography variant="h6" fontWeight={900}>{m.val}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{m.label}</Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ── TAB 2: FACULTY ─────────────────────────────────────────────── */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={900}>Faculty Members</Typography>
                <Chip label={`${faculty.length || 48} members`} sx={{ background: g.primary, color: "white", fontWeight: 800 }} />
              </Box>
              <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {["Name", "Title", "Department", "Courses", "Students", "Actions"].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(faculty.length ? faculty : [
                        { id: "1", name: "Dr. Alan Turing",  position: "Professor",           department: "Computer Science",      courses: 3, students: 90 },
                        { id: "2", name: "Dr. N. Tesla",     position: "Associate Professor",  department: "Electrical Engineering",courses: 2, students: 60 },
                        { id: "3", name: "Dr. J. Smith",     position: "Lecturer",             department: "Business",              courses: 4, students: 120 },
                        { id: "4", name: "Dr. L. Woolf",     position: "Senior Lecturer",      department: "Arts",                  courses: 3, students: 75 },
                        { id: "5", name: "Dr. H. Ford",      position: "Professor",            department: "Mechanical Eng.",        courses: 2, students: 55 },
                        { id: "6", name: "Dr. E. Noether",   position: "Associate Professor",  department: "Mathematics",           courses: 3, students: 80 },
                      ]).map((f, i) => (
                        <TableRow key={f.id || i} sx={{ "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)" } }}>
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, background: Object.values(g)[i % 6], fontWeight: 900, fontSize: "0.85rem" }}>{(f.name || "F")[0]}</Avatar>
                              <Typography variant="subtitle2" fontWeight={800}>{f.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Chip label={f.position || "Lecturer"} size="small" sx={{ fontWeight: 700, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.07)", color: isDark ? "white" : "#4f46e5" }} /></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{f.department}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{f.courses || 0}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{f.students || 0}</Typography></TableCell>
                          <TableCell>
                            <IconButton size="small" sx={{ color: "primary.main" }}><Visibility sx={{ fontSize: 18 }} /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {/* ── TAB 3: STUDENTS ────────────────────────────────────────────── */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={900}>Student Enrollment</Typography>
                <Chip label={`${students.length || 1240} enrolled`} sx={{ background: g.success, color: "white", fontWeight: 800 }} />
              </Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { label: "Total Enrolled", value: students?.length || 0, grad: g.primary },
                  { label: "Undergraduate",  value: Math.floor((students?.length || 0) * 0.73), grad: g.secondary },
                  { label: "Graduate",       value: Math.floor((students?.length || 0) * 0.27), grad: g.teal },
                  { label: "At Risk",        value: students?.filter(s => s.status === "At Risk")?.length || 0, grad: g.danger },
                ].map((s, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, textAlign: "center", p: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1 }}>
                        <People sx={{ color: "white" }} />
                      </Box>
                      <Typography variant="h5" fontWeight={900}>{s.value}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>{s.label}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Enrollment by Department</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptPieData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.1)} vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <RTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                          {deptPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* ── TAB 4: COURSES ─────────────────────────────────────────────── */}
          {activeTab === 4 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={900}>Courses & Classes</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddCourseOpen(true)}
                  sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none", background: g.primary, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
                  Add Course
                </Button>
              </Box>
              <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {["Code", "Course Name", "Credits", "Instructor", "Students", "Status"].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(courses.length ? courses : [
                        { code: "CS301", name: "Data Structures", credits: 3, instructorName: "Dr. Turing", studentsEnrolled: 45, status: "active" },
                        { code: "CS401", name: "AI & Machine Learning", credits: 3, instructorName: "Dr. Tesla", studentsEnrolled: 38, status: "active" },
                        { code: "BUS201", name: "Business Analytics", credits: 2, instructorName: "Dr. Smith", studentsEnrolled: 60, status: "draft" },
                        { code: "ENG101", name: "Engineering Fundamentals", credits: 4, instructorName: "Dr. Ford", studentsEnrolled: 52, status: "active" },
                        { code: "MATH301", name: "Linear Algebra", credits: 3, instructorName: "Dr. Noether", studentsEnrolled: 40, status: "pending_approval" },
                      ]).map((c, i) => (
                        <TableRow key={c.id || i} sx={{ "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)" } }}>
                          <TableCell><Chip label={c.code} size="small" sx={{ fontWeight: 900, background: Object.values(g)[i % 6], color: "white" }} /></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={800}>{c.name}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{c.credits} cr</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{c.instructorName || "—"}</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>{c.studentsEnrolled || 0}</Typography></TableCell>
                          <TableCell>
                            <Chip label={c.status || "draft"} size="small" sx={{
                              fontWeight: 800, fontSize: "0.7rem",
                              bgcolor: c.status === "active" ? alpha("#10b981", 0.1) : c.status === "pending_approval" ? alpha("#f59e0b", 0.1) : alpha("#94a3b8", 0.1),
                              color: c.status === "active" ? "#10b981" : c.status === "pending_approval" ? "#f59e0b" : "#94a3b8",
                            }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {/* ── TAB 5: RESEARCH ────────────────────────────────────────────── */}
          {activeTab === 5 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={900}>Research & Grants</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddResearchOpen(true)}
                  sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none", background: g.teal, boxShadow: "0 4px 16px rgba(20,184,166,0.35)" }}>
                  New Project
                </Button>
              </Box>
              <Grid container spacing={3}>
                {(research.length ? research : [
                  { id: "1", title: "AI in Medical Diagnostics",       pi: "Dr. Ada Lovelace", grant: "$320,000", status: "Active",   dept: "CS" },
                  { id: "2", title: "Renewable Energy Grid Modeling",   pi: "Dr. N. Tesla",     grant: "$510,000", status: "Active",   dept: "ENG" },
                  { id: "3", title: "Behavioral Economics Study",       pi: "Dr. J. Nash",      grant: "$120,000", status: "Active",   dept: "BUS" },
                  { id: "4", title: "Quantum Computing Algorithms",     pi: "Dr. R. Feynman",   grant: "$790,000", status: "Active",   dept: "CS" },
                  { id: "5", title: "Climate Change & Agriculture",     pi: "Dr. M. Curie",     grant: "$230,000", status: "Pending",  dept: "SCI" },
                  { id: "6", title: "Digital Humanities Archive",       pi: "Dr. L. Woolf",     grant: "$95,000",  status: "Completed", dept: "ARTS" },
                ]).map((r, i) => (
                  <Grid item xs={12} md={6} key={r.id || i}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
                      <Box sx={{ height: 5, background: Object.values(g)[i % 6] }} />
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, background: Object.values(g)[i % 6], display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Science sx={{ color: "white", fontSize: 20 }} />
                          </Box>
                          <Chip label={r.status} size="small" sx={{
                            fontWeight: 800, fontSize: "0.7rem",
                            bgcolor: r.status === "Active" ? alpha("#10b981", 0.1) : r.status === "Completed" ? alpha("#6366f1", 0.1) : alpha("#f59e0b", 0.1),
                            color:  r.status === "Active" ? "#10b981" : r.status === "Completed" ? "#6366f1" : "#f59e0b",
                          }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 0.5 }}>{r.title}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>PI: {r.pi || "—"}</Typography>
                        <Divider sx={{ my: 1.5, opacity: 0.4 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>GRANT FUNDING</Typography>
                            <Typography variant="body1" fontWeight={900} color="primary.main">{r.grant || "—"}</Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>DEPARTMENT</Typography>
                            <Typography variant="body2" fontWeight={800}>{r.dept || r.department || "—"}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ── TAB 6: ANNOUNCEMENTS ───────────────────────────────────────── */}
          {activeTab === 6 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={900}>Dean's Announcements</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddAnnouncementOpen(true)}
                  sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none", background: g.secondary }}>
                  New Announcement
                </Button>
              </Box>
              <Stack spacing={2}>
                {(announcements.length ? announcements : [
                  { id: "1", title: "Welcome to the New Semester!",         body: "Dear students and staff, we are excited to begin this semester with renewed energy.",         priority: "high",   createdAt: new Date() },
                  { id: "2", title: "Research Grant Application Deadline",   body: "All faculty wishing to apply for the spring research grant must submit proposals by April 30.", priority: "urgent",  createdAt: new Date() },
                  { id: "3", title: "Engineering Career Fair — May 10",      body: "Over 60 companies will be present. Students are encouraged to bring updated resumes.",           priority: "normal",  createdAt: new Date() },
                  { id: "4", title: "Faculty Senate Meeting Rescheduled",    body: "The Faculty Senate meeting originally set for March 20 has been moved to March 25.",            priority: "normal",  createdAt: new Date() },
                ]).map((ann, i) => (
                  <Card key={ann.id || i} sx={{ ...glassStyle, borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: 2.5, background: ann.priority === "urgent" ? g.danger : ann.priority === "high" ? g.warning : g.secondary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Campaign sx={{ color: "white", fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={900}>{ann.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{ann.body}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.5, mt: 1, display: 'block' }}>
                              {ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={ann.priority || "normal"}
                          size="small"
                          sx={{
                            flexShrink: 0, ml: 2, fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase",
                            bgcolor: ann.priority === "urgent" ? alpha("#ef4444", 0.1) : ann.priority === "high" ? alpha("#f59e0b", 0.1) : alpha("#3b82f6", 0.1),
                            color:   ann.priority === "urgent" ? "#ef4444" : ann.priority === "high" ? "#f59e0b" : "#3b82f6",
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

        </Box>
      </Box>

      {/* ── Add Course Dialog ───────────────────────────────────────────── */}
      <Dialog open={addCourseOpen} onClose={() => setAddCourseOpen(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4, maxWidth: 480, width: "100%" } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Add New Course</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Course Code" value={newCourse.code} onChange={e => setNewCourse(p => ({ ...p, code: e.target.value }))} fullWidth />
            <TextField label="Course Name" value={newCourse.name} onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField label="Credits" type="number" value={newCourse.credits} onChange={e => setNewCourse(p => ({ ...p, credits: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAddCourseOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCourse} sx={{ borderRadius: 2, background: g.primary, fontWeight: 800 }}>Save Course</Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Research Dialog ─────────────────────────────────────────── */}
      <Dialog open={addResearchOpen} onClose={() => setAddResearchOpen(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4, maxWidth: 480, width: "100%" } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>New Research Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Project Title"    value={newResearch.title}  onChange={e => setNewResearch(p => ({ ...p, title: e.target.value }))}  fullWidth />
            <TextField label="Principal Investigator" value={newResearch.pi} onChange={e => setNewResearch(p => ({ ...p, pi: e.target.value }))} fullWidth />
            <TextField label="Grant Amount"     value={newResearch.grant}  onChange={e => setNewResearch(p => ({ ...p, grant: e.target.value }))}  fullWidth />
            <TextField select label="Status" value={newResearch.status} onChange={e => setNewResearch(p => ({ ...p, status: e.target.value }))} fullWidth>
              {["Active", "Pending", "Completed"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAddResearchOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddResearch} sx={{ borderRadius: 2, background: g.teal, fontWeight: 800 }}>Save Project</Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Announcement Dialog ─────────────────────────────────────── */}
      <Dialog open={addAnnouncementOpen} onClose={() => setAddAnnouncementOpen(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4, maxWidth: 520, width: "100%" } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>New Announcement</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={newAnn.title} onChange={e => setNewAnn(p => ({ ...p, title: e.target.value }))} fullWidth />
            <TextField label="Message" value={newAnn.body}  onChange={e => setNewAnn(p => ({ ...p, body: e.target.value }))}  fullWidth multiline rows={4} />
            <TextField select label="Priority" value={newAnn.priority} onChange={e => setNewAnn(p => ({ ...p, priority: e.target.value }))} fullWidth>
              {["normal", "high", "urgent"].map(s => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAddAnnouncementOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAnnouncement} sx={{ borderRadius: 2, background: g.secondary, fontWeight: 800 }}>Post</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
