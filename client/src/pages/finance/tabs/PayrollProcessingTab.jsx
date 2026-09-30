import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, IconButton, CircularProgress, useTheme, Grid
} from '@mui/material';
import { LocalAtm, Refresh, PlayArrow, CheckCircle } from '@mui/icons-material';
import api from '../../../services/api';

export default function PayrollProcessingTab({ isDark, cardSx, gradients }) {
    const theme = useTheme();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await api.getPayroll();
            setPayrolls(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayroll();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Payroll Processing System</Typography>
                    <Typography variant="body2" color="text.secondary">Automated salary disbursement and ledger synchronization</Typography>
                </Box>
                <Button variant="contained" startIcon={<PlayArrow />} sx={{ borderRadius: 3, fontWeight: 900, background: gradients[3] }}>
                    Run Global Payroll
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card sx={{ ...cardSx, p: 3, borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalAtm sx={{ fontSize: 28, color: '#10b981', mr: 1.5 }} />
                                <Typography variant="h6" fontWeight={800}>Recent Payroll Disbursals</Typography>
                            </Box>
                            <IconButton onClick={fetchPayroll}><Refresh /></IconButton>
                        </Box>

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Period</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Staff Member</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Base Salary</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Net Pay</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                                    ) : payrolls.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 800 }}>No payroll batches processed yet.</TableCell>
                                        </TableRow>
                                    ) : payrolls.map(pr => (
                                        <TableRow key={pr._id} hover>
                                            <TableCell sx={{ fontWeight: 800 }}>{pr.month}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>{pr.employee?.name}</Typography>
                                                <Typography variant="caption" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>{pr.employee?.role}</Typography>
                                            </TableCell>
                                            <TableCell>${pr.baseSalary?.toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 900, color: 'text.primary' }}>${pr.netPay?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={pr.status.toUpperCase()}
                                                    icon={<CheckCircle />}
                                                    color={pr.status === 'processed' ? 'success' : 'default'}
                                                    sx={{ fontWeight: 900 }} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
