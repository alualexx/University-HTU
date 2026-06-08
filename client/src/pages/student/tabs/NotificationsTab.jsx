import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Stack, alpha, Grid, Switch, FormControlLabel, Button, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { Campaign, Settings, DoneAll, NotificationsActive, WarningAmber } from '@mui/icons-material';

export default function NotificationsTab({ newsList, isDark, cardSx }) {
    const [filter, setFilter] = useState('All');
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [readStates, setReadStates] = useState({});

    const categories = ['All', 'Academic', 'Finance', 'Events'];

    const isUnread = (idx) => !readStates[idx];
    const markRead = (idx) => setReadStates(prev => ({ ...prev, [idx]: true }));
    const markAllRead = () => {
        const nr = {};
        newsList.forEach((_, i) => nr[i] = true);
        setReadStates(nr);
    };

    const systemAlerts = newsList.filter(n => n.category?.toLowerCase() === 'system');
    const filteredNews = newsList.filter(n => {
        if (n.category?.toLowerCase() === 'system') return false; // Handled in System Alerts panel
        if (filter === 'All') return true;
        return n.category?.toLowerCase() === filter.toLowerCase();
    });

    return (
        <Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>News & Notifications</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={800}>ANNOUNCEMENTS</Typography>
                        </Box>
                        <Button startIcon={<DoneAll />} size="small" onClick={markAllRead} sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none' }}>Mark All Read</Button>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                        {categories.map(c => (
                            <Chip
                                key={c} label={c}
                                onClick={() => setFilter(c)}
                                sx={{
                                    fontWeight: 800,
                                    bgcolor: filter === c ? alpha('#6366f1', 0.1) : 'transparent',
                                    color: filter === c ? '#6366f1' : 'text.secondary',
                                    border: `1px solid ${filter === c ? '#6366f1' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                }}
                            />
                        ))}
                    </Stack>

                    {filteredNews.length === 0 ? (
                        <Card sx={{ ...cardSx, p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <Campaign sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 1 }} />
                            <Typography color="text.secondary" fontWeight={800}>No notifications in this category.</Typography>
                        </Card>
                    ) : (
                        <Stack spacing={3}>
                            {filteredNews.map((a, i) => {
                                const realIdx = newsList.indexOf(a);
                                return (
                                    <Card key={i} sx={{ ...cardSx, borderRadius: 4, p: 3, position: 'relative', borderLeft: isUnread(realIdx) ? '4px solid #6366f1' : 'none' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 1 }}>{a.category?.toUpperCase() || "UPDATE"}</Typography>
                                            {isUnread(realIdx) && <Tooltip title="Mark as read"><IconButton size="small" onClick={() => markRead(realIdx)}><DoneAll sx={{ fontSize: 16 }} /></IconButton></Tooltip>}
                                        </Box>
                                        <Typography variant="h6" fontWeight={900} sx={{ mt: 0.5, mb: 0.5 }}>{a.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>{a.date?.toDate ? a.date.toDate().toLocaleDateString() : new Date(a.date).toLocaleDateString()}</Typography>
                                        <Typography variant="body2">{a.content}</Typography>
                                    </Card>
                                )
                            })}
                        </Stack>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    {/* System Alerts */}
                    <Card sx={{ ...cardSx, borderRadius: 4, mb: 4, border: `1px solid ${alpha('#ef4444', 0.2)}` }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <WarningAmber color="error" />
                                <Typography variant="h6" fontWeight={900} color="error.main">System Alerts</Typography>
                            </Box>
                            {systemAlerts.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">All systems operational.</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {systemAlerts.map((a, i) => (
                                        <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#ef4444', 0.05) }}>
                                            <Typography variant="subtitle2" fontWeight={800}>{a.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{a.content}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card sx={{ ...cardSx, borderRadius: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Settings color="primary" />
                                <Typography variant="h6" fontWeight={900}>Preferences</Typography>
                            </Box>
                            <Stack spacing={2}>
                                <FormControlLabel control={<Switch checked={emailEnabled} onChange={e => setEmailEnabled(e.target.checked)} color="primary" />} label={<Typography variant="body2" fontWeight={800}>Email Notifications</Typography>} />
                                <FormControlLabel control={<Switch checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} color="primary" />} label={<Typography variant="body2" fontWeight={800}>SMS Alerts</Typography>} />
                                <FormControlLabel control={<Switch checked={pushEnabled} onChange={e => setPushEnabled(e.target.checked)} color="primary" />} label={<Typography variant="body2" fontWeight={800}>Push Notifications</Typography>} />
                            </Stack>
                            <Button fullWidth variant="outlined" onClick={() => alert("Preferences saved.")} sx={{ mt: 3, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Save Settings</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
