import React, { useState } from 'react';
import {
    Box, Typography, Card, Grid, Button, TextField, Stack, useTheme, alpha, CardContent
} from '@mui/material';
import {
    MeetingRoom, DirectionsBus, MenuBook, ContactSupport, Send
} from '@mui/icons-material';

export default function LibServicesTab({ glassStyle }) {
    const theme = useTheme();
    const [requestForm, setRequestForm] = useState({ type: 'loan', description: '' });

    const handleRequest = () => {
        alert("Your request has been submitted to library staff for review.");
        setRequestForm({ ...requestForm, description: '' });
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Library Services & Requests</Typography>
                <Typography variant="body2" color="text.secondary">Book study rooms, request new materials, or initiate inter-library loans</Typography>
            </Box>

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, height: '100%', textAlign: 'center' }}>
                        <MeetingRoom sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800} mb={1}>Study Room Booking</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Reserve collaborative pods or quiet study rooms. Use your university ID at the door.
                        </Typography>
                        <Button variant="outlined" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Explore Rooms</Button>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, height: '100%', textAlign: 'center' }}>
                        <DirectionsBus sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800} mb={1}>Inter-Library Loan (ILL)</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Can't find a book in our catalog? Request an item from partner universities.
                        </Typography>
                        <Button variant="outlined" color="secondary" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Initiate Request</Button>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, height: '100%', textAlign: 'center' }}>
                        <MenuBook sx={{ fontSize: 50, color: theme.palette.success.main, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800} mb={1}>Purchase Request</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Suggest new books, journals, or media for the library to acquire for the catalog.
                        </Typography>
                        <Button variant="outlined" color="success" fullWidth sx={{ borderRadius: 2, fontWeight: 800 }}>Suggest Item</Button>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Support Ticket */}
            <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={900} display="flex" alignItems="center" gap={1} mb={2}>
                        <ContactSupport color="primary" /> Direct Librarian Contact
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Submit research questions, metadata corrections, or account issues directly to library staff.
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="How can we help you?"
                            multiline
                            rows={4}
                            value={requestForm.description}
                            onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                endIcon={<Send />}
                                onClick={handleRequest}
                                disabled={!requestForm.description}
                                sx={{ borderRadius: 2, fontWeight: 800, px: 4 }}
                            >
                                Submit Request
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
