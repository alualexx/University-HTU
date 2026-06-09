import React from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, TextField, MenuItem,
    Stack, Avatar,
} from "@mui/material";
import { Download, AutoGraph } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const GRADIENTS = { premium: "linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)" };

export default function ReportsAnalyticsTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const coreReports = [
        { title: "Enrollment Trends Report", desc: "Detailed breakdown of new intakes, continuations, and graduations by department." },
        { title: "Financial Utilization Audit", desc: "Expenditure vs Budget variance analysis across all college sectors." },
        { title: "Accreditation Readiness Score", desc: "Automated assessment against core accreditation standards metrics." },
        { title: "Faculty Productivity Matrix", desc: "Combined teaching load, research output, and service contributions." },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Reports & Analytics Factory</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>ENROLLMENT • PERFORMANCE • FINANCIALS • ACCREDITATION READINESS</Typography>
                </Box>
                <Button variant="contained" startIcon={<AutoGraph />} sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Custom Report Builder
                </Button>
            </Box>

            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Standard College Reporting Suites</Typography>
            <Grid container spacing={3}>
                {coreReports.map((r, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" fontWeight={900}>{r.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>{r.desc}</Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2, fontWeight: 800 }}>Export PDF</Button>
                                    <Button size="small" variant="text" sx={{ borderRadius: 2, fontWeight: 800 }}>Export CSV</Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
