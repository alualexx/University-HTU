import React, { useState, useEffect, useRef } from "react";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  Divider, LinearProgress, IconButton, Badge, Tooltip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, alpha, useTheme,
  Snackbar, Alert, Paper, Checkbox, Drawer, useMediaQuery
} from "@mui/material";
import {
  School, Book, Grade, Schedule, EmojiEvents,
  LightMode, DarkMode, Notifications, Dashboard, Campaign,
  CheckCircle, AccessTime, Warning, TrendingUp, MenuBook,
  AccountBalanceWallet, Receipt, CheckCircleOutline,
  Close, Download, ShoppingCart, EventNote, Remove, Menu as MenuIcon
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { 
  coursesAPI, 
  announcementsAPI as newsAPI, 
  enrollmentsAPI, 
  tuitionAPI, 
  notificationsAPI, 
  transcriptAPI,
  schedulesAPI,
  systemAPI
} from "../../services/api";
import jsPDF from "jspdf";

/* ─── Constants ───────────────────────────────────────────────────────── */
// ... (lines 26-174 remain unchanged)

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const prevNotifCount = useRef(0);

  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [tuitionPayments, setTuitionPayments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [transcriptData, setTranscriptData] = useState(null);

  const [cart, setCart] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [processingPayment, setProcessingPayment] = useState(false);
   const [systemConfig, setSystemConfig] = useState({ registrationLock: false, admissionWindow: true, globalMaintenance: false, targetYear: 1, targetSemester: 1 });

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [
          enrollmentsRes,
          coursesRes,
          newsRes,
          tuitionRes,
          schedulesRes,
          notificationsRes,
          transcriptRes,
          registrarSettings,
          globalSettings
        ] = await Promise.all([
          enrollmentsAPI.getAll({ studentId: user.id }),
          coursesAPI.getAll(),
          newsAPI.getAll(),
          tuitionAPI.getAll({ studentId: user.id }),
          schedulesAPI.getAll(),
          notificationsAPI.getAll({ studentId: user.id }),
          transcriptAPI.getMe().catch(() => ({ data: null })),
          systemAPI.getSettings("registrar").catch(() => ({ data: null })),
          systemAPI.getSettings("settings").catch(() => ({ data: null }))
        ]);

        if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data);
        if (coursesRes.data) setAvailableCourses(coursesRes.data);
        if (newsRes.data) setNewsList(newsRes.data);
        if (tuitionRes.data) setTuitionPayments(tuitionRes.data);
        if (schedulesRes.data) setSchedules(schedulesRes.data);
        
        if (notificationsRes.data) {
          const n = notificationsRes.data;
          if (n.length > prevNotifCount.current && prevNotifCount.current > 0) {
            setSnackbar({ open: true, message: n[0].message || "New notification", severity: "info" });
          }
          prevNotifCount.current = n.length;
          setNotifications(n);
        }

        if (transcriptRes.data) setTranscriptData(transcriptRes.data);
        
        if (registrarSettings?.data) {
          setSystemConfig(prev => ({ ...prev, ...registrarSettings.data }));
        }
        
        if (globalSettings?.data) {
          setSystemConfig(prev => ({ ...prev, globalMaintenance: globalSettings.data.maintenanceMode || false }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s polling for "pseudo-realtime"
    return () => clearInterval(interval);
  }, [user?.id]);

  // Derived
  const myActiveCourses = enrollments?.filter(e => e.status === "approved" || e.status === "enrolled")?.map((e, i) => {
    const c = availableCourses?.find(c => c.id === e.courseId) || {};
    return { ...c, enrollmentId: e.id, grade: e.grade || "N/A", color: courseColors[i % courseColors.length] };
  })?.filter(c => c.name) || [];
  const totalCredits = myActiveCourses?.reduce((s, c) => s + (Number(c.credits) || 3), 0) || 0;
  const earnedCredits = enrollments?.filter(e => e.grade && e.grade !== "F" && e.grade !== "N/A")?.reduce((s, e) => { const c = availableCourses?.find(c => c.id === e.courseId); return s + (c ? (Number(c.credits) || 3) : 0); }, 0) || 0;
  const requiredCredits = 120;
  const gradedE = enrollments?.filter(e => e.grade && gradeToPoints[e.grade] !== undefined) || [];
  const gpa = gradedE.length > 0
    ? gradedE.reduce((s, e) => { const c = availableCourses?.find(c => c.id === e.courseId); return s + (gradeToPoints[e.grade] || 0) * (c ? (Number(c.credits) || 3) : 3); }, 0) / gradedE.reduce((s, e) => { const c = availableCourses?.find(c => c.id === e.courseId); return s + (c ? (Number(c.credits) || 3) : 3); }, 0)
    : 3.80;
   const mySchedules = schedules?.filter(s => myActiveCourses?.some(c => c.id === s.courseId || c.name === s.courseName))?.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)) || [];
  
  // Year/Semester Filtering Logic
  const isMyWindow = !systemConfig.registrationLock && Number(user?.year) === Number(systemConfig.targetYear);
  const filteredAvailableCourses = availableCourses.filter(c => {
    // Only show courses for the student's academic year AND the currently active semester window
    return Number(c.year) === Number(user?.year) && Number(c.semester) === Number(systemConfig.targetSemester);
  });

  const alreadyEnrolledIds = enrollments?.map(e => e.courseId) || [];
  const cartCredits = cart.reduce((s, c) => s + (Number(c.credits) || 3), 0);
  const cartTotal = cart.reduce((s, c) => s + (Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT), 0);
  const unreadNotifs = notifications?.filter(n => !n.read)?.length || 0;

  const toggleCart = (course) => setCart(prev => prev.find(c => c.id === course.id) ? prev.filter(c => c.id !== course.id) : [...prev, course]);

  const handleSemesterCheckout = async () => {
    if (cart.length === 0) return;
    setProcessingPayment(true);
    try {
      const courseNames = cart.map(c => c.name).join(", ");
      
      // 1. Create Tuition Payment
      const paymentRes = await tuitionAPI.create({
        studentId: user.id,
        studentName: user.name,
        courseIds: cart.map(c => c.id),
        courseName: courseNames,
        amount: cartTotal,
        status: "pending_approval",
        semester: CURRENT_SEMESTER
      });

      // 2. Create Enrollments
      for (const course of cart) {
        await enrollmentsAPI.create({
          studentId: user.id,
          studentName: user.name,
          courseId: course.id,
          courseName: course.name,
          status: "pending_payment_approval",
          paymentId: paymentRes.data._id,
          semester: CURRENT_SEMESTER
        });
      }

      // 3. Create Notification for Registrar
      await notificationsAPI.create({
        title: "New Semester Registration",
        message: `${user.name} submitted $${cartTotal.toLocaleString()} for ${cart.length} course(s): ${courseNames}`,
        type: "finance"
      });

      setPaymentModalOpen(false);
      setPaymentForm({ cardNumber: "", expiry: "", cvv: "" });
      setCart([]);
      setSnackbar({ open: true, message: "Registration submitted! Waiting for approval.", severity: "success" });
    } catch (err) {
      console.error("Checkout error:", err);
      setSnackbar({ open: true, message: "Payment failed.", severity: "error" });
    } finally {
      setProcessingPayment(false);
    }
  };

  const gpaRaw = transcriptData?.cumulativeGPA 
    ? Math.round(transcriptData.cumulativeGPA * 100) 
    : Math.round(gpa * 100);
  const stats = [
    { label: "GPA", raw: gpaRaw, isGpa: true, suffix: "/ 4.00", gradient: gradients[0], icon: <EmojiEvents />, progress: (gpaRaw / 400) * 100 },
    { label: "Courses", raw: myActiveCourses.length, isGpa: false, suffix: "Active", gradient: gradients[1], icon: <School />, progress: myActiveCourses.length > 0 ? Math.min(myActiveCourses.length / 6 * 100, 100) : 0 },
    { label: "Credits", raw: totalCredits, isGpa: false, suffix: `/ ${requiredCredits}`, gradient: gradients[2], icon: <Book />, progress: Math.min((totalCredits / requiredCredits) * 100, 100) },
    { label: "News", raw: newsList.length, isGpa: false, suffix: "Updates", gradient: gradients[3], icon: <Campaign />, progress: newsList.length > 0 ? 100 : 0 },
  ];

  const tH = { fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` };
  const tC = { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`, py: 2 };
  const cardSx = { background: isDark ? "rgba(15,23,42,0.6)" : "#fff", backdropFilter: "blur(20px)", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.03)" };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #0369a1 0%, #0284c7 100%)' }}>
      <Box sx={{ p: 3, pt: 4, textAlign: 'center' }}>
        <Avatar src={user?.profileImage} sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, bgcolor: 'white', color: '#0284c7', fontWeight: 900, fontSize: '1.8rem', border: '3px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {(user?.name || "S")[0].toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={900} color="white" sx={{ lineHeight: 1.2 }}>{user?.name || "Student"}</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={700}>{user?.studentId || user?.email}</Typography>
        <Chip label={CURRENT_SEMESTER} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, fontSize: '0.65rem' }} />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item, i) => (
          <ListItemButton
            key={i}
            selected={activeTab === i}
            onClick={() => { setActiveTab(i); setMobileNavOpen(false); }}
            sx={{
              borderRadius: 3, mb: 0.5, py: 1.3, px: 2,
              color: activeTab === i ? 'white' : 'rgba(255,255,255,0.6)',
              bgcolor: activeTab === i ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' },
              transition: '0.2s',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {i === 4 ? (
                <Badge badgeContent={cart.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>{item.icon}</Badge>
              ) : item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeTab === i ? 900 : 700, fontSize: '0.88rem' }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button fullWidth onClick={toggleColorMode} startIcon={mode === "dark" ? <LightMode /> : <DarkMode />} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 800, borderRadius: 2.5, py: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }}>
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button fullWidth onClick={logout} sx={{ color: 'rgba(255,200,200,0.8)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 800, borderRadius: 2.5, py: 1, mt: 0.5, '&:hover': { bgcolor: 'rgba(255,0,0,0.1)', color: '#fca5a5' } }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  /* ─── RENDER ────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ display: 'flex', bgcolor: "background.default", minHeight: "100vh", color: "text.primary" }}>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', border: 'none' }
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Box sx={{
        width: SIDEBAR_WIDTH, flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1200,
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
        boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
      }}>
        {sidebarContent}
      </Box>

      {/* ═══ MAIN CONTENT ═══ */}
      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, flex: 1, minHeight: '100vh', minWidth: 0 }}>
        {/* Mobile Top Bar */}
        {isMobile && (
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? '#0f172a' : '#0284c7', color: 'white' }}>
            <IconButton onClick={() => setMobileNavOpen(true)} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={900}>{NAV_ITEMS[activeTab]?.label}</Typography>
            <IconButton onClick={() => setNotifDrawerOpen(true)} sx={{ color: 'white' }}>
              <Badge badgeContent={unreadNotifs} color="error"><Notifications /></Badge>
            </IconButton>
          </Box>
        )}
        {/* Top bar (desktop) */}
        <Box sx={{ px: { xs: 2, md: 5 }, py: 2.5, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box>
            <Typography variant="h5" fontWeight={900}>{NAV_ITEMS[activeTab]?.label}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>{CURRENT_SEMESTER} · Student Portal</Typography>
          </Box>
          <Tooltip title="Notifications">
            <IconButton onClick={() => setNotifDrawerOpen(true)} sx={{ border: '1px solid', borderColor: 'divider', p: 1.2 }}>
              <Badge badgeContent={unreadNotifs} color="error"><Notifications /></Badge>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Page content */}
        <Box sx={{ p: 5, pb: 10 }}>

          {/* TAB 0: DASHBOARD */}
          {activeTab === 0 && (
            <Box>
              {/* Phase 18: Global Vitals Panel */}
              <Box sx={{ mb: 4, p: 2, borderRadius: 4, background: systemConfig.globalMaintenance ? alpha('#f59e0b', 0.1) : 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: systemConfig.globalMaintenance ? alpha('#f59e0b', 0.3) : 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(10px)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: systemConfig.globalMaintenance ? '#f59e0b' : '#10b981', boxShadow: `0 0 10px ${systemConfig.globalMaintenance ? '#f59e0b' : '#10b981'}` }} />
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5 }}>SYSTEM INTEGRITY</Typography>
                    <Typography variant="body2" fontWeight={1000} color={systemConfig.globalMaintenance ? 'warning.main' : 'success.main'}>
                      {systemConfig.globalMaintenance ? "MAINTENANCE ACTIVE - SOME SERVICES RESTRICTED" : "ALL SYSTEMS NOMINAL"}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={4} sx={{ mr: 4, display: { xs: 'none', md: 'flex' } }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={900} color="text.secondary">PROTOCOL</Typography>
                    <Typography variant="body2" fontWeight={1000} color={systemConfig.registrationLock ? 'error.main' : 'primary.main'}>
                      {systemConfig.registrationLock ? "REG LOCKED" : "REG OPEN"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={900} color="text.secondary">LATENCY</Typography>
                    <Typography variant="body2" fontWeight={1000}>32ms</Typography>
                  </Box>
                </Stack>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>{stats.map((s, i) => <Grid item xs={12} sm={6} md={3} key={i}><StatCard stat={s} mode={mode} /></Grid>)}</Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ ...cardSx, borderRadius: 4, p: 4 }}>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>Welcome back, {user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>Your profile is synced. Use <strong>Semester Registration</strong> to enroll, or check <strong>My Schedules</strong> for your timetable.</Typography>
                    <Stack direction="row" spacing={2}><Button variant="contained" onClick={() => setActiveTab(4)} sx={{ borderRadius: 3, fontWeight: 900, px: 3.5, textTransform: 'none' }}>Register for Semester</Button><Button variant="outlined" onClick={() => setActiveTab(2)} sx={{ borderRadius: 3, fontWeight: 900, px: 3.5, textTransform: 'none' }}>View Timetable</Button></Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ ...cardSx, borderRadius: 4, p: 4, height: '100%' }}>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Financial Summary</Typography>
                    {tuitionPayments.filter(p => p.status === 'approved').length > 0 ? (
                      <Box sx={{ bgcolor: alpha('#10b981', 0.08), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircleOutline sx={{ color: '#10b981', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="success.main">Cleared</Typography><Typography variant="caption" color="text.secondary">No balance</Typography></Box></Box>
                    ) : tuitionPayments.length > 0 ? (
                      <Box sx={{ bgcolor: alpha('#f59e0b', 0.08), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><Warning sx={{ color: '#f59e0b', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="warning.main">Pending</Typography><Typography variant="caption" color="text.secondary">Awaiting review</Typography></Box></Box>
                    ) : (
                      <Box sx={{ bgcolor: alpha('#3b82f6', 0.06), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><AccountBalanceWallet sx={{ color: '#3b82f6', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="info.main">No Payments</Typography><Typography variant="caption" color="text.secondary">Register to begin</Typography></Box></Box>
                    )}
                    <Box sx={{ mt: 3 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" color="text.secondary" fontWeight={800}>Degree Progress</Typography><Typography variant="caption" color="text.secondary" fontWeight={800}>{totalCredits}/{requiredCredits}</Typography></Box><LinearProgress variant="determinate" value={Math.min((totalCredits / requiredCredits) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: gradients[0], borderRadius: 3 } }} /></Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* TAB 1: MY COURSES */}
          {activeTab === 1 && (
            <Box>
              {myActiveCourses.length === 0 ? (
                <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4 }}><MenuBook sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.25, mb: 2 }} /><Typography color="text.secondary" fontWeight={800}>No active enrollments.</Typography><Button variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }} onClick={() => setActiveTab(4)}>Go to Registration</Button></Card>
              ) : (
                <Card sx={{ ...cardSx, borderRadius: 4 }}><TableContainer><Table>
                  <TableHead><TableRow>{["#", "Course Name", "Code", "Credits", "Instructor", "Grade", "Status"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                  <TableBody>{myActiveCourses.map((c, i) => {
                    const gc = gradeToPoints[c.grade] >= 3.0 ? 'success.main' : gradeToPoints[c.grade] >= 2.0 ? 'warning.main' : c.grade === "N/A" ? 'text.secondary' : 'error.main';
                    return (<TableRow key={i} hover><TableCell sx={tC}>{i + 1}</TableCell><TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell><TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{c.code || '—'}</Typography></TableCell><TableCell sx={tC}>{c.credits || 3}</TableCell><TableCell sx={tC}><Typography variant="body2" color="text.secondary">{c.instructor || "TBA"}</Typography></TableCell><TableCell sx={tC}><Chip label={c.grade} size="small" sx={{ fontWeight: 900, color: gc }} /></TableCell><TableCell sx={tC}><Chip label="ENROLLED" size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 22, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} /></TableCell></TableRow>);
                  })}</TableBody>
                </Table></TableContainer></Card>
              )}
            </Box>
          )}

          {/* TAB 2: MY SCHEDULES */}
          {activeTab === 2 && (
            <Box>
              {mySchedules.length === 0 ? (
                <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4 }}><EventNote sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.25, mb: 2 }} /><Typography color="text.secondary" fontWeight={800}>No schedules found.</Typography></Card>
              ) : (
                <Card sx={{ ...cardSx, borderRadius: 4 }}><TableContainer><Table>
                  <TableHead><TableRow>{["Day", "Time", "Course", "Room", "Semester"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                  <TableBody>{mySchedules.map((s, i) => (
                    <TableRow key={i} hover><TableCell sx={tC}><Chip label={s.day} size="small" sx={{ fontWeight: 900, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} /></TableCell><TableCell sx={tC}><Typography variant="body2" fontWeight={800}>{s.startTime} — {s.endTime}</Typography></TableCell><TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{s.courseName}</Typography></TableCell><TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{s.room || '—'}</Typography></TableCell><TableCell sx={tC}><Typography variant="caption" color="text.secondary">{s.semester || CURRENT_SEMESTER}</Typography></TableCell></TableRow>
                  ))}</TableBody>
                </Table></TableContainer></Card>
              )}
            </Box>
          )}

          {/* TAB 3: GRADES & TRANSCRIPTS */}
          {activeTab === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ ...cardSx, borderRadius: 4, p: 4, textAlign: 'center' }}>
                  <Box sx={{ width: 100, height: 100, borderRadius: '50%', mx: 'auto', mb: 2, background: gradients[0], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 28px ${alpha('#6366f1', 0.3)}` }}><Typography variant="h3" fontWeight={900} color="white">{transcriptData?.cumulativeGPA?.toFixed(2) || gpa.toFixed(2)}</Typography></Box>
                  <Typography variant="h6" fontWeight={900}>Cumulative GPA</Typography><Typography variant="caption" color="text.secondary">Out of 4.00</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}><Grid item xs={6}><Typography variant="h5" fontWeight={900} color="primary.main">{totalCredits}</Typography><Typography variant="caption" color="text.secondary">Enrolled</Typography></Grid><Grid item xs={6}><Typography variant="h5" fontWeight={900} color="success.main">{earnedCredits}</Typography><Typography variant="caption" color="text.secondary">Earned</Typography></Grid></Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ ...cardSx, borderRadius: 4 }}><CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Official Transcript Records</Typography>
                  {!transcriptData || !transcriptData.termRecords || transcriptData.termRecords.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Grade sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 1 }} />
                      <Typography color="text.secondary" fontWeight={800}>No official transcript records yet.</Typography>
                    </Box>
                  ) : (
                    <Stack spacing={4}>
                      {transcriptData.termRecords.map((term, tIndex) => (
                        <Paper key={tIndex} sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={900}>{term.term}</Typography>
                          </Box>
                          <TableContainer sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Code</TableCell>
                                  <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Title</TableCell>
                                  <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Credits</TableCell>
                                  <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Grade</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {term.courses.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, fontStyle: 'italic', color: 'text.secondary', border: 'none' }}>No courses added for this semester.</TableCell>
                                  </TableRow>
                                ) : (
                                    term.courses.map((course, cIndex) => (
                                    <TableRow key={cIndex} sx={{ 
                                      '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}` },
                                      opacity: course.status === 'Dropped' ? 0.5 : 1,
                                      textDecoration: course.status === 'Dropped' ? 'line-through' : 'none'
                                    }}>
                                      <TableCell sx={{ fontWeight: 800 }}>{course.code}</TableCell>
                                      <TableCell fontWeight={700}>{course.title}</TableCell>
                                      <TableCell>{course.credits}</TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={course.status === 'Dropped' ? 'W/D' : course.grade} 
                                          size="small" 
                                          sx={{ 
                                            fontWeight: 900, 
                                            bgcolor: course.status === 'Dropped' ? alpha('#94a3b8', 0.1) : alpha('#10b981', 0.1), 
                                            color: course.status === 'Dropped' ? '#64748b' : '#10b981' 
                                          }} 
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </CardContent></Card>
              </Grid>
            </Grid>
          )}

           {/* TAB 4: SEMESTER REGISTRATION */}
          {activeTab === 4 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card sx={{ 
                  ...cardSx, p: 3, borderRadius: 4, mb: 1,
                  background: isMyWindow 
                    ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                    : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                  border: `1px solid ${isMyWindow ? alpha('#10b981', 0.2) : alpha('#ef4444', 0.2)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 12, height: 12, borderRadius: '50%', 
                        bgcolor: isMyWindow ? '#10b981' : '#ef4444',
                        boxShadow: `0 0 10px ${isMyWindow ? '#10b981' : '#ef4444'}`
                      }} />
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>REGISTRATION INTELLIGENCE</Typography>
                        <Typography variant="h6" fontWeight={1000}>
                          {systemConfig.registrationLock 
                            ? "Registration is Currently Closed" 
                            : !isMyWindow 
                              ? `Window Open for Year ${systemConfig.targetYear} Cohort` 
                              : `Welcome! Window Open for Year ${user?.year || 1} - Semester ${systemConfig.targetSemester}`}
                        </Typography>
                      </Box>
                    </Box>
                    {isMyWindow && (
                      <Chip 
                        label={`ACTIVE: Y${user?.year || 1} S${systemConfig.targetSemester}`} 
                        color="success" 
                        sx={{ fontWeight: 900, borderRadius: 2 }} 
                      />
                    )}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ ...cardSx, borderRadius: 4 }}>
                  {(!isMyWindow || systemConfig.registrationLock) ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                      <Typography variant="h5" fontWeight={1000} color="text.secondary" gutterBottom>Registration Locked</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                        {systemConfig.registrationLock 
                          ? "The registrar has paused all enrollment activities. Please check the news feed for updates."
                          : `Your academic cohort (Year ${user?.year || 1}) is not scheduled for this registration window. Currently serving Year ${systemConfig.targetYear}.`}
                      </Typography>
                    </Box>
                  ) : filteredAvailableCourses.length === 0 ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <Book sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                      <Typography variant="h5" fontWeight={1000} color="text.secondary" gutterBottom>No Modules Found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        There are no courses currently prepared for Year {user?.year || 1} Semester {systemConfig.targetSemester}.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer><Table>
                      <TableHead><TableRow>{["", "Course", "Code", "Credits", "Tuition", "Instructor", "Status"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                      <TableBody>{filteredAvailableCourses.map((c, i) => {
                        const enrolled = alreadyEnrolledIds.includes(c.id);
                        const inCart = cart.find(x => x.id === c.id);
                        const fee = Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT;
                        return (<TableRow key={i} sx={{ bgcolor: inCart ? alpha(theme.palette.primary.main, 0.04) : 'transparent' }} hover>
                          <TableCell sx={tC} padding="checkbox">{!enrolled && <Checkbox checked={!!inCart} onChange={() => toggleCart(c)} color="primary" />}</TableCell>
                          <TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                          <TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{c.code}</Typography></TableCell>
                          <TableCell sx={tC}>{c.credits || 3}</TableCell>
                          <TableCell sx={tC}><Typography variant="body2" fontWeight={800} color="success.main">${fee.toLocaleString()}</Typography></TableCell>
                          <TableCell sx={tC}><Typography variant="body2" color="text.secondary">{c.instructor || "TBA"}</Typography></TableCell>
                          <TableCell sx={tC}>{enrolled ? <Chip label="Registered" size="small" color="success" sx={{ fontWeight: 900 }} /> : inCart ? <Chip label="In Cart" size="small" color="primary" sx={{ fontWeight: 900 }} /> : <Chip label="Available" size="small" variant="outlined" sx={{ fontWeight: 800 }} />}</TableCell>
                        </TableRow>);
                      })}</TableBody>
                    </Table></TableContainer>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ ...cardSx, borderRadius: 4, p: 3.5, mb: 3 }}>
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCart fontSize="small" /> Cart ({cart.length})</Typography>
                  {cart.length === 0 ? <Typography variant="body2" color="text.secondary">Select courses to add to cart.</Typography> : (
                    <Stack spacing={1.5}>
                      {cart.map((c, i) => {
                        const fee = Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT;
                        return (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 2 }}>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={900}>{c.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {c.credits || 3} Cr · ${fee.toLocaleString()}
                              </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => toggleCart(c)} color="error">
                              <Remove fontSize="small" />
                            </IconButton>
                          </Box>
                        );
                      })}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle2" fontWeight={900}>Total</Typography><Typography variant="subtitle2" fontWeight={900} color="primary.main">{cartCredits} Cr · ${cartTotal.toLocaleString()}</Typography></Box>
                      <Button 
                        fullWidth variant="contained" 
                        onClick={() => setPaymentModalOpen(true)} 
                        disabled={systemConfig.registrationLock || systemConfig.globalMaintenance}
                        sx={{ 
                          borderRadius: 3, fontWeight: 900, py: 1.2, textTransform: 'none',
                          background: (systemConfig.registrationLock || systemConfig.globalMaintenance) ? 'rgba(0,0,0,0.1)' : gradients[0]
                        }}
                      >
                        {systemConfig.globalMaintenance ? "Locked for Maintenance" : systemConfig.registrationLock ? "Registration Window Closed" : "Proceed to Checkout"}
                      </Button>
                    </Stack>
                  )}
                </Card>
                <Card sx={{ ...cardSx, borderRadius: 4, p: 3.5 }}>
                  <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>My Documents</Typography>
                  {myActiveCourses.length > 0 && <Box sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>SEMESTER SLIP</Typography><Button fullWidth variant="outlined" startIcon={<Download />} onClick={() => generateSemesterSlipPDF(user, myActiveCourses)} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Download Slip (PDF)</Button></Box>}
                  {tuitionPayments.filter(p => p.status === "approved").length > 0 && <Box><Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>RECEIPTS</Typography><List disablePadding>{tuitionPayments.filter(p => p.status === "approved").map((p, i) => (<ListItem key={i} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', mb: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', pr: 1 }}><ListItemText primary={<Typography variant="subtitle2" fontWeight={800}>${(p.amount || 0).toLocaleString()}</Typography>} secondary="Paid" /><Tooltip title="Download PDF"><IconButton color="success" onClick={() => generateReceiptPDF(user, p)}><Download fontSize="small" /></IconButton></Tooltip></ListItem>))}</List></Box>}
                  {myActiveCourses.length === 0 && tuitionPayments.filter(p => p.status === "approved").length === 0 && <Box sx={{ textAlign: 'center', py: 3 }}><Receipt sx={{ fontSize: 36, color: 'text.secondary', opacity: 0.2, mb: 1 }} /><Typography variant="body2" color="text.secondary">No documents yet.</Typography></Box>}
                </Card>
              </Grid>
            </Grid>
          )}

          {/* TAB 5: NEWS */}
          {activeTab === 5 && (
            <Stack spacing={3}>{newsList.map((a, i) => (
              <Card key={i} sx={{ ...cardSx, borderRadius: 4, p: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-3px)' } }}>
                <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 1 }}>{a.category?.toUpperCase() || "UPDATE"}</Typography>
                <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5, mb: 0.5 }}>{a.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{a.date?.toDate ? a.date.toDate().toLocaleDateString() : new Date(a.date).toLocaleDateString()}</Typography>
                <Typography variant="body1">{a.content}</Typography>
              </Card>
            ))}{newsList.length === 0 && <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4 }}><Campaign sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 1 }} /><Typography color="text.secondary" fontWeight={800}>No news.</Typography></Card>}</Stack>
          )}
        </Box>
      </Box>

      {/* NOTIFICATIONS */}
      <Dialog open={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="h6" fontWeight={900}>Notifications</Typography><Typography variant="caption" color="text.secondary">{notifications.length} total</Typography></Box><IconButton onClick={() => setNotifDrawerOpen(false)}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ px: 3, py: 1 }}>
          {notifications.length === 0 ? <Box sx={{ textAlign: 'center', py: 4 }}><Notifications sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.2, mb: 1 }} /><Typography color="text.secondary" fontWeight={800}>No notifications.</Typography></Box> : (
            <Stack spacing={1.5}>{notifications.map((n, i) => (<Paper key={i} variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: n.read ? 'divider' : 'primary.main' }}><Typography variant="subtitle2" fontWeight={900}>{n.title || "Notification"}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{n.message}</Typography><Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>{n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : "Now"}</Typography></Paper>))}</Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* PAYMENT */}
      <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ p: 3 }}><Typography variant="h6" fontWeight={900}>Semester Checkout</Typography><Typography variant="caption" color="text.secondary">Single payment for all courses</Typography></DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.15), p: 2.5, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={900} color="primary.main">{cart.length} Course(s) · {cartCredits} Credits</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{cart.map(c => c.name).join(", ")}</Typography>
            <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ mt: 1 }}>Total: ${cartTotal.toLocaleString()}</Typography>
          </Box>
          <Stack spacing={2.5}>
            <TextField label="Card Number" fullWidth placeholder="0000 0000 0000 0000" value={paymentForm.cardNumber} onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} InputProps={{ sx: { borderRadius: 3 } }} />
            <Grid container spacing={2}><Grid item xs={6}><TextField label="Expiry" fullWidth placeholder="MM/YY" value={paymentForm.expiry} onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })} InputProps={{ sx: { borderRadius: 3 } }} /></Grid><Grid item xs={6}><TextField label="CVV" fullWidth placeholder="123" value={paymentForm.cvv} onChange={e => setPaymentForm({ ...paymentForm, cvv: e.target.value })} InputProps={{ sx: { borderRadius: 3 } }} /></Grid></Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}><Button onClick={() => setPaymentModalOpen(false)} sx={{ fontWeight: 900, textTransform: 'none' }}>Cancel</Button><Button variant="contained" onClick={handleSemesterCheckout} disabled={processingPayment || !paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv} sx={{ borderRadius: 3, px: 4, fontWeight: 900, textTransform: 'none' }}>{processingPayment ? "Processing..." : `Pay $${cartTotal.toLocaleString()}`}</Button></DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ fontWeight: 800, borderRadius: 3 }}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
}
