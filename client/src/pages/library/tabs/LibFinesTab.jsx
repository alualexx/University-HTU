import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Select, FormControl, InputLabel, alpha, CircularProgress, useTheme, Avatar
} from '@mui/material';
import {
    ReceiptLong, Search, Payment, Gavel, CheckCircle, Warning, Refresh
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibFinesTab({ glassStyle }) {
    const theme = useTheme();
    const [data, setData] = useState({ members: [], records: [] });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Dialog State
    const [openProcess, setOpenProcess] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [actionType, setActionType] = useState('pay'); // 'pay' or 'waive'

    const fetchFines = async () => {
        setLoading(true);
        try {
            const res = await libraryAPI.getFines();
            setData(res.data);
        } catch (error) {
            console.error("Error fetching fines data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    const handleProcessFine = async () => {
        try {
            await libraryAPI.processFine(selectedRecord._id, { action: actionType });
            setOpenProcess(false);
            fetchFines();
        } catch (error) {
            console.error(`Error processing fine (${actionType}):`, error);
        }
    };

    // Filter logic
    const filteredRecords = data.records.filter(r => {
        if (!search) return true;
        const s = search.toLowerCase();
        return r.member?.name?.toLowerCase().includes(s) || r.member?.studentId?.toLowerCase().includes(s);
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Fines & Outstanding Fees</Typography>
                    <Typography variant="body2" color="text.secondary">Review overdue fees, process cash payments, and enforce system blocks</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Warning color="error" />
                    <Box>
                        <Typography variant="h6" fontWeight={900} color="error">${data.records.reduce((acc, r) => acc + (r.fine || 0), 0)}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Total Uncollected</Typography>
                    </Box>
                </Box>
            </Box>

            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search by member name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    />
                    <IconButton onClick={fetchFines} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}><Refresh /></IconButton>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Member Info</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Linked Book</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Original Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Current Status</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Amount</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : filteredRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CheckCircle sx={{ fontSize: 40, opacity: 0.2, mb: 1, color: 'success.main' }} />
                                        <Typography color="text.secondary" fontWeight={800}>No outstanding fines currently.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredRecords.map((record) => (
                                <TableRow key={record._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color="primary">{record.member?.name || 'Unknown'}</Typography>
                                        <Typography variant="caption" color="text.secondary">ID: {record.member?.studentId || record.member?.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{record.book?.title || 'Unknown Book'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{new Date(record.dueDate).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={record.status.toUpperCase()}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: record.status === 'damaged' ? alpha('#ef4444', 0.1) : alpha('#f59e0b', 0.1),
                                                color: record.status === 'damaged' ? '#ef4444' : '#f59e0b'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body1" fontWeight={900} color="error">${record.fine}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => { setSelectedRecord(record); setOpenProcess(true); }}
                                            sx={{ borderRadius: 2, fontWeight: 800, py: 0.5 }}
                                        >
                                            Process
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Process Fine Dialog */}
            <Dialog open={openProcess} onClose={() => setOpenProcess(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, ...glassStyle } }}>
                <DialogTitle fontWeight={900}>Process Fine Payment</DialogTitle>
                <DialogContent dividers>
                    {selectedRecord && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="caption" color="text.secondary">Clearing fine for:</Typography>
                                <Typography variant="body1" fontWeight={800}>{selectedRecord.member?.name} — ${selectedRecord.fine}</Typography>
                                <Typography variant="body2" color="text.secondary">{selectedRecord.book?.title}</Typography>
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>Action Type</InputLabel>
                                <Select value={actionType} label="Action Type" onChange={(e) => setActionType(e.target.value)}>
                                    <MenuItem value="pay"><Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Payment fontSize="small" /> Accept Cash Payment</Box></MenuItem>
                                    <MenuItem value="waive"><Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Gavel fontSize="small" /> Grant Official Waiver</Box></MenuItem>
                                </Select>
                            </FormControl>

                            {actionType === 'waive' && (
                                <Box sx={{ p: 2, bgcolor: alpha('#f59e0b', 0.1), borderRadius: 2, border: '1px solid #f59e0b' }}>
                                    <Typography variant="body2" color="warning.main" fontWeight={800}>
                                        Waiving a fine bypassing fee collection. This action is logged to your account.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenProcess(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" color={actionType === 'waive' ? 'warning' : 'primary'} onClick={handleProcessFine} sx={{ borderRadius: 2, fontWeight: 900 }}>
                        {actionType === 'waive' ? 'Confirm Waiver' : 'Confirm Payment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
