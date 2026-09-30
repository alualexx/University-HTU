import React, { useState } from "react";
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
  Business,
  AssignmentTurnedIn,
  Group,
  School,
  TrendingUp,
  AutoStories,
  AccountBalanceWallet,
  Settings,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Church,
  Download,
  CheckCircle,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
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

const DEAN_NAV = [
  { label: "Dashboard", icon: <DashboardIcon />, tab: 0 },
  { label: "Departments", icon: <Business />, tab: 1 },
  { label: "Curriculum & Approvals", icon: <AssignmentTurnedIn />, tab: 2 },
  { label: "Faculty & Workload", icon: <Group />, tab: 3 },
  { label: "Programs", icon: <School />, tab: 4 },
  { label: "Student Success", icon: <TrendingUp />, tab: 5 },
  { label: "Research", icon: <AutoStories />, tab: 6 },
  { label: "Budget", icon: <AccountBalanceWallet />, tab: 7 },
  { label: "Settings", icon: <Settings />, tab: 8 },
];

export default function DeanDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [actionNotice, setActionNotice] = useState("");

  const approvalQueue = [
    {
      id: 1,
      title: "New course — PT 415 Orthodox Liturgical Practice",
      desc: "4 credit hours · proposed for Fall 2025 catalogue",
      dept: "Practical Theology",
      submittedBy: "Fr. Dawit Gebre",
      age: "2 d",
      status: "Dean review",
      statusColor: "warning",
    },
    {
      id: 2,
      title: "Curriculum revision — B.A. Theology core",
      desc: "Replaces TH 210 with TH 212 · 160 credits unchanged",
      dept: "Systematic Theology",
      submittedBy: "Dr. Alemeyahu Worku",
      age: "5 d",
      status: "Dean review",
      statusColor: "warning",
    },
    {
      id: 3,
      title: "Workload exception — Dr. Sofia Assefa",
      desc: "18 credit hours · above the 15-hour balanced ceiling",
      dept: "Biblical Studies",
      submittedBy: "Dept. Head",
      age: "7 d",
      status: "Justified",
      statusColor: "teal",
    },
    {
      id: 4,
      title: "Grade change — TH 201 Sec 02, 3 students",
      desc: "Submitted after finalization · requires dean sign-off",
      dept: "Systematic Theology",
      submittedBy: "Dr. Alemeyahu Worku",
      age: "9 d",
      status: "Escalated",
      statusColor: "danger",
    },
    {
      id: 5,
      title: "Credit waiver — transfer student Meron Haile",
      desc: "9 credits from Mekane Yesus Seminary",
      dept: "Registrar referral",
      submittedBy: "Meskerem Abebe",
      age: "11 d",
      status: "Dean review",
      statusColor: "warning",
    },
  ];

  const workloadDonut = [
    { name: "Biblical Studies", value: 26, color: "#12808C" },
    { name: "Systematic Theology", value: 16, color: "#10B981" },
    { name: "Practical Theology", value: 14, color: "#3B82F6" },
    { name: "Church History", value: 8, color: "#D9A621" },
    { name: "Languages / other", value: 4, color: "#F97316" },
  ];

  const studentSuccessData = [
    { year: "2021", gpa: 2.71, retention: 88, atRisk: 12 },
    { year: "2022", gpa: 2.80, retention: 89, atRisk: 10 },
    { year: "2023", gpa: 2.92, retention: 90, atRisk: 9 },
    { year: "2024", gpa: 3.02, retention: 91, atRisk: 8 },
    { year: "2025", gpa: 3.06, retention: 91.4, atRisk: 7.2 },
  ];

  const programHealth = [
    { name: "B.A. Theology", duration: "4 years · 160 credits", level: "Undergraduate", enrolled: 612, cap: 700, fill: 87, gpa: 3.02, status: "On track" },
    { name: "B.A. Biblical Studies", duration: "4 years · 154 credits", level: "Undergraduate", enrolled: 318, cap: 350, fill: 91, gpa: 3.14, status: "On track" },
    { name: "M.Div. Pastoral Ministry", duration: "3 years · cohort model", level: "Postgraduate", enrolled: 286, cap: 300, fill: 95, gpa: 3.41, status: "On track" },
    { name: "M.A. Systematic Theology", duration: "2 years · thesis track", level: "Postgraduate", enrolled: 94, cap: 150, fill: 63, gpa: 3.36, status: "Low intake" },
    { name: "Certificate in Church Music", duration: "1 year · evening", level: "Certificate", enrolled: 38, cap: 40, fill: 95, gpa: 3.20, status: "On track" },
    { name: "Ph.D. Theology (new)", duration: "Awaiting HERQA accreditation", level: "Doctoral", enrolled: 0, cap: 15, fill: 0, gpa: "—", status: "Not launched" },
  ];

  const handleApprove = (item) => {
    setActionNotice(`Approved: "${item.title}". Notification sent to department.`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: HTTU_COLORS.canvas }}>
      {/* ── Dean Sidebar ── */}
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
                  DEAN · FACULTY OF THEOLOGY
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "rgba(255,255,255,0.7)" }}>
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
          {DEAN_NAV.map((item) => {
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
                AZ
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ color: "white", fontSize: "0.82rem" }}>
                  Rev. Dr. Abeba Zerihun
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", display: "block" }}>
                  Dean · Faculty of Theology
                </Typography>
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ width: 34, height: 34, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800 }}>
              AZ
            </Avatar>
          )}
          {sidebarOpen && (
            <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
              <Logout fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ── Main Content ── */}
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
          {/* Top Bar with Spring Semester 2025 chip */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                Dean Dashboard
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
                Faculty of Theology · academic quality, approvals and resource oversight · Wed Mar 5, 2025
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Chip label="Spring Semester 2025" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
              <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Export report
              </Button>
              <Button variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Faculty meeting minutes
              </Button>
              <Button variant="contained" sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}>
                Review approvals (9)
              </Button>
            </Box>
          </Box>

          {actionNotice && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionNotice("")}>
              {actionNotice}
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
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>ENROLLED STUDENTS</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>1,842</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  1,318 UG · 486 PG · 38 certificate
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ +4.8% vs Fall 2024
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.1)", color: HTTU_COLORS.success }}>
                    <TrendingUp sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>FACULTY AVERAGE GPA</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>3.06</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  Retention to year 2: 91.4%
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ +0.04 year over year
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(14, 32, 51, 0.1)", color: HTTU_COLORS.navy }}>
                    <Group sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>ACADEMIC STAFF</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>68</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  42 full-time · 26 part-time · 9 on leave
                </Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  — Student:staff ratio 27:1
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316" }}>
                    <AssignmentTurnedIn sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>AWAITING DEAN DECISION</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>9</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  5 curriculum · 3 workload · 1 waiver
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
                  ↑ Oldest pending 11 days
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Main 2-Column Section */}
          <Grid container spacing={3}>
            {/* Left Column (Approval Queue, Student Success Trend, Program Health) */}
            <Grid item xs={12} lg={8}>
              {/* Approval Queue */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Approval Queue
                  </Typography>
                  <Chip label="All requests ▾" size="small" sx={{ fontSize: "0.72rem" }} />
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>REQUEST</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>DEPARTMENT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>SUBMITTED BY</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>AGE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvalQueue.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.82rem" }}>{item.dept}</TableCell>
                        <TableCell sx={{ fontSize: "0.82rem" }}>{item.submittedBy}</TableCell>
                        <TableCell sx={{ fontSize: "0.82rem" }}>{item.age}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor:
                                item.statusColor === "warning"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : item.statusColor === "teal"
                                  ? "rgba(18, 128, 140, 0.15)"
                                  : "rgba(239, 68, 68, 0.12)",
                              color:
                                item.statusColor === "warning"
                                  ? "#B48316"
                                  : item.statusColor === "teal"
                                  ? HTTU_COLORS.teal
                                  : HTTU_COLORS.danger,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Button size="small" variant="outlined" sx={{ fontSize: "0.72rem", textTransform: "none", py: 0.2 }}>
                              Review
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleApprove(item)}
                              sx={{ fontSize: "0.72rem", textTransform: "none", py: 0.2, bgcolor: HTTU_COLORS.teal }}
                            >
                              Approve
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ p: 1.5, bgcolor: "#FAFAFA", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="caption" color={HTTU_COLORS.teal} sx={{ fontWeight: 700, cursor: "pointer" }}>
                    View all 9 pending approvals →
                  </Typography>
                </Box>
              </Card>

              {/* Student Success Trend */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Student Success Trend
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.teal }} /> Avg GPA
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.gold }} /> Retention %
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.danger }} /> At-risk %
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentSuccessData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="gpa" stroke={HTTU_COLORS.teal} strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="retention" stroke={HTTU_COLORS.gold} strokeWidth={2} strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="atRisk" stroke={HTTU_COLORS.danger} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: "flex", gap: 3, mt: 2, pt: 1.5, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="caption" color="text.secondary"><b>3.06</b> avg GPA (from 2.71 in 2021)</Typography>
                  <Typography variant="caption" color="text.secondary"><b>91.4%</b> year-1 retention</Typography>
                  <Typography variant="caption" color="error.main"><b>7.2%</b> flagged at-risk this term</Typography>
                </Box>
              </Card>

              {/* Program Health by Department */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Program Health by Department
                  </Typography>
                  <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: HTTU_COLORS.border }}>
                    Accreditation report
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>PROGRAM</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>LEVEL</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ENROLLED</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>CAPACITY</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>FILL RATE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>AVG GPA</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {programHealth.map((prog, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{prog.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{prog.duration}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{prog.level}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>{prog.enrolled}</TableCell>
                        <TableCell align="center">{prog.cap}</TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={prog.fill}
                              sx={{
                                flex: 1,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "#EDF2F7",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: prog.fill >= 80 ? HTTU_COLORS.teal : "#B48316",
                                },
                              }}
                            />
                            <Typography variant="caption" fontWeight={700}>{prog.fill}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>{prog.gpa}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={prog.status}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor:
                                prog.status === "On track"
                                  ? "rgba(16, 185, 129, 0.12)"
                                  : prog.status === "Low intake"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : "#F1F5F9",
                              color:
                                prog.status === "On track"
                                  ? HTTU_COLORS.success
                                  : prog.status === "Low intake"
                                  ? "#B48316"
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

            {/* Right Column (Workload Distribution, Research, Budget Snapshot) */}
            <Grid item xs={12} lg={4}>
              {/* Workload Distribution */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Workload Distribution
                  </Typography>
                  <Chip label="Spring 2025 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <Box sx={{ position: "relative", width: 110, height: 110, mx: "auto" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={workloadDonut} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                            {workloadDonut.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>68</Typography>
                        <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "text.secondary", display: "block", mt: -0.5 }}>staff</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {workloadDonut.map((item, idx) => (
                        <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, color: HTTU_COLORS.textSecondary }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: item.color }} /> {item.name}
                          </Typography>
                          <Typography variant="caption" fontWeight={800}>{item.value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Balanced load (12–15 hrs)</Typography>
                    <Typography variant="caption" fontWeight={800}>41</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={60} sx={{ height: 5, borderRadius: 2.5, mb: 1.5, "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal } }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Overloaded (&gt;15 hrs)</Typography>
                    <Typography variant="caption" fontWeight={800} color="error.main">18</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Underloaded (&lt;12 hrs)</Typography>
                    <Typography variant="caption" fontWeight={800} color="warning.main">9</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic" }}>
                    Rebalancing proposal due to the Faculty Board by Mar 20, 2025
                  </Typography>
                </Box>
              </Card>

              {/* Research & Publications */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Research & Publications
                  </Typography>
                  <Chip label="FY 2024/25" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2, border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Journal articles</Typography>
                      <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>34</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>Peer-reviewed · indexed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2, border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Books & chapters</Typography>
                      <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>11</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>incl. 3 Amharic titles</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2, border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Grants secured</Typography>
                      <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.teal}>6</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>ETB 4.8M · 6 projects</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2, border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Conferences</Typography>
                      <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>19</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>2 hosted at HTTU</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic" }}>
                  Ethics clearance pending: 2 proposals (Ge'ez manuscript digitization; youth ministry survey)
                </Typography>
              </Card>

              {/* Budget Snapshot */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Budget Snapshot
                  </Typography>
                  <Chip label="FY 2024/25 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { label: "Academic salaries", amt: "ETB 18.4M / 24.0M", pct: 76, color: HTTU_COLORS.teal },
                    { label: "Research grants", amt: "ETB 3.1M / 4.8M", pct: 64, color: "#6366F1" },
                    { label: "Library & materials", amt: "ETB 1.9M / 2.2M", pct: 86, color: HTTU_COLORS.gold },
                    { label: "Field & practicum", amt: "ETB 0.9M / 1.0M", pct: 90, color: "#F97316" },
                    { label: "Faculty development", amt: "ETB 0.6M / 0.6M", pct: 100, color: HTTU_COLORS.success },
                  ].map((bg, idx) => (
                    <Box key={idx}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                        <Typography variant="caption" fontWeight={600} color={HTTU_COLORS.textSecondary}>{bg.label}</Typography>
                        <Typography variant="caption" fontWeight={700}>{bg.amt}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={bg.pct} sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: bg.color } }} />
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic" }}>
                  Faculty development fully committed — reallocation request pending with Finance
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
