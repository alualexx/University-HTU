import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Grid, CircularProgress, useTheme, alpha
} from '@mui/material';
import {
    Assessment, ShowChart, Warning, CheckCircle, MenuBook
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibReportsTab({ glassStyle }) {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // In a real app, an aggregate endpoint is best. Here we simulate by doing promises
            const [booksRes, circRes, finesRes] = await Promise.all([
                libraryAPI.getBooks(),
                libraryAPI.getBorrowings(),
                libraryAPI.getFines()
            ]);

            const books = booksRes.data;
            const circs = circRes.data;
            const finesData = finesRes.data.records;

            const totalPhysical = books.filter(b => b.type === 'physical').length;
            const totalDigital = books.filter(b => b.type === 'digital' || b.type === 'journal').length;
            const totalThesis = books.filter(b => b.type === 'thesis').length;

            const totalCurrentlyBorrowed = circs.filter(c => c.status === 'borrowed').length;
            const totalOverdue = circs.filter(c => c.status === 'overdue').length;

            const totalFinesUnpaid = finesData.reduce((acc, f) => acc + (f.fine || 0), 0);

            setStats({
                totalPhysical, totalDigital, totalThesis,
                totalCurrentlyBorrowed, totalOverdue, totalFinesUnpaid
            });

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, height: '100%', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(color, 0.1), color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight={900} sx={{ color }}>{value}</Typography>
                <Typography variant="body2" fontWeight={800} color="text.secondary">{title}</Typography>
            </Box>
        </Card>
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={900}>Library Analytics Reports</Typography>
                <Typography variant="body2" color="text.secondary">Real-time macro overview of catalog velocity and fine collection</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : stats ? (
                <>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Physical Collection Items"
                                value={stats.totalPhysical.toLocaleString()}
                                icon={<MenuBook sx={{ fontSize: 40 }} />}
                                color={theme.palette.primary.main}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Digital / Journals"
                                value={stats.totalDigital.toLocaleString()}
                                icon={<CheckCircle sx={{ fontSize: 40 }} />}
                                color={theme.palette.info.main}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Published Theses"
                                value={stats.totalThesis.toLocaleString()}
                                icon={<Assessment sx={{ fontSize: 40 }} />}
                                color={theme.palette.secondary.main}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" fontWeight={800} mb={3}>Circulation & Infractions</Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Active Checkouts"
                                value={stats.totalCurrentlyBorrowed}
                                icon={<ShowChart sx={{ fontSize: 40 }} />}
                                color={theme.palette.success.main}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Overdue Items Flagged"
                                value={stats.totalOverdue}
                                icon={<Warning sx={{ fontSize: 40 }} />}
                                color={theme.palette.error.main}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Unpaid Fines Due"
                                value={`$${stats.totalFinesUnpaid.toFixed(2)}`}
                                icon={<Assessment sx={{ fontSize: 40 }} />}
                                color={theme.palette.warning.main}
                            />
                        </Grid>
                    </Grid>
                </>
            ) : null}
        </Box>
    );
}
