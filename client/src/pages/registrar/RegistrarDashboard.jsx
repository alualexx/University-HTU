import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Avatar, IconButton, List, ListItem, ListItemIcon, ListItemText,
  Button, Tooltip, Chip, useTheme, alpha, Snackbar, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem, Grid,
  Drawer, useMediaQuery, InputAdornment, Badge
} from "@mui/material";
import {
  DashboardOutlined, PeopleAltOutlined, HowToRegOutlined, SwapHorizOutlined,
  CalendarMonthOutlined, AccountTreeOutlined, MenuBookOutlined, DescriptionOutlined,
  FactCheckOutlined, SchoolOutlined, BarChartOutlined, NotificationsNone,
  SettingsOutlined, Search, Menu as MenuIcon, Logout, ChevronLeft, ChevronRight
} from "@mui/icons-material";
import {
  collection, query, where, onSnapshot, doc, updateDoc, setDoc,
  addDoc, serverTimestamp, getDocs, orderBy, limit
} from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/Firebase";
import { collegesAPI, departmentsAPI, usersAPI, coursesAPI } from "../../services/api";

// Tabs
import RegistrarOverviewTab from "./tabs/RegistrarOverviewTab";
import RegistrarAdmissionsTab from "./tabs/RegistrarAdmissionsTab";
import StudentsTab from "./tabs/StudentsTab";
import EnrollmentMgmtTab from "./tabs/EnrollmentMgmtTab";
import GraduationMgmtTab from "./tabs/GraduationMgmtTab";
import TranscriptsTab from "./tabs/TranscriptsTab";
import CoursesMgmtTab from "./tabs/CoursesMgmtTab";
import SchedulesTab from "./tabs/SchedulesTab";
import RegistrarFinanceTab from "./tabs/RegistrarFinanceTab";
import IDManagementTab from "./tabs/IDManagementTab";
import RegistrarAnalyticsTab from "./tabs/RegistrarAnalyticsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import DocumentMgmtTab from "./tabs/DocumentMgmtTab";
import CollegesTab from "./tabs/CollegesTab";
import DepartmentsTab from "./tabs/DepartmentsTab";

const drawerWidth = 260;

const NAV_ITEMS = [
  { id: 0, label: "Dashboard", icon: <DashboardOutlined /> },
  { id: 1, label: "Student Records", icon: <PeopleAltOutlined /> },
  { id: 2, label: "Admissions", icon: <HowToRegOutlined /> },
  { id: 3, label: "Enrollment", icon: <SwapHorizOutlined /> },
  { id: 4, label: "Course Scheduling", icon: <CalendarMonthOutlined /> },
  { id: 5, label: "Programs", icon: <AccountTreeOutlined /> },
  { id: 6, label: "Courses", icon: <MenuBookOutlined /> },
  { id: 7, label: "Transcripts", icon: <DescriptionOutlined /> },
  { id: 8, label: "Degree Audits", icon: <FactCheckOutlined /> },
  { id: 9, label: "Graduation", icon: <SchoolOutlined /> },
  { id: 10, label: "Reports", icon: <BarChartOutlined /> },
];

