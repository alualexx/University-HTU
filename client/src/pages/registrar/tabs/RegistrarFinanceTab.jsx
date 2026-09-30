import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, useTheme, Grid, IconButton, Tabs, Tab, Avatar, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    CreditCard, CheckCircle, Cancel, Search, Download, Visibility,
    AccountBalance, Receipt, MoneyOff, Person, Warning
} from "@mui/icons-material";

export default function RegistrarFinanceTab({
    payments = [],
    students = [],
    onApprovePayment,
    onRejectPayment,
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const pending = payments.filter(p => p.status === 'pending_approval' || p.status === 'pending');
    const approved = payments.filter(p => p.status === 'approved');
    const totalRevenue = approved.reduce((sum, p) => sum + (p.amount || 0), 0);

    const filtered = payments.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !q || (p.studentName || '').toLowerCase().includes(q) || (p.courseName || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Finance & Fee Management</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>VALIDATE PAYMENTS, ISSUE CLEARANCES, AND MONITOR REVENUE COLLECTION ACROSS ALL SEMESTERS</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Pending Approvals', val: pending.length, icon: <Warning />, color: '#f59e0b' },
                    { label: 'Approved Payments', val: approved.length, icon: <CheckCircle />, color: '#10b981' },
                    { label: 'Total Revenue', val: `$${totalRevenue.toLocaleString()}`, icon: <AccountBalance />, color: '#6366f1' },
                    { label: 'Outstanding Balances', val: students.filter(s => !s.feesCleared).length, icon: <MoneyOff />, color: '#ef4444' },
                ].map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, border: `1px solid ${alpha(s.color, 0.1)}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(s.color, 0.1), color: s.color, borderRadius: 2.5 }}>{s.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={1000}>{s.label.toUpperCase()}</Typography>
                                    <Typography variant="h5" fontWeight={1000}>{s.val}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
                <Tab icon={<Receipt sx={{ fontSize: 20 }} />} iconPosition="start" label={`Pending (${pending.length})`} />
                <Tab icon={<CheckCircle sx={{ fontSize: 20 }} />} iconPosition="start" label="Payment History" />
                <Tab icon={<MoneyOff sx={{ fontSize: 20 }} />} iconPosition="start" label="Refund Requests" />
            </Tabs>

            {(subTab === 0 || subTab === 1) && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
                        <TextField size="small" placeholder="Search student or course..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <TextField select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="pending_approval">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                        <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 550 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {["Student", "Course", "Amount", "Method", "Date", "Status", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ bgcolor: 'transparent', fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(subTab === 0 ? pending : filtered).map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 30, height: 30, bgcolor: alpha(theme.palette.primary.main, 0.1), fontSize: '0.7rem', fontWeight: 900 }}>{(p.studentName || '?')[0]}</Avatar>
                                                <Box><Typography variant="body2" fontWeight={900}>{p.studentName}</Typography><Typography variant="caption" color="text.secondary">{p.studentId}</Typography></Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={800}>{p.courseName}</Typography></TableCell>
                                        <TableCell><Typography fontWeight={1000}>${(p.amount || 0).toLocaleString()}</Typography></TableCell>
                                        <TableCell><Chip label={(p.method || 'online').toUpperCase()} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem' }} /></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800}>{p.timestamp?.toDate?.()?.toLocaleDateString() || '—'}</Typography></TableCell>
                                        <TableCell>
                                            <Chip label={(p.status || 'pending').toUpperCase()} size="small" color={p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'error' : 'warning'} sx={{ fontWeight: 1000, fontSize: '0.6rem' }} />
                                        </TableCell>
                                        <TableCell>
                                            {(p.status === 'pending_approval' || p.status === 'pending') && (
                                                <Stack direction="row" spacing={0.5}>
                                                    <Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => onApprovePayment?.(p)}><CheckCircle fontSize="small" /></IconButton></Tooltip>
                                                    <Tooltip title="Reject"><IconButton size="small" color="error" onClick={() => onRejectPayment?.(p)}><Cancel fontSize="small" /></IconButton></Tooltip>
                                                </Stack>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(subTab === 0 ? pending : filtered).length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <CreditCard sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No payments found</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 2 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, textAlign: 'center', py: 10 }}>
                    <MoneyOff sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" fontWeight={900}>Refund Processing Center</Typography>
                    <Typography variant="body2" color="text.secondary">Process refund requests for dropped courses and overpayments.</Typography>
                </Card>
            )}
        </Box>
    );
}
