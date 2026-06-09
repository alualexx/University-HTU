import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Tooltip, alpha, Tabs, Tab, Avatar,
} from "@mui/material";
import {
    Add as AddIcon, CalendarToday, Schedule, Room, DeleteOutline,
    Warning as WarningIcon, AccessTime, Event, School,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { schedulesAPI } from "../../../services/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
];
const GRADIENTS = {
    primary: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
};

const SLOT_COLORS = [
    "#4f46e5", "#7c3aed", "#0891b2", "#059669", "#d97706",
    "#dc2626", "#db2777", "#2563eb", "#16a34a",
];

export default function TimetableTab({ courses, department, user }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [slots, setSlots] = useState([]);
    const [examSlots, setExamSlots] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openExam, setOpenExam] = useState(false);
    const [conflict, setConflict] = useState(null);
    const [newSlot, setNewSlot] = useState({
        courseId: "", courseName: "", courseCode: "", day: "Monday",
        startTime: "08:00", endTime: "09:00", room: "", instructorName: "",
    });
    const [newExam, setNewExam] = useState({
        courseId: "", courseName: "", courseCode: "", type: "midterm",
        date: "", time: "09:00", room: "", duration: 120,
    });

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 16,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadSlots();
    }, [department]);

    const loadSlots = async () => {
        try {
            const res = await schedulesAPI.getAll({ department });
            const all = res.data || [];
            setSlots(all.filter(s => s.type === "class"));
            setExamSlots(all.filter(s => s.type !== "class"));
        } catch (e) {
            console.error(e);
        }
    };

    const detectConflict = (slot) => {
        return slots.find(s =>
            s.day === slot.day &&
            s.room === slot.room &&
            s.room !== "" &&
            ((slot.startTime >= s.startTime && slot.startTime < s.endTime) ||
                (slot.endTime > s.startTime && slot.endTime <= s.endTime))
        );
    };

    const handleAddSlot = async () => {
        const conf = detectConflict(newSlot);
        if (conf) {
            setConflict(conf);
            return;
        }
        try {
            const selected = courses.find(c => c._id === newSlot.courseId);
            const payload = {
                ...newSlot,
                courseName: selected?.name || newSlot.courseName,
                courseCode: selected?.code || newSlot.courseCode,
                instructorName: selected?.instructorName || "",
                department,
                type: "class",
                createdBy: user?.uid || user?._id,
            };
            await schedulesAPI.create(payload);
            setOpenAdd(false);
            setNewSlot({ courseId: "", courseName: "", courseCode: "", day: "Monday", startTime: "08:00", endTime: "09:00", room: "", instructorName: "" });
            loadSlots();
        } catch (e) { console.error(e); }
    };

    const handleAddExam = async () => {
        try {
            const selected = courses.find(c => c._id === newExam.courseId);
            const payload = {
                ...newExam,
                courseName: selected?.name || "",
                courseCode: selected?.code || "",
                department,
                type: newExam.type,
                day: new Date(newExam.date).toLocaleDateString("en-US", { weekday: "long" }),
                startTime: newExam.time,
                endTime: newExam.time,
                createdBy: user?.uid || user?._id,
            };
            await schedulesAPI.create(payload);
            setOpenExam(false);
            setNewExam({ courseId: "", courseName: "", courseCode: "", type: "midterm", date: "", time: "09:00", room: "", duration: 120 });
            loadSlots();
        } catch (e) { console.error(e); }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Remove this slot?")) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/schedules/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            loadSlots();
        } catch (e) { console.error(e); }
    };

    const slotsForCell = (day, time) =>
        slots.filter(s => s.day === day && s.startTime === time);

    const examTypeColor = (type) => {
        if (type === "midterm") return "#f59e0b";
        if (type === "final") return "#ef4444";
        return "#6366f1";
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Class Timetable</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>SCHEDULE MANAGEMENT & CONFLICT DETECTION</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<Event />} onClick={() => setOpenExam(true)}
                        sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>
                        Schedule Exam
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}
                        sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                        Add Class Slot
                    </Button>
                </Stack>
            </Box>

            {/* Sub-tabs */}
            <Tabs value={activeSubTab} onChange={(_, v) => setActiveSubTab(v)} sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none", fontSize: "0.9rem" }
            }}>
                <Tab label="Weekly Timetable" />
                <Tab label={`Exam Schedule (${examSlots.length})`} />
            </Tabs>

            {/* Weekly Grid */}
            {activeSubTab === 0 && (
                <Box sx={{ overflowX: "auto" }}>
                    <Box sx={{ minWidth: 900 }}>
                        {/* Day Header */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "100px repeat(5, 1fr)", gap: 1, mb: 1 }}>
                            <Box />
                            {DAYS.map(d => (
                                <Box key={d} sx={{ ...glass, p: 1.5, textAlign: "center" }}>
                                    <Typography variant="caption" fontWeight={900} color="primary">{d.toUpperCase()}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {/* Time Rows */}
                        {TIME_SLOTS.map((time, ti) => (
                            <Box key={time} sx={{ display: "grid", gridTemplateColumns: "100px repeat(5, 1fr)", gap: 1, mb: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary">{time}</Typography>
                                </Box>
                                {DAYS.map(day => {
                                    const cellSlots = slotsForCell(day, time);
                                    return (
                                        <Box key={day} sx={{ ...glass, minHeight: 70, p: 0.5, position: "relative" }}>
                                            {cellSlots.map((slot, si) => (
                                                <Box key={slot._id || si} sx={{
                                                    background: SLOT_COLORS[si % SLOT_COLORS.length],
                                                    borderRadius: 2, p: 1, mb: 0.5, position: "relative", color: "white",
                                                }}>
                                                    <Typography variant="caption" fontWeight={900} sx={{ display: "block" }}>{slot.courseCode}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.6rem", display: "block" }}>{slot.room}</Typography>
                                                    <IconButton size="small" onClick={() => handleDeleteSlot(slot._id)}
                                                        sx={{ position: "absolute", top: 0, right: 0, color: "rgba(255,255,255,0.6)", p: 0.2 }}>
                                                        <DeleteOutline sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>

                    {/* Legend */}
                    <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">COURSES:</Typography>
                        {courses.map((c, i) => (
                            <Box key={c._id} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: SLOT_COLORS[i % SLOT_COLORS.length] }} />
                                <Typography variant="caption" fontWeight={700}>{c.code}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Exam Schedule */}
            {activeSubTab === 1 && (
                <Box>
                    {["midterm", "final", "makeup"].map(examType => {
                        const typeExams = examSlots.filter(s => s.type === examType);
                        return (
                            <Box key={examType} sx={{ mb: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: examTypeColor(examType) }} />
                                    <Typography variant="subtitle1" fontWeight={900} sx={{ textTransform: "capitalize" }}>
                                        {examType} Exams ({typeExams.length})
                                    </Typography>
                                </Box>
                                {typeExams.length === 0 ? (
                                    <Box sx={{ ...glass, p: 3, textAlign: "center" }}>
                                        <Typography variant="body2" color="text.secondary">No {examType} exams scheduled</Typography>
                                    </Box>
                                ) : (
                                    <TableContainer sx={{ ...glass }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 900, fontSize: "0.7rem" }}>COURSE</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, fontSize: "0.7rem" }}>DATE</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, fontSize: "0.7rem" }}>TIME</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, fontSize: "0.7rem" }}>ROOM</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, fontSize: "0.7rem" }}>DURATION</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 900, fontSize: "0.7rem" }}>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {typeExams.map(e => (
                                                    <TableRow key={e._id}>
                                                        <TableCell>
                                                            <Chip label={e.courseCode} size="small" sx={{ fontWeight: 900 }} />
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>{e.date ? new Date(e.date).toLocaleDateString() : e.day}</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>{e.startTime}</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>{e.room || "TBD"}</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>{e.duration || 120} min</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton size="small" color="error" onClick={() => handleDeleteSlot(e._id)}>
                                                                <DeleteOutline sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Conflict Alert */}
            {conflict && (
                <Dialog open={!!conflict} onClose={() => setConflict(null)}>
                    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#ef4444" }}>
                        <WarningIcon color="error" /> Scheduling Conflict Detected
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Room <strong>{conflict.room}</strong> is already booked on <strong>{conflict.day}</strong> at <strong>{conflict.startTime}</strong>
                            {" "}for <strong>{conflict.courseCode}</strong>. Please choose a different room or time.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConflict(null)} variant="contained" color="error">Understood</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Add Class Slot Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { ...glass, backgroundImage: "none" } }}>
                <DialogTitle fontWeight={1000}>Add Class Slot</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField select fullWidth label="Course" value={newSlot.courseId}
                            onChange={e => setNewSlot({ ...newSlot, courseId: e.target.value })}>
                            {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code} — {c.name}</MenuItem>)}
                        </TextField>
                        <TextField select fullWidth label="Day" value={newSlot.day}
                            onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}>
                            {DAYS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </TextField>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select fullWidth label="Start Time" value={newSlot.startTime}
                                    onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}>
                                    {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField select fullWidth label="End Time" value={newSlot.endTime}
                                    onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}>
                                    {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </TextField>
                            </Grid>
                        </Grid>
                        <TextField fullWidth label="Room / Venue" placeholder="e.g. B-201, Lab 3"
                            value={newSlot.room} onChange={e => setNewSlot({ ...newSlot, room: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAdd(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddSlot} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>
                        Add Slot
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Exam Dialog */}
            <Dialog open={openExam} onClose={() => setOpenExam(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { ...glass, backgroundImage: "none" } }}>
                <DialogTitle fontWeight={1000}>Schedule Exam</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField select fullWidth label="Course" value={newExam.courseId}
                            onChange={e => setNewExam({ ...newExam, courseId: e.target.value })}>
                            {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code} — {c.name}</MenuItem>)}
                        </TextField>
                        <TextField select fullWidth label="Exam Type" value={newExam.type}
                            onChange={e => setNewExam({ ...newExam, type: e.target.value })}>
                            <MenuItem value="midterm">Midterm Exam</MenuItem>
                            <MenuItem value="final">Final Exam</MenuItem>
                            <MenuItem value="makeup">Makeup Exam</MenuItem>
                        </TextField>
                        <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }}
                            value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select fullWidth label="Start Time" value={newExam.time}
                                    onChange={e => setNewExam({ ...newExam, time: e.target.value })}>
                                    {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Duration (min)" type="number"
                                    value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: Number(e.target.value) })} />
                            </Grid>
                        </Grid>
                        <TextField fullWidth label="Exam Room" placeholder="e.g. Hall A"
                            value={newExam.room} onChange={e => setNewExam({ ...newExam, room: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenExam(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddExam} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.danger }}>
                        Schedule Exam
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
