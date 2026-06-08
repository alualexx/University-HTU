import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Avatar, Button, Stack, Chip,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider, alpha,
    List, ListItem, ListItemAvatar, ListItemText, IconButton
} from '@mui/material';
import {
    Person, CalendarMonth, Chat, Schedule, NoteAlt, Send, BookmarkBorder,
    SupportAgent, HistoryEdu, Report, Upcoming
} from '@mui/icons-material';
import { notificationsAPI } from '../../../services/api';

export default function AdvisingTab({ user, isDark, glassStyle, gradients }) {
    const [appointmentOpen, setAppointmentOpen] = useState(false);
    const [complaintOpen, setComplaintOpen] = useState(false);

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTopic, setAppointmentTopic] = useState("");
    const [complaintSubject, setComplaintSubject] = useState("");
    const [complaintDetails, setComplaintDetails] = useState("");

    const advisor = {
        name: 'Dr. Sarah Johnson',
        department: user?.department || 'Computer Science',
        email: 'sjohnson@university.edu',
        office: 'Block A, Room 305',
        hours: 'Mon & Wed, 10:00 AM — 12:00 PM',
    };

    const [pastSessions, setPastSessions] = useState([
        { date: '2026-05-15', topic: 'Semester course selection review', notes: 'Recommended Data Structures & Algorithms.' },
        { date: '2026-04-02', topic: 'Academic progress check', notes: 'GPA trending positively; maintain current effort.' },
        { date: '2026-02-20', topic: 'Career guidance discussion', notes: 'Discussed internship opportunities for summer.' },
    ]);

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    const handleBookAppointment = async () => {
        try {
            await notificationsAPI.create({
                title: "Advising Appointment Req",
                message: `Request for ${appointmentDate}: ${appointmentTopic}`,
                type: 'academic'
            });
            setUpcomingAppointments(prev => [{ date: appointmentDate, topic: appointmentTopic, status: 'Pending' }, ...prev]);
            alert("Appointment requested successfully.");
            setAppointmentOpen(false);
            setAppointmentDate("");
            setAppointmentTopic("");
        } catch (e) {
            alert("Failed to request appointment.");
        }
    };

    const handleSubmitComplaint = async () => {
        try {
            await notificationsAPI.create({
                title: `Complaint: ${complaintSubject}`,
                message: complaintDetails,
                type: 'system'
            });
            alert("Complaint submitted successfully.");
            setComplaintOpen(false);
            setComplaintSubject("");
            setComplaintDetails("");
        } catch (e) {
            alert("Failed to submit complaint.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 0.5 }}>Advising & Support</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>ACADEMIC GUIDANCE</Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {/* Advisor Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ height: 80, background: gradients[0] }} />
                        <CardContent sx={{ textAlign: 'center', mt: -5, pb: 4 }}>
                            <Avatar sx={{ width: 80, height: 80, mx: 'auto', border: `4px solid ${isDark ? '#1e1e2f' : '#fff'}`, fontWeight: 900, fontSize: 28, background: gradients[1] }}>
                                {advisor.name[0]}
                            </Avatar>
                            <Typography variant="h6" fontWeight={900} sx={{ mt: 1.5 }}>{advisor.name}</Typography>
                            <Chip label="Academic Advisor" size="small" sx={{ mt: 0.5, fontWeight: 800, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />

                            <Divider sx={{ my: 2.5 }} />
                            <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                                {[
                                    { icon: <Person />, label: 'Department', value: advisor.department },
                                    { icon: <Chat />, label: 'Email', value: advisor.email },
                                    { icon: <Schedule />, label: 'Office', value: advisor.office },
                                    { icon: <CalendarMonth />, label: 'Office Hours', value: advisor.hours },
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: 18, color: 'text.secondary' } })}
                                        <Box>
                                            <Typography variant="caption" fontWeight={800} color="text.secondary">{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={800}>{item.value}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            <Stack spacing={1.5} sx={{ mt: 3 }}>
                                <Button fullWidth variant="contained" startIcon={<CalendarMonth />} onClick={() => setAppointmentOpen(true)} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', background: gradients[0] }}>Book Appointment</Button>
                                <Button fullWidth variant="outlined" startIcon={<Chat />} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Send Message</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Session History + Actions */}
                <Grid item xs={12} md={8}>
                    {upcomingAppointments.length > 0 && (
                        <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3, border: `1px solid ${alpha('#10b981', 0.2)}` }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Upcoming sx={{ color: '#10b981' }} />
                                    <Typography variant="h6" fontWeight={900}>Upcoming Appointments</Typography>
                                </Box>
                                <List disablePadding>
                                    {upcomingAppointments.map((a, i) => (
                                        <ListItem key={i} sx={{ px: 0, py: 1 }}>
                                            <ListItemAvatar><Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981', width: 36, height: 36 }}><CalendarMonth sx={{ fontSize: 18 }} /></Avatar></ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle2" fontWeight={800}>{a.topic}</Typography>}
                                                secondary={<Typography variant="caption" color="text.secondary">{a.date} — {a.status}</Typography>}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <HistoryEdu sx={{ color: '#6366f1' }} />
                                <Typography variant="h6" fontWeight={900}>Advising Session History</Typography>
                            </Box>
                            <List disablePadding>
                                {pastSessions.map((s, i) => (
                                    <React.Fragment key={i}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', width: 40, height: 40 }}>
                                                    <NoteAlt sx={{ fontSize: 20 }} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle2" fontWeight={900}>{s.topic}</Typography>}
                                                secondary={
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{new Date(s.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.notes}</Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {i < pastSessions.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Grid container spacing={3}>
                        {[
                            { icon: <BookmarkBorder />, title: 'Request Letter', desc: 'Enrollment verification or recommendation', color: '#3b82f6', gradient: gradients[1] },
                            { icon: <SupportAgent />, title: 'Counseling', desc: 'Mental health & well-being resources', color: '#10b981', gradient: gradients[2] },
                            { icon: <Report />, title: 'Submit Complaint', desc: 'Academic concern or grievance', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', action: () => setComplaintOpen(true) },
                        ].map((a, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Card onClick={a.action} sx={{ ...glassStyle, borderRadius: 4, cursor: a.action ? 'pointer' : 'default', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', mx: 'auto', mb: 1.5 }}>
                                            {React.cloneElement(a.icon, { sx: { fontSize: 22 } })}
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight={900}>{a.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{a.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Appointment Dialog */}
            <Dialog open={appointmentOpen} onClose={() => setAppointmentOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Book Advising Appointment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Preferred Date" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                        <TextField fullWidth label="Topic / Reason" multiline rows={3} value={appointmentTopic} onChange={(e) => setAppointmentTopic(e.target.value)} placeholder="What would you like to discuss?" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setAppointmentOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleBookAppointment} disabled={!appointmentDate || !appointmentTopic} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Request Appointment</Button>
                </DialogActions>
            </Dialog>

            {/* Complaint Dialog */}
            <Dialog open={complaintOpen} onClose={() => setComplaintOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Submit Academic Complaint</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Subject" value={complaintSubject} onChange={(e) => setComplaintSubject(e.target.value)} placeholder="Brief title for your complaint" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                        <TextField fullWidth label="Details" multiline rows={4} value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)} placeholder="Describe your concern in detail..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setComplaintOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={handleSubmitComplaint} disabled={!complaintSubject || !complaintDetails} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit Complaint</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
