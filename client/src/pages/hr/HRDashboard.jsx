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
  Dialog,
  DialogTitle,
  DialogContent,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  PersonAdd,
  EventAvailable,
  LocalAtm,
  TrendingUp,
  School,
  FolderShared,
  Settings,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Church,
  Download,
  CheckCircle,
  WarningAmber,
  Add,
  ArrowForward,
  Close,
  Lock,
  Phone,
  Email,
  CalendarToday,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
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

const HR_NAV = [
  { label: "Dashboard", icon: <DashboardIcon />, tab: 0 },
  { label: "Employees", icon: <People />, tab: 1 },
  { label: "Recruitment", icon: <PersonAdd />, tab: 2 },
  { label: "Leave & Attendance", icon: <EventAvailable />, tab: 3 },
  { label: "Payroll", icon: <LocalAtm />, tab: 4 },
  { label: "Performance", icon: <TrendingUp />, tab: 5 },
  { label: "Training", icon: <School />, tab: 6 },
  { label: "Records & Compliance", icon: <FolderShared />, tab: 7 },
  { label: "Settings", icon: <Settings />, tab: 8 },
];

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const workforceData = [
    { name: "Academic (FT)", value: 42, color: "#12808C" },
    { name: "Academic (PT)", value: 26, color: "#10B981" },
    { name: "Administrative", value: 46, color: "#3B82F6" },
    { name: "Support / services", value: 22, color: "#D9A621" },
    { name: "Volunteers", value: 9, color: "#F97316" },
  ];

  const recruitmentPositions = [
    { pos: "Assistant Professor — New Testament", sub: "Replaces Dr. Yonas Tesfaye (sabbatical)", dept: "Biblical Studies", type: "Full-time", apps: 42, stage: "Interview · 4 shortlisted", closes: "Mar 14", action: "Panel" },
    { pos: "Lecturer — Church History", sub: "", dept: "Church History", type: "Full-time", apps: 38, stage: "Screening · 11 in review", closes: "Mar 14", action: "Review" },
    { pos: "Library Assistant", sub: "", dept: "Library", type: "Full-time", apps: 61, stage: "Shortlist · 6 selected", closes: "Mar 20", action: "Review" },
    { pos: "ICT Support Officer", sub: "", dept: "ICT Directorate", type: "Full-time", apps: 24, stage: "Applications open", closes: "Mar 28", action: "View" },
    { pos: "Registrar Clerk (temporary)", sub: "6-month contract · graduation season", dept: "Registrar", type: "Contract", apps: 21, stage: "Offer issued · 1", closes: "Closed", action: "Onboard" },
  ];

  const recentEmployees = [
    { name: "Abebe Kebede", amh: "አበበ ከበደ", id: "EMP-2026-000123", dept: "Theology Department", pos: "Associate Professor", event: "Record updated — emergency contact", effective: "Mar 5, 2025", status: "Saved" },
    { name: "Dr. Testage Melaku", amh: "", id: "EMP-2026-000087", dept: "Biblical Studies", pos: "Assistant Professor", event: "Promotion review — submitted by Dept. Head", effective: "Apr 1, 2025", status: "In review" },
    { name: "Mulu Tesfaye", amh: "", id: "EMP-2026-000141", dept: "Registrar", pos: "Clerk II", event: "Maternity leave — 120 days", effective: "Apr 1, 2025", status: "Pending" },
    { name: "Solomon Desta", amh: "", id: "EMP-2026-000152", dept: "ICT Directorate", pos: "Support Officer", event: "Contract issued — 6 months", effective: "Mar 10, 2025", status: "Signed" },
    { name: "W/ro Hanna Girma", amh: "", id: "EMP-2026-000095", dept: "Biblical Studies", pos: "Lecturer (PT)", event: "Load adjusted — 9 to 12 credit hours", effective: "Mar 10, 2025", status: "Dept. approved" },
    { name: "Fikru Alemayehu", amh: "", id: "EMP-2026-000061", dept: "Facilities", pos: "Maintenance Supervisor", event: "Exit — resignation accepted", effective: "Mar 31, 2025", status: "Settlement due" },
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
                  THEOLOGY UNIVERSITY
                </Typography>
                <Typography variant="caption" sx={{ color: HTTU_COLORS.gold, fontWeight: 700, fontSize: "0.62rem", display: "block" }}>
                  HUMAN RESOURCES
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "rgba(255,255,255,0.7)" }}>
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
          {HR_NAV.map((item) => {
            const isSelected = activeTab === item.tab;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
                  <Button
                    fullWidth
                    onClick={() => {
                      setActiveTab(item.tab);
                      if (item.tab === 1) setSelectedEmployee("EMP-2026-000123");
                    }}
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
                HB
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ color: "white", fontSize: "0.82rem" }}>
                  Hanna Bekele
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", display: "block" }}>
                  HR Manager
                </Typography>
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ width: 34, height: 34, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800 }}>
              HB
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
          {/* Top Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                HR Dashboard
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
                Workforce of 145 · recruitment, leave, payroll readiness and compliance · Wed Mar 5, 2025
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Chip label="Payroll closes Mar 28, 2025" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
              <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Staff report
              </Button>
              <Button variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Run payroll preview
              </Button>
              <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}>
                New employee
              </Button>
            </Box>
          </Box>

          {/* 4 Stat HUD Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                    <People sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>TOTAL EMPLOYEES</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>145</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  68 academic · 77 administrative & support
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ +6 hired since Jan
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316" }}>
                    <PersonAdd sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>OPEN POSITIONS</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>7</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  186 applicants · 4 in interview stage
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  — 2 posts close Mar 14
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                    <EventAvailable sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>LEAVE REQUESTS</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>12</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  On leave today: 9 staff
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
                  ↑ Approvals pending 3 days max
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: HTTU_COLORS.danger }}>
                    <WarningAmber sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>COMPLIANCE ACTIONS</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>4</Typography>
                <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                  2 expiring contracts · 2 missing docs
                </Typography>
                <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
                  ↑ 1 credential expires in 9 days
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Main 2-Column Section */}
          <Grid container spacing={3}>
            {/* Left Column (Recruitment Pipeline, Leave Approvals, Payroll Readiness, Recent Activity) */}
            <Grid item xs={12} lg={8}>
              {/* Recruitment Pipeline */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Recruitment Pipeline
                  </Typography>
                  <Chip label="All open positions ▾" size="small" sx={{ fontSize: "0.72rem" }} />
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>POSITION</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>DEPARTMENT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>TYPE</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>APPLICANTS</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STAGE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>CLOSES</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recruitmentPositions.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{row.pos}</Typography>
                          {row.sub && <Typography variant="caption" color="text.secondary">{row.sub}</Typography>}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{row.dept}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{row.type}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800 }}>{row.apps}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.stage}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor: row.stage.includes("Offer") ? "rgba(16, 185, 129, 0.12)" : "rgba(18, 128, 140, 0.15)",
                              color: row.stage.includes("Offer") ? HTTU_COLORS.success : HTTU_COLORS.teal,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{row.closes}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="contained" sx={{ fontSize: "0.7rem", py: 0.2, bgcolor: row.action === "Onboard" ? HTTU_COLORS.teal : "#E2E8F0", color: row.action === "Onboard" ? "white" : HTTU_COLORS.navy, textTransform: "none" }}>
                            {row.action}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Leave Approvals & Payroll Readiness */}
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Leave Approvals
                      </Typography>
                      <Chip label="12 pending" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700, fontSize: "0.68rem" }} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {[
                        { name: "Fr. Dawit Gebre", detail: "Annual · Mar 17–21 · cover arranged", action: "Approve" },
                        { name: "W/ro Hanna Girma", detail: "Sick · Mar 6–7 · medical note attached", action: "Approve" },
                        { name: "Abebe Kebede · አበበ ከበደ", detail: "Annual · Apr 7–18 · 14 days balance 21", action: "Review" },
                        { name: "Mulu Tesfaye", detail: "Maternity · from Apr 1 · 120 days", action: "Review" },
                        { name: "Getachew Belay", detail: "Bereavement · Mar 4–8 · dept. notified", action: "Approved" },
                      ].map((item, idx) => (
                        <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 4 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.detail}</Typography>
                          </Box>
                          <Button size="small" variant="contained" sx={{ fontSize: "0.7rem", py: 0.2, bgcolor: item.action === "Approve" ? HTTU_COLORS.teal : "#E2E8F0", color: item.action === "Approve" ? "white" : HTTU_COLORS.navy, textTransform: "none" }}>
                            {item.action}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic", fontSize: "0.68rem" }}>
                      Balances sync to payroll automatically · unused annual leave carried to 30 days max
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Payroll Readiness
                      </Typography>
                      <Chip label="Run Mar 28" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700, fontSize: "0.68rem" }} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">Timesheets submitted</Typography>
                        <Typography variant="caption" fontWeight={800}>138 / 145</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={95} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal } }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Leave records reconciled</Typography>
                        <Typography variant="caption" fontWeight={800}>91%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={91} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal } }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Tax & pension filings prepared</Typography>
                        <Typography variant="caption" fontWeight={800}>74%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={74} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.gold } }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Bank details verified</Typography>
                        <Typography variant="caption" fontWeight={800}>99%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={99} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.success } }} />
                    </Box>

                    <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary">Gross payroll</Typography>
                      <Typography variant="subtitle2" fontWeight={900} color={HTTU_COLORS.navy}>ETB 6.84M / month</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary">New joiners</Typography>
                      <Typography variant="caption" fontWeight={700}>3 effective Mar 10</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary">Exits</Typography>
                      <Typography variant="caption" fontWeight={700}>1 · final settlement due</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Employee Activity */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                    Recent Employee Activity
                  </Typography>
                  <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: HTTU_COLORS.border }}>
                    Export
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>EMPLOYEE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>DEPARTMENT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>POSITION</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>EVENT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>EFFECTIVE</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEmployees.map((emp, idx) => (
                      <TableRow key={idx} hover sx={{ cursor: "pointer" }} onClick={() => setSelectedEmployee(emp.id)}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{emp.name}</Typography>
                          {emp.amh && <Typography variant="caption" color="text.secondary">{emp.amh}</Typography>}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.8rem", color: HTTU_COLORS.teal, fontWeight: 700 }}>{emp.id}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{emp.dept}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{emp.pos}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{emp.event}</TableCell>
                        <TableCell sx={{ fontSize: "0.8rem" }}>{emp.effective}</TableCell>
                        <TableCell align="right">
                          <Chip label={emp.status} size="small" sx={{ fontSize: "0.68rem", fontWeight: 700 }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>

            {/* Right Column (Workforce Composition, Performance, Compliance) */}
            <Grid item xs={12} lg={4}>
              {/* Workforce Composition */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Workforce Composition
                  </Typography>
                  <Chip label="Mar 2025 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <Box sx={{ position: "relative", width: 110, height: 110, mx: "auto" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={workforceData} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                            {workforceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>145</Typography>
                        <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "text.secondary", display: "block", mt: -0.5 }}>staff</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {workforceData.map((item, idx) => (
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
                <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">PhD / Th.D. qualified (academic)</Typography>
                    <Typography variant="caption" fontWeight={800}>38%</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Female representation (all staff)</Typography>
                    <Typography variant="caption" fontWeight={800}>41%</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Average tenure</Typography>
                    <Typography variant="caption" fontWeight={800}>4.6 years</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Performance & Development */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Performance & Development
                  </Typography>
                  <Chip label="Cycle 2024/25 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Annual appraisals submitted</Typography>
                    <Typography variant="subtitle2" fontWeight={900}>66%</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Student course evaluations</Typography>
                    <Typography variant="subtitle2" fontWeight={900} color={HTTU_COLORS.teal}>4.3 / 5</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Training completed</Typography>
                    <Typography variant="subtitle2" fontWeight={900}>128</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Probation reviews due</Typography>
                    <Chip label="3 due" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700, fontSize: "0.65rem" }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Credentials expiring &lt; 30 days</Typography>
                    <Chip label="Action" size="small" sx={{ bgcolor: "rgba(239, 68, 68, 0.12)", color: HTTU_COLORS.danger, fontWeight: 700, fontSize: "0.65rem" }} />
                  </Box>
                </Box>
              </Card>

              {/* Compliance & Documents */}
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Compliance & Documents
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { title: "Teaching licence expires Mar 14", desc: "Getachew Belay · renewal not yet filed", color: "danger" },
                    { title: "2 contracts end Mar 31", desc: "Registrar clerk (temp) · facilities support", color: "warning" },
                    { title: "Pension & income tax filing", desc: "February returns due Mar 30 · 74% prepared", color: "teal" },
                    { title: "Safeguarding policy acknowledged", desc: "141 of 145 · reminder sent to 4 staff", color: "success" },
                  ].map((doc, idx) => (
                    <Box key={idx} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#F8FAFC", border: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{doc.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.3 }}>{doc.desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Modal for Screen 07: Employee Profile (Plate 11) ── */}
      <Dialog
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, py: 2 }}>
          <Box>
            <Breadcrumbs sx={{ fontSize: "0.75rem" }}>
              <Typography color="text.secondary">HR</Typography>
              <Typography color="text.secondary">Employees</Typography>
              <Typography color="text.primary" fontWeight={700}>EMP-2026-000123</Typography>
            </Breadcrumbs>
          </Box>
          <IconButton onClick={() => setSelectedEmployee(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {/* Employee Header Profile Card */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 3, p: 3, bgcolor: "#F8FAFC", borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: HTTU_COLORS.navy, fontSize: "1.8rem", fontWeight: 800 }}>
              AK
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>
                  Abebe Kebede
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                  አበበ ከበደ
                </Typography>
              </Box>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
                Associate Professor · Grade A3 · Theology Department · Main Campus
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <Chip label="Active" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", color: HTTU_COLORS.success, fontWeight: 700 }} />
                <Chip label="Permanent" size="small" sx={{ bgcolor: "rgba(59, 130, 246, 0.12)", color: "#3B82F6", fontWeight: 700 }} />
                <Chip label="Ordained — Priest" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700 }} />
              </Box>
            </Box>
            <Box sx={{ textAlign: "right", borderLeft: `1px solid ${HTTU_COLORS.border}`, pl: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Employee ID: <b>EMP-2026-000123</b></Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Hire Date: <b>Aug 15, 2018</b></Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Reports To: <b>Dr. Tesfaye Mekonnen, Dean</b></Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Phone: <b>+251 911 234 567</b></Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>FTE: <b>1.00 · Full-time</b></Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Left Details */}
            <Grid item xs={12} md={7.5}>
              <Card sx={{ p: 2.5, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Date of Birth</Typography><Typography variant="body2" fontWeight={600}>Private — restricted</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Gender</Typography><Typography variant="body2" fontWeight={600}>Male</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Nationality</Typography><Typography variant="body2" fontWeight={600}>Ethiopian</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Languages</Typography><Typography variant="body2" fontWeight={600}>Amharic, English, Geez</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Marital Status</Typography><Typography variant="body2" fontWeight={600}>Married</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">City / Region</Typography><Typography variant="body2" fontWeight={600}>Addis Ababa</Typography></Grid>
                </Grid>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Academic Qualifications
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { deg: "PhD — Systematic Theology", inst: "Addis Ababa University · 2016", stat: "Verified" },
                    { deg: "MA — Theology", inst: "Trinity Theological College · 2011", stat: "Verified" },
                    { deg: "BA — Biblical Studies", inst: "Holy Trinity Theology University · 2008", stat: "Verified" },
                  ].map((q, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 2 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{q.deg}</Typography>
                        <Typography variant="caption" color="text.secondary">{q.inst}</Typography>
                      </Box>
                      <Chip label={q.stat} size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", color: HTTU_COLORS.success, fontWeight: 700, fontSize: "0.68rem" }} />
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Right Details */}
            <Grid item xs={12} md={4.5}>
              <Card sx={{ p: 2.5, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Key Employment Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Employee Type</Typography><Typography variant="body2" fontWeight={700}>Faculty</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Department</Typography><Typography variant="body2" fontWeight={700}>Theology Department</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Job Title</Typography><Typography variant="body2" fontWeight={700}>Associate Professor</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Ordination</Typography><Typography variant="body2" fontWeight={700} color="#B48316">Priest · since 2014</Typography></Box>
                </Box>
                <Box sx={{ mt: 2, p: 1.5, bgcolor: "rgba(217, 166, 33, 0.08)", borderRadius: 2, border: "1px solid rgba(217, 166, 33, 0.2)" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Lock sx={{ fontSize: 14 }} /> Compensation details are restricted to HR and Finance.
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}` }}>
                <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                  Leave Balance · FY 2026/2027
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}><Typography variant="caption">Annual</Typography><Typography variant="caption" fontWeight={800}>15 / 20 days</Typography></Box>
                    <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal } }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}><Typography variant="caption">Sick</Typography><Typography variant="caption" fontWeight={800}>28 / 30 days</Typography></Box>
                    <LinearProgress variant="determinate" value={93} sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.gold } }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}><Typography variant="caption">Study Leave</Typography><Typography variant="caption" fontWeight={800}>365 / 365 days</Typography></Box>
                    <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.success } }} />
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