export default function RegistrarDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Data State
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [idRequests, setIdRequests] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [regSettings, setRegSettings] = useState({ registrationLock: false, onlineRegistrationOpen: false });

  useEffect(() => {
    const unsubs = [];
    unsubs.push(onSnapshot(collection(db, "id_requests"), (snap) => setIdRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(collection(db, "tuition_payments"), (snap) => setPendingPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(10)), (snap) => setRecentActivity(snap.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(doc(db, "system_settings", "registrar"), (docSnap) => docSnap.exists() && setRegSettings(docSnap.data())));

    const fetchData = async () => {
      try {
        const [stuRes, courseRes, colRes, deptRes] = await Promise.all([
          usersAPI.getAll({ role: "student" }).catch(() => ({ data: [] })),
          coursesAPI.getAll().catch(() => ({ data: [] })),
          collegesAPI.getAll().catch(() => ({ data: [] })),
          departmentsAPI.getAll().catch(() => ({ data: [] }))
        ]);
        setStudents(stuRes.data || []);
        setCourses(courseRes.data || []);
        setColleges(colRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Data fetch error", err);
      }
    };
    fetchData();

    return () => unsubs.forEach(u => u());
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const drawerContent = (
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
          Registrar's Office
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ px: 2, py: 1.5, flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem
              button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (isMobile) setMobileOpen(false); }}
              sx={{
                mb: 0.5,
                borderRadius: '8px',
                bgcolor: isActive ? '#D9A621' : 'transparent',
                color: isActive ? '#0E2033' : 'rgba(255,255,255,0.7)',
                py: 0.9,
                px: 2,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isActive ? '#D9A621' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#0E2033' : '#fff'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: isActive ? 800 : 500 }}
              />
            </ListItem>
          );
        })}

        <Box sx={{ my: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <Typography variant="caption" sx={{ px: 2, py: 0.5, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: 1, display: 'block' }}>
          SYSTEM
        </Typography>
        <ListItem
          button
          onClick={() => { setActiveTab(11); if (isMobile) setMobileOpen(false); }}
          sx={{
            mb: 0.5,
            borderRadius: '8px',
            bgcolor: activeTab === 11 ? '#D9A621' : 'transparent',
            color: activeTab === 11 ? '#0E2033' : 'rgba(255,255,255,0.7)',
            py: 0.9,
            px: 2
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><NotificationsNone /></ListItemIcon>
          <ListItemText primary="Notifications" primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: activeTab === 11 ? 800 : 500 }} />
        </ListItem>
        <ListItem
          button
          onClick={() => { setActiveTab(12); if (isMobile) setMobileOpen(false); }}
          sx={{
            mb: 0.5,
            borderRadius: '8px',
            bgcolor: activeTab === 12 ? '#D9A621' : 'transparent',
            color: activeTab === 12 ? '#0E2033' : 'rgba(255,255,255,0.7)',
            py: 0.9,
            px: 2
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><SettingsOutlined /></ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: activeTab === 12 ? 800 : 500 }} />
        </ListItem>
      </List>

      {/* User Footer matching mockup */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 36, height: 36, fontSize: '0.85rem' }}>
            MA
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.84rem', lineHeight: 1.2 }}>
              Meskerem Abebe
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
              Registrar
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef4444' } }} title="Logout">
          <Logout fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  const renderActiveContent = () => {
    const props = { students, courses, colleges, setColleges, departments, setDepartments, schedules, idRequests, pendingPayments };
    switch (activeTab) {
      case 0: return <RegistrarOverviewTab />;
      case 1: return <StudentsTab {...props} />;
      case 2: return <RegistrarAdmissionsTab />;
      case 3: return <EnrollmentMgmtTab {...props} regLock={regSettings.registrationLock} onlineRegOpen={regSettings.onlineRegistrationOpen} />;
      case 4: return <SchedulesTab {...props} />;
      case 5: return <CollegesTab {...props} />;
      case 6: return <CoursesMgmtTab {...props} />;
      case 7: return <TranscriptsTab {...props} />;
      case 8: return <GraduationMgmtTab {...props} />;
      case 9: return <GraduationMgmtTab {...props} />;
      case 10: return <RegistrarAnalyticsTab {...props} />;
      case 11: return <NotificationsTab {...props} />;
      case 12: return <DocumentMgmtTab {...props} />;
      default: return <RegistrarOverviewTab />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Container */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar matching Screen 02 & Screen 20 */}
        <Box sx={{
          height: 64, bgcolor: '#fff', borderBottom: '1px solid #E2E8F0',
          px: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 650 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ color: '#0E2033' }}>
                <MenuIcon />
              </IconButton>
            )}
            <TextField
              size="small"
              fullWidth
              placeholder="Search students, records, documents, reports..."
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
              label="Fall 2025 intake · applications close Apr 30"
              size="small"
              sx={{
                bgcolor: '#FFFBEB',
                color: '#B45309',
                border: '1px solid #FDE68A',
                fontWeight: 700,
                fontSize: '0.72rem',
                display: { xs: 'none', md: 'inline-flex' }
              }}
            />

            <IconButton size="small" sx={{ color: '#64748B' }}>
              <Badge color="error" variant="dot">
                <NotificationsNone fontSize="small" />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 34, height: 34, fontSize: '0.82rem' }}>
                MA
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.82rem', lineHeight: 1.1 }}>
                  Meskerem Abebe
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Registrar
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tab Page Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          {renderActiveContent()}
        </Box>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
