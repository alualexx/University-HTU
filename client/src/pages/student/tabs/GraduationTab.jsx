import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Stack, Stepper, Step, StepLabel,
    Chip, Button, LinearProgress, alpha, Divider, Checkbox, FormControlLabel,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import {
    EmojiEvents, CheckCircle, RadioButtonUnchecked, Download, School,
    AccountBalance, MenuBook, Celebration, CalendarMonth, GroupAdd, CardMembership
} from '@mui/icons-material';
import { notificationsAPI } from '../../../services/api';
import jsPDF from 'jspdf';

export default function GraduationTab({ user, isDark, glassStyle, gradients }) {
    const [applied, setApplied] = useState(false);
    const [alumniOptIn, setAlumniOptIn] = useState(false);
    const [certOpen, setCertOpen] = useState(false);
    const [certType, setCertType] = useState('Official Transcript');

    const handleApplyGraduation = async () => {
        try {
            await notificationsAPI.create({
                title: "Graduation Application",
                message: "Application submitted for review.",
                type: 'academic'
            });
            setApplied(true);
            alert("Application submitted successfully.");
        } catch (e) {
            alert("Error submitting application.");
        }
    };

    const handleRequestCertificate = async () => {
        try {
            await notificationsAPI.create({
                title: `Certificate Request: ${certType}`,
                message: "Request queued for processing.",
                type: 'academic'
            });
            setCertOpen(false);
            alert(`${certType} requested successfully.`);
        } catch (e) {
            alert("Error requesting certificate.");
        }
    };

    const handleDownloadClearance = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Official Clearance Letter", 20, 20);
        doc.setFontSize(12);
        doc.text(`Student: ${user?.name || 'Student'}`, 20, 30);
        doc.text("Status: FULLY CLEARED for Graduation", 20, 40);
        doc.save("Clearance_Letter.pdf");
    };

    const clearanceItems = [
        { label: 'Library Clearance', dept: 'Library', cleared: true },
        { label: 'Finance Clearance', dept: 'Finance Office', cleared: true },
        { label: 'Department Clearance', dept: user?.department || 'Department', cleared: false },
        { label: 'IT Services Clearance', dept: 'IT Department', cleared: false },
        { label: 'Hostel/Accommodation', dept: 'Student Affairs', cleared: true },
    ];

    const clearedCount = clearanceItems.filter(c => c.cleared).length;
    const clearancePercent = Math.round((clearedCount / clearanceItems.length) * 100);
    const allCleared = clearedCount === clearanceItems.length;

    const milestones = [
        'Complete Required Credits',
        'Pass All Core Courses',
        'Complete Internship/Practicum',
        'Submit Graduation Application',
        'Clearance Approved',
    ];
    const currentMilestone = 2;

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 0.5 }}>Graduation & Clearance</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>DEGREE COMPLETION TRACKER</Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {/* Left: Milestones */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, background: gradients[0] }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <EmojiEvents sx={{ color: 'white', fontSize: 28 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={900} color="white">Graduation Milestones</Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={800}>Track your journey to graduation</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Stepper orientation="vertical" activeStep={currentMilestone} sx={{ '& .MuiStepConnector-line': { minHeight: 24 } }}>
                                {milestones.map((m, i) => (
                                    <Step key={i} completed={i < currentMilestone}>
                                        <StepLabel StepIconProps={{ sx: { color: i < currentMilestone ? '#10b981' : i === currentMilestone ? '#6366f1' : 'text.secondary' } }}>
                                            <Typography variant="body2" fontWeight={i <= currentMilestone ? 900 : 600} color={i < currentMilestone ? 'success.main' : 'text.primary'}>{m}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </CardContent>
                    </Card>

                    {/* Apply for Graduation */}
                    <Card sx={{ ...glassStyle, borderRadius: 4, mt: 3 }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Celebration sx={{ fontSize: 40, color: applied ? '#10b981' : '#6366f1', mb: 1 }} />
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
                                {applied ? 'Application Submitted!' : 'Apply for Graduation'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {applied ? 'Your application is under review by the registrar.' : 'Submit once all requirements are met.'}
                            </Typography>
                            <Button
                                fullWidth variant="contained"
                                disabled={applied}
                                onClick={handleApplyGraduation}
                                startIcon={applied ? <CheckCircle /> : <School />}
                                sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', background: applied ? '#10b981' : gradients[0], py: 1.2 }}
                            >
                                {applied ? 'Submitted' : 'Submit Graduation Application'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Clearance Checklist */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={900}>Clearance Checklist</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>{clearedCount} of {clearanceItems.length} departments cleared</Typography>
                                </Box>
                                <Chip
                                    label={allCleared ? 'ALL CLEARED' : `${clearancePercent}%`}
                                    size="small"
                                    sx={{ fontWeight: 900, bgcolor: allCleared ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1), color: allCleared ? '#10b981' : '#f59e0b' }}
                                />
                            </Box>
                            <LinearProgress variant="determinate" value={clearancePercent} sx={{ height: 8, borderRadius: 4, mb: 3, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: allCleared ? '#10b981' : gradients[0], borderRadius: 4 } }} />

                            <Stack spacing={1.5}>
                                {clearanceItems.map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', border: `1px solid ${item.cleared ? alpha('#10b981', 0.15) : alpha('#f59e0b', 0.12)}`, transition: '0.2s' }}>
                                        {item.cleared ? <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} /> : <RadioButtonUnchecked sx={{ color: '#f59e0b', fontSize: 22 }} />}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={900}>{item.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.dept}</Typography>
                                        </Box>
                                        <Chip label={item.cleared ? 'Cleared' : 'Pending'} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', height: 22, bgcolor: item.cleared ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1), color: item.cleared ? '#10b981' : '#f59e0b' }} />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Convocation & Downloads */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <CalendarMonth sx={{ fontSize: 36, color: '#6366f1', mb: 1 }} />
                                    <Typography variant="subtitle2" fontWeight={900}>Convocation</Typography>
                                    <Typography variant="caption" color="text.secondary">Date: Dec 15, 2026</Typography>
                                    <Box sx={{ mt: 1.5 }}>
                                        <Button size="small" variant="outlined" onClick={() => setCertOpen(true)} sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', fontSize: '0.7rem' }}>Request Certificate</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ ...glassStyle, borderRadius: 4, height: '100%' }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Download sx={{ fontSize: 36, color: '#10b981', mb: 1 }} />
                                    <Typography variant="subtitle2" fontWeight={900}>Clearance Letter</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Button size="small" variant="outlined" disabled={!allCleared} onClick={handleDownloadClearance} sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', fontSize: '0.7rem' }}>Download PDF</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Card sx={{ ...glassStyle, borderRadius: 4, mt: 3 }}>
                        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <GroupAdd sx={{ mx: 'auto' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={900}>Alumni Network</Typography>
                                <Typography variant="caption" color="text.secondary">Stay connected after graduation. Join our global network of alumni.</Typography>
                            </Box>
                            <FormControlLabel
                                control={<Checkbox checked={alumniOptIn} onChange={(e) => setAlumniOptIn(e.target.checked)} sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' } }} />}
                                label={<Typography variant="caption" fontWeight={800}>Opt-in</Typography>}
                                labelPlacement="bottom"
                                sx={{ m: 0 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Certificate Dialog */}
            <Dialog open={certOpen} onClose={() => setCertOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Request Document / Certificate</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth select label="Document Type" value={certType} onChange={(e) => setCertType(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            {['Official Transcript', 'Degree Certificate (Duplicate)', 'Letter of Completion', 'English Proficiency'].map(o => (
                                <MenuItem key={o} value={o}>{o}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setCertOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleRequestCertificate} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit Request</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
