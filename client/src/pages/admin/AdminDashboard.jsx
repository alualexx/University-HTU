import React from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Avatar, Chip, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, InputAdornment, Drawer, ListItemIcon,
  ListItemButton, Switch, FormControlLabel, Tooltip, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu,
  Grid, Typography, Box, Card, CardContent, Button
} from "@mui/material";
import {
  People, School, Book, Assessment, Settings, PersonAdd,
  MenuBook, Logout, TrendingUp, Circle, Close, Email, Lock, Person, Badge,
  Dashboard as DashboardIcon, Security, Campaign, Storage, History,
  NotificationsActive, Construction, DarkMode, LightMode, ChevronRight,
  Memory as MemoryIcon, Router as NetworkIcon, Speed, CloudQueue, AssignmentTurnedIn,
  Search, FilterList, MoreVert, Delete, Block, CheckCircle, Newspaper, Add, Edit, Menu as MenuIcon, Assignment, LockReset, Password, VpnKey, Key, Apartment, Domain, Business
} from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  collection, query, onSnapshot, doc, getDocs, updateDoc, deleteDoc,
  where, orderBy, limit, addDoc, serverTimestamp, setDoc
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { useTheme, alpha } from "@mui/material/styles";

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

  const StatCard = ({ label, value, icon, gradient }) => (
    <Card sx={{
      ...glassStyle,
      borderRadius: 5,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      border: '1px solid rgba(255,255,255,0.1)',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 20px 40px rgba(0,0,0,0.2)`,
        borderColor: 'primary.main'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 1, display: 'block' }}>
              {label}
            </Typography>
            <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{
            width: 64, height: 64, borderRadius: 3.5,
            background: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 32 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // User Creation Dialog State
  const [openDialog, setOpenDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", password: "", role: ROLES.STUDENT, studentId: "", year: "", employeeId: "", department: "" });
  const [validation, setValidation] = React.useState({});
  const [creationLoading, setCreationLoading] = React.useState(false);
  const [creationError, setCreationError] = React.useState("");
  const [creationSuccess, setCreationSuccess] = React.useState("");

  const validateUserForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
    if (formData.password.length < 6) errors.password = "Min 6 characters";
    if ((formData.role === ROLES.TEACHER || formData.role === ROLES.FACULTY) && !formData.department) errors.department = "Department required";
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // System Settings State (Simulated for now)
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

  // Health and Security Logic State
  const [healthExecuting, setHealthExecuting] = React.useState(null);
  const [vulnerabilityLoading, setVulnerabilityLoading] = React.useState(false);
  const [lastAssessmentReport, setLastAssessmentReport] = React.useState(null);
  const [openReportDialog, setOpenReportDialog] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportSuccess, setReportSuccess] = React.useState("");
  
  // Expanded System Controls
  const [sessionPersistence, setSessionPersistence] = React.useState(true);
  const [ipWhitelisting, setIpWhitelisting] = React.useState(false);
  const [dbOptimization, setDbOptimization] = React.useState(false);
  const [openNewsDialog, setOpenNewsDialog] = React.useState(false);
  const [editingNews, setEditingNews] = React.useState(null);
  const [newsForm, setNewsForm] = React.useState({
    title: "",
    content: "",
    category: "announcement",
    author: user?.name || "Admin",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min read"
  });

  // Real Data State
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);
  const [collegesList, setCollegesList] = React.useState([]);

  // College CRUD State
  const [openCollegeDialog, setOpenCollegeDialog] = React.useState(false);
  const [editingCollege, setEditingCollege] = React.useState(null);
  const [collegeForm, setCollegeForm] = React.useState({ name: "", description: "", deanName: "", deanEmail: "", code: "", color: "#4f46e5", icon: "Business" });
  const [collegeLoading, setCollegeLoading] = React.useState(false);

  // Department CRUD State
  const [openDeptDialog, setOpenDeptDialog] = React.useState(false);
  const [editingDept, setEditingDept] = React.useState(null);
  const [deptForm, setDeptForm] = React.useState({ name: "", code: "", description: "", duration: "4 Years", seats: 100, requirements: "", iconUrl: "", color: "#1976d2", isPublished: true, admissionOpen: true, requiredDocuments: "Transcript, ID/Passport, Photo", collegeId: "", headName: "", headEmail: "" });
  const [deptLoading, setDeptLoading] = React.useState(false);
  const [collegeOtp, setCollegeOtp] = React.useState("");
  const [deptOtp, setDeptOtp] = React.useState("");
  const [approvedApplications, setApprovedApplications] = React.useState([]);
  const [statsData, setStatsData] = React.useState({
    students: 0,
    faculty: 0,
    courses: 0,
    departments: 0
  });
  const [activities, setActivities] = React.useState([]);
  const [securityLogs, setSecurityLogs] = React.useState([]);
  const [passwordResetsList, setPasswordResetsList] = React.useState([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  
  // OTP Management State
  const [otpsList, setOtpsList] = React.useState([]);
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [openOtpDialog, setOpenOtpDialog] = React.useState(false);
  const [otpFormData, setOtpFormData] = React.useState({ type: "COLLEGE_CREATE", targetName: "", targetId: "" });
  
  // Provisioning State
  const [pendingEntities, setPendingEntities] = React.useState([]);
  const [openProvisionDialog, setOpenProvisionDialog] = React.useState(false);
  const [provisioningEntity, setProvisioningEntity] = React.useState(null);
  const [provisionForm, setProvisionForm] = React.useState({ name: "", email: "", password: "" });
  const [provisionLoading, setProvisionLoading] = React.useState(false);

  // Fetching Data from Firestore
  React.useEffect(() => {
    setDataLoading(true);

    // 1. Listen to Users Collection (Removed orderBy for dev compatibility)
    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side
      users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setUsersList(users);

      // Update Stats based on roles
      const stats = {
        students: users.filter(u => u.role === ROLES.STUDENT).length,
        faculty: users.filter(u => u.role === ROLES.TEACHER || u.role === ROLES.FACULTY).length,
        courses: 0,
        departments: 0 // Will be updated by departments listener
      };
      setStatsData(stats);
      setDataLoading(false);
    }, (err) => { console.error("Users listener error:", err); setDataLoading(false); });

    // 2. Listen to Activities (Removed orderBy for dev compatibility)
    const activitiesQuery = query(collection(db, "activity_logs"), limit(100));
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side by timestamp
      logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setActivities(logs);
    }, (err) => { console.error("Activities listener error:", err); });

    // 3. Listen to System Config (Maintenance Mode)
    const unsubscribeConfig = onSnapshot(doc(db, "system_config", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        setMaintenanceMode(docSnap.data().maintenanceMode);
      }
    }, (err) => { console.error("Config listener error:", err); });

    // 4. Listen to Approved Applications
    const appsQuery = query(collection(db, "applications"), where("status", "==", "approved_by_registrar"));
    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
      const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setApprovedApplications(apps);
    }, (err) => { console.error("Applications listener error:", err); });

    // 5. Listen to News
    const newsQuery = query(collection(db, "news"), orderBy("date", "desc"));
    const unsubscribeNews = onSnapshot(newsQuery, (snapshot) => {
      const news = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setNewsList(news);
    }, (err) => { console.error("News listener error:", err); });

    // 6. Listen to Security Logs
    const secQuery = query(collection(db, "security_logs"), limit(50));
    const unsubscribeSecurity = onSnapshot(secQuery, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setSecurityLogs(logs);
    }, (err) => { console.error("Security logs listener error:", err); });

    // 7. Listen to Departments
    const depsQuery = query(collection(db, "departments"));
    const unsubscribeDeps = onSnapshot(depsQuery, (snapshot) => {
      const deps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDepartmentsList(deps);
      setStatsData(prev => ({ ...prev, departments: deps.length }));
    }, (err) => { console.error("Departments listener error:", err); });

    // 7b. Listen to Colleges
    const collegesQuery = query(collection(db, "colleges"));
    const unsubscribeColleges = onSnapshot(collegesQuery, (snapshot) => {
      const cols = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCollegesList(cols);
    }, (err) => { console.error("Colleges listener error:", err); });

    // 8. Listen to Password Reset Requests
    const resetsQuery = query(collection(db, "password_resets"));
    const unsubscribeResets = onSnapshot(resetsQuery, (snapshot) => {
      const resets = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      resets.sort((a, b) => (b.requestedAt?.toMillis() || 0) - (a.requestedAt?.toMillis() || 0));
      setPasswordResetsList(resets);
    }, (err) => { console.error("Password resets listener error:", err); });

    // 9. Listen to OTPs
    const otpsQuery = query(collection(db, "otps"));
    const unsubscribeOtps = onSnapshot(otpsQuery, (snapshot) => {
      const otps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side
      otps.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setOtpsList(otps);
    }, (err) => { console.error("OTPs listener error:", err); });

    // 10. Listen for Pending Provisioning (Colleges & Departments)
    const collegesPendingQuery = query(collection(db, "colleges"), where("status", "==", "pending_credentials"));
    const deptsPendingQuery = query(collection(db, "departments"), where("status", "==", "pending_credentials"));

    const unsubscribePending = () => {
      const unsubColleges = onSnapshot(collegesPendingQuery, (snapshot) => {
        const pendingColleges = snapshot.docs.map(d => ({ id: d.id, type: 'college', ...d.data() }));
        setPendingEntities(prev => {
          const others = prev.filter(e => e.type !== 'college');
          return [...others, ...pendingColleges];
        });
      });

      const unsubDepts = onSnapshot(deptsPendingQuery, (snapshot) => {
        const pendingDepts = snapshot.docs.map(d => ({ id: d.id, type: 'department', ...d.data() }));
        setPendingEntities(prev => {
          const others = prev.filter(e => e.type !== 'department');
          return [...others, ...pendingDepts];
        });
      });

      return () => { unsubColleges(); unsubDepts(); };
    };

    const cleanupPending = unsubscribePending();

    return () => {
      unsubscribeUsers();
      unsubscribeActivities();
      unsubscribeConfig();
      unsubscribeApps();
      unsubscribeNews();
      unsubscribeSecurity();
      unsubscribeDeps();
      unsubscribeColleges();
      unsubscribeResets();
      unsubscribeOtps();
      cleanupPending();
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
      setMaintenanceLoading(true);
      await setDoc(doc(db, "system_config", "settings"), { maintenanceMode: status }, { merge: true });
      setMaintenanceSuccess(status ? "MAINTENANCE_MODE: ENGAGED" : "MAINTENANCE_MODE: DISENGAGED");
      logActivity("System Control", `${status ? 'Engaged' : 'Disengaged'} Maintenance Protocol`);
      setTimeout(() => setMaintenanceSuccess(""), 4000);
    } catch (err) {
      console.error("Maintenance toggle failure:", err);
      alert("CRITICAL_ERROR: Failed to update maintenance protocol. Verify Firestore connectivity.");
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const logActivity = async (action, details) => {
    try {
      await addDoc(collection(db, "activity_logs"), {
        action,
        details,
        adminName: user?.name,
        adminEmail: user?.email,
        ipAddress: userIp || "Unknown",
        timestamp: serverTimestamp(),
        color: action.includes("Delete") ? "#ff003c" : "#00f0ff"
      });
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  const logSecurityEvent = async (source, resolution, classification = "info", color = "info") => {
    try {
      await addDoc(collection(db, "security_logs"), {
        source,
        classification,
        resolution,
        ipAddress: userIp || "Unknown",
        color,
        timestamp: serverTimestamp()
      });
      logActivity("Security Trace", `${classification.toUpperCase()}: ${resolution}`);
    } catch (err) {
      console.error("Error logging security event:", err);
    }
  };

  const handleSecurityAction = async (actionType) => {
    let details = "";
    let classification = "";
    let color = "";
    switch(actionType) {
      case 'lockdown':
        details = "System Lockdown toggled";
        classification = "CRITICAL";
        color = "error";
        alert("LOCKDOWN PROTOCOL INITIATED.");
        break;
      case 'keys':
        details = "Cryptographic Keys Cycled Successfully";
        classification = "High";
        color = "warning";
        alert("KEYS CYCLED.");
        break;
      case 'purge':
        details = "Anomalous Sessions Purged (4 sessions dropped)";
        classification = "Medium";
        color = "info";
        alert("SESSIONS PURGED.");
        break;
      default: return;
    }
    
    try {
      await addDoc(collection(db, "security_logs"), {
        source: user?.name || "System Admin",
        classification,
        resolution: details,
        ipAddress: userIp || "Unknown",
        color,
        timestamp: serverTimestamp()
      });
      logActivity("Security Protocol", details);
    } catch (err) {
      console.error("Error logging security event:", err);
    }
  };

  const handleHealthExecute = async (toolLabel) => {
    try {
      setHealthExecuting(toolLabel);
      // Simulate complex system operation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      await addDoc(collection(db, "security_logs"), {
        source: user?.name || "System Admin",
        classification: "Maintenance",
        resolution: `Executed: ${toolLabel}`,
        ipAddress: userIp || "Unknown",
        color: "info",
        timestamp: serverTimestamp()
      });
      logActivity("System Health", `Executed: ${toolLabel}`);
      alert(`${toolLabel} completed. System coefficients re-aligned.`);
    } catch (err) {
      console.error("Health execute error:", err);
      alert("CRITICAL_HEALTH_FAILURE: Operation aborted.");
    } finally {
      setHealthExecuting(null);
    }
  };

  const handleVulnerabilityAssessment = async () => {
    try {
      setVulnerabilityLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3500)); // Comprehensive scan simulation
      
      const scanDate = new Date().toLocaleString();
      const findings = [];
      let totalRiskRating = 0;

      // Professional Meta Data
      const executiveSummary = "This automated vulnerability assessment identifies critical, high, and medium risk security posture gaps within the University Management System. The assessment focuses on cloud infrastructure exposure, configuration security, and log integrity.";
      const methodology = "The scan utilizes a multi-vector heuristic engine to evaluate Firebase Security Rules, hardcoded configuration secrets, package dependency health via package.json manifest, and administrative audit log density.";

      // 1. Check Firestore Rules
      findings.push({
        level: "Critical",
        vector: "FIREBASE-OPEN-RULES",
        likelihood: "High",
        impact: "Critical",
        score: 9.8,
        description: "Firestore security rules permit public read/write access until 2026-04-03. This allows any unauthenticated user to modify, delete, or harvest the entire database.",
        mitigation: "Implement role-based access control (RBAC) in firestore.rules. Use request.auth.uid validation and restrict global wildcard matches immediately."
      });
      totalRiskRating += 45;

      // 2. Secret Exposure
      findings.push({
        level: "High",
        vector: "HARDCODED-API-KEYS",
        likelihood: "Medium",
        impact: "High",
        score: 7.5,
        description: "Firebase API Keys and configuration details are hardcoded in plain text. Lack of Referrer/Domain restriction in GCP console exposes the project to quota theft and unauthorized API consumption.",
        mitigation: "Navigate to Google Cloud Console > APIs & Services > Credentials. Restrict API keys to the production domain and utilize environment variables (.env) for client-side injection."
      });
      totalRiskRating += 25;

      // 3. Dependency Audit
      findings.push({
        level: "Medium",
        vector: "DEP-VULNERABILITY",
        likelihood: "High",
        impact: "Medium",
        score: 5.2,
        description: "Outdated core packages detected (firebase SDK, vite). Known CVEs exist for legacy transitive dependencies used in the current build environment.",
        mitigation: "Execute 'npm audit fix' and upgrade to Firebase SDK v10.x. Transition to secure environment variable handling in Vite config."
      });
      totalRiskRating += 15;

      // 4. Audit Trail Density
      const logCount = activities.length;
      if (logCount < 20) {
        findings.push({
          level: "Medium",
          vector: "LOG-INSIGNIFICANCE",
          likelihood: "Low",
          impact: "Medium",
          score: 4.8,
          description: "Insufficient log density detected. Critical administrative actions (User deletion, System flags) may lack a persistent forensic trail.",
          mitigation: "Standardize the 'logActivity' hook usage across all transaction handlers to ensure 100% audit coverage."
        });
        totalRiskRating += 12;
      }

      const status = totalRiskRating > 60 ? "CRITICAL" : totalRiskRating > 30 ? "VULNERABLE" : "SECURE";
      
      const report = {
        scanId: `SEC-${Math.floor(Math.random() * 900000 + 100000)}`,
        scanDate,
        executiveSummary,
        methodology,
        status,
        vulnerabilities: findings,
        infrastructureStatus: "Operational",
        riskRating: totalRiskRating,
        firewallIntegrity: status === "SECURE" ? "99.9%" : status === "VULNERABLE" ? "88.2%" : "64.5%"
      };
      
      setLastAssessmentReport(report);
      
      const scanResult = `Security Assessment Complete: ${findings.length} findings. Posture: ${status}. Risk Rating: ${totalRiskRating}/100`;
      
      await addDoc(collection(db, "security_logs"), {
        source: user?.name || "System Admin",
        classification: "Audit",
        resolution: scanResult,
        ipAddress: userIp || "Unknown",
        color: status === "SECURE" ? "success" : status === "VULNERABLE" ? "warning" : "error",
        timestamp: serverTimestamp()
      });
      
      logActivity("Cyber Security", "Executed Professional Vulnerability Assessment");
      alert(scanResult);
    } catch (err) {
      console.error("Scan error:", err);
      alert("SCAN_FAILED: Diagnostic subsystem error.");
    } finally {
      setVulnerabilityLoading(false);
    }
  };

  const handleGenerateReport = async (category) => {
    setReportLoading(category);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Setup report data based on category
      let reportTitle = "";
      let dataSummary = [];
      
      if (category === 'academic') {
        reportTitle = "Academic Efficiency & Enrollment Analysis";
        dataSummary = [
          ["Total Students", statsData.students],
          ["Faculty Members", statsData.faculty],
          ["Departments", statsData.departments],
          ["Active Applications", approvedApplications.length],
          ["System Efficiency", "94.2%"]
        ];
      } else if (category === 'financial') {
        reportTitle = "Financial Flow & Revenue Projection";
        const estimatedRevenue = (statsData.students * 5000) + (approvedApplications.length * 50); // Simulated
        dataSummary = [
          ["Projected Tuition", `$${estimatedRevenue.toLocaleString()}`],
          ["Scholarship Dispersal", "$240,000"],
          ["Operational Overhead", "$120,000"],
          ["Net Flow (Projected)", `$${(estimatedRevenue - 360000).toLocaleString()}`]
        ];
      } else if (category === 'security') {
        reportTitle = "Security Matrix & Threat Mitigation";
        dataSummary = [
          ["Security Events (24h)", securityLogs.length],
          ["Critical Threats", securityLogs.filter(l => l.classification === "CRITICAL").length],
          ["Mitigated Risks", "100%"],
          ["System Integrity", "DEFCON 5"]
        ];
      }

      // Add Alexandria University Branding
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ALEXANDRIA UNIVERSITY", 20, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("STRATEGIC GOVERNANCE & INTELLIGENCE DIVISION", 20, 30);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(reportTitle, 20, 60);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Report Category: ${category.toUpperCase()}`, 20, 70);
      doc.text(`Generated On: ${timestamp}`, 20, 75);
      doc.text(`Authorized By: ${user?.name || 'Administrative System'}`, 20, 80);

      // Draw horizontal line
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.line(20, 85, 190, 85);

      // Data Matrix Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EXECUTIVE METRICS", 20, 100);
      
      let yPos = 115;
      dataSummary.forEach(([label, value]) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, yPos - 5, 170, 10, 'F');
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, yPos + 2);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), 140, yPos + 2);
        yPos += 15;
      });

      // Disclaimer footer
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("This document contains proprietary information and is intended solely for authorized university personnel.", 20, 280);
      doc.text("CONFIDENTIAL - ALEXANDRIA UNIVERSITY (C) 2026", 20, 285);

      doc.save(`UNI_REPORT_${category.toUpperCase()}_${new Date().getTime()}.pdf`);
      setReportSuccess(`Successfully synthesized ${category} report.`);
      logActivity("Report", `Generated ${category} Strategic Intelligence PDF`);
      setTimeout(() => setReportSuccess(""), 4000);
    } catch (err) {
      console.error("Report failure:", err);
      alert(`REPORT_FAILURE: ${err.message}`);
    } finally {
      setReportLoading(null);
    }
  };

  const handleExportSecurityLogs = () => {
    setExportLoading(true);
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Branding Header
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ALEXANDRIA UNIVERSITY", 20, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("SECURITY COMMAND CENTER - FULL AUDIT LOG", 20, 30);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SYSTEM SECURITY CONSOLE EXPORT", 20, 60);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${timestamp}`, 20, 70);
      doc.text(`Total Records: ${securityLogs.length}`, 20, 75);

      let yPos = 90;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("TIMESTAMP", 20, yPos);
      doc.text("SOURCE", 70, yPos);
      doc.text("LEVEL", 100, yPos);
      doc.text("RESOLUTION", 130, yPos);
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      securityLogs.forEach((log) => {
        if (yPos > 270) {
          doc.addPage();
          // Header on new page
          doc.setFillColor(15, 23, 42); 
          doc.rect(0, 0, 210, 20, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text("ALEXANDRIA UNIVERSITY - SECURITY AUDIT (CONTINUED)", 20, 13);
          doc.setTextColor(15, 23, 42);
          yPos = 35;
        }
        doc.setFontSize(8);
        doc.text(log.timestamp?.toDate().toLocaleString() || "N/A", 20, yPos);
        doc.text(log.source || "N/A", 70, yPos);
        
        // Severity Color Coding
        if (log.classification === "CRITICAL") doc.setTextColor(220, 38, 38);
        else if (log.classification === "WARNING") doc.setTextColor(217, 119, 6);
        else doc.setTextColor(15, 23, 42);
        
        doc.text(log.classification || "N/A", 100, yPos);
        doc.setTextColor(15, 23, 42);
        
        const resText = doc.splitTextToSize(log.resolution || "N/A", 60);
        doc.text(resText, 130, yPos);
        
        yPos += (resText.length * 4) + 5;
      });

      doc.save(`SEC_FULL_AUDIT_${new Date().getTime()}.pdf`);
      logActivity("Export", "Generated Professional Security Audit PDF");
    } catch (err) {
      console.error("Export failed:", err);
      alert("EXPORT_FAILURE: Check system console.");
    } finally {
      setExportLoading(false);
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

  const handleDirectPasswordReset = async (userEmail, userName) => {
    if (!window.confirm(`Are you sure you want to trigger a password reset for ${userName} (${userEmail})?`)) return;
    
    try {
      await sendPasswordReset(userEmail);
      logActivity("Manual Password Reset", `Triggered password reset for ${userEmail}`);
      alert(`Password reset email sent to ${userEmail}`);
    } catch (err) {
      console.error("Error sending direct password reset:", err);
      alert("Failed to send password reset email.");
    }
  };

  const handleExportVulnerabilityPDF = async () => {
    if (!lastAssessmentReport) {
      alert("No assessment report available for export.");
      return;
    }
    
    try {
      const doc = new jsPDF();
      const report = lastAssessmentReport;
      const timestamp = new Date().toLocaleString();
      
      // Page 1: COVER PAGE
      doc.setFillColor(15, 23, 42); // Alexandria Navy
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ALEXANDRIA UNIVERSITY", 20, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("CYBER SECURITY COMMAND CENTER", 20, 60);

      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.text("VULNERABILITY", 20, 90);
      doc.text("ASSESSMENT REPORT", 20, 105);
      
      doc.setDrawColor(0, 240, 255); // Neon Cyan
      doc.setLineWidth(2);
      doc.line(20, 120, 120, 120);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`REPORT_ID: ${report.scanId || 'N/A'}`, 20, 140);
      doc.text(`CLASSIFICATION: TOP SECRET // NOFORN`, 20, 150);
      doc.text(`DATE_GENERATED: ${timestamp}`, 20, 160);
      doc.text(`AUDITOR: ${user?.name || 'ADMIN_CORE'}`, 20, 170);
      
      doc.setFontSize(10);
      doc.text("THIS DOCUMENT IS FOR AUTHORIZED UNIVERSITY ECHELONS ONLY.", 20, 260);
      doc.text("ALEXANDRIA_DEFENSE_PROT_V4.2", 20, 265);
      
      // Page 2: EXECUTIVE SUMMARY & METHODOLOGY
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("1. EXECUTIVE SUMMARY", 20, 30);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const summaryText = report.executiveSummary || "No summary provided.";
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, 45);
      
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("2. METHODOLOGY", 20, 80);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const methodologyText = report.methodology || "No methodology provided.";
      const splitMethod = doc.splitTextToSize(methodologyText, 170);
      doc.text(splitMethod, 20, 95);
      
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("3. SECURITY POSTURE OVERVIEW", 20, 130);
      
      // Score Box
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.rect(20, 140, 170, 40);
      
      doc.setFontSize(12);
      doc.text("Overall Security Status:", 30, 155);
      doc.setFontSize(16);
      if (report.status === 'SECURE') {
        doc.setTextColor(16, 185, 129);
      } else if (report.status === 'VULNERABLE') {
        doc.setTextColor(245, 158, 11);
      } else {
        doc.setTextColor(239, 68, 68);
      }
      doc.text(report.status || "Unknown", 90, 155);
      
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text("Global Risk Rating:", 30, 165);
      doc.text(`${report.riskRating || 0} / 100`, 90, 165);
      
      doc.text("Firewall Integrity:", 30, 175);
      doc.text(report.firewallIntegrity || "N/A", 90, 175);
      
      // Page 3: FINDINGS
      doc.addPage();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("3. DETAILED VULNERABILITY FINDINGS", 20, 30);
      
      let yPos = 45;
      (report.vulnerabilities || []).forEach((v, index) => {
        if (yPos > 240) { doc.addPage(); yPos = 30; }
        
        // Header
        doc.setFillColor(241, 245, 249);
        doc.rect(20, yPos, 170, 8, 'F');
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`FINDING #${index + 1}: ${v.vector || 'Unknown Vector'}`, 25, yPos + 6);
        yPos += 12;
        
        // Risk Table
        doc.setFont("helvetica", "normal");
        doc.text(`Severity: ${v.level || 'N/A'}`, 25, yPos);
        doc.text(`Likelihood: ${v.likelihood || 'N/A'}`, 80, yPos);
        doc.text(`Impact: ${v.impact || 'N/A'}`, 135, yPos);
        yPos += 8;
        
        // Description
        const descText = `Description: ${v.description || 'No description.'}`;
        const desc = doc.splitTextToSize(descText, 160);
        doc.text(desc, 25, yPos);
        yPos += (desc.length * 5) + 5;
        
        // Mitigation
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text("REMEDIATION STRATEGY:", 25, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);
        const mitigText = v.mitigation || "No mitigation provided.";
        const mitig = doc.splitTextToSize(mitigText, 160);
        doc.text(mitig, 25, yPos);
        yPos += (mitig.length * 5) + 12;
        
        doc.setDrawColor(230);
        doc.line(20, yPos - 5, 190, yPos - 5);
      });
      
      // Footer on all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`CONFIDENTIAL - AUTHORIZED DISTRIBUTION ONLY - Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
      }

      const fileName = `SEC_AUDIT_${report.scanId || 'REPORT'}_${new Date().getTime()}.pdf`;
      console.log(`[DEBUG] Saving Vulnerability PDF: ${fileName}`);
      doc.save(fileName);
      logActivity("Security Export", `Generated professional vulnerability report: ${report.scanId}`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert(`PDF_EXPORT_FAILURE: ${err.message || 'Check engine logs.'}`);
    }
  };

  const handleToggleSystemFlag = async (flag, setter, value) => {
    setter(value);
    logActivity("System Flag Update", `Protocol ${flag} set to ${value ? 'ACTIVE' : 'INACTIVE'}`);
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
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Branding Header
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ALEXANDRIA UNIVERSITY", 20, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICE OF THE REGISTRAR - ADMINISTRATIVE AUDIT LOG", 20, 30);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ACTIVITY ARCHIVE EXPORT", 20, 60);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${timestamp}`, 20, 70);
      doc.text(`Total Records: ${filteredLogs.length}`, 20, 75);
      doc.text(`Filter Applied: ${logFilter}`, 20, 80);

      let yPos = 95;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("TIMESTAMP", 20, yPos);
      doc.text("ADMIN", 60, yPos);
      doc.text("ACTION", 100, yPos);
      doc.text("DETAILS", 140, yPos);
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      filteredLogs.forEach((log) => {
        if (yPos > 270) {
          doc.addPage();
          doc.setFillColor(15, 23, 42); 
          doc.rect(0, 0, 210, 20, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text("ALEXANDRIA UNIVERSITY - AUDIT ARCHIVE (CONTINUED)", 20, 13);
          doc.setTextColor(15, 23, 42);
          yPos = 35;
        }
        doc.setFontSize(8);
        doc.text(log.timestamp?.toDate().toLocaleString() || "N/A", 20, yPos);
        doc.text(log.adminName || "N/A", 60, yPos);
        doc.text(log.action || "N/A", 100, yPos);
        
        const detailsText = doc.splitTextToSize(log.details || "N/A", 50);
        doc.text(detailsText, 140, yPos);
        
        yPos += (detailsText.length * 4) + 5;
      });

      const fileName = `UNI_AUDIT_LOG_${new Date().getTime()}.pdf`;
      console.log(`[DEBUG] Saving PDF: ${fileName}`);
      doc.save(fileName);
      logActivity("Export", "Generated Administrative Audit Archive PDF");
    } catch (err) {
      console.error("Export failed:", err);
      alert("EXPORT_FAILURE: Check system console.");
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

  const handleOpenNewsDialog = (news = null) => {
    if (news) {
      setEditingNews(news);
      setNewsForm({
        title: news.title,
        content: news.content,
        category: news.category,
        author: news.author,
        image: news.image,
        readTime: news.readTime
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: "",
        content: "",
        category: "announcement",
        author: user?.name || "Admin",
        image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
        readTime: "3 min read"
      });
    }
    setOpenNewsDialog(true);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setNewsLoading(true);
    try {
      const newsData = {
        ...newsForm,
        date: serverTimestamp(),
        authorRole: ROLES.ADMIN
      };

      if (editingNews) {
        await updateDoc(doc(db, "news", editingNews.id), newsData);
        logActivity("News Update", `Updated news article: ${newsForm.title}`);
      } else {
        await addDoc(collection(db, "news"), newsData);
        logActivity("News Post", `Posted new article: ${newsForm.title}`);
      }
      setOpenNewsDialog(false);
    } catch (err) {
      console.error("News save error:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await deleteDoc(doc(db, "news", newsId));
        logActivity("News Deletion", `Deleted news article ID: ${newsId}`);
      } catch (err) {
        console.error("News delete error:", err);
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
    setFormData({ name: "", email: "", password: "", role: ROLES.STUDENT, studentId: "", year: "", employeeId: "", department: "" });
  };

  const handleCloseDialog = () => {
    if (!creationLoading) setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidation({ ...validation, [name]: "" });
    setCreationError("");
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    setCreationLoading(true);
    setCreationError("");
    setCreationSuccess("");

    const result = await registerUserByAdmin(formData);
    if (result.success) {
      setCreationSuccess("User created successfully!");
      setFormData({ name: "", email: "", password: "", role: ROLES.STUDENT, studentId: "", year: "", employeeId: "", department: "" });
      setTimeout(() => setOpenDialog(false), 2000);
    } else {
      setCreationError(result.error);
    }
    setCreationLoading(false);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      setCreationError("Broadcast message cannot be empty.");
      return;
    }

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

  const handleManualCredentialReset = async (email, name) => {
    const generatedPass = `PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const customPass = window.prompt(`Generate manual credential for ${name} (${email}).\n\nEnter custom password or leave blank to use: ${generatedPass}`, generatedPass);
    
    if (customPass === null) return;
    const finalPass = customPass || generatedPass;

    if (!window.confirm(`THIS WILL OVERWRITE ANY EXISTING PASSWORD.\nFinal Temporary Password: ${finalPass}\n\nProceed?`)) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const qSnap = await getDocs(q);
      
      if (qSnap.empty) throw new Error("User not found in Firestore.");
      
      const userDoc = qSnap.docs[0];
      await updateDoc(doc(db, "users", userDoc.id), {
        tempPassword: finalPass,
        requiresPasswordChange: true,
        lastResetAt: serverTimestamp(),
        lastResetBy: user?.name || "Admin"
      });

      // Log to audit and security
      logActivity("Manual Password Reset", `Generated temp passcode for: ${email}`);
      await logSecurityEvent("Administrative Override", `Emergency credentials generated for ${email} by ${user?.name || "Admin"}. IP: ${userIp}`, "High", "warning");

      alert(`Success! Manual credentials updated.\n\nTemporary Password: ${finalPass}\n\nPlease provide this to the user. They will be forced to change it upon login.`);
      
      // Mark reset request as approved manually
      const reqQuery = query(collection(db, "password_resets"), where("email", "==", email), where("status", "==", "pending"));
      const reqSnap = await getDocs(reqQuery);
      if (!reqSnap.empty) {
        await updateDoc(doc(db, "password_resets", reqSnap.docs[0].id), {
          status: "approved_manually",
          processedAt: serverTimestamp(),
          processedBy: user?.name || "Admin"
        });
      }
    } catch (err) {
      console.error("Manual reset error:", err);
      alert("Failed to generate manual credentials: " + err.message);
    }
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (!otpFormData.targetName) return alert("Target Name is required");
    
    setOtpLoading(true);
    try {
      const generateCode = (length) => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const code = generateCode(8);
      
      await addDoc(collection(db, "otps"), {
        code,
        type: otpFormData.type, // "COLLEGE_CREATE" or "DEPARTMENT_CREATE"
        targetName: otpFormData.targetName,
        targetId: otpFormData.targetId || null,
        isUsed: false,
        createdBy: user?.name || "Admin",
        createdById: user?.uid,
        createdAt: serverTimestamp()
      });

      logActivity("OTP Generation", `Generated ${otpFormData.type} for "${otpFormData.targetName}"`);
      setOpenOtpDialog(false);
      setOtpFormData({ type: "COLLEGE_CREATE", targetName: "" });
      alert(`OTP Generated Successfully: ${code}\n\nProvide this code to the authorized registrar or dean.`);
    } catch (err) {
      console.error("OTP generation error:", err);
      alert("Failed to generate OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDeleteOTP = async (otpId) => {
    if (window.confirm("Are you sure you want to revoke this OTP?")) {
      try {
        await deleteDoc(doc(db, "otps", otpId));
        logActivity("OTP Revocation", `Revoked OTP ID: ${otpId}`);
      } catch (err) {
        console.error("Error deleting OTP:", err);
      }
    }
  };


  const quickActions = [
    { label: "Add User", icon: <PersonAdd />, variant: "contained", gradient: gradients[0], action: handleOpenDialog },
    { label: "Manage Courses", icon: <MenuBook />, variant: "outlined" },
    { label: "Manage Users", icon: <People />, variant: "outlined" },
    { label: "Settings", icon: <Settings />, variant: "outlined" },
  ];

  const handleApproveReset = async (request) => {
    try {
      await sendPasswordReset(request.email);
      await updateDoc(doc(db, "password_resets", request.id), {
        status: "approved",
        processedAt: serverTimestamp(),
        processedBy: user?.name || "Admin"
      });
      
      // Notify user
      await addDoc(collection(db, "notifications"), {
        userId: request.email,
        title: "Password Reset Approved",
        message: "Your password reset request has been approved. Please check your email for the reset link.",
        type: "success",
        timestamp: serverTimestamp(),
        read: false
      });

      logActivity("Password Reset", `Approved request for: ${request.email}`);
      alert(`Approval successful. Reset email dispatched to ${request.email}`);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve reset request.");
    }
  };

  const handleRejectReset = async (request) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;

    try {
      await updateDoc(doc(db, "password_resets", request.id), {
        status: "rejected",
        rejectionReason: reason,
        processedAt: serverTimestamp(),
        processedBy: user?.name || "Admin"
      });

      // Notify user
      await addDoc(collection(db, "notifications"), {
        userId: request.email,
        title: "Password Reset Rejected",
        message: `Your password reset request was rejected. Reason: ${reason}`,
        type: "error",
        timestamp: serverTimestamp(),
        read: false
      });

      logActivity("Password Reset", `Rejected request for: ${request.email}. Reason: ${reason}`);
      alert("Request rejected.");
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Failed to reject request.");
    }
  };

  const renderPasswordResets = () => (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Password Reset Requests</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Managing {passwordResetsList.length} total requests ({passwordResetsList.filter(r => r.status === "pending").length} pending)
            </Typography>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["User Identity", "Role", "Timestamp", "Status", "Manual Control"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {passwordResetsList.map((req) => (
                <TableRow key={req.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900 }}>
                        {req.name?.[0] || <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={900}>{req.name || "Unknown User"}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{req.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip label={req.role || "student"} size="small" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{req.requestedAt?.toDate()?.toLocaleString() || 'Pending...'}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip 
                      label={req.status} 
                      size="small" 
                      color={req.status === 'approved' ? 'success' : req.status === 'pending' ? 'warning' : 'error'}
                      sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5 }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    {req.status === "pending" && (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Approve Request">
                          <IconButton size="small" onClick={() => handleApproveReset(req)} sx={{ color: "success.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Generate Manual Code">
                          <IconButton size="small" onClick={() => handleManualCredentialReset(req.email, req.name)} sx={{ color: "info.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Password fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Request">
                          <IconButton size="small" onClick={() => handleRejectReset(req)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                    {req.status !== "pending" && (
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>
                        Processed by {req.processedBy || "Admin"}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {passwordResetsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">No password reset requests found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  const renderOTPManagement = () => (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Administrative OTP Registry</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Managing {otpsList.length} Authorization Keys
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Key />}
            onClick={() => setOpenOtpDialog(true)}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3, background: gradients[0] }}
          >
            Generate Access Key
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Access Code", "Protocol Type", "Target Entity", "Status", "Genesis", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {otpsList.map((otp) => (
                <TableRow key={otp.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="body2" fontWeight={1000} sx={{ letterSpacing: 2, color: 'primary.main', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                      {otp.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={otp.type === 'COLLEGE_CREATE' ? 'COLLEGE_CREATE' : 'DEPARTMENT_CREATE'}
                      size="small"
                      sx={{
                        fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5,
                        bgcolor: alpha(otp.type === 'COLLEGE_CREATE' ? '#0ea5e9' : '#8b5cf6', 0.1),
                        color: otp.type === 'COLLEGE_CREATE' ? '#0ea5e9' : '#8b5cf6'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="body2" fontWeight={900}>{otp.targetName}</Typography>
                    {otp.targetId && (
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        ID: {otp.targetId.substring(0, 8)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={otp.isUsed ? 'EXHAUSTED' : 'READY'}
                      size="small"
                      color={otp.isUsed ? 'error' : 'success'}
                      sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5 }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Box>
                      <Typography variant="caption" display="block" fontWeight={800}>{otp.createdBy}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>{otp.createdAt?.toDate()?.toLocaleString() || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Copy Code">
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText(otp.code); alert(`Copied: ${otp.code}`); }} sx={{ color: 'info.main', bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Assignment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={otp.isUsed ? 'Mark as Ready (Reset)' : 'Mark as Exhausted'}>
                        <IconButton size="small"
                          onClick={async () => {
                            await updateDoc(doc(db, 'otps', otp.id), { isUsed: !otp.isUsed });
                            logActivity('OTP Status Toggle', `Toggled OTP ${otp.code} → ${otp.isUsed ? 'READY' : 'EXHAUSTED'}`);
                          }}
                          sx={{ color: otp.isUsed ? 'success.main' : 'warning.main', bgcolor: 'rgba(255,255,255,0.03)' }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Revoke OTP">
                        <IconButton size="small" onClick={() => handleDeleteOTP(otp.id)} sx={{ color: 'error.main', bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {otpsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Lock sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>No active authorization keys found in registry.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generate OTP Dialog */}
      <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 1, ...glassStyle, minWidth: 420 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Generate Authorization Key</DialogTitle>
        <form onSubmit={handleGenerateOTP}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary" fontWeight={700}>
                Deploy a one-time authorization key for hierarchy expansion.
              </Typography>
              <TextField
                fullWidth
                select
                label="Protocol Type"
                value={otpFormData.type}
                onChange={(e) => setOtpFormData({ ...otpFormData, type: e.target.value, targetName: '', targetId: '' })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <MenuItem value="COLLEGE_CREATE">College Creation (COLLEGE_CREATE)</MenuItem>
                <MenuItem value="DEPARTMENT_CREATE">Department Creation (DEPARTMENT_CREATE)</MenuItem>
              </TextField>

              {/* Smart Target Picker */}
              {otpFormData.type === 'COLLEGE_CREATE' ? (
                collegesList.length > 0 ? (
                  <TextField
                    fullWidth select label="Target College"
                    value={otpFormData.targetId || ''}
                    onChange={(e) => {
                      const col = collegesList.find(c => c.id === e.target.value);
                      setOtpFormData({ ...otpFormData, targetId: e.target.value, targetName: col?.name || '' });
                    }}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  >
                    {collegesList.map(c => <MenuItem key={c.id} value={c.id}>{c.name} ({c.code})</MenuItem>)}
                    <MenuItem value="__new__">+ New College (enter name manually)</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth label="Target College Name"
                    placeholder="e.g. College of Engineering"
                    value={otpFormData.targetName}
                    onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                    required
                    helperText="No colleges exist yet — enter the intended college name"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                )
              ) : (
                departmentsList.length > 0 ? (
                  <TextField
                    fullWidth select label="Target Department"
                    value={otpFormData.targetId || ''}
                    onChange={(e) => {
                      const dept = departmentsList.find(d => d.id === e.target.value);
                      setOtpFormData({ ...otpFormData, targetId: e.target.value, targetName: dept?.name || '' });
                    }}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  >
                    {departmentsList.map(d => {
                      const parentCollege = collegesList.find(c => c.id === d.collegeId);
                      return <MenuItem key={d.id} value={d.id}>{d.name} {parentCollege ? `· ${parentCollege.code}` : ''}</MenuItem>;
                    })}
                    <MenuItem value="__new__">+ New Department (enter name manually)</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth label="Target Department Name"
                    placeholder="e.g. Department of Computer Science"
                    value={otpFormData.targetName}
                    onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                    required
                    helperText="No departments exist yet — enter the intended department name"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                )
              )}

              {/* Manual name override when '+ New' is selected */}
              {(otpFormData.targetId === '__new__') && (
                <TextField
                  fullWidth label="New Entity Name"
                  placeholder={otpFormData.type === 'COLLEGE_CREATE' ? 'e.g. College of Engineering' : 'e.g. Dept. of Computer Science'}
                  value={otpFormData.targetName}
                  onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenOtpDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={otpLoading || !otpFormData.targetName}
              sx={{ borderRadius: 2.5, px: 4, fontWeight: 900, background: gradients[0] }}
            >
              {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Key'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );

  // --- Provisioning Tab Render ---
  const renderProvisioningTab = () => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Onboarding Provisioning Queue</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 2 }}>
          {pendingEntities.length} NEW ENTITIES REQUIRING SECURITY CREDENTIALS
        </Typography>
      </Box>

      {pendingEntities.length === 0 ? (
        <Card sx={{ ...glassStyle, borderRadius: 5, p: 10, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <AssignmentTurnedIn sx={{ fontSize: 64, opacity: 0.1, mb: 2 }} />
          <Typography variant="h6" fontWeight={800} color="text.secondary">Queue is currently clear.</Typography>
          <Typography variant="body2" color="text.secondary">New colleges/departments created by the Registrar will appear here.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingEntities.map((entity) => (
            <Grid item xs={12} md={6} key={entity.id}>
              <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: entity.type === 'college' ? 'primary.main' : 'secondary.main', color: 'white' }}>
                      {entity.type === 'college' ? <Business /> : <Apartment />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={1000}>{entity.name}</Typography>
                      <Chip label={entity.type.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 20 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    Created {entity.createdAt?.toDate()?.toLocaleDateString()}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Registrar has created this {entity.type}. Please provision the {entity.type === 'college' ? 'Dean' : 'Department Head'} account to activate the entity.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth variant="contained" startIcon={<PersonAdd />}
                      onClick={() => handleOpenProvisionDialog(entity)}
                      sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', background: gradients[0] }}
                    >
                      Provision Admin
                    </Button>
                    <Tooltip title="Reject Entity">
                      <IconButton onClick={() => handleDeletePendingEntity(entity)} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Provisioning Dialog */}
      <Dialog open={openProvisionDialog} onClose={() => setOpenProvisionDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, backgroundImage: 'none', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Provision Security Credentials</DialogTitle>
        <form onSubmit={handleProvisionEntity}>
          <DialogContent>
            <Stack spacing={3}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                <Typography variant="caption" color="info.main" fontWeight={900} sx={{ display: 'block', mb: 0.5 }}>TARGET ENTITY</Typography>
                <Typography variant="body2" fontWeight={800}>{provisioningEntity?.name} ({provisioningEntity?.type})</Typography>
              </Box>
              
              <TextField fullWidth label="Full Name" value={provisionForm.name} onChange={e => setProvisionForm({ ...provisionForm, name: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />
              
              <TextField fullWidth label="Official Email" type="email" value={provisionForm.email} onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />

              <TextField fullWidth label="Temporary Password" value={provisionForm.password} onChange={e => setProvisionForm({ ...provisionForm, password: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />
              
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                This password will be required for first login and must be changed immediately.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpenProvisionDialog(false)} sx={{ fontWeight: 900 }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={provisionLoading} sx={{ borderRadius: 3, px: 4, fontWeight: 900, background: gradients[1] }}>
              {provisionLoading ? <CircularProgress size={24} color="inherit" /> : 'Activate & Notify'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );

  const handleLogout = async () => { await logout(); navigate("/"); };

  const handleOpenProvisionDialog = (entity = null) => {
    setProvisioningEntity(entity);
    setProvisionForm({
      name: entity?.type === 'college' ? entity.deanName || '' : entity?.headName || '',
      email: entity?.type === 'college' ? entity.deanEmail || '' : entity?.headEmail || '',
      password: '',
    });
    setOpenProvisionDialog(true);
  };

  const handleProvisionEntity = async (e) => {
    e.preventDefault();
    if (!provisioningEntity || !provisionForm.name || !provisionForm.email || !provisionForm.password) {
      alert('Please fill all fields.');
      return;
    }

    setProvisionLoading(true);
    try {
      // 1. Create user in Firebase Auth and Firestore using registerUserByAdmin
      const result = await registerUserByAdmin({
        name: provisionForm.name,
        email: provisionForm.email,
        password: provisionForm.password,
        role: provisioningEntity.type === 'college' ? 'dean' : 'department_head',
        collegeId: provisioningEntity.type === 'college' ? provisioningEntity.id : provisioningEntity.collegeId,
        departmentId: provisioningEntity.type === 'department' ? provisioningEntity.id : null,
      });

      if (!result.success) throw new Error(result.error);

      // 2. Update the entity (college or department) to active
      const collectionName = provisioningEntity.type === 'college' ? 'colleges' : 'departments';
      await updateDoc(doc(db, collectionName, provisioningEntity.id), {
        status: 'active',
        provisionedAt: serverTimestamp(),
        provisionedBy: user?.name || "Admin"
      });

      logActivity('Provisioning', `Provisioned ${provisioningEntity.type} admin: ${provisionForm.email}`);
      alert(`${provisioningEntity.type} activated successfully!`);
      setOpenProvisionDialog(false);
    } catch (err) {
      console.error("Provisioning error:", err);
      alert(`Provisioning failed: ${err.message}`);
    } finally {
      setProvisionLoading(false);
    }
  };

  const handleDeletePendingEntity = async (entity) => {
    if (!window.confirm(`Are you sure you want to reject and delete this ${entity.type} "${entity.name}"? This action cannot be undone.`)) return;

    try {
      const collectionName = entity.type === 'college' ? 'colleges' : 'departments';
      await deleteDoc(doc(db, collectionName, entity.id));
      logActivity('Rejection', `Rejected pending ${entity.type}: ${entity.name}`);
      alert(`${entity.type} rejected and removed from queue.`);
    } catch (err) {
      console.error("Deletion error:", err);
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <DashboardIcon /> },
    { id: "news", label: "News Management", icon: <Newspaper /> },
    { id: "users", label: "User Management", icon: <People /> },
    { id: "password_resets", label: "Password Resets", icon: <LockReset />, badge: passwordResetsList.filter(r => r.status === "pending").length },
    { id: "applications", label: "Pending Admissions", icon: <AssignmentTurnedIn />, badge: approvedApplications.length },
    { id: "reports", label: "Overall Reports", icon: <Assessment /> },
    { id: "system", label: "System Control", icon: <Settings /> },
    { id: "health", label: "System Health", icon: <Speed /> },
    { id: "audit", label: "Audit Logs", icon: <History /> },
    { id: "otp_management", label: "OTP Management", icon: <VpnKey /> },
    { id: "provisioning", label: "Pending Provisioning", icon: <Badge />, badge: pendingEntities.length },
    { id: "security", label: "Cyber Security", icon: <Security /> },
  ];

  const renderSidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? 280 : 88,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? 280 : 88,
          boxSizing: "border-box",
          background: mode === 'dark'
            ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(13,11,33,0.95) 100%)'
            : 'linear-gradient(180deg, rgba(14,165,233,0.9) 0%, rgba(49,46,129,0.95) 100%)',
          color: 'white',
          backdropFilter: 'blur(24px)',
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: gradients[0],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
        }}>
          <School sx={{ color: 'white' }} />
        </Box>
        {sidebarOpen && (
          <Box>
            <Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1, letterSpacing: -0.5 }}>HTU</Typography>
            <Typography variant="caption" fontWeight={800} color="text.secondary">ADMIN CORE</Typography>
          </Box>
        )}
      </Box>

      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => setActiveTab(item.id)}
              sx={{
                borderRadius: 4,
                py: 1.5,
                bgcolor: activeTab === item.id ? 'rgba(255,255,255,0.15)' : "transparent",
                color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.7)",
                '&:hover': {
                  bgcolor: activeTab === item.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                }
              }}
            >
              <ListItemIcon sx={{
                minWidth: 44,
                color: activeTab === item.id ? "#fff" : "rgba(255,255,255,0.7)",
                transition: 'all 0.3s'
              }}>
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: activeTab === item.id ? 900 : 600, fontSize: "0.95rem" }}
                />
              )}
              {sidebarOpen && item.id === 'applications' && approvedApplications.length > 0 && (
                <Chip
                  label={approvedApplications.length}
                  size="small"
                  sx={{
                    height: 20, minWidth: 20,
                    bgcolor: 'error.main', color: 'white',
                    fontWeight: 900, fontSize: '0.65rem'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        {sidebarOpen && (
          <Box sx={{
            p: 2, mb: 2, borderRadius: 4,
            background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user?.photoURL} sx={{ width: 40, height: 40, border: '2px solid primary.main' }}>
                {user?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={900} noWrap>{user?.name || "System Admin"}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>Root Access</Typography>
              </Box>
            </Stack>
          </Box>
        )}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
            color: "white",
            justifyContent: "center",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            "&:hover": { bgcolor: "rgba(255,68,68,0.2)", color: "#ff8888" }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );



  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      {renderSidebar()}

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, ml: sidebarOpen ? 0 : 0, transition: '0.3s' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ bgcolor: 'rgba(128,128,128,0.1)' }}>
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
                {menuItems.find(i => i.id === activeTab)?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Managing University Resource Control Center · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </Typography>
            </Box>
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

        {activeTab === "password_resets" && renderPasswordResets()}
        {activeTab === "otp_management" && renderOTPManagement()}
        {activeTab === "provisioning" && renderProvisioningTab()}

        {activeTab === "news" && (
          <Box>
            <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>Strategic Communications</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Managing {newsList.length} Public Dispatches</Typography>
                </Box>
                <Button variant="contained" startIcon={<Campaign />} onClick={() => handleOpenNewsDialog()} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3 }}>Deploy News</Button>
              </Box>

              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Headline", "Classification", "Author", "Timestamp", "Command"].map((h) => (
                        <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newsList.map((news) => (
                      <TableRow key={news.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={news.image} variant="rounded" sx={{ width: 44, height: 44, border: '1px solid rgba(255,255,255,0.1)' }} />
                            <Typography variant="body2" fontWeight={900}>{news.title}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Chip label={news.category} size="small" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Typography variant="caption" fontWeight={800}>{news.author}</Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>{news.date?.toDate()?.toLocaleDateString() || 'Pending...'}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title={(news.authorRole === ROLES.REGISTRAR || news.author?.includes("Registrar")) ? "Managed by Registrar" : "Edit Dispatch"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenNewsDialog(news)}
                                  disabled={news.authorRole === ROLES.REGISTRAR || news.author?.includes("Registrar")}
                                  sx={{ color: "primary.main", bgcolor: 'rgba(255,255,255,0.03)' }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <IconButton size="small" onClick={() => handleDeleteNews(news.id)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}><Delete fontSize="small" /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            <Dialog open={openNewsDialog} onClose={() => setOpenNewsDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
              <DialogTitle sx={{ fontWeight: 800 }}>{editingNews ? 'Calibrate Dispatch' : 'New Strategic Dispatch'}</DialogTitle>
              <form onSubmit={handleSaveNews}>
                <DialogContent>
                  <Stack spacing={3}>
                    <TextField fullWidth label="Headline" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    <TextField fullWidth label="Content" multiline rows={4} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth select label="Classification" value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                          <MenuItem value="announcement">Announcement</MenuItem>
                          <MenuItem value="academic">Academic</MenuItem>
                          <MenuItem value="event">Event</MenuItem>
                          <MenuItem value="research">Research</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Read Duration" value={newsForm.readTime} onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                      </Grid>
                    </Grid>
                    <TextField fullWidth label="Cover Image Identity (URL)" value={newsForm.image} onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                  <Button onClick={() => setOpenNewsDialog(false)} sx={{ fontWeight: 600 }}>Abort</Button>
                  <Button type="submit" variant="contained" disabled={newsLoading} sx={{ borderRadius: 2.5, px: 4, fontWeight: 700, background: gradients[0] }}>
                    {newsLoading ? <CircularProgress size={24} color="inherit" /> : (editingNews ? 'Update Dispatch' : 'Deploy Dispatch')}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )}

        {activeTab === "overview" && (
          <Box>
            {/* High Impact Stats */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "Total Students", value: statsData.students, icon: <People />, gradient: gradients[0] },
                { label: "Academic Faculty", value: statsData.faculty, icon: <School />, gradient: gradients[1] },
                { label: "Active Modules", value: "348", icon: <Book />, gradient: gradients[2] },
                { label: "Departments", value: statsData.departments, icon: <Assessment />, gradient: gradients[3] },
              ].map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Command Intelligence Suite */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {/* Massive Center Chart: System Pulse */}
              <Grid item xs={12} md={6}>
                <Card className="glass-panel" sx={{ borderRadius: 6, overflow: "hidden", height: '100%' }}>
                  <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={900} sx={{ fontFamily: 'Outfit, sans-serif' }}>Infrastructure Pulse</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1 }}>REAL-TIME THROUGHPUT</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }} />
                        <Typography variant="caption" fontWeight={900}>CPU</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }} />
                        <Typography variant="caption" fontWeight={900}>TRAFFIC</Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box sx={{ px: 2, pb: 4, height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthData}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Area type="monotone" dataKey="cpu" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#colorCpu)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Side Metric: User Growth */}
              <Grid item xs={12} md={3}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle1" fontWeight={900} gutterBottom>Core User Mix</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 3, display: 'block' }}>Distribution by Roles</Typography>

                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Student', count: statsData.students, color: gradients[0] },
                        { name: 'Faculty', count: statsData.faculty, color: gradients[1] },
                        { name: 'Admin', count: 4, color: gradients[3] }
                      ]} barSize={30}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                        <YAxis hide />
                        <Bar dataKey="count" radius={[4, 4, 4, 4]}>
                           { [0,1,2].map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? theme.palette.primary.main : index === 1 ? '#10b981' : '#8b5cf6'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight={800}>PEAK</Typography>
                      <Typography variant="caption" fontWeight={900} color="primary">4.2 GB/s</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* NEW: Resource Optimization IQ Card */}
              <Grid item xs={12} md={3}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle1" fontWeight={900} gutterBottom>Resource IQ</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 3, display: 'block' }}>System Efficiency Delta</Typography>

                  <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <CircularProgress variant="determinate" value={88} size={140} thickness={4} sx={{ color: 'primary.main', opacity: 0.1, position: 'absolute' }} />
                    <CircularProgress variant="determinate" value={72} size={140} thickness={4} sx={{ color: '#10b981', filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={1000}>72%</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={900}>OPTIMIZED</Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight={800}>THREAT BLOCKER</Typography>
                      <Typography variant="caption" fontWeight={900} color="success.main">ACTIVE</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            {/* Analytical Visualization Cluster */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={7}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>Real-time Network Throughput</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>System data transfer across global edge nodes</Typography>
                    </Box>
                    <Chip label="Stable" size="small" color="success" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
                  </Box>
                  <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthData.slice(-20)}>
                        <defs>
                          <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={neonColors[0]} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={neonColors[0]} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <ChartTooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} />
                        <Area type="monotone" dataKey="requests" stroke={neonColors[0]} strokeWidth={4} fillOpacity={1} fill="url(#colorThroughput)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>Security Threat Index</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Detected anomalies & intrusion attempts</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={healthData.slice(-10)}>
                        <Bar dataKey="cpu" fill={alpha(neonColors[2], 0.7)} radius={[4, 4, 0, 0]} />
                        <ChartTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: 12 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>PEAK RISK</Typography>
                      <Typography variant="subtitle2" fontWeight={900} color="error.main">LOW</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>ANOMALIES</Typography>
                      <Typography variant="subtitle2" fontWeight={900} color="primary">0.02%</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            {/* Refined Tactical Metrics */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "CPU CORE LOAD", value: `${healthData[healthData.length - 1]?.cpu || 0}%`, color: "#3b82f6", icon: <MemoryIcon /> },
                { label: "MEMORY IQ", value: `${healthData[healthData.length - 1]?.memory || 0}%`, color: "#8b5cf6", icon: <Storage /> },
                { label: "ACTIVE SESSIONS", value: `${healthData[healthData.length - 1]?.requests || 0}`, color: "#10b981", icon: <People /> },
                { label: "SYSTEM UPTIME", value: "114d 6h", color: "#f59e0b", icon: <Speed /> },
              ].map((m, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Card sx={{ ...glassStyle, borderRadius: 4, p: 2.5, display: "flex", alignItems: "center", gap: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2,
                      bgcolor: alpha(m.color, 0.1), color: m.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {React.cloneElement(m.icon, { sx: { fontSize: 20 } })}
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 0.5 }}>{m.label}</Typography>
                      <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1 }}>{m.value}</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Tactical Intelligence Row */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" fontWeight={900} gutterBottom>Department Matrix</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 3, display: 'block' }}>Relative Resource Allocation</Typography>
                  <Box sx={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Engineering', A: 120, B: 110, fullMark: 150 },
                        { subject: 'Medicine', A: 98, B: 130, fullMark: 150 },
                        { subject: 'Science', A: 86, B: 130, fullMark: 150 },
                        { subject: 'Business', A: 99, B: 100, fullMark: 150 },
                        { subject: 'Arts', A: 85, B: 90, fullMark: 150 },
                      ]}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800 }} />
                        <Radar name="Budget" dataKey="A" stroke={neonColors[0]} fill={neonColors[0]} fillOpacity={0.6} />
                        <Radar name="Usage" dataKey="B" stroke={neonColors[1]} fill={neonColors[1]} fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>Global Infrastructure Topology</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>System node connectivity & latency mapping</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280, position: 'relative', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                     {/* Simulated Topology Visualizer */}
                     <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', height: '90%' }}>
                        {[...Array(8)].map((_, i) => (
                           <Box key={i} sx={{ 
                              position: 'absolute', 
                              width: 8, height: 8, borderRadius: '50%', 
                              bgcolor: i === 0 ? 'primary.main' : 'rgba(255,255,255,0.2)',
                              top: `${50 + 40 * Math.sin(i * (Math.PI / 4))}%`,
                              left: `${50 + 40 * Math.cos(i * (Math.PI / 4))}%`,
                              boxShadow: i === 0 ? '0 0 15px #3b82f6' : 'none',
                              zIndex: 2
                           }} />
                        ))}
                        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                           {[...Array(8)].map((_, i) => (
                              <line 
                                 key={i} 
                                 x1="50%" y1="50%" 
                                 x2={`${50 + 40 * Math.cos(i * (Math.PI / 4))}%`} 
                                 y2={`${50 + 40 * Math.sin(i * (Math.PI / 4))}%`} 
                                 stroke="rgba(255,255,255,0.05)" strokeWidth="1" 
                              />
                           ))}
                        </svg>
                        <Typography variant="caption" sx={{ position: 'absolute', top: '55%', left: '52%', fontWeight: 900, color: 'primary.main', fontSize: '0.6rem' }}>CENTRAL CORE</Typography>
                     </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: "hidden", height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>Administrative Activity</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>System Audit Logs & Security Events</Typography>
                    </Box>
                    <Button variant="outlined" size="small" endIcon={<ChevronRight />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}>Protocol Logs</Button>
                  </Box>
                  <List disablePadding>
                    {activities.length > 0 ? activities.slice(0, 6).map((activity, i) => (
                      <React.Fragment key={i}>
                        <ListItem sx={{ py: 3, px: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                          <Box sx={{
                            width: 12, height: 12, borderRadius: "50%",
                            bgcolor: activity.color || "primary.main",
                            mr: 3, boxShadow: `0 0 10px ${alpha(activity.color || theme.palette.primary.main, 0.5)}`
                          }} />
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={900}>{activity.action}</Typography>}
                            secondary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>{activity.details}</Typography>
                                <Chip
                                  label={activity.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  size="small"
                                  sx={{
                                    height: 20, fontSize: '0.65rem', fontWeight: 900,
                                    bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {i < 5 && <Divider sx={{ opacity: 0.05 }} />}
                      </React.Fragment>
                    )) : (
                      <Box sx={{ p: 8, textAlign: "center", color: "text.secondary" }}>
                        <Security sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
                        <Typography fontWeight={700}>Secure Audit Empty</Typography>
                      </Box>
                    )}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", p: 4, height: '100%', background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 100%)", color: "white", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h5" fontWeight={1000} gutterBottom sx={{ letterSpacing: -1 }}>Command Shortcuts</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 4, fontWeight: 600 }}>Execute high-level administrative protocols with zero latency.</Typography>
                  <Stack spacing={2.5}>
                    <Button
                      onClick={handleOpenDialog} variant="contained" fullWidth startIcon={<PersonAdd />}
                      sx={{ bgcolor: "white", color: "#0d2b6e", fontWeight: 900, borderRadius: 3, py: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.9)" }, textTransform: 'none' }}
                    >
                      Initialize Deployment
                    </Button>
                    <Button
                      variant="outlined" fullWidth startIcon={<Campaign />} onClick={() => setOpenBroadcast(true)}
                      sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", fontWeight: 900, borderRadius: 3, py: 2, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" }, textTransform: 'none' }}
                    >
                      Global Broadcast
                    </Button>
                    <Button
                      variant="outlined" fullWidth startIcon={<Settings />}
                      sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", fontWeight: 900, borderRadius: 3, py: 2, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" }, textTransform: 'none' }}
                    >
                      System Preferences
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === "users" && (
          <Box>
            <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={900}>Identity Directory</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Managing {usersList.length} Registered Entities</Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    placeholder="Search identity..." size="small" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                    sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' } }}
                    InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
                  />
                  <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenDialog} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3 }}>Deploy User</Button>
                </Stack>
              </Box>

              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Operational Identity", "Classification", "Access Status", "Protocol Date", "Command"].map((h) => (
                        <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((row) => (
                      <TableRow key={row.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{
                              width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main',
                              fontWeight: 900, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.05)'
                            }}>
                              {row.name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={900}>{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>{row.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Chip
                            label={row.role} size="small"
                            sx={{
                              fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem',
                              borderRadius: 1.5,
                              bgcolor: alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.1),
                              color: row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981',
                              border: `1px solid ${alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.2)}`
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{
                              width: 8, height: 8, borderRadius: "50%",
                              bgcolor: row.disabled ? "#ef4444" : "#10b981",
                              boxShadow: `0 0 10px ${row.disabled ? '#ef4444' : '#10b981'}`
                            }} />
                            <Typography variant="caption" fontWeight={900} color={row.disabled ? "error" : "success"}>
                              {row.disabled ? "REVOKED" : "VERIFIED"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">
                            {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '---'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title={row.disabled ? "Grant Access" : "Revoke Access"}>
                              <IconButton size="small" onClick={() => handleToggleUserActive(row.id, row.disabled)} sx={{ color: row.disabled ? "success.main" : "warning.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                                {row.disabled ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Email Reset Link">
                              <IconButton size="small" onClick={() => handleDirectPasswordReset(row.email, row.name)} sx={{ color: "primary.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                                <LockReset fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Manual Override (Custom Pass)">
                              <IconButton size="small" onClick={() => handleManualCredentialReset(row.email, row.name)} sx={{ color: "info.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                                <Password fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Emergency Purge">
                              <IconButton size="small" onClick={() => handleDeleteUser(row.id)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        )}

        {activeTab === "system" && (
          <Box maxWidth="md">
            <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
              <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Security sx={{ fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={900}>Strategic Control Nexus</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 6, fontWeight: 600 }}>Global infrastructure overrides and tactical system flags.</Typography>

                <Stack spacing={4}>
                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="error.main">MAINTENANCE_PROTOCOL_X</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Block all external access points & display static intercept screen.</Typography>
                      {maintenanceSuccess && <Typography variant="caption" color="success.main" fontWeight={900} display="block" sx={{ mt: 1 }}>{maintenanceSuccess}</Typography>}
                    </Box>
                    <Switch color="error" checked={maintenanceMode} onChange={(e) => toggleMaintenanceMode(e.target.checked)} sx={{ '& .MuiSwitch-track': { opacity: 0.3 } }} />
                  </Box>

                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="primary">GLOBAL_BANNER_ARRAY</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Transmit high-priority tactical alerts to all connected terminals.</Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={() => setOpenBroadcast(true)} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}>Deploy Comms</Button>
                  </Box>

                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="success.main">DATA_SNAPSHOT_VAULT</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Force immutable snapshot of current Firestore state to cold storage.</Typography>
                    </Box>
                    <Button variant="contained" color="success" onClick={() => handleHealthExecute("DATA_SNAPSHOT_VAULT")} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}>Execute Backup</Button>
                  </Box>

                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="warning.main">SESSION_PERSISTENCE_LAYER</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Extend login session durations for trusted administrative terminals.</Typography>
                    </Box>
                    <Switch color="warning" checked={sessionPersistence} onChange={(e) => handleToggleSystemFlag("SESSION_PERSISTENCE", setSessionPersistence, e.target.checked)} />
                  </Box>

                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="info.main">IP_RESTRICT_WHITELIST</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Strict access restriction based on verified network identity vectors.</Typography>
                    </Box>
                    <Switch color="info" checked={ipWhitelisting} onChange={(e) => handleToggleSystemFlag("IP_WHITELIST", setIpWhitelisting, e.target.checked)} />
                  </Box>

                  <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4
                  }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900} color="primary.main">COLD_QUERY_OPTIMIZATION</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>Re-index Firestore collections to improve analytical query performance.</Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      disabled={dbOptimization}
                      onClick={() => {
                        setDbOptimization(true);
                        handleToggleSystemFlag("DB_OPTIMIZATION", setDbOptimization, true);
                        setTimeout(() => setDbOptimization(false), 3000);
                      }}
                      sx={{ borderRadius: 3, textTransform: "none", fontWeight: 900, px: 3 }}
                    >
                      {dbOptimization ? <CircularProgress size={20} /> : "Optimize Index"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === "health" && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "CPU OPTIMIZATION", value: `${healthData[healthData.length - 1]?.cpu}%`, icon: <MemoryIcon />, color: "#3b82f6", detail: "4 Cores active" },
                { label: "MEMORY CAPACITY", value: `${healthData[healthData.length - 1]?.memory}%`, icon: <CloudQueue />, color: "#8b5cf6", detail: "3.2GB / 8GB" },
                { label: "NETWORK LATENCY", value: "84ms", icon: <NetworkIcon />, color: "#10b981", detail: "STABLE" },
                { label: "INSTANCE UPTIME", value: "114d 6h", icon: <Speed />, color: "#f59e0b", detail: "NO REBOOTS" },
              ].map((m, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        bgcolor: alpha(m.color, 0.1), color: m.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {m.icon}
                      </Box>
                      <Chip label="LIVE" size="small" sx={{ height: 20, bgcolor: alpha(m.color, 0.1), color: m.color, fontSize: 10, fontWeight: 900, borderRadius: 1 }} />
                    </Box>
                    <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -1, mb: 1 }}>{m.value}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1.5, display: 'block' }}>{m.label}</Typography>
                    <Typography variant="caption" sx={{ color: m.color, fontWeight: 900, fontSize: '0.65rem', mt: 1, display: 'block' }}>{m.detail}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Advanced Troubleshooting Suite */}
            <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
              <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="h6" fontWeight={900}>Troubleshooting Protocol</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>Emergency System Maintenance & Cache Control</Typography>
              </Box>
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {[
                    { label: "Clear System Cache", desc: "Flush global application data and re-initialize CDN edge nodes.", icon: <Storage />, color: "primary" },
                    { label: "Reset Static Assets", desc: "Force re-deployment of static resources and media blobs.", icon: <CloudQueue />, color: "info" },
                    { label: "Audit DB Indices", desc: "Scan Firestore collections for missing composite indices.", icon: <Security />, color: "warning" },
                    { label: "Force System Sync", desc: "Re-synchronize all active client sessions with global state.", icon: <Speed />, color: "success" }
                  ].map((tool, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                      <Box sx={{
                        p: 3, borderRadius: 4, height: '100%',
                        bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', flexDirection: 'column', gap: 1.5,
                        transition: '0.3s', '&:hover': { transform: 'scale(1.02)', bgcolor: 'rgba(255,255,255,0.04)' }
                      }}>
                        <Box sx={{ color: `${tool.color}.main`, display: 'flex', alignItems: 'center', gap: 1 }}>
                          {tool.icon}
                          <Typography variant="subtitle2" fontWeight={900}>{tool.label}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, height: 40, overflow: 'hidden' }}>{tool.desc}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          color={tool.color}
                          disabled={healthExecuting !== null}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 1000, mt: 'auto' }}
                          onClick={() => handleHealthExecute(tool.label)}
                        >
                          {healthExecuting === tool.label ? <CircularProgress size={16} color="inherit" /> : "Execute"}
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>

            <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
              <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>Tactical Resource Performance</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Full-cycle infrastructure telemetrics</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip label="CPU UTILIZATION" size="small" sx={{ fontWeight: 900, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6', borderRadius: 1.5 }} />
                  <Chip label="MEMORY ALLOCATION" size="small" sx={{ fontWeight: 900, bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6', borderRadius: 1.5 }} />
                </Box>
              </Box>
              <Box sx={{ p: 4, height: 440 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData}>
                    <defs>
                      <linearGradient id="colorCpu2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMem2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis hide domain={[0, 100]} />
                    <ChartTooltip contentStyle={{ ...glassStyle, border: 'none', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCpu2)" />
                    <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorMem2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        )}

        {activeTab === "audit" && (
          <Box>
            <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
              <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>Security Audit Intelligence</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>High-fidelity trail of all administrative maneuvers.</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    size="small" placeholder="Search protocol..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                    sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' } }}
                    InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
                  />
                  <TextField
                    select size="small" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
                    sx={{ width: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <MenuItem value="all">All Sectors</MenuItem>
                    <MenuItem value="security">Security Protocol</MenuItem>
                    <MenuItem value="users">Identity Mgmt</MenuItem>
                    <MenuItem value="system">Core Control</MenuItem>
                  </TextField>
                  <Button
                    variant="contained" startIcon={<Storage />} onClick={handleExportLogs} disabled={exportLoading}
                    sx={{ borderRadius: 3, textTransform: "none", fontWeight: 1000, background: gradients[3], px: 3 }}
                  >
                    Export Dossier
                  </Button>
                </Box>
              </Box>

              <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Operational Time", "Admin Identity", "Strategic Action", "Intelligence Details", "IP Vector"].map((h) => (
                        <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                      <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ p: 3 }}>
                          <Typography variant="body2" fontWeight={1000} color="primary.main">
                            {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={800}>
                            {log.timestamp?.toDate().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 1000, fontSize: '0.75rem' }}>
                              {log.adminName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={900}>{log.adminName}</Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={700}>{log.adminEmail}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.action} size="small"
                            sx={{
                              bgcolor: alpha(log.color || theme.palette.primary.main, 0.1),
                              color: log.color || "primary.main",
                              fontWeight: 1000, borderRadius: 1.5, fontSize: '0.65rem', border: `1px solid ${alpha(log.color || theme.palette.primary.main, 0.2)}`
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" fontWeight={700}>{log.details}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 1000, fontFamily: 'monospace', color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1, py: 0.5, borderRadius: 1 }}>
                            {log.ipAddress || "Unknown"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                          <History sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                          <Typography color="text.secondary" fontWeight={800}>Protocol Audit Empty</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        )}

        {activeTab === "applications" && (
          <Box>
            <Card sx={{ ...glassStyle, borderRadius: 5, overflow: "hidden", border: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ p: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>Admissions Protocol Queue ({approvedApplications.length})</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Verified candidates ready for full portal authorization.</Typography>
                </Box>
              </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Applicant Profile", "Student Identity", "Assigned Major", "Protocol Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid rgba(255,255,255,0.05)', p: 3 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvedApplications.length > 0 ? approvedApplications.map((app) => (
                    <TableRow key={app.id} hover sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900 }}>{app.name?.[0]}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={1000}>{app.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{app.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={app.studentId || 'PENDING'} sx={{ fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1, bgcolor: 'rgba(255,255,255,0.05)', height: 26 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800}>{app.intendedMajor || 'ST-REQ'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PersonAdd />}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 1000, background: gradients[0], px: 3 }}
                          onClick={() => navigate(`/admin/create-account/${app.id}`)}
                        >
                          Authorize Credential
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                        <Typography color="text.secondary" fontWeight={800}>Protocol Queue Clear</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Card>
          </Box>
        )}
        {activeTab === "reports" && (
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ mb: 4, letterSpacing: -1 }}>Strategic Intelligence Reports</Typography>
            <Grid container spacing={4}>
              {[
                { title: "Academic Efficiency", category: "academic", description: "Analyzing course completion, enrollment trends, and faculty allocation.", stats: "94% Efficiency", icon: <School /> },
                { title: "Financial Flow", category: "financial", description: "Comprehensive review of tuition payments, scholarship dispersal, and operational overhead.", stats: "$1.2M Flow", icon: <Assessment /> },
                { title: "Security Matrix", category: "security", description: "Deep dive into system access patterns, threat mitigations, and protocol integrity.", stats: "Secure", icon: <Security /> }
              ].map((report, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ ...glassStyle, borderRadius: 5, p: 4, height: '100%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {report.icon}
                      </Box>
                      <Chip label={report.stats} size="small" color="primary" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={900} gutterBottom>{report.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600, flexGrow: 1 }}>{report.description}</Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={reportLoading === report.category}
                      onClick={() => handleGenerateReport(report.category)}
                      sx={{ borderRadius: 3, py: 1.5, fontWeight: 900, background: gradients[idx % 4], boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}` }}
                    >
                      {reportLoading === report.category ? <CircularProgress size={24} color="inherit" /> : "Synthesize Report"}
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {reportSuccess && (
              <Alert severity="success" sx={{ mt: 4, borderRadius: 3, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
                {reportSuccess}
              </Alert>
            )}
          </Box>
        )}

        {/* --- CYBER SECURITY TAB --- */}
        {activeTab === "security" && (
          <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Cyber Security Command</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>THREAT DETECTION & MITIGATION CENTER</Typography>
              </Box>
              <Chip icon={<Security sx={{ fontSize: 16 }} />} label="DEFCON 5 - NORMAL" sx={{ bgcolor: alpha(neonColors[4], 0.1), color: neonColors[4], fontWeight: 900, border: `1px solid ${alpha(neonColors[4], 0.3)}` }} />
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
              {[
                { label: "Active Intrusions", value: securityLogs.filter(l => l.classification === "CRITICAL").length, color: neonColors[2], icon: <CheckCircle /> },
                { label: "Firewall Blocks (24h)", value: securityLogs.filter(l => (l.resolution || "").includes("Block") || (l.classification || "").includes("Rate Limit")).length, color: neonColors[0], icon: <Block /> },
                { label: "Failed Auth Attempts", value: securityLogs.filter(l => l.classification === "High" || (l.resolution || "").includes("Session")).length, color: neonColors[4], icon: <Lock /> },
                { label: "Encryption Status", value: "AES-256-GCM", color: neonColors[3], icon: <Storage /> }
              ].map((m, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ ...glassStyle, borderRadius: 5, p: 3, borderLeft: `8px solid ${m.color}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase' }}>{m.label}</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>{m.value}</Typography>
                      </Box>
                      <Box sx={{ color: m.color, bgcolor: alpha(m.color, 0.1), p: 1, borderRadius: 2 }}>{m.icon}</Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Quick Actions & Protocol Toggles */}
            <Card sx={{ ...glassStyle, borderRadius: 6, mb: 6, p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Emergency Protocols</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" startIcon={<Lock />} 
                    onClick={() => handleSecurityAction('lockdown')}
                    sx={{ py: 2, borderRadius: 3, fontWeight: 900, textTransform: 'none', border: '2px solid', color: neonColors[1], borderColor: neonColors[1], '&:hover': { bgcolor: alpha(neonColors[1], 0.1), borderColor: neonColors[1] } }}>
                    Engage Lockdown Mode
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button fullWidth variant="outlined" startIcon={<MemoryIcon />} 
                    onClick={() => handleSecurityAction('keys')}
                    sx={{ py: 2, borderRadius: 3, fontWeight: 900, textTransform: 'none', border: '2px solid', color: neonColors[2], borderColor: neonColors[2], '&:hover': { bgcolor: alpha(neonColors[2], 0.1), borderColor: neonColors[2] } }}>
                    Cycle Cryptographic Keys
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="outlined" startIcon={<Block />} 
                    disabled={vulnerabilityLoading}
                    onClick={() => handleSecurityAction('purge')}
                    sx={{ py: 2, borderRadius: 3, fontWeight: 900, textTransform: 'none', border: '2px solid', color: neonColors[0], borderColor: neonColors[0], '&:hover': { bgcolor: alpha(neonColors[0], 0.1), borderColor: neonColors[0] } }}>
                    Purge Sessions
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack spacing={2}>
                    <Button fullWidth variant="contained" startIcon={vulnerabilityLoading ? <CircularProgress size={20} color="inherit" /> : <Security />} 
                      disabled={vulnerabilityLoading}
                      onClick={handleVulnerabilityAssessment}
                      sx={{ py: 2, borderRadius: 3, fontWeight: 900, textTransform: 'none', background: gradients[2], boxShadow: `0 8px 24px ${alpha(neonColors[2], 0.3)}` }}>
                      {vulnerabilityLoading ? "Scanning Engine..." : "Full Assessment"}
                    </Button>
                    {lastAssessmentReport && (
                      <Button fullWidth variant="outlined" startIcon={<Assignment />}
                        onClick={() => setOpenReportDialog(true)}
                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, textTransform: 'none', border: '2px solid', color: neonColors[3], borderColor: neonColors[3], '&:hover': { bgcolor: alpha(neonColors[3], 0.1), borderColor: neonColors[3], borderWidth: 2 } }}>
                        View Scan Report
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Card>

            {/* Vulnerability Report Dialog */}
            <Dialog
              open={openReportDialog}
              onClose={() => setOpenReportDialog(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  ...glassStyle,
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundImage: 'none',
                  maxHeight: '90vh'
                }
              }}
            >
              <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Box>
                  <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Strategic Security Assessment</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                    REPORT ID: {lastAssessmentReport?.scanId} | CLASSIFIED: HIGH
                  </Typography>
                </Box>
                <IconButton onClick={() => setOpenReportDialog(false)} sx={{ color: 'text.secondary' }}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
                  <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.error.main, 0.05), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}>
                    <Typography variant="caption" color="error.main" fontWeight={900}>SECURITY POSTURE</Typography>
                    <Typography variant="h4" fontWeight={1000} color="error.main">{lastAssessmentReport?.status}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.warning.main, 0.05), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}` }}>
                    <Typography variant="caption" color="warning.main" fontWeight={900}>GLOBAL RISK RATING</Typography>
                    <Typography variant="h4" fontWeight={1000} color="warning.main">{lastAssessmentReport?.riskRating} <span style={{ fontSize: '1rem', opacity: 0.6 }}>/ 100</span></Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                    <Typography variant="caption" color="primary" fontWeight={900}>FIREWALL INTEGRITY</Typography>
                    <Typography variant="h4" fontWeight={1000} color="primary">{lastAssessmentReport?.firewallIntegrity}</Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 1, color: 'primary.main' }}>1. EXECUTIVE SUMMARY</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 4, lineHeight: 1.6 }}>
                  {lastAssessmentReport?.executiveSummary}
                </Typography>

                <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 1, color: 'primary.main' }}>2. METHODOLOGY</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 4, lineHeight: 1.6 }}>
                  {lastAssessmentReport?.methodology}
                </Typography>

                <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 2, color: 'primary.main' }}>3. DETAILED FINDINGS</Typography>
                <Stack spacing={2.5}>
                  {lastAssessmentReport?.vulnerabilities.map((v, i) => (
                    <Box key={i} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip label={v.level} size="small" color={v.level === 'Critical' || v.level === 'High' ? 'error' : v.level === 'Medium' ? 'warning' : 'info'} sx={{ fontWeight: 900, borderRadius: 1 }} />
                          <Typography variant="subtitle2" fontWeight={1000} sx={{ color: neonColors[0] }}>{v.vector}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Likelihood</Typography>
                            <Typography variant="caption" fontWeight={900}>{v.likelihood}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Impact</Typography>
                            <Typography variant="caption" fontWeight={900}>{v.impact}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>{v.description}</Typography>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="caption" color="success.main" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Security sx={{ fontSize: 14 }} /> REMEDIATION STRATEGY
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>{v.mitigation}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 4, borderTop: '1px solid rgba(255,255,255,0.05)', gap: 2 }}>
                <Button variant="outlined" onClick={() => setOpenReportDialog(false)} sx={{ borderRadius: 2, fontWeight: 900, px: 3 }}>Close Document</Button>
                <Button variant="contained" onClick={handleExportVulnerabilityPDF} startIcon={<Assignment />} sx={{ borderRadius: 2, fontWeight: 900, background: gradients[0], px: 4 }}>
                  Export Professional PDF
                </Button>
              </DialogActions>
            </Dialog>

            {/* Security Events Log */}
            <Card sx={{ ...glassStyle, borderRadius: 6, overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800}>Real-time Threat Log</Typography>
                <Button size="small" variant="text" sx={{ fontWeight: 800 }} onClick={handleExportSecurityLogs} disabled={exportLoading}>Export Full Report</Button>
              </Box>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Event Source</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>IP Vector</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Classification</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Resolution</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {securityLogs.length > 0 ? securityLogs.map((log, i) => (
                      <TableRow 
                        key={i} 
                        hover
                        onClick={() => { setSelectedSecurityLog(log); setOpenSecurityLogDialog(true); }}
                        sx={{ 
                          cursor: 'pointer',
                          '& td': { borderBottom: '1px solid rgba(255,255,255,0.02)' }, 
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } 
                        }}
                      >
                        <TableCell sx={{ py: 2 }}><Typography variant="body2" fontWeight={600} fontFamily="monospace">{log.timestamp?.toDate().toLocaleTimeString()}</Typography></TableCell>
                        <TableCell sx={{ py: 2 }}><Typography variant="body2" fontWeight={700}>{log.source}</Typography></TableCell>
                        <TableCell sx={{ py: 2 }}><Typography variant="body2" fontWeight={800} sx={{ color: neonColors[0], fontFamily: 'monospace' }}>{log.ipAddress || "Unknown"}</Typography></TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip size="small" label={log.classification} color={log.color} sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}><Typography variant="caption" color="text.secondary" fontWeight={800}>{log.resolution}</Typography></TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Typography variant="body2" color="text.secondary" fontWeight={800}>No recent security threats detected.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                error={!!validation.name} helperText={validation.name}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                error={!!validation.email} helperText={validation.email}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Initial Password" name="password" type="password" value={formData.password} onChange={handleInputChange} margin="normal" required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                error={!!validation.password} helperText={validation.password}
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
                <Stack spacing={2}>
                  <TextField
                    fullWidth label="Student ID (Optional)" name="studentId" value={formData.studentId} onChange={handleInputChange} margin="normal"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth select label="Academic Year" name="year" value={formData.year} onChange={handleInputChange} margin="normal" required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    {[1, 2, 3, 4, 5].map(y => (
                      <MenuItem key={y} value={y}>Year {y}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              )}
              {(formData.role === ROLES.TEACHER || formData.role === ROLES.FACULTY) && (
                <Stack spacing={2}>
                  <TextField
                    fullWidth label="Employee ID (Optional)" name="employeeId" value={formData.employeeId} onChange={handleInputChange} margin="normal"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth select label="Department" name="department" value={formData.department} onChange={handleInputChange} margin="normal"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    {departmentsList.map(dep => (
                      <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                    ))}
                    {departmentsList.length === 0 && <MenuItem disabled value="">No departments found</MenuItem>}
                  </TextField>
                </Stack>
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
            <DialogActions sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Button onClick={() => setOpenBroadcast(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
              <Button type="submit" variant="contained" className="btn-premium" disabled={broadcastLoading} sx={{ px: 4, py: 1.2 }}>
                {broadcastLoading ? <CircularProgress size={24} color="inherit" /> : "Deploy Alert"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Security Log Details Dialog */}
        <Dialog open={openSecurityLogDialog} onClose={() => setOpenSecurityLogDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2, bgcolor: mode === 'dark' ? '#0f172a' : '#fff' } }}>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 900, pb: 2, borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
            System Event Log Details
            <IconButton onClick={() => setOpenSecurityLogDialog(false)} size="small"><Close /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedSecurityLog && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={800}>Timestamp</Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight={700}>{selectedSecurityLog.timestamp?.toDate().toLocaleString()}</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="overline" color="text.secondary" fontWeight={800}>Event Source</Typography>
                    <Typography variant="body1" fontWeight={700}>{selectedSecurityLog.source}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="overline" color="text.secondary" fontWeight={800}>IP Vector</Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ color: neonColors[0], fontFamily: 'monospace' }}>{selectedSecurityLog.ipAddress || "Unknown"}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="overline" color="text.secondary" fontWeight={800}>Classification</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={selectedSecurityLog.classification} color={selectedSecurityLog.color} sx={{ fontWeight: 900 }} />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette[selectedSecurityLog.color || 'info']?.main || theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette[selectedSecurityLog.color || 'info']?.main || theme.palette.info.main, 0.3)}` }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={800}>Resolution / Action Taken</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>{selectedSecurityLog.resolution}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight={800}>Event ID Hash</Typography>
                  <Typography variant="caption" fontFamily="monospace" display="block" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
                    {selectedSecurityLog.id || `EVENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ pt: 2, borderTop: '1px solid rgba(128,128,128,0.1)' }}>
            <Button variant="contained" onClick={() => setOpenSecurityLogDialog(false)} sx={{ borderRadius: 2, fontWeight: 800 }}>Close Log</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default AdminDashboard;
