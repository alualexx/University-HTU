import React from 'react';
import { Box, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, alpha, Grid, LinearProgress, Button, Stack, Divider } from '@mui/material';
import { MenuBook, TrendingUp, Warning, Download, Replay, AssignmentLate, CheckCircle } from '@mui/icons-material';
import jsPDF from 'jspdf';

const tH = { fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '2px solid rgba(0,0,0,0.06)' };
const tC = { borderBottom: '1px solid rgba(0,0,0,0.04)', py: 2 };

function getGradeColor(grade, gradeToPoints) {
    if (!grade || grade === "N/A") return 'text.secondary';
    const pts = gradeToPoints[grade];
    if (pts >= 3.0) return 'success.main';
    if (pts >= 2.0) return 'warning.main';
    return 'error.main';
}

export default function AcademicRecordsTab({ myActiveCourses, gradeToPoints, isDark, cardSx, transcriptData }) {
    // Fix theme border variables
    tH.borderBottom = `2px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`;
    tC.borderBottom = `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`;

    const earnedCredits = transcriptData?.termRecords?.reduce((acc, term) => acc + term.courses.reduce((sum, c) => sum + (c.grade !== 'F' && c.grade && c.grade !== 'W/D' ? (Number(c.credits) || 3) : 0), 0), 0) || 0;
    const requiredCredits = 120;
    const degreeProgress = Math.min((earnedCredits / requiredCredits) * 100, 100);

    const needsWarning = transcriptData && transcriptData.cumulativeGPA < 2.0;

    let repeats = [];
    let incompletes = [];
    if (transcriptData?.termRecords) {
        transcriptData.termRecords.forEach(term => {
            term.courses.forEach(c => {
                if (c.grade === 'F') repeats.push({ ...c, term: term.term });
                if (c.grade === 'IN' || !c.grade) incompletes.push({ ...c, term: term.term });
            });
        });
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Academic Records Summary", 20, 20);
        doc.setFontSize(12);
        doc.text(`Cumulative GPA: ${transcriptData?.cumulativeGPA?.toFixed(2) || 'N/A'}`, 20, 30);
        doc.text(`Earned Credits: ${earnedCredits} / ${requiredCredits}`, 20, 40);
        doc.save("Academic_Records_Summary.pdf");
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Academic Records</Typography>
                    <Chip label="Current Semester" size="small" color="primary" sx={{ fontWeight: 800 }} />
                </Box>
                <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadPDF} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Download PDF</Button>
            </Box>

            {needsWarning && (
                <Card sx={{ bgcolor: alpha('#ef4444', 0.1), border: `1px solid ${alpha('#ef4444', 0.3)}`, borderRadius: 4, mb: 4, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Warning color="error" />
                        <Box>
                            <Typography variant="subtitle2" fontWeight={900} color="error.main">Academic Warning / Probation</Typography>
                            <Typography variant="body2" color="error.main">Your cumulative GPA is below the required 2.0 minimum. Please contact your academic advisor.</Typography>
                        </Box>
                    </Box>
                </Card>
            )}

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Degree Audit Progress</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={800}>Earned Credits: {earnedCredits}</Typography>
                            <Typography variant="subtitle2" fontWeight={800}>Required: {requiredCredits}</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={degreeProgress} sx={{ height: 10, borderRadius: 5, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #10b981, #3b82f6)' } }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 800 }}>{degreeProgress.toFixed(1)}% Degree Completed</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 3, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><Replay fontSize="small" /> Required Retakes ({repeats.length})</Typography>
                        {repeats.length === 0 ? <Typography variant="caption" color="success.main" fontWeight={800}><CheckCircle fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />No failed courses</Typography> : (
                            <Stack spacing={1}>
                                {repeats.map((c, i) => <Box key={i} sx={{ p: 1, bgcolor: alpha('#ef4444', 0.1), borderRadius: 2 }}><Typography variant="caption" fontWeight={900} color="error.main" display="block">{c.code}</Typography></Box>)}
                            </Stack>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><AssignmentLate fontSize="small" /> Incompletes ({incompletes.length})</Typography>
                        {incompletes.length === 0 ? <Typography variant="caption" color="success.main" fontWeight={800}><CheckCircle fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />All courses graded</Typography> : (
                            <Stack spacing={1}>
                                {incompletes.map((c, i) => <Box key={i} sx={{ p: 1, bgcolor: alpha('#f59e0b', 0.1), borderRadius: 2 }}><Typography variant="caption" fontWeight={900} color="warning.main" display="block">{c.code}</Typography></Box>)}
                            </Stack>
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* Previously "My Courses" logic integrated here as current semester courses */}
            <Typography variant="subtitle1" fontWeight={900} gutterBottom>Current Enrollments</Typography>
            {myActiveCourses.length === 0 ? (
                <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4, mb: 4 }}>
                    <MenuBook sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.25, mb: 2 }} />
                    <Typography color="text.secondary" fontWeight={800}>No active enrollments.</Typography>
                </Card>
            ) : (
                <Card sx={{ ...cardSx, borderRadius: 4, mb: 4 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["#", "Course Name", "Code", "Credits", "Instructor", "Grade", "Status"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myActiveCourses.map((c, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell sx={tC}>{i + 1}</TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{c.code || '—'}</Typography></TableCell>
                                        <TableCell sx={tC}>{c.credits || 3}</TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" color="text.secondary">{c.instructor || "TBA"}</Typography></TableCell>
                                        <TableCell sx={tC}><Chip label={c.grade || "N/A"} size="small" sx={{ fontWeight: 900, color: getGradeColor(c.grade, gradeToPoints) }} /></TableCell>
                                        <TableCell sx={tC}><Chip label="ENROLLED" size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 22, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* We can place the full Transcript here later, but GradesTab is separate. */}
        </Box>
    );
}
