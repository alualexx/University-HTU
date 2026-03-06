import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, Divider, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Tabs, Tab, Fade, Paper, LinearProgress, useTheme, Tooltip,
  Stack, Badge, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Collapse,
} from "@mui/material";
import {
  People, School, Book, Assignment, CheckCircle, PersonAdd,
  Logout, ArrowForward, LightMode, DarkMode, Search, FilterList,
  MoreVert, Notifications, Dashboard, LibraryBooks, SwapHoriz,
  Assessment, TrendingUp, Info, AccountCircle, Email, Phone,
  CalendarToday, Business, Warning, CheckCircleOutline, Cancel,
  AssignmentInd, ExpandMore, ExpandLess, Close,
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { db } from "../../services/Firebase";
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  addDoc, serverTimestamp, getDocs
} from "firebase/firestore";

// --- Mock Data ---
const enrollmentData = [
  { month: 'Sep', students: 850 },
  { month: 'Oct', students: 920 },
  { month: 'Nov', students: 1050 },
  { month: 'Dec', students: 980 },
  { month: 'Jan', students: 1150 },
  { month: 'Feb', students: 1250 },
];

const departmentDistribution = [
  { name: 'CS', value: 450, color: '#10b981' },
  { name: 'Engineering', value: 300, color: '#3b82f6' },
  { name: 'Business', value: 250, color: '#f59e0b' },
  { name: 'Arts', value: 150, color: '#8b5cf6' },
  { name: 'Science', value: 100, color: '#ec4899' },
];

const studentsRoster = [
  { id: 'STU-2024-001', name: 'James Wilson', dept: 'Computer Science', level: 'Year 3', status: 'Active', email: 'james@uni.edu' },
  { id: 'STU-2024-002', name: 'Maria Garcia', dept: 'Business Admin', level: 'Year 2', status: 'Active', email: 'maria@uni.edu' },
  { id: 'STU-2024-003', name: 'Robert Chen', dept: 'Mechanical Eng', level: 'Year 4', status: 'On Leave', email: 'robert@uni.edu' },
  { id: 'STU-2024-004', name: 'Sarah Miller', dept: 'Digital Arts', level: 'Year 1', status: 'Active', email: 'sarah@uni.edu' },
  { id: 'STU-2024-005', name: 'David Lee', dept: 'Physics', level: 'Year 2', status: 'Suspended', email: 'david@uni.edu' },
];

const pendingRequests = [
  { id: 1, student: 'Emily Blunt', course: 'Advanced AI (CS401)', date: '2026-03-05', priority: 'High' },
  { id: 2, student: 'Tom Hardy', course: 'Macroeconomics (EC202)', date: '2026-03-05', priority: 'Normal' },
  { id: 3, student: 'Cillian Murphy', course: 'Quantum Physics (PY301)', date: '2026-03-04', priority: 'Normal' },
  { id: 4, student: 'Florence Pugh', course: 'Graphic Design (ART105)', date: '2026-03-04', priority: 'High' },
];

// --- Custom Hooks & Constants ---
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;
    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end) * 5;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [target]);
  return count;
};

const RegistrarDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);

  // Fetch pending applications
  useEffect(() => {
    const q = query(collection(db, "applications"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      setApplications(apps);
    });

    const idQuery = query(collection(db, "applications"), where("status", "==", "setup_completed"));
    const unsubscribeIds = onSnapshot(idQuery, (snapshot) => {
      const ids = [];
      snapshot.forEach((doc) => {
        ids.push({ id: doc.id, ...doc.data() });
      });
      setPendingIds(ids);
    });

    return () => {
      unsubscribe();
      unsubscribeIds();
    };
  }, []);

  const handleApproveApplication = async (app) => {
    try {
      // Generate HTU-XXXX/YYYY student ID
      const year = new Date().getFullYear();
      const snapshot = await getDocs(
        query(collection(db, "applications"), where("status", "in", ["approved_by_registrar", "enrolled"]))
      );
      const seq = String(snapshot.size + 1).padStart(4, "0");
      const studentId = `HTU-${seq}/${year}`;

      await updateDoc(doc(db, "applications", app.id), {
        status: "approved_by_registrar",
        studentId,
        approvedAt: serverTimestamp(),
        reviewedBy: user?.name,
      });

      // Write notification
      await addDoc(collection(db, "notifications"), {
        applicantEmail: app.email,
        applicantPhone: app.phone || "",
        applicantName: app.name,
        status: "accepted",
        department: app.intendedMajor,
        studentId,
        message: `Congratulations! Your application to ${app.intendedMajor} has been accepted. Your Student ID is ${studentId}. Please wait for the admin to create your portal account.`,
        sentAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  const handleRejectApplication = async (appId, appData, reason) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        reviewedBy: user?.name,
      });

      // Write notification
      await addDoc(collection(db, "notifications"), {
        applicantEmail: appData.email,
        applicantPhone: appData.phone || "",
        applicantName: appData.name,
        status: "rejected",
        department: appData.intendedMajor,
        message: `We regret to inform you that your application to ${appData.intendedMajor} has been unsuccessful. Reason: ${reason}`,
        sentAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error rejecting application:", err);
    }
  };
  const handleGenerateIdCard = async (appId) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: "id_issued",
        idIssuedAt: serverTimestamp(),
        issuedBy: user?.name,
      });
      // At this point, you could also window.print() or generate a PDF.
    } catch (err) {
      console.error("Error issuing ID Card:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isDark = theme.palette.mode === 'dark';

  const glassStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  };

  // --- Sub-components (Tabs) ---

  const OverviewTab = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Stat Cards */}
        {[
          { label: "Total Students", value: 1250, icon: <People />, color: "#6366f1", trend: "+12%" },
          { label: "Active Courses", value: 78, icon: <LibraryBooks />, color: "#10b981", trend: "+5" },
          { label: "Pending Requests", value: 14, icon: <Assignment />, color: "#f59e0b", trend: "High Priority" },
          { label: "Staff Members", value: 32, icon: <AccountCircle />, color: "#ec4899", trend: "Full Team" },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ ...glassStyle, borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Chip size="small" label={stat.trend} sx={{ fontWeight: 700, bgcolor: `${stat.color}10`, color: stat.color }} />
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>{useCountUp(stat.value)}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Enrollment Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" /> Enrollment Growth (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Distribution (Donut Chart) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Student Distribution</Typography>
              <Box sx={{ height: 300, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const StudentsTab = () => (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ ...glassStyle, borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>Student Roster</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
                sx={{
                  width: 300,
                  "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }
                }}
              />
              <Button variant="contained" startIcon={<PersonAdd />} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #6366f1, #a855f7)', textTransform: 'none', fontWeight: 600 }}>
                Enroll New
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Student Info</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID Number</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Level</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsRoster.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                  <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', fontSize: '0.875rem' }}>{student.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{student.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" fontFamily="monospace" fontWeight={600} color="primary">{student.id}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{student.dept}</Typography></TableCell>
                    <TableCell><Chip label={student.level} size="small" variant="outlined" /></TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: student.status === 'Active' ? 'success.light' : (student.status === 'On Leave' ? 'warning.light' : 'error.light'),
                          color: student.status === 'Active' ? 'success.dark' : (student.status === 'On Leave' ? 'warning.dark' : 'error.dark'),
                          opacity: 0.8
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><MoreVert /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const CoursesTab = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {[
          { dept: "Computer Science", code: "CS", courses: 14, active: 12, lead: "Dr. Maria Chen" },
          { dept: "Engineering", code: "ENG", courses: 12, active: 10, lead: "Prof. Robert Smith" },
          { dept: "Business Admin", code: "BUS", courses: 10, active: 9, lead: "Dr. Linda Gray" },
          { dept: "Digital Arts", code: "ART", courses: 8, active: 8, lead: "Prof. Susan Lee" },
        ].map((dept, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ ...glassStyle, borderRadius: 4, cursor: 'pointer', '&:hover': { transform: 'scale(1.02)' }, transition: '0.2s' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{dept.code}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} noWrap>{dept.dept}</Typography>
                    <Typography variant="caption" color="text.secondary">Head: {dept.lead}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>{dept.courses}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Courses</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={800} color="success.main">{dept.active}</Typography>
                    <Typography variant="caption" color="text.secondary">Published</Typography>
                  </Box>
                </Stack>
                <Button fullWidth variant="outlined" size="small" sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}>
                  Manage Catalog
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card sx={{ ...glassStyle, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Course Additions</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Course Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Instructor</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Credits</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: "Machine Learning Foundations", code: "CS302", prof: "Dr. Chen", cr: 4, status: "Active" },
                      { name: "Global Supply Chain", code: "BUS220", prof: "Prof. Gray", cr: 3, status: "Draft" },
                      { name: "Interactive Media Design", code: "ART108", prof: "Prof. Lee", cr: 3, status: "Active" },
                    ].map((row, i) => (
                      <TableRow key={i}>
                        <TableCell><Typography variant="body2" fontWeight={600}>{row.name}</Typography></TableCell>
                        <TableCell><Typography variant="body2" fontFamily="monospace" color="primary">{row.code}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{row.prof}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{row.cr}</Typography></TableCell>
                        <TableCell><Chip size="small" label={row.status} color={row.status === "Active" ? "success" : "default"} sx={{ fontWeight: 600 }} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Reject dialog state
  const [rejectDialog, setRejectDialog] = useState({ open: false, app: null, reason: "" });
  // Expanded applicant details
  const [expandedApp, setExpandedApp] = useState(null);

  const ApplicationsTab = () => (
    <Box sx={{ mt: 3 }}>
      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, app: null, reason: "" })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rejecting application from <strong>{rejectDialog.app?.name}</strong> for <strong>{rejectDialog.app?.intendedMajor}</strong>.
          </Typography>
          <TextField
            fullWidth multiline rows={3}
            label="Rejection Reason *"
            placeholder="Explain why this application is being rejected..."
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog((p) => ({ ...p, reason: e.target.value }))}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setRejectDialog({ open: false, app: null, reason: "" })} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Cancel</Button>
          <Button
            variant="contained" color="error"
            disabled={!rejectDialog.reason.trim()}
            onClick={async () => {
              await handleRejectApplication(rejectDialog.app.id, rejectDialog.app, rejectDialog.reason);
              setRejectDialog({ open: false, app: null, reason: "" });
            }}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ ...glassStyle, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Pending Student Applications</Typography>
                <Chip label={`${applications.length} Pending`} color="error" size="small" sx={{ fontWeight: 800 }} />
              </Box>
              <Stack spacing={2}>
                {applications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1, opacity: 0.5 }} />
                    <Typography variant="body1" color="text.secondary">No pending applications at the moment.</Typography>
                  </Box>
                ) : (
                  applications.map((app) => {
                    const isExpanded = expandedApp === app.id;
                    return (
                      <Paper key={app.id} variant="outlined" sx={{
                        borderRadius: 3, border: '1px solid', borderColor: 'divider',
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                        overflow: 'hidden', transition: 'all 0.2s ease',
                        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }
                      }}>
                        {/* Header row */}
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 800 }}>
                            {app.name?.[0] || '?'}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={800} noWrap>{app.name}</Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 0.3 }}>
                              <Typography variant="caption" color="text.secondary">{app.email}</Typography>
                              {app.phone && <Typography variant="caption" color="text.secondary">· {app.phone}</Typography>}
                            </Box>
                          </Box>
                          <Chip label={app.intendedMajor || app.departmentCode} size="small"
                            sx={{ fontWeight: 700, bgcolor: 'primary.50', color: 'primary.main', display: { xs: 'none', sm: 'flex' } }} />
                          <IconButton size="small" onClick={() => setExpandedApp(isExpanded ? null : app.id)}>
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>

                        {/* Expandable details */}
                        <Collapse in={isExpanded}>
                          <Divider />
                          <Box sx={{ p: 2.5 }}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">Department</Typography>
                                <Typography variant="body2" fontWeight={700}>{app.intendedMajor}</Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">GPA / Grade</Typography>
                                <Typography variant="body2" fontWeight={700}>{app.highSchoolGrades || '—'}</Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">High School</Typography>
                                <Typography variant="body2">{app.highSchoolName || '—'}</Typography>
                              </Grid>
                              {app.personalStatement && (
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>Personal Statement</Typography>
                                  <Typography variant="body2" sx={{
                                    fontStyle: 'italic', p: 1.5, borderRadius: 2,
                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                                    lineHeight: 1.7,
                                  }}>
                                    "{app.personalStatement}"
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>

                            {/* Auto-generated ID preview */}
                            <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                              <Typography variant="caption">
                                On approval, the system will automatically assign a student ID in the format <strong>HTU-XXXX/{new Date().getFullYear()}</strong>.
                              </Typography>
                            </Alert>

                            {/* Action buttons */}
                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined" size="small" color="error"
                                startIcon={<Cancel />}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                onClick={() => setRejectDialog({ open: true, app, reason: '' })}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="contained" size="small" color="success"
                                startIcon={<CheckCircleOutline />}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                onClick={() => handleApproveApplication(app)}
                              >
                                Approve & Assign ID
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </Paper>
                    );
                  })
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Registration Stats</Typography>
              <Box sx={{ mt: 3 }}>
                {[
                  { label: "Completion Rate", value: 88, color: "success" },
                  { label: "Approved (Weekly)", value: 45, color: "info" },
                  { label: "Rejected (Weekly)", value: 7, color: "error" },
                ].map((item, i) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight={800}>{item.value}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={item.value} color={item.color} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>ID Format</Typography>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AssignmentInd />
                <Box>
                  <Typography variant="body2" fontWeight={700}>Auto-Generated IDs</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontFamily: 'monospace' }}>HTU-XXXX/{new Date().getFullYear()}</Typography>
                </Box>
              </Box>
              <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ mt: 2 }}>Upcoming Periods</Typography>
              <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarToday sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" fontWeight={700}>Fall 2026 Registration</Typography>
                  <Typography variant="caption" color="text.secondary">Starts April 15, 2026</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const PendingIdsTab = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ ...glassStyle, borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h5" fontWeight={800} gutterBottom>ID Card Generation Queue</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students here have completed password setup and are ready for their official Digital ID Cards.
                  </Typography>
                </Box>
                <Chip label={`${pendingIds.length} Ready`} color="primary" sx={{ fontWeight: 800 }} />
              </Box>

              <Grid container spacing={3}>
                {pendingIds.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <CheckCircleOutline sx={{ fontSize: 64, color: 'success.main', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary">All ID Cards have been generated!</Typography>
                    </Box>
                  </Grid>
                ) : (
                  pendingIds.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      {/* Visual ID Card Preview */}
                      <Card sx={{
                        borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        position: 'relative'
                      }}>
                        {/* ID Card Header */}
                        <Box sx={{ bgcolor: '#0d47a1', color: 'white', p: 3, pb: 6, textAlign: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={800} letterSpacing={2}>HTU UNIVERSITY</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>STUDENT IDENTIFICATION</Typography>
                        </Box>

                        {/* Avatar / Photo Placeholder */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: -5 }}>
                          <Avatar sx={{ width: 80, height: 80, border: '4px solid white', bgcolor: 'primary.light', color: 'primary.dark', fontSize: '2rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {student.name?.[0]}
                          </Avatar>
                        </Box>

                        {/* ID Details */}
                        <Box sx={{ p: 3, pt: 2, textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight={800} gutterBottom>{student.name}</Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>ID Number</Typography>
                              <Typography variant="caption" fontWeight={800} color="primary.main">{student.studentId || "PENDING"}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>Department</Typography>
                              <Typography variant="caption" fontWeight={700}>{student.intendedMajor || "Undeclared"}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>Email</Typography>
                              <Typography variant="caption" fontWeight={700}>{student.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>Issued</Typography>
                              <Typography variant="caption" fontWeight={700}>{new Date().toLocaleDateString()}</Typography>
                            </Box>
                          </Box>

                          {/* Placeholder Barcode */}
                          <Box sx={{ width: '100%', height: 40, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 1, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', letterSpacing: 4, opacity: 0.5 }}>|| ||| | || ||| || |</Typography>
                          </Box>

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              // Ideally this would trigger a print styled view, but for now we issue it.
                              handleGenerateIdCard(student.id);
                            }}
                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                          >
                            Generate & Issue Card
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const AnalyticsTab = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...glassStyle, borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Students per Department</Typography>
              <Box sx={{ height: 350, mt: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary }} />
                    <RechartsTooltip cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.light', mb: 2 }}>
              <Assessment sx={{ fontSize: 40, color: 'primary.dark' }} />
            </Avatar>
            <Typography variant="h5" fontWeight={800} gutterBottom>Administrative Report</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 4 }}>
              Generate university-wide performance reports, enrollment audit logs, and departmental growth projections.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" sx={{ borderRadius: 3, px: 3, py: 1, textTransform: 'none', fontWeight: 600 }}>Download PDF</Button>
              <Button variant="outlined" sx={{ borderRadius: 3, px: 3, py: 1, textTransform: 'none', fontWeight: 600 }}>Export CSV</Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: isDark ? "#0f172a" : "#f8fafc", minHeight: "100vh", pb: 10 }}>
      {/* Header Banner */}
      <Box sx={{
        background: isDark
          ? "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)"
          : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        pt: 6, pb: 12, position: "relative", overflow: "hidden"
      }}>
        {/* Animated Orbs */}
        <Box sx={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(80px)" }} />
        <Box sx={{ position: "absolute", bottom: -50, left: 100, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }} />

        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Avatar
                src={user?.profileImage}
                sx={{
                  width: 80, height: 80, border: "4px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  background: 'white', color: 'primary.main', fontSize: '2rem', fontWeight: 800
                }}
              >
                {user?.name?.[0].toUpperCase()}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h3" fontWeight={900} color="white" letterSpacing="-0.04em">
                    Registrar Portal
                  </Typography>
                  <Chip
                    label="L3 Admin Access"
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)", color: "white",
                      fontWeight: 800, textTransform: "uppercase", fontSize: "0.65rem",
                      backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)"
                    }}
                  />
                </Box>
                <Typography variant="h6" color="rgba(255,255,255,0.8)" fontWeight={500}>
                  Welcome back, <span style={{ color: 'white', fontWeight: 700 }}>{user?.name || "Officer"}</span>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleColorMode} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(10px)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <Badge color="error" variant="dot" invisible={false}>
                  <IconButton sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(10px)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" } }}>
                    <Notifications />
                  </IconButton>
                </Badge>
              </Tooltip>
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                variant="contained"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)", color: "white",
                  px: 3, borderRadius: 2.5, fontWeight: 700, textTransform: "none",
                  backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": { bgcolor: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.3)" }
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Areas */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            ...glassStyle,
            p: 1, borderRadius: 5, mb: 4,
            display: 'flex', justifyContent: 'center'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #6366f1, #a855f7)' },
              '& .MuiTab-root': {
                mx: 1, px: 3, borderRadius: 3, fontWeight: 700, textTransform: 'none', minHeight: 48, fontSize: '0.95rem',
                color: 'text.secondary', '&.Mui-selected': { color: isDark ? 'white' : 'primary.main' }
              }
            }}
          >
            <Tab icon={<Dashboard sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Overview" />
            <Tab icon={<People sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Students" />
            <Tab icon={<LibraryBooks sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Courses" />
            <Tab icon={<SwapHoriz sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Applications" />
            <Tab icon={<AssignmentInd sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label={
              <Badge badgeContent={pendingIds.length} color="error" sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}>
                Pending IDs
              </Badge>
            } />
            <Tab icon={<Assessment sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Analytics" />
          </Tabs>
        </Paper>

        <Box sx={{ transition: '0.3s' }}>
          {activeTab === 0 && <OverviewTab />}
          {activeTab === 1 && <StudentsTab />}
          {activeTab === 2 && <CoursesTab />}
          {activeTab === 3 && <ApplicationsTab />}
          {activeTab === 4 && <PendingIdsTab />}
          {activeTab === 5 && <AnalyticsTab />}
        </Box>
      </Container>
    </Box>
  );
};

export default RegistrarDashboard;
