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
  People, School, Book, Assignment, CheckCircle, PersonAdd,
  Logout, ArrowForward, LightMode, DarkMode, Search, FilterList,
  MoreVert, Notifications, Dashboard, LibraryBooks, SwapHoriz,
  Assessment, TrendingUp, Info, AccountCircle, Email, Phone,
  CalendarToday, Business, Warning, CheckCircleOutline, Cancel,
  AssignmentInd, ExpandMore, ExpandLess, Close, Print,
  Edit, Delete, Add, Schedule, Class, CreditCard, Newspaper, Campaign, AccountBalance, Forum, AccessTime,
  Menu as MenuIcon, ChevronLeft, ChevronRight, MenuBook, Circle, FormatQuote, LockReset, Password, Security
}
from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { db } from "../../services/Firebase";
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

const StatCard = ({ stat, glassStyle, alpha }) => {
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
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [college, setCollege] = useState(null);
  const [departments, setDepartments] = useState([]);
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
          setDepartments(deptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
        return () => unsubDepts();
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
    { label: "Overview", icon: <Dashboard />, index: 0 },
    { label: "Departments", icon: <Business />, index: 1 },
    { label: "Academic Reports", icon: <Assessment />, index: 2 },
    { label: "College Faculty", icon: <People />, index: 3 },
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
    { label: "Departments", value: departments.length, icon: <Business />, color: "#6366f1", trend: "+2 this year" },
    { label: "Total Students", value: 450, icon: <People />, color: "#10b981", trend: "+12%" },
    { label: "Faculty Members", value: 32, icon: <School />, color: "#f59e0b", trend: "Stable" },
    { label: "Research Rate", value: "88%", icon: <Assessment />, color: "#ec4899", trend: "+5.4%" },
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
              <Typography variant="caption" color="text.secondary">College Admin Panel</Typography>
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
            {sidebarOpen ? "Terminate Session" : ""}
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
              Welcome, Dean {user.name} • Governing {college.name}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
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
                      <Typography variant="h6" fontWeight={1000}>Department Growth Matrix</Typography>
                      <Button variant="text" size="small" sx={{ fontWeight: 1000 }}>Analytics Hub</Button>
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
                      <Typography variant="h6" fontWeight={1000} sx={{ mb: 3 }}>Global Intelligence</Typography>
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
                      <Button fullWidth variant="outlined" sx={{ mt: 'auto', borderRadius: 3, fontWeight: 1000, textTransform: 'none' }}>View All Protocols</Button>
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
                  <Typography variant="h5" fontWeight={1000}>Academic Departments</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={700}>Manage existing sectors or initialize new structural units.</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={() => setOpenDeptDialog(true)}
                  sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, bgcolor: college.color || 'primary.main', boxShadow: `0 8px 24px ${alpha(college.color || '#6366f1', 0.25)}` }}
                >
                  Initialize Department
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

        {/* Create Dept Dialog */}
        <Dialog open={openDeptDialog} onClose={() => setOpenDeptDialog(false)} PaperProps={{ sx: { borderRadius: 5, ...glassStyle, maxWidth: 450 } }}>
          <DialogTitle sx={{ fontWeight: 1000, textAlign: 'center', pt: 4 }}>Initialize Department</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontWeight: 700 }}>
              Specify department parameters and provide an authorized Admin OTP code.
            </Typography>
            <Stack spacing={2.5}>
              <TextField 
                label="Department Full Name" fullWidth 
                value={deptForm.name} onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    label="Dept Code" fullWidth 
                    value={deptForm.code} onChange={(e) => setDeptForm({...deptForm, code: e.target.value})}
                    InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    label="Hex Color" fullWidth 
                    value={deptForm.color} onChange={(e) => setDeptForm({...deptForm, color: e.target.value})}
                    InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
                  />
                </Grid>
              </Grid>
              <TextField 
                label="Faculty Group" fullWidth 
                value={deptForm.faculty} onChange={(e) => setDeptForm({...deptForm, faculty: e.target.value})}
                InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
              />
              <Divider sx={{ my: 1 }}>
                <Chip label="AUTHORIZATION" size="small" sx={{ fontWeight: 1000, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }} />
              </Divider>
              <TextField 
                label="Admin OTP Code" fullWidth required
                placeholder="X-X-X-X-X-X"
                value={deptOtp} onChange={(e) => setDeptOtp(e.target.value.toUpperCase())}
                InputProps={{ 
                  sx: { borderRadius: 3, fontWeight: 1000, textAlign: 'center', letterSpacing: 4 },
                  startAdornment: <Password sx={{ mr: 1, opacity: 0.5 }} />
                }}
              />
              <Alert icon={<Security fontSize="small" />} severity="warning" sx={{ borderRadius: 3, fontWeight: 900, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                Creation requires high-level administrative clearance (DEPARTMENT_CREATE).
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setOpenDeptDialog(false)} sx={{ fontWeight: 1000, textTransform: 'none' }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveDept}
              disabled={deptLoading || !deptForm.name || !deptOtp}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, px: 4, bgcolor: college.color || 'primary.main' }}
            >
              {deptLoading ? <CircularProgress size={20} /> : "Finalize Protocol"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CollegeAdminDashboard;
