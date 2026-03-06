import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Drawer, ListItemIcon,
  ListItemButton, Switch, FormControlLabel, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu
} from "@mui/material";
import {
  People, School, Book, Assessment, Settings, PersonAdd,
  MenuBook, Logout, TrendingUp, Circle, Close, Email, Lock, Person, Badge,
  Dashboard as DashboardIcon, Security, Campaign, Storage, History,
  NotificationsActive, Construction, DarkMode, LightMode, ChevronRight,
  Memory as MemoryIcon, Router as NetworkIcon, Speed, CloudQueue, AssignmentTurnedIn,
  Search, FilterList, MoreVert, Delete, Block, CheckCircle
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell
} from "recharts";
import {
  collection, query, onSnapshot, doc, getDocs, updateDoc, deleteDoc,
  where, orderBy, limit, addDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme } from "@mui/material";

const gradients = [
  "linear-gradient(135deg,#1976d2,#42a5f5)",
  "linear-gradient(135deg,#2e7d32,#66bb6a)",
  "linear-gradient(135deg,#e65100,#ffa726)",
  "linear-gradient(135deg,#6a1b9a,#ba68c8)",
];

const StatCard = ({ label, value, icon, gradient }) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.12)" } }}>
    <Box sx={{ height: 4, background: gradient }} />
    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3 }}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
        <Typography variant="h3" fontWeight={800}>{value}</Typography>
      </Box>
      <Box sx={{ width: 56, height: 56, borderRadius: 2, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user, logout, registerUserByAdmin } = useAuth();
  const navigate = useNavigate();

  // Navigation and Layout State
  const [activeTab, setActiveTab] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  // User Creation Dialog State
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", password: "", role: "student", studentId: "", employeeId: "" });
  const [creationLoading, setCreationLoading] = React.useState(false);
  const [creationError, setCreationError] = React.useState("");
  const [creationSuccess, setCreationSuccess] = React.useState("");

  // System Settings State (Simulated for now)
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [maintenanceSuccess, setMaintenanceSuccess] = React.useState("");

  // Broadcast State
  const [openBroadcast, setOpenBroadcast] = React.useState(false);
  const [broadcastMessage, setBroadcastMessage] = React.useState("");
  const [broadcastType, setBroadcastType] = React.useState("info");
  const [broadcastLoading, setBroadcastLoading] = React.useState(false);

  // User Management State
  const [userSearch, setUserSearch] = React.useState("");
  const [userRoleFilter, setUserRoleFilter] = React.useState("all");
  const [userStatusFilter, setUserStatusFilter] = React.useState("all");
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Audit Log State
  const [logFilter, setLogFilter] = React.useState("all");
  const [logSearch, setLogSearch] = React.useState("");
  const [exportLoading, setExportLoading] = React.useState(false);

  // Real Data State
  const [usersList, setUsersList] = React.useState([]);
  const [approvedApplications, setApprovedApplications] = React.useState([]);
  const [statsData, setStatsData] = React.useState({
    students: 0,
    faculty: 0,
    courses: 0,
    departments: 0
  });
  const [activities, setActivities] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  // Fetching Data from Firestore
  React.useEffect(() => {
    setDataLoading(true);

    // 1. Listen to Users Collection (Removed orderBy for dev compatibility)
    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side
      users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setUsersList(users);

      // Update Stats based on roles
      const stats = {
        students: users.filter(u => u.role === ROLES.STUDENT).length,
        faculty: users.filter(u => u.role === ROLES.TEACHER || u.role === ROLES.FACULTY).length,
        courses: 0,
        departments: 12
      };
      setStatsData(stats);
      setDataLoading(false);
    });

    // 2. Listen to Activities (Removed orderBy for dev compatibility)
    const activitiesQuery = query(collection(db, "activity_logs"), limit(100));
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side by timestamp
      logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setActivities(logs);
    });

    // 3. Listen to System Config (Maintenance Mode)
    const unsubscribeConfig = onSnapshot(doc(db, "system_config", "settings"), (doc) => {
      if (doc.exists()) {
        setMaintenanceMode(doc.data().maintenanceMode);
      }
    });

    // 4. Listen to Approved Applications
    const appsQuery = query(collection(db, "applications"), where("status", "==", "approved_by_registrar"));
    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApprovedApplications(apps);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeActivities();
      unsubscribeConfig();
      unsubscribeApps();
    };
  }, []);

  // Auto-logout non-admins when maintenance mode is enabled
  React.useEffect(() => {
    if (maintenanceMode && user && user.role !== ROLES.ADMIN) {
      logout();
      navigate("/maintenance");
    }
  }, [maintenanceMode, user]);

  const toggleMaintenanceMode = async (status) => {
    try {
      await updateDoc(doc(db, "system_config", "settings"), { maintenanceMode: status });
      logActivity("System Control", `Maintenance mode ${status ? "enabled" : "disabled"}`);
      setMaintenanceSuccess(`System successfully ${status ? "entered" : "exited"} maintenance mode.`);
      setTimeout(() => setMaintenanceSuccess(""), 3000);
    } catch (err) {
      console.error("Error toggling maintenance:", err);
    }
  };

  const logActivity = async (action, details) => {
    try {
      await addDoc(collection(db, "activity_logs"), {
        action,
        details,
        adminName: user?.name,
        adminEmail: user?.email,
        timestamp: serverTimestamp(),
        color: action.includes("Delete") ? "#ef4444" : "#1976d2"
      });
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  const handleToggleUserActive = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { disabled: !currentStatus });
      logActivity("User Status Update", `Toggled status for account ID: ${userId}`);
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const filteredLogs = activities.filter(log => {
    const matchesFilter = logFilter === "all" ||
      (logFilter === "security" && (log.action.includes("Deletion") || log.action.includes("Security"))) ||
      (logFilter === "users" && log.action.includes("User")) ||
      (logFilter === "system" && (log.action.includes("System") || log.action.includes("Broadcast")));

    const matchesSearch = (log.action || "").toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.adminName || "").toLowerCase().includes(logSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleExportLogs = () => {
    setExportLoading(true);
    try {
      const headers = ["Timestamp", "Admin", "Email", "Action", "Details"];
      const rows = filteredLogs.map(log => [
        log.timestamp?.toDate().toLocaleString() || "",
        log.adminName || "N/A",
        log.adminEmail || "N/A",
        log.action,
        log.details
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `uni_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        logActivity("User Deletion", `Deleted user account: ${userId}`);
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === "all" ||
      (userStatusFilter === "active" ? !u.disabled : u.disabled);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenUserMenu = (event, user) => {
    setUserAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseUserMenu = () => {
    setUserAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setCreationError("");
    setCreationSuccess("");
    setFormData({ name: "", email: "", password: "", role: "student", studentId: "", employeeId: "" });
  };

  const handleCloseDialog = () => {
    if (!creationLoading) setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCreationError("");
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setCreationLoading(true);
    setCreationError("");
    setCreationSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setCreationError("Please fill in all required fields.");
      setCreationLoading(false);
      return;
    }

    const result = await registerUserByAdmin(formData);
    if (result.success) {
      setCreationSuccess("User created successfully!");
      setFormData({ name: "", email: "", password: "", role: "student", studentId: "", employeeId: "" });
      setTimeout(() => setOpenDialog(false), 2000);
    } else {
      setCreationError(result.error);
    }
    setCreationLoading(false);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setBroadcastLoading(true);
    try {
      // 1. Deactivate all existing broadcasts
      const q = query(collection(db, "system_broadcasts"), where("active", "==", true));
      const existing = await getDocs(q);
      const batchPromises = existing.docs.map(d => updateDoc(doc(db, "system_broadcasts", d.id), { active: false }));
      await Promise.all(batchPromises);

      // 2. Add new broadcast
      await addDoc(collection(db, "system_broadcasts"), {
        message: broadcastMessage,
        type: broadcastType,
        active: true,
        createdAt: serverTimestamp(),
        author: user?.name || "Admin"
      });

      logActivity("System Broadcast", `New global alert: "${broadcastMessage.substring(0, 30)}..."`);
      setBroadcastMessage("");
      setOpenBroadcast(false);
    } catch (err) {
      console.error("Broadcast error:", err);
    } finally {
      setBroadcastLoading(false);
    }
  };



  // Simulated Health Data
  const [healthData, setHealthData] = React.useState([]);
  React.useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newData = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - (19 - i) * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 20) + 40,
        requests: Math.floor(Math.random() * 100) + 20
      }));
      setHealthData(newData);
    };
    generateData();
    const interval = setInterval(() => {
      setHealthData(prev => {
        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: Math.floor(Math.random() * 30) + (maintenanceMode ? 5 : 10),
          memory: Math.floor(Math.random() * 20) + 40,
          requests: Math.floor(Math.random() * 100) + (maintenanceMode ? 5 : 20)
        }];
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [maintenanceMode]);

  const stats = [
    { label: "Total Students", value: statsData.students, icon: <People sx={{ fontSize: 28 }} />, gradient: gradients[0] },
    { label: "Total Faculty", value: statsData.faculty, icon: <School sx={{ fontSize: 28 }} />, gradient: gradients[1] },
    { label: "Active Courses", value: statsData.courses, icon: <Book sx={{ fontSize: 28 }} />, gradient: gradients[2] },
    { label: "Departments", value: statsData.departments, icon: <Assessment sx={{ fontSize: 28 }} />, gradient: gradients[3] },
  ];

  const recentActivity = [
    { action: "New student registered", time: "2 hours ago", color: "#1976d2" },
    { action: "Course CS301 updated", time: "5 hours ago", color: "#2e7d32" },
    { action: "New faculty added", time: "1 day ago", color: "#e65100" },
    { action: "System backup completed", time: "2 days ago", color: "#6a1b9a" },
  ];

  const quickActions = [
    { label: "Add User", icon: <PersonAdd />, variant: "contained", gradient: gradients[0], action: handleOpenDialog },
    { label: "Manage Courses", icon: <MenuBook />, variant: "outlined" },
    { label: "Manage Users", icon: <People />, variant: "outlined" },
    { label: "Settings", icon: <Settings />, variant: "outlined" },
  ];

  const handleLogout = async () => { await logout(); navigate("/"); };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <DashboardIcon /> },
    { id: "users", label: "User Management", icon: <People /> },
    { id: "applications", label: "Pending Admissions", icon: <AssignmentTurnedIn /> },
    { id: "system", label: "System Control", icon: <Settings /> },
    { id: "health", label: "System Health", icon: <Speed /> },
    { id: "audit", label: "Audit Logs", icon: <Security /> },
  ];

  const renderSidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 4, mb: 2 }}>
        <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: "rgba(255,255,255,0.15)", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Assessment sx={{ color: "white" }} />
          </Box>
          UniAdmin
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.id)}
              selected={activeTab === item.id}
              sx={{
                borderRadius: 2,
                py: 1.5,
                bgcolor: activeTab === item.id ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.15)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } },
              }}
            >
              <ListItemIcon sx={{ color: "rgba(255,255,255,0.7)", minWidth: 44 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={activeTab === item.id ? 700 : 500}>{item.label}</Typography>}
              />
              {activeTab === item.id && <ChevronRight sx={{ fontSize: 18 }} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(255,255,255,0.2)" }}>{(user?.name || "A")[0].toUpperCase()}</Avatar>
          <Box sx={{ maxWidth: 160 }}>
            <Typography variant="body2" fontWeight={700} noWrap>{user?.name || "Administrator"}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }} noWrap>{user?.email}</Typography>
          </Box>
        </Box>
        <Button
          fullWidth startIcon={<Logout />} onClick={handleLogout}
          sx={{ color: "rgba(255,255,255,0.7)", justifyContent: "flex-start", textTransform: "none", "&:hover": { color: "#ff4444" } }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      {renderSidebar()}

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
              {menuItems.find(i => i.id === activeTab)?.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managing University Resource Control Center · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Toggle Interface Color">
              <IconButton onClick={toggleColorMode} sx={{ bgcolor: "background.paper", boxShadow: mode === "light" ? "0 2px 8px rgba(0,0,0,0.05)" : "0 2px 8px rgba(0,0,0,0.3)" }}>
                {mode === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            <Chip
              icon={<Circle sx={{ fontSize: "8px !important", color: "#10b981" }} />}
              label="System Operational"
              sx={{ bgcolor: "#ecfdf5", color: "#065f46", fontWeight: 700, p: 1 }}
            />
          </Box>
        </Box>

        {activeTab === "overview" && (
          <Box>
            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Live Data Insights */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* System Performance Pulse */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden", height: 280 }}>
                  <Box sx={{ p: 2, bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Speed sx={{ color: "#3b82f6" }} />
                      <Typography variant="subtitle2" fontWeight={800}>System Pulse</Typography>
                    </Box>
                    <Chip label="Real-time" size="small" sx={{ height: 20, bgcolor: "#e0e7ff", color: "#4338ca", fontSize: 10, fontWeight: 800 }} />
                  </Box>
                  <Box sx={{ p: 2, height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.1} fill="#3b82f6" />
                        <Area type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} fillOpacity={0.1} fill="#10b981" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* User distribution */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden", height: 280 }}>
                  <Box sx={{ p: 2, bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <People sx={{ color: "#8b5cf6" }} />
                      <Typography variant="subtitle2" fontWeight={800}>User Mix</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Student', count: statsData.students },
                        { name: 'Faculty', count: statsData.faculty },
                        { name: 'Depts', count: statsData.departments }
                      ]}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis hide />
                        <ChartTooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {[...Array(3)].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={gradients[(index + 1) % gradients.length].match(/#[a-fA-F0-9]{6}/g)?.[0] || "#1976d2"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Departmental Load */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden", height: 280 }}>
                  <Box sx={{ p: 2, bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <School sx={{ color: "#f59e0b" }} />
                      <Typography variant="subtitle2" fontWeight={800}>Campus Load</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Eng', val: 78 },
                        { name: 'Arts', val: 56 },
                        { name: 'Med', val: 92 },
                        { name: 'Law', val: 41 }
                      ]}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis hide />
                        <ChartTooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="val" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: "CPU Load", value: `${healthData[healthData.length - 1]?.cpu || 0}%`, color: "#3b82f6" },
                { label: "Memory", value: `${healthData[healthData.length - 1]?.memory || 0}%`, color: "#8b5cf6" },
                { label: "Active IQ", value: `${healthData[healthData.length - 1]?.requests || 0}`, color: "#10b981" },
                { label: "Uptime", value: "12d 4h", color: "#f59e0b" },
              ].map((m, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 1.5, display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: m.color, borderRadius: 2 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>{m.label}</Typography>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1 }}>{m.value}</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                  <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="h6" fontWeight={700}>System Activity</Typography>
                    <Button variant="text" size="small" endIcon={<ChevronRight />}>View All</Button>
                  </Box>
                  <List disablePadding>
                    {activities.length > 0 ? activities.map((activity, i) => (
                      <React.Fragment key={i}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: activity.color || "#1976d2", mr: 2 }} />
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600}>{activity.action}</Typography>}
                            secondary={
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="caption" color="text.secondary">{activity.details}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {i < activities.length - 1 && <Divider />}
                      </React.Fragment>
                    )) : (
                      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                        No recent activity found.
                      </Box>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3, background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 100%)", color: "white" }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>Administrative shortcuts and system overrides.</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                      onClick={handleOpenDialog} variant="contained" fullWidth startIcon={<PersonAdd />}
                      sx={{ bgcolor: "white", color: "#0d2b6e", fontWeight: 700, borderRadius: 2, py: 1.5, "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}
                    >
                      New User
                    </Button>
                    <Button
                      variant="outlined" fullWidth startIcon={<Campaign />} onClick={() => setOpenBroadcast(true)}
                      sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", fontWeight: 700, borderRadius: 2, py: 1.5, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
                    >
                      Broadcast
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === "users" && (
          <Box>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              <Box sx={{ p: 4, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>University Registry</Typography>
                    <Typography variant="body2" color="text.secondary">Manage system access and roles.</Typography>
                  </Box>
                  <Button onClick={handleOpenDialog} variant="contained" startIcon={<PersonAdd />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                    Add New User
                  </Button>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                  <TextField
                    size="small"
                    placeholder="Search name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
                  />
                  <TextField
                    select
                    size="small"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FilterList fontSize="small" /></InputAdornment> }}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value={ROLES.STUDENT}>Students</MenuItem>
                    <MenuItem value={ROLES.TEACHER}>Teachers</MenuItem>
                    <MenuItem value={ROLES.REGISTRAR}>Registrars</MenuItem>
                    <MenuItem value={ROLES.ADMIN}>Admins</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    sx={{ width: 140, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Box>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, letterSpacing: 1 }}>IDENTIFICATION</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, letterSpacing: 1 }}>ROLE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, letterSpacing: 1 }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, letterSpacing: 1 }}>JOINED</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", fontSize: 11, letterSpacing: 1 }}>MANAGEMENT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length > 0 ? filteredUsers.map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color={row.disabled ? "error" : "success"}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontSize: 16 }}>{row.name?.[0]}</Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{row.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.role}
                            size="small"
                            variant="outlined"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 700,
                              borderRadius: 1.5,
                              fontSize: 11,
                              color: row.role === 'admin' ? '#ef4444' : (row.role === 'teacher' ? '#3b82f6' : '#10b981'),
                              borderColor: row.role === 'admin' ? '#fee2e2' : (row.role === 'teacher' ? '#dbeafe' : '#d1fae5'),
                              bgcolor: row.role === 'admin' ? '#fef2f2' : (row.role === 'teacher' ? '#eff6ff' : '#f0fdf4')
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: row.disabled ? "#ef4444" : "#10b981" }} />
                            <Typography variant="caption" fontWeight={700} color={row.disabled ? "error" : "success"}>
                              {row.disabled ? "Inactive" : "Active"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={500} color="text.secondary">
                            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={row.disabled ? "Activate Account" : "Deactivate Account"}>
                            <IconButton size="small" onClick={() => handleToggleUserActive(row.id, row.disabled)} sx={{ color: row.disabled ? "success.main" : "warning.main" }}>
                              {row.disabled ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Permanently">
                            <IconButton size="small" onClick={() => handleDeleteUser(row.id)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Typography variant="body2" color="text.secondary">No users found matching your search criteria.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        )}

        {activeTab === "system" && (
          <Box maxWidth="md">
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", mb: 3 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Construction sx={{ color: "primary.main" }} /> Critical Controls
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Advanced system flags that affect all portal users globally.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", p: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="#991b1b">Maintenance Mode</Typography>
                      <Typography variant="body2" color="text.secondary">Prevents all non-admin logins and shows a maintenance screen on the homepage.</Typography>
                      {maintenanceSuccess && <Typography variant="caption" color="success.main" fontWeight={700}>{maintenanceSuccess}</Typography>}
                    </Box>
                    <Switch color="error" checked={maintenanceMode} onChange={(e) => toggleMaintenanceMode(e.target.checked)} />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", p: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="#075985">Global Broadcast</Typography>
                      <Typography variant="body2" color="text.secondary">Send a real-time notification banner to all active portal users.</Typography>
                    </Box>
                    <Button variant="contained" color="info" onClick={() => setOpenBroadcast(true)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                      Send Broadcast
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", p: 3, bgcolor: "background.default", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="#1e1b4b">Database Backups</Typography>
                      <Typography variant="body2" color="text.secondary">Manual trigger for full Firestore snapshot and storage backup.</Typography>
                    </Box>
                    <Button variant="contained" color="primary" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Trigger Backup</Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === "health" && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: "CPU Usage", value: `${healthData[healthData.length - 1]?.cpu}%`, icon: <MemoryIcon />, color: "#3b82f6", detail: "4 Cores active" },
                { label: "Memory", value: `${healthData[healthData.length - 1]?.memory}%`, icon: <CloudQueue />, color: "#8b5cf6", detail: "3.2GB / 8GB" },
                { label: "Network", value: "84ms", icon: <NetworkIcon />, color: "#10b981", detail: "Stable" },
                { label: "Uptime", value: "14d 6h", icon: <Speed />, color: "#f59e0b", detail: "No restarts" },
              ].map((m, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: m.color + "15", color: m.color }}>{m.icon}</Box>
                      <Chip label="Live" size="small" sx={{ height: 20, bgcolor: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 800 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={800}>{m.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{m.label}</Typography>
                    <Typography variant="caption" sx={{ color: m.color, fontWeight: 700 }}>{m.detail}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>Resource Usage Over Time</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip label="CPU" size="small" variant="outlined" sx={{ borderColor: "#3b82f6", color: "#3b82f6" }} />
                  <Chip label="Memory" size="small" variant="outlined" sx={{ borderColor: "#8b5cf6", color: "#8b5cf6" }} />
                </Box>
              </Box>
              <Box sx={{ p: 3, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <ChartTooltip
                      contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === "audit" && (
          <Box>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              <Box sx={{ p: 4, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>Security Audit Trail</Typography>
                  <Typography variant="body2" color="text.secondary">Detailed logs of all administrative operations.</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    size="small" placeholder="Search logs..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                    sx={{ width: 200, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    select size="small" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
                    sx={{ width: 150, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <MenuItem value="all">All Actions</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="users">User Mgmt</MenuItem>
                    <MenuItem value="system">System Control</MenuItem>
                  </TextField>
                  <Button
                    variant="outlined" startIcon={<Storage />} onClick={handleExportLogs} disabled={exportLoading}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <List disablePadding>
                  <ListItem sx={{ bgcolor: "background.default", py: 1.5, px: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={2}><Typography variant="caption" fontWeight={800} color="text.secondary">TIME</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption" fontWeight={800} color="text.secondary">ADMIN</Typography></Grid>
                      <Grid item xs={3}><Typography variant="caption" fontWeight={800} color="text.secondary">ACTION</Typography></Grid>
                      <Grid item xs={4}><Typography variant="caption" fontWeight={800} color="text.secondary">DETAILS</Typography></Grid>
                    </Grid>
                  </ListItem>

                  {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                    <ListItem key={i} divider sx={{ py: 2, px: 3, "&:hover": { bgcolor: "action.hover" } }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {log.timestamp?.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" fontWeight={700}>{log.adminName}</Typography>
                          <Typography variant="caption" color="text.secondary">{log.adminEmail}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Chip
                            label={log.action} size="small"
                            sx={{
                              bgcolor: log.color + "15", color: log.color,
                              fontWeight: 700, borderRadius: 1.5, border: `1px solid ${log.color}40`
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">{log.details}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  )) : (
                    <Box sx={{ p: 8, textAlign: "center" }}>
                      <History sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                      <Typography color="text.secondary">No matching logs found.</Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === "applications" && (
          <Box>


            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              <Box sx={{ p: 4, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>Pending Admissions ({approvedApplications.length})</Typography>
                  <Typography variant="body2" color="text.secondary">Applications approved by Registrar — create portal accounts here.</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                {approvedApplications.length > 0 ? (
                  <Grid container spacing={2}>
                    {approvedApplications.map((app) => (
                      <Grid item xs={12} md={6} key={app.id}>
                        <Card variant="outlined" sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>{app.name?.[0]}</Avatar>
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" fontWeight={800} noWrap>{app.name}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>{app.email}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              <Chip
                                label={app.studentId || 'HTU-ID Pending'}
                                size="small"
                                sx={{
                                  fontWeight: 800, fontFamily: 'monospace',
                                  bgcolor: '#e0e7ff', color: '#3730a3',
                                  border: '1px solid #c7d2fe'
                                }}
                              />
                              <Chip
                                label={app.intendedMajor || 'N/A'}
                                size="small" variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            <Button
                              fullWidth variant="contained" size="small"
                              startIcon={<PersonAdd />}
                              sx={{
                                borderRadius: 2, textTransform: 'none', fontWeight: 700,
                                background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
                                '&:hover': { background: 'linear-gradient(135deg, #1565c0, #0d2b6e)' }
                              }}
                              onClick={() => navigate(`/admin/create-account/${app.id}`)}
                            >
                              Create Portal Account
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ p: 8, textAlign: "center" }}>
                    <AssignmentTurnedIn sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                    <Typography color="text.secondary">No approved applications pending admission.</Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        )}

        {/* Dialogs */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800 }}>
            Create New User
            <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
          </DialogTitle>
          <form onSubmit={handleUserCreation}>
            <DialogContent>
              {creationError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{creationError}</Alert>}
              {creationSuccess && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{creationSuccess}</Alert>}

              <TextField
                fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Initial Password" name="password" type="password" value={formData.password} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
              />
              <TextField
                fullWidth select label="Role" name="role" value={formData.role} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value={ROLES.STUDENT}>Student</MenuItem>
                <MenuItem value={ROLES.TEACHER}>Teacher</MenuItem>
                <MenuItem value={ROLES.FACULTY}>Faculty</MenuItem>
                <MenuItem value={ROLES.REGISTRAR}>Registrar</MenuItem>
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              </TextField>

              {formData.role === ROLES.STUDENT && (
                <TextField
                  fullWidth label="Student ID (Optional)" name="studentId" value={formData.studentId} onChange={handleInputChange} margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
                />
              )}
              {(formData.role === ROLES.TEACHER || formData.role === ROLES.FACULTY) && (
                <TextField
                  fullWidth label="Employee ID (Optional)" name="employeeId" value={formData.employeeId} onChange={handleInputChange} margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
                />
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} sx={{ fontWeight: 600, textTransform: "none" }}>Cancel</Button>
              <Button
                type="submit" variant="contained" disabled={creationLoading}
                sx={{ borderRadius: 2.5, px: 4, fontWeight: 700, textTransform: "none", background: "linear-gradient(135deg, #1976d2, #6a1b9a)" }}
              >
                {creationLoading ? <CircularProgress size={24} color="inherit" /> : "Create User"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openBroadcast} onClose={() => setOpenBroadcast(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>Global Broadcast</DialogTitle>
          <form onSubmit={handleSendBroadcast}>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This message will be displayed as a banner on top of the portal for all logged-in users.
              </Typography>
              <TextField
                fullWidth label="Message" multiline rows={3} value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)} required margin="normal"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth select label="Alert Type" value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value)} margin="normal"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="info">Information (Blue)</MenuItem>
                <MenuItem value="warning">Warning (Orange)</MenuItem>
                <MenuItem value="error">Critical (Red)</MenuItem>
                <MenuItem value="success">Success (Green)</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenBroadcast(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={broadcastLoading} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
                {broadcastLoading ? <CircularProgress size={24} color="inherit" /> : "Send Now"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      </Box>
    </Box>
  );
};

export default AdminDashboard;
