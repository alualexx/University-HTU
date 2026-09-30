import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    useTheme, Grid, IconButton, Avatar, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Select, InputLabel, FormControl
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Notifications, Send, Search, FilterList, Campaign, Person,
    School, Event, Warning, History, Delete, Edit,
    Email, RecordVoiceOver, Visibility
} from "@mui/icons-material";

export default function NotificationsTab({
    students = [],
    departments = [],
    onSendNotification,
    glassStyle
}) {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [recipientType, setRecipientType] = useState("all");
    const [targetDept, setTargetDept] = useState("all");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [notifType, setNotifType] = useState("info");

    const handleDispatch = () => {
        if (!title.trim() || !message.trim()) return;
        onSendNotification?.({ title, message, type: notifType, recipientType, targetDept });
        setTitle("");
        setMessage("");
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Communication Hub</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>DISPATCH TARGETED BROADCASTS, INDIVIDUAL NOTIFICATIONS, AND AUTOMATED TEMPLATE ALERTS</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                        <Typography variant="h6" fontWeight={1000} gutterBottom>New Dispatch</Typography>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <TextField fullWidth label="Notice Headline" placeholder="e.g. Fall Semester Registration Now Open" value={title} onChange={e => setTitle(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField select fullWidth label="Recipient Scope" value={recipientType} onChange={e => setRecipientType(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                                        <MenuItem value="all">All Students</MenuItem>
                                        <MenuItem value="department">Specific Department</MenuItem>
                                        <MenuItem value="individual">Individual Student</MenuItem>
                                        <MenuItem value="lecturer">All Lecturers</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth label="Alert Severity" value={notifType} onChange={e => setNotifType(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                                        <MenuItem value="info">Information</MenuItem>
                                        <MenuItem value="success">Success / Green</MenuItem>
                                        <MenuItem value="warning">Warning / Amber</MenuItem>
                                        <MenuItem value="error">Critical / Red</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            {recipientType === 'department' && (
                                <TextField select fullWidth label="Select Department" value={targetDept} onChange={e => setTargetDept(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                                    <MenuItem value="all">Select Dept...</MenuItem>
                                    {departments.map(d => <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>)}
                                </TextField>
                            )}

                            <TextField fullWidth multiline rows={5} label="Message Body" placeholder="Compose your university dispatch here..." value={message} onChange={e => setMessage(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }} />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" fullWidth startIcon={<Send />} onClick={handleDispatch} sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}>Dispatch Secure Notice</Button>
                                <Button variant="outlined" sx={{ borderRadius: 3, px: 3 }}><Edit /></Button>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 2 }}>Recent Dispatch History</Typography>
                    <Stack spacing={2}>
                        {[
                            { title: 'Registration Deadline', date: '2h ago', level: 'warning' },
                            { title: 'Exam Timetable Revised', date: '5h ago', level: 'info' },
                            { title: 'New Course Offering', date: '1d ago', level: 'success' },
                        ].map((n, i) => (
                            <Card key={i} sx={{ ...glassStyle, p: 2, borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: alpha(n.level === 'warning' ? '#f59e0b' : '#3b82f6', 0.1), color: n.level === 'warning' ? '#f59e0b' : '#3b82f6' }}>
                                    {n.level === 'warning' ? <Warning /> : <Notifications />}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" fontWeight={900}>{n.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{n.date}</Typography>
                                </Box>
                                <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                            </Card>
                        ))}
                    </Stack>
                    <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 3, fontWeight: 900 }}>View Full Logs</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
