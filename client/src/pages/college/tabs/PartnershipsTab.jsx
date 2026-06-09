import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar,
} from "@mui/material";
import { Handshake, BusinessCenter, Public, Add, VerifiedUser } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

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

    const mous = [
        { partner: "TechCorp Global", type: "Industry Standard MOU", scope: "Internships & Research", validUntil: "2028-12-31", status: "active" },
        { partner: "National Health Ministry", type: "Joint Research", scope: "Public Health Data", validUntil: "2026-08-15", status: "nearing_expiry" },
        { partner: "Oxford University", type: "Student Exchange", scope: "Graduate Study Mobility", validUntil: "2030-01-01", status: "active" },
    ];

    const accreditationBodies = [
        { body: "ABET", field: "Engineering", nextReview: "2027-05-01", status: "Accredited" },
        { body: "AACSB", field: "Business", nextReview: "2026-11-15", status: "In Progress" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Partnerships & External Relations</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>MOUS • INDUSTRY • EXCHANGE PROGRAMS • ALUMNI • ACCREDITATION</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", bgcolor: "#06b6d4", color: "white", "&:hover": { bgcolor: "#0891b2" } }}>
                    New Agreement
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2, bgcolor: "#06b6d4" }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none", "&.Mui-selected": { color: "#06b6d4" } } }}>
                {["Agreements & MOUs", "Industry & Internships", "Accreditation Bodies"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Partner Organization", "Agreement Type", "Scope of Collaboration", "Valid Until", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mous.map((m, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontWeight: 900 }}>{m.partner}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{m.type}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{m.scope}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{m.validUntil}</TableCell>
                                    <TableCell>
                                        <Chip label={m.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(m.status === "active" ? "#10b981" : "#f59e0b", 0.1), color: m.status === "active" ? "#10b981" : "#f59e0b" }} />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none", color: "#06b6d4" }}>View Document</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {subTab === 1 && (
                <Grid container spacing={3}>
                    {[
                        { title: "Active Industry Placements", value: "245 Students", icon: <BusinessCenter /> },
                        { title: "Corporate Partners", value: "48 Companies", icon: <Handshake /> },
                        { title: "International Exchange", value: "12 Universities", icon: <Public /> },
                    ].map((c, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 4, display: "flex", gap: 3, alignItems: "center" }}>
                                    <Avatar sx={{ bgcolor: alpha("#06b6d4", 0.1), width: 56, height: 56, color: "#06b6d4" }}>{c.icon}</Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{c.title}</Typography>
                                        <Typography variant="h5" fontWeight={1000}>{c.value}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {subTab === 2 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Accreditation Body", "Field/Department", "Next Review Date", "Current Status", "Action Items"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accreditationBodies.map((a, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha("#06b6d4", 0.1), color: "#06b6d4", width: 32, height: 32 }}><VerifiedUser sx={{ fontSize: 18 }} /></Avatar>
                                            <Typography fontWeight={900}>{a.body}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{a.field}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{a.nextReview}</TableCell>
                                    <TableCell>
                                        <Chip label={a.status.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(a.status === "Accredited" ? "#10b981" : "#f59e0b", 0.1), color: a.status === "Accredited" ? "#10b981" : "#f59e0b" }} />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none", color: "#06b6d4" }}>Compliance Portal</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
