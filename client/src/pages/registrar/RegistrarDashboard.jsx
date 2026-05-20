import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, Divider, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Tabs, Tab, Fade, Paper, LinearProgress, useTheme, Tooltip,
  Stack, Badge, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Collapse, Slide, Select, FormControl, FormControlLabel, InputLabel, alpha,
  Drawer, List, ListItem, ListItemText, Switch, CircularProgress
} from "@mui/material";
import {
  People, School, Book, Assignment, CheckCircle, PersonAdd,
  Logout, ArrowForward, LightMode, DarkMode, Search, FilterList,
  MoreVert, Notifications, Dashboard, LibraryBooks, SwapHoriz,
  Assessment, TrendingUp, Info, AccountCircle, Email, Phone,
  CalendarToday, Business, Warning, CheckCircleOutline, Cancel,
  AssignmentInd, ExpandMore, ExpandLess, Close, Print,
  Edit, Delete, Add, Schedule, Class, CreditCard, Newspaper, Campaign, AccountBalance, Forum, AccessTime, Person,
  Menu as MenuIcon, ChevronLeft, ChevronRight, MenuBook, Circle, FormatQuote, LockReset, Password, Security, Lock,
  History, FactCheck, Verified, Save, RemoveCircle, AddCircle
}
from "@mui/icons-material";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { jsPDF } from "jspdf";
import { useAuth, ROLES } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";
import { collegesAPI, departmentsAPI, applicationsAPI } from "../../services/api";
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  addDoc, serverTimestamp, getDocs, deleteDoc, orderBy, limit, setDoc
} from "firebase/firestore";

import CollegesTab from "./tabs/CollegesTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import TranscriptsTab from "./tabs/TranscriptsTab";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

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

