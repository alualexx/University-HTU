import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, alpha, CircularProgress, useTheme
} from '@mui/material';
import {
    Computer, Search, CloudDownload, OpenInNew, ImportantDevices, Refresh
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibDigitalTab({ glassStyle }) {
    const theme = useTheme();
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchDigitalBooks = async () => {
        setLoading(true);
        try {
            // Fetch everything and filter locally for simplicity, or ideally just use type filter
            const res = await libraryAPI.getBooks({ type: 'digital' });
            setEbooks(res.data);
        } catch (error) {
            console.error("Error fetching digital books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDigitalBooks();
    }, []);

    // Filter Logic
    const filteredItems = ebooks.filter(b => {
        if (!search) return true;
        const s = search.toLowerCase();
        return b.title?.toLowerCase().includes(s) || b.author?.toLowerCase().includes(s);
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Digital Library & E-Resources</Typography>
                    <Typography variant="body2" color="text.secondary">Access academic journals, PDFs, and external database links</Typography>
                </Box>
                <Button variant="contained" startIcon={<ImportantDevices />} disabled sx={{ borderRadius: 3, fontWeight: 900 }}>
                    Manage Database Access
                </Button>
            </Box>

            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search e-books and journals..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    />
                    <IconButton onClick={fetchDigitalBooks} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}><Refresh /></IconButton>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Resource Information</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Publisher / Source</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Format</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Access</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Computer sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No digital resources found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredItems.map((item) => (
                                <TableRow key={item._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color="primary">{item.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.author}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{item.publisher || 'Internal Repository'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="small" label="PDF / Cloud" icon={<CloudDownload />} sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={item.status === 'active' ? 'ONLINE' : 'MAINTENANCE'}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: item.status === 'active' ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                                                color: item.status === 'active' ? '#10b981' : '#ef4444'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled={item.status !== 'active'}
                                            endIcon={<OpenInNew />}
                                            sx={{ borderRadius: 2, fontWeight: 800, py: 0.5 }}
                                        >
                                            Read Online
                                        </Button>
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
