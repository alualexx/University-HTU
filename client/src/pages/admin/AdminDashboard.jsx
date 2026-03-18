import React from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Drawer, ListItemIcon,
  ListItemButton, Tooltip, Stack, Grid, Typography, Box, Button, List, ListItem, ListItemText, Divider
} from "@mui/material";
import {
  People, School, Book, Assessment, Settings, PersonAdd,
  Logout, Close, Email, Lock, Person, Badge,
  Dashboard as DashboardIcon, Security, Campaign, History,
  Speed, VpnKey, Newspaper, Menu as MenuIcon, Assignment, LockReset, Password, Circle, DarkMode, LightMode
} from "@mui/icons-material";
import {
  collection, query, onSnapshot, doc, addDoc, serverTimestamp, setDoc, updateDoc, deleteDoc, where, orderBy, limit, getDocs
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme, alpha } from "@mui/material/styles";

// Tab Imports
import OverviewTab from "./tabs/OverviewTab";
import ProvisioningTab from "./tabs/ProvisioningTab";
import OTPManagementTab from "./tabs/OTPManagementTab";
import SecurityTab from "./tabs/SecurityTab";
import UserManagementTab from "./tabs/UserManagementTab";
import NewsManagementTab from "./tabs/NewsManagementTab";
import SystemProtocolsTab from "./tabs/SystemProtocolsTab";
import SystemHealthTab from "./tabs/SystemHealthTab";
import AuditLogsTab from "./tabs/AuditLogsTab";
import ApplicationsTab from "./tabs/ApplicationsTab";
import ReportsTab from "./tabs/ReportsTab";
import PasswordResetsTab from "./tabs/PasswordResetsTab";

const neonColors = [
  "#38bdf8", // Sky Blue
  "#34d399", // Soft Emerald
  "#fb7185", // Rose Red
  "#c084fc", // Pastel Purple
  "#fbbf24"  // Amber Yellow
];

const gradients = [
  "linear-gradient(135deg, #0ea5e9 0%, #312e81 100%)", // Deep Ocean
  "linear-gradient(135deg, #10b981 0%, #064e3b 100%)", // Midnight Emerald
  "linear-gradient(135deg, #f43f5e 0%, #881337 100%)", // Dark Rose
  "linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)", // Royal Violet
  "linear-gradient(135deg, #f59e0b 0%, #78350f 100%)", // Burnt Amber
];

