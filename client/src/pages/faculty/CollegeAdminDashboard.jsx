import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, Divider, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Tabs, Tab, Fade, Paper, LinearProgress, useTheme, Tooltip,
  Stack, Badge, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Collapse, Slide, Select, FormControl, InputLabel, alpha,
  Drawer, List, ListItem, ListItemText, CircularProgress
} from "@mui/material";
import {
  AccountBalance, Description, Assessment, Groups, CalendarMonth, 
  MonetizationOn, Email, MoreVert, ArrowForward, Security, Password,
  Add, PieChart as PieChartIcon, BarChart as BarChartIcon,
  Dashboard, Business, People, School, CalendarToday,
  MenuBook, Logout, LightMode, DarkMode, AssignmentInd
} from "@mui/icons-material";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from "recharts";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { db } from "../../services/Firebase";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  addDoc, serverTimestamp, getDocs, deleteDoc, orderBy, limit
} from "firebase/firestore";

// --- Custom Hooks ---
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (!end || start === end) return;
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

const StatCard = ({ stat, glassStyle }) => {
  const count = useCountUp(stat.value);
  return (
    <Card sx={{
      ...glassStyle,
      borderRadius: 6,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: `0 24px 48px ${alpha(stat.color, 0.15)}` }
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: alpha(stat.color, 0.12), color: stat.color, width: 52, height: 52, boxShadow: `0 8px 16px ${alpha(stat.color, 0.1)}` }}>
            {stat.icon}
          </Avatar>
          <Chip size="small" label={stat.trend} sx={{ fontWeight: 1000, bgcolor: alpha(stat.color, 0.1), color: stat.color, fontSize: '0.65rem', border: `1px solid ${alpha(stat.color, 0.2)}` }} />
        </Box>
        <Typography variant="h3" fontWeight={1000} sx={{ mb: 0.5, letterSpacing: -1, fontFamily: 'Outfit, sans-serif' }}>{count}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>{stat.label}</Typography>
      </CardContent>
    </Card>
  );
};

