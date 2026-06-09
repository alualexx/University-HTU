import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, LinearProgress, Avatar,
} from "@mui/material";
import { People, Warning, Gavel, School, TrendingUp, Handshake } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const GRADIENTS = { premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" };

export default function StudentOversightTab({ studentsCount }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const gpaData = [
        { sem: "S1 24", cs: 3.1, eng: 2.9, bus: 3.2 },
        { sem: "S2 24", cs: 3.2, eng: 3.0, bus: 3.3 },
        { sem: "S1 25", cs: 3.25, eng: 3.1, bus: 3.35 },
        { sem: "S2 25", cs: 3.4, eng: 3.15, bus: 3.4 },
    ];

    const disciplinaryCases = [
        { id: "DC-001", student: "Anonymous", type: "Academic Dishonesty", dept: "Engineering", status: "under_review", date: "2026-06-01" },
        { id: "DC-002", student: "Anonymous", type: "Code of Conduct Violation", dept: "Computer Science", status: "resolved", date: "2026-05-15" },
    ];

    const appeals = [
        { id: "AP-105", student: "Sarah Ahmed", type: "Grade Appeal", dept: "Business", status: "pending" },
        { id: "AP-106", student: "Omar Tariq", type: "Dismissal Appeal", dept: "Sciences", status: "pending" },
    ];

    const studentOrgs = [
        { name: "Computer Science Society", members: 120, status: "Active" },
        { name: "Engineering Student Council", members: 85, status: "Active" },
        { name: "Business Leaders Club", members: 150, status: "Active" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Student Oversight</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>ENROLLMENT • PERFORMANCE • DISCIPLINARY • APPEALS • ORGANIZATIONS</Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {["Enrollment & Performance", "Disciplinary Cases", "Student Appeals", "Student Organizations"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>GPA Trends by Department</Typography>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={gpaData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis dataKey="sem" tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[2.0, 4.0]} tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <RTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Line type="monotone" dataKey="cs" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="CS" />
                                            <Line type="monotone" dataKey="eng" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Engineering" />
                                            <Line type="monotone" dataKey="bus" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Business" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Key Metrics</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {[
                                        { label: "Total Enrollments", value: studentsCount || 1250 },
                                        { label: "Avg College GPA", value: "3.24" },
                                        { label: "Graduation Rate", value: "88%" },
                                        { label: "Retention Rate", value: "92%" },
                                    ].map((m, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${alpha("#94a3b8", 0.1)}`, pb: 1 }}>
                                            <Typography variant="body2" color="text.secondary" fontWeight={700}>{m.label}</Typography>
                                            <Typography variant="body2" fontWeight={900}>{m.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {subTab === 1 && (
                <Stack spacing={2}>
                    {disciplinaryCases.map((c, i) => (
                        <Card key={i} sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: alpha("#ef4444", 0.1), color: "#ef4444" }}><Gavel /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={900}>{c.id}: {c.type}</Typography>
                                            <Typography variant="caption" color="text.secondary">{c.dept} · Date: {c.date}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={c.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(c.status === "resolved" ? "#10b981" : "#f59e0b", 0.1), color: c.status === "resolved" ? "#10b981" : "#f59e0b" }} />
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}>View Record</Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {subTab === 2 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Appeal ID", "Student", "Type", "Department", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appeals.map((a, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{a.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{a.student}</TableCell>
                                    <TableCell><Chip label={a.type} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{a.dept}</TableCell>
                                    <TableCell><Chip label={a.status.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b" }} /></TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" color="success" variant="contained" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Accept</Button>
                                            <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {subTab === 3 && (
                <Grid container spacing={3}>
                    {studentOrgs.map((org, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3, textAlign: "center" }}>
                                    <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 2, background: GRADIENTS.premium }}><People /></Avatar>
                                    <Typography variant="subtitle1" fontWeight={900}>{org.name}</Typography>
                                    <Chip label={`${org.members} Members`} size="small" sx={{ mt: 1, fontWeight: 900, bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }} />
                                    <Box sx={{ mt: 3 }}>
                                        <Button size="small" fullWidth variant="outlined" sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}>Manage Access</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
