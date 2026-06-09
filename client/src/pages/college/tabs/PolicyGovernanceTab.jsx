import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Avatar,
} from "@mui/material";
import { Policy, VerifiedUser, Description, Warning } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

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

    const policies = [
        { title: "Academic Integrity Bylaws", category: "Academic", lastUpdated: "2025-11-20", status: "active" },
        { title: "Financial Aid Compliance", category: "Finance", lastUpdated: "2026-01-10", status: "active" },
        { title: "Student Code of Conduct", category: "Student Affairs", lastUpdated: "2026-05-15", status: "under_review" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Policy & Governance</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>BYLAWS • COMMITTEES • QUALITY ASSURANCE • ETHICS</Typography>
                </Box>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {["Academic Policies & Bylaws", "Committees & Compliance", "Ethics Case Management"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Policy Document", "Category", "Last Updated", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {policies.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1", width: 32, height: 32 }}><Description sx={{ fontSize: 18 }} /></Avatar>
                                            <Typography fontWeight={900}>{p.title}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Chip label={p.category} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{p.lastUpdated}</TableCell>
                                    <TableCell>
                                        <Chip label={p.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(p.status === "active" ? "#10b981" : "#f59e0b", 0.1), color: p.status === "active" ? "#10b981" : "#f59e0b" }} />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none" }}>View</Button>
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
