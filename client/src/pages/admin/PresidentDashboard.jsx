import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemIcon, ListItemText, Divider, IconButton, Avatar,
  Button, Grid, Paper, Card, CardContent, Chip, Stack,
  LinearProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Badge, useTheme, useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as GovernanceIcon,
  School as FacultyIcon,
  AttachMoney as FinanceIcon,
  AutoStories as LibraryIcon,
  Timeline as StrategyIcon,
  NotificationsNone as NotificationsIcon,
  Menu as MenuIcon,
  CheckCircle,
  AccountTree,
  Article,
  Church,
  Download
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { HTTU_COLORS } from '../../theme';

const DRAWER_WIDTH = 270;

const PresidentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Executive Overview');

  const menuItems = [
    { text: 'Executive Overview', icon: <DashboardIcon /> },
    { text: 'Holy Synod & Governance', icon: <GovernanceIcon /> },
    { text: 'Theology Faculties', icon: <FacultyIcon /> },
    { text: 'Financial Endowment', icon: <FinanceIcon /> },
    { text: 'Manuscript Archives', icon: <LibraryIcon /> },
    { text: 'Strategic Plan 2030', icon: <StrategyIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0E2033', color: '#fff' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #D9A621', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9A621', fontSize: '20px', fontWeight: 'bold' }}>
          ✝
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white', letterSpacing: '0.8px', lineHeight: 1.2 }}>
            HTTU EXECUTIVE
          </Typography>
          <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 700, fontSize: '0.7rem' }}>
            Office of the President
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, pt: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.text;
          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => { setActiveTab(item.text); if (isMobile) setMobileOpen(false); }}
              sx={{
                mb: 0.8,
                borderRadius: 2,
                bgcolor: isActive ? '#D9A621' : 'transparent',
                color: isActive ? '#0E2033' : 'rgba(255,255,255,0.75)',
                fontWeight: isActive ? 800 : 500,
                '&:hover': {
                  bgcolor: isActive ? '#D9A621' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#0E2033' : 'white'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#0E2033' : '#D9A621', minWidth: 38 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: isActive ? 800 : 500 }} 
              />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ p: 1.8, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid rgba(255,255,255,0.08)' }}>
          <Avatar sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 'bold', width: 38, height: 38, fontSize: '0.85rem' }}>
            ብአ
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' }}>
              {user?.full_name || 'Archbishop Merkorios'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#D9A621', display: 'block', fontSize: '0.68rem' }}>
              University President
            </Typography>
          </Box>
        </Box>
        <Button fullWidth variant="outlined" size="small" onClick={logout} sx={{ mt: 1.5, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      {/* Top Header */}
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: '#fff', boxShadow: 'none', borderBottom: '1px solid #E2E8F0', color: '#0E2033' }}>
        <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' }, mr: 2, color: '#0E2033' }}>
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033', lineHeight: 1.2 }}>
                {activeTab}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Ethiopia Holy Trinity Theology University · Executive Governance
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip 
              icon={<Church sx={{ fontSize: 16, color: '#D9A621 !important' }} />} 
              label="Patriarchal Seat / Synod Approved" 
              size="small" 
              sx={{ bgcolor: 'rgba(217,166,33,0.12)', color: '#0E2033', fontWeight: 800, border: '1px solid rgba(217,166,33,0.3)' }} 
            />
            <IconButton size="small" sx={{ color: '#64748B' }}>
              <Badge badgeContent={3} color="warning">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Body */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: 8 }}>
        {activeTab === 'Executive Overview' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* KPI Cards */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', borderTop: '4px solid #D9A621' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Seminarians</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>3,248</Typography>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, mt: 0.5, display: 'block' }}>+8.4% intake across 7 departments</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', borderTop: '4px solid #12808C' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Endowment Reserve</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>ETB 48.6M</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>Synod allocation & diaspora gifts</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', borderTop: '4px solid #0E2033' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Theology Faculty</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>84</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>62 Ordained Clergy · 22 Lay Theologians</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', borderTop: '4px solid #16a34a' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>HERQA Accreditation</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#16a34a', mt: 1 }}>100% Compliant</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>BTh & MDiv certified through 2029</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Strategic Row */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033' }}>
                      University Council Strategic Directives
                    </Typography>
                    <Chip label="Fall 2025 Cycle" size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700 }} />
                  </Box>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>Ge'ez Ancient Manuscript Digitization (IIIF)</Typography>} 
                        secondary="Phase 2: 1,480 parchments cataloged, 420 high-res scans deployed on digital repository" 
                      />
                      <Chip label="78% Complete" size="small" sx={{ bgcolor: 'rgba(18,128,140,0.1)', color: '#12808C', fontWeight: 800 }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>Holy Synod Rural Seminaries Academic Integration</Typography>} 
                        secondary="Curriculum alignment across Gondar, Wollo, and Axum diocesan traditional schools" 
                      />
                      <Chip label="92% Complete" size="small" sx={{ bgcolor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 800 }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>St. Yared Sacred Chant Center of Excellence</Typography>} 
                        secondary="Construction of state-of-the-art acoustic recording chapel and hymnology archive" 
                      />
                      <Chip label="65% Complete" size="small" sx={{ bgcolor: 'rgba(217,166,33,0.15)', color: '#b45309', fontWeight: 800 }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>International Oriental Orthodox Theological Colloquium</Typography>} 
                        secondary="Hosting delegations from Coptic, Armenian, and Syriac Orthodox sister seminaries" 
                      />
                      <Chip label="Planning Active" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700 }} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#0E2033', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#D9A621', mb: 1 }}>
                      Presidential Decrees & Actions
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontSize: '0.82rem' }}>
                      Pending executive approvals submitted by Academic Dean and Central Registrar.
                    </Typography>
                    <Stack spacing={1.5}>
                      <Button fullWidth variant="contained" sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, '&:hover': { bgcolor: '#c29219' }, textTransform: 'none' }}>
                        Authorize Fall 2025 Degrees (402 Candidates)
                      </Button>
                      <Button fullWidth variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700, '&:hover': { borderColor: '#fff' }, textTransform: 'none' }}>
                        Approve Annual Theological Endowment
                      </Button>
                      <Button fullWidth variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700, '&:hover': { borderColor: '#fff' }, textTransform: 'none' }}>
                        Convene Holy Synod Academic Advisory
                      </Button>
                    </Stack>
                  </Box>
                  <Box sx={{ pt: 3, mt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      HTTU Presidential Seal No. 2026-PRES-001
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 'Holy Synod & Governance' && (
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              Holy Synod Academic Affairs Standing Committee
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 800 }}>Resolution Reference</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Subject Area</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Synod Session</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Implementation Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>SYNOD-RES-2025-08</TableCell>
                    <TableCell>National Clergy Theological Qualification Framework (Level IV to Master's)</TableCell>
                    <TableCell>Tikimt 2018 E.C.</TableCell>
                    <TableCell><Chip label="Promulgated" size="small" color="success" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>SYNOD-RES-2025-04</TableCell>
                    <TableCell>Patristic Ethiopic Translation Series Sponsorship (12 volumes)</TableCell>
                    <TableCell>Hamle 2017 E.C.</TableCell>
                    <TableCell><Chip label="In Translation" size="small" color="info" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {activeTab === 'Theology Faculties' && (
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              The 7 Theological Departments Overview
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Biblical Studies', chair: 'Dr. Alemeyahu Worku', students: 640, faculty: 14 },
                { name: 'Systematic Theology', chair: 'Dr. Sofia Assefa', students: 580, faculty: 12 },
                { name: 'Church History', chair: 'Rev. Dr. Abeba Zerihun', students: 510, faculty: 11 },
                { name: 'Pastoral Theology', chair: 'Archbishop Merkorios Tilahun', students: 480, faculty: 15 },
                { name: 'Liturgical Studies', chair: 'Dr. Sofia Assefa', students: 390, faculty: 10 },
                { name: 'Church Music (St. Yared)', chair: 'Tsehay Girma', students: 380, faculty: 12 },
                { name: "Ge'ez & Classical Languages", chair: 'Dr. Alemeyahu Worku', students: 268, faculty: 10 },
              ].map((dept, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{ border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>{dept.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>Chair: {dept.chair}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #F1F5F9' }}>
                        <Typography variant="caption"><strong>{dept.students}</strong> Enrolled</Typography>
                        <Typography variant="caption"><strong>{dept.faculty}</strong> Scholars</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {activeTab === 'Financial Endowment' && (
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              University Endowment & Institutional Reserves
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Total Endowment Fund</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#0E2033' }}>ETB 48,600,000</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Tuition Collections (YTD)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#16a34a' }}>ETB 14,250,000</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Needy Seminarians Scholarship</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#D9A621' }}>ETB 6,400,000</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}

        {activeTab === 'Manuscript Archives' && (
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 1 }}>
              National Ge'ez Parchment & Manuscript Archives
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Special collections curated by Chief Librarian Tsehay Girma under presidential patrimony mandate.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Cataloged Codices</Typography>
                  <Typography variant="h4" fontWeight={900} color="#0E2033">1,480</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Digitized & Available (IIIF)</Typography>
                  <Typography variant="h4" fontWeight={900} color="#12808C">420</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Restored Ancient Vellum (13th-16th C.)</Typography>
                  <Typography variant="h4" fontWeight={900} color="#D9A621">112</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}

        {activeTab === 'Strategic Plan 2030' && (
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              HTTU 2030 Strategic Horizon: Orthodox Theological Excellence
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>Establishment of International Patristic Translation Center</Typography>
                  <Typography variant="caption" fontWeight={800}>80%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#12808C' } }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>Diocesan E-Learning Expansion (All 12 Regional Dioceses)</Typography>
                  <Typography variant="caption" fontWeight={800}>65%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' } }} />
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default PresidentDashboard;
