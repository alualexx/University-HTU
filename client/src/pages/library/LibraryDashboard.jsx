import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, 
  IconButton, useTheme, Avatar, useMediaQuery, TextField, InputAdornment, Badge 
} from '@mui/material';
import { 
  Menu as MenuIcon, Search, NotificationsNone, DashboardOutlined, 
  MenuBook, SyncAlt, BookmarkBorder, EventNote, CompareArrows, 
  AutoStories, BarChart, Settings, Logout 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LibCatalogTab from './tabs/LibCatalogTab';
import LibBorrowTab from './tabs/LibBorrowTab';
import LibReservationsTab from './tabs/LibReservationsTab';
import LibFinesTab from './tabs/LibFinesTab';
import LibThesisTab from './tabs/LibThesisTab';
import LibMembersTab from './tabs/LibMembersTab';
import LibDigitalTab from './tabs/LibDigitalTab';
import LibReportsTab from './tabs/LibReportsTab';

const drawerWidth = 260;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { id: 'catalog', label: 'Catalog', icon: <MenuBook /> },
  { id: 'circulation', label: 'Circulation', icon: <SyncAlt /> },
  { id: 'loans', label: 'My Loans', icon: <BookmarkBorder /> },
  { id: 'reservations', label: 'Reservations', icon: <EventNote /> },
  { id: 'ill', label: 'Interlibrary Loan', icon: <CompareArrows /> },
  { id: 'digital', label: 'Digital Collections', icon: <AutoStories /> },
  { id: 'reports', label: 'Reports', icon: <BarChart /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
];

export default function LibraryDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Default to Catalog tab (index 1) as in Screen 08
  const [selectedTab, setSelectedTab] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          Library Services
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = selectedTab === index;
          return (
            <ListItem
              button
              key={item.id}
              onClick={() => { setSelectedTab(index); if (isMobile) setMobileOpen(false); }}
              sx={{
                mb: 0.8,
                borderRadius: '8px',
                bgcolor: isActive ? '#D9A621' : 'transparent',
                color: isActive ? '#0E2033' : 'rgba(255,255,255,0.7)',
                fontWeight: isActive ? 800 : 500,
                py: 1,
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
                primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: isActive ? 800 : 600 }} 
              />
            </ListItem>
          );
        })}
      </List>

      {/* User Footer matching mockup */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 900, width: 36, height: 36, fontSize: '0.85rem' }}>
            TG
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.84rem', lineHeight: 1.2 }}>
              Tsehay Girma
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
              Librarian
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      {/* Side Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
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

      {/* Main Layout Area */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar */}
        <Box sx={{ 
          height: 64, bgcolor: '#fff', borderBottom: '1px solid #E2E8F0', 
          px: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 650 }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} edge="start" sx={{ color: '#0E2033' }}>
                <MenuIcon />
              </IconButton>
            )}
            <TextField
              size="small"
              fullWidth
              placeholder="Search books, journals, theses, authors, subjects, ISBN..."
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
                TG
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.82rem', lineHeight: 1.1 }}>
                  Tsehay Girma
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                  Librarian
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Dynamic Content View */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          {selectedTab === 0 && <LibBorrowTab onNavigateCatalog={() => setSelectedTab(1)} />}
          {selectedTab === 1 && <LibCatalogTab onNavigateCirculation={() => setSelectedTab(2)} />}
          {selectedTab === 2 && <LibBorrowTab onNavigateCatalog={() => setSelectedTab(1)} />}
          {selectedTab === 3 && <LibBorrowTab onNavigateCatalog={() => setSelectedTab(1)} />}
          {selectedTab === 4 && <LibReservationsTab />}
          {selectedTab === 5 && <LibFinesTab />}
          {selectedTab === 6 && <LibDigitalTab />}
          {selectedTab === 7 && <LibReportsTab />}
          {selectedTab === 8 && <LibMembersTab />}
        </Box>
      </Box>
    </Box>
  );
}