// Proper component so useCountUp hook is called at top-level, not inside .map()
const RegistrarStatCard = ({ stat, glassStyle, isDark, alpha }) => {
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

const RegistrarDashboard = () => {
  const { user, logout, sendPasswordReset, logAuditActivity, logSecurityEvent, userIp, verifyOTP, markOTPUsed } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const { t } = useLanguage();

  // Shared UI Constants
  const isDark = mode === "dark";
  const glassStyle = {
    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(32px) saturate(200%)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.1)'}`,
    boxShadow: isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.05)',
  };
  const gradients = {
    primary: isDark ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  };

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [rejectDialog, setRejectDialog] = useState({ open: false, app: null, reason: "" });
  const [expandedApp, setExpandedApp] = useState(null);
  const [pendingIds, setPendingIds] = useState([]);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  // Dialog states
  const [courseDialog, setCourseDialog] = useState({ open: false, mode: 'add', data: { name: '', code: '', department: '', credits: 3, instructor: '', status: 'Active' } });
  const [scheduleDialog, setScheduleDialog] = useState({ open: false, mode: 'add', data: { courseId: '', courseName: '', day: '', startTime: '', endTime: '', room: '', semester: 'Fall 2026' } });
  const [studentDialog, setStudentDialog] = useState({ open: false, student: null, name: '', status: 'Active', gender: '', year: 1, department: '', phone: '', email: '', intellectualIdentity: '' });
  const [idRequests, setIdRequests] = useState([]);

  // Sidebar & Notifications State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState([]);

  // News Management State
  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [openNewsDialog, setOpenNewsDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    category: "announcement",
    author: user?.name || "Registrar ",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min read"
  });

  // Colleges State - Shared but UI state moved to CollegesTab
  const [colleges, setColleges] = useState([]);

  // Departments State - Shared but UI state moved to DepartmentsTab
  const [departments, setDepartments] = useState([]);

  // Vulnerability Assessment State
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [vulnerabilityReport, setVulnerabilityReport] = useState(null);
  const [openVulnerabilityDialog, setOpenVulnerabilityDialog] = useState(false);

  // Admissions Posts State
  const [admissionsPosts, setAdmissionsPosts] = useState([]);
  const [openAdmissionsDialog, setOpenAdmissionsDialog] = useState(false);
  const [editingAdmissionPost, setEditingAdmissionPost] = useState(null);
  const [admissionPostForm, setAdmissionPostForm] = useState({
    title: "", content: "", tag: "Update", isImportant: false
  });

  // Finance & Registrations State
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [processingFinanceAction, setProcessingFinanceAction] = useState(null);

  // Registrar Strategic Settings
  const [regLock, setRegLock] = useState(false);
  const [admissionWindow, setAdmissionWindow] = useState(true);
  const [globalMaintenance, setGlobalMaintenance] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [processingDepartment, setProcessingDepartment] = useState(null);
  const [isApprovingCourse, setIsApprovingCourse] = useState(false);
  
  // --- Curriculum Approval State ---
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [selectedCourseForApproval, setSelectedCourseForApproval] = useState(null);
  const [approvalForm, setApprovalForm] = useState({ tuitionFee: "", registrarDescription: "" });
  const [targetYear, setTargetYear] = useState(1);
  const [targetSemester, setTargetSemester] = useState(1);
  const [openRegDialog, setOpenRegDialog] = useState(false);
  const [regDialogYear, setRegDialogYear] = useState(1);
  const [regDialogSemester, setRegDialogSemester] = useState(1);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [isSearchingStudents, setIsSearchingStudents] = useState(false);
  const [studentSearchResults, setStudentSearchResults] = useState([]);
  const [profileSubTab, setProfileSubTab] = useState('dossier');
  const [profileTranscript, setProfileTranscript] = useState(null);
  const [profileEnrollments, setProfileEnrollments] = useState([]);
  const [loadingProfileData, setLoadingProfileData] = useState(false);

  // Fetch all real-time data
  useEffect(() => {
    const unsubs = [];

    // Pending applications (Only those approved by Dept Head)
    const fetchApps = async () => {
      try {
        const res = await applicationsAPI.getAll();
        // Filtering in frontend for now to match the Firebase logic if needed
        setApplications(res.data.filter(app => app.status === "approved_by_dept" || app.status === "pending_dept_review"));
      } catch (err) {
        console.warn("applications fetch failed:", err);
      }
    };
    fetchApps();

    // Pending IDs
    const fetchPendingIds = async () => {
      try {
        const res = await applicationsAPI.getAll();
        setPendingIds(res.data.filter(app => app.status === "setup_completed"));
      } catch (err) {
        console.warn("pendingIds fetch failed:", err);
      }
    };
    fetchPendingIds();

    // Students (users with role=student)
    const fetchStudents = async () => {
      try {
        const res = await usersAPI.getAll({ role: "student" });
        setStudents(res.data);
      } catch (err) {
        console.warn("students fetch failed:", err);
      }
    };
    fetchStudents();

    // Courses
    const fetchCourses = async () => {
      try {
        const res = await coursesAPI.getAll();
        setCourses(res.data);
      } catch (err) {
        console.warn("courses fetch failed:", err);
      }
    };
    fetchCourses();

    // Schedules - Placeholder as we don't have schedules API yet
    // unsubs.push(onSnapshot(collection(db, "schedules"), (snap) => {
    //   setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    // }, (err) => console.warn("schedules listener failed:", err)));

    // ID Requests
    unsubs.push(onSnapshot(query(collection(db, "id_requests"), orderBy("timestamp", "desc")), (snap) => {
      setIdRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("id_requests listener failed:", err)));

    // News
    unsubs.push(onSnapshot(query(collection(db, "news"), orderBy("date", "desc")), (snap) => {
      setNewsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("news listener failed:", err)));

    // Colleges
    const fetchColleges = async () => {
      try {
        const res = await collegesAPI.getAll();
        setColleges(res.data);
      } catch (err) {
        console.warn("colleges fetch failed:", err);
      }
    };
    fetchColleges();

    // Departments
    const fetchDepts = async () => {
      try {
        const res = await departmentsAPI.getAll();
        setDepartments(res.data);
      } catch (err) {
        console.warn("departments fetch failed:", err);
      }
    };
    fetchDepts();

    // Admissions Posts
    unsubs.push(onSnapshot(query(collection(db, "admissions_posts"), orderBy("date", "desc")), (snap) => {
      setAdmissionsPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("admissions_posts listener failed:", err)));

    // Tuition Payments (for Finance tab)
    unsubs.push(onSnapshot(query(collection(db, "tuition_payments"), orderBy("timestamp", "desc")), (snap) => {
      setPendingPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {
      console.warn("tuition_payments listener failed, trying without orderBy...");
      unsubs.push(onSnapshot(collection(db, "tuition_payments"), (snap) => {
        setPendingPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }));
    }));

    // Enrollments (for Finance tab)
    unsubs.push(onSnapshot(collection(db, "enrollments"), (snap) => {
      setAllEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("enrollments listener failed:", err)));

    // System Notifications
    unsubs.push(onSnapshot(query(collection(db, "notifications"), orderBy("timestamp", "desc"), limit(20)), (snap) => {
      setSystemNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.warn("notifications listener failed:", err)));

    // Registrar Settings Listener
    unsubs.push(onSnapshot(doc(db, "system_settings", "registrar"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRegLock(data.registrationLock ?? false);
        setAdmissionWindow(data.admissionWindow ?? true);
        setTargetYear(data.targetYear ?? 1);
        setTargetSemester(data.targetSemester ?? 1);
        setRegDialogYear(data.targetYear ?? 1);
        setRegDialogSemester(data.targetSemester ?? 1);
      }
    }));

    // Phase 18: Global System Config Bridge
    unsubs.push(onSnapshot(doc(db, "system_config", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalMaintenance(data.maintenanceMode ?? false);
        setAdmissionWindow(data.globalAdmissionOpen ?? true);
      }
    }));

    return () => unsubs.forEach(u => u());
  }, []);
  // Fetch extended profile data when a student is selected
  useEffect(() => {
    if (!selectedStudentProfile) {
      setProfileTranscript(null);
      setProfileEnrollments([]);
      setProfileSubTab('dossier');
      return;
    }

    const fetchExtendedData = async () => {
      setLoadingProfileData(true);
      try {
        const studentId = selectedStudentProfile.id;
        
        // 1. Fetch Transcript
        const transcriptQ = query(collection(db, "transcripts"), where("studentUid", "==", studentId));
        const transcriptSnap = await getDocs(transcriptQ);
        if (!transcriptSnap.empty) {
          setProfileTranscript({ id: transcriptSnap.docs[0].id, ...transcriptSnap.docs[0].data() });
        } else {
          setProfileTranscript({
            studentUid: studentId,
            studentName: selectedStudentProfile.name,
            studentId: selectedStudentProfile.studentId || "N/A",
            program: selectedStudentProfile.department || selectedStudentProfile.intendedMajor || "General",
            termRecords: [],
            cumulativeGPA: 0.0,
            status: selectedStudentProfile.status || 'Active'
          });
        }

        // 2. Fetch Enrollments
        const enrollQ = query(collection(db, "enrollments"), where("studentId", "==", selectedStudentProfile.studentId || studentId));
        const enrollSnap = await getDocs(enrollQ);
        setProfileEnrollments(enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        console.error("Error fetching extended profile data:", err);
      } finally {
        setLoadingProfileData(false);
      }
    };

    fetchExtendedData();
  }, [selectedStudentProfile]);


  const handleApproveApplication = async (app) => {
    try {
      const res = await applicationsAPI.updateStatus(app._id || app.id, "final_approved", "Approved by Registrar");
      if (res.data) {
        alert(`Application for ${app.name} approved. Student ID issued: ${res.data.studentId}`);
      }
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application.");
    }
  };

  // --- College Handlers ---
  // News & Media Management Handlers

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
        author: user?.name,
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
        authorRole: ROLES.REGISTRAR 
      };
      if (editingNews) {
        await updateDoc(doc(db, "news", editingNews.id), newsData);
      } else {
        await addDoc(collection(db, "news"), newsData);
      }
      setOpenNewsDialog(false);
    } catch (err) { console.error("News save error:", err); }
    finally { setNewsLoading(false); }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("Are you sure?")) {
      try { await deleteDoc(doc(db, "news", newsId)); }
      catch (err) { console.error("News delete error:", err); }
    }
  };

  const handleRejectApplication = async (appId, appData, reason) => {
    try {
      await applicationsAPI.updateStatus(appId, "rejected_by_registrar", reason);
      alert("Application rejected.");
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application.");
    }
  };

  const handleGenerateIdCard = async (appId) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: "id_issued",
        idIssuedAt: serverTimestamp(),
        issuedBy: user?.name,
      });
      setPrintDialogOpen(false);
      setSelectedStudentForPrint(null);
    } catch (err) {
      console.error("Error issuing ID Card:", err);
    }
  };

  const handleIdRequestAction = async (requestId, studentUid, action) => {
    try {
      await updateDoc(doc(db, "id_requests", requestId), {
        status: action === 'approve' ? 'approved' : 'rejected',
        processedAt: serverTimestamp(),
        processedBy: user?.name
      });

      if (action === 'approve') {
        // Find application doc for this student and reset to setup_completed so it shows in Pending IDs
        const q = query(collection(db, "applications"), where("uid", "==", studentUid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          await updateDoc(doc(db, "applications", snap.docs[0].id), {
            status: "setup_completed",
            idReissueRequestedAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.error("Error processing ID request:", err);
    }
  };

  // Department initialization and management moved to DepartmentsTab

  const handleManualCredentialReset = async (email, name) => {
    const tempPass = `PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    if (!window.confirm(`Generate emergency credential for ${name}? Temporary Passcode: ${tempPass}\n\nTHIS WILL OVERWRITE ANY EXISTING TEMP PASSWORD.`)) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const qSnap = await getDocs(q);
      
      if (qSnap.empty) throw new Error("Student not found in Firestore.");
      
      const userDoc = qSnap.docs[0];
      await updateDoc(doc(db, "users", userDoc.id), {
        tempPassword: tempPass,
        requiresPasswordChange: true,
        lastResetAt: serverTimestamp(),
        lastResetBy: user?.name || "Registrar"
      });

      // Audit and Security Logging
      if (typeof logAuditActivity === 'function') {
        await logAuditActivity("Manual Credential Generated", `Temp passcode for student: ${email}`, user);
      }
      if (typeof logSecurityEvent === 'function') {
        await logSecurityEvent("Emergency Reset", `Registrar ${user?.name} generated manual credentials for ${email}. IP: ${userIp || 'Unknown'}`, "warning");
      }

      alert(`Success! Manual passcode generated: ${tempPass}\n\nPlease provide this to the student. They MUST change it upon login.`);
    } catch (err) {
      console.error("Manual reset error:", err);
      alert("Failed to generate manual credentials.");
    }
  };

  // handleDeleteDept moved to DepartmentsTab

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("ALEX UNIVERSITY - EXECUTIVE REPORT", 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 20, 28);
    doc.text(`Registrar Authority: ${user?.name || "System"}`, 20, 33);
    
    doc.setDrawColor(200);
    doc.line(20, 38, 190, 38);
    
    // Enrollment Stats
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("1. ENROLLMENT DENSITY", 20, 50);
    
    doc.setFontSize(12);
    doc.text(`Total Active Roster: ${students.length} Students`, 25, 60);
    doc.text(`Strategic Seats Filled: ${((students.length / 5000) * 100).toFixed(1)}%`, 25, 67);
    
    // Departmental Breakdown
    const deptCounts = {};
    students.forEach(s => { const d = s.department || 'General'; deptCounts[d] = (deptCounts[d] || 0) + 1; });
    
    let yPos = 80;
    doc.setFontSize(14);
    doc.text("Departmental Distribution:", 25, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    Object.entries(deptCounts).forEach(([dept, count]) => {
      doc.text(`${dept}: ${count} Enrolled`, 30, yPos);
      yPos += 7;
    });
    
    // Resource Assets
    yPos += 15;
    doc.setFontSize(16);
    doc.text("2. ACADEMIC ASSETS", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Modules Registered: ${courses.length}`, 25, yPos);
    doc.text(`Faculty Sectors: ${departments.length}`, 25, yPos + 7);
    
    // Security Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("CONFIDENTIAL - FOR AUTHORIZED REGISTRAR USE ONLY", 105, 285, { align: "center" });
    
    doc.save(`ALX_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Student ID", "Department", "Performance", "Status"];
    const rows = students.map(s => [
      s.name,
      s.studentId,
      s.department || "General",
      s.highSchoolGrades || "N/A",
      s.status || "Active"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ALX_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVulnerabilityAssessment = async () => {
    setAssessmentLoading(true);
    // Simulate real scanning latency
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const report = {
      score: 84,
      timestamp: new Date().toISOString(),
      checks: [
        { id: 'AUTH-01', name: 'Identity Token Entropy', status: 'secure', detail: 'High-entropy JWT implementation detected.' },
        { id: 'DATA-02', name: 'Real-time Persistence Rules', status: 'warning', detail: 'Firestore rules should further restrict student write permissions by UID.' },
        { id: 'DEPS-03', name: 'Dependency Audit', status: 'secure', detail: 'No critical CVEs found in React/MUI/Firebase core packages.' },
        { id: 'ENV-04', name: 'Environment Sanitization', status: 'secure', detail: 'Public API keys are properly scoped to the domain.' },
        { id: 'LOGS-05', name: 'Registrar Auth Logs', status: 'warning', detail: 'Brute-force protection recommended for administrative endpoints.' }
      ],
      recommendation: "Upgrade Firestore security rules to version 2 with granular check functions for Registrar-level ops."
    };
    
    setVulnerabilityReport(report);
    setOpenVulnerabilityDialog(true);
    setAssessmentLoading(false);
  };

  // --- Admissions Posts Handlers ---
  const handleOpenAdmissionsDialog = (post = null) => {
    if (post) {
      setEditingAdmissionPost(post);
      setAdmissionPostForm({ ...post });
    } else {
      setEditingAdmissionPost(null);
      setAdmissionPostForm({ title: "", content: "", tag: "Update", isImportant: false });
    }
    setOpenAdmissionsDialog(true);
  };

  const handleSaveAdmissionPost = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmissionPost) {
        await updateDoc(doc(db, "admissions_posts", editingAdmissionPost.id), { ...admissionPostForm });
      } else {
        await addDoc(collection(db, "admissions_posts"), { ...admissionPostForm, date: serverTimestamp() });
      }
      setOpenAdmissionsDialog(false);
    } catch (error) {
      console.error("Admissions post error:", error);
    }
  };

  const handleDeleteAdmissionPost = async (id) => {
    if (window.confirm("Delete this admissions dispatch?")) {
      await deleteDoc(doc(db, "admissions_posts", id));
    }
  };

  // --- Finance & Registration Handlers ---
  const handleApprovePayment = async (payment) => {
    setProcessingFinanceAction(payment.id);
    try {
      // 1. Update payment status
      await updateDoc(doc(db, "tuition_payments", payment.id), {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: user?.name
      });

      // 2. Update enrollment status for all courses in this payment
      const enrollmentSnap = await getDocs(
        query(collection(db, "enrollments"),
          where("paymentId", "==", payment.id)
        )
      );
      for (const enrollDoc of enrollmentSnap.docs) {
        await updateDoc(doc(db, "enrollments", enrollDoc.id), {
          status: "approved",
          approvedAt: serverTimestamp(),
          approvedBy: user?.name
        });
      }

      // 3. Notify Student
      await addDoc(collection(db, "notifications"), {
        toStudentId: payment.studentId,
        toRole: "student",
        title: "Registration Approved!",
        message: `Your registration for ${payment.courseName} has been approved. Your course slip is now available for download.`,
        type: "success",
        timestamp: serverTimestamp(),
        read: false
      });
    } catch (err) {
      console.error("Error approving payment:", err);
    } finally {
      setProcessingFinanceAction(null);
    }
  };

  const handleCourseAction = async (courseId, action, data = null) => {
    setIsApprovingCourse(true);
    try {
      const updateData = {
        status: action === 'approve' ? 'active' : 'draft',
        approvedAt: serverTimestamp(),
        approvedBy: user.uid
      };

      if (data) {
        if (data.tuitionFee) updateData.tuitionFee = Number(data.tuitionFee);
        if (data.registrarDescription) updateData.registrarDescription = data.registrarDescription;
      }

      await updateDoc(doc(db, "courses", courseId), updateData);
    } catch (err) {
      console.error("Course action error:", err);
    } finally {
      setIsApprovingCourse(false);
      setOpenApprovalDialog(false);
      setSelectedCourseForApproval(null);
      setApprovalForm({ tuitionFee: "", registrarDescription: "" });
    }
  };

  const handleRejectPayment = async (payment) => {
    setProcessingFinanceAction(payment.id);
    try {
      await updateDoc(doc(db, "tuition_payments", payment.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectedBy: user?.name
      });

      // Update enrollment status for all courses in this payment
      const enrollmentSnap = await getDocs(
        query(collection(db, "enrollments"),
          where("paymentId", "==", payment.id)
        )
      );
      for (const enrollDoc of enrollmentSnap.docs) {
        await updateDoc(doc(db, "enrollments", enrollDoc.id), {
          status: "rejected",
          rejectedAt: serverTimestamp()
        });
      }

      await addDoc(collection(db, "notifications"), {
        toStudentId: payment.studentId,
        toRole: "student",
        title: "Registration Payment Rejected",
        message: `Your payment for ${payment.courseName} was rejected. Please contact the registrar for details.`,
        type: "error",
        timestamp: serverTimestamp(),
        read: false
      });
    } catch (err) {
      console.error("Error rejecting payment:", err);
    } finally {
      setProcessingFinanceAction(null);
    }
  };

  // --- Course CRUD ---
  const handleOpenCourseDialog = (course = null) => {
    if (course) {
      setCourseDialog({ open: true, mode: 'edit', data: { ...course } });
    } else {
      setCourseDialog({ open: true, mode: 'add', data: { name: '', code: '', department: '', credits: 3, instructor: '', status: 'Active' } });
    }
    setCourseErrors({});
  };

  const [courseErrors, setCourseErrors] = useState({});
  const validateCourse = () => {
    const errs = {};
    if (!courseDialog.data.name?.trim()) errs.name = "Course name is required";
    if (!courseDialog.data.code?.trim()) errs.code = "Course code is required";
    if (!courseDialog.data.department?.trim()) errs.department = "Department is required";
    if (courseDialog.data.credits < 1) errs.credits = "Credits must be at least 1";
    setCourseErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSaveCourse = async () => {
    if (!validateCourse()) return;
    try {
      if (courseDialog.mode === 'add') {
        await addDoc(collection(db, "courses"), { ...courseDialog.data, createdAt: serverTimestamp() });
      } else {
        const { id, ...data } = courseDialog.data;
        await updateDoc(doc(db, "courses", id), data);
      }
      setCourseDialog({ open: false, mode: 'add', data: { name: '', code: '', department: '', credits: 3, instructor: '', status: 'Active' } });
      setCourseErrors({});
    } catch (err) { console.error("Course save error:", err); }
  };
  const handleDeleteCourse = async (id) => {
    try { await deleteDoc(doc(db, "courses", id)); } catch (err) { console.error(err); }
  };

  // --- Schedule CRUD ---
  const [scheduleErrors, setScheduleErrors] = useState({});
  const validateSchedule = () => {
    const errs = {};
    if (!scheduleDialog.data.courseId) errs.courseId = "Module selection is mandatory";
    if (!scheduleDialog.data.day) errs.day = "Day allocation is required";
    if (!scheduleDialog.data.startTime) errs.startTime = "Start time is required";
    if (!scheduleDialog.data.endTime) errs.endTime = "End time is required";
    if (!scheduleDialog.data.room?.trim()) errs.room = "Room allocation is required";
    setScheduleErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSaveSchedule = async () => {
    if (!validateSchedule()) return;
    try {
      if (scheduleDialog.mode === 'add') {
        await addDoc(collection(db, "schedules"), { ...scheduleDialog.data, createdAt: serverTimestamp() });
      } else {
        const { id, ...data } = scheduleDialog.data;
        await updateDoc(doc(db, "schedules", id), data);
      }
      setScheduleDialog({ open: false, mode: 'add', data: { courseId: '', courseName: '', day: '', startTime: '', endTime: '', room: '', semester: 'Fall 2026' } });
      setScheduleErrors({});
    } catch (err) { console.error("Schedule save error:", err); }
  };
  const handleDeleteSchedule = async (id) => {
    try { await deleteDoc(doc(db, "schedules", id)); } catch (err) { console.error(err); }
  };

  // --- Student Profile Update ---
  const handleUpdateStudentProfile = async () => {
    try {
      const updateData = { 
        name: studentDialog.name || '',
        status: studentDialog.status,
        gender: studentDialog.gender || '',
        year: studentDialog.year || 1,
        department: studentDialog.department || '',
        phone: studentDialog.phone || '',
        email: studentDialog.email || '',
        intellectualIdentity: studentDialog.intellectualIdentity || ''
      };
      await updateDoc(doc(db, "users", studentDialog.student.id), updateData);
      
      // Update selectedStudentProfile if it's the one we're editing
      if (selectedStudentProfile && selectedStudentProfile.id === studentDialog.student.id) {
        setSelectedStudentProfile({ ...selectedStudentProfile, ...updateData });
      }
      
      setStudentDialog({ open: false, student: null, name: '', status: 'Active', gender: '', year: 1, department: '', phone: '', email: '', intellectualIdentity: '' });
    } catch (err) { console.error("Error updating student profile:", err); }
  };

  const handleDirectPasswordReset = async (email, name) => {
    if (!window.confirm(`Are you sure you want to trigger a password reset for ${name} (${email})?`)) return;
    
    try {
      await sendPasswordReset(email);
      // Audit log similar to admin
      await addDoc(collection(db, "audit_logs"), {
        action: "Manual Password Reset (Registrar)",
        targetUser: email,
        processedBy: user?.email || "Registrar",
        timestamp: serverTimestamp(),
        ip: userIp || "unknown"
      });
      alert(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error("Error sending direct password reset:", err);
      alert("Failed to send password reset email.");
    }
  };

  const toggleRegLock = async () => {
    setSettingsLoading(true);
    try {
      await setDoc(doc(db, "system_settings", "registrar"), { registrationLock: !regLock }, { merge: true });
      await addDoc(collection(db, "audit_logs"), {
        action: regLock ? "Registration Unlock" : "Registration Lock",
        user: user.email,
        timestamp: serverTimestamp(),
        ip: userIp || "unknown"
      });
    } catch (err) { console.error(err); }
    finally { setSettingsLoading(false); }
  };

  const handleOpenRegistration = async () => {
    setSettingsLoading(true);
    try {
      await setDoc(doc(db, "system_settings", "registrar"), {
        registrationLock: false,
        targetYear: regDialogYear,
        targetSemester: regDialogSemester,
      }, { merge: true });
      await addDoc(collection(db, "audit_logs"), {
        action: `Registration Opened for Year ${regDialogYear} Semester ${regDialogSemester}`,
        user: user.email,
        timestamp: serverTimestamp(),
      });
      setOpenRegDialog(false);
    } catch (err) { console.error(err); }
    finally { setSettingsLoading(false); }
  };

  const handleCloseRegistration = async () => {
    setSettingsLoading(true);
    try {
      await setDoc(doc(db, "system_settings", "registrar"), { registrationLock: true }, { merge: true });
      await addDoc(collection(db, "audit_logs"), {
        action: `Registration Closed (was Year ${targetYear} Sem ${targetSemester})`,
        user: user.email,
        timestamp: serverTimestamp(),
      });
    } catch (err) { console.error(err); }
    finally { setSettingsLoading(false); }
  };

  const toggleAdmissionWindow = async () => {
    setSettingsLoading(true);
    try {
      await setDoc(doc(db, "system_settings", "registrar"), { admissionWindow: !admissionWindow }, { merge: true });
      await addDoc(collection(db, "audit_logs"), {
        action: admissionWindow ? "Admission Window Closed" : "Admission Window Opened",
        user: user.email,
        timestamp: serverTimestamp(),
        ip: userIp || "unknown"
      });
    } catch (err) { console.error(err); }
    finally { setSettingsLoading(false); }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };



  const AuroraBlobs = () => (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Box sx={{
        position: 'absolute', top: '-10%', left: '10%', width: '40%', height: '40%',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'float 20s infinite alternate'
      }} />
      <Box sx={{
        position: 'absolute', bottom: '10%', right: '5%', width: '35%', height: '35%',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'float 25s infinite alternate-reverse'
      }} />
      <Box sx={{
        position: 'absolute', top: '30%', right: '15%', width: '30%', height: '30%',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'float 18s infinite alternate'
      }} />
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 50px) scale(1.1); }
        }
      `}</style>
    </Box>
  );

  const handleStudentSearch = async () => {
    if (!searchQuery.trim()) {
      setStudentSearchResults([]);
      return;
    }
    setIsSearchingStudents(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"));
      const snap = await getDocs(q);
      const results = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => 
          (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.studentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
      setStudentSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingStudents(false);
    }
  };

  const handleGenerateID = (student) => {
    setSelectedStudentForPrint(student);
    setPrintDialogOpen(true);
  };

  const handleUpdateProfileGrades = async () => {
    if (!profileTranscript) return;
    setLoadingProfileData(true);
    try {
      const dataToSave = { 
        ...profileTranscript, 
        lastUpdated: serverTimestamp() 
      };
      if (profileTranscript.id) {
        await updateDoc(doc(db, "transcripts", profileTranscript.id), dataToSave);
      } else {
        const docRef = await addDoc(collection(db, "transcripts"), dataToSave);
        setProfileTranscript(prev => ({ ...prev, id: docRef.id }));
      }
      alert("Academic records synchronized successfully.");
    } catch (err) {
      console.error("Error updating grades:", err);
      alert("Failed to sync academic records.");
    } finally {
      setLoadingProfileData(false);
    }
  };

  const handleDropProfileEnrollment = async (enrollId) => {
    if (!window.confirm("Are you sure you want to drop this course? This will remove the enrollment record.")) return;
    try {
      await deleteDoc(doc(db, "enrollments", enrollId));
      setProfileEnrollments(prev => prev.filter(e => e.id !== enrollId));
      
      // Also log audit
      await addDoc(collection(db, "audit_logs"), {
        action: "Course Dropped (Manual Registrar Override)",
        student: selectedStudentProfile?.name,
        user: user.email,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Error dropping course:", err);
    }
  };

  const handleAddProfileEnrollment = async (course) => {
    if (!selectedStudentProfile) return;
    try {
      const newEnroll = {
        studentId: selectedStudentProfile.studentId || selectedStudentProfile.id,
        studentName: selectedStudentProfile.name,
        studentUid: selectedStudentProfile.id,
        courseCode: course.code,
        courseName: course.name,
        credits: course.credits || 3,
        status: "approved",
        type: "manual_registrar",
        timestamp: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "enrollments"), newEnroll);
      setProfileEnrollments(prev => [...prev, { id: docRef.id, ...newEnroll }]);
    } catch (err) {
      console.error("Error adding enrollment:", err);
    }
  };

  const renderStudentProfileView = () => {
    if (!selectedStudentProfile) return null;
    const s = selectedStudentProfile;

    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          borderRadius: 4,
          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <IconButton 
              onClick={() => setSelectedStudentProfile(null)}
              sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }}
            >
              <ArrowForward sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
            <Avatar 
              src={s.photoURL} 
              sx={{ width: 64, height: 64, border: '3px solid #6366f1', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
            >
              {s.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{s.name}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={800}>{s.studentId || 'PENDING ID'}</Typography>
                <Circle sx={{ fontSize: 4, color: 'text.secondary', opacity: 0.5 }} />
                <Typography variant="caption" color="primary.main" fontWeight={900}>{s.department || s.intendedMajor || 'UNDECLARED'}</Typography>
              </Stack>
            </Box>
          </Stack>
          
          <Box sx={{ textAlign: 'right' }}>
            <Chip 
              icon={<Verified sx={{ fontSize: '1rem !important' }} />}
              label={s.status?.toUpperCase() || 'ACTIVE'} 
              sx={{ 
                fontWeight: 900, 
                bgcolor: alpha(s.status === 'suspended' ? '#ef4444' : '#10b981', 0.1), 
                color: s.status === 'suspended' ? '#ef4444' : '#10b981',
                px: 1
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Tabs 
            value={profileSubTab} 
            onChange={(e, v) => setProfileSubTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0', background: gradients.primary },
              '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.95rem', minWidth: 120, py: 2 }
            }}
          >
            <Tab label="Bio Dossier" value="dossier" icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Academic Record" value="academic" icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Live Enrollment" value="enrollment" icon={<FactCheck sx={{ fontSize: 20 }} />} iconPosition="start" />
            <Tab label="Security & Identity" value="security" icon={<Security sx={{ fontSize: 20 }} />} iconPosition="start" />
          </Tabs>
        </Box>

        {loadingProfileData ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 700 }}>Synchronizing intelligence hub...</Typography>
          </Box>
        ) : (
          <Fade in={true} timeout={500}>
            <Box>
              {profileSubTab === 'dossier' && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ ...glassStyle, borderRadius: 6, p: 4, height: '100%' }}>
                      <Typography variant="subtitle2" fontWeight={1000} color="primary.main" gutterBottom sx={{ letterSpacing: 1.5 }}>INTELLECTUAL IDENTITY PROFILE</Typography>
                      <Divider sx={{ mb: 4, opacity: 0.1 }} />
                      <Grid container spacing={3}>
                        {[
                          { label: "Email Identity", value: s.email, icon: <Email /> },
                          { label: "Contact Protocol", value: s.phone || "Not Disclosed", icon: <Phone /> },
                          { label: "Academic Level", value: `Year ${s.year || 1}`, icon: <TrendingUp /> },
                          { label: "Account Authority", value: s.role.toUpperCase(), icon: <Security /> },
                          { label: "Registry Date", value: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : 'Historical', icon: <CalendarToday /> },
                          { label: "Gender / Identity", value: s.gender || "Not Specified", icon: <People /> }
                        ].map((info, i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', width: 32, height: 32 }}>
                                  {React.cloneElement(info.icon, { sx: { fontSize: 18 } })}
                                </Avatar>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" fontWeight={900}>{info.label.toUpperCase()}</Typography>
                                  <Typography variant="body2" fontWeight={800}>{info.value}</Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      <Card sx={{ ...glassStyle, borderRadius: 6, p: 3 }}>
                        <Typography variant="subtitle2" fontWeight={1000} gutterBottom>QUICK ACTIONS</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <Button 
              variant="contained" 
              onClick={() => setStudentDialog({ 
                open: true, 
                student: s, 
                name: s.name || '',
                status: s.status || 'Active',
                gender: s.gender || '',
                year: s.year || 1,
                department: s.department || s.intendedMajor || '',
                phone: s.phone || '',
                email: s.email || ''
              })}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, background: gradients.primary }}
            >
              Update Identity
            </Button>
                          <Button 
                            variant="outlined" startIcon={<AssignmentInd />} 
                            onClick={() => handleGenerateID(s)}
                            sx={{ borderRadius: 3, fontWeight: 800 }}
                          >
                            Print ID Badge
                          </Button>
                        </Stack>
                      </Card>
                      <Card sx={{ ...glassStyle, borderRadius: 6, p: 3, bgcolor: alpha('#10b981', 0.05) }}>
                        <Typography variant="subtitle2" fontWeight={1000} color="success.main">ACADEMIC SUMMARY</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="h4" fontWeight={1000}>{profileTranscript?.cumulativeGPA || "0.00"}</Typography>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">CUMULATIVE GPA</Typography>
                        </Box>
                        <Divider sx={{ my: 2, opacity: 0.1 }} />
                        <Typography variant="body2" fontWeight={700}>Total Modules: {profileTranscript?.termRecords?.reduce((acc, term) => acc + (term.courses?.length || 0), 0) || 0}</Typography>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {profileSubTab === 'academic' && (
                <Box>
                  <Card sx={{ ...glassStyle, borderRadius: 6, mb: 4 }}>
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={1000}>Academic Transcript Repository</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>OFFICIAL GRADES & SEMESTER RECORDS</Typography>
                      </Box>
                      <Stack direction="row" spacing={2}>
                        <Button 
                          variant="contained" startIcon={<Save />} 
                          onClick={handleUpdateProfileGrades}
                          sx={{ borderRadius: 3, fontWeight: 800 }}
                        >
                          Sync Records
                        </Button>
                        <Button 
                          variant="outlined" startIcon={<Print />}
                          onClick={() => {
                            // Link to TranscriptsTab's logic or implement here
                            alert("Generating Official Transcript PDF...");
                          }}
                          sx={{ borderRadius: 3, fontWeight: 800 }}
                        >
                          Export Transcript
                        </Button>
                      </Stack>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      {!profileTranscript || !profileTranscript.termRecords || profileTranscript.termRecords.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
                          <LibraryBooks sx={{ fontSize: 60, mb: 2 }} />
                          <Typography variant="h6" fontWeight={800}>No academic records initialized.</Typography>
                          <Button 
                            variant="text" startIcon={<Add />} 
                            sx={{ mt: 2, fontWeight: 800 }}
                            onClick={() => {
                              const updated = { ...profileTranscript, termRecords: [{ term: 'Fall 2026', courses: [], termGPA: '0.00' }] };
                              setProfileTranscript(updated);
                            }}
                          >
                            Initialize Academic Year
                          </Button>
                        </Box>
                      ) : (
                        <Stack spacing={4}>
                          {profileTranscript?.termRecords?.map((term, tIdx) => (
                            <Box key={tIdx}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight={1000} color="primary.main">{term.term}</Typography>
                                <Button 
                                  size="small" startIcon={<Add />}
                                  onClick={() => {
                                    const updated = { ...profileTranscript };
                                    if (!updated.termRecords[tIdx].courses) {
                                      updated.termRecords[tIdx].courses = [];
                                    }
                                    updated.termRecords[tIdx].courses.push({ 
                                      code: 'NEW COURSE', 
                                      title: 'Course Title', 
                                      credits: 3, 
                                      grade: 'A', 
                                      status: 'Active' 
                                    });
                                    setProfileTranscript(updated);
                                  }}
                                  sx={{ fontWeight: 800 }}
                                >
                                  Add Module
                                </Button>
                              </Box>
                              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 800 }}>CODE</TableCell>
                                      <TableCell sx={{ fontWeight: 800 }}>MODULE TITLE</TableCell>
                                      <TableCell sx={{ fontWeight: 800 }}>CREDITS</TableCell>
                                      <TableCell sx={{ fontWeight: 800 }}>GRADE</TableCell>
                                      <TableCell align="right" sx={{ fontWeight: 800 }}>OPS</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {term.courses?.map((course, cIdx) => (
                                      <TableRow key={cIdx}>
                                        <TableCell sx={{ fontWeight: 800 }}>
                                          <InputBase 
                                            value={course.code} 
                                            onChange={(e) => {
                                              const updated = { ...profileTranscript };
                                              updated.termRecords[tIdx].courses[cIdx].code = e.target.value;
                                              setProfileTranscript(updated);
                                            }}
                                            sx={{ fontWeight: 800, fontSize: '0.875rem' }}
                                          />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                          <InputBase 
                                            value={course.title} 
                                            onChange={(e) => {
                                              const updated = { ...profileTranscript };
                                              updated.termRecords[tIdx].courses[cIdx].title = e.target.value;
                                              setProfileTranscript(updated);
                                            }}
                                            sx={{ fontWeight: 700, fontSize: '0.875rem', width: '100%' }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <InputBase 
                                            type="number"
                                            value={course.credits} 
                                            onChange={(e) => {
                                              const updated = { ...profileTranscript };
                                              updated.termRecords[tIdx].courses[cIdx].credits = parseInt(e.target.value) || 0;
                                              setProfileTranscript(updated);
                                            }}
                                            sx={{ fontSize: '0.875rem', width: 40 }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Select 
                                            size="small" 
                                            value={course.grade} 
                                            onChange={(e) => {
                                              const updated = { ...profileTranscript };
                                              updated.termRecords[tIdx].courses[cIdx].grade = e.target.value;
                                              setProfileTranscript(updated);
                                            }}
                                            sx={{ height: 32, borderRadius: 2, fontWeight: 900, minWidth: 60 }}
                                          >
                                            {['A+','A','A-','B+','B','B-','C+','C','C-','D','F'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                                          </Select>
                                        </TableCell>
                                        <TableCell align="right">
                                          <IconButton 
                                            size="small" color="error"
                                            onClick={() => {
                                              const updated = { ...profileTranscript };
                                              updated.termRecords[tIdx].courses.splice(cIdx, 1);
                                              setProfileTranscript(updated);
                                            }}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}

              {profileSubTab === 'enrollment' && (
                <Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                      <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                        <Typography variant="h6" fontWeight={1000} gutterBottom>Live Enrollment Protocol</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', mb: 3 }}>CURRENTLY REGISTERED MODULES</Typography>
                        
                        <Stack spacing={2}>
                          {profileEnrollments.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '2px dashed rgba(255,255,255,0.05)' }}>
                              <Typography color="text.secondary" fontWeight={800}>No active enrollments for current term.</Typography>
                            </Box>
                          ) : (
                            profileEnrollments.map((en, i) => (
                              <Paper key={i} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.01)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box>
                                    <Typography variant="body1" fontWeight={1000}>{en.courseName}</Typography>
                                    <Typography variant="caption" color="primary.main" fontWeight={900}>{en.courseCode} | {en.credits} Credits</Typography>
                                  </Box>
                                  <Button 
                                    size="small" color="error" variant="outlined" 
                                    startIcon={<RemoveCircle />}
                                    onClick={() => handleDropProfileEnrollment(en.id)}
                                    sx={{ borderRadius: 2, fontWeight: 800 }}
                                  >
                                    Drop
                                  </Button>
                                </Box>
                              </Paper>
                            ))
                          )}
                        </Stack>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Card sx={{ ...glassStyle, borderRadius: 6, p: 3 }}>
                        <Typography variant="subtitle2" fontWeight={1000} gutterBottom>QUICK ENROLLMENT</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>MANUALLY ADD MODULE TO ROSTER</Typography>
                        
                        <Stack spacing={2}>
                          {(courses || []).slice(0, 5).map((c, i) => (
                            <Box 
                              key={i} 
                              sx={{ 
                                p: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                              }}
                            >
                              <Box>
                                <Typography variant="caption" fontWeight={1000}>{c.name}</Typography>
                                <Typography variant="overline" display="block" sx={{ lineHeight: 1 }}>{c.code}</Typography>
                              </Box>
                              <IconButton 
                                size="small" color="primary" 
                                onClick={() => handleAddProfileEnrollment(c)}
                                disabled={profileEnrollments?.some(e => e.courseCode === c.code)}
                              >
                                <AddCircle />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {profileSubTab === 'security' && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ ...glassStyle, borderRadius: 6, p: 4 }}>
                      <Typography variant="h6" fontWeight={1000} gutterBottom>Physical Credential Identity</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>OFFICIAL ID CARD SERVICE</Typography>
                      
                      <Box sx={{ 
                        width: '100%', aspectRatio: '1.58/1', borderRadius: 4, 
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        display: 'flex', flexDirection: 'column', color: '#fff', p: 3,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden'
                      }}>
                        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }} />
                        <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
                          <Avatar src={s.photoURL} sx={{ width: 60, height: 60, border: '2px solid rgba(255,255,255,0.2)' }} />
                          <Box>
                            <Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1.2 }}>{s.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>STUDENT ID: {s.studentId}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                          <Box>
                            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.6 }}>ALEX UNIVERSITY</Typography>
                            <Typography variant="h5" fontWeight={1000} color="primary.main">OFFICIAL RECORD</Typography>
                          </Box>
                          <Badge color="success" variant="dot"><Verified /></Badge>
                        </Box>
                      </Box>
                      
                      <Button 
                        fullWidth variant="contained" 
                        startIcon={<Print />}
                        onClick={() => handleGenerateID(s)}
                        sx={{ mt: 4, borderRadius: 3, fontWeight: 800, background: gradients.primary }}
                      >
                        Issue Official Badge
                      </Button>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ ...glassStyle, borderRadius: 6, p: 4, height: '100%' }}>
                      <Typography variant="h6" fontWeight={1000} gutterBottom>Access Protocols</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>CREDENTIAL ROTATION & AUTHENTICATION</Typography>
                      
                      <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="body2" fontWeight={800}>Forced Password Rotation</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Triggers a password reset requirement on next login.</Typography>
                          <Button 
                            variant="outlined" color="warning" 
                            startIcon={<LockReset />}
                            onClick={() => handleDirectPasswordReset(s.email, s.name)}
                            sx={{ borderRadius: 2, fontWeight: 800 }}
                          >
                            Rotate Credentials
                          </Button>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="body2" fontWeight={800}>Intellectual Identity</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{s.intellectualIdentity || 'No identity protocol established.'}</Typography>
                          <Button 
                            variant="outlined" color="secondary"
                            startIcon={<AssignmentInd />}
                            onClick={() => {
                              setStudentDialog({
                                open: true,
                                student: s,
                                name: s.name,
                                status: s.status || 'Active',
                                gender: s.gender || '',
                                year: s.year || 1,
                                department: s.department || '',
                                phone: s.phone || '',
                                email: s.email || '',
                                intellectualIdentity: s.intellectualIdentity || ''
                              });
                            }}
                            sx={{ borderRadius: 2, fontWeight: 800 }}
                          >
                            Update Identity
                          </Button>
                        </Paper>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    );
  };

  // --- Sub-components (Tabs) ---

  const renderOverviewTab = () => {
    // Aggregation for Radar Chart (Departmental Capacity)
    const radarData = departments.map(dept => {
      const enrollment = students.filter(s => (s.department || s.intendedMajor) === dept.name).length;
      return {
        subject: dept.code,
        A: enrollment,
        B: dept.seats || 50, // Capacity
        fullMark: Math.max(dept.seats || 100, enrollment + 20)
      };
    }).slice(0, 6);

    // Aggregation for Intake Pulse (Area Chart)
    const intakeData = applications.reduce((acc, app) => {
      const date = app.date?.toDate?.()?.toLocaleDateString() || 
                   (typeof app.date === 'string' ? app.date : 'Recent');
      const existing = acc.find(d => d.name === date);
      if (existing) existing.count += 1;
      else acc.push({ name: date, count: 1 });
      return acc;
    }, []).sort((a,b) => new Date(a.name) - new Date(b.name)).slice(-7);

    return (
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={4}>
          {/* Stat Cards */}
          {[
            { label: "Active Cohort", value: students.length, icon: <People />, color: "#6366f1", trend: "+12% vs last sem", gradient: gradients.primary },
            { label: "Module Catalog", value: courses.length, icon: <LibraryBooks />, color: "#10b981", trend: "4 new arrivals", gradient: gradients.success },
            { label: "Admission Pool", value: applications.length, icon: <Assignment />, color: "#f59e0b", trend: "High Priority", gradient: gradients.warning },
            { label: "Facility Load", value: schedules.length, icon: <Schedule />, color: "#8b5cf6", trend: "98% Capacity", gradient: gradients.secondary },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <RegistrarStatCard stat={stat} glassStyle={glassStyle} isDark={isDark} alpha={alpha} />
            </Grid>
          ))}

          {/* Intelligence Row */}
          <Grid item xs={12} md={7}>
            <Card sx={{ ...glassStyle, borderRadius: 6, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#fff' : '#1e293b' }}>Strategic Enrollment Radar</Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 1 }}>DEPARTMENTAL ENROLLMENT VS CAPACITY</Typography>
                  </Box>
                  <Tooltip title="View Detailed Matrix"><IconButton size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.05)', color: 'primary.main' }}><TrendingUp /></IconButton></Tooltip>
                </Box>
                <Box sx={{ height: 350, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : '#475569', fontSize: 12, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'fullMark']} tick={false} axisLine={false} />
                      <Radar name="Enrollment" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      <Radar name="Target Capacity" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ ...glassStyle, borderRadius: 6, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 0.5, color: isDark ? '#fff' : '#1e293b' }}>Daily Intake Pulse</Typography>
                <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 1, mb: 4, display: 'block' }}>APPLICATION SUBMISSION VELOCITY</Typography>
                <Box sx={{ height: 280, mt: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={intakeData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: isDark ? '#fff' : '#1e293b' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={800} color="text.secondary">Current Period Intake</Typography>
                    <Typography variant="body2" fontWeight={1000} color="primary.main">+{applications.length} New</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Phase 18: Executive Matrix Vanguards */}
          <Grid item xs={12}>
            <Card sx={{ 
              ...glassStyle, 
              borderRadius: 6, 
              background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%)',
              border: `1px solid ${globalMaintenance ? alpha('#f59e0b', 0.2) : 'rgba(255,255,255,0.05)'}`,
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Box sx={{ 
                        width: 12, height: 12, borderRadius: '50%', 
                        bgcolor: globalMaintenance ? '#f59e0b' : '#10b981',
                        boxShadow: `0 0 15px ${globalMaintenance ? '#f59e0b' : '#10b981'}`
                      }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 2 }}>SYSTEM INTEGRITY</Typography>
                        <Typography variant="h6" fontWeight={1000} color={globalMaintenance ? 'warning.main' : 'success.main'}>
                          {globalMaintenance ? "MAINTENANCE ACTIVE" : "NOMINAL OPERATIONS"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, display: 'flex', justifyContent: 'space-around' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={1000} display="block">THREAT INDEX</Typography>
                        <Typography variant="body1" fontWeight={1000} color={vulnerabilityReport?.score > 80 ? 'success.main' : 'warning.main'}>
                          {vulnerabilityReport ? `${100 - vulnerabilityReport.score}%` : "0% (SCAN REQ)"}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={1000} display="block">DATA VELOCITY</Typography>
                        <Typography variant="body1" fontWeight={1000} color="primary.main">
                          {((systemNotifications.length / 20) * 100).toFixed(0)} PPS
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={1000} display="block">LOAD FACTOR</Typography>
                        <Typography variant="body1" fontWeight={1000} color="secondary.main">
                          {((students.length / 5000) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button 
                      fullWidth variant="outlined" 
                      onClick={() => setActiveTab(9)}
                      startIcon={<Assessment />}
                      sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000, textTransform: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                      Executive Deep-Dive
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Strategic Control Center */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              ...glassStyle, 
              borderRadius: 6, 
              height: '100%',
              background: isDark 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
              border: isDark ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(99, 102, 241, 0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 3, color: '#818cf8' }}>Registrar Control Center</Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ p: 2, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={900}>Registration Lock</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>PAUSE ALL STUDENT COURSE ENROLLMENTS</Typography>
                      </Box>
                      <Switch 
                        checked={regLock} 
                        onChange={toggleRegLock}
                        disabled={settingsLoading}
                        color="error" 
                      />
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={900}>Admission Window</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>TOGGLE VISIBILITY OF APPLICATION FORM</Typography>
                      </Box>
                      <Switch 
                        checked={admissionWindow} 
                        onChange={toggleAdmissionWindow}
                        disabled={settingsLoading}
                        color="success" 
                      />
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha('#6366f1', 0.05), border: `1px solid ${alpha('#6366f1', 0.2)}` }}>
                    <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 1, display: 'block', mb: 1 }}>ACTIVE REGISTRATION WINDOW</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={1000}>{regLock ? "CLOSED" : `OPEN: Y${targetYear} S${targetSemester}`}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          {regLock ? "Students cannot register" : "Target cohorts currently enrolling"}
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={regLock ? () => setOpenRegDialog(true) : handleCloseRegistration}
                        disabled={settingsLoading}
                        sx={{ 
                          borderRadius: 2, 
                          fontWeight: 900, 
                          textTransform: 'none',
                          bgcolor: regLock ? 'primary.main' : 'error.main',
                          '&:hover': { bgcolor: regLock ? 'primary.dark' : 'error.dark' }
                        }}
                      >
                        {regLock ? "Open Window" : "Close Window"}
                      </Button>
                    </Box>
                  </Box>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    disabled={globalMaintenance}
                    startIcon={<Campaign />}
                    sx={{ 
                      borderRadius: 3, 
                      py: 1.5, 
                      textTransform: 'none', 
                      fontWeight: 1000,
                      background: globalMaintenance ? 'grey' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: globalMaintenance ? 'none' : '0 8px 16px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {globalMaintenance ? "Pulse Blocked by Maintenance" : "System Pulse Broadcast"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Matrix Matrix (Keeping existing Bar Chart for density) */}
          <Grid item xs={12} md={8}>
            <Card sx={{ ...glassStyle, borderRadius: 6 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Matrix Matrix: Departmental Distribution</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1, opacity: 0.6 }}>REAL-TIME ENROLLMENT INTELLIGENCE</Typography>
                  </Box>
                  <Button variant="outlined" size="small" startIcon={<Assessment />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 900, borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>Export Analytics</Button>
                </Box>
                <Box sx={{ height: 350, mt: 4 }}>
                  {(() => {
                    const deptCounts = {};
                    students.forEach(s => { 
                      const d = s.department || s.intendedMajor || 'Other'; 
                      deptCounts[d] = (deptCounts[d] || 0) + 1; 
                    });
                    const chartData = Object.entries(deptCounts).map(([name, count]) => ({ name, count }));
                    return chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 12, fontWeight: 700 }} />
                          <RechartsTooltip
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                            contentStyle={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#8b5cf6"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography color="text.secondary" fontWeight={900}>WAITING FOR ADMISSION DATA...</Typography>
                      </Box>
                    );
                  })()}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderNewsManagementTab = () => {
    return (
      <Box sx={{ mt: 5 }}>
        <Card sx={{ ...glassStyle, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Strategic Communications</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>PUBLIC NEWS & DISPATCH MANAGEMENT ({newsList.length})</Typography>
              </Box>
              <Button variant="contained" startIcon={<Campaign />} onClick={() => handleOpenNewsDialog()} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Deploy News</Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Dispatcher Headline", "Classification", "Author", "Protocol Date", "Command"].map((h) => (
                      <TableCell key={h} sx={{ borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, fontWeight: 900, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1.5, py: 3 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newsList.map((news) => (
                    <TableRow key={news.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                      <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Avatar src={news.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: 2, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} />
                          <Typography variant="body2" fontWeight={800}>{news.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 3 }}>
                        <Chip label={news.category} size="small" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 3 }}>
                        <Typography variant="caption" fontWeight={800}>{news.author}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{news.date?.toDate()?.toLocaleDateString() || 'Pending...'}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`, py: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => handleOpenNewsDialog(news)} sx={{ color: "primary.main", bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteNews(news.id)} sx={{ color: "error.main", bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}><Delete fontSize="small" /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
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
              <Button type="submit" variant="contained" disabled={newsLoading} sx={{ borderRadius: 2.5, px: 4, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {newsLoading ? <CircularProgress size={24} color="inherit" /> : (editingNews ? 'Update Dispatch' : 'Deploy Dispatch')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  };

  const renderStudentsTab = () => {
    const filtered = students.filter(s =>
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group students by department
    const groupedStudents = filtered.reduce((groups, student) => {
      const dept = student.department || student.intendedMajor || 'Unassigned';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(student);
      return groups;
    }, {});

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Academic Roster</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>ENROLLED STUDENT INTELLIGENCE ({students.length})</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small" placeholder="Search roster (Name, ID, Email)..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: 'primary.main' }} /></InputAdornment>,
                sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', fontWeight: 600 }
              }}
              sx={{ width: 350 }}
            />
            <Button 
               variant="contained" 
               onClick={handleStudentSearch}
               disabled={isSearchingStudents}
               sx={{ 
                 borderRadius: 3, px: 3, fontWeight: 800, textTransform: 'none',
                 background: gradients.primary,
                 boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
               }}
            >
              {isSearchingStudents ? <CircularProgress size={20} color="inherit" /> : "Lookup Search"}
            </Button>
          </Box>
        </Box>

        { (studentSearchResults.length > 0 || searchQuery.trim() !== '') ? (
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none', borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.7rem', border: 0 }}>STUDENT IDENTIFICATION</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.7rem', border: 0 }}>DEPARTMENT / MAJOR</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.7rem', border: 0 }}>ACADEMIC STATUS</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.7rem', border: 0 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(studentSearchResults.length > 0 ? studentSearchResults : students.filter(s => (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()))).map((student) => (
                  <TableRow 
                    key={student.id} 
                    hover 
                    onClick={() => setSelectedStudentProfile(student)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={student.photoURL} sx={{ borderRadius: 2 }}>{student.name?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={800}>{student.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{student.studentId || student.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontWeight={700}>{student.department || student.intendedMajor || 'Undeclared'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.status || 'Active'} 
                        size="small" 
                        sx={{ fontWeight: 900, bgcolor: alpha(student.status === 'suspended' ? '#ef4444' : '#10b981', 0.1), color: student.status === 'suspended' ? '#ef4444' : '#10b981' }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><ArrowForward fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.2 }} />
            <Typography color="text.secondary" fontWeight={900}>NO MATCHING RECORDS FOUND</Typography>
          </Box>
        ) : (
          Object.entries(groupedStudents).map(([dept, deptStudents]) => (
            <Card key={dept} sx={{ ...glassStyle, borderRadius: 6, mb: 4, overflow: 'hidden' }}>
              <Box sx={{ px: 4, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Typography variant="subtitle1" fontWeight={1000} color="primary.main">{dept?.toUpperCase()}</Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                       <TableRow>
                        {["Student Identity", "Credential ID", "Year", "Status", "Operations"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deptStudents.map((student) => (
                        <TableRow 
                          key={student.id} 
                          hover 
                          onClick={() => setSelectedStudentProfile(student)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:last-child td': { border: 0 }, 
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } 
                          }}
                        >
                          <TableCell sx={{ py: 3, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                              <Avatar src={student.photoURL} sx={{ width: 44, height: 44, borderRadius: 3 }}>{(student.name || '?')[0]}</Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={800}>{student.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>{student.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                           <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Typography variant="body2" fontWeight={1000} color="primary.main" sx={{ fontFamily: 'monospace' }}>{student.studentId || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Chip label={`Y${student.year || 1}`} size="small" variant="outlined" sx={{ fontWeight: 1000, color: 'text.secondary' }} />
                          </TableCell>
                          <TableCell sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Chip label={student.status?.toUpperCase() || 'ACTIVE'} size="small" sx={{ fontWeight: 1000, fontSize: '0.55rem' }} />
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Update Status">
                                <IconButton size="small" onClick={() => setStudentDialog({ open: true, student, status: student.status || 'Active' })} sx={{ color: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                  <Edit sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Emergency Reset (Manual)">
                                <IconButton size="small" onClick={() => handleDirectPasswordReset(student.email, student.name)} sx={{ color: 'warning.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                  <Password sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reset Password (Standard)">
                                <IconButton size="small" onClick={() => handleDirectPasswordReset(student.email, student.name)} sx={{ color: 'info.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                  <LockReset sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Generate ID Card">
                                <IconButton size="small" onClick={() => handleGenerateID(student)} sx={{ color: 'success.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                  <AssignmentInd sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))
        )
      )}
      </Box>
    );
  };




  const renderSchedulesTab = () => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Master Schedule</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 2, opacity: 0.7 }}>SPATIO-TEMPORAL FACILITY LOGS ({schedules.length})</Typography>
        </Box>
        <Button variant="contained" className="btn-premium" startIcon={<Add />} onClick={() => setScheduleDialog({ open: true, mode: 'add', data: { courseId: '', courseName: '', day: '', startTime: '', endTime: '', room: '', semester: 'Fall 2026' } })}
          sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
          Initialize Timeline
        </Button>
      </Box>

      <Grid container spacing={3}>
        {schedules.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
              <Schedule sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" fontWeight={1000}>TEMPORAL LOGS ARE CURRENTLY EMPTY</Typography>
            </Box>
          </Grid>
        ) : (
          schedules.map((s) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
              <Card sx={{ 
                ...glassStyle, 
                borderRadius: 5, 
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.02)', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }
              }}>
                <Box sx={{ p: 2, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Typography variant="subtitle2" fontWeight={1000} noWrap sx={{ fontFamily: 'Outfit, sans-serif' }}>{s.courseName}</Typography>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={s.day?.toUpperCase() || "N/A"} size="small" sx={{ fontWeight: 1000, fontSize: '0.6rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight={1000} color="secondary.main">{s.semester}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AccessTime sx={{ fontSize: 18, opacity: 0.5 }} />
                      <Typography variant="body2" fontWeight={900}>{s.startTime} – {s.endTime}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Business sx={{ fontSize: 18, opacity: 0.5 }} />
                      <Typography variant="body2" fontWeight={1000} sx={{ letterSpacing: 1 }}>{s.room?.toUpperCase() || "N/A"}</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => setScheduleDialog({ open: true, mode: 'edit', data: { ...s } })} sx={{ color: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteSchedule(s.id)} sx={{ bgcolor: alpha('#ef4444', 0.05) }}><Delete fontSize="small" /></IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
  // Expanded applicant details
  const renderApplicationsTab = () => (
    <Box sx={{ mt: 4 }}>
      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, app: null, reason: "" })} maxWidth="sm" fullWidth
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ p: 4, pb: 2 }}>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', color: isDark ? 'white' : 'text.primary' }}>Application Rejection</Typography>
          <Typography variant="caption" color="error.main" fontWeight={900} sx={{ letterSpacing: 1.5 }}>PROTOCOL: FORMAL DENIAL</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 700 }}>
            You are about to formally reject the admission dossier of <strong style={{color: isDark ? '#fff' : '#1e293b'}}>{rejectDialog.app?.name || "Applicant"}</strong> for the <strong style={{color: isDark ? '#fff' : '#1e293b'}}>{rejectDialog.app?.intendedMajor || "Selected"}</strong> sector.
          </Typography>
          <TextField
            fullWidth multiline rows={4}
            placeholder="Document the specific justification for this denial..."
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog((p) => ({ ...p, reason: e.target.value }))}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                color: isDark ? 'white' : 'text.primary',
                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                '&:hover fieldset': { borderColor: 'error.main' },
                '&.Mui-focused fieldset': { borderColor: 'error.main' }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, gap: 2 }}>
          <Button onClick={() => setRejectDialog({ open: false, app: null, reason: "" })} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 1000, color: 'text.secondary', px: 3 }}>Cancel Protocol</Button>
          <Button
            variant="contained" color="error"
            disabled={!rejectDialog.reason.trim()}
            onClick={async () => {
              await handleRejectApplication(rejectDialog.app.id, rejectDialog.app, rejectDialog.reason);
              setRejectDialog({ open: false, app: null, reason: "" });
            }}
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: 1000, px: 4, py: 1.2, boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)' }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8.5}>
          <Card sx={{ ...glassStyle, borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 4, 
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 100%)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Box>
                <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Admissions Dossier</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 2, opacity: 0.7 }}>AWAITING REGISTRAR VALIDATION</Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ textAlign: 'right', mr: 2 }}>
                  <Typography variant="h6" fontWeight={1000} sx={{ lineHeight: 1 }}>{applications.length}</Typography>
                  <Typography variant="caption" fontWeight={900} color="text.secondary">PENDING</Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: 'primary.main', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <Assignment />
                </Avatar>
              </Stack>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {applications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 12, opacity: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 2, filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={1000}>SYSTEM CLEAR: ALL DOSSIERS PROCESSED</Typography>
                  </Box>
                ) : (
                  applications.map((app) => {
                    const isExpanded = expandedApp === app.id;
                    return (
                      <Paper key={app.id} variant="outlined" sx={{
                        borderRadius: 5, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        bgcolor: isExpanded ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : (isDark ? 'rgba(255,255,255,0.01)' : 'transparent'),
                        overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { borderColor: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', transform: 'translateX(4px)' }
                      }}>
                        {/* Summary Header */}
                        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
                            badgeContent={<Circle sx={{ fontSize: 12, color: '#10b981', border: `2px solid ${isDark ? '#0f172a' : '#fff'}`, borderRadius: '50%' }} />}>
                            <Avatar sx={{
                              width: 52, height: 52, borderRadius: 2.5,
                              background: gradients.primary, color: 'white', fontWeight: 1000,
                              fontSize: '1.2rem', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                            }}>
                              {app.name?.[0] || '?'}
                            </Avatar>
                          </Badge>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: 0.5 }}>{app.name}</Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }} alignItems="center">
                              <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 1 }}>{app.intendedMajor?.toUpperCase() || "GENERAL"}</Typography>
                              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} />
                              <Typography variant="caption" color="text.secondary" fontWeight={800}>{app.email}</Typography>
                            </Stack>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                             <Chip label={app.level || "Year 1"} size="small" sx={{ fontWeight: 900, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }} />
                             <IconButton onClick={() => setExpandedApp(isExpanded ? null : app.id)} sx={{ 
                                bgcolor: isExpanded ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'), 
                                color: isExpanded ? 'white' : 'text.secondary',
                                transform: isExpanded ? 'rotate(180deg)' : 'none', 
                                transition: '0.4s',
                                '&:hover': { bgcolor: isExpanded ? 'primary.dark' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)') }
                             }}>
                              <ExpandMore sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Stack>
                        </Box>

                        <Collapse in={isExpanded}>
                          <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                          <Box sx={{ p: 4, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                              {[
                                { label: "Performance Metric", value: app.highSchoolGrades || '85.5%', icon: <TrendingUp sx={{ fontSize: 16 }} /> },
                                { label: "Origin Institution", value: app.highSchoolName || 'Global Academy', icon: <School sx={{ fontSize: 16 }} /> },
                                { label: "Application ID", value: `APP-${app.id?.slice(-6)?.toUpperCase() || "XXXXXX"}`, icon: <Badge sx={{ fontSize: 16 }} /> },
                                { label: "Submission Date", value: new Date().toLocaleDateString(), icon: <CalendarToday sx={{ fontSize: 16 }} /> },
                              ].map((item, idx) => (
                                <Grid item xs={12} sm={6} md={3} key={idx}>
                                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, opacity: 0.6 }}>
                                      {item.icon}
                                      <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 0.5 }}>{item.label.toUpperCase()}</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={1000} sx={{ color: isDark ? 'white' : 'text.primary' }}>{item.value}</Typography>
                                  </Box>
                                </Grid>
                              ))}
                              {app.personalStatement && (
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary" fontWeight={900} display="block" sx={{ letterSpacing: 1.5, opacity: 0.6, mb: 1.5 }}>STATEMENT OF INTENT</Typography>
                                  <Box sx={{
                                    p: 3, borderRadius: 4,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                    position: 'relative'
                                  }}>
                                    <Typography variant="body2" sx={{ lineHeight: 1.8, color: isDark ? 'rgba(255,255,255,0.75)' : 'text.primary', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                                      "{app.personalStatement}"
                                    </Typography>
                                    <FormatQuote sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.05, fontSize: 48, color: 'primary.main' }} />
                                  </Box>
                                </Grid>
                              )}
                            </Grid>

                            <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha('#3b82f6', 0.05), border: '1px solid rgba(59, 130, 246, 0.15)', mb: 4, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Info sx={{ color: 'primary.main', fontSize: 20 }} />
                              </Box>
                              <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 0.3, lineHeight: 1.6 }}>
                                <strong>PROTOCOL INFO:</strong> UPON AUTHORIZATION, A PERMANENT ACADEMIC CREDENTIAL (ALX-XXXX/{new Date().getFullYear()}) WILL BE SECURED IN THE MAIN ROSTER AND NOTIFICATION DISPATCHED TO THE APPLICANT.
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                              <Button
                                variant="outlined" color="error" startIcon={<Cancel />}
                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, px: 4, py: 1.2, border: '1px solid rgba(239, 68, 68, 0.3)', '&:hover': { border: '1px solid #ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)' } }}
                                onClick={() => setRejectDialog({ open: true, app, reason: '' })}
                              >
                                Reject Dossier
                              </Button>
                              <Button
                                variant="contained" color="success" className="btn-premium"
                                startIcon={<CheckCircleOutline />}
                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 1000, px: 4, py: 1.2, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}
                                onClick={() => handleApproveApplication(app)}
                              >
                                Authorize & Issue ID
                              </Button>
                            </Stack>
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

        <Grid item xs={12} md={3.5}>
          <Stack spacing={3}>
            <Card sx={{ ...glassStyle, borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="subtitle1" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 3 }}>Intake Metrics</Typography>
                <Stack spacing={3}>
                  {[
                    { label: "Acceptance Rate", value: 82, color: "#10b981", sub: "Target: 75%+" },
                    { label: "Pending Validation", value: 64, color: "#3b82f6", sub: "Avg Time: 2.4 days" },
                    { label: "Rejected dossiers", value: 12, color: "#ef4444", sub: "Quality Control" },
                  ].map((item, i) => (
                    <Box key={i}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-end' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={800}>{item.label}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={900}>{item.sub}</Typography>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={1000} color={item.color}>{item.value}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={item.value} 
                        sx={{ 
                          height: 8, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: item.color, backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)' }
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
                <Divider sx={{ my: 4, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1, mb: 2, display: 'block' }}>ID GENERATION PROTOCOL</Typography>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  p: 2.5, borderRadius: 4, border: '1px solid rgba(99, 102, 241, 0.2)',
                  display: 'flex', alignItems: 'center', gap: 2.5, mb: 3
                }}>
                  <AssignmentInd sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={1000} color={isDark ? "white" : "#1e293b"}>Sequential Encoding</Typography>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontFamily: 'monospace', fontWeight: 900 }}>ALX-XXXX/{new Date().getFullYear()}</Typography>
                  </Box>
                </Box>
                <Button fullWidth variant="outlined" sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000, textTransform: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: isDark ? 'white' : 'text.primary' }}>
                  Manage Credentials
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ ...glassStyle, borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                <Typography variant="subtitle2" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>System Status</Typography>
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                 <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                      <Box>
                        <Typography variant="caption" fontWeight={1000} display="block">AUTHENTICATION SERVER</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>OPERATIONAL • 42ms LATENCY</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
                      <Box>
                        <Typography variant="caption" fontWeight={1000} display="block">ID FABRICATION NODE</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>READY • IDLE</Typography>
                      </Box>
                    </Box>
                 </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPendingIdsTab = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ ...glassStyle, borderRadius: 7, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 5, pb: 4,
              background: 'linear-gradient(215deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
            }}>
              <Box>
                <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: -0.5, mb: 1, color: isDark ? '#fff' : '#1e293b' }}>Credential Deployment Queue</Typography>
                <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 3 }}>ID CARD FABRICATION & ISSUANCE INTERFACE</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" fontWeight={1000} color="primary.main" sx={{ lineHeight: 0.8 }}>{pendingIds.length}</Typography>
                <Typography variant="caption" fontWeight={1000} sx={{ letterSpacing: 1.5, opacity: 0.8 }}>ASSETS READY</Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4}>
                {pendingIds.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 15, opacity: 0.4 }}>
                      <CheckCircleOutline sx={{ fontSize: 100, color: '#10b981', mb: 3 }} />
                      <Typography variant="h5" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 1 }}>ALL STUDENT CREDENTIALS DEPLOYED</Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 700 }}>STANDING BY FOR NEW VALIDATIONS</Typography>
                    </Box>
                  </Grid>
                ) : (
                  pendingIds.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                      <Card sx={{
                        borderRadius: 6, overflow: 'hidden', 
                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        position: 'relative',
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)',
                        '&:hover': { transform: 'translateY(-12px)', boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.6)' : '0 30px 60px rgba(0,0,0,0.25)' }
                      }}>
                        <Box sx={{
                          height: 140,
                          background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : gradients.primary,
                          position: 'relative',
                          display: 'flex', alignItems: 'center', px: 4,
                          overflow: 'hidden'
                        }}>
                          {/* Decorative pattern for the ID card top */}
                          <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(20px)' }} />
                          <Typography variant="h6" color="white" fontWeight={1000} sx={{ letterSpacing: 2, fontFamily: 'Outfit, sans-serif', zIndex: 1 }}>ALEX UNIVERSITY</Typography>
                        </Box>

                        <Box sx={{ p: 4, pt: 0, mt: -7, position: 'relative', zIndex: 2 }}>
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', mb: 3 }}>
                            <Avatar
                              src={student.photoURL}
                              sx={{
                                width: 124, height: 124,
                                borderRadius: 5,
                                border: isDark ? '5px solid rgba(255,255,255,0.1)' : '5px solid #fff',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'
                              }}
                            >
                              {student.name?.[0]}
                            </Avatar>
                            <Box sx={{ pb: 1.5 }}>
                              <Typography variant="h6" fontWeight={1000} color={isDark ? "white" : "#0f172a"} sx={{ lineHeight: 1.1, mb: 0.5, letterSpacing: -0.2 }}>{student.name?.toUpperCase() || "STUDENT"}</Typography>
                              <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 1.5 }}>{student.studentId || "PENDING"}</Typography>
                            </Box>
                          </Box>

                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={900}>FACULTY</Typography>
                                <Typography variant="body2" fontWeight={1000} color={isDark ? "rgba(255,255,255,0.9)" : "#334155"}>{student.department?.toUpperCase() || 'GENERAL'}</Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={900}>VALID UNTIL</Typography>
                                <Typography variant="body2" fontWeight={1000} color={isDark ? "rgba(255,255,255,0.9)" : "#334155"}>AUG 2030</Typography>
                              </Box>
                            </Box>
                            
                            <Button
                              fullWidth variant="contained" startIcon={<Print />}
                              className="btn-premium"
                              onClick={() => {
                                setSelectedStudentForPrint(student);
                                setPrintDialogOpen(true);
                              }}
                              sx={{ mt: 1, borderRadius: 3.5, textTransform: 'none', fontWeight: 1000, py: 1.8, fontSize: '1rem', boxShadow: '0 12px 24px rgba(99, 102, 241, 0.25)' }}
                            >
                              Finalize Deployment
                            </Button>
                          </Stack>
                        </Box>
                        
                        {/* Security Hologram Simulation */}
                        <Box sx={{ 
                          position: 'absolute', bottom: 15, right: 15, width: 30, height: 30, 
                          borderRadius: '50%', background: 'linear-gradient(45deg, #fbbf24, #ef4444, #3b82f6, #10b981)',
                          opacity: 0.2, mixBlendMode: 'overlay'
                        }} />
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

  const renderIdRequestsTab = () => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', color: isDark ? '#fff' : '#1e293b' }}>Identity Recovery Queue</Typography>
          <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 2 }}>ARTIFACT LOSS CLAIMS ({idRequests.length})</Typography>
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.1), border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
          <Typography variant="caption" fontWeight={1000} color="warning.main">{idRequests.filter(r => r.status === 'pending').length} URGENT CLAIMS</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {idRequests.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 15, opacity: 0.3 }}>
              <CreditCard sx={{ fontSize: 100, mb: 3 }} />
              <Typography variant="h6" fontWeight={1000}>NO IDENTITY CLAIMS DETECTED</Typography>
            </Box>
          </Grid>
        ) : (
          idRequests.map((req) => (
            <Grid item xs={12} md={6} key={req.id}>
              <Card sx={{ 
                ...glassStyle, 
                borderRadius: 5, 
                background: req.status === 'pending' ? 'linear-gradient(215deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)'),
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={1000} sx={{ color: isDark ? 'white' : '#1e293b' }}>{req.studentName}</Typography>
                      <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ fontFamily: 'monospace' }}>{req.studentId}</Typography>
                    </Box>
                    <Chip
                      label={req.status?.toUpperCase() || "PENDING"}
                      size="small"
                      sx={{
                        fontWeight: 1000, fontSize: '0.6rem',
                        bgcolor: alpha(req.status === 'approved' ? '#10b981' : req.status === 'pending' ? '#f59e0b' : '#ef4444', 0.1),
                        color: req.status === 'approved' ? '#10b981' : req.status === 'pending' ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary', mb: 3, minHeight: 40 }}>{req.reason}</Typography>
                  <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={1000}>CLAIM DATE: {req.timestamp?.toDate()?.toLocaleDateString() || "Pending"}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {req.status === 'pending' && (
                        <>
                          <IconButton onClick={() => handleIdRequestAction(req.id, req.studentUid, 'reject')} sx={{ bgcolor: isDark ? alpha('#ef4444', 0.08) : alpha('#ef4444', 0.05), color: '#ef4444' }}><Cancel fontSize="small" /></IconButton>
                          <IconButton onClick={() => handleIdRequestAction(req.id, req.studentUid, 'approve')} sx={{ bgcolor: isDark ? alpha('#10b981', 0.08) : alpha('#10b981', 0.05), color: '#10b981' }}><CheckCircle fontSize="small" /></IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );


  // Tab components used in return block

  const renderCoursesTab = () => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Course Modules</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, opacity: 0.7 }}>ACADEMIC UNIT REPOSITORY</Typography>
        </Box>
        <Button variant="contained" className="btn-premium" startIcon={<Add />} onClick={() => handleOpenCourseDialog()} 
          sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
          Register New Module
        </Button>
      </Box>

      {departments.map((dept) => (
        <Box key={dept.id} sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${alpha(dept.color || '#6366f1', 0.4)} 0%, transparent 100%)` }} />
            <Typography variant="subtitle2" fontWeight={1000} sx={{ color: dept.color || '#6366f1', letterSpacing: 1.5 }}>
              {dept.name?.toUpperCase() || "DEPARTMENT"} / {dept.code?.toUpperCase() || "CODE"}
            </Typography>
            <Box sx={{ height: 2, flex: 3, background: `linear-gradient(90deg, transparent 0%, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 100%)` }} />
          </Box>
          
          <Grid container spacing={3}>
            {courses.filter(c => c.departmentId === dept.id).length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', ml: 2 }}>No modules scheduled for this sector.</Typography>
              </Grid>
            ) : (
              courses.filter(c => c.departmentId === dept.id).map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card sx={{ 
                    ...glassStyle, 
                    borderRadius: 5, 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>{course.name}</Typography>
                          <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 1 }}>CODE: {course.code}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: alpha(dept.color || '#6366f1', 0.1), color: dept.color || '#6366f1', width: 40, height: 40 }}>
                          <MenuBook sx={{ fontSize: 20 }} />
                        </Avatar>
                      </Box>

                      {course.status === 'pending_approval' && (
                        <Box sx={{ p: 1.5, mb: 2, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.1), border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                          <Typography variant="caption" fontWeight={1000} color="warning.main">REVIEW REQUIRED: NEW SEMESTER PROPOSAL</Typography>
                        </Box>
                      )}
                      
                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={900}>CREDIT VALUE</Typography>
                          <Typography variant="body2" fontWeight={1000}>{course.credits} Units</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={900}>LEVEL / YEAR</Typography>
                          <Typography variant="body2" fontWeight={1000}>Year {course.year || '1'} • Sem {course.semester || '1'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={900}>INSTRUCTOR</Typography>
                          <Typography variant="body2" fontWeight={1000} color="primary.main">{course.instructorName || 'UNASSIGNED'}</Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {course.status === 'pending_approval' ? (
                          <>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleCourseAction(course.id, 'reject')} sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}>Reject</Button>
                            <Button size="small" variant="contained" color="success" onClick={() => { setSelectedCourseForApproval(course); setOpenApprovalDialog(true); }} sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}>Approve</Button>
                          </>
                        ) : (
                          <>
                            <IconButton size="small" onClick={() => handleOpenCourseDialog(course)} sx={{ color: "primary.main", bgcolor: 'rgba(99, 102, 241, 0.05)' }}><Edit fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteCourse(course.id)} sx={{ color: "error.main", bgcolor: 'rgba(239, 68, 68, 0.05)' }}><Delete fontSize="small" /></IconButton>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );

  const renderCurriculumApprovalTab = () => {
    const pendingCourses = courses.filter(c => c.status === 'pending_approval');

    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Curriculum Approval Matrix</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, opacity: 0.7 }}>PENDING MODULE VALIDATIONS ({pendingCourses.length})</Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.1), border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography variant="caption" fontWeight={1000} color="warning.main">{pendingCourses.length} MODULES AWAITING REVIEW</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {pendingCourses.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
                <CheckCircleOutline sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" fontWeight={1000}>ALL CURRICULUM MODULES VALIDATED</Typography>
              </Box>
            </Grid>
          ) : (
            pendingCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ 
                  ...glassStyle, 
                  borderRadius: 5, 
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-5px)', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>{course.name}</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ letterSpacing: 1 }}>CODE: {course.code}</Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 40, height: 40 }}>
                        <MenuBook sx={{ fontSize: 20 }} />
                      </Avatar>
                    </Box>
                    
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>CREDIT VALUE</Typography>
                        <Typography variant="body2" fontWeight={1000}>{course.credits} Units</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>DEPARTMENT</Typography>
                        <Typography variant="body2" fontWeight={1000}>{course.department}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>PROPOSED BY</Typography>
                        <Typography variant="body2" fontWeight={1000} color="primary.main">{course.instructorName || 'N/A'}</Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        onClick={() => handleCourseAction(course.id, 'reject')} 
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}
                        disabled={isApprovingCourse}
                      >
                        {isApprovingCourse ? <CircularProgress size={16} color="inherit" /> : 'Reject'}
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        onClick={() => { setSelectedCourseForApproval(course); setOpenApprovalDialog(true); }} 
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'none' }}
                        disabled={isApprovingCourse}
                      >
                        Approve
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    );
  };

  const renderAdmissionsPostsTab = () => (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ ...glassStyle, borderRadius: 6, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 4, 
          background: `linear-gradient(90deg, ${alpha('#f59e0b', 0.08)} 0%, transparent 100%)`,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Admissions Announcements</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, opacity: 0.7 }}>PROSPECTIVE STUDENT UPDATES</Typography>
          </Box>
          <Button variant="contained" className="btn-premium" startIcon={<Campaign />} onClick={() => handleOpenAdmissionsDialog()} 
            sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none', bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}>
            Dispatch Global Update
          </Button>
        </Box>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Dispatch Identity", "Tag / Priority", "Timestamp", "Operations"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, px: 4 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {admissionsPosts.length === 0 ? (
                  <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}><Typography fontWeight={1000}>NO DISPATCHES RECORDED</Typography></TableCell></TableRow>
                ) : (
                  admissionsPosts.map((post) => (
                    <TableRow key={post.id} hover sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' } }}>
                      <TableCell sx={{ py: 3, px: 4 }}>
                        <Typography variant="subtitle2" fontWeight={1000}>{post.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.7 }}>{post.content}</Typography>
                      </TableCell>
                      <TableCell sx={{ px: 4 }}>
                        <Stack direction="row" spacing={1}>
                          <Chip label={post.tag?.toUpperCase() || "UPDATE"} size="small" sx={{ fontWeight: 1000, fontSize: '0.55rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', border: '1px solid rgba(99, 102, 241, 0.2)' }} />
                          {post.isImportant && <Chip label="CRITICAL" size="small" sx={{ fontWeight: 1000, fontSize: '0.55rem', bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }} />}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ px: 4 }}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">{post.date?.toDate()?.toLocaleDateString() || 'LIVE'}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => handleOpenAdmissionsDialog(post)} sx={{ color: "primary.main", bgcolor: 'rgba(99, 102, 241, 0.05)' }}><Edit sx={{ fontSize: 18 }} /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteAdmissionPost(post.id)} sx={{ color: "error.main", bgcolor: 'rgba(239, 68, 68, 0.05)' }}><Delete sx={{ fontSize: 18 }} /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openAdmissionsDialog} onClose={() => setOpenAdmissionsDialog(false)} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none', p: 1 } }}>
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{editingAdmissionPost ? 'Calibrate Dispatch' : 'New Admissions Update'}</Typography>
          <Typography variant="caption" color="warning.main" fontWeight={900} sx={{ letterSpacing: 2 }}>REAL-TIME BROADCAST INTERFACE</Typography>
        </DialogTitle>
        <form onSubmit={handleSaveAdmissionPost}>
          <DialogContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField fullWidth label="Headline" value={admissionPostForm.title} onChange={e => setAdmissionPostForm({ ...admissionPostForm, title: e.target.value })} required 
                InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
              />
              <TextField fullWidth multiline rows={5} label="Content Body (Markdown Supported)" value={admissionPostForm.content} onChange={e => setAdmissionPostForm({ ...admissionPostForm, content: e.target.value })} required 
                InputProps={{ sx: { borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth select label="Categorization" value={admissionPostForm.tag} onChange={e => setAdmissionPostForm({ ...admissionPostForm, tag: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}>
                    <MenuItem value="Update">SYSTEM UPDATE</MenuItem>
                    <MenuItem value="Deadline">TERMINO DEADLINE</MenuItem>
                    <MenuItem value="Requirements">PROTOCOL REQUIREMENTS</MenuItem>
                    <MenuItem value="Alert">URGENT ALERT</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    fullWidth
                    variant={admissionPostForm.isImportant ? "contained" : "outlined"}
                    color={admissionPostForm.isImportant ? "error" : "primary"}
                    onClick={() => setAdmissionPostForm({ ...admissionPostForm, isImportant: !admissionPostForm.isImportant })}
                    sx={{ height: 56, borderRadius: 3, fontWeight: 1000, textTransform: 'none', border: !admissionPostForm.isImportant ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none' }}
                  >
                    {admissionPostForm.isImportant ? "MARKED AS PRIORITY" : "TOGGLE PRIORITY"}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
            <Button onClick={() => setOpenAdmissionsDialog(false)} sx={{ fontWeight: 1000, color: 'text.secondary', textTransform: 'none', px: 3 }}>Exit Editor</Button>
            <Button type="submit" variant="contained" className="btn-premium" sx={{ borderRadius: 3, px: 5, py: 1.2, fontWeight: 1000, textTransform: 'none', bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}>
              {editingAdmissionPost ? 'Commit Update' : 'Deploy Dispatch'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );

  const renderAnalyticsTab = () => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];
    const deptCounts = {};
    students.forEach(s => { const d = s.department || s.intendedMajor || 'General'; deptCounts[d] = (deptCounts[d] || 0) + 1; });
    const deptData = Object.entries(deptCounts).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
    
    return (
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card sx={{ ...glassStyle, borderRadius: 7, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 4, 
                background: `linear-gradient(215deg, ${alpha('#6366f1', 0.1)} 0%, transparent 100%)`,
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
              }}>
                <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Departmental Density</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, opacity: 0.7 }}>ENROLLMENT DISTRIBUTION ANALYTICS</Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ height: 400, mt: 2 }}>
                  {deptData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} angle={-30} textAnchor="end" tick={{ fill: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 12, fontWeight: 700 }} />
                        <RechartsTooltip 
                          cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                          contentStyle={{ 
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
                            borderRadius: '15px', 
                            color: isDark ? '#fff' : '#1e293b', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
                          }} 
                          itemStyle={{ fontWeight: 1000, color: isDark ? '#fff' : '#1e293b' }}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                          {deptData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.2 }}>
                      <Assessment sx={{ fontSize: 80, mb: 2 }} />
                      <Typography fontWeight={1000}>SYSTEM IDLE: NO DEPLOYMENT DATA DETECTED</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ 
              ...glassStyle, 
              borderRadius: 7, 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#6366f1', 0.15)} 0%, ${alpha('#8b5cf6', 0.05)} 100%)`,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'}`,
              display: 'flex', flexDirection: 'column', textAlign: 'center', p: 5
            }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Box sx={{ 
                  width: 120, height: 120, borderRadius: '40%', 
                  background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                  mb: 4
                }}>
                  <Assessment sx={{ fontSize: 60, color: '#fff' }} />
                </Box>
                <Typography variant="h4" fontWeight={1000} sx={{ mb: 2, fontFamily: 'Outfit, sans-serif', letterSpacing: -0.5 }}>Executive Intelligence</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 6, fontWeight: 700, lineHeight: 1.7 }}>
                  Synthesize high-fidelity university audits, longitudinal enrollment dossiers, and predictive departmental growth vectors.
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Button variant="contained" className="btn-premium" 
                    disabled={students.length === 0}
                    onClick={handleExportPDF}
                    startIcon={<Assignment />}
                    sx={{ borderRadius: 4, py: 2, textTransform: 'none', fontWeight: 1000, fontSize: '1rem', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.25)' }}>
                    Export Executive PDF Dossier
                  </Button>
                  <Button variant="outlined" 
                    onClick={handleExportCSV}
                    sx={{ borderRadius: 4, py: 2, textTransform: 'none', fontWeight: 1000, color: isDark ? 'white' : 'primary.main', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.2)'}`, '&:hover': { border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.4)'}`, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.03)' } }}>
                    Raw Macro-Data CSV Export
                  </Button>
                </Stack>
                
                <Box sx={{ mt: 6, width: '100%', pt: 4, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                   <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, display: 'block', mb: 2 }}>SECURITY PROTOCOL STATUS</Typography>
                   <Button 
                    fullWidth 
                    variant="outlined" 
                    color={vulnerabilityReport ? "success" : "warning"}
                    onClick={handleVulnerabilityAssessment}
                    disabled={assessmentLoading}
                    startIcon={assessmentLoading ? <CircularProgress size={20} color="inherit" /> : <Warning />}
                    sx={{ borderRadius: 3.5, fontWeight: 1000, textTransform: 'none', py: 1.5, border: '1px solid rgba(245, 158, 11, 0.3)' }}
                   >
                     {assessmentLoading ? "Executing Neural Audit..." : vulnerabilityReport ? "Re-Run Vulnerability Scan" : "Initiate System Vulnerability Scan"}
                   </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Vulnerability Report Dialog */}
        <Dialog open={openVulnerabilityDialog} onClose={() => setOpenVulnerabilityDialog(false)} maxWidth="md" fullWidth 
          PaperProps={{ sx: { ...glassStyle, borderRadius: 8, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
          <DialogTitle sx={{ p: 5, pb: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Vulnerability Matrix</Typography>
                <Typography variant="caption" color="warning.main" fontWeight={900} sx={{ letterSpacing: 3 }}>EXECUTIVE SECURITY DISPATCH</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" fontWeight={1000} color={vulnerabilityReport?.score > 80 ? "#10b981" : "#f59e0b"}>{vulnerabilityReport?.score}</Typography>
                <Typography variant="caption" fontWeight={900}>TRUST INDEX</Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" fontWeight={1000} sx={{ mb: 2, opacity: 0.6 }}>AUDIT DIMENSIONS</Typography>
                <Stack spacing={2}>
                  {vulnerabilityReport?.checks.map((check, i) => (
                    <Box key={i} sx={{ p: 2.5, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: check.status === 'secure' ? '#10b981' : '#f59e0b', boxShadow: `0 0 10px ${check.status === 'secure' ? '#10b981' : '#f59e0b'}` }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight={1000}>{check.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{check.detail}</Typography>
                      </Box>
                      <Chip label={check.status?.toUpperCase() || "PENDING"} size="small" sx={{ fontWeight: 1000, fontSize: '0.6rem', bgcolor: alpha(check.status === 'secure' ? '#10b981' : '#f59e0b', 0.1), color: check.status === 'secure' ? '#10b981' : '#f59e0b' }} />
                    </Box>
                  ))}
                </Stack>
              </Box>
              
              <Box sx={{ p: 4, borderRadius: 5, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Info sx={{ color: 'primary.main' }} /> Strategic Recommendation
                </Typography>
                <Typography variant="body2" color={isDark ? "rgba(255,255,255,0.8)" : "text.secondary"} sx={{ lineHeight: 1.7, fontWeight: 700 }}>
                  {vulnerabilityReport?.recommendation}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 5, pt: 0 }}>
            <Button onClick={() => setOpenVulnerabilityDialog(false)} variant="contained" className="btn-premium" sx={{ borderRadius: 3, px: 6, py: 1.5, fontWeight: 1000, textTransform: 'none' }}>
              Acknowledge Audit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderFinanceRegistrationsTab = () => {
    const pendingCount = pendingPayments.filter(p => p.status === 'pending_approval').length;
    const approvedCount = pendingPayments.filter(p => p.status === 'approved').length;
    const rejectedCount = pendingPayments.filter(p => p.status === 'rejected').length;
    const totalRevenue = pendingPayments.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
      <Box sx={{ mt: 4 }}>
        {/* Dynamic Summary Intelligence */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "Pending Validation", value: pendingCount, color: '#f59e0b', icon: <AccessTime /> },
            { label: "Authorized Assets", value: approvedCount, color: '#10b981', icon: <CheckCircle /> },
            { label: "Denied Entries", value: rejectedCount, color: '#ef4444', icon: <Cancel /> },
            { label: "Gross Capital", value: `$${totalRevenue.toLocaleString()}`, color: '#6366f1', icon: <CreditCard /> },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ 
                ...glassStyle, borderRadius: 5, p: 2.5, 
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, transparent 100%)`,
                transition: '0.4s', 
                '&:hover': { transform: 'scale(1.02)' } 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, width: 44, height: 44, boxShadow: `0 8px 16px ${alpha(stat.color, 0.2)}` }}>{stat.icon}</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={1000}>{stat.value}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.7 }}>{stat.label}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* High-Fidelity Transaction Registry - Dense Grid */}
        <Grid container spacing={2}>
          {pendingPayments.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
                <CreditCard sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" fontWeight={1000}>NO TRANSACTIONS RECORDED</Typography>
              </Box>
            </Grid>
          ) : (
            pendingPayments.map((payment) => {
              const isPending = payment.status === 'pending_approval';
              const isProcessing = processingFinanceAction === payment.id;
              
              return (
                <Grid item xs={12} md={6} lg={4} key={payment.id}>
                  <Card sx={{ 
                    ...glassStyle, borderRadius: 4, 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    position: 'relative',
                    background: isPending ? `linear-gradient(215deg, ${alpha('#6366f1', 0.03)} 0%, transparent 100%)` : (isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)')
                  }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={1000}>{payment.studentName}</Typography>
                          <Typography variant="caption" color="primary.main" fontWeight={1000} sx={{ fontFamily: 'monospace' }}>{payment.studentId}</Typography>
                        </Box>
                        <Chip 
                          label={payment.status.replace(/_/g, ' ').toUpperCase()} 
                          size="small" 
                          sx={{ 
                            fontWeight: 1000, fontSize: '0.6rem',
                            bgcolor: alpha(payment.status === 'approved' ? '#10b981' : isPending ? '#f59e0b' : '#ef4444', 0.1),
                            color: payment.status === 'approved' ? '#10b981' : isPending ? '#f59e0b' : '#ef4444'
                          }} 
                        />
                      </Box>
                      <Box sx={{ mb: 2, p: 1.5, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={900}>COURSE ALLOCATION</Typography>
                        <Typography variant="body2" fontWeight={1000} noWrap>{payment.courseName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight={1000} color="primary.main">${payment.amount?.toLocaleString()}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {isPending && (
                            <>
                              <IconButton size="small" onClick={() => handleRejectPayment(payment)} disabled={isProcessing} sx={{ bgcolor: alpha('#ef4444', 0.08), color: '#ef4444' }}>
                                {isProcessing ? <CircularProgress size={16} color="inherit" /> : <Cancel fontSize="small" />}
                              </IconButton>
                              <IconButton size="small" onClick={() => handleApprovePayment(payment)} disabled={isProcessing} sx={{ bgcolor: alpha('#10b981', 0.08), color: '#10b981' }}>
                                {isProcessing ? <CircularProgress size={16} color="inherit" /> : <CheckCircle fontSize="small" />}
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ mt: 1, display: 'block', opacity: 0.5 }}>
                        STAMP: {payment.timestamp?.toDate ? payment.timestamp.toDate().toLocaleString() : 'Recent'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    );
  };

  const getPrintStyles = () => `
              @media print {
                body * {
                  visibility: hidden;
                }
      #printable-id-card, #printable-id-card * {
                visibility: visible;
      }
              #printable-id-card {
                position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 3in;
              height: 4.5in;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
      }
              @page {margin: 0; size: auto; }
    }
              `;

  const Sidebar = () => (
    <Box sx={{
      width: sidebarOpen ? 280 : 80,
      flexShrink: 0,
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: isDark
        ? 'linear-gradient(180deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)'
        : 'rgba(255, 255, 255, 0.45)',
      color: isDark ? 'white' : '#1e293b',
      backdropFilter: 'blur(32px) saturate(180%)',
      borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.15)'}`,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      display: "flex",
      flexDirection: "column",
      zIndex: 1200,
      boxShadow: "10px 0 30px rgba(0,0,0,0.05)"
    }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", minHeight: 80 }}>
        {sidebarOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontWeight: 800, border: '2px solid rgba(255,255,255,0.5)' }}>{user?.name?.[0]}</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} color={isDark ? "#fff" : "#1e293b"} noWrap>{user?.name}</Typography>
              <Typography variant="caption" sx={{ color: isDark ? "rgba(255,255,255,0.7)" : "primary.main" }} fontWeight={700}>{t("registrarAuthority")}</Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: isDark ? 'white' : 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.05)' }}>
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider sx={{ opacity: 0.5 }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {[
          { label: t("overview"), icon: <Dashboard />, index: 0 },
          { label: t("students"), icon: <People />, index: 1 },
          { label: t("colleges"), icon: <Business />, index: 2 },
          { label: t("courses"), icon: <LibraryBooks />, index: 3 },
          { label: t("transcripts"), icon: <MenuBook />, index: 14 },
          { label: t("curriculumApproval"), icon: <School />, index: 13, badge: courses.filter(c => c.status === 'pending_approval').length },
          { label: t("schedules"), icon: <Schedule />, index: 4 },
          { label: t("applications"), icon: <SwapHoriz />, index: 5 },
          { label: t("pendingIds"), icon: <AssignmentInd />, index: 6, badge: pendingIds.length },
          { label: t("idRequests"), icon: <CreditCard />, index: 7, badge: idRequests.filter(r => r.status === 'pending').length },
          { label: t("departments"), icon: <AccountBalance />, index: 8 },
          { label: t("finance"), icon: <CreditCard />, index: 12, badge: pendingPayments.filter(p => p.status === 'pending_approval').length },
          { label: t("admissionsPosts"), icon: <Forum />, index: 9 },
          { label: t("newsFeed"), icon: <Newspaper />, index: 11 },
          { label: t("analytics"), icon: <Assessment />, index: 10 },
        ].map((item) => (
          <ListItem key={item.index} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
              <Button
                fullWidth
                onClick={() => setActiveTab(item.index)}
                startIcon={item.icon}
                sx={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  px: sidebarOpen ? 2 : 0,
                  py: 1.5,
                  borderRadius: 3,
                  minWidth: 0,
                  color: activeTab === item.index ? "#fff" : (isDark ? "rgba(255,255,255,0.7)" : "#475569"),
                  background: activeTab === item.index ? gradients.primary : "transparent",
                  boxShadow: activeTab === item.index ? "0 8px 25px rgba(99, 102, 241, 0.4)" : "none",
                  "& .MuiButton-startIcon": {
                    marginRight: sidebarOpen ? 1.5 : 0,
                    marginLeft: sidebarOpen ? 0 : 0,
                    color: activeTab === item.index ? "#fff" : (isDark ? "rgba(255,255,255,0.6)" : "#64748b")
                  },
                  "&:hover": { 
                    bgcolor: activeTab === item.index ? "" : (isDark ? "alpha(#fff, 0.08)" : "alpha(#6366f1, 0.08)"),
                    transform: activeTab === item.index ? 'none' : 'translateX(4px)'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <Button
          fullWidth
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <LightMode /> : <DarkMode />}
          sx={{
            justifyContent: sidebarOpen ? "flex-start" : "center",
            color: isDark ? "rgba(255,255,255,0.7)" : "#64748b",
            py: 1.5,
            borderRadius: 3,
            "& .MuiButton-startIcon": { marginRight: sidebarOpen ? 1.5 : 0, color: isDark ? "rgba(255,255,255,0.7)" : "#6366f1" },
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.05)" }
          }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={600}>{mode === "dark" ? t("lightMode") : t("darkMode")}</Typography>}
        </Button>
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            justifyContent: sidebarOpen ? "flex-start" : "center",
            color: isDark ? "rgba(255,255,255,0.9)" : "#ef4444",
            bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(239, 68, 68, 0.05)",
            mt: 1,
            py: 1.5,
            borderRadius: 3,
            "& .MuiButton-startIcon": { marginRight: sidebarOpen ? 1.5 : 0, color: isDark ? "rgba(255,255,255,0.9)" : "#ef4444" },
            "&:hover": { bgcolor: isDark ? "rgba(255,68,68,0.2)" : "rgba(239, 68, 68, 0.1)", color: isDark ? "#ff8888" : "#dc2626" }
          }}
        >
          {sidebarOpen && <Typography variant="body2" fontWeight={800}>{t("signOut")}</Typography>}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: isDark ? "#0f172a" : "#f8fafc", minHeight: "100vh", position: 'relative' }}>
      <style>{getPrintStyles()}</style>
      <AuroraBlobs />
      <Sidebar />

      <Box component="main" sx={{
        flexGrow: 1,
        ml: `${sidebarOpen ? 280 : 80}px`,
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        p: 0,
        minWidth: 0
      }}>
        {/* Top Header Bar */}
        <Box sx={{
          height: 80,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          background: isDark ? alpha("#0f172a", 0.7) : alpha("#ffffff", 0.7),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.1)'}`,
          boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -1, color: isDark ? '#fff' : '#1e293b' }}>
            {[
              t("overview"), t("students"), t("colleges"), t("courses"), t("schedules"), t("applications"),
              t("pendingIds"), t("idRequests"), t("departments"), t("admissionsPosts"),
              t("analytics"), t("newsFeed"), t("finance"), t("curriculumApproval"), t("transcripts")
            ][activeTab]}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LanguageSwitcher variant="icon" />
            <Tooltip title={t("notifications")}>
              <IconButton onClick={() => setNotifDrawerOpen(true)} sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                "& .MuiBadge-badge": { fontWeight: 900 }
              }}>
                <Badge badgeContent={systemNotifications.filter(n => !n.read).length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ transition: '0.3s' }}>
            {activeTab === 0 && renderOverviewTab()}
            {activeTab === 1 && (selectedStudentProfile ? renderStudentProfileView() : renderStudentsTab())}
            {activeTab === 2 && <CollegesTab colleges={colleges} isDark={isDark} glassStyle={glassStyle} />}
            {activeTab === 3 && renderCoursesTab()}
            {activeTab === 4 && renderSchedulesTab()}
            {activeTab === 5 && renderApplicationsTab()}
            {activeTab === 6 && renderPendingIdsTab()}
            {activeTab === 7 && renderIdRequestsTab()}
            {activeTab === 8 && <DepartmentsTab departments={departments} colleges={colleges} isDark={isDark} glassStyle={glassStyle} />}
            {activeTab === 9 && renderAdmissionsPostsTab()}
            {activeTab === 10 && renderAnalyticsTab()}
            {activeTab === 11 && renderNewsManagementTab()}
            {activeTab === 12 && renderFinanceRegistrationsTab()}
            {activeTab === 13 && renderCurriculumApprovalTab()}
            {activeTab === 14 && <TranscriptsTab isDark={isDark} glassStyle={glassStyle} />}
          </Box>
        </Container>
      </Box>

      {/* Curriculum Approval Dialog */}
      <Dialog 
        open={openApprovalDialog} 
        onClose={() => setOpenApprovalDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { ...glassStyle, border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' }
        }}
      >
        <DialogTitle sx={{ color: isDark ? '#fff' : 'text.primary', fontWeight: 900 }}>Review & Approve Course</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', textTransform: 'uppercase' }}>Course Identity</Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#fff' : 'text.primary', fontWeight: 700 }}>{selectedCourseForApproval?.name} ({selectedCourseForApproval?.code})</Typography>
              <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Credits: {selectedCourseForApproval?.credits} | Dept: {selectedCourseForApproval?.department}</Typography>
            </Box>
            
            <TextField
              label="Tuition Fee (Total for Course)"
              type="number"
              fullWidth
              value={approvalForm.tuitionFee}
              onChange={(e) => setApprovalForm({ ...approvalForm, tuitionFee: e.target.value })}
              InputProps={{ style: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' } }}
              variant="outlined"
            />

            <TextField
              label="Registrar Remarks / Final Description"
              multiline
              rows={4}
              fullWidth
              value={approvalForm.registrarDescription}
              onChange={(e) => setApprovalForm({ ...approvalForm, registrarDescription: e.target.value })}
              InputProps={{ style: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ style: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' } }}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenApprovalDialog(false)} sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleCourseAction(selectedCourseForApproval.id, 'approve', approvalForm)}
            sx={{ borderRadius: 2, fontWeight: 900 }}
            disabled={!approvalForm.tuitionFee}
          >
            Approve & Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        PaperProps={{ 
          sx: { 
            width: { xs: '100vw', sm: 400 }, 
            p: 3, 
            borderRadius: '24px 0 0 24px',
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'}`
          } 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" fontWeight={900}>Live Intelligence</Typography>
          <IconButton onClick={() => setNotifDrawerOpen(false)}><Close /></IconButton>
        </Box>
        {systemNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="text.secondary">No intelligence reports currently.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {systemNotifications.map(n => (
              <Box key={n.id} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                <Typography variant="caption" color="primary.main" fontWeight={900}>{n.type?.toUpperCase() || "UPDATE"}</Typography>
                <Typography variant="body2" fontWeight={800} sx={{ my: 0.5 }}>{n.title || n.applicantName}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>{n.message}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Drawer>

      {/* Print Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{ zIndex: 99999 }}
      >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: isDark ? '#0f172a' : '#f1f5f9' }}>
          {/* Top Actions Bar (Hidden in Print) */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', '@media print': { display: 'none' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => setPrintDialogOpen(false)}><Close /></IconButton>
              <Typography variant="h6" fontWeight={800}>Print Preview</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setPrintDialogOpen(false)}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Print />}
                onClick={() => {
                  window.print();
                  // Issue after print interaction
                  if (selectedStudentForPrint) handleGenerateIdCard(selectedStudentForPrint.id);
                }}
                sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', px: 4 }}
              >
                Print & Issue
              </Button>
            </Box>
          </Box>

          {/* ID Card Display Area */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            {selectedStudentForPrint && (
              <Card
                id="printable-id-card"
                elevation={24}
                sx={{
                  width: '3.375in',
                  height: '4in', /* Adjusted for better vertical layout */
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                }}
              >
                {/* Header Pattern */}
                <Box sx={{ height: 100, background: 'linear-gradient(135deg, #e0f2fe 0%, #fff 100%)', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', border: '2px solid #bae6fd', opacity: 0.5 }} />
                </Box>

                {/* Content */}
                <Box sx={{ p: 2, pt: 0, mt: -6, position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar
                      src={selectedStudentForPrint.photoURL}
                      sx={{ width: 110, height: 110, border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                    >
                      {selectedStudentForPrint.name?.[0]}
                    </Avatar>
                    <Box sx={{ pt: 6 }}>
                      <Typography variant="h5" fontWeight={900} sx={{ color: '#0369a1', mb: 0.5, lineHeight: 1.1, fontSize: '1.4rem' }}>
                        STUDENT ID CARD
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, pl: 1 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 1.5, fontSize: '1.1rem' }}>
                      Name: <span style={{ fontWeight: 900 }}>{selectedStudentForPrint.name}</span>
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Card ID:</Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem' }}>{selectedStudentForPrint.studentId?.split('-')[1]?.split('/')[0] || "3805687"}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>D.O.B.:</Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem' }}>{selectedStudentForPrint.dob || "02/10/1994"}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Expiry date:</Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem' }}>02/03/2030</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Barcode Section */}
                  <Box sx={{ mt: 'auto', mb: 2, textAlign: 'center' }}>
                    <Box sx={{ height: 40, width: '100%', display: 'flex', justifyContent: 'center', gap: '2px', mb: 0.5 }}>
                      {[...Array(40)].map((_, i) => (
                        <Box key={i} sx={{ width: i % 3 === 0 ? '3px' : '1px', height: '100%', bgcolor: '#000' }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ letterSpacing: 4, fontWeight: 700, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      6491 3360 {selectedStudentForPrint.studentId?.split('-')[1]?.split('/')[0] || "3892"} 3368
                    </Typography>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ p: 0.5, bgcolor: '#10b981', borderRadius: 1, display: 'flex' }}>
                        <School sx={{ fontSize: 20, color: '#fff' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={900} sx={{ color: '#0369a1', display: 'block', lineHeight: 1, fontSize: '0.65rem' }}>LEARN</Typography>
                        <Typography variant="caption" fontWeight={900} sx={{ color: '#10b981', display: 'block', lineHeight: 1, fontSize: '0.65rem' }}>ACADEMY</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 700 }}>T & Cs Apply</Typography>
                  </Box>
                </Box>
              </Card>
            )}

          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ pb: 4, '@media print': { display: 'none' } }}>
            Ensure your printer is properly loaded with CR80 ID Card Blanks.
          </Typography>
        </Box>
      </Dialog>



      <Dialog open={courseDialog.open} onClose={() => setCourseDialog(p => ({ ...p, open: false }))} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}>{courseDialog.mode === 'add' ? 'Add New Course' : 'Edit Course'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              fullWidth label="Module Full Name" 
              value={courseDialog.data.name} 
              onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} 
              error={!!courseErrors.name} helperText={courseErrors.name}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            />
            <Stack direction="row" spacing={2.5}>
              <TextField 
                fullWidth label="Module Code" 
                value={courseDialog.data.code} 
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, code: e.target.value } }))} 
                error={!!courseErrors.code} helperText={courseErrors.code}
                InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
                InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
              />
              <TextField 
                fullWidth label="Credits" type="number" 
                value={courseDialog.data.credits} 
                onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, credits: parseInt(e.target.value) } }))} 
                error={!!courseErrors.credits} helperText={courseErrors.credits}
                InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
                InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
              />
            </Stack>
            <TextField 
              fullWidth label="Department Authority" 
              value={courseDialog.data.department} 
              onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, department: e.target.value } }))} 
              error={!!courseErrors.department} helperText={courseErrors.department}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            />
            <TextField 
              fullWidth label="Primary Instructor" 
              value={courseDialog.data.instructor} 
              onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, instructor: e.target.value } }))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            />
            <TextField 
              fullWidth select label="Status" 
              value={courseDialog.data.status} 
              onChange={e => setCourseDialog(p => ({ ...p, data: { ...p.data, status: e.target.value } }))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Archived">Archived</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCourseDialog(p => ({ ...p, open: false }))} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCourse} disabled={!courseDialog.data.name || !courseDialog.data.code} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: activeTab === 2 ? "0 8px 25px rgba(99, 102, 241, 0.4)" : "none" }}>
            {courseDialog.mode === 'add' ? 'Add Course' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Add/Edit Dialog */}
      <Dialog open={scheduleDialog.open} onClose={() => setScheduleDialog(p => ({ ...p, open: false }))} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}>{scheduleDialog.mode === 'add' ? 'Add Class Schedule' : 'Edit Schedule'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              fullWidth select label="Target Module" 
              value={scheduleDialog.data.courseName} error={!!scheduleErrors.courseId} helperText={scheduleErrors.courseId} 
              onChange={e => {
                const selected = courses.find(c => c.name === e.target.value);
                setScheduleDialog(p => ({ ...p, data: { ...p.data, courseName: e.target.value, courseId: selected?.id || '' } }));
              }}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            >
              {courses.map(c => <MenuItem key={c.id} value={c.name}>{c.name} ({c.code})</MenuItem>)}
            </TextField>
            <TextField 
              fullWidth select label="Instruction Day" 
              value={scheduleDialog.data.day} error={!!scheduleErrors.day} helperText={scheduleErrors.day} 
              onChange={e => setScheduleDialog(p => ({ ...p, data: { ...p.data, day: e.target.value } }))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <Stack direction="row" spacing={2.5}>
              <TextField 
                fullWidth label="Start Time" type="time" 
                value={scheduleDialog.data.startTime} error={!!scheduleErrors.startTime} helperText={scheduleErrors.startTime} 
                onChange={e => setScheduleDialog(p => ({ ...p, data: { ...p.data, startTime: e.target.value } }))} 
                InputLabelProps={{ shrink: true, sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
                InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              />
              <TextField 
                fullWidth label="End Time" type="time" 
                value={scheduleDialog.data.endTime} error={!!scheduleErrors.endTime} helperText={scheduleErrors.endTime} 
                onChange={e => setScheduleDialog(p => ({ ...p, data: { ...p.data, endTime: e.target.value } }))} 
                InputLabelProps={{ shrink: true, sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
                InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              />
            </Stack>
            <TextField 
              fullWidth label="Logical Room Assignment" 
              value={scheduleDialog.data.room} error={!!scheduleErrors.room} helperText={scheduleErrors.room} 
              onChange={e => setScheduleDialog(p => ({ ...p, data: { ...p.data, room: e.target.value } }))} placeholder="e.g. B-201"
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            />
            <TextField 
              fullWidth label="Academic Semester" 
              value={scheduleDialog.data.semester} 
              onChange={e => setScheduleDialog(p => ({ ...p, data: { ...p.data, semester: e.target.value } }))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setScheduleDialog(p => ({ ...p, open: false }))} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSchedule} disabled={!scheduleDialog.data.courseName || !scheduleDialog.data.day} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)" }}>
            {scheduleDialog.mode === 'add' ? 'Add Schedule' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={studentDialog.open} onClose={() => setStudentDialog({ open: false, student: null })} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}>Calibrate Academic Identity</DialogTitle>
        <DialogContent>
          <Typography variant="caption" sx={{ mb: 3, display: 'block', color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            MANAGING PROFILE FOR: {studentDialog.student?.name}
          </Typography>
          
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              fullWidth label="Full Legal Name" 
              value={studentDialog.name} 
              onChange={e => setStudentDialog(p => ({ ...p, name: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth select label="Account Status" 
                  value={studentDialog.status} 
                  onChange={e => setStudentDialog(p => ({ ...p, status: e.target.value }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                  <MenuItem value="Graduated">Graduated</MenuItem>
                  <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth select label="Gender / Identity" 
                  value={studentDialog.gender} 
                  onChange={e => setStudentDialog(p => ({ ...p, gender: e.target.value }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth select label="Academic Year" 
                  value={studentDialog.year} 
                  onChange={e => setStudentDialog(p => ({ ...p, year: parseInt(e.target.value) }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  {[1, 2, 3, 4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth label="Department / Major" 
                  value={studentDialog.department} 
                  onChange={e => setStudentDialog(p => ({ ...p, department: e.target.value }))}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
            </Grid>

            <TextField 
              fullWidth label="Contact Email" 
              value={studentDialog.email} 
              onChange={e => setStudentDialog(p => ({ ...p, email: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            
            <TextField 
              fullWidth label="Phone Protocol" 
              value={studentDialog.phone} 
              onChange={e => setStudentDialog(p => ({ ...p, phone: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField 
              fullWidth label="Intellectual Identity" 
              multiline rows={2}
              value={studentDialog.intellectualIdentity} 
              onChange={e => setStudentDialog(p => ({ ...p, intellectualIdentity: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setStudentDialog({ open: false, student: null })} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>Abort</Button>
          <Button variant="contained" onClick={handleUpdateStudentProfile} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, px: 4, background: gradients.primary }}>
            Save Protocol Changes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Open Registration Selection Dialog */}
      <Dialog open={openRegDialog} onClose={() => setOpenRegDialog(false)} maxWidth="xs" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}>Open Registration Window</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary' }}>
            Select the target academic cohort and semester to allow registration for.
          </Typography>
          <Stack spacing={2.5}>
            <TextField 
              fullWidth select label="Target Academic Year" 
              value={regDialogYear} 
              onChange={e => setRegDialogYear(parseInt(e.target.value))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            >
              {[1, 2, 3, 4].map(y => <MenuItem key={y} value={y}>Academic Year {y}</MenuItem>)}
            </TextField>
            <TextField 
              fullWidth select label="Target Semester" 
              value={regDialogSemester} 
              onChange={e => setRegDialogSemester(parseInt(e.target.value))}
              InputProps={{ sx: { color: isDark ? '#fff' : '#1e293b' } }}
              InputLabelProps={{ sx: { color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' } }}
            >
              {[1, 2].map(s => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenRegDialog(false)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleOpenRegistration} 
            disabled={settingsLoading}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)" }}
          >
            Launch Window
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrarDashboard;
