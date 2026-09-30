import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, CircularProgress, useTheme, alpha
} from '@mui/material';
import {
    School, CheckCircle, Warning, Refresh, AccountBalance
} from '@mui/icons-material';
import api from '../../../services/api';

export default function ScholarshipTab({ isDark, cardSx, gradients }) {
    const theme = useTheme();
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchScholarships = async () => {
        setLoading(true);
        try {
            const res = await api.getScholarships();
            setScholarships(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Scholarship & Aid Management</Typography>
                    <Typography variant="body2" color="text.secondary">Distribute student financial aid logic and endowments</Typography>
                </Box>
                <Button variant="contained" startIcon={<AccountBalance />} sx={{ borderRadius: 3, fontWeight: 900, background: gradients[2] }}>
                    Award New Scholarship
                </Button>
            </Box>

            <Card sx={{ ...cardSx, p: 3, borderRadius: 4 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Provider / Name</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Disbursement</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                            ) : scholarships.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 800 }}>
                                        <School sx={{ fontSize: 40, opacity: 0.2, mb: 1, display: 'block', mx: 'auto' }} />
                                        No scholarships recorded.
                                    </TableCell>
                                </TableRow>
                            ) : scholarships.map(sch => (
                                <TableRow key={sch._id} hover>
                                    <TableCell sx={{ fontWeight: 800 }}>{sch.providerName}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{sch.student?.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{sch.student?.studentId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 900, color: theme.palette.success.main }}>
                                        ${sch.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{sch.disbursementType.replace('_', ' ')}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={sch.status.toUpperCase()}
                                            color={sch.status === 'disbursed' ? 'success' : sch.status === 'approved' ? 'info' : 'warning'}
                                            sx={{ fontWeight: 900 }} />
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
