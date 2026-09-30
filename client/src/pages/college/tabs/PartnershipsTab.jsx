import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar, LinearProgress,
} from "@mui/material";
import { Handshake, BusinessCenter, Public, Add, VerifiedUser, OpenInNew } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const mous = [
    { partner: "TechCorp Global", type: "Industry MOU", scope: "Internships & Research", signed: "2023-03-15", validUntil: "2028-12-31", status: "active" },
    { partner: "National Health Ministry", type: "Joint Research", scope: "Public Health Data", signed: "2022-08-01", validUntil: "2026-08-15", status: "nearing_expiry" },
    { partner: "Oxford University", type: "Student Exchange", scope: "Graduate Study Mobility", signed: "2020-01-01", validUntil: "2030-01-01", status: "active" },
    { partner: "Jordan Enterprise Dev.", type: "Entrepreneurship", scope: "Startup Incubation", signed: "2024-06-01", validUntil: "2027-06-01", status: "active" },
    { partner: "UNESCO Regional Hub", type: "Research Grant", scope: "STEM Education Research", signed: "2025-01-15", validUntil: "2027-01-15", status: "active" },
];

const internships = [
    { company: "Aramco Digital", sector: "Energy / Tech", students: 18, dept: "Engineering", deadline: "2026-09-01", status: "open" },
    { company: "Deloitte MENA", sector: "Finance", students: 12, dept: "Business", deadline: "2026-07-15", status: "open" },
    { company: "King Hussein Cancer Center", sector: "Healthcare", students: 8, dept: "Biology", deadline: "2026-08-01", status: "open" },
    { company: "Ministry of ICT", sector: "Government / Tech", students: 5, dept: "Computer Science", deadline: "2026-06-30", status: "closing_soon" },
    { company: "Hikma Pharmaceuticals", sector: "Pharma", students: 10, dept: "Chemistry", deadline: "2026-10-01", status: "open" },
];

const accreditationBodies = [
    { body: "ABET", field: "Engineering & CS", nextReview: "2027-05-01", lastScore: 94, status: "Accredited" },
    { body: "AACSB", field: "Business & Finance", nextReview: "2026-11-15", lastScore: 88, status: "In Progress" },
    { body: "NAAB", field: "Architecture", nextReview: "2028-03-01", lastScore: 91, status: "Accredited" },
    { body: "ACS-WASC", field: "Natural Sciences", nextReview: "2029-01-15", lastScore: 96, status: "Accredited" },
];

const MOU_STATUS = { active: { color: "#10b981", label: "ACTIVE" }, nearing_expiry: { color: "#f59e0b", label: "NEAR EXPIRY" } };
const INTERN_STATUS = { open: { color: "#10b981", label: "OPEN" }, closing_soon: { color: "#f59e0b", label: "CLOSING SOON" } };

export default function PartnershipsTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const totalInternStudents = internships.reduce((s, i) => s + i.students, 0);

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Partnerships & External Relations</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        MOUS • INTERNSHIPS • EXCHANGE PROGRAMS • ACCREDITATION
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{
                    borderRadius: 2.5, fontWeight: 900, textTransform: "none",
                    bgcolor: "#06b6d4", color: "white", "&:hover": { bgcolor: "#0891b2" },
                }}>
                    New Agreement
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2, bgcolor: "#06b6d4" },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none", "&.Mui-selected": { color: "#06b6d4" } },
            }}>
                {["Agreements & MOUs", "Industry & Internships", "Accreditation Bodies"].map((t, i) => (
                    <Tab key={i} label={t} />
                ))}
            </Tabs>

            {/* ── Agreements & MOUs ────────────────────────────── */}
            {subTab === 0 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Partner Organization", "Agreement Type", "Scope", "Signed", "Valid Until", "Status", ""].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mous.map((m, i) => {
                                const s = MOU_STATUS[m.status] || { color: "#94a3b8", label: m.status.toUpperCase() };
                                return (
                                    <TableRow key={i} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar sx={{ bgcolor: alpha("#06b6d4", 0.1), color: "#06b6d4", width: 32, height: 32 }}>
                                                    <Handshake sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography fontWeight={900} sx={{ fontSize: "0.875rem" }}>{m.partner}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{m.type}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{m.scope}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{m.signed}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{m.validUntil}</TableCell>
                                        <TableCell>
                                            <Chip label={s.label} size="small" sx={{
                                                fontWeight: 900, fontSize: "0.65rem",
                                                bgcolor: alpha(s.color, 0.1), color: s.color,
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small" endIcon={<OpenInNew sx={{ fontSize: 13 }} />}
                                                sx={{ fontWeight: 800, textTransform: "none", color: "#06b6d4", fontSize: "0.75rem" }}>
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ── Industry & Internships ────────────────────────── */}
            {subTab === 1 && (
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {[
                            { label: "Active Placements", value: `${totalInternStudents} Students`, icon: <BusinessCenter />, color: "#06b6d4" },
                            { label: "Partner Companies", value: `${internships.length} Companies`, icon: <Handshake />, color: "#6366f1" },
                            { label: "International Exchange", value: `${mous.filter(m => m.type === "Student Exchange").length} Universities`, icon: <Public />, color: "#10b981" },
                        ].map((c, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3, display: "flex", gap: 2.5, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: alpha(c.color, 0.1), width: 52, height: 52, color: c.color }}>{c.icon}</Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{c.label}</Typography>
                                            <Typography variant="h5" fontWeight={1000}>{c.value}</Typography>
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
                                    {["Company", "Sector", "Department", "Positions", "Application Deadline", "Status"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {internships.map((item, i) => {
                                    const s = INTERN_STATUS[item.status] || { color: "#94a3b8", label: item.status.toUpperCase() };
                                    return (
                                        <TableRow key={i} hover>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: alpha("#06b6d4", 0.1), color: "#06b6d4", width: 32, height: 32 }}>
                                                        <BusinessCenter sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Typography fontWeight={900} sx={{ fontSize: "0.875rem" }}>{item.company}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Chip label={item.sector} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{item.dept}</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>{item.students}</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{item.deadline}</TableCell>
                                            <TableCell>
                                                <Chip label={s.label} size="small" sx={{
                                                    fontWeight: 900, fontSize: "0.65rem",
                                                    bgcolor: alpha(s.color, 0.1), color: s.color,
                                                }} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* ── Accreditation Bodies ──────────────────────────── */}
            {subTab === 2 && (
                <Box>
                    <Grid container spacing={3}>
                        {accreditationBodies.map((a, i) => {
                            const isAccredited = a.status === "Accredited";
                            const color = isAccredited ? "#10b981" : "#f59e0b";
                            return (
                                <Grid item xs={12} md={6} key={i}>
                                    <Card sx={{ ...glass }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                    <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 44, height: 44 }}>
                                                        <VerifiedUser />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={1000}>{a.body}</Typography>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{a.field}</Typography>
                                                    </Box>
                                                </Box>
                                                <Chip label={a.status.toUpperCase()} size="small" sx={{
                                                    fontWeight: 900, fontSize: "0.65rem",
                                                    bgcolor: alpha(color, 0.1), color,
                                                }} />
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={800}>Compliance Score</Typography>
                                                <Typography variant="caption" fontWeight={900} sx={{ color }}>{a.lastScore}%</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate" value={a.lastScore}
                                                sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.12), "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 } }}
                                            />
                                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                                    Next Review: <strong>{a.nextReview}</strong>
                                                </Typography>
                                                <Button size="small" sx={{ fontWeight: 800, textTransform: "none", color: "#06b6d4", fontSize: "0.75rem" }}>
                                                    Compliance Portal
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}
