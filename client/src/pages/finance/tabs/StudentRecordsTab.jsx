import React from 'react';
import { Box, Typography, Card, Grid, useTheme, Button } from '@mui/material';
import { Description, ArrowForward } from '@mui/icons-material';

export default function StudentRecordsTab({ isDark, cardSx }) {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Student Financial Records</Typography>
                <Typography variant="body2" color="text.secondary">Comprehensive view of individual student ledger profiles, clearance statuses, and past payment histories.</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card sx={{ ...cardSx, p: 4, borderRadius: 4, textAlign: 'center', py: 8 }}>
                        <Description sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800} color="text.secondary">Record Search UI Integration</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                            Full synchronization directly with the primary Registrar database is establishing in this module. This interface will allow Financial personnel to place holds and process clearances for graduation.
                        </Typography>
                        <Button variant="outlined" endIcon={<ArrowForward />}>
                            Sync with Registrar Sandbox
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
