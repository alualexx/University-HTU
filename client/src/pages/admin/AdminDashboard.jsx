import React from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Drawer, ListItemIcon,
  ListItemButton, Tooltip, Stack, Grid, Typography, Box, Button, List, ListItem, ListItemText, Divider, useMediaQuery, Collapse
} from "@mui/material";
import {
  People, School, Book, Assessment, Settings, PersonAdd,
  Logout, Close, Email, Lock, Person, Badge,
  Dashboard as DashboardIcon, Security, Campaign, History,
  Speed, VpnKey, Newspaper, Menu as MenuIcon, Assignment, LockReset, Password, Circle, DarkMode, LightMode,
  Refresh as RefreshIcon, ContentCopy as ContentCopyIcon, ExpandMore, ExpandLess, Key as KeyIcon,
  AccountTree, Event, Grade, Paid, Extension, Hub, Payments
} from "@mui/icons-material";
import { useAuth, ROLES } from "../../context/AuthContext";
import {
  usersAPI,
  activityLogsAPI,
  securityLogsAPI,
  systemAPI,
  applicationsAPI,
  announcementsAPI,
  collegesAPI,
  departmentsAPI,
  coursesAPI,
  otpsAPI,
  passwordResetsAPI,
  systemBroadcastsAPI
} from "../../services/api";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme, alpha } from "@mui/material/styles";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import { db } from "../../services/Firebase";

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
import AcademicStructureTab from "./tabs/AcademicStructureTab";
import AcademicCalendarTab from "./tabs/AcademicCalendarTab";
import GradingConfigTab from "./tabs/GradingConfigTab";
import FinancialConfigTab from "./tabs/FinancialConfigTab";
import IntegrationsTab from "./tabs/IntegrationsTab";

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
  const [passwordGroupOpen, setPasswordGroupOpen] = React.useState(false);
  const [academicGroupOpen, setAcademicGroupOpen] = React.useState(false);
  const [financeGroupOpen, setFinanceGroupOpen] = React.useState(false);
  const [systemGroupOpen, setSystemGroupOpen] = React.useState(false);
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
  const [healthExecuting, setHealthExecuting] = React.useState(null);
  const [healthData, setHealthData] = React.useState([]);
  const [serverHealth, setServerHealth] = React.useState({ cpu: 0, memory: 0, uptime: '0h', requests: 0, memoryUsedMB: 0, memoryTotalMB: 0, courseCount: 0 });
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

  const [statsData, setStatsData] = React.useState({ students: 0, faculty: 0, courses: 0, departments: 0, admins: 0 });

  // Fetch Data Effects
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          activitiesRes,
          configRes,
          appsRes,
          newsRes,
          securityRes,
          depsRes,
          collegesRes,
          otpsRes
        ] = await Promise.all([
          usersAPI.getAll(),
          activityLogsAPI.getAll(),
          systemAPI.getSettings('settings').catch(() => ({ data: { maintenanceMode: false } })),
          applicationsAPI.getAll({ status: 'approved_by_dept,registrar_approved' }),
          announcementsAPI.getAll(),
          securityLogsAPI.getAll(),
          departmentsAPI.getAll(),
          collegesAPI.getAll(),
          otpsAPI.getAll()
        ]);

        const users = usersRes.data;
        setUsersList(users);
        // Fetch real course count in parallel
        let courseCount = 0;
        try { const cRes = await coursesAPI.getAll(); courseCount = cRes.data?.length || 0; } catch (_) { }
        setStatsData(prev => ({
          ...prev,
          students: users.filter(u => u.role === ROLES.STUDENT).length,
          faculty: users.filter(u => u.role === ROLES.TEACHER || u.role === ROLES.FACULTY).length,
          admins: users.filter(u => u.role === ROLES.ADMIN || u.role === 'admin').length,
          courses: courseCount
        }));

        setActivities(activitiesRes.data);
        setMaintenanceMode(configRes.data.maintenanceMode || false);
        setApprovedApplications(appsRes.data);
        setNewsList(newsRes.data);
        setSecurityLogs(securityRes.data);

        const deps = depsRes.data;
        setDepartmentsList(deps);
        setStatsData(prev => ({ ...prev, departments: deps.length }));

        const cols = collegesRes.data;
        setCollegesList(cols);

        const pendingCols = cols.filter(c => c.status === 'pending').map(c => ({ ...c, type: 'college', id: c._id || c.id }));
        const pendingDeps = deps.filter(d => d.status === 'pending').map(d => ({ ...d, type: 'department', id: d._id || d.id }));
        const pendingStudents = users.filter(u => u.admissionStatus === 'pending_admin_provision').map(u => ({ ...u, type: 'student', id: u._id || u.id }));
        setPendingEntities([...pendingCols, ...pendingDeps, ...pendingStudents]);

        const resetsRes = await passwordResetsAPI.getAll();
        setPasswordResetsList(resetsRes.data);

        setOtpsList(otpsRes.data);

        setDataLoading(false);
      } catch (err) {
        console.error("Data fetch error:", err);
        setDataLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  // Fetch real server health metrics every 30s
  React.useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await systemAPI.getHealth();
        const h = res.data;
        setServerHealth(h);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setHealthData(prev => {
          const point = { time: now, cpu: h.cpu, memory: h.memory, requests: h.requests };
          if (prev.length === 0) {
            // Seed with 20 copies of first real reading so chart renders immediately
            return Array.from({ length: 20 }, (_, i) => ({
              ...point,
              time: new Date(Date.now() - (19 - i) * 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
          }
          return [...prev.slice(-19), point];
        });
      } catch (err) {
        console.warn('Health fetch failed:', err.message);
      }
    };
    fetchHealth();
    const healthInterval = setInterval(fetchHealth, 30000);
    return () => clearInterval(healthInterval);
  }, []);



  // Handler Functions
  const logActivity = async (action, details) => {
    try {
      await activityLogsAPI.create({
        action, details, adminName: user?.name || "Admin", adminEmail: user?.email || "admin@university.edu",
        ipAddress: userIp || "Unknown",
        color: action.includes("Delete") ? "#ff003c" : "#00f0ff"
      });
    } catch (err) { console.error("Logging error:", err); }
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const toggleMaintenanceMode = async (status) => {
    setMaintenanceLoading(true);
    try {
      await systemAPI.updateSettings('settings', { maintenanceMode: status });
      setMaintenanceSuccess(status ? "MAINTENANCE_MODE: ENGAGED" : "MAINTENANCE_MODE: DISENGAGED");
      logActivity("System Control", `${status ? 'Engaged' : 'Disengaged'} Maintenance Protocol`);
      setTimeout(() => setMaintenanceSuccess(""), 4000);
      setMaintenanceMode(status);
    } catch (err) {
      console.error("Maintenance error:", err);
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
      await passwordResetsAPI.update(req.id, { status: "approved", processedBy: user?.name });
      logActivity("Reset Approval", `Approved reset request for ${req.email}`);
      // Refresh list
      const resetsRes = await passwordResetsAPI.getAll();
      setPasswordResetsList(resetsRes.data);
    } catch (err) { alert(err.message); }
  };

  const handleRejectReset = async (req) => {
    try {
      await passwordResetsAPI.update(req.id, { status: "rejected", processedBy: user?.name });
      logActivity("Reset Rejection", `Rejected reset request for ${req.email}`);
      // Refresh list
      const resetsRes = await passwordResetsAPI.getAll();
      setPasswordResetsList(resetsRes.data);
    } catch (err) { alert(err.message); }
  };

  const handleManualCredentialReset = async (email, name) => {
    const newPass = Math.random().toString(36).slice(-10);
    alert(`MANUAL_OVERRIDE: Temporary password for ${name} [${email}] is: ${newPass}`);
  };

  const handleDownloadReport = async (type, format = "pdf", dateRange = null) => {
    setReportLoading(type);
    logActivity("Data Export", `Initiated ${type} intelligence synthesis [Format: ${format.toUpperCase()}].`);

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
          pdfDoc.text(`${i + 1}. ${dept.name || 'UNSPECIFIED'} - [ID: ${dept.id?.slice(0, 8)}]`, 25, yPos);
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
        const mockHealthData = Array.from({ length: 20 }, (_, i) => ({
          time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 30) + 10,
          memory: Math.floor(Math.random() * 20) + 40,
          requests: Math.floor(Math.random() * 500) + 100
        }));

        pdfDoc.text(`Audit Trail Density: ${activities.length} entries`, 25, yPos); yPos += 8;
        pdfDoc.text(`Infrastructure Load: CPU ${mockHealthData[19].cpu}%`, 25, yPos); yPos += 8;
        pdfDoc.text(`Maintenance Status: ${maintenanceMode ? 'ENGAGED' : 'NOMINAL'}`, 25, yPos); yPos += 15;

        pdfDoc.setFont("helvetica", "bold");
        pdfDoc.text("REAL-TIME TELEMETRY (LAST 20 NODES)", 20, yPos);
        yPos += 10;

        pdfDoc.setFontSize(8);
        mockHealthData.forEach((h) => {
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
    const appId = app._id || app.id;
    const generatedEmail = generateUniversityEmail(app.name);
    const generatedOTP = generateOTP();

    setFormData({
      name: app.name || "",
      email: generatedEmail,
      password: generatedOTP,
      role: app.role === "college_admin" ? ROLES.COLLEGE_ADMIN : ROLES.STUDENT,
      studentId: "", year: "", employeeId: "", department: app.college || app.department || app.intendedMajor || "",
      applicationId: appId
    });
    setCreationError("");
    setCreationSuccess("");
    setOpenDialog(true);
  };

  const handleRejectApplication = async (app) => {
    const appId = app._id || app.id;
    if (!window.confirm(`Are you sure you want to reject the application for ${app.name}?`)) return;
    try {
      await applicationsAPI.patch(appId, { status: "rejected" });
      logActivity("Application Rejected", `Rejected application for ${app.email || app.name}`);
      // Refresh list using the correct operational status
      const appsRes = await applicationsAPI.getAll({ status: 'approved_by_dept,registrar_approved' });
      setApprovedApplications(appsRes.data);
    } catch (err) {
      console.error("Failed to reject application:", err);
      alert("Error rejecting application.");
    }
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    setCreationLoading(true);
    setCreationError("");
    setCreationSuccess("");
    try {
      const res = await registerUserByAdmin({
        ...formData,
        tempPassword: formData.password,  // store plain-text OTP for first-login bypass
        requiresPasswordChange: true,
      });
      if (res.success) {
        if (formData.applicationId) {
          try {
            await applicationsAPI.patch(formData.applicationId, { status: "final_approved" });
            const appsRes = await applicationsAPI.getAll({ status: 'approved_by_dept,registrar_approved' });
            setApprovedApplications(appsRes.data);
          } catch (appErr) {
            console.error("Failed to update application status:", appErr);
          }
        }
        setCreationSuccess("Identity provisioned successfully.");
        setFormData({ name: "", email: "", password: "", role: ROLES.STUDENT, applicationId: null });
        // Refresh users
        const usersRes = await usersAPI.getAll();
        setUsersList(usersRes.data);
        setTimeout(() => setOpenDialog(false), 2000);
      } else {
        const errMsg = res.error || "Failed to provision account.";
        setCreationError(errMsg);
        alert(`Provisioning failed: ${errMsg}`);
      }
    } catch (err) {
      const errMsg = err?.message || "Unexpected error during provisioning.";
      setCreationError(errMsg);
      alert(`Provisioning error: ${errMsg}`);
    } finally { setCreationLoading(false); }
  };

  const handleToggleUserActive = async (userId, isCurrentlyDisabled) => {
    try {
      await usersAPI.update(userId, { disabled: !isCurrentlyDisabled });
      logActivity(isCurrentlyDisabled ? "Grant Access" : "Revoke Access", `Toggled user ${userId} → ${isCurrentlyDisabled ? 'active' : 'disabled'}`);
      // Update local state handling both _id and id (MongoDB)
      setUsersList(prev => prev.map(u => (u._id || u.id) === userId ? { ...u, disabled: !isCurrentlyDisabled } : u));
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
      await usersAPI.delete(userId);
      logActivity("Delete User", `Deleted user ID: ${userId}`);
      setUsersList(prev => prev.filter(u => (u._id || u.id) !== userId));
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
      await usersAPI.patch(studentToDeactivate.id, { disabled: true, status: 'Deactivated' });

      await securityLogsAPI.create({
        action: "ACCOUNT_DEACTIVATED",
        details: `Deactivated student ${studentToDeactivate.name} (${studentToDeactivate.email}) due to clearance status (${studentToDeactivate.status}).`,
        ip: userIp || "Unknown",
        user: user?.name || "Admin",
        severity: "high"
      });
      alert(`Successfully deactivated student ${studentToDeactivate.name}`);
      setUsersList(prev => prev.map(u => (u._id || u.id) === (studentToDeactivate._id || studentToDeactivate.id) ? { ...u, disabled: true, status: 'Deactivated' } : u));
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
      pdfDoc.text(`${new Date(log.timestamp).toLocaleString()} | ${log.classification || ''} | ${log.resolution || ''}`, 20, y);
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
        await announcementsAPI.update(editingNews.id, newsForm);
      } else {
        await announcementsAPI.create(newsForm);
      }
      const newsRes = await announcementsAPI.getAll();
      setNewsList(newsRes.data);
      setOpenNewsDialog(false);
    } catch (err) {
      console.error("Save news error:", err);
    } finally { setNewsLoading(true); }
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
      await systemBroadcastsAPI.create({
        message: broadcastMessage, type: broadcastType, active: true
      });
      setOpenBroadcast(false);
      logActivity("Broadcast", `Sent ${broadcastType} alert: ${broadcastMessage}`);
    } catch (err) {
      console.error("Broadcast error:", err);
    } finally { setBroadcastLoading(false); }
  };

  const menuItems = [
    { id: "overview", label: t("overview"), icon: <DashboardIcon />, group: "general" },
    { id: "news", label: t("news"), icon: <Newspaper />, group: "general" },
    { id: "users", label: t("users"), icon: <People />, group: "general" },

    { id: "academic_structure", label: "Academic Structure", icon: <AccountTree />, group: "academic" },
    { id: "academic_calendar", label: "Academic Calendar", icon: <Event />, group: "academic" },
    { id: "grading_config", label: "Grading & Assessment", icon: <Grade />, group: "academic" },
    { id: "applications", label: t("applications"), icon: <Assignment />, badge: approvedApplications.length, group: "academic" },

    { id: "financial_config", label: "Financial Configuration", icon: <Paid />, group: "operations" },
    { id: "reports", label: t("reports"), icon: <Assessment />, group: "operations" },
    { id: "provisioning", label: t("provisioning"), icon: <PersonAdd />, badge: pendingEntities.length, group: "operations" },

    { id: "system", label: t("system"), icon: <Settings />, group: "system" },
    { id: "health", label: t("health"), icon: <Speed />, group: "system" },
    { id: "audit", label: t("audit"), icon: <History />, group: "system" },
    { id: "security", label: t("security"), icon: <Security />, group: "system" },
    { id: "integrations", label: "Integration Management", icon: <Extension />, group: "system" },
  ];

  const passwordMenuItems = [
    { id: "password_resets", label: t("passwordResets"), icon: <LockReset />, badge: passwordResetsList.filter(r => r.status === "pending").length },
    { id: "otp_management", label: t("otpManagement"), icon: <VpnKey /> },
  ];

  const totalPasswordBadge = passwordResetsList.filter(r => r.status === "pending").length;

  const adminSidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0E2033', color: '#fff' }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{
          width: 50, height: 50, mx: 'auto', mb: 1.5,
          borderRadius: '50%', border: '2px solid #D9A621',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#D9A621', fontSize: '24px', fontWeight: 'bold'
        }}>
          ✝
        </Box>
        <Typography variant="caption" sx={{ letterSpacing: 1.5, fontWeight: 900, color: '#fff', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase' }}>
          Holy Trinity
        </Typography>
        <Typography variant="caption" sx={{ letterSpacing: 1.2, fontWeight: 800, color: 'rgba(255,255,255,0.85)', fontSize: '0.68rem', display: 'block', textTransform: 'uppercase' }}>
          Theology University
        </Typography>
        <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 800, letterSpacing: 2, fontSize: '0.64rem', mt: 0.5, display: 'block', textTransform: 'uppercase' }}>
          System Administration
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, py: 1.5, flex: 1, overflowY: 'auto' }}>
        {[
          { id: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'users', label: 'Users & Accounts', icon: <People /> },
          { id: 'security', label: 'Roles & Permissions', icon: <Security /> },
          { id: 'health', label: 'Services & Health', icon: <Speed /> },
          { id: 'audit', label: 'Audit Trail', icon: <History /> },
          { id: 'news', label: 'Notifications', icon: <Campaign /> },
          { id: 'integrations', label: 'Integrations', icon: <Extension /> },
          { id: 'system', label: 'Backups & Storage', icon: <Settings /> },
          { id: 'financial_config', label: 'Settings', icon: <Paid /> },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { setActiveTab(item.id); if (isMobile) setMobileDrawerOpen(false); }}
                sx={{
                  borderRadius: '8px', py: 1, px: 2,
                  bgcolor: isActive ? '#D9A621' : 'transparent',
                  color: isActive ? '#0E2033' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isActive ? '#D9A621' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#0E2033' : '#fff'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 800 : 500, fontSize: '0.86rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer User Card matching mockup */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 36, height: 36, fontSize: '0.85rem' }}>
            SA
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.82rem', lineHeight: 1.2 }}>
              System Administrator
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              root · MFA enabled
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef4444' } }} title="Logout">
          <Logout fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#F4F6F8", minHeight: "100vh" }}>
      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', border: 'none' }
        }}
      >
        {adminSidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260, flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 260, boxSizing: "border-box", border: "none"
          }
        }}
      >
        {adminSidebarContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar matching Screen 13 */}
        <Box sx={{
          height: 64, bgcolor: '#fff', borderBottom: '1px solid #E2E8F0',
          px: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 650 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileDrawerOpen(true)} edge="start" sx={{ color: '#0E2033' }}>
                <MenuIcon />
              </IconButton>
            )}
            <TextField
              size="small"
              fullWidth
              placeholder="Search users, services, audit events..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  bgcolor: '#F8FAFC',
                  fontSize: '0.85rem',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="• Production · v2.4.1"
              size="small"
              sx={{
                bgcolor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                fontWeight: 700,
                fontSize: '0.74rem',
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            />

            <IconButton size="small" sx={{ color: '#64748B' }}>
              <Badge color="error" variant="dot">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 34, height: 34, fontSize: '0.82rem' }}>
                SA
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.82rem', lineHeight: 1.1 }}>
                  System Administrator
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Admin
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Dynamic Content Rendering */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          {activeTab === "overview" && (
            <OverviewTab statsData={statsData} healthData={healthData} serverHealth={serverHealth} activities={activities} gradients={gradients} glassStyle={glassStyle} />
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
                id: l._id || l.id,
                timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString() : 'N/A',
                severity: (l.severity === 'high' || l.severity === 'critical') ? 'CRITICAL' : l.severity === 'medium' ? 'HIGH' : 'INFO',
                event: l.action || l.classification || 'Security Event',
                source: l.ip || 'Unknown',
                user: l.user || '—',
                protocol: 'HTTPS',
                action: l.resolution ? 'BLOCKED' : 'LOGGED'
              }))}
              securityScore={
                securityLogs.length === 0 ? 100 :
                  Math.max(60, Math.round(100 -
                    (securityLogs.filter(l => l.severity === 'high' || l.severity === 'critical').length
                      / Math.max(securityLogs.length, 1)) * 40
                  ))
              }
              securityAlerts={securityLogs.filter(l => l.severity === 'high' || l.severity === 'critical').length}
              criticalLast24h={securityLogs.filter(l => {
                const ts = l.timestamp ? new Date(l.timestamp) : null;
                return ts && (Date.now() - ts.getTime()) < 86400000 && (l.severity === 'high' || l.severity === 'critical');
              }).length}
              gradients={gradients}
              neonColors={neonColors}
              glassStyle={glassStyle}
              handleRunHealthCheck={() => console.log('Run health check')}
              handleGenerateSecurityReport={() => console.log('Generate Sec Report')}
            />
          )}
          {activeTab === "users" && (
            <UserManagementTab
              usersList={usersList}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              handleOpenDialog={() => { setCreationError(""); setCreationSuccess(""); setOpenDialog(true); }}
              handleToggleUserActive={handleToggleUserActive}
              handleDirectPasswordReset={handleDirectPasswordReset}
              handleManualCredentialReset={handleManualCredentialReset}
              handleDeleteUser={handleDeleteUser}
              glassStyle={glassStyle}
            />
          )}
          {activeTab === "news" && <NewsManagementTab glassStyle={glassStyle} />}
          {activeTab === "system" && (
            <SystemProtocolsTab
              maintenanceMode={maintenanceMode}
              toggleMaintenanceMode={toggleMaintenanceMode}
              maintenanceSuccess={maintenanceSuccess}
              sessionPersistence={sessionPersistence}
              ipWhitelisting={ipWhitelisting}
              dbOptimization={dbOptimization}
              handleToggleSystemFlag={handleToggleSystemFlag}
              handleHealthExecute={handleHealthExecute}
              setOpenBroadcast={setOpenBroadcast}
              glassStyle={glassStyle}
            />
          )}
          {activeTab === "health" && (
            <SystemHealthTab
              healthExecuting={healthExecuting}
              handleHealthExecute={() => console.log('Execute Health')}
              glassStyle={glassStyle}
              serverHealth={serverHealth}
              healthData={healthData}
            />
          )}
          {activeTab === "audit" && (
            <AuditLogsTab
              activities={activities}
              logSearch={logSearch}
              setLogSearch={setLogSearch}
              logFilter={logFilter}
              setLogFilter={setLogFilter}
              handleExportLogs={handleExportLogs}
              exportLoading={exportLoading}
              gradients={gradients}
              glassStyle={glassStyle}
            />
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

          {activeTab === "academic_structure" && <AcademicStructureTab />}
          {activeTab === "academic_calendar" && <AcademicCalendarTab />}
          {activeTab === "grading_config" && <GradingConfigTab />}
          {activeTab === "financial_config" && <FinancialConfigTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
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
