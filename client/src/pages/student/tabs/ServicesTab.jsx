import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Stack, Button, Chip, Divider, alpha,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import {
    ReceiptLong, BadgeOutlined, SportsSoccer, Apartment, LibraryBooks,
    FeedbackOutlined, Gavel, Headset, Send, CheckCircle, Schedule, ArrowForward, DirectionsBus, Map
} from '@mui/icons-material';
import { notificationsAPI } from '../../../services/api';

export default function ServicesTab({ user, isDark, glassStyle, gradients }) {
    const [requestOpen, setRequestOpen] = useState(false);
    const [requestType, setRequestType] = useState('');
    const [requestDetails, setRequestDetails] = useState('');
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackSubj, setFeedbackSubj] = useState('');
    const [feedbackBody, setFeedbackBody] = useState('');

    const services = [
        { icon: <ReceiptLong />, title: 'Transcript Request', desc: 'Request official or unofficial transcript', color: '#6366f1', gradient: gradients[0], action: 'transcript' },
        { icon: <BadgeOutlined />, title: 'ID Replacement', desc: 'Apply for a new student ID card', color: '#3b82f6', gradient: gradients[1], action: 'id' },
        { icon: <Apartment />, title: 'Hostel Information', desc: 'Accommodation details and applications', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', action: 'hostel' },
        { icon: <LibraryBooks />, title: 'Library Access', desc: 'Catalog, resources, and e-books', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', link: 'https://library.university.edu' },
        { icon: <Headset />, title: 'IT Helpdesk', desc: 'Technical support and portal issues', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', action: 'it' },
    ];

    const [recentRequests, setRecentRequests] = useState([
        { type: 'Transcript', date: '2026-05-20', status: 'completed', ref: 'TR-2026-0142' },
        { type: 'ID Replacement', date: '2026-04-10', status: 'processing', ref: 'ID-2026-0089' },
    ]);

    const handleServiceRequest = async () => {
        try {
            await notificationsAPI.create({
                title: `Service Request: ${requestType.toUpperCase()}`,
                message: requestDetails,
                type: 'system'
            });
            setRecentRequests(prev => [{ type: requestType.toUpperCase(), date: new Date().toLocaleDateString('en-CA'), status: 'processing', ref: `REQ-${Math.floor(Math.random() * 10000)}` }, ...prev]);
            setRequestOpen(false);
            setRequestDetails('');
            alert("Service request submitted.");
        } catch (e) {
            alert("Failed to submit request.");
        }
    };

    const handleFeedbackSubmit = async () => {
        try {
            await notificationsAPI.create({
                title: `Feedback: ${feedbackSubj}`,
                message: feedbackBody,
                type: 'system'
            });
            setFeedbackOpen(false);
            setFeedbackSubj('');
            setFeedbackBody('');
            alert("Feedback submitted successfully.");
        } catch (e) {
            alert("Error submitting feedback.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 0.5 }}>Other Services</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>REQUESTS & RESOURCES</Typography>

            {/* Service Cards Grid */}
            <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                {services.map((s, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card
                            onClick={() => {
                                if (s.link) window.open(s.link, '_blank');
                                else if (s.action) { setRequestType(s.action); setRequestOpen(true); }
                            }}
                            sx={{
                                ...glassStyle, borderRadius: 4, cursor: s.action ? 'pointer' : 'default',
                                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                                '&:hover': { transform: 'translateY(-6px)', boxShadow: isDark ? `0 16px 32px rgba(0,0,0,0.4)` : `0 16px 32px rgba(0,0,0,0.08)` }
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.gradient }} />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box sx={{ width: 48, height: 48, borderRadius: 3, background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', mb: 2 }}>
                                        {React.cloneElement(s.icon, { sx: { fontSize: 22 } })}
                                    </Box>
                                    {(s.action || s.link) && <ArrowForward sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.5 }} />}
                                </Box>
                                <Typography variant="subtitle1" fontWeight={900}>{s.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{s.desc}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Requests & Feedback */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Recent Requests</Typography>
                            {recentRequests.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No recent requests.</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {recentRequests.map((r, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', border: `1px solid ${r.status === 'completed' ? alpha('#10b981', 0.12) : alpha('#f59e0b', 0.12)}` }}>
                                            {r.status === 'completed' ? <CheckCircle sx={{ color: '#10b981' }} /> : <Schedule sx={{ color: '#f59e0b' }} />}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={900}>{r.type}</Typography>
                                                <Typography variant="caption" color="text.secondary">Ref: {r.ref} · {new Date(r.date).toLocaleDateString()}</Typography>
                                            </Box>
                                            <Chip label={r.status === 'completed' ? 'Completed' : 'Processing'} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', height: 22, bgcolor: r.status === 'completed' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1), color: r.status === 'completed' ? '#10b981' : '#f59e0b' }} />
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    {/* Shuttle Schedule */}
                    <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <DirectionsBus sx={{ color: '#10b981' }} />
                                <Typography variant="h6" fontWeight={900}>Campus Shuttle</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Route</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', align: 'right' }}>Frequency</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow><TableCell sx={{ py: 1.5, fontWeight: 700 }}>North Campus ↔ Main</TableCell><TableCell align="right">Every 15 mins</TableCell></TableRow>
                                        <TableRow><TableCell sx={{ py: 1.5, fontWeight: 700 }}>South Dorms ↔ Library</TableCell><TableCell align="right">Every 30 mins</TableCell></TableRow>
                                        <TableRow><TableCell sx={{ py: 1.5, fontWeight: 700 }}>Metro Station ↔ Main</TableCell><TableCell align="right">Every 20 mins</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Campus Map Placeholder */}
                    <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3, position: 'relative', overflow: 'hidden', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, #6366f1, #6366f1 10px, transparent 10px, transparent 20px)' }} />
                        <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <Map sx={{ fontSize: 40, color: '#6366f1', mb: 1 }} />
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>Interactive Campus Map</Typography>
                            <Button size="small" variant="contained" sx={{ mt: 1, borderRadius: 2, fontWeight: 800, textTransform: 'none', background: gradients[0] }}>Open Map</Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <FeedbackOutlined sx={{ fontSize: 40, color: '#6366f1', mb: 1 }} />
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>Share Feedback</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Help us improve the student experience.</Typography>
                            <Button variant="contained" startIcon={<Send />} onClick={() => setFeedbackOpen(true)} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', background: gradients[0] }}>Submit Feedback</Button>
                        </CardContent>
                    </Card>
                    <Card sx={{ ...glassStyle, borderRadius: 4, mt: 3 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Gavel sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>Disciplinary Records</Typography>
                            <Chip label="No Records" size="small" sx={{ fontWeight: 800, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Request Dialog */}
            <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>
                    {requestType === 'transcript' ? 'Request Transcript' : requestType === 'id' ? 'ID Card Replacement' : 'IT Support Ticket'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {requestType === 'transcript' && (
                            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                                <InputLabel>Transcript Type</InputLabel>
                                <Select label="Transcript Type" defaultValue="official">
                                    <MenuItem value="official">Official</MenuItem>
                                    <MenuItem value="unofficial">Unofficial</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        <TextField fullWidth label="Reason / Additional Details" multiline rows={3} value={requestDetails} onChange={(e) => setRequestDetails(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setRequestOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleServiceRequest} disabled={!requestDetails} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit Request</Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Submit Feedback</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Subject" value={feedbackSubj} onChange={(e) => setFeedbackSubj(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                        <TextField fullWidth label="Your Feedback" multiline rows={4} value={feedbackBody} onChange={(e) => setFeedbackBody(e.target.value)} placeholder="Share your thoughts or suggestions..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setFeedbackOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleFeedbackSubmit} disabled={!feedbackSubj || !feedbackBody} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
