import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar, Divider,
} from "@mui/material";
import { AccountBalance, ReceiptLong, AttachMoney, Assignment, Timeline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const GRADIENTS = { premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" };

export default function FinancialManagementTab({ budget }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const allocations = budget?.allocations || [
        { category: "Faculty & Staff", amount: 1500000 },
        { category: "Research Grants", amount: 450000 },
        { category: "Infrastructure", amount: 300000 },
        { category: "Student Welfare", amount: 120000 },
    ];
    const totalBudget = allocations.reduce((a, b) => a + b.amount, 0);

    const procurement = [
        { id: "PR-901", item: "Lab Computers", dept: "Computer Science", amount: 45000, status: "pending" },
        { id: "PR-902", item: "Chemical Supplies", dept: "Sciences", amount: 12500, status: "approved" },
        { id: "PR-903", item: "Conference Sponsorship", dept: "Business", amount: 5000, status: "pending" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Financial Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>BUDGET ALLOCATIONS • GRANTS • PROCUREMENT • COMPLIANCE</Typography>
                </Box>
                <Button variant="contained" startIcon={<AccountBalance />} sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Submit Annual Budget
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {["Budget Overview", "Procurement Requests", "Financial Compliance"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", p: 2 }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="subtitle2" color="text.secondary" fontWeight={800} gutterBottom>Total Allocated Budget (FY26)</Typography>
                                <Typography variant="h3" fontWeight={1000} sx={{ color: "#10b981", letterSpacing: -1 }}>
                                    ${(totalBudget / 1000000).toFixed(2)}M
                                </Typography>
                                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Spent</Typography>
                                        <Typography variant="h6" fontWeight={900}>${(totalBudget * 0.42 / 1000000).toFixed(2)}M</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>Remaining</Typography>
                                        <Typography variant="h6" fontWeight={900}>${(totalBudget * 0.58 / 1000000).toFixed(2)}M</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Allocation Breakdown</Typography>
                                <Box sx={{ height: 260 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={allocations} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis type="number" tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis dataKey="category" type="category" tick={{ fontWeight: 700, fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                                            <RTooltip cursor={{ fill: alpha("#6366f1", 0.05) }} contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Bar dataKey="amount" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {subTab === 1 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Request ID", "Department", "Item Details", "Amount", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {procurement.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{p.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{p.dept}</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>{p.item}</TableCell>
                                    <TableCell><Typography fontWeight={900} color="#10b981">${p.amount.toLocaleString()}</Typography></TableCell>
                                    <TableCell>
                                        <Chip label={p.status.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(p.status === "approved" ? "#10b981" : "#f59e0b", 0.1), color: p.status === "approved" ? "#10b981" : "#f59e0b" }} />
                                    </TableCell>
                                    <TableCell>
                                        {p.status === "pending" && (
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" color="success" variant="contained" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                            </Stack>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {subTab === 2 && (
                <Grid container spacing={3}>
                    {[
                        { title: "Audit Status", value: "Compliant", icon: <CheckCircle sx={{ color: "#10b981" }} /> },
                        { title: "Last Internal Audit", value: "May 15, 2026", icon: <Timeline sx={{ color: "#6366f1" }} /> },
                        { title: "Active Grants Reporting", value: "3 due this month", icon: <Assignment sx={{ color: "#f59e0b" }} /> },
                    ].map((c, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 4, display: "flex", gap: 3, alignItems: "center" }}>
                                    <Avatar sx={{ bgcolor: alpha(c.icon.props.sx.color, 0.1), width: 56, height: 56 }}>{c.icon}</Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{c.title}</Typography>
                                        <Typography variant="h6" fontWeight={900}>{c.value}</Typography>
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
