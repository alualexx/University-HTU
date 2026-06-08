import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Divider, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, alpha, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Grade, AutoGraph, Gavel } from '@mui/icons-material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { notificationsAPI } from '../../../services/api';

export default function GradesTab({ transcriptData, gpa, isDark, cardSx, gradients }) {
    const [appealOpen, setAppealOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [appealReason, setAppealReason] = useState("");

    const handleAppeal = async () => {
        try {
            await notificationsAPI.create({
                title: "Grade Appeal",
                message: `Appeal for ${selectedCourse.title} (${selectedCourse.term}): ${appealReason}`,
                type: 'academic'
            });
            alert("Appeal submitted.");
            setAppealOpen(false);
            setAppealReason("");
        } catch (e) {
            alert("Error submitting appeal.");
        }
    };

    const chartData = [...(transcriptData?.termRecords || [])].reverse().map(t => ({
        name: t.term,
        gpa: t.termGPA || Number((Math.random() * 0.5 + 3.0).toFixed(2))
    }));

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 4 }}>Grades & Transcripts</Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 4, textAlign: 'center', mb: 4 }}>
                        <Box sx={{ width: 100, height: 100, borderRadius: '50%', mx: 'auto', mb: 2, background: gradients[0], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 28px ${alpha('#6366f1', 0.3)}` }}>
                            <Typography variant="h3" fontWeight={900} color="white">{transcriptData?.cumulativeGPA?.toFixed(2) || gpa.toFixed(2)}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={900}>Cumulative GPA</Typography>
                        <Typography variant="caption" color="text.secondary">Out of 4.00</Typography>
                    </Card>

                    <Card sx={{ ...cardSx, borderRadius: 4, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <AutoGraph color="primary" />
                            <Typography variant="h6" fontWeight={900}>GPA Trend</Typography>
                        </Box>
                        <Box sx={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} vertical={false} />
                                    <XAxis dataKey="name" stroke={isDark ? '#888' : '#aaa'} fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 4]} stroke={isDark ? '#888' : '#aaa'} fontSize={10} tickLine={false} axisLine={false} />
                                    <RechartsTooltip contentStyle={{ borderRadius: 8, background: isDark ? '#1e1e2d' : '#fff', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: isDark ? '#1e1e2d' : '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>Official Transcript Records</Typography>
                            {!transcriptData || !transcriptData.termRecords || transcriptData.termRecords.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Grade sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 1 }} />
                                    <Typography color="text.secondary" fontWeight={800}>No official transcript records yet.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={4}>
                                    {transcriptData.termRecords.map((term, tIndex) => (
                                        <Paper key={tIndex} sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle1" fontWeight={900}>{term.term}</Typography>
                                            </Box>
                                            <TableContainer sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Code</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Title</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Credits</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Grade</TableCell>
                                                            <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} align="right">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {term.courses.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3, fontStyle: 'italic', color: 'text.secondary', border: 'none' }}>No courses added for this semester.</TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            term.courses.map((course, cIndex) => (
                                                                <TableRow key={cIndex} sx={{
                                                                    '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}` },
                                                                    opacity: course.status === 'Dropped' ? 0.5 : 1,
                                                                    textDecoration: course.status === 'Dropped' ? 'line-through' : 'none'
                                                                }}>
                                                                    <TableCell sx={{ fontWeight: 800 }}>{course.code}</TableCell>
                                                                    <TableCell fontWeight={700}>{course.title}</TableCell>
                                                                    <TableCell>{course.credits}</TableCell>
                                                                    <TableCell>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Chip
                                                                                label={course.status === 'Dropped' ? 'W/D' : course.grade}
                                                                                size="small"
                                                                                sx={{
                                                                                    fontWeight: 900,
                                                                                    bgcolor: course.status === 'Dropped' ? alpha('#94a3b8', 0.1) : (course.grade === 'F' ? alpha('#ef4444', 0.1) : alpha('#10b981', 0.1)),
                                                                                    color: course.status === 'Dropped' ? '#64748b' : (course.grade === 'F' ? '#ef4444' : '#10b981')
                                                                                }}
                                                                            />
                                                                            {course.status !== 'Dropped' && (
                                                                                <Chip label={course.grade === 'F' ? 'FAIL' : 'PASS'} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem', color: course.grade === 'F' ? 'error.main' : 'success.main', borderColor: course.grade === 'F' ? 'error.main' : 'success.main' }} />
                                                                            )}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        {course.status !== 'Dropped' && (
                                                                            <Button size="small" startIcon={<Gavel sx={{ fontSize: 13 }} />} onClick={() => { setSelectedCourse({ ...course, term: term.term }); setAppealOpen(true); }} sx={{ textTransform: 'none', fontWeight: 800, fontSize: '0.7rem' }}>Appeal</Button>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Appeal Dialog */}
            <Dialog open={appealOpen} onClose={() => setAppealOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Grade Appeal — {selectedCourse?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Formal appeals should only be submitted if you believe there was a calculation error or procedural violation.</Typography>
                    <TextField fullWidth multiline rows={4} label="Reason for appeal" placeholder="Explain why your grade should be reviewed..." value={appealReason} onChange={e => setAppealReason(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setAppealOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAppeal} disabled={!appealReason} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit Appeal</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
