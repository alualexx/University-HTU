import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, useTheme, CircularProgress
} from '@mui/material';
import { CreditCard, CompareArrows, Download } from '@mui/icons-material';
import api from '../../../services/api';

export default function PaymentProcessingTab({ isDark, cardSx, gradients }) {
    const theme = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTxs = async () => {
            try {
                const res = await api.getTransactions();
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTxs();
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Payment Gateway & Ledger</Typography>
                <Typography variant="body2" color="text.secondary">Real-time processing logs for all financial transactions</Typography>
            </Box>

            <Card sx={{ ...cardSx, p: 3, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CreditCard sx={{ fontSize: 28, color: theme.palette.secondary.main, mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={800}>Recent Transactions</Typography>
                </Box>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Transaction ID</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Direction</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>No transactions recorded.</TableCell>
                                </TableRow>
                            ) : transactions.map(tx => (
                                <TableRow key={tx._id} hover>
                                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{tx._id}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{tx.type}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={tx.direction}
                                            icon={<CompareArrows sx={{ fontSize: 16 }} />}
                                            color={tx.direction === 'inbound' ? 'success' : 'error'}
                                            variant="outlined" sx={{ fontWeight: 800 }} />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 900 }}>${tx.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={tx.status.toUpperCase()}
                                            color={tx.status === 'completed' ? 'primary' : 'warning'}
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
