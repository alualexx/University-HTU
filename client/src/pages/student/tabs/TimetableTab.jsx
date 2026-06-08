import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, alpha, Tabs, Tab, Button, Grid, Stack } from '@mui/material';
import { EventNote, Download, CalendarMonth, Assignment, LocationOn, MeetingRoom } from '@mui/icons-material';
import jsPDF from 'jspdf';

const tH = { fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 2 };
const tC = { py: 2 };

export default function TimetableTab({ mySchedules, CURRENT_SEMESTER, isDark, cardSx }) {
    const [subTab, setSubTab] = useState(0);
    tH.borderBottom = `2px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`;
    tC.borderBottom = `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("My Timetable", 20, 20);
        doc.setFontSize(12);
        mySchedules.forEach((s, i) => {
            doc.text(`${s.day} ${s.startTime}-${s.endTime}: ${s.courseName} (Room ${s.room})`, 20, 30 + (i * 10));
        });
        doc.save("Timetable.pdf");
    };

    const exams = mySchedules.map((s, i) => {
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() + 30 + i);
        return {
            ...s,
            examDate: mockDate.toLocaleDateString(),
            examTime: '09:00 AM - 12:00 PM',
            examRoom: s.room || 'Main Hall',
            seatNo: `S-${Math.floor(Math.random() * 100) + 1}`
        };
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Timetable & Exams</Typography>
                <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadPDF} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Download PDF</Button>
            </Box>

            <Tabs value={subTab} onChange={(e, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none', borderRadius: '12px 12px 0 0' } }}>
                <Tab icon={<CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />} iconPosition="start" label="Weekly Grid" />
                <Tab icon={<Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />} iconPosition="start" label="Exam Schedule" />
            </Tabs>

            {mySchedules.length === 0 ? (
                <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <EventNote sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.25, mb: 2 }} />
                    <Typography color="text.secondary" fontWeight={800}>No schedules found.</Typography>
                </Card>
            ) : (
                <Card sx={{ ...cardSx, borderRadius: 4, p: 3 }}>
                    {subTab === 0 ? (
                        <Grid container spacing={2}>
                            {days.map(day => (
                                <Grid item xs={12} sm={6} md={2.4} key={day}>
                                    <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2, textAlign: 'center', p: 1, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', borderRadius: 2 }}>{day.toUpperCase()}</Typography>
                                    <Stack spacing={2}>
                                        {mySchedules.filter(s => s.day === day).map((s, i) => (
                                            <Card key={i} sx={{ p: 2, borderRadius: 3, border: `1px solid ${alpha('#6366f1', 0.2)}`, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                                                <Typography variant="caption" fontWeight={900} color="primary.main" display="block">{s.startTime} - {s.endTime}</Typography>
                                                <Typography variant="body2" fontWeight={800} sx={{ my: 0.5 }}>{s.courseName}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocationOn sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">{s.room}</Typography>
                                                </Box>
                                            </Card>
                                        ))}
                                        {mySchedules.filter(s => s.day === day).length === 0 && (
                                            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ py: 2 }}>No classes</Typography>
                                        )}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead><TableRow>{["Course", "Date", "Duration", "Location", "Seat"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                                <TableBody>
                                    {exams.map((e, i) => (
                                        <TableRow key={i} hover>
                                            <TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{e.courseName}</Typography></TableCell>
                                            <TableCell sx={tC}><Chip label={e.examDate} size="small" color="primary" sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell sx={tC}><Typography variant="body2" color="text.secondary">{e.examTime}</Typography></TableCell>
                                            <TableCell sx={tC}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <MeetingRoom color="action" fontSize="small" />
                                                    <Typography variant="body2" fontWeight={800}>{e.examRoom}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" fontWeight={900} color="warning.main">{e.seatNo}</Typography></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            )}
        </Box>
    );
}