const CollegeAdminDashboard = () => {
  const { user, logout, logAuditActivity, verifyOTP, markOTPUsed } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const { t } = useLanguage();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [college, setCollege] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: "", code: "", faculty: "", color: "#6366f1" });
  const [deptOtp, setDeptOtp] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDark = mode === 'dark';

  const glassStyle = {
    background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
    boxShadow: isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)' : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  };

  useEffect(() => {
    if (!user?.email) return;

    // Fetch the college assigned to this Dean
    const collegeQuery = query(collection(db, "colleges"), where("deanEmail", "==", user.email));
    const unsubCollege = onSnapshot(collegeQuery, (snapshot) => {
      if (!snapshot.empty) {
        const collegeData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setCollege(collegeData);
        
        // Fetch departments for this college
        const deptsQuery = query(collection(db, "departments"), where("collegeId", "==", collegeData.id));
        const unsubDepts = onSnapshot(deptsQuery, (deptSnapshot) => {
          const depts = deptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDepartments(depts);
          
          // Real Data Integration: Fetch students and faculty belonging to these departments
          const deptNames = depts.map(d => d.name);
          if (deptNames.length > 0) {
            // Fetch Students
            // Use simple queries to avoid index requirements
            const studentsQuery = query(collection(db, "users"), where("department", "in", deptNames));
            const unsubStudents = onSnapshot(studentsQuery, (sSnap) => {
              // Filter by role in memory
              const students = sSnap.docs.filter(doc => doc.data().role === ROLES.STUDENT);
              setStudentsCount(students.length);
            });

            // Fetch Faculty
            const facultyQuery = query(collection(db, "users"), where("department", "in", deptNames));
            const unsubFaculty = onSnapshot(facultyQuery, (fSnap) => {
              // Filter by role in memory
              const faculty = fSnap.docs.filter(doc => ["faculty", ROLES.TEACHER].includes(doc.data().role));
              setFacultyCount(faculty.length);
              setFacultyList(faculty.map(d => ({ id: d.id, ...d.data() })));
            });

            return () => {
              unsubStudents();
              unsubFaculty();
            }
          }
          setLoading(false);
        });
        return () => unsubDepts();
      } else if (user.email === "dean@university.edu") {
        // Demo Fallback for College Administrator
        setCollege({
          id: "demo-college-id",
          name: "College of Engineering & Technology",
          deanName: "James Moriarty",
          deanEmail: "dean@university.edu",
          description: "The leading faculty for Engineering, Technology, and Applied Sciences.",
          location: "Block B, Main Campus",
          color: "#6d28d9",
          status: "active"
        });
        setDepartments([
          { id: "dept-1", name: "Software Engineering", code: "SE", faculty: "Engineering", color: "#6366f1" },
          { id: "dept-2", name: "Computer Science", code: "CS", faculty: "Science", color: "#10b981" },
          { id: "dept-3", name: "Electrical Engineering", code: "EE", faculty: "Engineering", color: "#f59e0b" }
        ]);
        setFacultyList([
          { id: "f1", name: "Dr. Sarah Connor", email: "s.connor@university.edu", role: "faculty", department: "Software Engineering", status: "active" },
          { id: "f2", name: "Prof. Charles Xavier", email: "c.xavier@university.edu", role: "faculty", department: "Computer Science", status: "active" },
          { id: "f3", name: "Dr. Bruce Banner", email: "b.banner@university.edu", role: "faculty", department: "Electrical Engineering", status: "on_leave" }
        ]);
        setStudentsCount(450);
        setFacultyCount(32);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubCollege();
  }, [user?.email]);

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!college) return;
    setDeptLoading(true);

    try {
      const otpResult = await verifyOTP(deptOtp, "DEPARTMENT_CREATE");
      if (!otpResult.success) {
        alert(otpResult.message);
        setDeptLoading(false);
        return;
      }

      if (otpResult.data.targetName.toLowerCase() !== deptForm.name.toLowerCase()) {
        if (!window.confirm(`Warning: This OTP was issued for "${otpResult.data.targetName}", but you are creating "${deptForm.name}". Proceed?`)) {
          setDeptLoading(false);
          return;
        }
      }

      await addDoc(collection(db, "departments"), {
        ...deptForm,
        collegeId: college.id,
        parentCollege: college.name,
        createdAt: serverTimestamp(),
        createdByDean: user.name
      });

      await markOTPUsed(otpResult.otpId);
      logAuditActivity("Department Creation", `Dean created dept: ${deptForm.name} for ${college.name}`);
      setOpenDeptDialog(false);
      setDeptForm({ name: "", code: "", faculty: "", color: "#6366f1" });
      setDeptOtp("");
    } catch (err) {
      console.error("Error saving department:", err);
      alert("Failed to create department.");
    } finally {
      setDeptLoading(false);
    }
  };

  const navItems = [
    { label: t("overview"), icon: <Dashboard />, index: 0 },
    { label: t("departments"), icon: <Business />, index: 1 },
    { label: t("academicReports"), icon: <Assessment />, index: 2 },
    { label: t("collegeFaculty"), icon: <People />, index: 3 },
    { label: t("academicCalendar"), icon: <CalendarToday />, index: 4 },
    { label: t("budgetOverview"), icon: <AccountBalance />, index: 5 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: isDark ? '#0f172a' : '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!college) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4">No College Assigned</Typography>
        <Typography color="text.secondary">You are not registered as a Dean of any college.</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>Go Home</Button>
      </Box>
    );
  }

  const stats = [
    { label: t("departments"), value: departments.length, icon: <Business />, color: "#6366f1", trend: "+2 this year" },
    { label: t("totalStudents"), value: studentsCount, icon: <People />, color: "#10b981", trend: "+12%" },
    { label: t("facultyMembers"), value: facultyCount, icon: <School />, color: "#f59e0b", trend: t("stable") },
    { label: t("researchRate"), value: "88%", icon: <Assessment />, color: "#ec4899", trend: "+5.4%" },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 280 : 80,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 280 : 80,
            boxSizing: 'border-box',
            borderRight: 'none',
            background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden'
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: college.color || 'primary.main', width: 40, height: 40, borderRadius: 2 }}>
            <School />
          </Avatar>
          {sidebarOpen && (
            <Box>
              <Typography variant="subtitle2" fontWeight={1000} sx={{ lineHeight: 1.2 }}>{college.name}</Typography>
              <Typography variant="caption" color="text.secondary">{t("collegeAdminDashboard")}</Typography>
            </Box>
          )}
        </Box>

        <List sx={{ px: 2, mt: 4 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => setActiveTab(item.index)}
              sx={{
                mb: 1, borderRadius: 3,
                bgcolor: activeTab === item.index ? alpha(college.color || theme.palette.primary.main, 0.1) : 'transparent',
                color: activeTab === item.index ? (college.color || 'primary.main') : 'text.secondary',
                px: 2, py: 1.5,
                transition: '0.2s',
                '&:hover': { bgcolor: alpha(college.color || theme.palette.primary.main, 0.05) }
              }}
            >
              <Box sx={{ mr: 2, display: 'flex' }}>{item.icon}</Box>
              {sidebarOpen && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeTab === item.index ? 1000 : 700, fontSize: '0.9rem' }} />}
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 3 }}>
          <Button
            fullWidth
            startIcon={<Logout />}
            variant="outlined"
            onClick={logout}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, color: 'error.main', borderColor: alpha(theme.palette.error.main, 0.2) }}
          >
            {sidebarOpen ? t("terminateSession") : ""}
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -100, left: '10%', width: 400, height: 400, background: `radial-gradient(circle, ${alpha(college.color || '#6366f1', 0.15)} 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: 0 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1 }}>
              {navItems[activeTab].label}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {t("welcomeDean")} {user.name} • {t("governing")} {college.name}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <LanguageSwitcher variant="icon" />
             <IconButton onClick={toggleColorMode} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Badge variant="dot" color="error" overlap="circular">
              <Avatar sx={{ cursor: 'pointer', border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>{user.name?.[0]}</Avatar>
            </Badge>
          </Stack>
        </Box>

        {activeTab === 0 && (
          <Fade in timeout={800}>
            <Box>
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {stats.map((stat, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <StatCard stat={stat} glassStyle={glassStyle} alpha={alpha} />
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={4}>
                 <Grid item xs={12} md={8}>
                  <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                      <Typography variant="h6" fontWeight={1000}>{t("deptGrowthMatrix")}</Typography>
                      <Button variant="text" size="small" sx={{ fontWeight: 1000 }}>{t("analyticsHub")}</Button>
                    </Box>
                    <Box sx={{ height: 350 }}>
                       <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', val: 4000 },
                          { name: 'Feb', val: 3000 },
                          { name: 'Mar', val: 2000 },
                          { name: 'Apr', val: 2780 },
                          { name: 'May', val: 1890 },
                          { name: 'Jun', val: 2390 },
                        ]}>
                          <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={college.color || '#6366f1'} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={college.color || '#6366f1'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                          <YAxis hide />
                          <RechartsTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
                          <Area type="monotone" dataKey="val" stroke={college.color || '#6366f1'} strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                   <Card sx={{ ...glassStyle, borderRadius: 6, p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight={1000} sx={{ mb: 3 }}>{t("globalIntelligence")}</Typography>
                      <List sx={{ p: 0 }}>
                        {[
                          { title: "Budget Audit v2.4", time: "2h ago", icon: <AccountBalance />, color: "#3b82f6" },
                          { title: "Faculty Review Session", time: "5h ago", icon: <AssignmentInd />, color: "#8b5cf6" },
                          { title: "Curriculum Synergy", time: "Yesterday", icon: <MenuBook />, color: "#f59e0b" }
                        ].map((notif, i) => (
                          <ListItem key={i} sx={{ px: 0, py: 2, borderBottom: i < 2 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none' }}>
                            <Avatar sx={{ bgcolor: alpha(notif.color, 0.1), color: notif.color, mr: 2, borderRadius: 2 }}>{notif.icon}</Avatar>
                            <ListItemText 
                              primary={notif.title} 
                              secondary={notif.time} 
                              primaryTypographyProps={{ fontWeight: 900, fontSize: '0.85rem' }} 
                              secondaryTypographyProps={{ fontWeight: 700, fontSize: '0.75rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Button fullWidth variant="outlined" sx={{ mt: 'auto', borderRadius: 3, fontWeight: 1000, textTransform: 'none' }}>{t("viewAllProtocols")}</Button>
                   </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 1 && (
          <Fade in timeout={800}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h5" fontWeight={1000}>{t("academicDepartments") || "Academic Departments"}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={700}>Manage existing sectors or initialize new structural units.</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={() => setOpenDeptDialog(true)}
                  sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, bgcolor: college.color || 'primary.main', boxShadow: `0 8px 24px ${alpha(college.color || '#6366f1', 0.25)}` }}
                >
                  {t("initializeDept")}
                </Button>
              </Box>

              <Grid container spacing={3}>
                {departments.map((dept) => (
                  <Grid item xs={12} sm={6} md={4} key={dept.id}>
                    <Card sx={{ 
                      ...glassStyle, borderRadius: 5, p: 3, 
                      position: 'relative', overflow: 'visible',
                      transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }
                    }}>
                      <Chip label={dept.code} size="small" sx={{ mb: 1, bgcolor: alpha(dept.color || '#6366f1', 0.1), color: dept.color || '#6366f1', fontWeight: 1000 }} />
                      <Typography variant="h6" fontWeight={1000}>{dept.name}</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mt: 1 }}>{dept.faculty}</Typography>
                      
                      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 1000 }}>Metrics</Button>
                        <Button variant="outlined" color="primary" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 1000 }}>Configure</Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 2 && (
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>{t("academicReports")}</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                    <Typography variant="h6" fontWeight={1000} sx={{ mb: 4 }}>Student Performance Distribution</Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'GPA 3.5-4.0', value: 35 },
                              { name: 'GPA 3.0-3.5', value: 45 },
                              { name: 'GPA 2.5-3.0', value: 15 },
                              { name: 'GPA < 2.5', value: 5 },
                            ]}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                          >
                            <Cell fill="#6366f1" />
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Legend verticalAlign="bottom" height={36}/>
                          <RechartsTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                    <Typography variant="h6" fontWeight={1000} sx={{ mb: 4 }}>Credit Hour Completion</Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Freshman', val: 95 },
                          { name: 'Sophomore', val: 88 },
                          { name: 'Junior', val: 82 },
                          { name: 'Senior', val: 91 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <RechartsTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
                          <Bar dataKey="val" fill={college.color || '#6366f1'} radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 3 && (
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>{t("collegeFaculty")}</Typography>
              <TableContainer component={Paper} sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha(college.color || '#6366f1', 0.05) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 1000 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 1000 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 1000 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 1000 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 1000 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facultyList.map((faculty) => (
                      <TableRow key={faculty.id} sx={{ '&:hover': { bgcolor: alpha(college.color || '#6366f1', 0.02) } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(college.color || '#6366f1', 0.1), color: college.color || 'primary.main', fontSize: '0.8rem', fontWeight: 1000 }}>
                              {faculty.name?.[0]}
                            </Avatar>
                            <Typography fontWeight={800}>{faculty.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{faculty.department}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{faculty.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={faculty.status || 'active'} 
                            size="small" 
                            sx={{ 
                              fontWeight: 1000, 
                              fontSize: '0.7rem',
                              bgcolor: faculty.status === 'active' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1),
                              color: faculty.status === 'active' ? '#10b981' : '#f59e0b'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Email fontSize="small" /></IconButton>
                          <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        )}

        {activeTab === 4 && (
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>{t("academicCalendar")}</Typography>
              <Grid container spacing={3}>
                {[
                  { date: "Oct 12", event: "Mid-Term Assessment Cycle", type: "Academic" },
                  { date: "Oct 25", event: "Faculty Research Symposium", type: "Research" },
                  { date: "Nov 02", event: "Q4 Budget Review", type: "Administrative" },
                  { date: "Nov 15", event: "Student Projects Exhibition", type: "Event" }
                ].map((item, i) => (
                  <Grid item xs={12} key={i}>
                    <Paper sx={{ ...glassStyle, p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ bgcolor: alpha(college.color || '#6366f1', 0.1), p: 2, borderRadius: 3, textAlign: 'center', minWidth: 80 }}>
                        <Typography variant="h6" fontWeight={1000} color={college.color || 'primary'}>{item.date.split(' ')[1]}</Typography>
                        <Typography variant="caption" fontWeight={900}>{item.date.split(' ')[0]}</Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={900}>{item.event}</Typography>
                        <Chip label={item.type} size="small" sx={{ mt: 1, fontWeight: 800, fontSize: '0.7rem' }} />
                      </Box>
                      <IconButton><ArrowForward /></IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 5 && (
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ mb: 4 }}>{t("budgetOverview")}</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                    <Typography variant="h6" fontWeight={1000} sx={{ mb: 4 }}>Resource Allocation</Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Research', val: 45000 },
                          { name: 'Faculty', val: 120000 },
                          { name: 'Infrastructure', val: 75000 },
                          { name: 'Events', val: 15000 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <RechartsTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
                          <Bar dataKey="val" fill={college.color || '#6366f1'} radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ ...glassStyle, borderRadius: 6, p: 4, bgcolor: alpha(college.color || '#6366f1', 0.05) }}>
                    <Typography variant="h6" fontWeight={1000} sx={{ mb: 2 }}>Current Liquidity</Typography>
                    <Typography variant="h3" fontWeight={1000} sx={{ mb: 1 }}>$248,500</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>Remaining Fiscal Balance</Typography>
                    <Divider sx={{ my: 3 }} />
                    <Button fullWidth variant="contained" sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>Request Fund Allocation</Button>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Create Dept Dialog */}
        <Dialog open={openDeptDialog} onClose={() => setOpenDeptDialog(false)} PaperProps={{ sx: { borderRadius: 5, ...glassStyle, maxWidth: 450 } }}>
          <DialogTitle sx={{ fontWeight: 1000, textAlign: 'center', pt: 4 }}>{t("deptInitialized")}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontWeight: 700 }}>
              {t("deptParams")}
            </Typography>
            <Stack spacing={2.5}>
              <TextField 
                label={t("deptFullName")} fullWidth 
                value={deptForm.name} onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    label={t("deptCode")} fullWidth 
                    value={deptForm.code} onChange={(e) => setDeptForm({...deptForm, code: e.target.value})}
                    InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    label={t("hexColor")} fullWidth 
                    value={deptForm.color} onChange={(e) => setDeptForm({...deptForm, color: e.target.value})}
                    InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
                  />
                </Grid>
              </Grid>
              <TextField 
                label={t("facultyGroup")} fullWidth 
                value={deptForm.faculty} onChange={(e) => setDeptForm({...deptForm, faculty: e.target.value})}
                InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
              />
              <Divider sx={{ my: 1 }}>
                <Chip label={t("authorization")} size="small" sx={{ fontWeight: 1000, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }} />
              </Divider>
              <TextField 
                label={t("adminOtpCode")} fullWidth required
                placeholder="X-X-X-X-X-X"
                value={deptOtp} onChange={(e) => setDeptOtp(e.target.value.toUpperCase())}
                InputProps={{ 
                  sx: { borderRadius: 3, fontWeight: 1000, textAlign: 'center', letterSpacing: 4 },
                  startAdornment: <Password sx={{ mr: 1, opacity: 0.5 }} />
                }}
              />
              <Alert icon={<Security fontSize="small" />} severity="warning" sx={{ borderRadius: 3, fontWeight: 900, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                {t("creationRequires")}
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setOpenDeptDialog(false)} sx={{ fontWeight: 1000, textTransform: 'none' }}>{t("cancel")}</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveDept}
              disabled={deptLoading || !deptForm.name || !deptOtp}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, px: 4, bgcolor: college.color || 'primary.main' }}
            >
              {deptLoading ? <CircularProgress size={20} /> : t("finalizeProtocol")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CollegeAdminDashboard;
