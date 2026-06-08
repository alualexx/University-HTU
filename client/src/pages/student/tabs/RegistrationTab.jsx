import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Button, IconButton, Divider, Checkbox, Tooltip, List, ListItem, ListItemText, alpha, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { ShoppingCart, Book, Remove, Download, Receipt, EventNote, SettingsBackupRestore } from '@mui/icons-material';
import { enrollmentsAPI } from '../../../services/api';

const tH = { fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 2 };
const tC = { py: 2 };

export default function RegistrationTab({
    user, systemConfig, isMyWindow, safeUserYear, safeTargetYear, safeTargetSemester,
    filteredAvailableCourses, alreadyEnrolledIds, cart, cartCredits, cartTotal, toggleCart,
    setPaymentModalOpen, generateSemesterSlipPDF, generateReceiptPDF, myActiveCourses, tuitionPayments,
    isDark, cardSx, theme, gradients, TUITION_PER_CREDIT, academicEvents
}) {
    tH.borderBottom = `2px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`;
    tC.borderBottom = `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`;

    const [isDropping, setIsDropping] = useState(false);

    const handleDrop = async (courseId) => {
        if (!confirm("Are you sure you want to drop this course?")) return;
        setIsDropping(true);
        try {
            await enrollmentsAPI.drop(courseId, user.id);
            alert("Course dropped. Please refresh the portal.");
        } catch (e) {
            alert("Error dropping course.");
        }
        setIsDropping(false);
    };

    const registrationEvents = academicEvents?.filter(e => e.type === 'registration' || e.title?.toLowerCase().includes('registration')) || [{ title: 'Late Registration Deadline', date: new Date(Date.now() + 14 * 86400000) }];

    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card sx={{
                        ...cardSx, p: 3, borderRadius: 4, mb: 1,
                        background: isMyWindow
                            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                        border: `1px solid ${isMyWindow ? alpha('#10b981', 0.2) : alpha('#ef4444', 0.2)}`
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 12, height: 12, borderRadius: '50%',
                                    bgcolor: isMyWindow ? '#10b981' : '#ef4444',
                                    boxShadow: `0 0 10px ${isMyWindow ? '#10b981' : '#ef4444'}`
                                }} />
                                <Box>
                                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1 }}>REGISTRATION INTELLIGENCE</Typography>
                                    <Typography variant="h6" fontWeight={1000}>
                                        {systemConfig.registrationLock
                                            ? "Registration is Currently Closed"
                                            : !isMyWindow
                                                ? `Window Open for Year ${safeTargetYear} Cohort`
                                                : `Welcome! Window Open for Year ${safeUserYear} - Semester ${safeTargetSemester}`}
                                    </Typography>
                                </Box>
                            </Box>
                            {isMyWindow && (
                                <Chip
                                    label={`ACTIVE: Y${safeUserYear} S${safeTargetSemester}`}
                                    color="success"
                                    sx={{ fontWeight: 900, borderRadius: 2 }}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, borderRadius: 4 }}>
                        {(!isMyWindow || systemConfig.registrationLock) ? (
                            <Box sx={{ p: 8, textAlign: 'center' }}>
                                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                                <Typography variant="h5" fontWeight={1000} color="text.secondary" gutterBottom>Registration Locked</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                                    {systemConfig.registrationLock
                                        ? "The registrar has paused all enrollment activities. Please check the news feed for updates."
                                        : `Your academic cohort (Year ${safeUserYear}) is not scheduled for this registration window. Currently serving Year ${safeTargetYear}.`}
                                </Typography>
                            </Box>
                        ) : filteredAvailableCourses.length === 0 ? (
                            <Box sx={{ p: 8, textAlign: 'center' }}>
                                <Book sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                                <Typography variant="h5" fontWeight={1000} color="text.secondary" gutterBottom>No Modules Found</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    There are no courses currently prepared for Year {safeUserYear} Semester {safeTargetSemester}.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer><Table>
                                <TableHead><TableRow>{["", "Course", "Code", "Credits", "Prereqs", "Tuition", "Instructor", "Status"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                                <TableBody>{filteredAvailableCourses.map((c, i) => {
                                    const enrolled = alreadyEnrolledIds.includes(c.id);
                                    const inCart = cart.find(x => x.id === c.id);
                                    const fee = Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT;
                                    const isFull = (c.enrolledCount || 0) >= (c.capacity || 30);
                                    return (<TableRow key={i} sx={{ bgcolor: inCart ? alpha(theme.palette.primary.main, 0.04) : 'transparent', opacity: isFull && !enrolled ? 0.7 : 1 }} hover>
                                        <TableCell sx={tC} padding="checkbox">{!enrolled && !isFull && <Checkbox checked={!!inCart} onChange={() => toggleCart(c)} color="primary" />}</TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{c.code}</Typography></TableCell>
                                        <TableCell sx={tC}>{c.credits || 3}</TableCell>
                                        <TableCell sx={tC}>
                                            {c.prerequisites?.length > 0 ? c.prerequisites.map((p, pi) => <Chip key={pi} label={p.courseCode || p} size="small" sx={{ fontSize: '0.65rem', mr: 0.5 }} />) : <Typography variant="caption" color="text.secondary">None</Typography>}
                                        </TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" fontWeight={800} color="success.main">${fee.toLocaleString()}</Typography></TableCell>
                                        <TableCell sx={tC}><Typography variant="body2" color="text.secondary">{c.instructor || "TBA"}</Typography></TableCell>
                                        <TableCell sx={tC}>{enrolled ? <Chip label="Registered" size="small" color="success" sx={{ fontWeight: 900 }} /> : isFull ? <Button size="small" variant="outlined" color="warning" sx={{ textTransform: 'none', fontWeight: 800 }}>Waitlist</Button> : inCart ? <Chip label="In Cart" size="small" color="primary" sx={{ fontWeight: 900 }} /> : <Chip label="Available" size="small" variant="outlined" sx={{ fontWeight: 800 }} />}</TableCell>
                                    </TableRow>);
                                })}</TableBody>
                            </Table></TableContainer>
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, borderRadius: 4, p: 3.5, mb: 3 }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCart fontSize="small" /> Cart ({cart.length})</Typography>
                        {cart.length === 0 ? <Typography variant="body2" color="text.secondary">Select courses to add to cart.</Typography> : (
                            <Stack spacing={1.5}>
                                {cart.map((c, i) => {
                                    const fee = Number(c.tuitionFee) || (Number(c.credits) || 3) * TUITION_PER_CREDIT;
                                    return (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', p: 1.5, borderRadius: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={900}>{c.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {c.credits || 3} Cr · ${fee.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <IconButton size="small" onClick={() => toggleCart(c)} color="error">
                                                <Remove fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    );
                                })}
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle2" fontWeight={900}>Total</Typography><Typography variant="subtitle2" fontWeight={900} color="primary.main">{cartCredits} Cr · ${cartTotal.toLocaleString()}</Typography></Box>
                                <Button
                                    fullWidth variant="contained"
                                    onClick={() => setPaymentModalOpen(true)}
                                    disabled={systemConfig.registrationLock || systemConfig.globalMaintenance}
                                    sx={{
                                        borderRadius: 3, fontWeight: 900, py: 1.2, textTransform: 'none',
                                        background: (systemConfig.registrationLock || systemConfig.globalMaintenance) ? 'rgba(0,0,0,0.1)' : gradients[0]
                                    }}
                                >
                                    {systemConfig.globalMaintenance ? "Locked for Maintenance" : systemConfig.registrationLock ? "Registration Window Closed" : "Proceed to Checkout"}
                                </Button>
                            </Stack>
                        )}
                    </Card>

                    <Card sx={{ ...cardSx, borderRadius: 4 }}>
                        <CardContent sx={{ p: 3.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <EventNote color="primary" />
                                <Typography variant="h6" fontWeight={900}>Deadlines</Typography>
                            </Box>
                            <Stack spacing={2}>
                                {registrationEvents.map((e, i) => (
                                    <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }}>
                                        <Typography variant="subtitle2" fontWeight={900}>{e.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{e.date?.toDate ? e.date.toDate().toLocaleDateString() : new Date(e.date).toLocaleDateString()}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Registration History / Valid Enrollments */}
            {myActiveCourses.length > 0 && (
                <Grid container spacing={4} sx={{ mt: 0 }}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...cardSx, borderRadius: 4 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Current Semester Enrollments & History</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead><TableRow>{["Course", "Code", "Credits", "Status", "Action"].map(h => <TableCell key={h} sx={tH}>{h}</TableCell>)}</TableRow></TableHead>
                                        <TableBody>
                                            {myActiveCourses.map((c, i) => (
                                                <TableRow key={i} hover>
                                                    <TableCell sx={tC}><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                                                    <TableCell sx={tC}><Typography variant="body2" fontFamily="monospace" color="primary.main" fontWeight={800}>{c.code}</Typography></TableCell>
                                                    <TableCell sx={tC}>{c.credits || 3}</TableCell>
                                                    <TableCell sx={tC}><Chip label="Enrolled" size="small" color="success" sx={{ fontWeight: 900 }} /></TableCell>
                                                    <TableCell sx={tC}>
                                                        <Button size="small" color="error" variant="outlined" onClick={() => handleDrop(c.id)} disabled={isDropping} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}>Drop</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
