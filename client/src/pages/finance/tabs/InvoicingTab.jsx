import React, { useState } from 'react';
import {
    Box, Typography, Card, Button, TextField, MenuItem, Stack, Grid, useTheme, alpha
} from '@mui/material';
import { Receipt, Send, AddBox } from '@mui/icons-material';
import api from '../../../services/api';

export default function InvoicingTab({ isDark, cardSx, gradients }) {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        student: '',
        title: '',
        amount: '',
        dueDate: '',
        type: 'tuition',
        notes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.createInvoice({
                ...formData,
                amount: Number(formData.amount)
            });
            alert('Invoice generated successfully!');
            setFormData({ student: '', title: '', amount: '', dueDate: '', type: 'tuition', notes: '' });
        } catch (error) {
            console.error("Failed to generate invoice", error);
            alert("Failed to create the invoice");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Invoicing & Billing</Typography>
                <Typography variant="body2" color="text.secondary">Create and issue new financial liabilities for students</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...cardSx, p: 4, borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Receipt sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
                            <Typography variant="h6" fontWeight={800}>Issue New Invoice</Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField required label="Student ID (ObjectId)" name="student" value={formData.student} onChange={handleChange} fullWidth size="small" />
                                <TextField required label="Invoice Title (e.g. Fall 2024 Tuition)" name="title" value={formData.title} onChange={handleChange} fullWidth size="small" />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField required type="number" label="Amount ($)" name="amount" value={formData.amount} onChange={handleChange} fullWidth size="small" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField required type="date" label="Due Date" name="dueDate" InputLabelProps={{ shrink: true }} value={formData.dueDate} onChange={handleChange} fullWidth size="small" />
                                    </Grid>
                                </Grid>

                                <TextField select required label="Invoice Type" name="type" value={formData.type} onChange={handleChange} fullWidth size="small">
                                    <MenuItem value="tuition">Tuition Fee</MenuItem>
                                    <MenuItem value="housing">Housing/Dormitory</MenuItem>
                                    <MenuItem value="library_fine">Library Fine</MenuItem>
                                    <MenuItem value="penalty">Disciplinary Penalty</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>

                                <TextField label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} fullWidth multiline rows={3} size="small" />

                                <Button type="submit" disabled={isLoading} variant="contained" size="large" startIcon={<Send />} sx={{ borderRadius: 3, fontWeight: 900, background: gradients[1], mt: 2 }}>
                                    {isLoading ? 'Processing...' : 'Issue Invoice via Email'}
                                </Button>
                            </Stack>
                        </form>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ ...cardSx, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <Typography variant="subtitle1" fontWeight={800} mb={2}>Quick Actions</Typography>
                        <Button fullWidth variant="outlined" startIcon={<AddBox />} sx={{ mb: 2, borderRadius: 2, justifyContent: 'flex-start' }}>Batch Tuition Rollout</Button>
                        <Button fullWidth variant="outlined" startIcon={<AddBox />} sx={{ mb: 2, borderRadius: 2, justifyContent: 'flex-start' }}>Import Housing Costs</Button>
                        <Button fullWidth variant="outlined" startIcon={<AddBox />} sx={{ borderRadius: 2, justifyContent: 'flex-start' }}>Review Unpaid Fines</Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
