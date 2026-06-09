import React, { useState, useEffect } from "react";
import {
    Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText,
    Toolbar, AppBar, IconButton, Avatar, alpha, CircularProgress, Container, Card, Divider, Button,
} from "@mui/material";
import {
    Menu as MenuIcon, Speed, School, Domain, Class, People, Group,
    AccountBalance, Science, Handshake, Event, Policy, Assessment, Notifications, Dashboard as CanvasIcon,
    Logout,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";

// Import all tabs from index
import {
    OverviewTab, ProfileTab, DepartmentManagementTab, AcademicOversightTab,
    FacultyStaffTab, StudentOversightTab, FinancialManagementTab, ResearchInnovationTab,
    PartnershipsTab, EventsCalendarTab, PolicyGovernanceTab, ReportsAnalyticsTab, NotificationsTab
} from "./tabs";

// Mock API (Replace with actual data fetching logic in production if needed here, 
// though we usually fetch in the tabs themselves, we'll pass global state from this shell if required)
import { collegesAPI, departmentsAPI, usersAPI } from "../../services/api";

const drawerWidth = 280;

const NAV_ITEMS = [
    { id: "overview", label: "Executive Overview", icon: <Speed /> },
    { id: "profile", label: "College Profile", icon: <School /> },
    { id: "departments", label: "Departments", icon: <Domain /> },
    { id: "academic", label: "Academic Oversight", icon: <Class /> },
    { id: "faculty", label: "Faculty & Staff", icon: <People /> },
    { id: "students", label: "Student Oversight", icon: <Group /> },
    { id: "financial", label: "Financial Ops", icon: <AccountBalance /> },
    { id: "research", label: "Research & Innov", icon: <Science /> },
    { id: "partnerships", label: "Partnerships", icon: <Handshake /> },
    { id: "events", label: "Events & Calendar", icon: <Event /> },
    { id: "policy", label: "Policy & Gov", icon: <Policy /> },
    { id: "reports", label: "Reports & Analytics", icon: <Assessment /> },
    { id: "notifications", label: "Notifications", icon: <Notifications /> },
];

export default function CollegeDashboard() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const [loading, setLoading] = useState(true);
    const [college, setCollege] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [allStudents, setAllStudents] = useState([]);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderRight: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.4)",
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Determine college from context or login. Assuming admin is logging in.
                // Fetch first college for demo purposes if context is not fully wired yet
                const colls = await collegesAPI.getAll();
                const myCol = colls.data?.length ? colls.data[0] : null;
                setCollege(myCol);

                if (myCol) {
                    const depts = await departmentsAPI.getAll({ collegeId: myCol._id || myCol.id });
                    setDepartments(depts.data || []);
                }

                // Pre-fetch global staff list
                const users = await usersAPI.getAll();
                if (users.data) {
                    setFacultyList(users.data.filter(u => u.role === "teacher"));
                    setAllStudents(users.data.filter(u => u.role === "student"));
                }
            } catch (err) {
                console.error("Failed to load college context:", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", color: isDark ? "#fff" : "#000" }}>
                    <CanvasIcon />
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight={1000} sx={{ lineHeight: 1.1 }}>Command Core</Typography>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">College Admin</Typography>
                </Box>
            </Box>

            <List sx={{ flex: 1, px: 2, overflowY: "auto" }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <ListItem button key={item.id} onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                            sx={{
                                borderRadius: 3, mb: 0.5,
                                bgcolor: isActive ? alpha("#6366f1", 0.1) : "transparent",
                                color: isActive ? "#6366f1" : "text.secondary",
                                "&:hover": { bgcolor: isActive ? alpha("#6366f1", 0.15) : alpha(theme.palette.text.primary, 0.05) }
                            }}>
                            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 900 : 700, fontSize: "0.85rem" }} />
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Section */}
            <Divider sx={{ opacity: 0.1 }} />
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, mb: 1, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: alpha("#6366f1", 0.15), color: "#6366f1", fontSize: "0.8rem", borderRadius: 1.5 }}>
                        {user?.name?.charAt(0) || "D"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={900} noWrap sx={{ display: "block" }}>{user?.name || "Dean"}</Typography>
                        <Typography variant="caption" color="text.disabled" noWrap sx={{ fontSize: "0.65rem" }}>{user?.email}</Typography>
                    </Box>
                </Box>
                <ListItem button onClick={logout} sx={{ borderRadius: 2, color: "#ef4444", "&:hover": { bgcolor: alpha("#ef4444", 0.08) }, px: 1.5, py: 1 }}>
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><Logout fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 800, fontSize: "0.85rem" }} />
                </ListItem>
            </Box>
        </Box>
    );

    if (loading) {
        return <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
            {/* Mobile App Bar */}
            <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, ...glass, borderBottom: "none", display: { sm: "none" } }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: "text.primary" }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap color="text.primary" fontWeight={900}>College Portal</Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, ...glass } }}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, ...glass } }} open>
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, pt: { xs: 10, sm: 4 } }}>
                <Container maxWidth="xl" disableGutters>
                    {/* Render active module based on state */}
                    {activeTab === "overview" && <OverviewTab college={college} departments={departments} students={allStudents.length} faculty={facultyList.length} />}
                    {activeTab === "profile" && <ProfileTab college={college} setCollege={setCollege} />}
                    {activeTab === "departments" && <DepartmentManagementTab departments={departments} collegeContext={college} facultyList={facultyList} />}
                    {activeTab === "academic" && <AcademicOversightTab college={college} departments={departments} />}
                    {activeTab === "faculty" && <FacultyStaffTab college={college} departments={departments} facultyList={facultyList} />}
                    {activeTab === "students" && <StudentOversightTab departments={departments} students={allStudents.length} />}
                    {activeTab === "financial" && <FinancialManagementTab />}
                    {activeTab === "research" && <ResearchInnovationTab />}
                    {activeTab === "partnerships" && <PartnershipsTab />}
                    {activeTab === "events" && <EventsCalendarTab />}
                    {activeTab === "policy" && <PolicyGovernanceTab />}
                    {activeTab === "reports" && <ReportsAnalyticsTab />}
                    {activeTab === "notifications" && <NotificationsTab />}
                </Container>
            </Box>
        </Box>
    );
}
