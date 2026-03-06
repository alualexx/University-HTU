import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Grid, Card, CardContent, Typography, Box, Button,
  Avatar, Chip, Divider, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, useTheme,
  Tooltip, Stack, Badge, Tabs, Tab,
} from "@mui/material";
import {
  Business, People, School, Assignment, TrendingUp, Assessment,
  AccountCircle, Notifications, LightMode, DarkMode, Logout,
  Dashboard, Star, Groups, BarChart as BarChartIcon, Settings,
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";

const gradients = {
  primary: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  secondary: "linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)",
  success: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
  warning: "linear-gradient(135deg, #a16207 0%, #eab308 100%)",
};

const departmentStats = [
  { name: 'CS', gpa: 3.4, students: 450, faculty: 12 },
  { name: 'Engineering', gpa: 3.1, students: 300, faculty: 10 },
  { name: 'Business', gpa: 3.5, students: 250, faculty: 8 },
  { name: 'Arts', gpa: 3.6, students: 150, faculty: 6 },
];

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, (duration / end));
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

const DepartmentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const isDark = theme.palette.mode === 'dark';

  const glassStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)" : "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <Box sx={{ bgcolor: isDark ? "#020617" : "#f1f5f9", minHeight: "100vh", pb: 10 }}>
      {/* Header */}
      <Box sx={{
        background: isDark
          ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
          : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
        pt: 6, pb: 12, position: "relative"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', fontWeight: 900, fontSize: '2rem' }}>
                {user?.name?.[0] || 'H'}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Typography variant="h3" fontWeight={900} color="white" letterSpacing="-0.04em">
                    Dept. Head Portal
                  </Typography>
                  <Chip label="Admin Tier-2" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 800 }} />
                </Box>
                <Typography variant="h6" color="rgba(255,255,255,0.8)" fontWeight={500}>
                  Head of Department: <span style={{ color: 'white', fontWeight: 700 }}>{user?.name || "Dr. Alan Turing"}</span>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleColorMode} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}>
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
              <Button onClick={handleLogout} variant="contained" sx={{ bgcolor: "rgba(255,255,255,0.15)", fontWeight: 700, borderRadius: 2.5, textTransform: 'none' }}>
                Sign Out
              </Button>
            </Box>
          </Box>

          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mt: 4, '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 800 }, '& .Mui-selected': { color: 'white !important' }, '& .MuiTabs-indicator': { bgcolor: 'white', height: 4, borderRadius: 2 } }}>
            <Tab label="Dashboard" icon={<Dashboard sx={{ mr: 1 }} />} iconPosition="start" />
            <Tab label="Faculty" icon={<Groups sx={{ mr: 1 }} />} iconPosition="start" />
            <Tab label="Programs" icon={<School sx={{ mr: 1 }} />} iconPosition="start" />
            <Tab label="Analytics" icon={<Assessment sx={{ mr: 1 }} />} iconPosition="start" />
            <Tab label="Settings" icon={<Settings sx={{ mr: 1 }} />} iconPosition="start" />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 10 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {[
              { label: "Total Students", value: 1250, icon: <People />, color: gradients.primary },
              { label: "Faculty Members", value: 32, icon: <Groups />, color: gradients.secondary },
              { label: "Avg Department GPA", value: 3.4, icon: <Star />, color: gradients.success, suffix: "" },
              { label: "Active Research", value: 18, icon: <TrendingUp />, color: gradients.warning },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: 3, background: `${stat.color}22`, color: 'primary.main' }}>{stat.icon}</Box>
                    </Box>
                    <Typography variant="h4" fontWeight={900}>{stat.value}{stat.suffix}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} md={8}>
              <Card sx={{ ...glassStyle, borderRadius: 4, height: 400 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={800} gutterBottom>GPA Analysis by Department</Typography>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={departmentStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 4]} />
                      <RechartsTooltip />
                      <Bar dataKey="gpa" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                        {departmentStats.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#a855f7'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ ...glassStyle, borderRadius: 4, height: 400 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={800} gutterBottom>Faculty Overview</Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {[
                      { name: "Dr. Mills", role: "Tenured Professor", courses: 4 },
                      { name: "Prof. Smith", role: "Sr. Lecturer", courses: 5 },
                      { name: "Dr. Chen", role: "Assoc. Professor", courses: 3 },
                    ].map((f, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 3, bgcolor: 'action.hover' }}>
                        <Avatar sx={{ mr: 2 }}>{f.name[4]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800}>{f.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{f.role} · {f.courses} Courses</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                  <Button fullWidth sx={{ mt: 2, borderRadius: 3 }}>View All Faculty</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab > 0 && (
          <Card sx={{ ...glassStyle, borderRadius: 5, p: 10, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={900}>Strategic View Pending Implementation</Typography>
            <Typography color="text.secondary">This department head module is currently being populated with live administrative data.</Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default DepartmentDashboard;
