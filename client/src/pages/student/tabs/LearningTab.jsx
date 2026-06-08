import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Stack, Chip, Button, List, ListItem,
    ListItemIcon, ListItemText, Divider, alpha, IconButton, LinearProgress, Avatar, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    MenuBook, CloudUpload, Assignment, Download, Description, Forum,
    ExpandMore, CheckCircle, Schedule, PictureAsPdf, VideoLibrary, InsertDriveFile, ChatBubbleOutline
} from '@mui/icons-material';
import { notificationsAPI } from '../../../services/api';

export default function LearningTab({ user, myActiveCourses, isDark, glassStyle, gradients }) {
    const [expanded, setExpanded] = useState(0);
    const [courses, setCourses] = useState([]);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        const mapped = (myActiveCourses || []).map((c, idx) => ({
            id: c._id || idx,
            name: c.name,
            code: c.code || `COURSE-${idx + 1}`,
            instructor: c.instructor || 'TBA',
            syllabus: true,
            materials: [
                { name: 'Week 1 - Introduction.pdf', type: 'pdf', size: '2.4 MB', date: '2026-01-15' },
                { name: 'Week 2 - Core Concepts.pdf', type: 'pdf', size: '3.1 MB', date: '2026-01-22' },
                { name: 'Lecture 3 Recording', type: 'video', size: '180 MB', date: '2026-01-29' },
            ],
            assignments: [
                { id: `a1-${idx}`, name: 'Assignment 1', due: '2026-02-10', status: 'submitted', grade: '85/100' },
                { id: `a2-${idx}`, name: 'Assignment 2', due: '2026-03-01', status: 'submitted', grade: '92/100' },
                { id: `a3-${idx}`, name: 'Midterm Project', due: '2026-04-15', status: 'pending', grade: null },
            ],
            discussions: [
                { title: 'Week 1 Reading Discussion', replies: 12, latest: '2 hours ago' },
                { title: 'Midterm Project Ideas', replies: 5, latest: '1 day ago' }
            ]
        }));
        setCourses(mapped);
    }, [myActiveCourses]);

    const handleUploadSubmit = async () => {
        try {
            await notificationsAPI.create({
                title: "Assignment Submitted",
                message: `You successfully submitted ${selectedAssignment?.name}.`,
                type: 'academic'
            });
            setCourses(prev => prev.map(c => ({
                ...c,
                assignments: c.assignments.map(a => a.id === selectedAssignment?.id ? { ...a, status: 'submitted' } : a)
            })));
            setUploadOpen(false);
            alert("Assignment submitted successfully!");
        } catch (e) {
            alert("Failed to submit: " + e.message);
        }
    };

    const getFileIcon = (type) => {
        if (type === 'pdf') return <PictureAsPdf sx={{ color: '#ef4444', fontSize: 20 }} />;
        if (type === 'video') return <VideoLibrary sx={{ color: '#6366f1', fontSize: 20 }} />;
        return <InsertDriveFile sx={{ color: '#3b82f6', fontSize: 20 }} />;
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 0.5 }}>Learning & Materials</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>COURSE CONTENT & ASSIGNMENTS</Typography>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                {[
                    { label: 'Active Courses', value: courses.length, icon: <MenuBook />, gradient: gradients[0] },
                    { label: 'Pending Assignments', value: courses.reduce((s, c) => s + c.assignments.filter(a => a.status === 'pending').length, 0), icon: <Assignment />, gradient: gradients[2] },
                    { label: 'Submitted', value: courses.reduce((s, c) => s + c.assignments.filter(a => a.status === 'submitted').length, 0), icon: <CheckCircle />, gradient: gradients[1] },
                ].map((s, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Card sx={{ ...glassStyle, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.gradient }} />
                            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 3, background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    {React.cloneElement(s.icon, { sx: { fontSize: 22 } })}
                                </Box>
                                <Box>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.6rem' }}>{s.label}</Typography>
                                    <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1 }}>{s.value}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Course Accordions */}
            {courses.length === 0 ? (
                <Card sx={{ ...glassStyle, p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <MenuBook sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.25, mb: 2 }} />
                    <Typography color="text.secondary" fontWeight={800}>No courses enrolled. Register for courses to access materials.</Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {courses.map((course, idx) => (
                        <Accordion
                            key={idx}
                            expanded={expanded === idx}
                            onChange={() => setExpanded(expanded === idx ? -1 : idx)}
                            sx={{ ...glassStyle, borderRadius: '16px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Avatar sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', width: 40, height: 40, fontWeight: 900, fontSize: 14 }}>
                                        {course.code?.slice(0, 2) || 'C'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={900}>{course.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{course.code} · {course.instructor}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                        <Chip label={`${course.materials.length} Files`} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                                        <Chip label={`${course.assignments.length} Tasks`} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22, bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }} />
                                    </Stack>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Materials */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5, mb: 1.5, display: 'block' }}>COURSE MATERIALS</Typography>
                                        {course.syllabus && (
                                            <Box sx={{ p: 2, mb: 1.5, borderRadius: 3, bgcolor: alpha('#6366f1', 0.06), border: `1px solid ${alpha('#6366f1', 0.1)}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Description sx={{ color: '#6366f1', fontSize: 20 }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={900}>Course Syllabus</Typography>
                                                    <Typography variant="caption" color="text.secondary">Official course objectives</Typography>
                                                </Box>
                                                <IconButton size="small"><Download sx={{ fontSize: 18 }} /></IconButton>
                                            </Box>
                                        )}
                                        <List disablePadding>
                                            {course.materials.map((m, i) => (
                                                <ListItem key={i} sx={{ px: 1.5, py: 1, borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' } }} secondaryAction={<IconButton size="small"><Download sx={{ fontSize: 16 }} /></IconButton>}>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>{getFileIcon(m.type)}</ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2" fontWeight={800}>{m.name}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{m.size} · {m.date}</Typography>} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                    {/* Assignments */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5, mb: 1.5, display: 'block' }}>ASSIGNMENTS</Typography>
                                        <Stack spacing={1.5}>
                                            {course.assignments.map((a, i) => (
                                                <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', border: `1px solid ${a.status === 'submitted' ? alpha('#10b981', 0.12) : alpha('#f59e0b', 0.12)}` }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="subtitle2" fontWeight={900}>{a.name}</Typography>
                                                        <Chip label={a.status === 'submitted' ? 'Submitted' : 'Pending'} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', height: 20, bgcolor: a.status === 'submitted' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1), color: a.status === 'submitted' ? '#10b981' : '#f59e0b' }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">Due: {a.due}</Typography>
                                                    {a.grade && <Typography variant="caption" fontWeight={800} color="success.main" sx={{ ml: 2 }}>Grade: {a.grade}</Typography>}
                                                    {a.status === 'pending' && (
                                                        <Button size="small" startIcon={<CloudUpload sx={{ fontSize: 14 }} />} variant="outlined" onClick={() => { setSelectedAssignment(a); setUploadOpen(true); }} sx={{ mt: 1, borderRadius: 2, fontWeight: 800, textTransform: 'none', fontSize: '0.7rem' }}>Upload Submission</Button>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5, mt: 4, mb: 1.5, display: 'block' }}>DISCUSSIONS</Typography>
                                        <Stack spacing={1}>
                                            {course.discussions.map((d, i) => (
                                                <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#3b82f6', 0.04), border: `1px solid ${alpha('#3b82f6', 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <ChatBubbleOutline sx={{ color: '#3b82f6' }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle2" fontWeight={800}>{d.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{d.replies} replies · Latest: {d.latest}</Typography>
                                                    </Box>
                                                    <Button size="small" variant="text" sx={{ fontWeight: 800, textTransform: 'none' }}>View</Button>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            )}

            {/* Upload Dialog */}
            <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Submit Assignment</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Select a file to upload for <strong>{selectedAssignment?.name}</strong>.</Typography>
                    <Box sx={{ p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center', mb: 2 }}>
                        <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="subtitle2" fontWeight={800}>Drag and drop your file here</Typography>
                        <Typography variant="caption" color="text.secondary">or click to browse</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setUploadOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleUploadSubmit} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Confirm Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
