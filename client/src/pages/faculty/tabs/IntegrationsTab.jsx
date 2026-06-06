import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Chip, Stack, Avatar,
    Divider, alpha, Switch, FormControlLabel, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button,
} from "@mui/material";
import {
    CheckCircle, ErrorOutline, Schedule, HelpOutline,
    Email, Sms, Notifications, School, AccountBalance,
    LocalLibrary, AttachMoney, People, VerifiedUser,
    AdminPanelSettings, SupervisorAccount, Assignment,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
};

const INTEGRATIONS = [
    { name: "Registrar Portal", desc: "Enrollment, transcripts, grade submission", icon: <Assignment />, status: "connected", color: "#10b981" },
    { name: "Admin Portal", desc: "HR, budget approvals, system settings", icon: <AdminPanelSettings />, status: "connected", color: "#10b981" },
    { name: "Student Portal", desc: "Grades, attendance, course registration", icon: <School />, status: "connected", color: "#10b981" },
    { name: "Lecturer Portal", desc: "Course materials, assignments, submissions", icon: <SupervisorAccount />, status: "connected", color: "#10b981" },
    { name: "College Portal", desc: "College-wide reporting and approvals", icon: <AccountBalance />, status: "connected", color: "#10b981" },
    { name: "LMS (Moodle/Blackboard)", desc: "Course content, quizzes, online classes", icon: <People />, status: "pending", color: "#f59e0b" },
    { name: "Finance System", desc: "Fee collection, budget allocation", icon: <AttachMoney />, status: "connected", color: "#10b981" },
    { name: "Library System", desc: "Resource access, book reservations", icon: <LocalLibrary />, status: "not_configured", color: "#6366f1" },
];

const STATUS_LABEL = { connected: "Connected", pending: "Pending Setup", not_configured: "Not Configured" };
const STATUS_COLORS = { connected: "#10b981", pending: "#f59e0b", not_configured: "#94a3b8" };

const NOTIFICATION_EVENTS = [
    { key: "grade_submitted", label: "Grade Submission", email: true, sms: false },
    { key: "warning_issued", label: "Academic Warning Issued", email: true, sms: true },
    { key: "graduation_cleared", label: "Graduation Clearance Approved", email: true, sms: true },
    { key: "new_student", label: "New Student Enrolled", email: true, sms: false },
    { key: "add_drop", label: "Add/Drop Request Received", email: true, sms: false },
    { key: "exam_scheduled", label: "Exam Scheduled", email: true, sms: false },
    { key: "faculty_leave", label: "Faculty Leave Requested", email: true, sms: false },
    { key: "appeal_received", label: "Grade Appeal Received", email: true, sms: true },
];

const RBAC = [
    {
        role: "HOD (Head of Department)",
        icon: <AdminPanelSettings />,
        color: "#ef4444",
        permissions: ["Full access to all tabs", "Grade approval", "Faculty management", "Budget oversight", "Accreditation documents", "Forward grades to Registrar"],
    },
    {
        role: "Faculty / Lecturer",
        icon: <School />,
        color: "#6366f1",
        permissions: ["View enrolled students", "Enter & submit grades", "View own timetable", "Upload course syllabus", "Track student attendance"],
    },
    {
        role: "Department Secretary",
        icon: <Assignment />,
        color: "#f59e0b",
        permissions: ["Manage announcements", "Book rooms/labs", "Manage event calendar", "Upload documents", "Manage meeting agendas"],
    },
    {
        role: "Academic Advisor",
        icon: <SupervisorAccount />,
        color: "#10b981",
        permissions: ["View assigned students", "Issue academic warnings", "Process graduation clearance", "Add advising notes", "View student academic progress"],
    },
];

