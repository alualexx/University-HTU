import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, List, ListItem, ListItemText, Divider, LinearProgress,
  IconButton, Tab, Tabs, Badge, Tooltip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from "@mui/material";
import {
  School, Book, Grade, Schedule, Logout, EmojiEvents,
  LightMode, DarkMode, Notifications, Dashboard, Campaign,
  CheckCircle, AccessTime, Warning, TrendingUp, MenuBook, Star,
  CalendarMonth, Assignment,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme } from "@mui/material";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer, Cell,
} from "recharts";

/* ─── Static data ─────────────────────────────────────────────────────── */
const gradients = [
  "linear-gradient(135deg,#1976d2,#42a5f5)",
  "linear-gradient(135deg,#2e7d32,#66bb6a)",
  "linear-gradient(135deg,#6a1b9a,#ba68c8)",
  "linear-gradient(135deg,#e65100,#ffa726)",
];
const courseColors = ["#1976d2", "#2e7d32", "#6a1b9a", "#e65100", "#c62828"];
const gradeToPoints = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0 };

const urgencyColor = (days) =>
  days <= 3 ? "#ef4444" : days <= 7 ? "#f59e0b" : "#22c55e";

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
  const display = stat.isGpa ? (animated / 100).toFixed(2) : animated;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "all 0.3s",
        bgcolor: "background.paper",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 48px rgba(0,0,0,0.12)" },
      }}
    >
      <Box sx={{ height: 5, background: stat.gradient }} />
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2.5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {stat.label}
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 0.4, lineHeight: 1 }}>
            {display}
            {stat.suffix && (
              <Typography component="span" variant="h6" color="text.secondary" fontWeight={400} sx={{ ml: 0.5 }}>
                {stat.suffix}
              </Typography>
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56, height: 56, borderRadius: 3,
            background: stat.gradient,
            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
          }}
        >
          {stat.icon}
        </Box>
      </CardContent>
    </Card>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  /* ── Course & event data ─────────────────────────────────────────────── */
  const courses = [
    { code: "CS301", name: "Data Structures & Algorithms", credits: 4, grade: "A", progress: 88, instructor: "Dr. Sarah Mills", days: "Mon/Wed", time: "10:00–11:30", room: "CS-204", color: courseColors[0] },
    { code: "MATH301", name: "Linear Algebra", credits: 3, grade: "B+", progress: 74, instructor: "Prof. James Lee", days: "Tue/Thu", time: "14:00–15:30", room: "MATH-102", color: courseColors[1] },
    { code: "ENG201", name: "Technical Writing", credits: 3, grade: "A-", progress: 92, instructor: "Dr. Olivia Chen", days: "Mon/Wed/Fri", time: "09:00–10:00", room: "ENG-301", color: courseColors[2] },
    { code: "CS401", name: "Operating Systems", credits: 4, grade: "B+", progress: 68, instructor: "Prof. Michael Ray", days: "Tue/Thu", time: "10:00–11:30", room: "CS-105", color: courseColors[3] },
    { code: "STAT201", name: "Probability & Statistics", credits: 3, grade: "A", progress: 81, instructor: "Dr. Fatima Hassan", days: "Mon/Wed", time: "13:00–14:30", room: "STAT-201", color: courseColors[4] },
  ];

  const deadlines = [
    { title: "DS&A — Assignment 4", course: "CS301", date: "Mar 8", daysLeft: 2 },
    { title: "Linear Algebra — Midterm", course: "MATH301", date: "Mar 12", daysLeft: 6 },
    { title: "OS — Lab Report 3", course: "CS401", date: "Mar 15", daysLeft: 9 },
    { title: "Technical Writing — Final Draft", course: "ENG201", date: "Mar 22", daysLeft: 16 },
  ];

  const recentActivity = [
    { text: "CS301 Assignment 3 graded: A", time: "2 hours ago", color: "#22c55e", icon: <CheckCircle sx={{ fontSize: 18 }} /> },
    { text: "New announcement from Prof. James Lee", time: "Yesterday", color: "#1976d2", icon: <Campaign sx={{ fontSize: 18 }} /> },
    { text: "MATH301 Quiz 2 due in 3 days", time: "2 days ago", color: "#f59e0b", icon: <Warning sx={{ fontSize: 18 }} /> },
    { text: "Successfully enrolled in STAT201", time: "3 days ago", color: "#22c55e", icon: <CheckCircle sx={{ fontSize: 18 }} /> },
  ];

  const gpaData = [
    { semester: "Spr '23", gpa: 3.2 },
    { semester: "Fall '23", gpa: 3.5 },
    { semester: "Spr '24", gpa: 3.6 },
    { semester: "Fall '24", gpa: 3.8 },
    { semester: "Spr '25", gpa: 3.74 },
  ];

  const totalCredits = courses.reduce((a, c) => a + c.credits, 0);
  const earnedCredits = 86;
  const requiredCredits = 128;

  const gradesData = courses.map((c) => ({
    ...c,
    points: gradeToPoints[c.grade] ?? 3.0,
    status: c.progress >= 80 ? "On Track" : c.progress >= 60 ? "Needs Attention" : "At Risk",
  }));

  const statusColor = (s) => s === "On Track" ? "#22c55e" : s === "Needs Attention" ? "#f59e0b" : "#ef4444";

  const stats = [
    { label: "Current GPA", raw: 374, isGpa: true, suffix: "/ 4.0", gradient: gradients[1], icon: <EmojiEvents sx={{ fontSize: 30 }} /> },
    { label: "Courses Enrolled", raw: courses.length, isGpa: false, suffix: "courses", gradient: gradients[0], icon: <School sx={{ fontSize: 30 }} /> },
    { label: "Credit Hours", raw: totalCredits, isGpa: false, suffix: "hrs", gradient: gradients[2], icon: <Book sx={{ fontSize: 30 }} /> },
    { label: "Deadlines Soon", raw: deadlines.filter((d) => d.daysLeft <= 7).length, isGpa: false, suffix: "due soon", gradient: gradients[3], icon: <AccessTime sx={{ fontSize: 30 }} /> },
  ];

  const announcements = [
    { title: "Registration for Fall 2025 Opens March 20", body: "Course registration for the upcoming Fall 2025 semester will open on March 20. Please ensure your advisor has cleared you before this date.", source: "University Registrar", date: "Mar 5", tag: "IMPORTANT", tagColor: "#ef4444", isNew: true },
    { title: "CS301 — Office Hours Rescheduled", body: "Dr. Sarah Mills' office hours on March 8 are moved to March 9, 2:00–4:00 PM in CS-210.", source: "CS301 · Dr. Sarah Mills", date: "Mar 4", tag: "COURSE", tagColor: courseColors[0], isNew: true },
    { title: "Library Extended Hours During Midterms", body: "The main campus library will be open 24/7 from March 10–16 to support students during midterms.", source: "University Library", date: "Mar 3", tag: "INFO", tagColor: "#1976d2", isNew: false },
    { title: "MATH301 — Quiz 2 Practice Problems Posted", body: "Practice problems for Quiz 2 (Linear Transformations) have been posted. Quiz is on March 14.", source: "MATH301 · Prof. James Lee", date: "Mar 2", tag: "COURSE", tagColor: courseColors[1], isNew: false },
    { title: "Merit Scholarship Applications Open", body: "Applications for the 2025–2026 merit scholarship are now open for students with a GPA of 3.5+. Deadline: April 1.", source: "Financial Aid Office", date: "Mar 1", tag: "OPPORTUNITY", tagColor: "#6a1b9a", isNew: false },
  ];

  // Schedule timetable
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const scheduleBlocks = [
    { day: "Mon", start: 10, end: 12, code: "CS301", room: "CS-204", color: courseColors[0] },
    { day: "Mon", start: 9, end: 10, code: "ENG201", room: "ENG-301", color: courseColors[2] },
    { day: "Mon", start: 13, end: 14.5, code: "STAT201", room: "STAT-201", color: courseColors[4] },
    { day: "Tue", start: 14, end: 15.5, code: "MATH301", room: "MATH-102", color: courseColors[1] },
    { day: "Tue", start: 10, end: 12, code: "CS401", room: "CS-105", color: courseColors[3] },
    { day: "Wed", start: 10, end: 12, code: "CS301", room: "CS-204", color: courseColors[0] },
    { day: "Wed", start: 9, end: 10, code: "ENG201", room: "ENG-301", color: courseColors[2] },
    { day: "Wed", start: 13, end: 14.5, code: "STAT201", room: "STAT-201", color: courseColors[4] },
    { day: "Thu", start: 14, end: 15.5, code: "MATH301", room: "MATH-102", color: courseColors[1] },
    { day: "Thu", start: 10, end: 12, code: "CS401", room: "CS-105", color: courseColors[3] },
    { day: "Fri", start: 9, end: 10, code: "ENG201", room: "ENG-301", color: courseColors[2] },
  ];

  const handleLogout = async () => { await logout(); navigate("/"); };
  const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  const newAnnCount = announcements.filter((a) => a.isNew).length;

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: mode === "dark"
            ? "linear-gradient(135deg,#0d47a1 0%,#1565c0 50%,#283593 100%)"
            : "linear-gradient(135deg,#1565c0 0%,#1976d2 50%,#42a5f5 100%)",
          py: 4.5,
          px: { xs: 2, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <Box sx={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -70, left: 80, width: 170, height: 170, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

        <Container maxWidth="lg">
          {/* Profile row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Avatar sx={{ width: 68, height: 68, fontSize: 26, fontWeight: 800, background: "rgba(255,255,255,0.25)", border: "3px solid rgba(255,255,255,0.4)" }}>
                {(user?.name || "A")[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800} color="white" letterSpacing="-0.02em">
                  {user?.name || "Alex Johnson"}
                </Typography>
                <Typography color="rgba(255,255,255,0.85)" variant="body2" sx={{ mt: 0.2 }}>
                  Computer Science · Spring 2025 · Year 3
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.8, flexWrap: "wrap" }}>
                  <Chip label={`ID: ${user?.studentId || "STU-2024-0142"}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: "0.7rem" }} />
                  <Chip icon={<Star sx={{ fontSize: "14px !important", color: "#fbbf24 !important" }} />} label="Good Standing" size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: "0.7rem" }} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Tooltip title="Notifications">
                <IconButton sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                  <Badge badgeContent={3} color="error"><Notifications /></Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={toggleColorMode} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
              <Button variant="outlined" size="small" startIcon={<Logout />} onClick={handleLogout}
                sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white", fontWeight: 600, textTransform: "none", borderRadius: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" } }}>
                Sign Out
              </Button>
            </Box>
          </Box>

          {/* Tab bar */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { color: "rgba(255,255,255,0.65)", fontWeight: 600, textTransform: "none", fontSize: "0.88rem", minHeight: 42 },
              "& .Mui-selected": { color: "white !important" },
              "& .MuiTabs-indicator": { bgcolor: "white", height: 3, borderRadius: 2 },
            }}
          >
            <Tab label="Overview" icon={<Dashboard sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="My Courses" icon={<MenuBook sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="Grades & GPA" icon={<TrendingUp sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab label="Schedule" icon={<CalendarMonth sx={{ fontSize: 17 }} />} iconPosition="start" />
            <Tab
              label={`Announcements${newAnnCount > 0 ? ` (${newAnnCount})` : ""}`}
              icon={<Campaign sx={{ fontSize: 17 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Container>
      </Box>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {/* ━━━━ TAB 0: OVERVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((s, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <StatCard stat={s} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* GPA Chart */}
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>GPA Trend</Typography>
                        <Typography variant="caption" color="text.secondary">Academic performance over semesters</Typography>
                      </Box>
                      <Chip label="GPA 3.74" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ height: 250, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={gpaData}>
                          <defs>
                            <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                          <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                          <YAxis domain={[2.8, 4.0]} hide />
                          <ChartTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 12, border: `1px solid ${theme.palette.divider}` }} />
                          <Area type="monotone" dataKey="gpa" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#gpaFill)" dot={{ r: 5, fill: theme.palette.primary.main, strokeWidth: 2, stroke: theme.palette.background.paper }} activeDot={{ r: 7 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Upcoming Deadlines */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Upcoming Deadlines</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                      {deadlines.map((d, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "action.hover", borderLeft: `4px solid ${urgencyColor(d.daysLeft)}` }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{d.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{d.date}</Typography>
                          </Box>
                          <Chip label={`${d.daysLeft}d`} size="small" sx={{ bgcolor: urgencyColor(d.daysLeft), color: "white", fontWeight: 700, fontSize: "0.7rem", minWidth: 34 }} />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Recent Activity</Typography>
                    <List disablePadding>
                      {recentActivity.map((a, i) => (
                        <React.Fragment key={i}>
                          <ListItem sx={{ px: 0, py: 1.2 }}>
                            <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: a.color + "22", color: a.color, display: "flex", alignItems: "center", justifyContent: "center", mr: 2, flexShrink: 0 }}>
                              {a.icon}
                            </Box>
                            <ListItemText
                              primary={<Typography variant="body2" fontWeight={600}>{a.text}</Typography>}
                              secondary={<Typography variant="caption" color="text.secondary">{a.time}</Typography>}
                            />
                          </ListItem>
                          {i < recentActivity.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ━━━━ TAB 1: MY COURSES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>My Courses</Typography>
                <Typography variant="body2" color="text.secondary">{courses.length} enrolled · Spring 2025</Typography>
              </Box>
              <Button variant="contained" startIcon={<School />} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 700, background: gradients[0] }}>
                Register Course
              </Button>
            </Box>

            <Grid container spacing={3}>
              {courses.map((course, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", overflow: "hidden", transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)", boxShadow: `0 20px 48px ${course.color}22` } }}>
                    <Box sx={{ height: 6, bgcolor: course.color }} />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                        <Box>
                          <Chip label={course.code} size="small" sx={{ bgcolor: course.color + "22", color: course.color, fontWeight: 700, mb: 0.5 }} />
                          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>{course.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{course.instructor}</Typography>
                        </Box>
                        <Chip label={course.grade} sx={{ fontWeight: 800, bgcolor: course.color, color: "white", fontSize: "0.95rem", minWidth: 44, flexShrink: 0 }} />
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{course.days} · {course.time}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <School sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{course.room}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Book sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{course.credits} Credits</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 0.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>Progress</Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: course.color }}>{course.progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={course.progress} sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.action.selected, "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: course.color } }} />
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: course.color, color: course.color, "&:hover": { bgcolor: course.color + "11" }, flex: 1 }}>Materials</Button>
                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1 }}>Assignments</Button>
                        <Button size="small" variant="contained" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: course.color, "&:hover": { bgcolor: course.color }, flex: 1 }}>Grades</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ━━━━ TAB 2: GRADES & GPA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 2 && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {[
                { label: "Semester GPA", value: "3.74", sub: "/ 4.0", color: "#2e7d32" },
                { label: "Cumulative GPA", value: "3.68", sub: "/ 4.0", color: "#1976d2" },
                { label: "Credits This Sem", value: String(totalCredits), sub: "hrs", color: "#6a1b9a" },
                { label: "Total Credits", value: String(earnedCredits), sub: `/ ${requiredCredits}`, color: "#e65100" },
              ].map((c, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", textAlign: "center", transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.1)" } }}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Typography variant="h3" fontWeight={800} sx={{ color: c.color }}>
                        {c.value}<Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>{c.sub}</Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Dean's list banner */}
            <Card elevation={0} sx={{ borderRadius: 4, mb: 3, bgcolor: mode === "dark" ? "#451a03" : "#fef3c7", border: `1px solid #fbbf24` }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}>
                <Star sx={{ color: "#f59e0b", fontSize: 28 }} />
                <Box>
                  <Typography fontWeight={700} sx={{ color: mode === "dark" ? "#fbbf24" : "#92400e" }}>🎉 Dean's List Eligible!</Typography>
                  <Typography variant="caption" sx={{ color: mode === "dark" ? "#fcd34d" : "#92400e" }}>Your GPA of 3.74 qualifies you for the Dean's List for Spring 2025.</Typography>
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Grade Report — Spring 2025</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {["Course", "Credits", "Grade", "GPA Pts", "Status"].map((h) => (
                              <TableCell key={h} sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {gradesData.map((row, i) => (
                            <TableRow key={i} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: row.color, flexShrink: 0 }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight={700}>{row.code}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 130, display: "block" }}>{row.name}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell><Typography variant="body2">{row.credits}</Typography></TableCell>
                              <TableCell><Chip label={row.grade} size="small" sx={{ fontWeight: 700, bgcolor: row.color, color: "white", minWidth: 40 }} /></TableCell>
                              <TableCell><Typography variant="body2" fontWeight={600}>{row.points.toFixed(1)}</Typography></TableCell>
                              <TableCell>
                                <Chip label={row.status} size="small" variant="outlined" sx={{ fontSize: "0.68rem", fontWeight: 600, borderColor: statusColor(row.status), color: statusColor(row.status) }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>GPA Points by Course</Typography>
                    <Box sx={{ height: 220, mt: 1 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradesData.map((g) => ({ name: g.code, gpa: g.points, color: g.color }))} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                          <YAxis domain={[0, 4]} hide />
                          <ChartTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 12, border: `1px solid ${theme.palette.divider}` }} />
                          <Bar dataKey="gpa" radius={[6, 6, 0, 0]}>
                            {gradesData.map((_, idx) => <Cell key={idx} fill={gradesData[idx].color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Graduation Progress</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>Credits Earned</Typography>
                        <Typography variant="body2" fontWeight={800} color="primary.main">{earnedCredits} / {requiredCredits}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={(earnedCredits / requiredCredits) * 100} sx={{ height: 12, borderRadius: 6, bgcolor: theme.palette.action.selected, "& .MuiLinearProgress-bar": { borderRadius: 6, background: gradients[1] } }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        {requiredCredits - earnedCredits} credits remaining · Expected graduation: Dec 2026
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ━━━━ TAB 3: SCHEDULE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>Weekly Schedule</Typography>
                <Typography variant="body2" color="text.secondary">Spring 2025 · Mon – Fri</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {courses.slice(0, 4).map((c, i) => (
                  <Chip key={i} label={c.code} size="small" sx={{ bgcolor: c.color + "22", color: c.color, fontWeight: 700, fontSize: "0.7rem" }} />
                ))}
              </Box>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", overflow: "hidden" }}>
              <Box sx={{ overflowX: "auto" }}>
                <Box sx={{ minWidth: 640 }}>
                  {/* Header */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "64px repeat(5, 1fr)", borderBottom: "2px solid", borderColor: "divider" }}>
                    <Box sx={{ p: 1 }} />
                    {DAYS.map((day) => (
                      <Box key={day} sx={{ p: 1.5, textAlign: "center", bgcolor: day === todayDay ? "primary.main" : "transparent" }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: day === todayDay ? "white" : "text.primary" }}>{day}</Typography>
                        {day === todayDay && <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65rem" }}>Today</Typography>}
                      </Box>
                    ))}
                  </Box>

                  {/* Rows */}
                  {HOURS.map((hour) => (
                    <Box key={hour} sx={{ display: "grid", gridTemplateColumns: "64px repeat(5, 1fr)", borderBottom: "1px solid", borderColor: "divider", minHeight: 60 }}>
                      <Box sx={{ p: 1, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", pr: 1.5, pt: 1.2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{hour}:00</Typography>
                      </Box>
                      {DAYS.map((day) => {
                        const block = scheduleBlocks.find((b) => b.day === day && b.start === hour);
                        return (
                          <Box key={day} sx={{ p: 0.4, bgcolor: day === todayDay ? "rgba(25,118,210,0.04)" : "transparent", position: "relative" }}>
                            {block && (
                              <Tooltip title={`${block.code} — ${block.room}`} arrow>
                                <Box sx={{
                                  height: `${(block.end - block.start) * 60 - 6}px`,
                                  bgcolor: block.color + "22",
                                  border: `2px solid ${block.color}`,
                                  borderRadius: 2, p: 1, cursor: "pointer",
                                  transition: "all 0.2s",
                                  "&:hover": { transform: "scale(1.03)", boxShadow: `0 4px 16px ${block.color}44` },
                                }}>
                                  <Typography variant="caption" fontWeight={800} sx={{ color: block.color, display: "block", lineHeight: 1.2, fontSize: "0.72rem" }}>{block.code}</Typography>
                                  <Typography variant="caption" sx={{ color: block.color, opacity: 0.75, fontSize: "0.62rem" }}>{block.room}</Typography>
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {/* ━━━━ TAB 4: ANNOUNCEMENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === 4 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>Announcements</Typography>
                <Typography variant="body2" color="text.secondary">{newAnnCount} new · {announcements.length} total</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {announcements.map((ann, i) => (
                <Card key={i} elevation={0} sx={{
                  borderRadius: 4, border: "1px solid",
                  borderColor: ann.isNew ? ann.tagColor + "55" : "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.3s",
                  "&:hover": { transform: "translateX(4px)", boxShadow: `inset 4px 0 0 ${ann.tagColor}, 0 8px 24px rgba(0,0,0,0.06)` },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: ann.tagColor + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Campaign sx={{ color: ann.tagColor, fontSize: 22 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                          <Typography variant="subtitle1" fontWeight={700}>{ann.title}</Typography>
                          <Chip label={ann.tag} size="small" sx={{ bgcolor: ann.tagColor, color: "white", fontWeight: 700, fontSize: "0.63rem", height: 18 }} />
                          {ann.isNew && <Chip label="NEW" size="small" color="error" sx={{ fontWeight: 700, fontSize: "0.63rem", height: 18 }} />}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>{ann.body}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Typography variant="caption" color="text.disabled">{ann.source}</Typography>
                          <Typography variant="caption" color="text.disabled">·</Typography>
                          <Typography variant="caption" color="text.disabled">{ann.date}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

      </Container>
    </Box>
  );
}
