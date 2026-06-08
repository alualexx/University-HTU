import React, { useState } from "react";
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Avatar, Chip, Divider, Button, IconButton, Badge,
    useTheme, useMediaQuery
} from "@mui/material";
import {
    Dashboard, AccountBox, Payments, Receipt, AccountBalance,
    LocalAtm, CreditCard, PieChart, Settings, Description,
    LightMode, DarkMode, Menu as MenuIcon, Notifications
} from "@mui/icons-material";
import { DashboardTab, AccountManagementTab } from './tabs';
import { useAuth } from "../../context/AuthContext";
import { useColorMode } from "../../context/ThemeContext";

const SIDEBAR_WIDTH = 280;

const NAV_ITEMS = [
    { label: "Overview Dashboard", icon: <Dashboard /> },
    { label: "Account Management", icon: <AccountBox /> },
    { label: "Fee Management", icon: <Payments /> },
    { label: "Invoicing & Billing", icon: <Receipt /> },
    { label: "Payment Processing", icon: <CreditCard /> },
    { label: "Student Records", icon: <Description /> },
    { label: "Scholarship & Aid", icon: <AccountBalance /> },
    { label: "Payroll Processing", icon: <LocalAtm /> },
    { label: "Budget & Expenditure", icon: <PieChart /> },
    { label: "Accounting & Ledger", icon: <Description /> },
    { label: "Reports & Analytics", icon: <PieChart /> },
    { label: "Settings & Setup", icon: <Settings /> }
];

const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
];

export default function FinanceDashboard() {
    const { user, logout } = useAuth();
    const { mode, toggleColorMode } = useColorMode();
    const isDark = mode === 'dark';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [activeTab, setActiveTab] = useState(0);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const cardSx = {
        background: isDark ? "rgba(15,23,42,0.6)" : "#fff",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.03)"
    };

    const sidebarContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #065f46 0%, #047857 100%)' }}>
            <Box sx={{ p: 3, pt: 4, textAlign: 'center' }}>
                <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, bgcolor: 'white', color: '#047857', fontWeight: 900, fontSize: '1.8rem', border: '3px solid rgba(255,255,255,0.25)' }}>
                    {(user?.name || "F")[0].toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={900} color="white" sx={{ lineHeight: 1.2 }}>{user?.name || "Finance Admin"}</Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={700}>Financial Operation Hub</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
            <List sx={{ px: 1.5, py: 2, flex: 1, overflowY: 'auto' }}>
                {NAV_ITEMS.map((item, i) => (
                    <ListItemButton
                        key={i}
                        selected={activeTab === i}
                        onClick={() => { setActiveTab(i); setMobileNavOpen(false); }}
                        sx={{
                            borderRadius: 3, mb: 0.5, py: 1.3, px: 2,
                            color: activeTab === i ? 'white' : 'rgba(255,255,255,0.6)',
                            bgcolor: activeTab === i ? 'rgba(255,255,255,0.15)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' },
                            transition: '0.2s',
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeTab === i ? 900 : 700, fontSize: '0.85rem' }} />
                    </ListItemButton>
                ))}
            </List>
            <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button fullWidth onClick={toggleColorMode} startIcon={isDark ? <LightMode /> : <DarkMode />} sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 800, borderRadius: 2.5, py: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }}>
                    {isDark ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button fullWidth onClick={logout} sx={{ color: 'rgba(255,200,200,0.8)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 800, borderRadius: 2.5, py: 1, mt: 0.5, '&:hover': { bgcolor: 'rgba(255,0,0,0.1)', color: '#fca5a5' } }}>
                    Sign Out
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: "background.default", minHeight: "100vh", color: "text.primary" }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', border: 'none' }
                }}
            >
                {sidebarContent}
            </Drawer>

            {/* Desktop Sidebar */}
            <Box sx={{
                width: SIDEBAR_WIDTH, flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1200,
                display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
                borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
            }}>
                {sidebarContent}
            </Box>

            {/* Main Content Area */}
            <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, flex: 1, minHeight: '100vh', minWidth: 0, pb: 10 }}>
                {isMobile && (
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? '#0f172a' : '#047857', color: 'white' }}>
                        <IconButton onClick={() => setMobileNavOpen(true)} sx={{ color: 'white' }}><MenuIcon /></IconButton>
                        <Typography variant="subtitle1" fontWeight={900}>{NAV_ITEMS[activeTab]?.label}</Typography>
                        <IconButton sx={{ color: 'white' }}><Badge color="error"><Notifications /></Badge></IconButton>
                    </Box>
                )}

                {/* Desktop Top Bar */}
                <Box sx={{ px: { xs: 2, md: 5 }, py: 2.5, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box>
                        <Typography variant="h5" fontWeight={900}>{NAV_ITEMS[activeTab]?.label}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Financial Operations · Command Center</Typography>
                    </Box>
                    <IconButton sx={{ border: '1px solid', borderColor: 'divider', p: 1.2 }}>
                        <Badge color="error"><Notifications /></Badge>
                    </IconButton>
                </Box>

                {/* Dynamic Tab Content */}
                <Box sx={{ p: { xs: 2, md: 5 } }}>
                    {activeTab === 0 && <DashboardTab user={user} isDark={isDark} cardSx={cardSx} gradients={gradients} />}
                    {activeTab === 1 && <AccountManagementTab isDark={isDark} cardSx={cardSx} gradients={gradients} />}
                    {/* Placeholders for subsequent tabs */}
                    {activeTab > 1 && (
                        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                            <Typography variant="h6" fontWeight={900}>Module Under Construction</Typography>
                            <Typography variant="body2">This module is planned in the Financial Portal Roadmap.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
