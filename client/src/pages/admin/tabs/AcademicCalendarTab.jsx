import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Grid, Card, Typography, Stack, Button, IconButton, Avatar, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, Divider, TextField, MenuItem, useTheme, alpha, LinearProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
    Snackbar, Alert, Tooltip
} from "@mui/material";
import {
    Schedule, CalendarMonth, NotificationsActive, Add, Edit, Delete,
    AccessTime, Flag, CheckCircle, Send, Close, Save, Notifications
} from "@mui/icons-material";
import { academicEventsAPI, announcementsAPI, systemAPI } from "../../../services/api";

export default function AcademicCalendarTab() {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [dispatchHistory, setDispatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    // Event dialog
    const [evtDialog, setEvtDialog] = useState({ open: false, data: null });
    const [evtForm, setEvtForm] = useState({ title: "", date: "", category: "Academic", priority: "Normal", description: "" });

    // Semester dialog
    const [semDialog, setSemDialog] = useState({ open: false, data: null });
    const [semForm, setSemForm] = useState({ name: "", start: "", end: "", regStart: "", regEnd: "", status: "Upcoming" });

    // Dispatch state
    const [dispatchType, setDispatchType] = useState("reg_open");
    const [dispatchMsg, setDispatchMsg] = useState("");

    const glassStyle = {
        background: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.05)",
    };

    const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [evtRes, settingsRes] = await Promise.all([
                academicEventsAPI.getAll(),
                systemAPI.getSettings("calendar").catch(() => ({ data: {} })),
            ]);
            setEvents(evtRes.data || []);
            if (settingsRes.data?.semesters) setSemesters(settingsRes.data.semesters);
            if (settingsRes.data?.dispatchHistory) setDispatchHistory(settingsRes.data.dispatchHistory);
        } catch { /* gracefully ignore */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Current year/semester derived from live data
    const activeSem = semesters.find(s => s.status === "Active");
    const currentYear = activeSem?.academicYear || "2026-2027";

    // calculates percentage of registration period elapsed
    const regProgress = (sem) => {
        if (!sem.regStart || !sem.regEnd) return 0;
        const start = new Date(sem.regStart).getTime();
        const end = new Date(sem.regEnd).getTime();
        const now = Date.now();
        return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
    };

    // ── Event CRUD ──
    const openEvtDialog = (data = null) => {
        setEvtForm(data ? { title: data.title, date: data.date?.split("T")[0] || "", category: data.category || "Academic", priority: data.priority || "Normal", description: data.description || "" } : { title: "", date: "", category: "Academic", priority: "Normal", description: "" });
        setEvtDialog({ open: true, data });
    };

    const handleSaveEvt = async () => {
        if (!evtForm.title || !evtForm.date) return showSnack("Title and date are required.", "warning");
        setSaving(true);
        try {
            if (evtDialog.data?._id) {
                await academicEventsAPI.update(evtDialog.data._id, { ...evtForm, date: new Date(evtForm.date).toISOString() });
                showSnack("Event updated.");
            } else {
                await academicEventsAPI.create({ ...evtForm, date: new Date(evtForm.date).toISOString() });
                showSnack("Event created.");
            }
            setEvtDialog({ open: false, data: null });
            fetchData();
        } catch (err) {
            showSnack(err.response?.data?.message || "Failed to save event.", "error");
        } finally { setSaving(false); }
    };

    const handleDeleteEvt = async (evt) => {
        if (!window.confirm(`Delete "${evt.title}"?`)) return;
        try {
            await academicEventsAPI.delete(evt._id || evt.id);
            showSnack("Event removed.");
            fetchData();
        } catch { showSnack("Failed to delete event.", "error"); }
    };

    // ── Semester CRUD (persisted via systemAPI) ──
    const openSemDialog = (data = null) => {
        setSemForm(data ? { name: data.name, start: data.start, end: data.end, regStart: data.regStart, regEnd: data.regEnd, status: data.status || "Upcoming", academicYear: data.academicYear || "" } : { name: "", start: "", end: "", regStart: "", regEnd: "", status: "Upcoming", academicYear: "2026-2027" });
        setSemDialog({ open: true, data });
    };

    const handleSaveSem = async () => {
        if (!semForm.name || !semForm.start) return showSnack("Name and start date are required.", "warning");
        let updated;
        if (semDialog.data) {
            updated = semesters.map(s => s === semDialog.data ? { ...semForm } : s);
        } else {
            updated = [...semesters, { ...semForm }];
        }
        setSemesters(updated);
        setSemDialog({ open: false, data: null });
        try { await systemAPI.updateSettings("calendar", { semesters: updated, dispatchHistory }); showSnack("Semester saved."); }
        catch { showSnack("Saved locally. Backend sync may have failed.", "warning"); }
    };

    const handleDeleteSem = async (idx) => {
        if (!window.confirm(`Remove semester "${semesters[idx].name}"?`)) return;
        const updated = semesters.filter((_, i) => i !== idx);
        setSemesters(updated);
        try { await systemAPI.updateSettings("calendar", { semesters: updated, dispatchHistory }); showSnack("Semester removed."); }
        catch { showSnack("Removed locally.", "info"); }
    };

    // ── Calendar Dispatch ──
    const handleDispatch = async () => {
        if (!dispatchMsg) return showSnack("Write a notification payload first.", "warning");
        setSaving(true);
        try {
            const labels = { reg_open: "Registration Opening", exam_period: "Examination Period Initiation", grade_deadline: "Final Grade Submission Cut-off" };
            await announcementsAPI.create({ title: labels[dispatchType] || dispatchType, content: dispatchMsg, audience: "all", status: "published", date: new Date().toISOString() });
            const entry = { time: new Date().toLocaleTimeString(), action: labels[dispatchType], reach: "100%" };
            const newHistory = [entry, ...dispatchHistory].slice(0, 10);
            setDispatchHistory(newHistory);
            await systemAPI.updateSettings("calendar", { semesters, dispatchHistory: newHistory });
            setDispatchMsg("");
            showSnack("Global dispatch executed successfully.");
        } catch (err) {
            showSnack(err.response?.data?.message || "Dispatch failed.", "error");
        } finally { setSaving(false); }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Academic Year & Semester Management</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE TEMPORAL LIFECYCLES, DEADLINES, AND SYSTEM-WIDE CALENDAR COORDINATION</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <Chip label={`ACTIVE_YEAR: ${currentYear}`} sx={{ fontWeight: 1000, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", border: "1px solid" }} />
                {activeSem && <Chip label={`CURRENT_PHASE: ${activeSem.name}`} sx={{ fontWeight: 1000, bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", border: "1px solid" }} />}
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: "0.9rem" } }}>
                <Tab icon={<Schedule sx={{ fontSize: 20 }} />} iconPosition="start" label="Semester Lifecycle" />
                <Tab icon={<CalendarMonth sx={{ fontSize: 20 }} />} iconPosition="start" label="University Calendar" />
                <Tab icon={<NotificationsActive sx={{ fontSize: 20 }} />} iconPosition="start" label="Calendar Dispatch" />
            </Tabs>

            {/* ── TAB 0: Semester Lifecycle ── */}
            {subTab === 0 && (
                <Stack spacing={3}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => openSemDialog()} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Semester</Button>
                    </Box>
                    {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> :
                        semesters.length === 0 ? (
                            <Card sx={{ ...glassStyle, p: 6, borderRadius: 5, textAlign: "center", opacity: 0.5 }}>
                                <AccessTime sx={{ fontSize: 48, mb: 1 }} />
                                <Typography variant="h6" fontWeight={900}>No Semesters Configured</Typography>
                                <Typography variant="body2">Click "Add Semester" to define the academic calendar.</Typography>
                            </Card>
                        ) : semesters.map((sem, i) => (
                            <Card key={i} sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: sem.status === "Active" ? "primary.main" : "grey.600" }}><AccessTime /></Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={900}>{sem.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{sem.academicYear || currentYear}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={sem.status?.toUpperCase()} color={sem.status === "Active" ? "primary" : "default"} sx={{ fontWeight: 900 }} />
                                        <Tooltip title="Edit"><IconButton onClick={() => openSemDialog(sem)}><Edit /></IconButton></Tooltip>
                                        <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDeleteSem(i)}><Delete /></IconButton></Tooltip>
                                    </Stack>
                                </Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight={1000} gutterBottom>Registration Period</Typography>
                                        <LinearProgress variant="determinate" value={regProgress(sem)} sx={{ height: 6, borderRadius: 3, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                                        <Stack direction="row" spacing={3}>
                                            <Box><Typography variant="caption" color="text.secondary" fontWeight={800}>OPEN</Typography><Typography variant="body2" fontWeight={900}>{sem.regStart || "—"}</Typography></Box>
                                            <Box><Typography variant="caption" color="text.secondary" fontWeight={800}>CLOSE</Typography><Typography variant="body2" fontWeight={900}>{sem.regEnd || "—"}</Typography></Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight={1000} gutterBottom>Semester Duration</Typography>
                                        <Stack direction="row" spacing={3}>
                                            <Box><Typography variant="caption" color="text.secondary" fontWeight={800}>COMMENCES</Typography><Typography variant="body2" fontWeight={900}>{sem.start || "—"}</Typography></Box>
                                            <Box><Typography variant="caption" color="text.secondary" fontWeight={800}>FINISHES</Typography><Typography variant="body2" fontWeight={900}>{sem.end || "—"}</Typography></Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Card>
                        ))
                    }
                </Stack>
            )}

            {/* ── TAB 1: University Calendar (Events) ── */}
            {subTab === 1 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={900}>Strategic Event Timeline</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{events.length} events in calendar</Typography>
                        </Box>
                        <Button variant="contained" startIcon={<Add />} onClick={() => openEvtDialog()} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Create Event Node</Button>
                    </Box>
                    {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {["Temporal Node", "Classification", "Priority", "Target Date", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, opacity: 0.4 }}>No events. Create an event node above.</TableCell></TableRow>
                                    ) : events.map((evt, i) => (
                                        <TableRow key={evt._id || i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                            <TableCell sx={{ fontWeight: 800 }}>{evt.title}</TableCell>
                                            <TableCell><Chip label={evt.category || "General"} size="small" sx={{ fontWeight: 800, fontSize: "0.65rem" }} /></TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Flag sx={{ fontSize: 14, color: evt.priority === "Critical" ? "error.main" : "primary.main" }} />
                                                    <Typography variant="caption" fontWeight={900}>{(evt.priority || "Normal").toUpperCase()}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 900, fontFamily: "monospace" }}>{evt.date ? new Date(evt.date).toLocaleDateString() : "—"}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Notify Users"><IconButton size="small" onClick={() => { setDispatchType("reg_open"); setDispatchMsg(`Reminder: ${evt.title} on ${new Date(evt.date).toLocaleDateString()}`); setSubTab(2); }}><Notifications color="primary" /></IconButton></Tooltip>
                                                <Tooltip title="Edit"><IconButton size="small" onClick={() => openEvtDialog(evt)}><Edit /></IconButton></Tooltip>
                                                <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteEvt(evt)}><Delete /></IconButton></Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            )}

            {/* ── TAB 2: Calendar Dispatch ── */}
            {subTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Unified Dispatch Controller</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Send university-wide calendar alerts to all portal dashboards via announcements.</Typography>
                            <Stack spacing={3}>
                                <TextField fullWidth select label="Temporal Milestone Type" size="small" value={dispatchType} onChange={e => setDispatchType(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    <MenuItem value="reg_open">Registration Opening</MenuItem>
                                    <MenuItem value="exam_period">Examination Period Initiation</MenuItem>
                                    <MenuItem value="grade_deadline">Final Grade Submission Cut-off</MenuItem>
                                </TextField>
                                <TextField fullWidth multiline rows={4} label="Notification Payload" placeholder="Draft your operational dispatch here..." value={dispatchMsg} onChange={e => setDispatchMsg(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                                <Button fullWidth variant="contained" size="large" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Send />} onClick={handleDispatch} disabled={saving} sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}>
                                    {saving ? "Dispatching…" : "Execute Global Dispatch"}
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, height: "100%" }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Dispatch Propagation History</Typography>
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                {dispatchHistory.length === 0 ? (
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>No dispatches sent yet.</Typography>
                                ) : dispatchHistory.map((log, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 3 }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800}>{log.action}</Typography>
                                            <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="caption" fontWeight={900} color="success.main">{log.reach} REACH</Typography>
                                            <CheckCircle sx={{ fontSize: 14, ml: 1, color: "success.main" }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Event Dialog */}
            <Dialog open={evtDialog.open} onClose={() => setEvtDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                    {evtDialog.data ? "Edit Event" : "Create Event Node"}
                    <IconButton onClick={() => setEvtDialog({ open: false, data: null })} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label="Event Title" value={evtForm.title} onChange={e => setEvtForm({ ...evtForm, title: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Date" type="date" value={evtForm.date} onChange={e => setEvtForm({ ...evtForm, date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <Stack direction="row" spacing={2}>
                            <TextField select fullWidth label="Category" value={evtForm.category} onChange={e => setEvtForm({ ...evtForm, category: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                {["Academic", "Exam", "Holiday", "Administrative", "Other"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </TextField>
                            <TextField select fullWidth label="Priority" value={evtForm.priority} onChange={e => setEvtForm({ ...evtForm, priority: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                {["Normal", "High", "Critical"].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </TextField>
                        </Stack>
                        <TextField fullWidth multiline rows={3} label="Description" value={evtForm.description} onChange={e => setEvtForm({ ...evtForm, description: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEvtDialog({ open: false, data: null })} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Save />} onClick={handleSaveEvt} disabled={saving} sx={{ borderRadius: 2, fontWeight: 900 }}>
                        {saving ? "Saving…" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Semester Dialog */}
            <Dialog open={semDialog.open} onClose={() => setSemDialog({ open: false, data: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
                    {semDialog.data ? "Edit Semester" : "Add Semester"}
                    <IconButton onClick={() => setSemDialog({ open: false, data: null })} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label="Semester Name" placeholder="e.g. Semester 1 (Fall)" value={semForm.name} onChange={e => setSemForm({ ...semForm, name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Academic Year" value={semForm.academicYear} onChange={e => setSemForm({ ...semForm, academicYear: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth label="Start Date" type="date" value={semForm.start} onChange={e => setSemForm({ ...semForm, start: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                            <TextField fullWidth label="End Date" type="date" value={semForm.end} onChange={e => setSemForm({ ...semForm, end: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth label="Registration Open" type="date" value={semForm.regStart} onChange={e => setSemForm({ ...semForm, regStart: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                            <TextField fullWidth label="Registration Close" type="date" value={semForm.regEnd} onChange={e => setSemForm({ ...semForm, regEnd: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        </Stack>
                        <TextField select fullWidth label="Status" value={semForm.status} onChange={e => setSemForm({ ...semForm, status: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Upcoming">Upcoming</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSemDialog({ open: false, data: null })} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSaveSem} sx={{ borderRadius: 2, fontWeight: 900 }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
