import React, { useState, useEffect } from "react";
import {
  Box, Typography, Avatar, IconButton, List, ListItem, ListItemIcon, ListItemText,
  Button, Chip, useTheme, useMediaQuery, TextField, InputAdornment, Badge, Drawer
} from "@mui/material";
import {
  DashboardOutlined, PersonOutline, AppRegistration, MenuBook,
  CalendarMonth, GradeOutlined, DescriptionOutlined, FactCheckOutlined,
  AccountBalanceWalletOutlined, VolunteerActivismOutlined, Computer,
  LocalLibraryOutlined, NotificationsNone, Search, Menu as MenuIcon, Logout
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DashboardTab from "./tabs/DashboardTab";
import ProfileTab from "./tabs/ProfileTab";
import RegistrationTab from "./tabs/RegistrationTab";
import TimetableTab from "./tabs/TimetableTab";
import GradesTab from "./tabs/GradesTab";
import FinanceTab from "./tabs/FinanceTab";
import LearningTab from "./tabs/LearningTab";
import AcademicRecordsTab from "./tabs/AcademicRecordsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ServicesTab from "./tabs/ServicesTab";

const drawerWidth = 260;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { id: 'profile', label: 'My Profile', icon: <PersonOutline /> },
  { id: 'registration', label: 'Course Registration', icon: <AppRegistration /> },
  { id: 'my-courses', label: 'My Courses', icon: <MenuBook /> },
  { id: 'schedule', label: 'Class Schedule', icon: <CalendarMonth /> },
  { id: 'grades', label: 'Grades', icon: <GradeOutlined /> },
  { id: 'transcript', label: 'Transcript', icon: <DescriptionOutlined /> },
  { id: 'degree-audit', label: 'Degree Audit', icon: <FactCheckOutlined /> },
  { id: 'fees', label: 'Fees & Payments', icon: <AccountBalanceWalletOutlined /> },
  { id: 'aid', label: 'Financial Aid', icon: <VolunteerActivismOutlined /> },
  { id: 'elearning', label: 'E-Learning', icon: <Computer /> },
  { id: 'library', label: 'Library', icon: <LocalLibraryOutlined /> },
  { id: 'notifications', label: 'Notifications', icon: <NotificationsNone /> },
];

export default function StudentDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

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
          Ethiopia Holy Trinity
        </Typography>
        <Typography variant="caption" sx={{ letterSpacing: 1.2, fontWeight: 800, color: '#D9A621', fontSize: '0.68rem', display: 'block', textTransform: 'uppercase' }}>
          Theology University
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
                mb: 0.4,
                borderRadius: '8px',
                bgcolor: isActive ? '#D9A621' : 'transparent',
                color: isActive ? '#0E2033' : 'rgba(255,255,255,0.7)',
                py: 0.8,
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
                primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: isActive ? 800 : 500 }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* User Footer matching mockup */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 36, height: 36, fontSize: '0.85rem' }}>
            DG
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.82rem', lineHeight: 1.2 }}>
              Daniel Gebremariam
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              Student · HTTU24158
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleLogout} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef4444' } }} title="Logout">
          <Logout fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab user={user} setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfileTab user={user} setActiveTab={setActiveTab} />;
      case 'registration':
        return <RegistrationTab user={user} setActiveTab={setActiveTab} />;
      case 'my-courses':
        return <TimetableTab setActiveTab={setActiveTab} />;
      case 'schedule':
        return <TimetableTab setActiveTab={setActiveTab} />;
      case 'grades':
        return <GradesTab />;
      case 'transcript':
        return <GradesTab />;
      case 'degree-audit':
        return <GradesTab />;
      case 'fees':
        return <FinanceTab />;
      case 'aid':
        return <FinanceTab />;
      case 'elearning':
        return <LearningTab />;
      case 'library':
        return <TimetableTab setActiveTab={setActiveTab} />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <DashboardTab user={user} setActiveTab={setActiveTab} />;
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

      {/* Main Area */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar matching Screen 03/09/10/11/12 */}
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
              placeholder="Search courses, announcements, resources..."
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
            <IconButton size="small" sx={{ color: '#64748B' }}>
              <Badge color="error" variant="dot">
                <NotificationsNone fontSize="small" />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 34, height: 34, fontSize: '0.82rem' }}>
                DG
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.82rem', lineHeight: 1.1 }}>
                  Daniel Gebremariam
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Student
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tab Page Area */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}
