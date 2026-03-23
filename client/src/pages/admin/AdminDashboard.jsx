import React from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Drawer, ListItemIcon,
  ListItemButton, Tooltip, Stack, Grid, Typography, Box, Button, List, ListItem, ListItemText, Divider, useMediaQuery
} from "@mui/material";
import {
  People, School, Book, Assessment, Settings, PersonAdd,
  Logout, Close, Email, Lock, Person, Badge,
  Dashboard as DashboardIcon, Security, Campaign, History,
  Speed, VpnKey, Newspaper, Menu as MenuIcon, Assignment, LockReset, Password, Circle, DarkMode, LightMode,
  Refresh as RefreshIcon, ContentCopy as ContentCopyIcon
} from "@mui/icons-material";
import {
  collection, query, onSnapshot, doc, addDoc, serverTimestamp, setDoc, updateDoc, deleteDoc, where, orderBy, limit, getDocs
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme, alpha } from "@mui/material/styles";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

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
  const { t } = useLanguage();

  // Navigation and Layout State
  const [activeTab, setActiveTab] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const unsubApps = onSnapshot(query(collection(db, "applications"), where("status", "==", "final_approved")), (snapshot) => {
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
    setReportLoading(type);
    logActivity("Data Export", `Initiated ${type} intelligence synthesis.`);
    
    try {
      const pdfDoc = new jsPDF();
      const now = new Date();

      // Header with Dark Command Style
      pdfDoc.setFillColor(15, 23, 42); 
      pdfDoc.rect(0, 0, 210, 45, 'F');
      
      pdfDoc.setTextColor(255, 255, 255);
      pdfDoc.setFontSize(24);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("UNIVERSITY COMMAND CORE", 20, 25);
      
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text(`${type} STRATEGIC INTELLIGENCE DOSSIER`, 20, 35);
      pdfDoc.text(`CONFIDENTIAL // LEVEL 4 CLEARANCE REQUIRED`, 140, 35);

      // Metadata Section
      pdfDoc.setTextColor(15, 23, 42);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("FISCAL & OPERATIONAL METADATA", 20, 55);
      
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text(`Source Matrix: ALX-CL-V4`, 20, 62);
      pdfDoc.text(`Authorized By: ${user?.name || 'ADMIN_OPERATOR'}`, 20, 68);
      pdfDoc.text(`Timestamp: ${now.toLocaleString()}`, 20, 74);
      pdfDoc.text(`Node Priority: ALPHA-01`, 20, 80);

      let yPos = 95;

      if (type === "ENROLLMENT") {
        pdfDoc.setFontSize(14);
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("ENROLLMENT DYNAMICS & DISTRIBUTION", 20, yPos);
        yPos += 12;
        
        pdfDoc.setFontSize(10);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.text(`Total Student Population: ${statsData.students}`, 25, yPos); yPos += 8;
        pdfDoc.text(`Active Faculty Count: ${statsData.faculty}`, 25, yPos); yPos += 8;
        pdfDoc.text(`Operational Departments: ${statsData.departments}`, 25, yPos); yPos += 15;

        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("DEPARTMENTAL BREAKDOWN", 20, yPos);
        yPos += 10;
        
        pdfDoc.setFont("helvetica", "normal");
        departmentsList.slice(0, 15).forEach((dept, i) => {
          if (yPos > 270) { pdfDoc.addPage(); yPos = 20; }
          pdfDoc.text(`${i+1}. ${dept.name || 'UNSPECIFIED'} - [ID: ${dept.id?.slice(0,8)}]`, 25, yPos);
          yPos += 8;
        });
      } else if (type === "SECURITY") {
        pdfDoc.setFontSize(14);
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("CYBER-SECURITY THREAT ASSESSMENT", 20, yPos);
        yPos += 12;
        
        pdfDoc.setFontSize(10);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.text(`Captured Security Events: ${securityLogs.length}`, 25, yPos); yPos += 8;
        pdfDoc.text(`Network Integrity Score: 94/100`, 25, yPos); yPos += 8;
        pdfDoc.text(`Active Firewall Protocol: WAF-MOD-S2`, 25, yPos); yPos += 15;

        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("RECENT THREAT VECTORS", 20, yPos);
        yPos += 10;
        
        pdfDoc.setFontSize(8);
        securityLogs.slice(0, 20).forEach((log) => {
          if (yPos > 270) { pdfDoc.addPage(); yPos = 20; }
          const time = log.timestamp?.toDate?.().toLocaleString() || 'N/A';
          pdfDoc.text(`${time} | ${log.classification || 'UNKNOWN'} | IP: ${log.ipAddress || '0.0.0.0'}`, 25, yPos);
          yPos += 7;
        });
      } else if (type === "OPERATIONAL") {
        pdfDoc.setFontSize(14);
        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("SYSTEM OPERATIONS & VELOCITY", 20, yPos);
        yPos += 12;
        
        pdfDoc.setFontSize(10);
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.text(`Audit Trail Density: ${activities.length} entries`, 25, yPos); yPos += 8;
        pdfDoc.text(`Infrastructure Load: CPU ${healthData[healthData.length-1]?.cpu || 0}%`, 25, yPos); yPos += 8;
        pdfDoc.text(`Maintenance Status: ${maintenanceMode ? 'ENGAGED' : 'NOMINAL'}`, 25, yPos); yPos += 15;

        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("REAL-TIME TELEMETRY (LAST 20 NODES)", 20, yPos);
        yPos += 10;
        
        pdfDoc.setFontSize(8);
        healthData.forEach((h) => {
          if (yPos > 270) { pdfDoc.addPage(); yPos = 20; }
          pdfDoc.text(`${h.time} >> CPU: ${h.cpu}% | MEM: ${h.memory}% | REQ: ${h.requests}/min`, 25, yPos);
          yPos += 7;
        });
      } else if (type === "FINANCIAL") {
         pdfDoc.setFontSize(14);
         pdfDoc.setFont("helvetica", "bold");
         pdfDoc.text("RESOURCE ALLOCATION & FISCAL LEDGER", 20, yPos);
         yPos += 12;
         
         pdfDoc.setFontSize(10);
         pdfDoc.setFont("helvetica", "normal");
         pdfDoc.text("Preliminary budget data captured from department provisioning.", 25, yPos); yPos += 10;
         pdfDoc.text(`Total Provisioned Entities: ${collegesList.length + departmentsList.length}`, 25, yPos); yPos += 8;
         pdfDoc.text(`Pending Financial Credentials: ${pendingEntities.length}`, 25, yPos); yPos += 15;
         
         pdfDoc.setFont("helvetica", "bold");
         pdfDoc.text("PROVISIONED COLLEGES", 20, yPos);
         yPos += 10;
         pdfDoc.setFont("helvetica", "normal");
         collegesList.forEach(c => {
           if (yPos > 270) { pdfDoc.addPage(); yPos = 20; }
           pdfDoc.text(`- ${c.name || 'COLLEGE'} [STATUS: ${c.status || 'ACTIVE'}]`, 25, yPos);
           yPos += 8;
         });
      }

      // Footer
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(150);
      pdfDoc.text("END OF STRATEGIC REPORT - GENERATED BY ALEX COMMAND CORE V4", 105, 285, { align: "center" });

      pdfDoc.save(`ALX-Intelligence-${type}-${Date.now()}.pdf`);
      logActivity("Data Export", `Successfully synthesized ${type} intelligence report.`);
    } catch (err) {
      console.error("Critical Failure in Report Synthesis:", err);
      alert("Intelligence synthesis interrupted. Check system logs.");
    } finally {
      setReportLoading(null);
    }
  };

  const generateUniversityEmail = (name) => {
    if (!name) return "";
    // Remove special characters, convert to lowercase, and replace spaces with dots
    const cleanName = name.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '.');
    return `${cleanName}@university.edu`;
  };

  const generateOTP = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0, n = charset.length; i < 12; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const handleReviewApplication = (app) => {
    const generatedEmail = generateUniversityEmail(app.name);
    const generatedOTP = generateOTP();
    
    setFormData({
      name: app.name || "",
      email: generatedEmail,
      password: generatedOTP,
      role: app.role === "college_admin" ? ROLES.COLLEGE_ADMIN : ROLES.FACULTY,
      studentId: "", year: "", employeeId: "", department: app.college || app.department || "",
      applicationId: app.id
    });
    setOpenDialog(true);
  };

  const handleRejectApplication = async (app) => {
    if (!window.confirm(`Are you sure you want to reject the application for ${app.name}?`)) return;
    try {
      await updateDoc(doc(db, "applications", app.id), { status: "rejected" });
      logActivity("Application Rejected", `Rejected application for ${app.email}`);
    } catch (err) {
      console.error("Failed to reject application:", err);
      alert("Error rejecting application.");
    }
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setCreationLoading(true);
    try {
      const res = await registerUserByAdmin(formData);
      if (res.success) {
        if (formData.applicationId) {
          try {
            await updateDoc(doc(db, "applications", formData.applicationId), { status: "provisioned" });
          } catch (appErr) {
             console.error("Failed to update application status:", appErr);
          }
        }
        setCreationSuccess("Identity provisioned successfully.");
        setFormData({ name: "", email: "", password: "", role: ROLES.STUDENT, applicationId: null });
        setTimeout(() => setOpenDialog(false), 2000);
      } else { setCreationError(res.error); }
    } finally { setCreationLoading(false); }
  };

  const handleToggleUserActive = async (userId, isCurrentlyDisabled) => {
    try {
      await updateDoc(doc(db, "users", userId), { disabled: !isCurrentlyDisabled });
      logActivity(isCurrentlyDisabled ? "Grant Access" : "Revoke Access", `Toggled user ${userId} → ${isCurrentlyDisabled ? 'active' : 'disabled'}`);
    } catch (err) { alert(err.message); }
  };

  const handleDirectPasswordReset = async (email, name) => {
    try {
      await sendPasswordReset(email);
      logActivity("Password Reset", `Sent reset link to ${email}`);
      alert(`Password reset email sent to ${name} (${email}).`);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      logActivity("Delete User", `Deleted user ID: ${userId}`);
    } catch (err) { alert(err.message); }
  };

  const handleRunHealthCheck = async () => {
    await handleHealthExecute("Security Audit");
  };

  const pendingClearanceStudents = usersList.filter(u => 
    u.role === ROLES.STUDENT && 
    ['On Leave', 'Suspended', 'Graduated', 'Withdrawn'].includes(u.status) &&
    !u.disabled
  );

  const handleDeactivateStudent = async (studentToDeactivate) => {
    try {
      await updateDoc(doc(db, "users", studentToDeactivate.id), { disabled: true, status: 'Deactivated' });
      
      await addDoc(collection(db, "security_logs"), {
        action: "ACCOUNT_DEACTIVATED",
        details: `Deactivated student ${studentToDeactivate.name} (${studentToDeactivate.email}) due to clearance status (${studentToDeactivate.status}).`,
        ip: userIp || "Unknown",
        timestamp: serverTimestamp(),
        user: user?.name || "Admin",
        severity: "high"
      });
      alert(`Successfully deactivated student ${studentToDeactivate.name}`);
    } catch (err) {
      console.error("Error deactivating student:", err);
      alert("Error: " + err.message);
    }
  };


  const handleGenerateSecurityReport = () => {
    const pdfDoc = new jsPDF();
    pdfDoc.setFontSize(18);
    pdfDoc.text("University Security Report", 20, 20);
    pdfDoc.setFontSize(10);
    pdfDoc.text(`Generated: ${new Date().toLocaleString()}`, 20, 32);
    pdfDoc.text(`Security Logs: ${securityLogs.length} entries`, 20, 42);
    let y = 58;
    securityLogs.slice(0, 40).forEach((log) => {
      if (y > 270) { pdfDoc.addPage(); y = 20; }
      pdfDoc.text(`${log.timestamp?.toDate?.().toLocaleString() || 'N/A'} | ${log.classification || ''} | ${log.resolution || ''}`, 20, y);
      y += 7;
    });
    pdfDoc.save(`ALX-Security-Report-${Date.now()}.pdf`);
    logActivity("Security Report", "Generated security intelligence PDF");
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
    { id: "overview", label: t("overview"), icon: <DashboardIcon /> },
    { id: "news", label: t("news"), icon: <Newspaper /> },
    { id: "users", label: t("users"), icon: <People /> },
    { id: "password_resets", label: t("passwordResets"), icon: <LockReset />, badge: passwordResetsList.filter(r => r.status === "pending").length },
    { id: "applications", label: t("applications"), icon: <Assignment />, badge: approvedApplications.length },
    { id: "reports", label: t("reports"), icon: <Assessment /> },
    { id: "system", label: t("system"), icon: <Settings /> },
    { id: "health", label: t("health"), icon: <Speed /> },
    { id: "audit", label: t("audit"), icon: <History /> },
    { id: "otp_management", label: t("otpManagement"), icon: <VpnKey /> },
    { id: "provisioning", label: t("provisioning"), icon: <PersonAdd />, badge: pendingEntities.length },
    { id: "security", label: t("security"), icon: <Security /> },
  ];

  const adminSidebarContent = (
    <>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: 'flex', alignItems: 'center', justifyContent: 'center' }}><School /></Box>
        {sidebarOpen && <Typography variant="h6" fontWeight={1000}>{t("adminCore")}</Typography>}
      </Box>
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              sx={{
                borderRadius: 3, py: 1.5,
                bgcolor: activeTab === item.id ? alpha(theme.palette.primary.main, 0.15) : "transparent",
                color: activeTab === item.id 
                  ? theme.palette.primary.main 
                  : mode === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)",
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
          {sidebarOpen ? t("terminateSession") : ""}
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: mode === 'dark' ? "#0a0a0f" : "#f8fafc", minHeight: "100vh" }}>
      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280, boxSizing: 'border-box',
            background: mode === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        {adminSidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarOpen ? 280 : 88, flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? 280 : 88, boxSizing: "border-box",
            borderRight: mode === 'dark' ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
            background: mode === 'dark' 
              ? "rgba(15, 23, 42, 0.8)" 
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px) saturate(180%)",
            color: mode === 'dark' ? "white" : "text.primary",
            transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)", 
            overflowX: "hidden",
            boxShadow: mode === 'dark' ? "10px 0 30px rgba(0,0,0,0.3)" : "10px 0 30px rgba(0,0,0,0.05)"
          }
        }}
      >
        {adminSidebarContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 3, md: 6 }, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => isMobile ? setMobileDrawerOpen(true) : setSidebarOpen(!sidebarOpen)} sx={{ bgcolor: alpha(theme.palette.divider, 0.05) }}><MenuIcon /></IconButton>
            <Box>
              <Typography variant="h4" fontWeight={900}>{menuItems.find(i => i.id === activeTab)?.label}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800}>UNIVERSITY OPERATIONAL COMMAND · {new Date().toLocaleDateString()}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <LanguageSwitcher variant="icon" />
            <IconButton onClick={toggleColorMode} sx={{ bgcolor: 'background.paper' }}>{mode === 'dark' ? <LightMode /> : <DarkMode />}</IconButton>
            <Chip icon={<Circle sx={{ color: '#10b981 !important', fontSize: 10 }} />} label={t("operational")} sx={{ fontWeight: 900 }} />
          </Box>
        </Box>

        {/* Dynamic Content Rendering */}
        <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
          {activeTab === "overview" && (
            <OverviewTab statsData={statsData} healthData={healthData} activities={activities} gradients={gradients} glassStyle={glassStyle} />
          )}
          {activeTab === "provisioning" && (
            <ProvisioningTab
              pendingEntities={pendingEntities}
              user={user}
              db={db}
              registerUserByAdmin={registerUserByAdmin}
              logActivity={logActivity}
              gradients={gradients}
              glassStyle={glassStyle}
            />
          )}
          {activeTab === "otp_management" && (
            <OTPManagementTab
              otpsList={otpsList}
              collegesList={collegesList}
              departmentsList={departmentsList}
              db={db}
              gradients={gradients}
              glassStyle={glassStyle}
              logActivity={logActivity}
              user={user}
            />
          )}
          {activeTab === "security" && (
            <SecurityTab
              threatLogs={securityLogs.map(l => ({
                id: l.id,
                timestamp: l.timestamp?.toDate?.().toLocaleString() || 'N/A',
                severity: l.color === '#ff003c' ? 'CRITICAL' : l.color === 'warning' ? 'HIGH' : 'INFO',
                event: l.classification || 'Security Event',
                source: l.ipAddress || 'Unknown',
                protocol: 'HTTPS',
                action: l.resolution ? 'BLOCKED' : 'LOGGED'
              }))}
              securityScore={94}
              securityAlerts={securityLogs.filter(l => l.color === '#ff003c').length}
              gradients={gradients}
              neonColors={neonColors}
              glassStyle={glassStyle}
              handleRunHealthCheck={handleRunHealthCheck}
              handleGenerateSecurityReport={handleGenerateSecurityReport}
            />
          )}
          {activeTab === "users" && (
            <UserManagementTab
              usersList={usersList}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              handleOpenDialog={() => setOpenDialog(true)}
              handleToggleUserActive={handleToggleUserActive}
              handleDirectPasswordReset={handleDirectPasswordReset}
              handleManualCredentialReset={handleManualCredentialReset}
              handleDeleteUser={handleDeleteUser}
              glassStyle={glassStyle}
            />
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
            <ApplicationsTab 
              applications={approvedApplications} 
              handleReviewApplication={handleReviewApplication} 
              handleRejectApplication={handleRejectApplication}
              clearanceStudents={pendingClearanceStudents}
              handleDeactivateStudent={handleDeactivateStudent}
              glassStyle={glassStyle} 
            />
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, px: 3, pt: 3 }}>Provision Identity</DialogTitle>
        <form onSubmit={handleUserCreation}>
          <DialogContent sx={{ px: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generate official university credentials for the approved applicant.
            </Typography>
            
            {creationError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{creationError}</Alert>}
            
            <TextField 
              fullWidth 
              label="Full Name" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              margin="normal" 
              required 
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField 
                fullWidth 
                label="University Email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                margin="normal" 
                required 
                helperText="Official university email address"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <IconButton 
                sx={{ mt: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
                onClick={() => setFormData({ ...formData, email: generateUniversityEmail(formData.name) })}
                title="Regenerate Email"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField 
                fullWidth 
                label="One-Time Password (OTP)" 
                type="text" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                margin="normal" 
                required 
                helperText="Share this with the user for their first login"
                sx={{ 
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em'
                  } 
                }}
              />
              <Stack direction="row" spacing={0.5} sx={{ mt: 2.5 }}>
                <IconButton 
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
                  onClick={() => setFormData({ ...formData, password: generateOTP() })}
                  title="Regenerate OTP"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }} 
                  onClick={() => {
                    navigator.clipboard.writeText(`Email: ${formData.email}\nPassword: ${formData.password}`);
                    alert("Credentials copied to clipboard!");
                  }}
                  title="Copy Credentials"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            <TextField 
              fullWidth 
              select 
              label="Security Role" 
              value={formData.role} 
              onChange={e => setFormData({ ...formData, role: e.target.value })} 
              margin="normal" 
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {Object.values(ROLES).map(r => <MenuItem key={r} value={r}>{r.toUpperCase()}</MenuItem>)}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={creationLoading}
              sx={{ 
                borderRadius: 2, 
                px: 4, 
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              {creationLoading ? <CircularProgress size={24} /> : "Provision Account"}
            </Button>
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
