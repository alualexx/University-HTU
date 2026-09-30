import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  List,
  ListItem,
  Tooltip,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  MenuBook,
  Schedule,
  TrendingUp,
  AssignmentTurnedIn,
  School,
  Settings,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Church,
  Download,
  CheckCircle,
  WarningAmber,
  Add,
  EventNote,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const HTTU_COLORS = {
  navy: "#0E2033",
  gold: "#D9A621",
  teal: "#12808C",
  canvas: "#F4F6F8",
  border: "#E2E8F0",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
};

const DEPT_NAV = [
  { label: "Dashboard", icon: <DashboardIcon />, tab: 0 },
  { label: "Department Staff", icon: <People />, tab: 1 },
  { label: "Courses & Sections", icon: <MenuBook />, tab: 2 },
  { label: "Timetable & Rooms", icon: <Schedule />, tab: 3 },
  { label: "Performance", icon: <TrendingUp />, tab: 4 },
  { label: "Advising & Students", icon: <School />, tab: 5 },
  { label: "Approvals", icon: <AssignmentTurnedIn />, tab: 6 },
  { label: "Quality & Accreditation", icon: <CheckCircle />, tab: 7 },
  { label: "Settings", icon: <Settings />, tab: 8 },
];

export default function DepartmentDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [actionAlert, setActionAlert] = useState("");

  const facultyLoad = [
    {
      name: "Dr. Sofia Assefa",
      courses: "BI 210 · BI 340 · NT exegesis seminar",
      rank: "Associate Prof.",
      credits: 18,
      sections: 3,
      advisees: 12,
      eval: "4.6 / 5",
      status: "Overloaded",
      statusColor: "danger",
    },
    {
      name: "Dr. Testage Melaku",
      courses: "NT 305 · NT 402 · Greek I",
      rank: "Assistant Prof.",
      credits: 15,
      sections: 3,
      advisees: 10,
      eval: "4.4 / 5",
      status: "Balanced",
      statusColor: "success",
    },
    {
      name: "Fr. Dawit Gebre",
      courses: "CH 301 · OT 210",
      rank: "Lecturer",
      credits: 14,
      sections: 2,
      advisees: 8,
      eval: "4.7 / 5",
      status: "Balanced",
      statusColor: "success",
    },
    {
      name: "Dr. Bethlehem Tesema",
      courses: "PT 220 · PT 310 · BI 120",
      rank: "Assistant Prof.",
      credits: 16,
      sections: 3,
      advisees: 9,
      eval: "4.2 / 5",
      status: "Overloaded",
      statusColor: "danger",
    },
    {
      name: "W/ro Hanna Girma",
      courses: "Hebrew I · OT survey (part-time)",
      rank: "Lecturer",
      credits: 9,
      sections: 2,
      advisees: "—",
      eval: "4.0 / 5",
      status: "Underloaded",
      statusColor: "warning",
    },
    {
      name: "Dr. Yonas Tesfaye",
      courses: "On sabbatical — returns Jun 2025",
      rank: "Professor",
      credits: 0,
      sections: 0,
      advisees: "—",
      eval: "—",
      status: "Sabbatical",
      statusColor: "neutral",
    },
  ];

  const deptApprovals = [
    { id: 1, title: "Annual leave — Fr. Dawit Gebre", detail: "Mar 17–21 · 5 days · cover arranged", type: "leave" },
    { id: 2, title: "Grade change — BI 210 Sec 01", detail: "2 students · submitted after finalization", type: "grade" },
    { id: 3, title: "Grade change — OT 210 Sec 03", detail: "Arithmetic correction · B- → B", type: "grade" },
    { id: 4, title: "Sick leave — W/ro Hanna Girma", detail: "Mar 6–7 · medical note attached", type: "leave" },
    { id: 5, title: "Advising overload — Dr. Testage Melaku", detail: "Requests 2 advisees reassigned", type: "advising" },
  ];

  const sectionStatus = [
    { code: "BI 210 Sec 01", enrolled: 48, cap: 50, color: HTTU_COLORS.danger },
    { code: "BI 210 Sec 02", enrolled: 41, cap: 50, color: HTTU_COLORS.danger },
    { code: "NT 305 Sec 01", enrolled: 45, cap: 45, color: HTTU_COLORS.danger },
    { code: "OT 210 Sec 01", enrolled: 37, cap: 50, color: HTTU_COLORS.teal },
    { code: "Greek I Sec 01", enrolled: 18, cap: 31, color: HTTU_COLORS.teal },
    { code: "Hebrew I Sec 01", enrolled: 11, cap: 28, color: "#B48316" },
  ];

  const atRiskStudents = [
    { name: "Hanna Mengistu · HTTU22041", detail: "GPA 1.86 · failed BI 210 twice · 3 absences", tag: "Intervention", color: "danger", initials: "HM" },
    { name: "Thomas Belete · HTTU23117", detail: "GPA 2.14 · on academic warning · finance hold", tag: "Warning", color: "warning", initials: "TB" },
    { name: "Sara Getachew · HTTU24002", detail: "Registered for 11 credits — below 12 minimum", tag: "Load check", color: "warning", initials: "SG" },
    { name: "Meron Tadesse · HTTU21088", detail: "GPA 3.78 · thesis topic approved · on track", tag: "On track", color: "success", initials: "MT" },
  ];

  const accreditationItems = [
    { crit: "Program learning outcomes mapped to courses", evid: "Curriculum matrix v3.2 uploaded", owner: "Dr. Testage Melaku", status: "Complete", color: "success" },
    { crit: "Course evaluation results (2 cycles)", evid: "Spring + Fall 2024 · 94% response", owner: "Dept. Head", status: "Complete", color: "success" },
    { crit: "Staff qualification profile", evid: "11 of 14 records verified in HR", owner: "Hanna Bekele (HR)", status: "In progress", color: "warning" },
    { crit: "Library holdings per core course", evid: "Greek/Hebrew titles below threshold", owner: "Librarian", status: "Gap", color: "danger" },
    { crit: "Assessment moderation samples", evid: "10% of scripts per course required", owner: "Course coordinators", status: "Not started", color: "neutral" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: HTTU_COLORS.canvas }}>
      {/* ── HTTU Master Navy Sidebar ── */}
      <Box
        sx={{
          width: sidebarOpen ? 260 : 78,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bgcolor: HTTU_COLORS.navy,
          color: "white",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          zIndex: 1200,
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {sidebarOpen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  border: `2px solid ${HTTU_COLORS.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(217, 166, 33, 0.12)",
                }}
              >
                <Church sx={{ color: HTTU_COLORS.gold, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: HTTU_COLORS.gold, letterSpacing: 0.5, display: "block", lineHeight: 1.1 }}>
                  HOLY TRINITY
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.68rem" }}>
                  DEPARTMENT HEAD
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "rgba(255,255,255,0.7)" }}>
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
          {DEPT_NAV.map((item) => {
            const isSelected = activeTab === item.tab;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
                  <Button
                    fullWidth
                    onClick={() => setActiveTab(item.tab)}
                    startIcon={<Box sx={{ color: isSelected ? HTTU_COLORS.navy : "rgba(255,255,255,0.7)", display: "flex" }}>{item.icon}</Box>}
                    sx={{
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      px: sidebarOpen ? 2 : 0,
                      py: 1.2,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: "0.85rem",
                      bgcolor: isSelected ? HTTU_COLORS.gold : "transparent",
                      color: isSelected ? HTTU_COLORS.navy : "rgba(255,255,255,0.8)",
                      "&:hover": {
                        bgcolor: isSelected ? HTTU_COLORS.gold : "rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    {sidebarOpen && item.label}
                  </Button>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          {sidebarOpen ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, fontSize: "0.85rem" }}>
                SA
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ color: "white", fontSize: "0.82rem" }}>
                  Dr. Sofia Assefa
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", display: "block" }}>
                  Head · Biblical Studies
                </Typography>
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ width: 34, height: 34, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800 }}>
              SA
            </Avatar>
          )}
          {sidebarOpen && (
            <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
              <Logout fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ── Main Content Area ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarOpen ? 260 : 78}px`,
          p: { xs: 2.5, md: 4 },
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Header Strip */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Departments / Biblical Studies</Typography>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                Department of Biblical Studies
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
                Staffing, section capacity, teaching quality and advising · Wed Mar 5, 2025
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Chip label="Week 7 of 15 · Spring 2025" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
              <Button variant="outlined" startIcon={<EventNote />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Timetable
              </Button>
              <Button variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Department report
              </Button>
              <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}>
                New section request
              </Button>
            </Box>
          </Box>

          {actionAlert && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionAlert("")}>
              {actionAlert}
            </Alert>
          )}

          {/* 4 Stat HUD Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                    <School sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>DEPARTMENT STUDENTS</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>318</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  214 major · 104 service-course
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ +12 vs Fall 2024
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316" }}>
                    <People sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>TEACHING STAFF</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>14</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  9 full-time · 5 part-time · 1 on sabbatical
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  — 2 vacant posts advertised
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.1)", color: HTTU_COLORS.success }}>
                    <TrendingUp sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>SECTION FILL RATE</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>87%</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  22 sections · 1,246 seats of 1,432
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ +3.1 pts since week 4
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: HTTU_COLORS.danger }}>
                    <WarningAmber sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>ITEMS NEEDING ACTION</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>7</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  3 leave · 2 grade changes · 2 advising
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
                  ↑ Oldest pending 6 days
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Main 2-Column Section */}
          <Grid container spacing={3}>
            {/* Left Column (Teaching Load, Section Status & Course Grade Averages, Quality Checklist) */}
            <Grid item xs={12} lg={8}>
              {/* Faculty Teaching Load Table */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Faculty Teaching Load
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.danger }} /> Overloaded &gt;15
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.success }} /> Balanced 12–15
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.warning }} /> Underloaded &lt;12
                    </Typography>
                  </Box>
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STAFF MEMBER</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>RANK</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>CREDIT HRS</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>SECTIONS</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ADVISEES</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>AVG COURSE EVAL</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>LOAD STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facultyLoad.map((fac, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{fac.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{fac.courses}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{fac.rank}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800 }}>{fac.credits}</TableCell>
                        <TableCell align="center">{fac.sections}</TableCell>
                        <TableCell align="center">{fac.advisees}</TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.82rem" }}>{fac.eval}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={fac.status}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor:
                                fac.statusColor === "danger"
                                  ? "rgba(239, 68, 68, 0.12)"
                                  : fac.statusColor === "success"
                                  ? "rgba(16, 185, 129, 0.12)"
                                  : fac.statusColor === "warning"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : "#F1F5F9",
                              color:
                                fac.statusColor === "danger"
                                  ? HTTU_COLORS.danger
                                  : fac.statusColor === "success"
                                  ? HTTU_COLORS.success
                                  : fac.statusColor === "warning"
                                  ? "#B48316"
                                  : "#64748B",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ p: 1.5, bgcolor: "#FAFAFA", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="caption" color={HTTU_COLORS.teal} sx={{ fontWeight: 700, cursor: "pointer" }}>
                    Open load-balancing worksheet →
                  </Typography>
                </Box>
              </Card>

              {/* Section Status & Course Grade Averages Grid */}
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Section Status
                      </Typography>
                      <Chip label="Spring 2025 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {sectionStatus.map((sec, idx) => (
                        <Box key={idx}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                            <Typography variant="caption" fontWeight={600}>{sec.code}</Typography>
                            <Typography variant="caption" fontWeight={800}>{sec.enrolled}/{sec.cap}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(sec.enrolled / sec.cap) * 100}
                            sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: sec.color } }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic" }}>
                      NT 305 is full with a 9-student waitlist — recommend opening Sec 02
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Course Grade Averages
                      </Typography>
                      <Chip label="Last finalized ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {[
                        { name: "BI 210 Hermeneutics", grade: "B+", val: 80, col: HTTU_COLORS.teal },
                        { name: "NT 305 Synoptics", grade: "B", val: 74, col: HTTU_COLORS.teal },
                        { name: "OT 210 Pentateuch", grade: "B-", val: 70, col: HTTU_COLORS.teal },
                        { name: "Greek I", grade: "C+", val: 65, col: "#B48316" },
                        { name: "Hebrew I", grade: "C", val: 59, col: "#B48316" },
                        { name: "BI 120 OT Survey", grade: "A-", val: 85, col: HTTU_COLORS.success },
                      ].map((cg, idx) => (
                        <Box key={idx}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                            <Typography variant="caption" fontWeight={600}>{cg.name}</Typography>
                            <Typography variant="caption" fontWeight={800}>{cg.grade}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={cg.val}
                            sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: cg.col } }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic" }}>
                      Language courses flagged for tutorial support — proposal to Dean by Mar 20
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Quality & Accreditation Checklist */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Quality & Accreditation Checklist
                  </Typography>
                  <Chip label="HERQA self-study due Apr 30, 2025" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>CRITERION</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>EVIDENCE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>OWNER</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accreditationItems.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontWeight: 700, color: HTTU_COLORS.navy }}>{item.crit}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{item.evid}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{item.owner}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor:
                                item.color === "success"
                                  ? "rgba(16, 185, 129, 0.12)"
                                  : item.color === "warning"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : item.color === "danger"
                                  ? "rgba(239, 68, 68, 0.12)"
                                  : "#F1F5F9",
                              color:
                                item.color === "success"
                                  ? HTTU_COLORS.success
                                  : item.color === "warning"
                                  ? "#B48316"
                                  : item.color === "danger"
                                  ? HTTU_COLORS.danger
                                  : "#64748B",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>

            {/* Right Column (Department Approvals, Advising & At-Risk, Upcoming) */}
            <Grid item xs={12} lg={4}>
              {/* Department Approvals */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Department Approvals
                  </Typography>
                  <Chip label="7 pending" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700, fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {deptApprovals.map((app) => (
                    <Box key={app.id} sx={{ pb: 1.5, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{app.title}</Typography>
                        {app.type === "leave" ? (
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => setActionAlert(`Approved leave for ${app.title}`)}
                              sx={{ fontSize: "0.65rem", py: 0.2, px: 1, bgcolor: HTTU_COLORS.teal, textTransform: "none" }}
                            >
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" sx={{ fontSize: "0.65rem", py: 0.2, px: 1, borderColor: HTTU_COLORS.border, textTransform: "none" }}>
                              Deny
                            </Button>
                          </Box>
                        ) : (
                          <Button size="small" variant="outlined" sx={{ fontSize: "0.65rem", py: 0.2, px: 1, borderColor: HTTU_COLORS.border, textTransform: "none" }}>
                            Review
                          </Button>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">{app.detail}</Typography>
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic" }}>
                  Leave approvals sync to HR; grade changes escalate to the Dean after 10 days
                </Typography>
              </Card>

              {/* Advising & At-Risk */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Advising & At-Risk
                  </Typography>
                  <Chip label="All advisees →" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {atRiskStudents.map((stu, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 3 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem", bgcolor: stu.color === "danger" ? "rgba(239, 68, 68, 0.15)" : "rgba(18, 128, 140, 0.15)", color: stu.color === "danger" ? HTTU_COLORS.danger : HTTU_COLORS.teal, fontWeight: 700 }}>
                          {stu.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{stu.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{stu.detail}</Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={stu.tag}
                        size="small"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor: stu.color === "danger" ? "rgba(239, 68, 68, 0.12)" : stu.color === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.15)",
                          color: stu.color === "danger" ? HTTU_COLORS.danger : stu.color === "success" ? HTTU_COLORS.success : "#B48316",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic" }}>
                  39 advisees across 4 staff · advising week Mar 10–14
                </Typography>
              </Card>

              {/* Upcoming */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Upcoming
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { date: "Mar 10 — Mid-semester exam week begins", note: "Room bookings close Mar 7 · 6 sections need invigilators", bg: "rgba(18, 128, 140, 0.08)" },
                    { date: "Mar 14 — Department meeting, 14:00", note: "Agenda: NT 305 second section, language tutorials, vacant posts", bg: "rgba(217, 166, 33, 0.1)" },
                    { date: "Mar 28 — Grade submission deadline", note: "14 of 22 sections have not yet submitted final grades", bg: "rgba(59, 130, 246, 0.08)" },
                    { date: "Apr 30 — HERQA self-study submission", note: "3 of 5 criteria complete · 1 gap in library holdings", bg: "rgba(168, 85, 247, 0.08)" },
                  ].map((up, idx) => (
                    <Box key={idx} sx={{ p: 1.5, borderRadius: 2, bgcolor: up.bg, border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{up.date}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.3 }}>{up.note}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
