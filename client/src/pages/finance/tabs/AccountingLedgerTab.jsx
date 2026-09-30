import React, { useState } from 'react';
import { Box, Typography, Card, Grid, useTheme, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { AccountBalance, Print, FilterList } from '@mui/icons-material';

export default function AccountingLedgerTab({ isDark, cardSx }) {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>General Accounting Ledger</Typography>
                    <Typography variant="body2" color="text.secondary">Master record of all credits, debits, and institutional asset flows.</Typography>
                </Box>
                <Box>
                    <Button variant="outlined" startIcon={<Print />} sx={{ mr: 2, borderRadius: 2 }}>Export CSV</Button>
                    <Button variant="contained" startIcon={<FilterList />} sx={{ borderRadius: 2 }}>Advanced Filter</Button>
                </Box>
            </Box>

            <Card sx={{ ...cardSx, borderRadius: 4 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>GL Code</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Account Name</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>YTD Balance</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <TableCell sx={{ fontFamily: 'monospace' }}>4000-100</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Undergraduate Tuition Revenue</TableCell>
                                <TableCell><Chip size="small" label="Revenue" color="success" variant="outlined" /></TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'success.main' }}>$14,500,200.00</TableCell>
                                <TableCell><Chip size="small" label="Reconciled" color="primary" /></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell sx={{ fontFamily: 'monospace' }}>5000-200</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Faculty Salaries</TableCell>
                                <TableCell><Chip size="small" label="Expense" color="error" variant="outlined" /></TableCell>
                                <TableCell sx={{ fontWeight: 900, color: 'error.main' }}>($4,120,000.00)</TableCell>
                                <TableCell><Chip size="small" label="Pending Cycle" color="warning" /></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell sx={{ fontFamily: 'monospace' }}>1000-150</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Operating Cash Reserve</TableCell>
                                <TableCell><Chip size="small" label="Asset" color="info" variant="outlined" /></TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>$8,250,000.00</TableCell>
                                <TableCell><Chip size="small" label="Reconciled" color="primary" /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
