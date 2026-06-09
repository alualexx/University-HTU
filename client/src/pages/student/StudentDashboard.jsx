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
  Close, Download, ShoppingCart, EventNote, Remove, Menu as MenuIcon,
  Person, AppRegistration, Assessment, AssignmentTurnedIn, AttachMoney,
  Support, MiscellaneousServices, Logout
} from "@mui/icons-material";
import {
  DashboardTab, ProfileTab, RegistrationTab, AcademicRecordsTab, AttendanceTab,
  GradesTab, FinanceTab, TimetableTab, LearningTab, AdvisingTab, GraduationTab,
  NotificationsTab, ServicesTab
} from './tabs';
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
  systemAPI,
  attendanceAPI,
  academicEventsAPI
} from "../../services/api";
import jsPDF from "jspdf";

/* ─── Constants ───────────────────────────────────────────────────────── */
const TUITION_PER_CREDIT = 100;
const CURRENT_SEMESTER = "Fall 2026";
const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SIDEBAR_WIDTH = 280;
const gradeToPoints = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0.0 };
const gradients = [
  "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
];
const courseColors = ["#6366f1", "#a855f7", "#10b981", "#3b82f6", "#f59e0b"];

/* ─── Sidebar Nav Items ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard", icon: <Dashboard /> },
  { label: "Profile & Account", icon: <Person /> },
  { label: "Semester Registration", icon: <AppRegistration /> },
  { label: "Academic Records", icon: <Assessment /> },
  { label: "Attendance Tracker", icon: <AssignmentTurnedIn /> },
  { label: "Grades & Results", icon: <Grade /> },
  { label: "Finance & Fees", icon: <AttachMoney /> },
  { label: "Timetable & Exams", icon: <EventNote /> },
  { label: "Learning & Materials", icon: <Book /> },
  { label: "Advising & Support", icon: <Support /> },
  { label: "Graduation Clearance", icon: <EmojiEvents /> },
  { label: "University News", icon: <Campaign /> },
  { label: "Other Services", icon: <MiscellaneousServices /> }
];

/* ─── useCountUp ───────────────────────────────────────────────────────── */
function useCountUp(target, dur = 1600) {
  const [c, setC] = useState(0);
  useEffect(() => {
    let r, s = null;
    const f = t => { if (!s) s = t; const p = Math.min((t - s) / dur, 1); setC(Math.floor(p * target)); if (p < 1) r = requestAnimationFrame(f); };
    r = requestAnimationFrame(f); return () => cancelAnimationFrame(r);
  }, [target, dur]);
  return c;
}

