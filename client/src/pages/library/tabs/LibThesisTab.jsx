import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    alpha, CircularProgress, useTheme
} from '@mui/material';
import {
    AssuredWorkload, Search, CheckCircle, UploadFile, Download, LibraryBooks, RateReview
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function LibThesisTab({ glassStyle }) {
    const theme = useTheme();
    const { user } = useAuth();
    const [thesisList, setThesisList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Dialog State
    const [openSubmit, setOpenSubmit] = useState(false);
    const [submitForm, setSubmitForm] = useState({ title: '', category: '', description: '' });
    const isStudent = user?.role === 'student';

    const fetchThesisList = async () => {
        setLoading(true);
        try {
            const res = await libraryAPI.getBooks({ type: 'thesis' });
            let data = res.data;
            if (search) {
                const s = search.toLowerCase();
                data = data.filter(t => t.title?.toLowerCase().includes(s) || t.author?.toLowerCase().includes(s));
            }
            // Students only see published thesis and their own pending ones
            if (isStudent) {
                data = data.filter(t => t.status === 'active' || t.author === user.name);
            }
            setThesisList(data);
        } catch (error) {
            console.error("Error fetching thesis data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThesisList();
    }, [search]);

    const handleSubmitThesis = async () => {
        try {
            await libraryAPI.submitThesis(submitForm);
            setOpenSubmit(false);
            setSubmitForm({ title: '', category: '', description: '' });
            fetchThesisList();
        } catch (error) {
            console.error("Error submitting thesis:", error);
            alert("Failed to submit thesis.");
        }
    };

    const handleApprove = async (id) => {
        try {
            await libraryAPI.approveThesis(id);
            fetchThesisList();
        } catch (error) {
            console.error("Error approving thesis:", error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Thesis & Dissertation Repository</Typography>
                    <Typography variant="body2" color="text.secondary">Access, submit, and review academic research publications</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export Records</Button>
                    {isStudent || user?.role === 'admin' ? (
                        <Button variant="contained" startIcon={<UploadFile />} onClick={() => setOpenSubmit(true)} sx={{ borderRadius: 3, fontWeight: 900 }}>
                            Submit Thesis File
                        </Button>
                    ) : null}
                </Stack>
            </Box>

            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search by title, author, or keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    />
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Research Title & Abstract</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Author</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Department / Category</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Submission Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                {!isStudent && <TableCell sx={{ fontWeight: 900 }} align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : thesisList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <AssuredWorkload sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No thesis records found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : thesisList.map((thesis) => (
                                <TableRow key={thesis._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LibraryBooks fontSize="small" /> {thesis.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                                            {thesis.description || 'No abstract provided.'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{thesis.author}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{thesis.category}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{new Date(thesis.createdAt).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={thesis.status === 'archived' ? 'PENDING REVIEW' : 'PUBLISHED'}
                                            icon={thesis.status === 'active' ? <CheckCircle /> : <RateReview />}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: thesis.status === 'active' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1),
                                                color: thesis.status === 'active' ? '#10b981' : '#f59e0b'
                                            }}
                                        />
                                    </TableCell>
                                    {!isStudent && (
                                        <TableCell align="right">
                                            {thesis.status === 'archived' ? (
                                                <Button size="small" variant="contained" color="success" onClick={() => handleApprove(thesis._id)} sx={{ borderRadius: 2, fontWeight: 800 }}>
                                                    Approve & Publish
                                                </Button>
                                            ) : (
                                                <Button size="small" variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 800 }}>View PDF</Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Submit Thesis Dialog */}
            <Dialog open={openSubmit} onClose={() => setOpenSubmit(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, ...glassStyle } }}>
                <DialogTitle fontWeight={900}>Final Thesis Submission</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="Research Title"
                            fullWidth
                            value={submitForm.title}
                            onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                        />
                        <TextField
                            label="Department / Field of Study"
                            fullWidth
                            value={submitForm.category}
                            onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                        />
                        <TextField
                            label="Abstract / Short Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={submitForm.description}
                            onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                        />
                        <Box sx={{ p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center', bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                            <UploadFile sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" fontWeight={800}>Drag and drop your PDF file here</Typography>
                            <Typography variant="caption" color="text.secondary">Or click to browse files</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenSubmit(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmitThesis} disabled={!submitForm.title || !submitForm.category} sx={{ borderRadius: 2, fontWeight: 900 }}>Submit for Review</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
