import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, useTheme, Grid, IconButton, Tabs, Tab, Dialog, DialogTitle,
    DialogContent, DialogActions, Alert, Tooltip, Avatar
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Schedule, Add, Edit, Delete, Search, CalendarMonth, Room,
    Warning, Download, School, Publish, EventNote, AccessTime
} from "@mui/icons-material";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function SchedulesTab({
    schedules = [],
    courses = [],
    departments = [],
    onSaveSchedule,
    onDeleteSchedule,
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [semFilter, setSemFilter] = useState("Fall 2026");
    const [deptFilter, setDeptFilter] = useState("all");
    const [dialog, setDialog] = useState({ open: false, data: { courseId: '', courseName: '', day: '', startTime: '', endTime: '', room: '', semester: 'Fall 2026' } });

    const filtered = schedules.filter(s => {
        const q = search.toLowerCase();
        return (!q || (s.courseName || '').toLowerCase().includes(q) || (s.room || '').toLowerCase().includes(q));
    });

    // Conflict detection: find overlapping room/time
    const conflicts = [];
    for (let i = 0; i < schedules.length; i++) {
        for (let j = i + 1; j < schedules.length; j++) {
            if (schedules[i].day === schedules[j].day && schedules[i].room === schedules[j].room &&
                schedules[i].startTime < schedules[j].endTime && schedules[j].startTime < schedules[i].endTime) {
                conflicts.push({ a: schedules[i], b: schedules[j] });
            }
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Schedule & Timetable Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>BUILD, PUBLISH, AND MANAGE CLASS & EXAM TIMETABLES ACROSS ALL DEPARTMENTS</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ open: true, data: { courseId: '', courseName: '', day: '', startTime: '', endTime: '', room: '', semester: semFilter } })} sx={{ borderRadius: 3, fontWeight: 900 }}>New Schedule</Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
                <Tab icon={<CalendarMonth sx={{ fontSize: 20 }} />} iconPosition="start" label="Class Timetable" />
                <Tab icon={<EventNote sx={{ fontSize: 20 }} />} iconPosition="start" label="Exam Timetable" />
                <Tab icon={<Room sx={{ fontSize: 20 }} />} iconPosition="start" label="Venue Availability" />
                <Tab icon={<Warning sx={{ fontSize: 20 }} />} iconPosition="start" label={`Conflicts (${conflicts.length})`} />
            </Tabs>

            {subTab === 0 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField size="small" placeholder="Search course or venue..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <TextField select size="small" value={semFilter} onChange={e => setSemFilter(e.target.value)} sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="Fall 2026">Fall 2026</MenuItem>
                            <MenuItem value="Spring 2026">Spring 2026</MenuItem>
                        </TextField>
                        <Button variant="outlined" startIcon={<Publish />} sx={{ borderRadius: 3, fontWeight: 900 }}>Publish to All</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 550 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Day", "Time", "Room/Venue", "Semester", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ bgcolor: 'transparent', fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map((s, i) => (
                                    <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell><Typography variant="body2" fontWeight={900}>{s.courseName}</Typography></TableCell>
                                        <TableCell><Chip label={s.day} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={800}>{s.startTime} — {s.endTime}</Typography></TableCell>
                                        <TableCell><Chip icon={<Room sx={{ fontSize: 14 }} />} label={s.room} size="small" variant="outlined" sx={{ fontWeight: 800 }} /></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800}>{s.semester}</Typography></TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => setDialog({ open: true, data: { ...s } })}><Edit fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => onDeleteSchedule?.(s.id)}><Delete fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Schedule sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No schedules configured</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 1 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, textAlign: 'center', py: 10 }}>
                    <EventNote sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" fontWeight={900}>Exam Timetable Builder</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Configure examination schedules, assign invigilators, and manage conflict resolution.</Typography>
                    <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 3, fontWeight: 900 }}>Create Exam Schedule</Button>
                </Card>
            )}

            {subTab === 2 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3 }}><Typography variant="h6" fontWeight={1000}>Room & Venue Availability</Typography></Box>
                    <Grid container spacing={0} sx={{ p: 2 }}>
                        {DAYS.map(day => (
                            <Grid item xs={2} key={day}>
                                <Typography variant="caption" fontWeight={1000} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>{day.slice(0, 3).toUpperCase()}</Typography>
                                {TIME_SLOTS.map(time => {
                                    const booked = schedules.some(s => s.day === day && s.startTime <= time && s.endTime > time);
                                    return (
                                        <Box key={time} sx={{ p: 1, m: 0.5, borderRadius: 2, bgcolor: alpha(booked ? '#ef4444' : '#10b981', 0.1), border: `1px solid ${alpha(booked ? '#ef4444' : '#10b981', 0.2)}`, textAlign: 'center' }}>
                                            <Typography variant="caption" fontWeight={900} sx={{ fontSize: '0.6rem', color: booked ? '#ef4444' : '#10b981' }}>{time}</Typography>
                                        </Box>
                                    );
                                })}
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            )}

            {subTab === 3 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Typography variant="h6" fontWeight={1000} gutterBottom>Detected Scheduling Conflicts</Typography>
                    {conflicts.length > 0 ? conflicts.map((c, i) => (
                        <Alert key={i} severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
                            <strong>{c.a.courseName}</strong> and <strong>{c.b.courseName}</strong> overlap in <strong>{c.a.room}</strong> on <strong>{c.a.day}</strong> ({c.a.startTime}–{c.a.endTime} vs {c.b.startTime}–{c.b.endTime})
                        </Alert>
                    )) : (
                        <Alert severity="success" sx={{ borderRadius: 3 }}>No scheduling conflicts detected. All rooms and time slots are clear.</Alert>
                    )}
                </Card>
            )}

            {/* Schedule Dialog */}
            <Dialog open={dialog.open} onClose={() => setDialog({ open: false, data: {} })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Schedule Entry</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField select fullWidth label="Course" value={dialog.data.courseId || ''} onChange={e => { const c = courses.find(x => (x._id || x.id) === e.target.value); setDialog(p => ({ ...p, data: { ...p.data, courseId: e.target.value, courseName: c?.name || '' } })); }} size="small">
                            {courses.map(c => <MenuItem key={c._id || c.id} value={c._id || c.id}>{c.name} ({c.code})</MenuItem>)}
                        </TextField>
                        <TextField select fullWidth label="Day" value={dialog.data.day || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, day: e.target.value } }))} size="small">
                            {DAYS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </TextField>
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField fullWidth label="Start Time" type="time" value={dialog.data.startTime || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, startTime: e.target.value } }))} size="small" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid item xs={6}><TextField fullWidth label="End Time" type="time" value={dialog.data.endTime || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, endTime: e.target.value } }))} size="small" InputLabelProps={{ shrink: true }} /></Grid>
                        </Grid>
                        <TextField fullWidth label="Room / Venue" value={dialog.data.room || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, room: e.target.value } }))} size="small" />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDialog({ open: false, data: {} })}>Cancel</Button>
                    <Button variant="contained" onClick={() => { onSaveSchedule?.(dialog.data); setDialog({ open: false, data: {} }); }} sx={{ borderRadius: 3, fontWeight: 900 }}>Save Schedule</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
