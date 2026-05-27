import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, Divider, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, useTheme,
  List, ListItem, ListItemIcon, ListItemText,
  Tooltip, Stack, Badge, Tabs, Tab, alpha, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Drawer, useMediaQuery
} from "@mui/material";
import {
  Business, People, School, Assignment, TrendingUp, Assessment,
  AccountCircle, Notifications, LightMode, DarkMode, Logout,
  Dashboard, Star, Groups, BarChart as BarChartIcon, Settings,
  CheckCircle, Cancel, Visibility, Description as FileIcon, Search,
  School as SchoolIcon, Assignment as AssignmentIcon, Grade, CalendarToday,
  Phone, Close as CloseIcon, Email, ArrowForward, ChevronLeft, ChevronRight,
  Menu as MenuIcon, Add as AddIcon, Send as SendIcon, LibraryBooks,
  SupportAgent, Computer, Delete, MenuBook, Edit as EditIcon, LockReset
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { db } from "../../services/Firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, addDoc, writeBatch, deleteDoc } from "firebase/firestore";
import useCountUp from "../../hooks/useCountUp";

const gradients = {
  primary: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
};

const departmentStats = [
  { name: 'CS', gpa: 3.4, students: 450, faculty: 12 },
  { name: 'Engineering', gpa: 3.1, students: 300, faculty: 10 },
  { name: 'Business', gpa: 3.5, students: 250, faculty: 8 },
  { name: 'Arts', gpa: 3.6, students: 150, faculty: 6 },
];


const DepartmentDashboard = () => {
  const { user, logout, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSubTab, setAppSubTab] = useState(0); // 0: Pending, 1: History

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Curriculum & Faculty States
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: 3, year: 1, semester: 1, instructorId: "", instructorName: "", modules: [] });
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseYearFilter, setCourseYearFilter] = useState("all");
  const [isSubmittingSemester, setIsSubmittingSemester] = useState(false);

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [gradingCourseId, setGradingCourseId] = useState("");
  const [gradingEnrollments, setGradingEnrollments] = useState([]);
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [tempGrade, setTempGrade] = useState("");

  // Advising & Resources States
  const [advisors, setAdvisors] = useState([]);
  const [openAddAdvisor, setOpenAddAdvisor] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({ name: "", role: "", nextAvailable: "" });
  
  const [resources, setResources] = useState([]);
  const [openAddResource, setOpenAddResource] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", type: "Facility" });
  const [userIp, setUserIp] = useState("unknown");

  const isDark = theme.palette.mode === 'dark';

  const glassStyle = {
    background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px) saturate(180%)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  };

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "applications"), where("intendedMajor", "==", user?.department || ""));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      setLoadingApps(false);
    });

    // Listen to Courses
    const qCourses = query(collection(db, "courses"), where("department", "==", user?.department || ""));
    const unsubCourses = onSnapshot(qCourses, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Faculty
    const qFaculty = query(collection(db, "users"), where("role", "==", "faculty"), where("department", "==", user?.department || ""));
    const unsubFaculty = onSnapshot(qFaculty, (snapshot) => {
      setFaculty(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to enrollments for grading
    let unsubEnroll = () => {};
    if (gradingCourseId) {
      const qEnroll = query(collection(db, "enrollments"), where("courseId", "==", gradingCourseId));
      unsubEnroll = onSnapshot(qEnroll, (snapshot) => {
        setGradingEnrollments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }

    // Listen to Advisors
    const qAdvisors = query(collection(db, "department_advisors"), where("department", "==", user?.department || ""));
    const unsubAdvisors = onSnapshot(qAdvisors, (snapshot) => {
      setAdvisors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Resources
    const qResources = query(collection(db, "department_resources"), where("department", "==", user?.department || ""));
    const unsubResources = onSnapshot(qResources, (snapshot) => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch User IP for auditing
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => {
        console.warn("IP fetch failed:", err);
        setUserIp("unknown");
      });

    return () => {
      unsubscribe();
      unsubCourses();
      unsubFaculty();
      unsubEnroll();
      unsubAdvisors();
      unsubResources();
    };
  }, [user?.uid, user?.department, gradingCourseId]);

  const handleAddCourse = async () => {
    try {
      if (!newCourse.code || !newCourse.name || !newCourse.year || !newCourse.semester) return;
      const selectedInstructor = faculty.find(f => f.id === newCourse.instructorId);
      await addDoc(collection(db, "courses"), {
        ...newCourse,
        credits: Number(newCourse.credits) || 3,
        year: Number(newCourse.year),
        semester: Number(newCourse.semester),
        instructorName: selectedInstructor?.name || "",
        department: user.department,
        status: "draft",
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      setOpenAddCourse(false);
      setNewCourse({ code: "", name: "", credits: 3, year: 1, semester: 1, instructorId: "", instructorName: "", modules: [] });
    } catch (err) {
      console.error("Add course error:", err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", courseId));
      } catch (err) {
        console.error("Delete course error:", err);
      }
    }
  };

  const handleUpdateCourse = async () => {
    try {
      if (!editingCourse || !editingCourse.id || !editingCourse.code || !editingCourse.name || !editingCourse.year || !editingCourse.semester) return;
      const selectedInstructor = faculty.find(f => f.id === editingCourse.instructorId);
      await updateDoc(doc(db, "courses", editingCourse.id), {
        code: editingCourse.code.toUpperCase(),
        name: editingCourse.name,
        credits: Number(editingCourse.credits) || 3,
        year: Number(editingCourse.year),
        semester: Number(editingCourse.semester),
        instructorName: selectedInstructor?.name || "",
        instructorId: selectedInstructor?.id || "",
        updatedAt: serverTimestamp(),
      });
      setOpenEditCourse(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Update course error:", err);
    }
  };

  const handleSubmitSemester = async () => {
    setIsSubmittingSemester(true);
    try {
      const draftCourses = courses.filter(c => c.status === "draft");
      const batch = writeBatch(db);
      draftCourses.forEach(c => {
        batch.update(doc(db, "courses", c.id), { status: "pending_approval" });
      });
      await batch.commit();
    } catch (err) {
      console.error("Submit semester error:", err);
    } finally {
      setIsSubmittingSemester(false);
    }
  };

  const handleAddAdvisor = async () => {
    try {
      if (!newAdvisor.name || !newAdvisor.role) return;
      await addDoc(collection(db, "department_advisors"), {
        ...newAdvisor,
        students: 0,
        avatarColor: Object.values(gradients)[Math.floor(Math.random() * 5)],
        department: user.department,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      setOpenAddAdvisor(false);
      setNewAdvisor({ name: "", role: "", nextAvailable: "" });
    } catch (err) {
      console.error("Add advisor error:", err);
    }
  };

  const handleAddResource = async () => {
    try {
      if (!newResource.name) return;
      await addDoc(collection(db, "department_resources"), {
        ...newResource,
        status: "Available",
        utilization: 0,
        department: user.department,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      setOpenAddResource(false);
      setNewResource({ name: "", type: "Facility" });
    } catch (err) {
      console.error("Add resource error:", err);
    }
  };

  const handleAssignCourse = async (courseId) => {
    if (!selectedFaculty) return;
    try {
      await updateDoc(doc(db, "courses", courseId), {
        instructorId: selectedFaculty.id,
        instructorName: selectedFaculty.name
      });
      // Optional: Update local state if needed, but onSnapshot handles it
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  const handleUpdateGrade = async (grade) => {
    if (!selectedEnrollment) return;
    try {
      await updateDoc(doc(db, "enrollments", selectedEnrollment.id), {
        grade: grade,
        gradedAt: serverTimestamp(),
        gradedBy: user.uid
      });
      setOpenGradeModal(false);
      setTempGrade("");
    } catch (err) {
      console.error("Grade update error:", err);
    }
  };

  const handleApproveDept = async (appId) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: "approved_by_dept",
        deptApprovedAt: serverTimestamp(),
        deptHeadId: user.uid
      });
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleRejectDept = async (appId) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: "rejected_by_dept",
        deptRejectedAt: serverTimestamp(),
        deptHeadId: user.uid
      });
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const handleDirectPasswordReset = async (email, name) => {
    if (!window.confirm(`Are you sure you want to trigger a password reset for ${name} (${email})?`)) return;
    
    try {
      await sendPasswordReset(email);
      // Audit log
      await addDoc(collection(db, "audit_logs"), {
        action: "Manual Password Reset (Dept Head)",
        targetUser: email,
        processedBy: user?.email || "Dept Head",
        timestamp: serverTimestamp(),
        ip: userIp || "unknown"
      });
      alert(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error("Error sending direct password reset:", err);
      alert("Failed to send password reset email.");
    }
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const handleOpenDetails = (app) => {
    setSelectedApp(app);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedApp(null);
  };

  const pendingApps = applications.filter(app => app.status === "pending_dept_review");
  const historyApps = applications.filter(app => ["approved_by_dept", "rejected_by_dept"].includes(app.status));

  const Sidebar = () => (
    <Box sx={{
      width: sidebarOpen ? 280 : 80,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' : 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)',
      color: 'white',
      zIndex: 1200,
      transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
        {sidebarOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'white', color: '#1e293b', fontWeight: 1000, width: 40, height: 40, fontSize: '1.2rem' }}>
              {user?.department?.[0] || 'D'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={1000} sx={{ letterSpacing: 0.5, lineHeight: 1.2 }}>
                {user?.department || 'UNIVERSITY'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem', fontWeight: 800 }}>DECISION ENGINE</Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Nav Items */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {[
          { label: "Dashboard", icon: <Dashboard />, index: 0 },
          { label: "Admissions", icon: <AssignmentIcon />, index: 1, badge: pendingApps.length },
          { label: "Faculty", icon: <Groups />, index: 2 },
          { label: "Curriculum", icon: <School />, index: 3 },
          { label: "Advising", icon: <SupportAgent />, index: 5 },
          { label: "Resources", icon: <Computer />, index: 6 },
          { label: "Analytics", icon: <Assessment />, index: 4 },
          { label: "Settings", icon: <Settings />, index: 7 },
        ].map((item) => (
          <ListItem key={item.index} disablePadding sx={{ mb: 1 }}>
            <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
              <Button
                fullWidth
        onClick={() => { setActiveTab(item.index); setMobileOpen(false); }}
                startIcon={item.icon}
                sx={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  px: sidebarOpen ? 2 : 0,
                  py: 1.5,
                  borderRadius: 3,
                  minWidth: 0,
                  color: activeTab === item.index ? "#fff" : "rgba(255,255,255,0.6)",
                  bgcolor: activeTab === item.index ? "rgba(255,255,255,0.12)" : "transparent",
                  "& .MuiButton-startIcon": {
                    marginRight: sidebarOpen ? 1.5 : 0,
                    marginLeft: sidebarOpen ? 0 : 0,
                    color: activeTab === item.index ? "#fff" : "rgba(255,255,255,0.6)"
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  transition: '0.2s'
                }}
              >
                {sidebarOpen && (
                  <Box sx={{ flexGrow: 1, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight={activeTab === item.index ? 800 : 600}>{item.label}</Typography>
                    {item.badge > 0 && (
                      <Chip label={item.badge} size="small" color="error" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900 }} />
                    )}
                  </Box>
                )}
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Sidebar Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.1, bgcolor: 'white' }} />
        <Button
          fullWidth
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
          sx={{
            justifyContent: sidebarOpen ? "flex-start" : "center",
            color: "rgba(255,255,255,0.7)",
            py: 1.5,
            borderRadius: 3,
            "& .MuiButton-startIcon": { marginRight: sidebarOpen ? 1.5 : 0 }
          }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={600}>{mode === "dark" ? "Light Mode" : "Dark Mode"}</Typography>}
        </Button>
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            justifyContent: sidebarOpen ? "flex-start" : "center",
            color: "white",
            bgcolor: "rgba(239, 68, 68, 0.15)",
            mt: 1,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            "& .MuiButton-startIcon": { marginRight: sidebarOpen ? 1.5 : 0 },
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.3)" }
          }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={800}>Logout</Typography>}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: isDark ? "#0f172a" : "#f8fafc", minHeight: "100vh" }}>
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
          '& .MuiDrawer-paper': { width: sidebarOpen ? 280 : 80, boxSizing: 'border-box' }
        }}
      >
        <Sidebar />
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1,
        ml: { xs: 0, md: `${sidebarOpen ? 280 : 80}px` },
        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        p: 0,
        minWidth: 0,
        color: isDark ? 'white' : 'text.primary'
      }}>
        {/* Dynamic Header / Context Bar */}
        <Box sx={{
          background: isDark ? "linear-gradient(135deg, #0f172a 0%, #020617 100%)" : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          pt: 6, pb: 12, position: "relative", overflow: "hidden",
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Animated Background Elements */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center' }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
              >
                <MenuIcon />
              </IconButton>

                <Avatar sx={{
                  width: 64, height: 64,
                  bgcolor: 'white', color: '#1e293b',
                  fontWeight: 1000, fontSize: '1.5rem',
                  border: '3px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                }}>
                  {user?.name?.[0] || 'D'}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={1000} color="white" sx={{ letterSpacing: -1, fontFamily: 'Outfit, sans-serif' }}>
                    Welcome, {user?.name?.split(' ')[0] || "Officer"}
                  </Typography>
                  <Typography variant="subtitle2" color="rgba(255,255,255,0.6)" fontWeight={700}>
                    {user?.department || "Academic"} Department Control Panel
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="h6" color="white" fontWeight={900}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight={800}>
                  {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ mt: -6, position: "relative", zIndex: 10, pb: 10 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {[
              { label: "Active Cohort", value: "1,240", icon: <People />, color: gradients.primary },
              { label: "Pending Reviews", value: pendingApps.length, icon: <Assignment />, color: gradients.secondary },
              { label: "Faculty Count", value: "48", icon: <School />, color: gradients.success },
              { label: "Enrollment Yield", value: "84%", icon: <TrendingUp />, color: gradients.warning },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ background: stat.color, width: 48, height: 48, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                        {stat.icon}
                      </Avatar>
                      <Chip label="+12.5%" size="small" sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', fontWeight: 900, fontSize: '0.7rem' }} />
                    </Box>
                    <Typography variant="h4" fontWeight={1000} sx={{ mb: 0.5, letterSpacing: -1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} md={8}>
              <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={900} gutterBottom>Department Growth Archetype</Typography>
                  <Box sx={{ height: 350, mt: 4 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha('#94a3b8', 0.1)} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <RechartsTooltip cursor={{ fill: alpha('#94a3b8', 0.05) }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="students" radius={[6, 6, 0, 0]} barSize={40}>
                          {departmentStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={Object.values(gradients)[index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={900} gutterBottom>Capacity Distribution</Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Undergrad', value: 400 },
                            { name: 'Postgrad', value: 300 },
                            { name: 'Research', value: 200 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill="#a855f7" />
                          <Cell fill="#ec4899" />
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight={800} gutterBottom>Utilization Metrics</Typography>
                    <Stack spacing={2.5}>
                      {['Lecture Halls', 'Lab Resources', 'Library Slots'].map((item, i) => (
                        <Box key={i}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700}>{item}</Typography>
                            <Typography variant="caption" fontWeight={900}>85%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3, bgcolor: alpha('#6366f1', 0.1), '& .MuiLinearProgress-bar': { borderRadius: 3, background: gradients.premium } }} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Admission Pipeline</Typography>
              <Tabs
                value={appSubTab}
                onChange={(e, v) => setAppSubTab(v)}
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  p: 0.5, borderRadius: 3,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': {
                    borderRadius: 2.5, minHeight: 40, px: 3, fontWeight: 800, textTransform: 'none', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    '&.Mui-selected': { bgcolor: isDark ? 'white' : '#1e293b', color: isDark ? '#1e293b' : 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  }
                }}
              >
                <Tab label={`Pending (${pendingApps.length})`} />
                <Tab label={`History (${historyApps.length})`} />
              </Tabs>
            </Box>

            <Grid container spacing={3}>
              {(appSubTab === 0 ? pendingApps : historyApps).map((app) => (
                <Grid item xs={12} md={6} key={app.id}>
                  <Card sx={{
                    ...glassStyle, borderRadius: 4, transition: '0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar sx={{ bgcolor: gradients.secondary, fontWeight: 900 }}>{app.fullName?.[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={900}>{app.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{app.email}</Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={app.status?.replace(/_/g, ' ').toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            fontSize: '0.65rem',
                            bgcolor: app.status === 'pending_dept_review' ? alpha('#f59e0b', 0.1) : app.status === 'approved_by_dept' ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                            color: app.status === 'pending_dept_review' ? '#f59e0b' : app.status === 'approved_by_dept' ? '#10b981' : '#ef4444'
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2, opacity: 0.5 }} />

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>Applied Major</Typography>
                          <Typography variant="body2" fontWeight={800}>{app.intendedMajor}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>Previous Score</Typography>
                          <Typography variant="body2" fontWeight={800}>{app.highSchoolGPA || "N/A"}</Typography>
                        </Grid>
                      </Grid>

                      <Stack direction="row" spacing={2}>
                        <Button
                          fullWidth variant="outlined" startIcon={<Visibility />} onClick={() => handleOpenDetails(app)}
                          sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: 'none', borderColor: alpha(isDark ? '#fff' : '#1e293b', 0.2) }}
                        >
                          Review
                        </Button>
                        {app.status === 'pending_dept_review' && (
                          <>
                            <Button
                              fullWidth variant="contained" color="success" onClick={() => handleApproveDept(app.id)}
                              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: 'none', background: gradients.success }}
                            >
                              Approve
                            </Button>
                            <Button
                              fullWidth variant="contained" color="error" onClick={() => handleRejectDept(app.id)}
                              sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {(appSubTab === 0 ? pendingApps : historyApps).length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 10, ...glassStyle, borderRadius: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={800}>No applications found in this queue</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Curriculum Lifecycle</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE SEMESTER COURSES</Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<SendIcon />} 
                  onClick={handleSubmitSemester}
                  disabled={isSubmittingSemester || !courses.some(c => c.status === 'draft')}
                  sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}
                >
                  {isSubmittingSemester ? "Submitting..." : "Submit Semester for Approval"}
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => setOpenAddCourse(true)}
                  sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: 'none', background: gradients.premium }}
                >
                  Create New Course
                </Button>
              </Stack>
            </Box>

            {/* Year Filter Tabs */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {["all", 1, 2, 3, 4].map(y => (
                <Chip 
                  key={y} 
                  label={y === "all" ? "All Years" : `Year ${y}`} 
                  onClick={() => setCourseYearFilter(y)}
                  sx={{ 
                    fontWeight: 900, cursor: 'pointer',
                    bgcolor: courseYearFilter === y ? gradients.premium : 'transparent',
                    color: courseYearFilter === y ? 'white' : 'text.primary',
                    border: '1px solid', borderColor: 'divider'
                  }} 
                />
              ))}
            </Box>

            {/* Grouped by Year → Semester */}
            {[1, 2, 3, 4].filter(y => courseYearFilter === "all" || courseYearFilter === y).map(year => {
              const yearCourses = courses.filter(c => c.year === year);
              if (yearCourses.length === 0 && courseYearFilter === "all") return null;
              return (
                <Box key={year} sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: gradients.premium, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="white" fontWeight={900} fontSize="0.85rem">{year}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={1000}>Year {year}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>{yearCourses.length} COURSES</Typography>
                    </Box>
                  </Box>
                  {[1, 2].map(sem => {
                    const semCourses = yearCourses.filter(c => c.semester === sem);
                    return (
                      <Box key={sem} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, px: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: sem === 1 ? gradients.primary : gradients.secondary }} />
                          <Typography variant="subtitle2" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            Semester {sem}
                          </Typography>
                          <Chip label={`${semCourses.length} course${semCourses.length !== 1 ? 's' : ''}`} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', height: 20 }} />
                        </Box>
                        {semCourses.length === 0 ? (
                          <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>No courses for Semester {sem} yet</Typography>
                          </Box>
                        ) : (
                          <TableContainer sx={{ ...glassStyle, borderRadius: 4, overflow: 'hidden' }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>CODE</TableCell>
                                  <TableCell sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>COURSE NAME</TableCell>
                                  <TableCell sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>CREDITS</TableCell>
                                  <TableCell sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>INSTRUCTOR</TableCell>
                                  <TableCell sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>STATUS</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.7rem' }}>ACTIONS</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {semCourses.map(course => (
                                  <TableRow key={course.id} sx={{ '&:hover': { bgcolor: alpha('#fff', 0.02) } }}>
                                    <TableCell sx={{ fontWeight: 1000 }}>{course.code}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{course.name}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{course.credits}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: course.instructorName ? 'primary.main' : 'text.secondary' }}>
                                      {course.instructorName || "Unassigned"}
                                    </TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={(course.status || 'draft').toUpperCase()} 
                                        size="small" 
                                        sx={{ 
                                          fontWeight: 900, 
                                          fontSize: '0.6rem', 
                                          height: 20,
                                          bgcolor: course.status === 'active' ? alpha('#10b981', 0.1) : course.status === 'pending_approval' ? alpha('#f59e0b', 0.1) : alpha('#94a3b8', 0.1), 
                                          color: course.status === 'active' ? '#10b981' : course.status === 'pending_approval' ? '#f59e0b' : '#94a3b8' 
                                        }} 
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <IconButton size="small" onClick={() => { setEditingCourse(course); setOpenEditCourse(true); }} color="primary" sx={{ mr: 1 }}>
                                        <EditIcon sx={{ fontSize: 18 }} />
                                      </IconButton>
                                      <IconButton size="small" onClick={() => handleDeleteCourse(course.id)} color="error" disabled={course.status === 'active'}>
                                        <Delete sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
            {courses.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10, ...glassStyle, borderRadius: 4, mt: 2 }}>
                <LibraryBooks sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontWeight={800}>No courses registered for this department</Typography>
                <Button sx={{ mt: 2 }} onClick={() => setOpenAddCourse(true)}>Initialize First Course</Button>
              </Box>
            )}

            {/* Add Course Dialog */}
            <Dialog open={openAddCourse} onClose={() => setOpenAddCourse(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
              <DialogTitle fontWeight={1000}>Draft New Course</DialogTitle>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <TextField 
                    fullWidth label="Course Code" placeholder="e.g. CS101" 
                    value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value.toUpperCase()})}
                  />
                  <TextField 
                    fullWidth label="Course Name" placeholder="e.g. Intro to Databases" 
                    value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  />
                  <TextField 
                    fullWidth label="Credit Hours" type="number" inputProps={{ min: 1, max: 6 }}
                    value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: Number(e.target.value)})}
                  />
                  <TextField
                    select fullWidth label="Academic Year"
                    value={newCourse.year} onChange={(e) => setNewCourse({...newCourse, year: Number(e.target.value)})}
                  >
                    {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                  </TextField>
                  <TextField
                    select fullWidth label="Semester"
                    value={newCourse.semester} onChange={(e) => setNewCourse({...newCourse, semester: Number(e.target.value)})}
                  >
                    <MenuItem value={1}>Semester 1</MenuItem>
                    <MenuItem value={2}>Semester 2</MenuItem>
                  </TextField>
                  <TextField
                    select fullWidth label="Assign Instructor (Optional)"
                    value={newCourse.instructorId} onChange={(e) => setNewCourse({...newCourse, instructorId: e.target.value})}
                  >
                    <MenuItem value="">-- Not Assigned --</MenuItem>
                    {faculty.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenAddCourse(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                <Button onClick={handleAddCourse} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: gradients.premium }}>
                  Draft Course
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog open={openEditCourse} onClose={() => { setOpenEditCourse(false); setEditingCourse(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
              <DialogTitle fontWeight={1000}>Edit Course</DialogTitle>
              <DialogContent>
                {editingCourse && (
                  <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField 
                      fullWidth label="Course Code" placeholder="e.g. CS101" 
                      value={editingCourse.code} onChange={(e) => setEditingCourse({...editingCourse, code: e.target.value.toUpperCase()})}
                    />
                    <TextField 
                      fullWidth label="Course Name" placeholder="e.g. Intro to Databases" 
                      value={editingCourse.name} onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                    />
                    <TextField 
                      fullWidth label="Credit Hours" type="number" inputProps={{ min: 1, max: 6 }}
                      value={editingCourse.credits} onChange={(e) => setEditingCourse({...editingCourse, credits: Number(e.target.value)})}
                    />
                    <TextField
                      select fullWidth label="Academic Year"
                      value={editingCourse.year} onChange={(e) => setEditingCourse({...editingCourse, year: Number(e.target.value)})}
                    >
                      {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                    </TextField>
                    <TextField
                      select fullWidth label="Semester"
                      value={editingCourse.semester} onChange={(e) => setEditingCourse({...editingCourse, semester: Number(e.target.value)})}
                    >
                      <MenuItem value={1}>Semester 1</MenuItem>
                      <MenuItem value={2}>Semester 2</MenuItem>
                    </TextField>
                    <TextField
                      select fullWidth label="Assign Instructor (Optional)"
                      value={editingCourse.instructorId || ""} onChange={(e) => setEditingCourse({...editingCourse, instructorId: e.target.value})}
                    >
                      <MenuItem value="">-- Not Assigned --</MenuItem>
                      {faculty.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
                    </TextField>
                  </Stack>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => { setOpenEditCourse(false); setEditingCourse(null); }} sx={{ fontWeight: 800 }}>Cancel</Button>
                <Button onClick={handleUpdateCourse} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: gradients.premium }}>
                  Update Course
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Faculty Roster</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>DEPARTMENTAL STAFF & ASSIGNMENTS</Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {faculty.map((member) => (
                <Grid item xs={12} md={6} lg={4} key={member.id}>
                  <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: gradients.secondary, fontWeight: 900 }}>
                          {member.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={900}>{member.name}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>{member.email}</Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="subtitle2" fontWeight={800} gutterBottom>Current Assignments</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {courses.filter(c => c.instructorId === member.id).map(c => (
                          <Chip key={c.id} label={c.code} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                        ))}
                        {courses.filter(c => c.instructorId === member.id).length === 0 && (
                          <Typography variant="caption" color="text.secondary">No courses assigned yet</Typography>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                        <Button 
                          fullWidth variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}
                          startIcon={<AddIcon />}
                          onClick={() => { setSelectedFaculty(member); setOpenAssignModal(true); }}
                        >
                          Assign Course
                        </Button>
                        <Tooltip title="Reset Password">
                          <IconButton 
                            onClick={() => handleDirectPasswordReset(member.email, member.name)}
                            sx={{ 
                              borderRadius: 2.5, 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                            }}
                          >
                            <LockReset />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Assign Course Modal */}
            <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
              <DialogTitle fontWeight={1000}>Assign Course to {selectedFaculty?.name}</DialogTitle>
              <DialogContent>
                <Typography variant="body2" sx={{ mb: 3 }}>Select a course to link with this instructor. Only department courses are shown.</Typography>
                <Grid container spacing={2}>
                  {courses.map(course => (
                    <Grid item xs={12} key={course.id}>
                      <Button 
                        fullWidth variant="outlined" 
                        sx={{ 
                          justifyContent: 'flex-start', p: 2, borderRadius: 3, textAlign: 'left',
                          borderColor: course.instructorId === selectedFaculty?.id ? alpha('#10b981', 0.5) : 'divider'
                        }}
                        onClick={() => handleAssignCourse(course.id)}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight={900}>{course.code}: {course.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Current: {course.instructorName || "Unassigned"}</Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenAssignModal(false)} sx={{ fontWeight: 800 }}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {activeTab === 4 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Academic Records & Analytics</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>EVALUATE PERFORMANCE & SUBMIT GRADES</Typography>
              </Box>
              <TextField
                select
                label="Filter by Course"
                value={gradingCourseId}
                onChange={(e) => setGradingCourseId(e.target.value)}
                sx={{ minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              >
                {courses.filter(c => c.status === 'active').map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.code}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={900} gutterBottom>Student Gradebook</Typography>
                    {gradingCourseId ? (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                              <TableCell sx={{ fontWeight: 900 }}>ID</TableCell>
                              <TableCell sx={{ fontWeight: 900 }}>Current Grade</TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {gradingEnrollments.map((enr) => (
                              <TableRow key={enr.id}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>{enr.studentName?.[0]}</Avatar>
                                    <Typography variant="body2" fontWeight={700}>{enr.studentName}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell><Typography variant="caption" fontWeight={700}>{enr.studentId?.slice(-5)}</Typography></TableCell>
                                <TableCell>
                                  <Chip 
                                    label={enr.grade || "N/A"} 
                                    size="small"
                                    sx={{ 
                                      fontWeight: 900, 
                                      bgcolor: enr.grade ? alpha('#10b981', 0.1) : 'rgba(255,255,255,0.05)',
                                      color: enr.grade ? '#10b981' : 'text.secondary'
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Button 
                                    size="small" variant="text" sx={{ fontWeight: 900 }}
                                    onClick={() => { setSelectedEnrollment(enr); setOpenGradeModal(true); }}
                                  >
                                    Edit Grade
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography color="text.secondary" fontWeight={700}>Please select a course to view students</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ ...glassStyle, borderRadius: 4, background: gradients.premium, color: 'white' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={1000} gutterBottom>Class Insight</Typography>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="h2" fontWeight={1000} sx={{ letterSpacing: -2 }}>
                        {gradingEnrollments.length > 0 ? (gradingEnrollments.filter(e => e.grade).length / gradingEnrollments.length * 100).toFixed(0) : 0}%
                      </Typography>
                      <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.8, letterSpacing: 1 }}>GRADING COMPLETION</Typography>
                    </Box>
                    <Box sx={{ mt: 5 }}>
                      <Stack spacing={2.5}>
                        {[
                          { label: 'Total Enrolled', value: gradingEnrollments.length },
                          { label: 'Top Performer', value: gradingEnrollments.find(e => e.grade === 'A')?.studentName || 'None' },
                          { label: 'Class Average', value: 'B+' }
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                            <Typography variant="body2" fontWeight={700} sx={{ opacity: 0.7 }}>{item.label}</Typography>
                            <Typography variant="body2" fontWeight={900}>{item.value}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Grade Submission Modal */}
            <Dialog open={openGradeModal} onClose={() => setOpenGradeModal(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
              <DialogTitle fontWeight={1000}>Submit Grade: {selectedEnrollment?.studentName}</DialogTitle>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <TextField
                    select
                    fullWidth
                    label="Final Grade"
                    value={tempGrade}
                    onChange={(e) => setTempGrade(e.target.value)}
                  >
                    {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map(g => (
                      <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenGradeModal(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                <Button 
                  onClick={() => handleUpdateGrade(tempGrade)}
                  variant="contained" 
                  sx={{ borderRadius: 2, fontWeight: 900, background: gradients.premium }}
                >
                  Confirm Submission
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Advising Tab */}
        {activeTab === 5 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Academic Advising</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>STUDENT SUPPORT & GUIDANCE</Typography>
              </Box>
              <Button onClick={() => setOpenAddAdvisor(true)} variant="contained" startIcon={<SupportAgent />} sx={{ borderRadius: 2.5, fontWeight: 900, background: gradients.premium }}>
                Add Advisor
              </Button>
            </Box>
            <Grid container spacing={3}>
              {advisors.map((advisor, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, background: advisor.avatarColor, fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                        {advisor.name[4]}
                      </Avatar>
                      <Typography variant="h6" fontWeight={900}>{advisor.name}</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={700} gutterBottom>{advisor.role}</Typography>
                      <Divider sx={{ my: 2, opacity: 0.1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Assigned Students</Typography>
                        <Chip label={advisor.students} size="small" sx={{ fontWeight: 900, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Next Available</Typography>
                        <Typography variant="caption" fontWeight={900}>{advisor.nextAvailable}</Typography>
                      </Box>
                      <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}>
                        View Waitlist
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {advisors.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 10, ...glassStyle, borderRadius: 4 }}>
                    <SupportAgent sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={800}>No advisors assigned yet</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Resources Tab */}
        {activeTab === 6 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Department Resources</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>FACILITIES & EQUIPMENT MANAGEMENT</Typography>
              </Box>
              <Button onClick={() => setOpenAddResource(true)} variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2.5, fontWeight: 900, background: gradients.success }}>
                Add Resource
              </Button>
            </Box>
            <Grid container spacing={3}>
              {resources.map((resource, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar sx={{ background: resource.status === 'Available' ? gradients.primary : resource.status === 'In Use' ? gradients.warning : gradients.secondary, color: 'white' }}>
                          {resource.type === 'Facility' ? <Business /> : resource.type === 'Equipment' ? <Computer /> : <Assessment />}
                        </Avatar>
                        <Chip 
                          label={resource.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 900, fontSize: '0.65rem',
                            bgcolor: resource.status === 'Available' ? alpha('#10b981', 0.1) : resource.status === 'In Use' ? alpha('#f59e0b', 0.1) : alpha('#ef4444', 0.1),
                            color: resource.status === 'Available' ? '#10b981' : resource.status === 'In Use' ? '#f59e0b' : '#ef4444'
                          }} 
                        />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={900}>{resource.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} gutterBottom>{resource.type}</Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" fontWeight={700}>Utilization</Typography>
                          <Typography variant="caption" fontWeight={900}>{resource.utilization}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={resource.utilization} 
                          sx={{ 
                            height: 6, borderRadius: 3, bgcolor: alpha('#94a3b8', 0.2), 
                            '& .MuiLinearProgress-bar': { borderRadius: 3, background: resource.utilization > 80 ? gradients.warning : gradients.primary } 
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {resources.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 10, ...glassStyle, borderRadius: 4 }}>
                    <Computer sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={800}>No resources tracked yet</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Add Advisor Dialog */}
        <Dialog open={openAddAdvisor} onClose={() => setOpenAddAdvisor(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
          <DialogTitle fontWeight={1000}>Add Academic Advisor</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                fullWidth label="Advisor Name" placeholder="e.g. Dr. Sarah Jenkins" 
                value={newAdvisor.name} onChange={(e) => setNewAdvisor({...newAdvisor, name: e.target.value})}
              />
              <TextField 
                fullWidth label="Role/Title" placeholder="e.g. Senior Advisor" 
                value={newAdvisor.role} onChange={(e) => setNewAdvisor({...newAdvisor, role: e.target.value})}
              />
              <TextField 
                fullWidth label="Next Available (Optional)" placeholder="e.g. Tomorrow 10:00 AM" 
                value={newAdvisor.nextAvailable} onChange={(e) => setNewAdvisor({...newAdvisor, nextAvailable: e.target.value})}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddAdvisor(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
            <Button onClick={handleAddAdvisor} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: gradients.premium }}>
              Add Advisor
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Resource Dialog */}
        <Dialog open={openAddResource} onClose={() => setOpenAddResource(false)} PaperProps={{ sx: { ...glassStyle, borderRadius: 4 } }}>
          <DialogTitle fontWeight={1000}>Add Department Resource</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                fullWidth label="Resource Name" placeholder="e.g. Advanced AI Lab" 
                value={newResource.name} onChange={(e) => setNewResource({...newResource, name: e.target.value})}
              />
              <TextField
                select
                fullWidth
                label="Resource Type"
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
              >
                {['Facility', 'Equipment', 'Infrastructure'].map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddResource(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
            <Button onClick={handleAddResource} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: gradients.success }}>
              Add Resource
            </Button>
          </DialogActions>
        </Dialog>

        {/* Placeholder for other tabs */}
        {[7].includes(activeTab) && (
          <Box sx={{ textAlign: 'center', py: 15, ...glassStyle, borderRadius: 4 }}>
            <Box sx={{ mb: 3 }}>
              {activeTab === 7 && <Settings sx={{ fontSize: 80, color: '#94a3b8' }} />}
            </Box>
            <Typography variant="h4" fontWeight={1000} gutterBottom>Feature Under Development</Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={700}>
              We are working hard to bring this feature to your department portal.
            </Typography>
          </Box>
        )}

        {/* Details Modal */}
        <Dialog 
          open={openDetailsModal} 
          onClose={handleCloseDetails} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: 'none' } }}
        >
          <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={1000}>Applicant Dossier</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>REF: {selectedApp?.id?.slice(0, 8).toUpperCase()}</Typography>
            </Box>
            <IconButton onClick={handleCloseDetails} sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {selectedApp && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: '3rem', bgcolor: gradients.premium }}>
                      {selectedApp.fullName?.[0]}
                    </Avatar>
                    <Typography variant="h6" fontWeight={900}>{selectedApp.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>{selectedApp.email}</Typography>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>CONTACT</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={700}>{selectedApp.phone || "Not Provided"}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>NATIONAL ID</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>{selectedApp.nationalId}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Academic Credentials</Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#6366f1', 0.03) }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>HS GPA</Typography>
                        <Typography variant="h6" fontWeight={900}>{selectedApp.highSchoolGPA}</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#a855f7', 0.03) }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>HS PERCENTAGE</Typography>
                        <Typography variant="h6" fontWeight={900}>{selectedApp.highSchoolPercentage}%</Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Submitted Documents</Typography>
                  <Stack spacing={2}>
                    {[
                      { name: 'National ID Copy', icon: <FileIcon />, status: 'Verified' },
                      { name: 'High School Certificate', icon: <FileIcon />, status: 'Verified' },
                      { name: 'Birth Certificate', icon: <FileIcon />, status: 'Verified' },
                    ].map((doc, i) => (
                      <Box key={i} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }}>{doc.icon}</Avatar>
                          <Typography variant="body2" fontWeight={800}>{doc.name}</Typography>
                        </Box>
                        <Button size="small" variant="text" sx={{ fontWeight: 900 }}>View File</Button>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0 }}>
            {selectedApp?.status === 'pending_dept_review' && (
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Button 
                  fullWidth variant="contained" color="success" onClick={() => { handleApproveDept(selectedApp.id); handleCloseDetails(); }}
                  sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 900, background: gradients.success }}
                >
                  Approve Application
                </Button>
                <Button 
                  fullWidth variant="contained" color="error" onClick={() => { handleRejectDept(selectedApp.id); handleCloseDetails(); }}
                  sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 900, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                >
                  Reject Application
                </Button>
              </Stack>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  </Box>
);
};

export default DepartmentDashboard;
