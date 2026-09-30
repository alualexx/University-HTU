import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar, Divider,
} from "@mui/material";
import {
    Policy, Description, Warning, Groups, VerifiedUser, Gavel,
    Add, CheckCircle, History,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const GRADIENTS = { premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" };

const policies = [
    { title: "Academic Integrity Bylaws", category: "Academic", lastUpdated: "2025-11-20", status: "active", version: "v3.1" },
    { title: "Financial Aid Compliance", category: "Finance", lastUpdated: "2026-01-10", status: "active", version: "v2.4" },
    { title: "Student Code of Conduct", category: "Student Affairs", lastUpdated: "2026-05-15", status: "under_review", version: "v5.0-draft" },
    { title: "Research Ethics Guidelines", category: "Research", lastUpdated: "2025-09-01", status: "active", version: "v1.8" },
    { title: "Faculty Evaluation Framework", category: "HR", lastUpdated: "2026-02-28", status: "active", version: "v2.0" },
];

const committees = [
    { name: "Academic Senate", chair: "Prof. Ibrahim Al-Hassan", members: 12, nextMeeting: "2026-07-05", status: "active" },
    { name: "Research Ethics Board", chair: "Dr. Mona Khalil", members: 8, nextMeeting: "2026-06-25", status: "active" },
    { name: "Curriculum Review Committee", chair: "Dr. Tariq Mansour", members: 10, nextMeeting: "2026-07-12", status: "active" },
    { name: "Student Affairs Council", chair: "Dr. Layla Nasser", members: 15, nextMeeting: "2026-06-30", status: "active" },
    { name: "Accreditation Task Force", chair: "Dean (Ex-Officio)", members: 6, nextMeeting: "2026-08-01", status: "convening" },
];

const ethicsCases = [
    { ref: "ETH-2026-001", type: "Academic Misconduct", dept: "Computer Science", filed: "2026-05-10", status: "under_review", severity: "medium" },
    { ref: "ETH-2026-002", type: "Plagiarism", dept: "Business", filed: "2026-05-22", status: "resolved", severity: "high" },
    { ref: "ETH-2025-018", type: "Research Fraud", dept: "Biology", filed: "2025-12-01", status: "closed", severity: "critical" },
    { ref: "ETH-2026-003", type: "Faculty Misconduct", dept: "Humanities", filed: "2026-06-01", status: "pending", severity: "low" },
];

const SEVERITY_COLOR = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#10b981" };
const STATUS_COLOR = {
    active: "#10b981", convening: "#6366f1",
    under_review: "#f59e0b", resolved: "#10b981", closed: "#94a3b8", pending: "#f59e0b",
};

export default function PolicyGovernanceTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Policy & Governance</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        BYLAWS • COMMITTEES • QUALITY ASSURANCE • ETHICS
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />}
                    sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    New Policy Draft
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none" },
            }}>
                {["Academic Policies & Bylaws", "Committees & Compliance", "Ethics Case Management"].map((t, i) => (
                    <Tab key={i} label={t} />
                ))}
            </Tabs>

            {/* ── Academic Policies & Bylaws ─────────────────────────── */}
            {subTab === 0 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Policy Document", "Category", "Version", "Last Updated", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {policies.map((p, i) => (
                                <TableRow key={i} hover>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1", width: 32, height: 32 }}>
                                                <Description sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography fontWeight={900} sx={{ fontSize: "0.875rem" }}>{p.title}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Chip label={p.category} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                    <TableCell>
                                        <Typography variant="caption" fontWeight={800} sx={{ fontFamily: "monospace" }}>{p.version}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{p.lastUpdated}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status.replace("_", " ").toUpperCase()} size="small"
                                            sx={{
                                                fontWeight: 900, fontSize: "0.65rem",
                                                bgcolor: alpha(p.status === "active" ? "#10b981" : "#f59e0b", 0.1),
                                                color: p.status === "active" ? "#10b981" : "#f59e0b"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5}>
                                            <Button size="small" sx={{ fontWeight: 800, textTransform: "none", fontSize: "0.75rem" }}>View</Button>
                                            <Button size="small" sx={{ fontWeight: 800, textTransform: "none", fontSize: "0.75rem" }}>Revise</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ── Committees & Compliance ────────────────────────────── */}
            {subTab === 1 && (
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {[
                            { label: "Active Committees", value: committees.filter(c => c.status === "active").length, icon: <Groups />, color: "#6366f1" },
                            { label: "Upcoming Meetings", value: committees.length, icon: <History />, color: "#10b981" },
                            { label: "Policies in Review", value: policies.filter(p => p.status === "under_review").length, icon: <Warning />, color: "#f59e0b" },
                        ].map((kpi, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: alpha(kpi.color, 0.12), color: kpi.color, width: 48, height: 48 }}>{kpi.icon}</Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{kpi.label}</Typography>
                                            <Typography variant="h5" fontWeight={1000}>{kpi.value}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <TableContainer sx={{ ...glass }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Committee Name", "Chair", "Members", "Next Meeting", "Status"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {committees.map((c, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1", width: 32, height: 32 }}>
                                                    <Groups sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography fontWeight={900} sx={{ fontSize: "0.875rem" }}>{c.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{c.chair}</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>{c.members}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{c.nextMeeting}</TableCell>
                                        <TableCell>
                                            <Chip label={c.status.toUpperCase()} size="small" sx={{
                                                fontWeight: 900, fontSize: "0.65rem",
                                                bgcolor: alpha(STATUS_COLOR[c.status] || "#6366f1", 0.1),
                                                color: STATUS_COLOR[c.status] || "#6366f1",
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* ── Ethics Case Management ────────────────────────────── */}
            {subTab === 2 && (
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {[
                            { label: "Open Cases", value: ethicsCases.filter(c => ["under_review", "pending"].includes(c.status)).length, color: "#f59e0b" },
                            { label: "Resolved This Year", value: ethicsCases.filter(c => c.status === "resolved").length, color: "#10b981" },
                            { label: "Critical Cases", value: ethicsCases.filter(c => c.severity === "critical").length, color: "#ef4444" },
                        ].map((kpi, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3, display: "flex", gap: 2.5, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: alpha(kpi.color, 0.12), color: kpi.color, width: 48, height: 48 }}>
                                            <Gavel />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{kpi.label}</Typography>
                                            <Typography variant="h5" fontWeight={1000}>{kpi.value}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <TableContainer sx={{ ...glass }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Case Ref", "Type", "Department", "Filed", "Severity", "Status"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ethicsCases.map((c, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.8rem" }}>{c.ref}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{c.type}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{c.dept}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{c.filed}</TableCell>
                                        <TableCell>
                                            <Chip label={c.severity.toUpperCase()} size="small" sx={{
                                                fontWeight: 900, fontSize: "0.65rem",
                                                bgcolor: alpha(SEVERITY_COLOR[c.severity], 0.1),
                                                color: SEVERITY_COLOR[c.severity],
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={c.status.replace("_", " ").toUpperCase()} size="small" sx={{
                                                fontWeight: 900, fontSize: "0.65rem",
                                                bgcolor: alpha(STATUS_COLOR[c.status] || "#94a3b8", 0.1),
                                                color: STATUS_COLOR[c.status] || "#94a3b8",
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );
}
