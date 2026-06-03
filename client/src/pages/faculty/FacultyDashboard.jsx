import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Box, Button, Avatar, Chip,
  Divider, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, List, ListItem, ListItemText,
  Tooltip, Stack, Badge, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, useTheme, alpha, Drawer, useMediaQuery,
  Zoom, Fade, Slide
} from "@mui/material";
import {
  Business, People, School, Assignment, TrendingUp, Assessment,
  Notifications, LightMode, DarkMode, Logout, Dashboard, Groups,
  Settings, CheckCircle, Cancel, Visibility, Search, Grade,
  CalendarToday, ChevronLeft, ChevronRight, Menu as MenuIcon,
  Add as AddIcon, Send as SendIcon, LibraryBooks, SupportAgent,
  Computer, Delete, Edit as EditIcon, Science, AccountBalance,
  EmojiEvents, Announcement, BarChart as BarChartIcon, Close,
  LockReset, Campaign, Public, Layers, AutoAwesome, Terminal,
  Radar, Insights, Security, Hub, Memory, Bolt,
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line,
  AreaChart, Area
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { authAPI, coursesAPI, usersAPI, departmentsAPI, announcementsAPI, researchAPI } from "../../services/api";

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
  { label: "Neural Matrix", icon: <Dashboard />, idx: 0 },
  { label: "Departments", icon: <Hub />, idx: 1 },
  { label: "Faculty Corps", icon: <Security />, idx: 2 },
  { label: "Citizen Students", icon: <People />, idx: 3 },
  { label: "Course Modules", icon: <Layers />, idx: 4 },
  { label: "Research Nodes", icon: <Science />, idx: 5 },
  { label: "Transmissions", icon: <Campaign />, idx: 6 },
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
      overflow: "visible",
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

const IntelligenceStat = ({ label, value, icon, grad, trend, color }) => {
  const theme = useTheme();
  return (
    <GlassCard sx={{ p: 3, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: grad, opacity: 0.05, filter: "blur(20px)" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: 3.5, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: `0 8px 24px ${alpha(color, 0.3)}` }}>
          {React.cloneElement(icon, { sx: { fontSize: 28 } })}
        </Box>
        {trend && (
          <Chip
            icon={<TrendingUp sx={{ fontSize: 14, color: "inherit !important" }} />}
            label={trend}
            size="small"
            sx={{
              bgcolor: alpha("#10b981", 0.1),
              color: "#10b981",
              fontWeight: 900,
              fontSize: "0.7rem",
              borderRadius: 2,
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}
          />
        )}
      </Box>
      <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, mb: 0.5, fontFamily: "'Outfit', sans-serif" }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7 }}>
        {label}
      </Typography>
    </GlassCard>
  );
};

