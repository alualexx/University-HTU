import React from 'react';
import { Box, Typography, Card, Grid, LinearProgress, useTheme } from '@mui/material';
import { PieChart, TrendingUp, TrendingDown } from '@mui/icons-material';

export default function BudgetExpenditureTab({ isDark, cardSx }) {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Budget & Expenditure Control</Typography>
                <Typography variant="body2" color="text.secondary">Macro oversight of departmental budgeting and institutional spending thresholds.</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...cardSx, p: 3, borderRadius: 4 }}>
                        <Typography variant="subtitle1" fontWeight={800} mb={3}>Departmental Spending</Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight={800}>Computer Science</Typography>
                                <Typography variant="body2" color="error" fontWeight={800}>85% ($1.2M / $1.4M)</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={85} color="error" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight={800}>Engineering</Typography>
                                <Typography variant="body2" color="warning.main" fontWeight={800}>62% ($2.1M / $3.4M)</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={62} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight={800}>Library Operations</Typography>
                                <Typography variant="body2" color="success.main" fontWeight={800}>41% ($320k / $780k)</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={41} color="success" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ ...cardSx, p: 4, borderRadius: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <PieChart sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.2, mb: 2, mx: 'auto' }} />
                        <Typography variant="h6" fontWeight={800} color="text.secondary">Predictive Budget AI</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                            Awaiting dataset aggregation for next fiscal year forecasting. Current variance algorithms active.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
