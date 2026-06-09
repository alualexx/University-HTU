import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar, LinearProgress,
} from "@mui/material";
import { Assessment, Science, Add, AutoStories, Handshake } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

const GRADIENTS = { premium: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" };

export default function ResearchInnovationTab({ researchProjects }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const projects = researchProjects || [
        { title: "AI in Predictive Healthcare", pi: "Dr. Ahmad Khalil", funding: 150000, status: "active", progress: 65, agency: "National Science Foundation" },
        { title: "Sustainable Concrete Formulas", pi: "Dr. Sara Hassan", funding: 85000, status: "pending", progress: 0, agency: "Ministry of Infrastructure" },
        { title: "Fintech Regulatory Frameworks", pi: "Prof. Mohammed Ali", funding: 40000, status: "active", progress: 90, agency: "Central Bank" },
    ];

    const pubData = [
        { year: "2022", pubs: 145 }, { year: "2023", pubs: 178 },
        { year: "2024", pubs: 210 }, { year: "2025", pubs: 256 },
        { year: "2026", pubs: 115 }, // Partial year
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Research & Innovation</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>PROJECTS • GRANTS • PUBLICATIONS • LABS • PATENTS</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    New Proposal
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {["Research Projects", "Funding & Grants", "Publications Output", "Research Centers"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {/* Projects & Grants (Combined in demo for conciseness) */}
            {subTab <= 1 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Project Title", "Principal Investigator", "Funding Agency", "Grant Amount", "Progress", "Status"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontWeight: 900, maxWidth: 200 }}>{p.title}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{p.pi}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{p.agency}</TableCell>
                                    <TableCell><Typography fontWeight={900} color="#10b981">${p.funding.toLocaleString()}</Typography></TableCell>
                                    <TableCell sx={{ minWidth: 120 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <LinearProgress variant="determinate" value={p.progress} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: alpha("#8b5cf6", 0.15), "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: "#8b5cf6" } }} />
                                            <Typography variant="caption" fontWeight={900}>{p.progress}%</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={p.status.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(p.status === "active" ? "#10b981" : "#f59e0b", 0.1), color: p.status === "active" ? "#10b981" : "#f59e0b" }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Publications */}
            {subTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass, p: 2 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Publication Output Trend</Typography>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={pubData}>
                                            <defs>
                                                <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis dataKey="year" tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <RTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Area type="monotone" dataKey="pubs" stroke="#8b5cf6" strokeWidth={3} fill="url(#pubGrad)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
                                    <Avatar sx={{ bgcolor: alpha("#8b5cf6", 0.1), width: 56, height: 56, color: "#8b5cf6" }}><AutoStories /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Total Publications</Typography>
                                        <Typography variant="h4" fontWeight={1000}>904</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
                                    <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), width: 56, height: 56, color: "#10b981" }}><Science /></Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Active Patents / IP</Typography>
                                        <Typography variant="h4" fontWeight={1000}>12</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            )}

            {/* Research Centers */}
            {subTab === 3 && (
                <Grid container spacing={3}>
                    {[
                        { name: "Center for Artificial Intelligence", labs: 4, researchers: 45 },
                        { name: "Sustainable Engineering Institute", labs: 6, researchers: 60 },
                        { name: "Global Finance Observatory", labs: 2, researchers: 25 },
                    ].map((c, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 4, textAlign: "center" }}>
                                    <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 2, background: GRADIENTS.premium }}><Science /></Avatar>
                                    <Typography variant="h6" fontWeight={900}>{c.name}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 3, mb: 3 }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight={900}>{c.labs}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Dedicated Labs</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={900}>{c.researchers}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Researchers</Typography>
                                        </Box>
                                    </Box>
                                    <Button variant="outlined" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Manage Center</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