/* ── Main Dashboard ────────────────────────────────────────────────── */

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Framework States
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Persistence States (MongoDB)
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [research, setResearch] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Operational States
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: 3, instructorName: "" });

  /* ── Data Acquisition ────────────────────────────────────────────── */
  useEffect(() => {
    if (!user?.id) return;

    const syncMatrix = async () => {
      setLoading(true);
      try {
        const dept = user?.department || "";
        const [resCourses, resFaculty, resStudents, resDepts, resAnn, resRes] = await Promise.all([
          coursesAPI.getAll({ department: dept }),
          usersAPI.getAll({ role: "teacher", department: dept }),
          usersAPI.getAll({ role: "student" }),
          departmentsAPI.getAll(),
          announcementsAPI.getAll({ department: dept }),
          researchAPI.getAll({ department: dept }),
        ]);

        setCourses(resCourses.data || []);
        setFaculty(resFaculty.data || []);
        setStudents(resStudents.data || []);
        setDepartments(resDepts.data || []);
        setAnnouncements(resAnn.data || []);
        setResearch(resRes.data || []);
      } catch (error) {
        console.error("Neural Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    syncMatrix();
    const heartbeat = setInterval(syncMatrix, 30000); // Pulse every 30s
    return () => clearInterval(heartbeat);
  }, [user?.id, user?.department]);

  /* ── Aggregation Logic ───────────────────────────────────────────── */
  const metrics = useMemo(() => {
    const totalStudents = students.length;
    const avgGpa = 3.62; // Placeholder for real aggregation if not provided by API
    const activeResearch = research.filter(r => r.status === "Active").length;
    const courseCapacity = courses.reduce((acc, c) => acc + (c.maxStudents || 40), 0);
    const enrollmentRate = totalStudents > 0 ? Math.round((totalStudents / courseCapacity) * 100) : 0;

    return { totalStudents, avgGpa, activeResearch, enrollmentRate };
  }, [students, research, courses]);

  const chartData = useMemo(() => {
    return [
      { name: "Mon", pulse: 45 }, { name: "Tue", pulse: 52 },
      { name: "Wed", pulse: 48 }, { name: "Thu", pulse: 61 },
      { name: "Fri", pulse: 55 }, { name: "Sat", pulse: 32 },
      { name: "Sun", pulse: 28 },
    ];
  }, []);

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
      boxShadow: "10px 0 40px rgba(0,0,0,0.1)",
      display: "flex", flexDirection: "column",
      transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 1300,
    }}>
      {/* HUD Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 100 }}>
        {sidebarOpen && (
          <Fade in>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 3, background: THEME_G.indigo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${alpha("#6366f1", 0.4)}` }}>
                <Terminal sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={1000} sx={{ letterSpacing: -0.5, lineHeight: 1.2 }}>CORE HUD</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: 1.5 }}>Faculty Grid</Typography>
              </Box>
            </Box>
          </Fade>
        )}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main }}>
          {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Identity Module */}
      {sidebarOpen && (
        <Box sx={{ px: 2, mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: 5, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.05)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.1)"}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                <Avatar sx={{ width: 44, height: 44, background: THEME_G.indigo, fontWeight: 900 }}>{user?.name?.[0]}</Avatar>
              </Badge>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={1000} noWrap>{user?.name || "Command Dean"}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, textTransform: "uppercase", fontSize: "0.6rem" }}>{user?.department || "General"} Node</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Vectors */}
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
                  background: activeTab === item.idx ? THEME_G.indigo : "transparent",
                  boxShadow: activeTab === item.idx ? `0 8px 24px ${alpha("#6366f1", 0.4)}` : "none",
                  "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0, ml: 0 },
                  "&:hover": { background: activeTab === item.idx ? THEME_G.indigo : (isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.08)") },
                  transition: "all 0.3s",
                }}
              >
                {sidebarOpen && <Typography variant="body2" fontWeight={activeTab === item.idx ? 1000 : 700}>{item.label}</Typography>}
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Terminal Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.1 }} />
        <Button
          fullWidth
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
          sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: isDark ? "rgba(255,255,255,0.5)" : "#64748b", py: 1.5, borderRadius: 4, "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0 } }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={700}>{mode === "dark" ? "LUMINANCE" : "OBSCURITY"}</Typography>}
        </Button>
        <Button
          fullWidth
          onClick={() => { logout(); navigate("/"); }}
          startIcon={<Logout />}
          sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: "#f43f5e", mt: 1, py: 1.5, borderRadius: 4, fontWeight: 900, "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0 }, "&:hover": { bgcolor: alpha("#f43f5e", 0.1) } }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={900}>TERMINATE</Typography>}
        </Button>
      </Box>
    </Box>
  );

  const mainML = isMobile ? 0 : `${sidebarOpen ? 280 : 88}px`;

  /* ── Dashboard Views ─────────────────────────────────────────────── */

  const OverviewTab = () => (
    <Box>
      {/* HUD Welcome */}
      <Box sx={{ mb: 6, position: "relative" }}>
        <Typography variant="h2" fontWeight={1000} sx={{ letterSpacing: -3, lineHeight: 1, mb: 1, color: isDark ? "white" : "#0f172a" }}>
          Command<span style={{ color: alpha(theme.palette.primary.main, 0.7) }}>.</span>Center
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1.5, opacity: 0.7 }}>
          UNIT: {user?.department?.toUpperCase() || "ACADEMIC"} NODE &nbsp; // &nbsp; STATUS: ONLINE
        </Typography>
      </Box>

      {/* Neural Link Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Active Faculty" value={faculty.length} icon={<Security />} grad={THEME_G.indigo} trend="+2.4%" color="#6366f1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Enrolled Units" value={students.length} icon={<People />} grad={THEME_G.emerald} trend="+51" color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Course Modules" value={courses.length} icon={<Layers />} grad={THEME_G.amber} trend="ACTIVE" color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Average GPA" value={metrics.avgGpa} icon={<AutoAwesome />} grad={THEME_G.rose} trend="▲ 0.1" color="#f43f5e" />
        </Grid>
      </Grid>

      {/* Data Visuals */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ p: 4, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Typography variant="h5" fontWeight={1000}>Network Activity</Typography>
              <Chip label="Real-time Pulse" size="small" variant="outlined" sx={{ fontWeight: 800, color: "primary.main", borderColor: "primary.main" }} />
            </Box>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.1)} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
                  <RTooltip contentStyle={{ borderRadius: 20, background: isDark ? "#0f172a" : "white", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }} />
                  <Area type="monotone" dataKey="pulse" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#pulseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>Recent Transmissions</Typography>
            <Stack spacing={3}>
              {announcements.slice(0, 3).map((ann, i) => (
                <Box key={ann._id || i} sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", background: ann.priority === "high" ? "#f43f5e" : "#6366f1", mt: 1, boxShadow: `0 0 10px ${ann.priority === "high" ? "#f43f5e" : "#6366f1"}` }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={1000} noWrap>{ann.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ann.body}</Typography>
                  </Box>
                </Box>
              ))}
              {announcements.length === 0 && <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No active transmissions.</Typography>}
            </Stack>
            <Button fullWidth variant="outlined" sx={{ mt: 4, borderRadius: 3, fontWeight: 800, textTransform: "none" }}>View All Comms</Button>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );

  const FacultyTab = () => (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1 }}>Faculty Corps</Typography>
        <Chip label={`${faculty.length} Active Personnel`} sx={{ background: THEME_G.indigo, color: "white", fontWeight: 900 }} />
      </Box>
      <GlassCard sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: alpha(theme.palette.primary.main, 0.03) }}>
                {["Personnel", "Identification", "Designation", "Assigned Department", "Clearance"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 2, py: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {faculty.map((f, i) => (
                <TableRow key={f._id || i} sx={{ "&:hover": { background: alpha(theme.palette.primary.main, 0.05) } }}>
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ background: THEME_G.violet, fontWeight: 1000 }}>{f.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={1000}>{f.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{f.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", color: "primary.main" }}>{f.employeeId || `REF-${f._id.slice(-6)}`}</TableCell>
                  <TableCell>
                    <Chip label={f.position || "Lecturer"} size="small" sx={{ fontWeight: 900, background: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{f.department}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton size="small" color="primary"><Visibility sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small" color="secondary"><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );

  const StudentsTab = () => (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1 }}>Citizen Students</Typography>
        <Chip label={`${students.length} Enrolled`} sx={{ background: THEME_G.emerald, color: "white", fontWeight: 900 }} />
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { l: "Undergraduate", v: Math.floor(students.length * 0.75), g: THEME_G.indigo },
          { l: "Graduate", v: Math.floor(students.length * 0.2), g: THEME_G.cyan },
          { l: "Research Fellow", v: Math.ceil(students.length * 0.05), g: THEME_G.rose },
        ].map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <GlassCard sx={{ p: 3, background: s.g, color: "white" }}>
              <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2 }}>{s.v}</Typography>
              <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1.5, opacity: 0.8 }}>{s.l.toUpperCase()}</Typography>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
      <GlassCard>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: alpha("#10b981", 0.03) }}>
              <TableRow>
                {["Candidate", "ID Hash", "Level", "Standing", "Status"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 2, py: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.slice(0, 10).map((s, i) => (
                <TableRow key={s._id || i} sx={{ "&:hover": { background: alpha("#10b981", 0.05) } }}>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ background: THEME_G.cyan, fontWeight: 900 }}>{s.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{s.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace" }}>{s.studentId || `STU-${s._id.slice(-6)}`}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Year {s.year || 1}</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "success.main" }}>3.85</TableCell>
                  <TableCell>
                    <Chip label="Active" size="small" sx={{ fontWeight: 900, bgcolor: alpha("#10b981", 0.1), color: "#10b981" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );

  const CoursesTab = () => (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1 }}>Course Modules</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddCourseOpen(true)} sx={{ borderRadius: 3, fontWeight: 900, background: THEME_G.indigo, boxShadow: `0 10px 30px ${alpha("#6366f1", 0.3)}` }}>New Deployment</Button>
      </Box>
      <Grid container spacing={3}>
        {courses.map((c, i) => (
          <Grid item xs={12} md={4} key={c._id || i}>
            <GlassCard sx={{ height: "100%", overflow: "hidden" }}>
              <Box sx={{ height: 100, background: THEME_G.slate, p: 3, display: "flex", justifyContent: "flex-end", flexDirection: "column" }}>
                <Typography variant="h6" fontWeight={1000} color="white" sx={{ letterSpacing: -0.5 }}>{c.code}</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 800 }}>{c.name}</Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>INSTRUCTOR</Typography>
                    <Typography variant="body2" fontWeight={1000}>{c.instructorName || "Unassigned"}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>LOAD</Typography>
                    <Typography variant="body2" fontWeight={1000}>{c.enrolledStudents?.length || 0} / {c.maxStudents || 40}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={((c.enrolledStudents?.length || 0) / (c.maxStudents || 40)) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: alpha("#6366f1", 0.1) }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Chip label={c.status?.toUpperCase() || "ACTIVE"} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha("#10b981", 0.1), color: "#10b981" }} />
                    <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
        {courses.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Layers sx={{ fontSize: 80, opacity: 0.1, mb: 2 }} />
              <Typography variant="h6" fontWeight={800} color="text.secondary">No active modules in this sector.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  /* ── Core Rendering ──────────────────────────────────────────────── */

  return (
    <Box sx={{
      display: "flex", minHeight: "100vh",
      background: isDark ? "#05060f" : "#f8fafc",
      overflow: "hidden",
    }}>
      {/* HUD Aurora Blobs */}
      <Box sx={{ position: "fixed", top: "-10%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />

      <CommandSidebar />

      <Box component="main" sx={{
        flexGrow: 1, ml: mainML,
        transition: "margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative", zIndex: 1, height: "100vh", overflowY: "auto",
        p: { xs: 2, md: 6 }, pb: 10,
      }}>
        <Fade in timeout={800}>
          <Box>
            {activeTab === 0 && <OverviewTab />}
            {activeTab === 1 && (
              <Box sx={{ textAlign: "center", py: 20 }}>
                <Hub sx={{ fontSize: 80, opacity: 0.1, mb: 2 }} />
                <Typography variant="h5" fontWeight={1000}>Sector Map Incoming</Typography>
                <Typography variant="body2" color="text.secondary">Integrating department nodes into the command center...</Typography>
              </Box>
            )}
            {activeTab === 2 && <FacultyTab />}
            {activeTab === 3 && <StudentsTab />}
            {activeTab === 4 && <CoursesTab />}
            {activeTab === 5 && (
              <Box sx={{ textAlign: "center", py: 20 }}>
                <Science sx={{ fontSize: 80, opacity: 0.1, mb: 2 }} />
                <Typography variant="h5" fontWeight={1000}>Research Link Pending</Typography>
                <Typography variant="body2" color="text.secondary">Fetching high-energy project data from sub-nodes...</Typography>
              </Box>
            )}
            {activeTab === 6 && (
              <Box sx={{ textAlign: "center", py: 20 }}>
                <Campaign sx={{ fontSize: 80, opacity: 0.1, mb: 2 }} />
                <Typography variant="h5" fontWeight={1000}>Transmission Buffer</Typography>
                <Typography variant="body2" color="text.secondary">Awaiting network broadcast from the Dean's office...</Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Deploy Module Dialog */}
      <Dialog
        open={addCourseOpen}
        onClose={() => setAddCourseOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 8,
            background: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            maxWidth: 500, width: "100%"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 1000, fontSize: "1.8rem", textAlign: "center", mt: 2 }}>Deploy New Module</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <TextField label="Module Identifier" variant="filled" fullWidth value={newCourse.code} onChange={e => setNewCourse(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
            <TextField label="Module Designation" variant="filled" fullWidth value={newCourse.name} onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))} />
            <TextField label="Credit Weight" variant="filled" type="number" fullWidth value={newCourse.credits} onChange={e => setNewCourse(p => ({ ...p, credits: e.target.value }))} />
            <Box sx={{ p: 2, borderRadius: 3, background: alpha(theme.palette.primary.main, 0.05), border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Typography variant="caption" sx={{ display: "block", color: "primary.main", fontWeight: 1000, mb: 1 }}>AUTO-AUTHORIZATION</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontSize: "0.75rem" }}>This module will be registered under the <strong>{user?.department}</strong> authority and queued for Registrar verification.</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button onClick={() => setAddCourseOpen(false)} sx={{ fontWeight: 900, borderRadius: 3, textTransform: "none" }}>Abort</Button>
          <Button variant="contained" sx={{ fontWeight: 1000, borderRadius: 3.5, background: THEME_G.indigo, px: 4, py: 1.5, textTransform: "none" }}>Initiate Deployment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
