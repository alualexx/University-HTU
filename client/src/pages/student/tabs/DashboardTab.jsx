import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Button, LinearProgress, alpha } from '@mui/material';
import { EmojiEvents, School, Book, Campaign, CheckCircleOutline, Warning, AccountBalanceWallet } from '@mui/icons-material';

// We duplicate StatCard inside DashboardTab for isolation
function StatCard({ stat, isDark }) {
    const d = stat.isGpa ? (stat.raw / 100).toFixed(2) : stat.raw;
    return (
        <Card sx={{
            background: isDark ? "rgba(255,255,255,0.04)" : "#fff",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
            borderRadius: 4, overflow: "hidden", position: 'relative', transition: "all 0.3s",
            "&:hover": { transform: "translateY(-6px)", boxShadow: isDark ? "0 16px 32px rgba(0,0,0,0.4)" : "0 16px 32px rgba(0,0,0,0.07)" }
        }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.gradient }} />
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1.5, fontSize: '0.6rem' }}>{stat.label}</Typography>
                        <Typography variant="h4" color="text.primary" fontWeight={900} sx={{ letterSpacing: -1 }}>{stat.isGpa ? d : stat.raw}<Typography component="span" variant="caption" color="text.secondary" fontWeight={800} sx={{ ml: 0.5, fontSize: '0.65rem' }}>{stat.suffix}</Typography></Typography>
                    </Box>
                </Box>
                <LinearProgress variant="determinate" value={stat.progress || 0} sx={{ height: 4, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", '& .MuiLinearProgress-bar': { background: stat.gradient, borderRadius: 2 } }} />
            </CardContent>
        </Card>
    );
}

export default function DashboardTab({
    user, systemConfig, myActiveCourses, totalCredits, requiredCredits,
    newsList, tuitionPayments, isDark, cardSx, gradients, setActiveTab, gpa
}) {
    const gpaRaw = Math.round(gpa * 100);
    const stats = [
        { label: "GPA", raw: gpaRaw, isGpa: true, suffix: "/ 4.00", gradient: gradients[0], icon: <EmojiEvents />, progress: (gpaRaw / 400) * 100 },
        { label: "Courses", raw: myActiveCourses.length, isGpa: false, suffix: "Active", gradient: gradients[1], icon: <School />, progress: myActiveCourses.length > 0 ? Math.min(myActiveCourses.length / 6 * 100, 100) : 0 },
        { label: "Credits", raw: totalCredits, isGpa: false, suffix: `/ ${requiredCredits}`, gradient: gradients[2], icon: <Book />, progress: Math.min((totalCredits / requiredCredits) * 100, 100) },
        { label: "News", raw: newsList.length, isGpa: false, suffix: "Updates", gradient: gradients[3], icon: <Campaign />, progress: newsList.length > 0 ? 100 : 0 },
    ];

    return (
        <Box>
            {/* Global Vitals Panel */}
            <Box sx={{ mb: 4, p: 2, borderRadius: 4, background: systemConfig.globalMaintenance ? alpha('#f59e0b', 0.1) : 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: systemConfig.globalMaintenance ? alpha('#f59e0b', 0.3) : 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(10px)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: systemConfig.globalMaintenance ? '#f59e0b' : '#10b981', boxShadow: `0 0 10px ${systemConfig.globalMaintenance ? '#f59e0b' : '#10b981'}` }} />
                    <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5 }}>SYSTEM INTEGRITY</Typography>
                        <Typography variant="body2" fontWeight={1000} color={systemConfig.globalMaintenance ? 'warning.main' : 'success.main'}>
                            {systemConfig.globalMaintenance ? "MAINTENANCE ACTIVE - SOME SERVICES RESTRICTED" : "ALL SYSTEMS NOMINAL"}
                        </Typography>
                    </Box>
                </Box>
                <Stack direction="row" spacing={4} sx={{ mr: 4, display: { xs: 'none', md: 'flex' } }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">PROTOCOL</Typography>
                        <Typography variant="body2" fontWeight={1000} color={systemConfig.registrationLock ? 'error.main' : 'primary.main'}>
                            {systemConfig.registrationLock ? "REG LOCKED" : "REG OPEN"}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((s, i) => <Grid item xs={12} sm={6} md={3} key={i}><StatCard stat={s} isDark={isDark} /></Grid>)}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 4 }}>
                        <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>Welcome back, {user?.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                            Your profile is synced. Use <strong>Semester Registration</strong> to enroll, or check <strong>Timetable & Exams</strong> for your schedule.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={() => setActiveTab(1)} sx={{ borderRadius: 3, fontWeight: 900, px: 3.5, textTransform: 'none' }}>Register for Semester</Button>
                            <Button variant="outlined" onClick={() => setActiveTab(6)} sx={{ borderRadius: 3, fontWeight: 900, px: 3.5, textTransform: 'none' }}>View Timetable</Button>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 4, height: '100%' }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Financial Summary</Typography>
                        {tuitionPayments.filter(p => p.status === 'approved').length > 0 ? (
                            <Box sx={{ bgcolor: alpha('#10b981', 0.08), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircleOutline sx={{ color: '#10b981', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="success.main">Cleared</Typography><Typography variant="caption" color="text.secondary">No balance</Typography></Box></Box>
                        ) : tuitionPayments.length > 0 ? (
                            <Box sx={{ bgcolor: alpha('#f59e0b', 0.08), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><Warning sx={{ color: '#f59e0b', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="warning.main">Pending</Typography><Typography variant="caption" color="text.secondary">Awaiting review</Typography></Box></Box>
                        ) : (
                            <Box sx={{ bgcolor: alpha('#3b82f6', 0.06), p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}><AccountBalanceWallet sx={{ color: '#3b82f6', fontSize: 26 }} /><Box><Typography variant="subtitle2" fontWeight={900} color="info.main">No Payments</Typography><Typography variant="caption" color="text.secondary">Register to begin</Typography></Box></Box>
                        )}
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>Degree Progress</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>{totalCredits}/{requiredCredits}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min((totalCredits / requiredCredits) * 100, 100)} sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: gradients[0], borderRadius: 3 } }} />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
