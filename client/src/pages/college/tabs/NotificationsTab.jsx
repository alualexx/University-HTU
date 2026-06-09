import React from "react";
import {
    Box, Card, CardContent, Typography, Chip, Stack,
    Avatar, IconButton, alpha,
} from "@mui/material";
import { NotificationsActive, Circle, Assessment, MoneyOff, ReportProblem } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function NotificationsTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const alerts = [
        { id: 1, type: "urgent", source: "Registrar", title: "Final Grade Submission Deadline Approaching", desc: "All departments must submit grades within 48 hours.", time: "2 hours ago", icon: <ReportProblem /> },
        { id: 2, type: "warning", source: "Finance", title: "Budget Overrun Warning", desc: "Computer Science department has exceeded Q3 equipment budget by 12%.", time: "5 hours ago", icon: <MoneyOff /> },
        { id: 3, type: "info", source: "QA Board", title: "Accreditation Report Complete", desc: "The preliminary findings for the Engineering department review are available.", time: "1 day ago", icon: <Assessment /> },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>System Notifications & Alerts</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>DEADLINES • BUDGET ALERTS • COLLEGE-WIDE BROADCASTS</Typography>
                </Box>
            </Box>

            <Stack spacing={2} sx={{ maxWidth: 800 }}>
                {alerts.map(a => {
                    const colors = { urgent: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
                    const color = colors[a.type];
                    return (
                        <Card key={a.id} sx={{ ...glass }}>
                            <CardContent sx={{ p: 3, display: "flex", gap: 3, alignItems: "flex-start" }}>
                                <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, mt: 0.5 }}>{a.icon}</Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                                        <Typography variant="subtitle1" fontWeight={900}>{a.title}</Typography>
                                        <Chip label={a.source} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem" }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{a.desc}</Typography>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="caption" fontWeight={800} sx={{ color }}>{a.type.toUpperCase()}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{a.time}</Typography>
                                    </Stack>
                                </Box>
                                <IconButton size="small"><Circle sx={{ color, fontSize: 12 }} /></IconButton>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
        </Box>
    );
}
