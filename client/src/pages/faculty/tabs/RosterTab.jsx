import React from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, IconButton, Card
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
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

export default function RosterTab({ students }) {
    const theme = useTheme();
    return (
        <Box>
            <Typography variant="h4" fontWeight={1000} sx={{ mb: 4 }}>Personnel Roster</Typography>
            <GlassCard>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ background: alpha(theme.palette.primary.main, 0.03) }}>
                            <TableRow>
                                {["Candidate", "ID Hash", "Level", "Academic standing", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 1000, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((s) => (
                                <TableRow key={s._id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", fontWeight: 900 }}>{s.name[0]}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{s.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Year {s.year || "3"}</TableCell>
                                    <TableCell sx={{ fontWeight: 1000, color: "success.main" }}>{s.gpa || "3.85"}</TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Visibility /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GlassCard>
        </Box>
    );
}