function StatCard({ stat, mode }) {
  const a = useCountUp(stat.raw);
  const d = stat.isGpa ? (a / 100).toFixed(2) : a;
  const isDark = mode === 'dark';
  return (
    <Card sx={{ background: isDark ? "rgba(255,255,255,0.04)" : "#fff", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden", position: 'relative', transition: "all 0.3s", "&:hover": { transform: "translateY(-6px)", boxShadow: isDark ? "0 16px 32px rgba(0,0,0,0.4)" : "0 16px 32px rgba(0,0,0,0.07)" } }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.gradient }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1.5, fontSize: '0.6rem' }}>{stat.label}</Typography>
            <Typography variant="h4" color="text.primary" fontWeight={900} sx={{ letterSpacing: -1 }}>{d}<Typography component="span" variant="caption" color="text.secondary" fontWeight={800} sx={{ ml: 0.5, fontSize: '0.65rem' }}>{stat.suffix}</Typography></Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={stat.progress || 0} sx={{ height: 4, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", '& .MuiLinearProgress-bar': { background: stat.gradient, borderRadius: 2 } }} />
      </CardContent>
    </Card>
  );
}

/* ─── PDF Helpers ──────────────────────────────────────────────────────── */
function drawPDFHeader(pdf, title, subtitle) {
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, 210, 38, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20); pdf.setFont(undefined, 'bold');
  pdf.text("ALEX UNIVERSITY", 105, 16, { align: 'center' });
  pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
  pdf.text(title, 105, 25, { align: 'center' });
  if (subtitle) { pdf.setFontSize(8); pdf.text(subtitle, 105, 32, { align: 'center' }); }
}

function drawPDFTable(pdf, headers, rows, startY) {
  const colWidths = headers.map(() => Math.floor(160 / headers.length));
  const startX = 25;
  let y = startY;
  pdf.setFillColor(240, 242, 245);
  pdf.rect(startX, y - 5, 160, 8, 'F');
  pdf.setFontSize(7); pdf.setFont(undefined, 'bold'); pdf.setTextColor(80, 80, 80);
  let x = startX;
  headers.forEach((h, i) => { pdf.text(h.toUpperCase(), x + 2, y); x += colWidths[i]; });
  y += 6;
  pdf.setDrawColor(220, 220, 220); pdf.line(startX, y, startX + 160, y); y += 5;
  pdf.setFont(undefined, 'normal'); pdf.setTextColor(50, 50, 50); pdf.setFontSize(9);
  rows.forEach((row, ri) => {
    if (ri % 2 === 0) { pdf.setFillColor(250, 250, 252); pdf.rect(startX, y - 4, 160, 7, 'F'); }
    x = startX;
    row.forEach((cell, ci) => { pdf.text(String(cell), x + 2, y); x += colWidths[ci]; });
    y += 7;
  });
  return y;
}

function drawPDFFooter(pdf, y) {
  y += 8;
  pdf.setDrawColor(200, 200, 200); pdf.line(25, y, 185, y); y += 8;
  pdf.setFontSize(8); pdf.setTextColor(140, 140, 140);
  pdf.text(`Document generated: ${new Date().toLocaleString()}`, 25, y);
  pdf.text("Alex University — Official Document", 185, y, { align: 'right' });
}

function generateSemesterSlipPDF(user, courses) {
  const pdf = new jsPDF();
  drawPDFHeader(pdf, "Course Registration Slip", CURRENT_SEMESTER);
  let y = 50;
  pdf.setTextColor(50, 50, 50); pdf.setFontSize(10);
  const info = [["Student Name", user?.name || 'N/A'], ["Student ID", user?.studentId || 'N/A'], ["Email", user?.email || 'N/A'], ["Semester", CURRENT_SEMESTER]];
  info.forEach(([l, v]) => { pdf.setFont(undefined, 'bold'); pdf.text(`${l}:`, 25, y); pdf.setFont(undefined, 'normal'); pdf.text(v, 75, y); y += 8; });
  y += 5;
  pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.setTextColor(37, 99, 235); pdf.text("Registered Courses", 25, y); y += 10;
  const rows = courses?.map((c, i) => [
    (i + 1).toString(), c.name, c.code || "—",
    (c.credits || 3).toString(),
    `$${(Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT).toLocaleString()}`
  ]) || [];
  y = drawPDFTable(pdf, ["#", "Course", "Code", "Credits", "Tuition"], rows, y);
  y += 5;
  const totalCredits = courses?.reduce((s, c) => s + (Number(c.credits) || 3), 0) || 0;
  const totalTuition = courses?.reduce((s, c) => s + (Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT), 0) || 0;
  pdf.setFontSize(10); pdf.setFont(undefined, 'bold'); pdf.setTextColor(50, 50, 50);
  pdf.text(`Total Credits: ${totalCredits}`, 25, y);
  pdf.text(`Total Tuition: $${totalTuition.toLocaleString()}`, 120, y);
  drawPDFFooter(pdf, y);
  pdf.save(`SemesterSlip_${CURRENT_SEMESTER.replace(/\s+/g, '_')}.pdf`);
}

function generateReceiptPDF(user, payment) {
  const pdf = new jsPDF();
  drawPDFHeader(pdf, "Payment Receipt", `Transaction: TXN-${(payment.id || '').slice(0, 8).toUpperCase()}`);
  let y = 50;
  pdf.setTextColor(50, 50, 50); pdf.setFontSize(10);
  const info = [["Student Name", user?.name || 'N/A'], ["Student ID", user?.studentId || 'N/A'], ["Semester", CURRENT_SEMESTER]];
  info.forEach(([l, v]) => { pdf.setFont(undefined, 'bold'); pdf.text(`${l}:`, 25, y); pdf.setFont(undefined, 'normal'); pdf.text(v, 75, y); y += 8; });
  y += 5;
  pdf.setFontSize(12); pdf.setFont(undefined, 'bold'); pdf.setTextColor(16, 185, 129); pdf.text("Payment Details", 25, y); y += 10;
  const headers = ["Description", "Amount", "Status"];
  const rows = [[payment.courseName || 'Course(s)', `$${(payment.amount || 0).toLocaleString()}`, "PAID ✓"]];
  y = drawPDFTable(pdf, headers, rows, y);
  y += 5;
  pdf.setFontSize(10); pdf.setFont(undefined, 'bold'); pdf.setTextColor(50, 50, 50);
  pdf.text(`Total Paid: $${(payment.amount || 0).toLocaleString()}`, 25, y);
  pdf.text("Status: APPROVED", 120, y);
  drawPDFFooter(pdf, y);
  pdf.save(`Receipt_${(payment.courseName || 'payment').replace(/\s+/g, '_')}.pdf`);
}

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
  const [attendanceData, setAttendanceData] = useState(null);
  const [academicEvents, setAcademicEvents] = useState([]);

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
          globalSettings,
          attendanceRes,
          eventsRes
        ] = await Promise.all([
          enrollmentsAPI.getAll({ studentId: user.id }),
          coursesAPI.getAll({ status: "active" }),
          newsAPI.getAll(),
          tuitionAPI.getAll({ studentId: user.id }),
          schedulesAPI.getAll(),
          notificationsAPI.getAll({ studentId: user.id }),
          transcriptAPI.getMe().catch(() => ({ data: null })),
          systemAPI.getSettings("registrar").catch(() => ({ data: null })),
          systemAPI.getSettings("settings").catch(() => ({ data: null })),
          attendanceAPI.getByStudent(user.id).catch(() => ({ data: null })),
          academicEventsAPI.getAll().catch(() => ({ data: [] }))
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
        if (attendanceRes?.data) setAttendanceData(attendanceRes.data);
        if (eventsRes?.data) setAcademicEvents(eventsRes.data);

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
    const interval = setInterval(fetchData, 60000); // 60s polling for "pseudo-realtime"
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
    : 0;
  const mySchedules = schedules?.filter(s => myActiveCourses?.some(c => c.id === s.courseId || c.name === s.courseName))?.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)) || [];

  // Year/Semester Filtering Logic
  const safeUserYear = Number(user?.year) || 1;
  const safeTargetYear = Number(systemConfig.targetYear) || 1;
  const safeTargetSemester = Number(systemConfig.targetSemester) || 1;

  const isMyWindow = !systemConfig.registrationLock && safeUserYear === safeTargetYear;
  const filteredAvailableCourses = availableCourses.filter(c => {
    // Only show courses for the student's academic year AND the currently active semester window
    return (Number(c.year) || 1) === safeUserYear && (Number(c.semester) || 1) === safeTargetSemester;
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
  const cardSx = { background: isDark ? "rgba(15,23,42,0.6)" : "#fff", backdropFilter: "blur(20px)", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.03)", borderRadius: 3 };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #0369a1 0%, #0284c7 100%)' }}>
      <Box sx={{ p: 3, pt: 4, textAlign: 'center' }}>
        <Box sx={{
          width: 72, height: 72, mx: 'auto', mb: 1.5,
          bgcolor: 'white', color: '#0284c7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.8rem',
          borderRadius: 2.5,
          border: '3px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          {(user?.name || "S")[0].toUpperCase()}
        </Box>
        <Typography variant="subtitle1" fontWeight={900} color="white" sx={{ lineHeight: 1.2 }}>{user?.name || "Student"}</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={700}>{user?.studentId || user?.email}</Typography>
        <Chip label={CURRENT_SEMESTER} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, fontSize: '0.65rem', borderRadius: 1.5 }} />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
      <List sx={{ px: 1.5, py: 1, flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
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
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(0,0,0,0.05)' }}>
        <Button fullWidth onClick={toggleColorMode} startIcon={mode === "dark" ? <LightMode /> : <DarkMode />} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 800, borderRadius: 2.5, py: 1.2, px: 2, mb: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }}>
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <ListItemButton onClick={logout} sx={{ borderRadius: 2.5, py: 1.2, px: 2, color: '#fca5a5', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)', color: '#ef4444' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Logout fontSize="small" /></ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 900, fontSize: '0.88rem' }} />
        </ListItemButton>
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
          {activeTab === 0 && <DashboardTab user={user} systemConfig={systemConfig} myActiveCourses={myActiveCourses} totalCredits={totalCredits} requiredCredits={requiredCredits} newsList={newsList} tuitionPayments={tuitionPayments} isDark={isDark} cardSx={cardSx} gradients={gradients} setActiveTab={setActiveTab} gpa={gpa} />}
          {activeTab === 1 && <ProfileTab user={user} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
          {activeTab === 2 && <RegistrationTab user={user} systemConfig={systemConfig} isMyWindow={isMyWindow} safeUserYear={safeUserYear} safeTargetYear={safeTargetYear} safeTargetSemester={safeTargetSemester} filteredAvailableCourses={filteredAvailableCourses} alreadyEnrolledIds={alreadyEnrolledIds} cart={cart} cartCredits={cartCredits} cartTotal={cartTotal} toggleCart={toggleCart} setPaymentModalOpen={setPaymentModalOpen} generateSemesterSlipPDF={generateSemesterSlipPDF} generateReceiptPDF={generateReceiptPDF} myActiveCourses={myActiveCourses} tuitionPayments={tuitionPayments} isDark={isDark} cardSx={cardSx} theme={theme} gradients={gradients} TUITION_PER_CREDIT={TUITION_PER_CREDIT} academicEvents={academicEvents} />}
          {activeTab === 3 && <AcademicRecordsTab myActiveCourses={myActiveCourses} gradeToPoints={gradeToPoints} isDark={isDark} cardSx={cardSx} transcriptData={transcriptData} />}
          {activeTab === 4 && <AttendanceTab user={user} enrollments={enrollments} availableCourses={availableCourses} attendanceData={attendanceData} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
          {activeTab === 5 && <GradesTab transcriptData={transcriptData} gpa={gpa} isDark={isDark} cardSx={cardSx} gradients={gradients} />}
          {activeTab === 6 && <FinanceTab myActiveCourses={myActiveCourses} tuitionPayments={tuitionPayments} user={user} generateSemesterSlipPDF={generateSemesterSlipPDF} generateReceiptPDF={generateReceiptPDF} isDark={isDark} cardSx={cardSx} />}
          {activeTab === 7 && <TimetableTab mySchedules={mySchedules} CURRENT_SEMESTER={CURRENT_SEMESTER} isDark={isDark} cardSx={cardSx} />}
          {activeTab === 8 && <LearningTab user={user} myActiveCourses={myActiveCourses} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
          {activeTab === 9 && <AdvisingTab user={user} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
          {activeTab === 10 && <GraduationTab user={user} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
          {activeTab === 11 && <NotificationsTab newsList={newsList} isDark={isDark} cardSx={cardSx} />}
          {activeTab === 12 && <ServicesTab user={user} isDark={isDark} glassStyle={cardSx} gradients={gradients} />}
        </Box>
      </Box>

      {/* NOTIFICATIONS */}
      <Dialog open={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography variant="h6" fontWeight={900}>Notifications</Typography><Typography variant="caption" color="text.secondary">{notifications.length} total</Typography></Box><IconButton onClick={() => setNotifDrawerOpen(false)}><Close /></IconButton></DialogTitle>
        <DialogContent sx={{ px: 3, py: 1 }}>
          {notifications.length === 0 ? <Box sx={{ textAlign: 'center', py: 4 }}><Notifications sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.2, mb: 1 }} /><Typography color="text.secondary" fontWeight={800}>No notifications.</Typography></Box> : (
            <Stack spacing={1.5}>{notifications.map((n, i) => (<Paper key={i} variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: n.read ? 'divider' : 'primary.main' }}><Typography variant="subtitle2" fontWeight={900}>{n.title || "Notification"}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{n.message}</Typography><Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>{n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : "Now"}</Typography></Paper>))}</Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* PAYMENT */}
      <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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
