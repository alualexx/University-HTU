import React from "react";
import {
    Box, Typography, Button, TextField, MenuItem, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, FormControlLabel, Checkbox, Card
} from "@mui/material";
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

export default function AttendanceTab({
    courses, selectedCourseId, setSelectedCourseId,
    attendanceDate, setAttendanceDate, handleSaveAttendance,
    students, attendanceLog, setAttendanceLog
}) {
    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Typography variant="h4" fontWeight={1000}>Biometric Log</Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        select size="small" value={selectedCourseId || ""} onChange={e => setSelectedCourseId(e.target.value)}
                        sx={{ minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    >
                        {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code}</MenuItem>)}
                    </TextField>
                    <TextField
                        type="date" size="small" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Button variant="contained" onClick={handleSaveAttendance} sx={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", fontWeight: 900, borderRadius: 3 }}>
                        Finalize Log
                    </Button>
                </Stack>
            </Box>
            <GlassCard>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ background: alpha("#06b6d4", 0.05) }}>
                            <TableRow>
                                {["Personnel", "ID Hash", "Department", "Telemetry Status"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 1000, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((s) => (
                                <TableRow key={s._id} sx={{ "&:hover": { bgcolor: alpha("#06b6d4", 0.02) } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", fontWeight: 900 }}>{s.name[0]}</Avatar>
                                            <Typography variant="subtitle2" fontWeight={1000}>{s.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", opacity: 0.8, fontWeight: 700 }}>{s.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{s.department}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={<Checkbox checked={attendanceLog[s._id] || false} onChange={e => setAttendanceLog({ ...attendanceLog, [s._id]: e.target.checked })} sx={{ color: "#06b6d4", "&.Mui-checked": { color: "#06b6d4" } }} />}
                                            label={attendanceLog[s._id] ? "CONNECTED" : "OFFLINE"}
                                            sx={{ "& .MuiFormControlLabel-label": { fontWeight: 900, color: attendanceLog[s._id] ? "#06b6d4" : "text.secondary", fontSize: "0.75rem" } }}
                                        />
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
