import React from 'react';
import { Box, Typography, Card, Grid, Switch, FormControlLabel, Button } from '@mui/material';
import { Settings, Save } from '@mui/icons-material';

export default function SettingsSetupTab({ isDark, cardSx }) {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>System Configuration</Typography>
                <Typography variant="body2" color="text.secondary">Global behavioral toggles for the Finance Dashboard ecosystem.</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...cardSx, p: 4, borderRadius: 4 }}>
                        <Typography variant="subtitle1" fontWeight={800} mb={3} display="flex" alignItems="center">
                            <Settings sx={{ mr: 1, color: 'text.secondary' }} /> Automated Workflows
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel control={<Switch defaultChecked color="success" />} label="Allow Auto-Late Fees Assessment (5% penalty)" />
                            <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Sync clearances nightly with Registrar Portal" />
                            <FormControlLabel control={<Switch color="secondary" />} label="Require Dean dual-signature for Payroll execution" />
                            <FormControlLabel control={<Switch defaultChecked color="error" />} label="Halt enrollment for students with overdue balances > $500" />
                        </Box>

                        <Button variant="contained" startIcon={<Save />} sx={{ mt: 4, borderRadius: 2 }}>Save Preferences</Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
