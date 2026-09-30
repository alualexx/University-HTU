import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Divider, IconButton, InputAdornment,
} from "@mui/material";
import {
    MenuBook, CheckCircle, Cancel, Search, Add, Gavel,
    SwapHoriz, Assignment, Policy, CalendarMonth, TrendingUp,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { coursesAPI, academicEventsAPI } from "../../../services/api";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
};

const STATUS_CHIP = {
    active: { label: "Active", color: "#10b981" },
    inactive: { label: "Inactive", color: "#94a3b8" },
    pending_college_approval: { label: "Pending College", color: "#f59e0b" },
    pending_registrar_approval: { label: "Pending Registrar", color: "#6366f1" },
    rejected_by_college: { label: "Rejected", color: "#ef4444" },
};

export default function AcademicOversightTab({ college, departments, courses: dashboardCourses }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);
    const [courses, setCourses] = useState(dashboardCourses || []);
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const [eventForm, setEventForm] = useState({ title: "", date: "", type: "Academic", description: "", location: "" });

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    useEffect(() => {
        if (dashboardCourses) {
            setCourses(dashboardCourses);
        }
    }, [dashboardCourses]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const collegeId = college?._id || college?.id;
                if (collegeId) {
                    const res = await academicEventsAPI.getAll({ collegeId });
                    setEvents(res.data || []);
                }
            } catch (e) { console.error(e); }
        };
        if (college) fetchEvents();
    }, [college]);

    const handleAddEvent = async () => {
        try {
            await academicEventsAPI.create({ ...eventForm, collegeId: college?._id || college?.id });
            const res = await academicEventsAPI.getAll({ collegeId: college?._id || college?.id });
            setEvents(res.data || []);
            setOpenEventDialog(false);
            setEventForm({ title: "", date: "", type: "Academic", description: "", location: "" });
        } catch (e) { console.error(e); }
    };

    const filtered = courses.filter(c =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.code?.toLowerCase().includes(search.toLowerCase())
    );

    const policyItems = [];
    const creditTransfers = [];
    const integrityCases = [];

    const subTabs = ["Programs & Courses", "Academic Calendar", "Policy Review", "Credit Transfers", "Integrity Cases"];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Academic Oversight</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    PROGRAMS • CALENDAR • POLICIES • CREDIT TRANSFERS • INTEGRITY
                </Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {subTabs.map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {/* Programs & Courses */}
            {subTab === 0 && (
                <Box>
                    <TextField size="small" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
                        sx={{ mb: 3, width: 320, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    <TableContainer sx={{ ...glass }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Code", "Department", "Year/Sem", "Credits", "Instructor", "Status"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.slice(0, 20).map(c => {
                                    const st = STATUS_CHIP[c.status] || { label: c.status || "—", color: "#94a3b8" };
                                    return (
                                        <TableRow key={c._id}>
                                            <TableCell sx={{ fontWeight: 800 }}>{c.name}</TableCell>
                                            <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{c.code}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{c.department}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Y{c.year} S{c.semester}</TableCell>
                                            <TableCell><Chip label={`${c.credits || 3} cr`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{c.instructorName || "—"}</TableCell>
                                            <TableCell><Chip label={st.label} size="small" sx={{ bgcolor: alpha(st.color, 0.1), color: st.color, fontWeight: 900, fontSize: "0.65rem" }} /></TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>No courses found</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Academic Calendar */}
            {subTab === 1 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenEventDialog(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                            Add Event
                        </Button>
                    </Box>
                    <Stack spacing={2}>
                        {events.map((ev, i) => (
                            <Card key={i} sx={{ ...glass }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha("#6366f1", 0.1), textAlign: "center", minWidth: 70 }}>
                                            <Typography variant="h5" fontWeight={1000} color="#6366f1">
                                                {new Date(ev.date).getDate()}
                                            </Typography>
                                            <Typography variant="caption" fontWeight={900} color="#6366f1">
                                                {new Date(ev.date).toLocaleDateString("en", { month: "short", year: "numeric" })}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={900}>{ev.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{ev.description}</Typography>
                                        </Box>
                                        <Chip label={ev.type} size="small" sx={{ fontWeight: 900 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        {events.length === 0 && (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>No events scheduled.</Typography>
                        )}
                    </Stack>
                </Box>
            )}

            {/* Policy Review */}
            {subTab === 2 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Policy Title", "Scope", "Last Updated", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {policyItems.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontWeight: 800 }}>{p.title}</TableCell>
                                    <TableCell><Chip label={p.dept} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{p.lastUpdated}</TableCell>
                                    <TableCell>
                                        <Chip label={p.status.toUpperCase()} size="small" sx={{
                                            fontWeight: 900, fontSize: "0.65rem",
                                            bgcolor: alpha(p.status === "active" ? "#10b981" : "#f59e0b", 0.1),
                                            color: p.status === "active" ? "#10b981" : "#f59e0b",
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none" }}>View</Button>
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none" }}>Revise</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Credit Transfers */}
            {subTab === 3 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Student", "Transfer From", "Equivalent Course", "Credits", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {creditTransfers.map((req, i) => {
                                const colors = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };
                                return (
                                    <TableRow key={i}>
                                        <TableCell sx={{ fontWeight: 800 }}>{req.student}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{req.from}</TableCell>
                                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{req.to}</TableCell>
                                        <TableCell><Chip label={`${req.credits} cr`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                        <TableCell>
                                            <Chip label={req.status.toUpperCase()} size="small" sx={{ bgcolor: alpha(colors[req.status], 0.1), color: colors[req.status], fontWeight: 900, fontSize: "0.65rem" }} />
                                        </TableCell>
                                        <TableCell>
                                            {req.status === "pending" && (
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" color="success" variant="contained" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                    <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                                </Stack>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Integrity Cases */}
            {subTab === 4 && (
                <Stack spacing={3}>
                    {integrityCases.map((c, i) => (
                        <Card key={i} sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ bgcolor: alpha("#ef4444", 0.1), color: "#ef4444" }}><Gavel /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={900}>Case #{c.id}</Typography>
                                            <Typography variant="caption" color="text.secondary">{c.type} · {c.course}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={c.severity} size="small" sx={{ fontWeight: 900, bgcolor: alpha(c.severity === "High" ? "#ef4444" : "#f59e0b", 0.1), color: c.severity === "High" ? "#ef4444" : "#f59e0b" }} />
                                        <Chip label={c.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, bgcolor: alpha(c.status === "resolved" ? "#10b981" : "#6366f1", 0.1), color: c.status === "resolved" ? "#10b981" : "#6366f1", fontSize: "0.6rem" }} />
                                        <Button size="small" sx={{ fontWeight: 800, textTransform: "none" }}>View Report</Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {/* Add Event Dialog */}
            <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>Add Academic Event</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Event Title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
                        <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                        <TextField select fullWidth label="Type" value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })}>
                            {["Academic", "Exam", "Research", "Administrative", "Event"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Location" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
                        <TextField fullWidth multiline rows={3} label="Description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEventDialog(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddEvent} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>Add Event</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