export default function IntegrationsTab({ user }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [notifications, setNotifications] = useState(
        NOTIFICATION_EVENTS.reduce((acc, e) => ({ ...acc, [e.key]: { email: e.email, sms: e.sms } }), {})
    );

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 16,
    };

    const toggleNotification = (key, type) => {
        setNotifications(prev => ({
            ...prev,
            [key]: { ...prev[key], [type]: !prev[key][type] },
        }));
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Integration & Communication</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    SYSTEM CONNECTIONS • NOTIFICATIONS • ROLE-BASED ACCESS
                </Typography>
            </Box>

            {/* System Integrations */}
            <Typography variant="h6" fontWeight={900} gutterBottom>System Integrations</Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {INTEGRATIONS.map((intg, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glass, transition: "0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                    <Avatar sx={{ background: GRADIENTS.premium, width: 44, height: 44 }}>
                                        {intg.icon}
                                    </Avatar>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Box sx={{
                                            width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLORS[intg.status],
                                            boxShadow: intg.status === "connected" ? `0 0 8px ${STATUS_COLORS[intg.status]}` : "none"
                                        }} />
                                        <Chip label={STATUS_LABEL[intg.status]} size="small" sx={{
                                            fontWeight: 900, fontSize: "0.6rem",
                                            bgcolor: alpha(STATUS_COLORS[intg.status], 0.1), color: STATUS_COLORS[intg.status]
                                        }} />
                                    </Box>
                                </Box>
                                <Typography variant="subtitle2" fontWeight={900}>{intg.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{intg.desc}</Typography>
                                {intg.status !== "connected" && (
                                    <Button fullWidth variant="outlined" size="small" sx={{ mt: 2, borderRadius: 2, fontWeight: 800, textTransform: "none" }}>
                                        {intg.status === "pending" ? "Complete Setup" : "Configure"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Summary */}
            <Grid container spacing={2} sx={{ mb: 5 }}>
                {[
                    { label: "Connected", count: INTEGRATIONS.filter(i => i.status === "connected").length, color: "#10b981" },
                    { label: "Pending", count: INTEGRATIONS.filter(i => i.status === "pending").length, color: "#f59e0b" },
                    { label: "Not Configured", count: INTEGRATIONS.filter(i => i.status === "not_configured").length, color: "#94a3b8" },
                ].map((s, i) => (
                    <Grid item xs={4} key={i}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 2, textAlign: "center" }}>
                                <Typography variant="h4" fontWeight={1000} color={s.color}>{s.count}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>{s.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Notification Settings */}
            <Typography variant="h6" fontWeight={900} gutterBottom>Email & SMS Notification Settings</Typography>
            <Card sx={{ ...glass, mb: 5 }}>
                <CardContent sx={{ p: 3 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 900 }}>Event</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 900 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                            <Email sx={{ fontSize: 16 }} /> Email
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 900 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                            <Sms sx={{ fontSize: 16 }} /> SMS
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {NOTIFICATION_EVENTS.map(ev => (
                                    <TableRow key={ev.key}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Notifications sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="body2" fontWeight={700}>{ev.label}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch size="small" checked={notifications[ev.key]?.email || false}
                                                onChange={() => toggleNotification(ev.key, "email")}
                                                sx={{ "& .MuiSwitch-thumb": { boxShadow: "none" }, "& .Mui-checked .MuiSwitch-thumb": { bgcolor: "#10b981" } }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch size="small" checked={notifications[ev.key]?.sms || false}
                                                onChange={() => toggleNotification(ev.key, "sms")}
                                                sx={{ "& .Mui-checked .MuiSwitch-thumb": { bgcolor: "#6366f1" } }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* RBAC */}
            <Typography variant="h6" fontWeight={900} gutterBottom>Role-Based Access Control (RBAC)</Typography>
            <Grid container spacing={3}>
                {RBAC.map((role, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(role.color, 0.15), color: role.color, width: 48, height: 48 }}>
                                        {role.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={900}>{role.role}</Typography>
                                        <Chip label="ACTIVE ROLE" size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha(role.color, 0.1), color: role.color }} />
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 1.5, opacity: 0.1 }} />
                                <Stack spacing={0.8}>
                                    {role.permissions.map((perm, pi) => (
                                        <Box key={pi} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CheckCircle sx={{ fontSize: 14, color: role.color }} />
                                            <Typography variant="caption" fontWeight={700}>{perm}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
