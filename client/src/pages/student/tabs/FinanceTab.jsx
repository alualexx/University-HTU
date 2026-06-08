import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, IconButton, List, ListItem, ListItemText, Tooltip, alpha, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Receipt, Download, AccountBalanceWallet, RequestQuote, Payments, School, Warning } from '@mui/icons-material';
import { notificationsAPI } from '../../../services/api';

export default function FinanceTab({ myActiveCourses, tuitionPayments, user, generateSemesterSlipPDF, generateReceiptPDF, isDark, cardSx, TUITION_PER_CREDIT = 150 }) {
    const [deferOpen, setDeferOpen] = useState(false);
    const [deferReason, setDeferReason] = useState("");

    const totalCredits = myActiveCourses.reduce((sum, c) => sum + (c.credits || 3), 0);
    const totalTuition = totalCredits * TUITION_PER_CREDIT;
    const totalPaid = tuitionPayments.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0);
    const balance = totalTuition - totalPaid;

    const tH = { fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 2, borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` };
    const tC = { py: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` };

    const handleDefermentSubmit = async () => {
        try {
            await notificationsAPI.create({
                title: "Fee Deferment Request",
                message: `Deferment requested: ${deferReason}`,
                type: 'finance'
            });
            alert("Deferment request submitted.");
            setDeferOpen(false);
            setDeferReason("");
        } catch (e) {
            alert("Error submitting request.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 4 }}>Finance & Fees</Typography>

            {balance > 0 && (
                <Card sx={{ bgcolor: alpha('#f59e0b', 0.1), border: `1px solid ${alpha('#f59e0b', 0.3)}`, borderRadius: 4, mb: 4, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Warning color="warning" />
                        <Box>
                            <Typography variant="subtitle2" fontWeight={900} color="warning.main">Outstanding Balance Alert</Typography>
                            <Typography variant="body2" color="warning.main">You have an outstanding balance of ${balance.toLocaleString()}. Please clear your dues or apply for deferment to avoid registration holds.</Typography>
                        </Box>
                        <Button variant="contained" color="warning" size="small" onClick={() => setDeferOpen(true)} sx={{ ml: 'auto', fontWeight: 800, textTransform: 'none', borderRadius: 2 }}>Apply for Deferment</Button>
                    </Box>
                </Card>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, borderRadius: 4, mb: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <RequestQuote color="primary" />
                                <Typography variant="h6" fontWeight={900}>Fee Structure Breakdown</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={tH}>Description</TableCell>
                                            <TableCell sx={tH}>Credits/Units</TableCell>
                                            <TableCell sx={tH} align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {myActiveCourses.map((c, i) => (
                                            <TableRow key={i}>
                                                <TableCell sx={tC}><Typography variant="body2" fontWeight={800}>{c.name}</Typography></TableCell>
                                                <TableCell sx={tC}>{c.credits || 3}</TableCell>
                                                <TableCell sx={tC} align="right">${((c.credits || 3) * TUITION_PER_CREDIT).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                        {myActiveCourses.length > 0 && (
                                            <TableRow>
                                                <TableCell sx={{ py: 2, borderBottom: 'none' }}><Typography variant="subtitle2" fontWeight={900}>Total Tuition Fees</Typography></TableCell>
                                                <TableCell sx={{ py: 2, borderBottom: 'none' }}><Typography variant="subtitle2" fontWeight={900}>{totalCredits}</Typography></TableCell>
                                                <TableCell sx={{ py: 2, borderBottom: 'none' }} align="right"><Typography variant="subtitle2" fontWeight={900} color="primary.main">${totalTuition.toLocaleString()}</Typography></TableCell>
                                            </TableRow>
                                        )}
                                        {myActiveCourses.length === 0 && (
                                            <TableRow><TableCell colSpan={3} sx={tC}>No courses enrolled.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Card sx={{ ...cardSx, borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Payments color="primary" />
                                <Typography variant="h6" fontWeight={900}>Payment History</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={tH}>Reference / Method</TableCell>
                                            <TableCell sx={tH}>Date</TableCell>
                                            <TableCell sx={tH}>Status</TableCell>
                                            <TableCell sx={tH} align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tuitionPayments.map((p, i) => (
                                            <TableRow key={i}>
                                                <TableCell sx={tC}><Typography variant="body2" fontWeight={800} fontFamily="monospace">{p.method?.toUpperCase() || 'MANUAL'} / {p._id?.slice(-6).toUpperCase() || '—'}</Typography></TableCell>
                                                <TableCell sx={tC}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</TableCell>
                                                <TableCell sx={tC}>
                                                    <Chip label={p.status?.toUpperCase() || 'PENDING'} size="small" color={p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'error' : 'warning'} sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
                                                </TableCell>
                                                <TableCell sx={tC} align="right"><Typography variant="body2" fontWeight={900}>${(p.amount || 0).toLocaleString()}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                        {tuitionPayments.length === 0 && (
                                            <TableRow><TableCell colSpan={4} sx={tC} align="center">No payments found.</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, borderRadius: 4, mb: 4, textAlign: 'center', p: 4 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <AccountBalanceWallet fontSize="large" />
                        </Box>
                        <Typography variant="h3" fontWeight={900} color={balance > 0 ? "error.main" : "success.main"} sx={{ mb: 1 }}>${balance.toLocaleString()}</Typography>
                        <Typography variant="subtitle2" fontWeight={900} color="text.secondary">Outstanding Balance</Typography>
                    </Card>

                    <Card sx={{ ...cardSx, borderRadius: 4, mb: 4, p: 3.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <School color="primary" />
                            <Typography variant="h6" fontWeight={900}>Scholarships</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }}>
                            <Typography variant="body2" color="text.secondary">No active scholarships or financial aid packages applied to this semester.</Typography>
                        </Box>
                    </Card>

                    <Card sx={{ ...cardSx, borderRadius: 4, p: 3.5 }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>My Documents</Typography>

                        {myActiveCourses.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>SEMESTER SLIP</Typography>
                                <Button fullWidth variant="outlined" startIcon={<Download />} onClick={() => generateSemesterSlipPDF(user, myActiveCourses)} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>
                                    Download Slip (PDF)
                                </Button>
                            </Box>
                        )}

                        {tuitionPayments.filter(p => p.status === "approved").length > 0 && (
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>RECEIPTS</Typography>
                                <List disablePadding>
                                    {tuitionPayments.filter(p => p.status === "approved").map((p, i) => (
                                        <ListItem key={i} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', mb: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', pr: 1 }}>
                                            <ListItemText primary={<Typography variant="subtitle2" fontWeight={800}>${(p.amount || 0).toLocaleString()}</Typography>} secondary="Paid" />
                                            <Tooltip title="Download PDF">
                                                <IconButton color="success" onClick={() => generateReceiptPDF(user, p)}>
                                                    <Download fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {myActiveCourses.length === 0 && tuitionPayments.filter(p => p.status === "approved").length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Receipt sx={{ fontSize: 36, color: 'text.secondary', opacity: 0.2, mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">No documents yet.</Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* Deferment Dialog */}
            <Dialog open={deferOpen} onClose={() => setDeferOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Fee Deferment Application</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Submit a request to defer your fee payment deadline.</Typography>
                    <TextField fullWidth multiline rows={4} label="Reason for deferment" value={deferReason} onChange={e => setDeferReason(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setDeferOpen(false)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDefermentSubmit} disabled={!deferReason} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Submit Request</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
