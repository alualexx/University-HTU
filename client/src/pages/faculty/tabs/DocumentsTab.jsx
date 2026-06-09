import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tabs, Tab, Divider, alpha, LinearProgress, List,
    ListItem, ListItemIcon, ListItemText, Paper,
} from "@mui/material";
import {
    UploadFile, Description, FolderOpen, Event, Inventory,
    Add as AddIcon, CalendarToday, Article, Policy, BarChart as BudgetIcon,
    Archive, Announcement, MeetingRoom, Science, Construction,
    Close as CloseIcon, Download, Visibility, CheckCircle, DeleteOutline,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { announcementsAPI, academicEventsAPI } from "../../../services/api";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
};

const DOC_ICONS = {
    policy: <Policy />, circular: <Announcement />, minute: <Article />,
    form: <Description />, syllabus: <FolderOpen />, accreditation: <CheckCircle />,
};

export default function DocumentsTab({ department, user }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [equipment, setEquipment] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [budget, setBudget] = useState({ allocated: 50000, spent: 32500, currency: "JOD" });
    const [openAnnounce, setOpenAnnounce] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [openBooking, setOpenBooking] = useState(false);
    const [openEquip, setOpenEquip] = useState(false);
    const [newAnnounce, setNewAnnounce] = useState({ title: "", message: "", type: "circular" });
    const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", location: "" });
    const [newDoc, setNewDoc] = useState({ name: "", type: "policy", description: "" });
    const [newBooking, setNewBooking] = useState({ room: "", date: "", startTime: "09:00", endTime: "10:00", purpose: "" });
    const [newEquip, setNewEquip] = useState({ name: "", type: "Computer", location: "", status: "Available" });

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 16,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchAnnouncements(); fetchEvents(); }, [department]);

    const fetchAnnouncements = async () => {
        try {
            const res = await announcementsAPI.getAll({ department });
            setAnnouncements(res.data || []);
        } catch (e) { console.error(e); }
    };

    const fetchEvents = async () => {
        try {
            const res = await academicEventsAPI.getAll({ department });
            setEvents(res.data || []);
        } catch (e) { console.error(e); }
    };

    const handleAddAnnouncement = async () => {
        try {
            await announcementsAPI.create({ ...newAnnounce, department, createdBy: user?._id || user?.uid, date: new Date() });
            setOpenAnnounce(false);
            setNewAnnounce({ title: "", message: "", type: "circular" });
            fetchAnnouncements();
        } catch (e) { console.error(e); }
    };

    const handleAddEvent = async () => {
        try {
            await academicEventsAPI.create({ ...newEvent, department, createdBy: user?._id || user?.uid, type: "department" });
            setOpenEvent(false);
            setNewEvent({ title: "", date: "", description: "", location: "" });
            fetchEvents();
        } catch (e) { console.error(e); }
    };

    const handleAddDoc = () => {
        setDocuments(prev => [...prev, { ...newDoc, id: Date.now(), date: new Date().toLocaleDateString(), size: "—" }]);
        setOpenDoc(false);
        setNewDoc({ name: "", type: "policy", description: "" });
    };

    const handleAddBooking = () => {
        setBookings(prev => [...prev, { ...newBooking, id: Date.now(), status: "confirmed" }]);
        setOpenBooking(false);
        setNewBooking({ room: "", date: "", startTime: "09:00", endTime: "10:00", purpose: "" });
    };

    const handleAddEquip = () => {
        setEquipment(prev => [...prev, { ...newEquip, id: Date.now(), lastChecked: new Date().toLocaleDateString() }]);
        setOpenEquip(false);
        setNewEquip({ name: "", type: "Computer", location: "", status: "Available" });
    };

    const handleDeleteAnnouncement = async (id) => {
        try {
            await announcementsAPI.delete(id);
            fetchAnnouncements();
        } catch (e) { console.error(e); }
    };

    const subTabs = ["Announcements", "Events Calendar", "Documents & Forms", "Room Booking", "Equipment & Assets", "Budget Tracker"];
    // eslint-disable-next-line no-unused-vars
    const spent = budget.spent;
    // eslint-disable-next-line no-unused-vars
    const pct = Math.min(Math.round((spent / budget.allocated) * 100), 100);

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Documents & Resources</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        ANNOUNCEMENTS • FORMS • EVENTS • EQUIPMENT • BUDGET
                    </Typography>
                </Box>
            </Box>

            <Tabs value={activeSubTab} onChange={(_, v) => setActiveSubTab(v)} variant="scrollable" scrollButtons="auto" sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none", fontSize: "0.85rem" }
            }}>
                {subTabs.map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {/* Announcements */}
            {activeSubTab === 0 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAnnounce(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                            New Announcement
                        </Button>
                    </Box>
                    <Stack spacing={2}>
                        {announcements.map(a => (
                            <Card key={a._id} sx={{ ...glass }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", flex: 1 }}>
                                            <Avatar sx={{ background: GRADIENTS.secondary, mt: 0.5 }}>
                                                {DOC_ICONS[a.type] || <Announcement />}
                                            </Avatar>
                                            <Box>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                    <Typography variant="subtitle1" fontWeight={900}>{a.title}</Typography>
                                                    <Chip label={a.type?.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }} />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">{a.message}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteAnnouncement(a._id)}>
                                            <DeleteOutline sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        {announcements.length === 0 && (
                            <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                                <Announcement sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                <Typography color="text.secondary" fontWeight={700}>No announcements yet</Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>
            )}

            {/* Events Calendar */}
            {activeSubTab === 1 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<Event />} onClick={() => setOpenEvent(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.success }}>
                            Add Event
                        </Button>
                    </Box>
                    <Grid container spacing={3}>
                        {events.map(ev => (
                            <Grid item xs={12} md={4} key={ev._id}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ mb: 2, p: 2, background: GRADIENTS.premium, borderRadius: 3, textAlign: "center" }}>
                                            <Typography variant="h4" fontWeight={1000} color="white">
                                                {ev.date ? new Date(ev.date).getDate() : "—"}
                                            </Typography>
                                            <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={800}>
                                                {ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={900}>{ev.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{ev.description}</Typography>
                                        {ev.location && (
                                            <Chip icon={<MeetingRoom sx={{ fontSize: 14 }} />} label={ev.location} size="small" sx={{ fontWeight: 800 }} />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {events.length === 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                                    <Event sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                    <Typography color="text.secondary" fontWeight={700}>No events scheduled</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Documents & Forms */}
            {activeSubTab === 2 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<UploadFile />} onClick={() => setOpenDoc(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.secondary }}>
                            Upload Document
                        </Button>
                    </Box>
                    {/* Category legend */}
                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
                        {Object.keys(DOC_ICONS).map(type => (
                            <Chip key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} size="small"
                                sx={{ fontWeight: 800, bgcolor: alpha("#6366f1", 0.08), color: "#6366f1" }} />
                        ))}
                    </Stack>
                    {documents.length === 0 ? (
                        <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                            <FolderOpen sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                            <Typography color="text.secondary" fontWeight={700}>No department documents uploaded yet</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ ...glass }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Document Name</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documents.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, background: GRADIENTS.secondary }}>{DOC_ICONS[doc.type]}</Avatar>
                                                    <Typography variant="body2" fontWeight={800}>{doc.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Chip label={doc.type} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{doc.date}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <IconButton size="small"><Visibility sx={{ fontSize: 18 }} /></IconButton>
                                                    <IconButton size="small" color="error" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}>
                                                        <DeleteOutline sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* Room Booking */}
            {activeSubTab === 3 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<MeetingRoom />} onClick={() => setOpenBooking(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                            Book Room
                        </Button>
                    </Box>
                    {bookings.length === 0 ? (
                        <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                            <MeetingRoom sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                            <Typography color="text.secondary" fontWeight={700}>No room bookings</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ ...glass }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Room</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Time</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Purpose</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map(b => (
                                        <TableRow key={b.id}>
                                            <TableCell fontWeight={800}>{b.room}</TableCell>
                                            <TableCell fontWeight={700}>{b.date}</TableCell>
                                            <TableCell fontWeight={700}>{b.startTime} – {b.endTime}</TableCell>
                                            <TableCell fontWeight={700}>{b.purpose}</TableCell>
                                            <TableCell>
                                                <Chip label="CONFIRMED" size="small" sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", fontWeight: 900 }} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* Equipment & Assets */}
            {activeSubTab === 4 && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                        <Button variant="contained" startIcon={<Inventory />} onClick={() => setOpenEquip(true)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.success }}>
                            Add Equipment
                        </Button>
                    </Box>
                    <Grid container spacing={3}>
                        {equipment.map(eq => (
                            <Grid item xs={12} sm={6} md={3} key={eq.id}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Avatar sx={{ background: eq.status === "Available" ? GRADIENTS.success : GRADIENTS.warning, mb: 2 }}>
                                            {eq.type === "Computer" ? <Science /> : <Construction />}
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight={900}>{eq.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{eq.type} • {eq.location}</Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Chip label={eq.status} size="small" sx={{
                                                fontWeight: 900,
                                                bgcolor: eq.status === "Available" ? alpha("#10b981", 0.1) : alpha("#f59e0b", 0.1),
                                                color: eq.status === "Available" ? "#10b981" : "#f59e0b",
                                            }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {equipment.length === 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                                    <Inventory sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                    <Typography color="text.secondary" fontWeight={700}>No equipment tracked</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Budget Tracker */}
            {activeSubTab === 5 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass, background: GRADIENTS.premium, color: "white" }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Budget Overview</Typography>
                                <Typography variant="h3" fontWeight={1000} sx={{ letterSpacing: -2, my: 2 }}>
                                    {budget.currency} {budget.allocated.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 800 }}>ANNUAL ALLOCATION</Typography>
                                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
                                <Stack spacing={2}>
                                    {[
                                        { label: "Spent", value: budget.spent, color: "#f97316" },
                                        { label: "Remaining", value: budget.allocated - budget.spent, color: "#10b981" },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" fontWeight={700} sx={{ opacity: 0.7 }}>{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={900} color={item.color}>
                                                {budget.currency} {item.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Expenditure by Category</Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    {[
                                        { label: "Salaries & Benefits", value: 18000, max: 25000 },
                                        { label: "Lab & Equipment", value: 7500, max: 12000 },
                                        { label: "Research Grants", value: 4000, max: 8000 },
                                        { label: "Events & Workshops", value: 2000, max: 3000 },
                                        { label: "Office & Admin", value: 1000, max: 2000 },
                                    ].map((cat, i) => {
                                        const catPct = Math.round((cat.value / cat.max) * 100);
                                        return (
                                            <Box key={i}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                    <Typography variant="body2" fontWeight={800}>{cat.label}</Typography>
                                                    <Typography variant="body2" fontWeight={900} color={catPct > 85 ? "#ef4444" : "text.primary"}>
                                                        {budget.currency} {cat.value.toLocaleString()} / {cat.max.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={catPct} sx={{
                                                    height: 8, borderRadius: 4,
                                                    bgcolor: alpha("#94a3b8", isDark ? 0.2 : 0.15),
                                                    "& .MuiLinearProgress-bar": {
                                                        borderRadius: 4,
                                                        background: catPct > 85 ? GRADIENTS.danger : catPct > 65 ? GRADIENTS.warning : GRADIENTS.success
                                                    }
                                                }} />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Dialogs */}
            {/* Announcement */}
            <Dialog open={openAnnounce} onClose={() => setOpenAnnounce(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>New Announcement / Circular</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField select fullWidth label="Type" value={newAnnounce.type} onChange={e => setNewAnnounce({ ...newAnnounce, type: e.target.value })}>
                            <MenuItem value="circular">Circular</MenuItem>
                            <MenuItem value="minute">Meeting Minute</MenuItem>
                            <MenuItem value="policy">Policy Update</MenuItem>
                            <MenuItem value="event">Event Announcement</MenuItem>
                        </TextField>
                        <TextField fullWidth label="Title" value={newAnnounce.title} onChange={e => setNewAnnounce({ ...newAnnounce, title: e.target.value })} />
                        <TextField fullWidth multiline rows={4} label="Message / Content" value={newAnnounce.message} onChange={e => setNewAnnounce({ ...newAnnounce, message: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAnnounce(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddAnnouncement} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>Publish</Button>
                </DialogActions>
            </Dialog>

            {/* Event */}
            <Dialog open={openEvent} onClose={() => setOpenEvent(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>Add Department Event</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                        <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                        <TextField fullWidth label="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                        <TextField fullWidth multiline rows={3} label="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEvent(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddEvent} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.success }}>Add Event</Button>
                </DialogActions>
            </Dialog>

            {/* Document Upload */}
            <Dialog open={openDoc} onClose={() => setOpenDoc(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>Upload Department Document</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Document Name" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} />
                        <TextField select fullWidth label="Document Type" value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
                            {Object.keys(DOC_ICONS).map(t => <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth multiline rows={2} label="Description (optional)" value={newDoc.description} onChange={e => setNewDoc({ ...newDoc, description: e.target.value })} />
                        <Box sx={{ border: "2px dashed", borderColor: "divider", borderRadius: 3, p: 4, textAlign: "center" }}>
                            <UploadFile sx={{ fontSize: 40, color: "text.secondary", opacity: 0.4, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary" fontWeight={700}>Click to select file or drag and drop</Typography>
                            <Typography variant="caption" color="text.secondary">PDF, DOC, XLSX supported</Typography>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDoc(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddDoc} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.secondary }}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Room Booking */}
            <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>Book Room / Lab</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Room / Venue" placeholder="e.g. Lab 3, Hall B" value={newBooking.room} onChange={e => setNewBooking({ ...newBooking, room: e.target.value })} />
                        <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField select fullWidth label="Start" value={newBooking.startTime} onChange={e => setNewBooking({ ...newBooking, startTime: e.target.value })}>
                                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField></Grid>
                            <Grid item xs={6}><TextField select fullWidth label="End" value={newBooking.endTime} onChange={e => setNewBooking({ ...newBooking, endTime: e.target.value })}>
                                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField></Grid>
                        </Grid>
                        <TextField fullWidth label="Purpose" value={newBooking.purpose} onChange={e => setNewBooking({ ...newBooking, purpose: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenBooking(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddBooking} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>Confirm Booking</Button>
                </DialogActions>
            </Dialog>

            {/* Equipment */}
            <Dialog open={openEquip} onClose={() => setOpenEquip(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>Add Equipment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Equipment Name" value={newEquip.name} onChange={e => setNewEquip({ ...newEquip, name: e.target.value })} />
                        <TextField select fullWidth label="Type" value={newEquip.type} onChange={e => setNewEquip({ ...newEquip, type: e.target.value })}>
                            {["Computer", "Projector", "Lab Instrument", "Printer", "Server", "Other"].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Location" value={newEquip.location} onChange={e => setNewEquip({ ...newEquip, location: e.target.value })} />
                        <TextField select fullWidth label="Status" value={newEquip.status} onChange={e => setNewEquip({ ...newEquip, status: e.target.value })}>
                            <MenuItem value="Available">Available</MenuItem>
                            <MenuItem value="In Use">In Use</MenuItem>
                            <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEquip(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleAddEquip} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.success }}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
