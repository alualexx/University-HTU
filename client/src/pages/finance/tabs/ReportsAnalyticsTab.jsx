import React from 'react';
import { Box, Typography, Card, Grid, useTheme, Button } from '@mui/material';
import { ShowChart, Download } from '@mui/icons-material';

export default function ReportsAnalyticsTab({ isDark, cardSx }) {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Reports & Analytics</Typography>
                    <Typography variant="body2" color="text.secondary">Financial health metrics, projection modeling, and deficit alarms.</Typography>
                </Box>
                <Button variant="contained" color="secondary" startIcon={<Download />} sx={{ borderRadius: 2 }}>
                    Generate Fiscal Year Report
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card sx={{ ...cardSx, p: 4, borderRadius: 4, py: 10, textAlign: 'center' }}>
                        <ShowChart sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800} color="text.secondary">Analytics Engine Offline</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                            The primary datastream for live graphical reporting is currently initializing within the University data warehouse. Chart.js components will render here once stream establishes.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