const AdminDashboard = () => {
  const { user, logout, registerUserByAdmin, userIp, sendPasswordReset } = useAuth();
  const navigate = useNavigate();

  // Navigation and Layout State
  const [activeTab, setActiveTab] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const glassStyle = {
    background: mode === 'dark' ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: mode === 'dark' ? '0 12px 40px 0 rgba(0, 0, 0, 0.5)' : '0 12px 40px 0 rgba(0, 0, 0, 0.1)',
  };

  // User Creation Dialog State
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", password: "", role: ROLES.STUDENT, studentId: "", year: "", employeeId: "", department: "" });
  const [validation, setValidation] = React.useState({});
  const [creationLoading, setCreationLoading] = React.useState(false);
  const [creationError, setCreationError] = React.useState("");
  const [creationSuccess, setCreationSuccess] = React.useState("");

  // System Settings State
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = React.useState(false);
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

  // Security Log Details State
  const [selectedSecurityLog, setSelectedSecurityLog] = React.useState(null);
  const [openSecurityLogDialog, setOpenSecurityLogDialog] = React.useState(false);

  // News Management State
  const [newsList, setNewsList] = React.useState([]);
  const [newsLoading, setNewsLoading] = React.useState(false);
  const [openNewsDialog, setOpenNewsDialog] = React.useState(false);
  const [editingNews, setEditingNews] = React.useState(null);
  const [newsForm, setNewsForm] = React.useState({
    title: "", content: "", category: "announcement", author: user?.name || "Admin",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min read"
  });

  // Health and Security State
  const [healthData, setHealthData] = React.useState([]);
  const [healthExecuting, setHealthExecuting] = React.useState(null);
  const [vulnerabilityLoading, setVulnerabilityLoading] = React.useState(false);
  const [lastAssessmentReport, setLastAssessmentReport] = React.useState(null);
  const [openReportDialog, setOpenReportDialog] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(null);
  
  const [sessionPersistence, setSessionPersistence] = React.useState(true);
  const [ipWhitelisting, setIpWhitelisting] = React.useState(false);
  const [dbOptimization, setDbOptimization] = React.useState(false);

  // Resource Data State
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);
  const [collegesList, setCollegesList] = React.useState([]);
  const [approvedApplications, setApprovedApplications] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [securityLogs, setSecurityLogs] = React.useState([]);
  const [passwordResetsList, setPasswordResetsList] = React.useState([]);
  const [otpsList, setOtpsList] = React.useState([]);
  const [pendingEntities, setPendingEntities] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  // OTP Management State
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [openOtpDialog, setOpenOtpDialog] = React.useState(false);
  const [otpFormData, setOtpFormData] = React.useState({ type: "COLLEGE_CREATE", targetName: "", targetId: "" });

  // Provisioning State
  const [openProvisionDialog, setOpenProvisionDialog] = React.useState(false);
  const [provisioningEntity, setProvisioningEntity] = React.useState(null);
  const [provisionForm, setProvisionForm] = React.useState({ name: "", email: "", password: "" });
  const [provisionLoading, setProvisionLoading] = React.useState(false);

  const [statsData, setStatsData] = React.useState({ students: 0, faculty: 0, courses: 348, departments: 0 });

  // Fetch Data Effects
  React.useEffect(() => {
    setDataLoading(true);

    const unsubUsers = onSnapshot(query(collection(db, "users")), (snapshot) => {
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      users.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setUsersList(users);
      setStatsData(prev => ({
        ...prev,
        students: users.filter(u => u.role === ROLES.STUDENT).length,
        faculty: users.filter(u => u.role === ROLES.TEACHER || u.role === ROLES.FACULTY).length
      }));
      setDataLoading(false);
    });

    const unsubActivities = onSnapshot(query(collection(db, "activity_logs"), limit(100)), (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setActivities(logs);
    });

    const unsubConfig = onSnapshot(doc(db, "system_config", "settings"), (snap) => {
      if (snap.exists()) setMaintenanceMode(snap.data().maintenanceMode);
    });

    const unsubApps = onSnapshot(query(collection(db, "applications"), where("status", "==", "approved_by_registrar")), (snapshot) => {
      setApprovedApplications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubNews = onSnapshot(query(collection(db, "news"), orderBy("date", "desc")), (snapshot) => {
      setNewsList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubSecurity = onSnapshot(query(collection(db, "security_logs"), limit(50)), (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setSecurityLogs(logs);
    });

    const unsubDeps = onSnapshot(collection(db, "departments"), (snapshot) => {
      const deps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDepartmentsList(deps);
      setStatsData(prev => ({ ...prev, departments: deps.length }));
    });

    const unsubColleges = onSnapshot(collection(db, "colleges"), (snapshot) => {
      setCollegesList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubResets = onSnapshot(collection(db, "password_resets"), (snapshot) => {
      const resets = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      resets.sort((a, b) => (b.requestedAt?.toMillis() || 0) - (a.requestedAt?.toMillis() || 0));
      setPasswordResetsList(resets);
    });

    const unsubOtps = onSnapshot(collection(db, "otps"), (snapshot) => {
      const otps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      otps.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setOtpsList(otps);
    });

    const unsubPendingColleges = onSnapshot(query(collection(db, "colleges"), where("status", "==", "pending_credentials")), (snapshot) => {
      const pending = snapshot.docs.map(d => ({ id: d.id, type: 'college', ...d.data() }));
      setPendingEntities(prev => [...prev.filter(e => e.type !== 'college'), ...pending]);
    });

    const unsubPendingDepts = onSnapshot(query(collection(db, "departments"), where("status", "==", "pending_credentials")), (snapshot) => {
      const pending = snapshot.docs.map(d => ({ id: d.id, type: 'department', ...d.data() }));
      setPendingEntities(prev => [...prev.filter(e => e.type !== 'department'), ...pending]);
    });

    return () => {
      unsubUsers(); unsubActivities(); unsubConfig(); unsubApps(); unsubNews();
      unsubSecurity(); unsubDeps(); unsubColleges(); unsubResets(); unsubOtps();
      unsubPendingColleges(); unsubPendingDepts();
    };
  }, []);

  // Performance Monitoring Simulation
  React.useEffect(() => {
    const generatePoints = () => {
      const now = new Date();
      return Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 20) + 40,
        requests: Math.floor(Math.random() * 500) + 100
      }));
    };
    setHealthData(generatePoints());
    const interval = setInterval(() => {
      setHealthData(prev => [...prev.slice(1), {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + (maintenanceMode ? 5 : 10),
        memory: Math.floor(Math.random() * 20) + 40,
        requests: Math.floor(Math.random() * 500) + (maintenanceMode ? 50 : 100)
      }]);
    }, 5000);
    return () => clearInterval(interval);
  }, [maintenanceMode]);

  // Handler Functions
  const logActivity = async (action, details) => {
    try {
      await addDoc(collection(db, "activity_logs"), {
        action, details, adminName: user?.name, adminEmail: user?.email,
        ipAddress: userIp || "Unknown", timestamp: serverTimestamp(),
        color: action.includes("Delete") ? "#ff003c" : "#00f0ff"
      });
    } catch (err) { console.error("Logging error:", err); }
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const toggleMaintenanceMode = async (status) => {
    setMaintenanceLoading(true);
    try {
      await setDoc(doc(db, "system_config", "settings"), { maintenanceMode: status }, { merge: true });
      setMaintenanceSuccess(status ? "MAINTENANCE_MODE: ENGAGED" : "MAINTENANCE_MODE: DISENGAGED");
      logActivity("System Control", `${status ? 'Engaged' : 'Disengaged'} Maintenance Protocol`);
      setTimeout(() => setMaintenanceSuccess(""), 4000);
    } finally { setMaintenanceLoading(false); }
  };

  const handleToggleSystemFlag = async (label, setter, value) => {
    setter(value);
    logActivity("System Flag", `Toggled ${label} → ${value}`);
  };

  const handleHealthExecute = async (label) => {
    setHealthExecuting(label);
    await new Promise(r => setTimeout(r, 2000));
    setHealthExecuting(null);
    logActivity("Health Sync", `Executed core module: ${label}`);
    alert(`${label} synchronization complete.`);
  };

  const handleReviewApplication = (app) => navigate(`/admin/review/${app.id}`);

  const handleApproveReset = async (req) => {
    try {
      await sendPasswordReset(req.email);
      await updateDoc(doc(db, "password_resets", req.id), { status: "approved", processedBy: user?.name });
      logActivity("Reset Approval", `Approved reset request for ${req.email}`);
    } catch (err) { alert(err.message); }
  };

  const handleRejectReset = async (req) => {
    await updateDoc(doc(db, "password_resets", req.id), { status: "rejected", processedBy: user?.name });
    logActivity("Reset Rejection", `Rejected reset request for ${req.email}`);
  };

  const handleManualCredentialReset = async (email, name) => {
    const newPass = Math.random().toString(36).slice(-10);
    alert(`MANUAL_OVERRIDE: Temporary password for ${name} [${email}] is: ${newPass}`);
  };

  const handleDownloadReport = async (type) => {
    const doc = new jsPDF();
    doc.text(`University Strategic Intelligence Report - ${type}`, 10, 10);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 10, 20);
    doc.save(`HTU-Intelligence-${type}-${Date.now()}.pdf`);
    logActivity("Data Export", `Generated and exported ${type} intelligence report.`);
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setCreationLoading(true);
    try {
      const res = await registerUserByAdmin(formData);
      if (res.success) {
        setCreationSuccess("Identity provisioned successfully.");
        setFormData({ name: "", email: "", password: "", role: ROLES.STUDENT });
        setTimeout(() => setOpenDialog(false), 2000);
      } else { setCreationError(res.error); }
    } finally { setCreationLoading(false); }
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      await addDoc(collection(db, "otps"), {
        ...otpFormData, code, isUsed: false, createdAt: serverTimestamp(), createdBy: user?.email
      });
      setOpenOtpDialog(false);
      logActivity("OTP Creation", `Generated ${otpFormData.type} code: ${code}`);
    } finally { setOtpLoading(false); }
  };

  const handleProvisionEntity = async (e) => {
    e.preventDefault();
    setProvisionLoading(true);
    try {
      const res = await registerUserByAdmin({
        ...provisionForm,
        role: provisioningEntity.type === 'college' ? 'dean' : 'department_head',
        collegeId: provisioningEntity.type === 'college' ? provisioningEntity.id : provisioningEntity.collegeId,
        departmentId: provisioningEntity.type === 'department' ? provisioningEntity.id : null,
      });
      if (res.success) {
        await updateDoc(doc(db, provisioningEntity.type === 'college' ? 'colleges' : 'departments', provisioningEntity.id), {
          status: 'active', provisionedAt: serverTimestamp()
        });
        setOpenProvisionDialog(false);
        logActivity("Provisioning", `Provisioned credentials for ${provisioningEntity.name}`);
      }
    } finally { setProvisionLoading(false); }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setNewsLoading(true);
    try {
      if (editingNews) {
        await updateDoc(doc(db, "news", editingNews.id), { ...newsForm, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "news"), { ...newsForm, date: serverTimestamp() });
      }
      setOpenNewsDialog(false);
    } finally { setNewsLoading(false); }
  };

  const handleExportLogs = () => {
    setExportLoading(true);
    try {
      const pdfDoc = new jsPDF();
      pdfDoc.setFillColor(15, 23, 42);
      pdfDoc.rect(0, 0, 210, 40, 'F');
      pdfDoc.setTextColor(255, 255, 255);
      pdfDoc.setFontSize(22);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("UNIVERSITY OPERATIONAL COMMAND", 20, 20);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text("ADMINISTRATIVE AUDIT LOG EXPORT", 20, 30);
      pdfDoc.setTextColor(15, 23, 42);
      pdfDoc.setFontSize(14);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("ACTIVITY ARCHIVE", 20, 55);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text(`Generated: ${new Date().toLocaleString()}`, 20, 65);
      pdfDoc.text(`Total Records: ${activities.length}`, 20, 71);
      let yPos = 85;
      activities.slice(0, 50).forEach((log) => {
        if (yPos > 270) { pdfDoc.addPage(); yPos = 20; }
        pdfDoc.setFontSize(8);
        pdfDoc.text(log.timestamp?.toDate?.().toLocaleString() || "N/A", 20, yPos);
        pdfDoc.text(log.adminName || "N/A", 65, yPos);
        pdfDoc.text(log.action || "N/A", 105, yPos);
        yPos += 7;
      });
      pdfDoc.save(`UNI_AUDIT_LOG_${Date.now()}.pdf`);
      logActivity("Export", "Generated Administrative Audit Archive PDF");
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleVulnerabilityAssessment = async () => {
    setVulnerabilityLoading(true);
    await new Promise(r => setTimeout(r, 4000));
    setLastAssessmentReport({
      scanId: `SCAN-${Date.now()}`,
      status: "SECURE",
      riskRating: 12,
      firewallIntegrity: "98%",
      vulnerabilities: [
        { vector: "SQL_INJECTION", level: "LOW", description: "All endpoints sanitized.", mitigation: "Regular audit." }
      ]
    });
    setVulnerabilityLoading(false);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastLoading(true);
    try {
      const q = query(collection(db, "system_broadcasts"), where("active", "==", true));
      const existing = await getDocs(q);
      const batchPromises = existing.docs.map(d => updateDoc(doc(db, "system_broadcasts", d.id), { active: false }));
      await Promise.all(batchPromises);

      await addDoc(collection(db, "system_broadcasts"), {
        message: broadcastMessage, type: broadcastType, active: true, createdAt: serverTimestamp()
      });
      setOpenBroadcast(false);
      logActivity("Broadcast", `Sent ${broadcastType} alert: ${broadcastMessage}`);
    } finally { setBroadcastLoading(false); }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <DashboardIcon /> },
    { id: "news", label: "News & Dispatches", icon: <Newspaper /> },
    { id: "users", label: "Identity Central", icon: <People /> },
    { id: "password_resets", label: "Protocol Recovery", icon: <LockReset />, badge: passwordResetsList.filter(r => r.status === "pending").length },
    { id: "applications", label: "Clearance Queue", icon: <Assignment />, badge: approvedApplications.length },
    { id: "reports", label: "Intelligence Reports", icon: <Assessment /> },
    { id: "system", label: "Core Control", icon: <Settings /> },
    { id: "health", label: "Infrastructure Pulse", icon: <Speed /> },
    { id: "audit", label: "Audit Intelligence", icon: <History /> },
    { id: "otp_management", label: "Access Keys", icon: <VpnKey /> },
    { id: "provisioning", label: "Provisioning", icon: <PersonAdd />, badge: pendingEntities.length },
    { id: "security", label: "Cyber Security", icon: <Security /> },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: mode === 'dark' ? "#0a0a0f" : "#f8fafc", minHeight: "100vh" }}>
      {/* Sidebar Component */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? 280 : 88, flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 280 : 88, boxSizing: "border-box", borderRight: "1px solid rgba(255,255,255,0.05)",
            background: mode === 'dark' ? "linear-gradient(180deg, #0f172a 0%, #020617 100%)" : "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            color: "white", transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)", overflowX: "hidden"
          }
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: 'flex', alignItems: 'center', justifyContent: 'center' }}><School /></Box>
          {sidebarOpen && <Typography variant="h6" fontWeight={1000}>ADMIN CORE</Typography>}
        </Box>
        <List sx={{ px: 2, flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 3, py: 1.5,
                  bgcolor: activeTab === item.id ? alpha(theme.palette.primary.main, 0.15) : "transparent",
                  color: activeTab === item.id ? "primary.main" : "rgba(255,255,255,0.6)",
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: activeTab === item.id ? "primary.main" : "inherit" }}>{item.icon}</ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 800, fontSize: "0.85rem" }} />}
                {sidebarOpen && item.badge > 0 && <Chip label={item.badge} size="small" color="error" sx={{ height: 18, fontWeight: 900, fontSize: '0.6rem' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="contained" color="error" startIcon={<Logout />} onClick={handleLogout} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>
            {sidebarOpen ? "Terminate Session" : ""}
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ bgcolor: alpha(theme.palette.divider, 0.05) }}><MenuIcon /></IconButton>
            <Box>
              <Typography variant="h4" fontWeight={900}>{menuItems.find(i => i.id === activeTab)?.label}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>UNIVERSITY OPERATIONAL COMMAND · {new Date().toLocaleDateString()}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton onClick={toggleColorMode} sx={{ bgcolor: 'background.paper' }}>{mode === 'dark' ? <LightMode /> : <DarkMode />}</IconButton>
            <Chip icon={<Circle sx={{ color: '#10b981 !important', fontSize: 10 }} />} label="Operational" sx={{ fontWeight: 900 }} />
          </Box>
        </Box>

        {/* Dynamic Content Rendering */}
        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
          {activeTab === "overview" && (
            <OverviewTab statsData={statsData} healthData={healthData} activities={activities} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "provisioning" && (
            <ProvisioningTab pendingEntities={pendingEntities} openProvisionDialog={openProvisionDialog} setOpenProvisionDialog={setOpenProvisionDialog} provisioningEntity={provisioningEntity} setProvisioningEntity={setProvisioningEntity} provisionForm={provisionForm} setProvisionForm={setProvisionForm} provisionLoading={provisionLoading} handleProvisionEntity={handleProvisionEntity} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "otp_management" && (
            <OTPManagementTab otpsList={otpsList} openOtpDialog={openOtpDialog} setOpenOtpDialog={setOpenOtpDialog} otpFormData={otpFormData} setOtpFormData={setOtpFormData} otpLoading={otpLoading} handleGenerateOTP={handleGenerateOTP} collegesList={collegesList} departmentsList={departmentsList} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "security" && (
            <SecurityTab securityLogs={securityLogs} vulnerabilityLoading={vulnerabilityLoading} handleVulnerabilityAssessment={handleVulnerabilityAssessment} lastAssessmentReport={lastAssessmentReport} openReportDialog={openReportDialog} setOpenReportDialog={setOpenReportDialog} neonColors={neonColors} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "users" && (
            <UserManagementTab usersList={usersList} ROLES={ROLES} setOpenDialog={setOpenDialog} glassStyle={glassStyle} />
          )}
          {activeTab === "news" && (
            <NewsManagementTab newsList={newsList} openNewsDialog={openNewsDialog} setOpenNewsDialog={setOpenNewsDialog} newsForm={newsForm} setNewsForm={setNewsForm} newsLoading={newsLoading} handleSaveNews={handleSaveNews} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "system" && (
            <SystemProtocolsTab maintenanceMode={maintenanceMode} toggleMaintenanceMode={toggleMaintenanceMode} maintenanceSuccess={maintenanceSuccess} sessionPersistence={sessionPersistence} setSessionPersistence={setSessionPersistence} ipWhitelisting={ipWhitelisting} setIpWhitelisting={setIpWhitelisting} dbOptimization={dbOptimization} setDbOptimization={setDbOptimization} handleToggleSystemFlag={handleToggleSystemFlag} handleHealthExecute={handleHealthExecute} setOpenBroadcast={setOpenBroadcast} glassStyle={glassStyle} />
          )}
          {activeTab === "health" && (
            <SystemHealthTab healthData={healthData} healthExecuting={healthExecuting} handleHealthExecute={handleHealthExecute} glassStyle={glassStyle} />
          )}
          {activeTab === "audit" && (
            <AuditLogsTab activities={activities} logSearch={logSearch} setLogSearch={setLogSearch} logFilter={logFilter} setLogFilter={setLogFilter} handleExportLogs={handleExportLogs} exportLoading={exportLoading} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "applications" && (
            <ApplicationsTab applications={approvedApplications} handleReviewApplication={handleReviewApplication} glassStyle={glassStyle} />
          )}
          {activeTab === "reports" && (
            <ReportsTab handleDownloadReport={handleDownloadReport} downloadLoading={reportLoading} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "password_resets" && (
            <PasswordResetsTab passwordResetsList={passwordResetsList} handleApproveReset={handleApproveReset} handleManualCredentialReset={handleManualCredentialReset} handleRejectReset={handleRejectReset} glassStyle={glassStyle} />
          )}
        </Box>
      </Box>

      {/* Global Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Provision Identity</DialogTitle>
        <form onSubmit={handleUserCreation}>
          <DialogContent>
            {creationError && <Alert severity="error" sx={{ mb: 2 }}>{creationError}</Alert>}
            <TextField fullWidth label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} margin="normal" required />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} margin="normal" required />
            <TextField fullWidth label="Initial Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} margin="normal" required />
            <TextField fullWidth select label="Security Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} margin="normal" required>
              {Object.values(ROLES).map(r => <MenuItem key={r} value={r}>{r.toUpperCase()}</MenuItem>)}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)}>Abort</Button>
            <Button type="submit" variant="contained" disabled={creationLoading}>Deploy User</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openBroadcast} onClose={() => setOpenBroadcast(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Global System Broadcast</DialogTitle>
        <form onSubmit={handleSendBroadcast}>
          <DialogContent>
            <TextField fullWidth multiline rows={4} label="Message" value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} margin="normal" required />
            <TextField fullWidth select label="Alert Type" value={broadcastType} onChange={e => setBroadcastType(e.target.value)} margin="normal">
              <MenuItem value="info">Information</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Critical Alert</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenBroadcast(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={broadcastLoading}>Dispatch Alert</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
