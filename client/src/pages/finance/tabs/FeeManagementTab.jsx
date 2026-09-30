import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, CircularProgress, useTheme, alpha
} from '@mui/material';
import {
    Search, AttachMoney, Receipt, CheckCircle, Warning, Refresh, Add
} from '@mui/icons-material';
import api from '../../../services/api';

export default function FeeManagementTab({ isDark, cardSx, gradients }) {
    const theme = useTheme();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.getInvoices();
            setInvoices(res.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv => {
        if (!search) return true;
        const s = search.toLowerCase();
        return inv.title?.toLowerCase().includes(s) || inv.student?.name?.toLowerCase().includes(s);
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Fee & Invoice Management</Typography>
                    <Typography variant="body2" color="text.secondary">Review outstanding tuition, housing, and library penalties</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 3, fontWeight: 900, background: gradients[0] }}>
                    Generate Manual Invoice
                </Button>
            </Box>

            <Card sx={{ ...cardSx, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search student or invoice title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
                        sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0.0.0.0.02)', borderRadius: 2 }}
                    />
                    <IconButton onClick={fetchInvoices} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}><Refresh /></IconButton>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Invoice Detail</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Controls</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : filteredInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Receipt sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No invoices match your query.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredInvoices.map((inv) => (
                                <TableRow key={inv._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color="primary">{inv.title}</Typography>
                                        <Typography variant="caption" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>{inv.type}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{inv.student?.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{inv.student?.studentId}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={900}>${inv.amount.toLocaleString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color={new Date(inv.dueDate) < new Date() && inv.status !== 'paid' ? 'error' : 'text.primary'}>
                                            {new Date(inv.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={inv.status.toUpperCase()}
                                            icon={inv.status === 'paid' ? <CheckCircle /> : inv.status === 'overdue' ? <Warning /> : <AttachMoney />}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: inv.status === 'paid' ? alpha('#10b981', 0.1) : inv.status === 'overdue' ? alpha('#ef4444', 0.1) : alpha('#f59e0b', 0.1),
                                                color: inv.status === 'paid' ? '#10b981' : inv.status === 'overdue' ? '#ef4444' : '#f59e0b'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 800 }}>View Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
