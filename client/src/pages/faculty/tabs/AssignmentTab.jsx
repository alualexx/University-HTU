import React from "react";
import { Box, Typography, Button, Grid, Card, Divider, Chip } from "@mui/material";
import { Add, Layers } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";

const GlassCard = ({ children, sx = {} }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Card sx={{
            borderRadius: 6,
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(99, 102, 241, 0.05)",
            ...sx
        }}>
            {children}
        </Card>
    );
};

export default function AssignmentTab({ assignments, setAssignDialogOpen }) {
    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight={1000}>Task Nodes: Assignments</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setAssignDialogOpen(true)} sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", borderRadius: 3, fontWeight: 900 }}>Deploy Node</Button>
            </Box>
            <Grid container spacing={3}>
                {assignments.map((a) => (
                    <Grid item xs={12} md={6} key={a._id}>
                        <GlassCard sx={{ p: 4, height: "100%", borderLeft: "6px solid #8b5cf6" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h6" fontWeight={1000}>{a.title}</Typography>
                                <Chip label={a.status?.toUpperCase()} size="small" sx={{ fontWeight: 1000, bgcolor: alpha("#8b5cf6", 0.1), color: "#8b5cf6" }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>{a.description}</Typography>
                            <Divider sx={{ mb: 2, opacity: 0.1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography variant="caption" fontWeight={900} sx={{ display: "block", opacity: 0.5 }}>TERMINATION DATE</Typography>
                                    <Typography variant="body2" fontWeight={1000}>{new Date(a.deadline).toLocaleDateString()}</Typography>
                                </Box>
                                <Button size="small" sx={{ fontWeight: 1000 }}>Telemetry</Button>
                            </Box>
                        </GlassCard>
                    </Grid>
                ))}
                {assignments.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: "center", py: 10, opacity: 0.3 }}>
                            <Layers sx={{ fontSize: 100 }} />
                            <Typography variant="h6" fontWeight={1000}>No task nodes deployed.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
