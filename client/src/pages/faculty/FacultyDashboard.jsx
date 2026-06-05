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
  { label: "Overview", icon: <Dashboard />, idx: 0 },
  { label: "Departments", icon: <Hub />, idx: 1 },
  { label: "Faculty", icon: <Security />, idx: 2 },
  { label: "Students", icon: <People />, idx: 3 },
  { label: "Courses", icon: <Layers />, idx: 4 },
  { label: "Research", icon: <Science />, idx: 5 },
  { label: "Announcements", icon: <Campaign />, idx: 6 },
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
  const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: 3, year: 1, semester: 1 });

  /* ── Data Acquisition ────────────────────────────────────────────── */
  useEffect(() => {
    if (!user?.id) return;

    const syncMatrix = async () => {
      setLoading(true);
      try {
        const dept = user?.department || "";
        const [resCourses, resFaculty, resStudents, resDepts, resAnn, resRes] = await Promise.all([
          coursesAPI.getAll({ department: dept }),
          usersAPI.getAll({ role: "teacher" }),
          usersAPI.getAll({ role: "student" }),
          departmentsAPI.getAll(),
          announcementsAPI.getAll(),
          researchAPI.getAll(),
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
  }, [user?.id, user?.department]);

  /* ── Aggregation Logic ───────────────────────────────────────────── */
  const metrics = useMemo(() => {
    const totalStudents = students.length;
    // Calculate real avg GPA if students have GPA data
    const validGpas = students.filter(s => s.gpa).map(s => s.gpa);
    const avgGpa = validGpas.length > 0 ? (validGpas.reduce((a, b) => a + b, 0) / validGpas.length).toFixed(2) : "3.75";

    const activeResearch = research.filter(r => r.status === "Active").length;
    const courseCapacity = courses.reduce((acc, c) => acc + (c.maxStudents || 40), 0);
    const enrollmentRate = totalStudents > 0 && courseCapacity > 0 ? Math.round((totalStudents / courseCapacity) * 100) : 0;

    return { totalStudents, avgGpa, activeResearch, enrollmentRate };
  }, [students, research, courses]);

  // Aggregate enrollment per department for charts
  const enrollmentByDept = useMemo(() => {
    const counts = {};
    students.forEach(s => {
      const d = s.department || "General";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [students]);

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
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 100 }}>
        {sidebarOpen && (
          <Fade in>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 3, background: THEME_G.indigo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${alpha("#6366f1", 0.4)}` }}>
                <Terminal sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={1000} sx={{ letterSpacing: -0.5, lineHeight: 1.2 }}>DASHBOARD</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: 1.5 }}>Department Command</Typography>
              </Box>
            </Box>
          </Fade>
        )}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main }}>
          {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      {sidebarOpen && (
        <Box sx={{ px: 2, mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: 5, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.05)", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.1)"}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                <Avatar sx={{ width: 44, height: 44, background: THEME_G.indigo, fontWeight: 900 }}>{user?.name?.[0]}</Avatar>
              </Badge>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={1000} noWrap>{user?.name || "Dean"}</Typography>
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

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.1 }} />
        <Button
          fullWidth
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
          sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: isDark ? "rgba(255,255,255,0.5)" : "#64748b", py: 1.5, borderRadius: 4, "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0 } }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={700}>{mode === "dark" ? "Light Mode" : "Dark Mode"}</Typography>}
        </Button>
        <Button
          fullWidth
          onClick={() => { logout(); navigate("/"); }}
          startIcon={<Logout />}
          sx={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: "#f43f5e", mt: 1, py: 1.5, borderRadius: 4, fontWeight: 900, "& .MuiButton-startIcon": { mr: sidebarOpen ? 2 : 0 }, "&:hover": { bgcolor: alpha("#f43f5e", 0.1) } }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={900}>Logout</Typography>}
        </Button>
      </Box>
    </Box>
  );

  /* ── Dashboard Views ─────────────────────────────────────────────── */

  const OverviewTab = () => (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" fontWeight={1000} sx={{ letterSpacing: -3, lineHeight: 1, mb: 1, color: isDark ? "white" : "#0f172a" }}>
          Command<span style={{ color: alpha(theme.palette.primary.main, 0.7) }}>.</span>Center
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1.5, opacity: 0.7 }}>
          UNIT: {user?.department?.toUpperCase() || "ACADEMIC"} DEPT &nbsp; // &nbsp; STATUS: ONLINE
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Active Faculty" value={faculty.length} icon={<Security />} grad={THEME_G.indigo} trend={`${faculty.length > 0 ? "+1" : "0"} node`} color="#6366f1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Enrolled Students" value={students.length} icon={<People />} grad={THEME_G.emerald} trend="LINKED" color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Course Modules" value={courses.length} icon={<Layers />} grad={THEME_G.amber} trend="ACTIVE" color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <IntelligenceStat label="Average GPA" value={metrics.avgGpa} icon={<EmojiEvents />} grad={THEME_G.rose} trend="SYST-AVG" color="#f43f5e" />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ p: 4, height: "100%" }}>
            <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>Demographic Distribution</Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentByDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.1)} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} />
                  <YAxis hide />
                  <RTooltip contentStyle={{ borderRadius: 20, background: isDark ? "#0f172a" : "white", border: "none" }} />
                  <Bar dataKey="value" fill={theme.palette.primary.main} radius={[10, 10, 0, 0]}>
                    {enrollmentByDept.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(THEME_G)[index % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ p: 4, height: "100%" }}>
            <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>Latest Transmission</Typography>
            <Stack spacing={3}>
              {announcements.slice(0, 4).map((ann) => (
                <Box key={ann._id} sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ background: ann.priority === "high" ? THEME_G.rose : THEME_G.indigo, width: 40, height: 40 }}>
                    <Campaign />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={1000} noWrap>{ann.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ann.body}</Typography>
                  </Box>
                </Box>
              ))}
              {announcements.length === 0 && <Typography variant="caption" sx={{ opacity: 0.5 }}>No data found in transmission buffer.</Typography>}
            </Stack>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );

  const DepartmentsTab = () => (
    <Box>
      <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, mb: 4 }}>Sector Map: Departments</Typography>
      <Grid container spacing={3}>
        {departments.map((dept, i) => (
          <Grid item xs={12} md={4} key={dept._id || i}>
            <GlassCard sx={{ p: 3, height: "100%", borderTop: `6px solid ${dept.color || "#6366f1"}` }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight={1000}>{dept.name}</Typography>
                <Chip label={dept.code} size="small" sx={{ fontWeight: 900, fontSize: "0.7rem", bgcolor: alpha(dept.color || "#6366f1", 0.1), color: dept.color || "#6366f1" }} />
              </Box>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>FACULTY HEAD: {dept.headName || "DR. ALAN TURING"}</Typography>
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Box>
                  <Typography variant="body1" fontWeight={1000}>{students.filter(s => s.department === dept.name).length}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Students</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={1000}>{faculty.filter(f => f.department === dept.name).length}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Faculty</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={1000}>{courses.filter(c => c.department === dept.name).length}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Courses</Typography>
                </Box>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const FacultyTab = () => (
    <Box>
      <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, mb: 4 }}>Faculty Corps</Typography>
      <GlassCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: alpha(theme.palette.primary.main, 0.03) }}>
                {["Personnel", "Identification", "Designation", "Department", "Actions"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {faculty.map((f) => (
                <TableRow key={f._id} sx={{ "&:hover": { background: alpha(theme.palette.primary.main, 0.05) } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ background: THEME_G.violet, fontWeight: 1000 }}>{f.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={1000}>{f.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{f.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace" }}>{f.employeeId || "REF-SYNC"}</TableCell>
                  <TableCell>
                    <Chip label={f.position || "Professor"} size="small" sx={{ fontWeight: 900, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{f.department}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary"><Visibility sx={{ fontSize: 18 }} /></IconButton>
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
      <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, mb: 4 }}>Student Database</Typography>
      <GlassCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: alpha(theme.palette.success.main, 0.03) }}>
                {["Student", "ID Hash", "Department", "Level", "GPA"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 900, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s._id} sx={{ "&:hover": { background: alpha(theme.palette.success.main, 0.05) } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ background: THEME_G.emerald, fontWeight: 900 }}>{s.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace" }}>{s.studentId}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{s.department}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Year {s.year || "3"}</TableCell>
                  <TableCell sx={{ fontWeight: 1000, color: "success.main" }}>{s.gpa || "3.85"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );

  // CoursesTab content is rendered inline in the return block below to prevent nested-component remount bug

  const ResearchTab = () => (
    <Box>
      <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, mb: 4 }}>Research Nodes</Typography>
      <Grid container spacing={3}>
        {research.map((proj) => (
          <Grid item xs={12} md={4} key={proj._id}>
            <GlassCard sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight={1000} sx={{ mb: 1 }}>{proj.title}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "primary.main", letterSpacing: 1.5 }}>PI: {proj.pi}</Typography>
              <Divider sx={{ my: 2, opacity: 0.1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" fontWeight={1000} color="success.main">${proj.grant?.toLocaleString()}</Typography>
                <Chip label={proj.status} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem" }} />
              </Box>
              <Typography variant="caption" sx={{ display: "block", mt: 2, opacity: 0.5 }}>DEPT: {proj.department}</Typography>
            </GlassCard>
          </Grid>
        ))}
        {research.length === 0 && <Typography variant="h6" sx={{ opacity: 0.5, textAlign: "center", width: "100%", py: 10 }}>No research nodes detected in this sector.</Typography>}
      </Grid>
    </Box>
  );

  const AnnouncementsTab = () => (
    <Box>
      <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1, mb: 4 }}>Transmissions Buffer</Typography>
      <Stack spacing={3}>
        {announcements.map((ann) => (
          <GlassCard key={ann._id} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={1000}>{ann.title}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>{new Date(ann.createdAt).toLocaleString()}</Typography>
              </Box>
              <Chip label={ann.priority?.toUpperCase()} size="small" color={ann.priority === "high" ? "error" : "primary"} sx={{ fontWeight: 1000 }} />
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>{ann.body}</Typography>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.5 }}>POSTED BY: {ann.postedByName || "CORE-SYSTEM"}</Typography>
              <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.5 }}>TARGET: {ann.targetAudience?.toUpperCase() || "ALL"}</Typography>
            </Box>
          </GlassCard>
        ))}
      </Stack>
    </Box>
  );

  /* ── Main Render ─────────────────────────────────────────────────── */

  const mainML = isMobile ? 0 : `${sidebarOpen ? 280 : 88}px`;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: isDark ? "#05060f" : "#f8fafc", overflow: "hidden" }}>
      <CommandSidebar />
      <Box component="main" sx={{
        flexGrow: 1, ml: mainML, transition: "margin 0.4s",
        height: "100vh", overflowY: "auto", p: { xs: 2, md: 6 }, zIndex: 1
      }}>
        <Fade in timeout={800}>
          <Box>
            {activeTab === 0 && <OverviewTab />}
            {activeTab === 1 && <DepartmentsTab />}
            {activeTab === 2 && <FacultyTab />}
            {activeTab === 3 && <StudentsTab />}
            {activeTab === 4 && (
              <Box>
                <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1 }}>Course Modules</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddCourseOpen(true)} sx={{ borderRadius: 3, fontWeight: 900, background: THEME_G.indigo }}>Deploy Module</Button>
                </Box>
                <Grid container spacing={3}>
                  {courses.map((c) => (
                    <Grid item xs={12} md={4} key={c._id}>
                      <GlassCard sx={{ height: "100%", borderBottom: `4px solid ${c.status === "active" ? "#10b981" : "#f59e0b"}` }}>
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight={1000}>{c.name}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.6, letterSpacing: 1 }}>{c.code?.toUpperCase()}</Typography>
                          <Stack spacing={2} sx={{ mt: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="caption" fontWeight={800} color="text.secondary">INSTRUCTOR</Typography>
                              <Typography variant="body2" fontWeight={1000}>{c.instructorName}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="caption" fontWeight={800} color="text.secondary">LOAD</Typography>
                              <Typography variant="body2" fontWeight={1000}>{c.enrolledStudents?.length || 0} / {c.maxStudents || 40}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={((c.enrolledStudents?.length || 0) / (c.maxStudents || 40)) * 100} sx={{ height: 6, borderRadius: 3 }} />
                          </Stack>
                        </Box>
                      </GlassCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            {activeTab === 5 && <ResearchTab />}
            {activeTab === 6 && <AnnouncementsTab />}
          </Box>
        </Fade>
      </Box>

      {/* Deploy Module Dialog */}
      <Dialog open={addCourseOpen} onClose={() => setAddCourseOpen(false)} PaperProps={{ sx: { background: isDark ? "rgba(15, 23, 42, 0.95)" : "white", backdropFilter: "blur(40px)", borderRadius: 8, p: 2, maxWidth: 500, width: "100%" } }}>
        <DialogTitle sx={{ fontWeight: 1000, fontSize: "1.8rem", textAlign: "center" }}>Deploy New Module</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField label="Module Title" fullWidth value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} autoFocus />
            <TextField label="Designation Code (e.g., CS101)" fullWidth value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Credits" type="number" fullWidth value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Year" type="number" fullWidth value={newCourse.year} onChange={(e) => setNewCourse({ ...newCourse, year: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Semester" type="number" fullWidth value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, gap: 1 }}>
          <Button onClick={(e) => {
            e.preventDefault();
            setAddCourseOpen(false);
            setNewCourse({ code: "", name: "", credits: 3, year: 1, semester: 1 });
          }} sx={{ fontWeight: 900, borderRadius: 3 }}>Abort</Button>

          <Button variant="contained" disabled={!newCourse.name || !newCourse.code} onClick={async (e) => {
            e.preventDefault();
            try {
              const payload = {
                ...newCourse,
                department: user?.department || "General",
                instructor: user?.id || user?._id,
                instructorName: user?.name || "Unknown Instructor"
              };
              await coursesAPI.create(payload);
              window.alert("Course Module Deployed Successfully! Awaiting College Admin Approval.");
              setAddCourseOpen(false);
              setNewCourse({ code: "", name: "", credits: 3, year: 1, semester: 1 });
            } catch (err) {
              console.error(err);
              window.alert("Error Deploying Course: " + (err.response?.data?.message || err.message));
            }
          }} sx={{ background: THEME_G.indigo, borderRadius: 4, fontWeight: 1000, px: 4 }}>Deploy</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
