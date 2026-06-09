import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { Insights } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

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

export default function GradeTab() {
    return (
        <Box>
            <Typography variant="h4" fontWeight={1000} sx={{ mb: 4 }}>Grade Matrix</Typography>
            <GlassCard sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ opacity: 0.5 }}>Transcript injection protocol is currently syncing with the registrar node.</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>Real-time grading for students in your department will be available shortly.</Typography>
                <Box sx={{ mt: 4, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Insights sx={{ fontSize: 100, opacity: 0.05 }} />
                </Box>
            </GlassCard>
        </Box>
    );
}
