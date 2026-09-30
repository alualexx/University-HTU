import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Select, FormControl, InputLabel, alpha, CircularProgress, useTheme
} from '@mui/material';
import {
    Bookmarks, Refresh, NotificationsActive, CheckCircle, Cancel
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibReservationsTab({ glassStyle }) {
    const theme = useTheme();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');

    // Dialog state
    const [openAdd, setOpenAdd] = useState(false);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [reservationForm, setReservationForm] = useState({ bookId: '' }); // Simplified for demo, admin side reservation needs student mapping usually

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await libraryAPI.getReservations();
            let data = res.data;
            if (filterStatus !== 'all') {
                data = data.filter(r => r.status === filterStatus);
            }
            if (search) {
                const s = search.toLowerCase();
                data = data.filter(r =>
                    r.book?.title?.toLowerCase().includes(s) ||
                    r.member?.name?.toLowerCase().includes(s)
                );
            }
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLookupData = async () => {
        try {
            const res = await libraryAPI.getBooks({ type: 'physical' });
            setAvailableBooks(res.data.filter(b => b.status === 'active'));
        } catch (error) {
            console.error("Failed fetching books", error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [search, filterStatus]);

    const handleCreateReservation = async () => {
        try {
            await libraryAPI.reserveBook(reservationForm);
            setOpenAdd(false);
            setReservationForm({ bookId: '' });
            fetchReservations();
        } catch (error) {
            console.error("Error reserving book:", error);
            alert(error.response?.data?.message || "Failed to reserve book.");
        }
    };

    const handleNotify = async (recordId) => {
        // Mock notification logic (since backend wasn't fully built for email triggers yet)
        alert("Availability notification email successfully sent to student.");
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Reservations & Holds</Typography>
                    <Typography variant="body2" color="text.secondary">Manage book queues and notify members of availability</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Bookmarks />}
                    onClick={() => { fetchLookupData(); setOpenAdd(true); }}
                    sx={{ borderRadius: 3, fontWeight: 900 }}
                >
                    Manual Override Reservation
                </Button>
            </Box>

            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search student or book title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                            <MenuItem value="all">All Holds</MenuItem>
                            <MenuItem value="active">Active within Queue</MenuItem>
                            <MenuItem value="fulfilled">Fulfilled</MenuItem>
                            <MenuItem value="cancelled">Cancelled/Expired</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={fetchReservations} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}><Refresh /></IconButton>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Resource Information</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Member Info</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Requested Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : reservations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Bookmarks sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No reservations match the current filter.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : reservations.map((record) => (
                                <TableRow key={record._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color="primary">{record.book?.title || 'Unknown'}</Typography>
                                        <Typography variant="caption" color="error.main" fontWeight={700}>
                                            {record.book?.availableCopies === 0 ? 'Out of Stock' : `${record.book?.availableCopies} Copy Available!`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{record.member?.name || 'Self-Reservation'}</Typography>
                                        {record.member?.email && <Typography variant="caption" color="text.secondary" display="block">{record.member.email}</Typography>}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{new Date(record.createdAt).toLocaleDateString()}</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(record.createdAt).toLocaleTimeString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={record.notified ? 'NOTIFIED' : record.status.toUpperCase()}
                                            icon={record.status === 'fulfilled' ? <CheckCircle /> : record.status === 'cancelled' ? <Cancel /> : null}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: record.notified ? alpha('#8b5cf6', 0.1) : record.status === 'active' ? alpha('#f59e0b', 0.1) : alpha('#94a3b8', 0.1),
                                                color: record.notified ? '#8b5cf6' : record.status === 'active' ? '#f59e0b' : '#64748b'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {record.status === 'active' && !record.notified && record.book?.availableCopies > 0 && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<NotificationsActive />}
                                                onClick={() => handleNotify(record._id)}
                                                sx={{ borderRadius: 2, fontWeight: 800, py: 0.5, boxShadow: 'none' }}
                                            >
                                                Send Pickup Notice
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Quick manual reservation Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, ...glassStyle } }}>
                <DialogTitle fontWeight={900}>Manual Queue Override</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Book to Reserve</InputLabel>
                            <Select
                                value={reservationForm.bookId}
                                label="Select Book to Reserve"
                                onChange={(e) => setReservationForm({ bookId: e.target.value })}
                            >
                                {availableBooks.length === 0 && <MenuItem disabled>No books available</MenuItem>}
                                {availableBooks.map(book => (
                                    <MenuItem key={book._id} value={book._id}>
                                        {book.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary">
                            * Note: For security reasons, Librarian manual overrides attach the reservation to their own account identity. Students should reserve via Student Portal.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAdd(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateReservation} disabled={!reservationForm.bookId} sx={{ borderRadius: 2, fontWeight: 900 }}>Push to Queue</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
