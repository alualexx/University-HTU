import React, { useState } from "react";
import {
    Box, Grid, Card, Typography, Stack, Button, IconButton, Chip,
    Switch, TextField, Divider, MenuItem, useTheme, alpha, LinearProgress, Avatar
} from "@mui/material";
import {
    Extension, Hub, Cable, Security, Sync, Add, Edit, Delete,
    Language, CloudSync, AdminPanelSettings, Webhook
} from "@mui/icons-material";

export default function IntegrationsTab() {
    const theme = useTheme();

    const glassStyle = {
        background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.05)',
    };

    const integrations = [
        { name: "Moodle LMS", status: "Connected", latency: "45ms", lastSync: "2 mins ago", icon: <Language /> },
        { name: "Canvas Integration", status: "Active", latency: "38ms", lastSync: "5 mins ago", icon: <CloudSync /> },
        { name: "Microsoft LDAP", status: "Connected", latency: "12ms", lastSync: "Live", icon: <AdminPanelSettings /> },
        { name: "Global Webhooks", status: "Listener Active", latency: "—", lastSync: "10 mins ago", icon: <Webhook /> },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>System-Wide Integrations</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE EXTERNAL LMS NODES, IDENTITY BRIDGES, AND API ECOSYSTEMS</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* LMS Synchronization */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={900}>External Service Nodes</Typography>
                            <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Integration</Button>
                        </Box>
                        <Stack spacing={2}>
                            {integrations.map((int, i) => (
                                <Box key={i} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>{int.icon}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={900}>{int.name}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>LATENCY: {int.latency} • SYNC: {int.lastSync}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip label={int.status} size="small" sx={{ fontWeight: 1000, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />
                                        <IconButton size="small"><Sync fontSize="small" /></IconButton>
                                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Card>
                </Grid>

                {/* API & Webhook Management */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                        <Typography variant="h6" fontWeight={900} gutterBottom>API Ecosystem</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Manage tactical API keys and configure global event webhooks.</Typography>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="caption" fontWeight={800} color="text.secondary">PRODUCTION_API_KEY</Typography>
                                <TextField
                                    fullWidth size="small" value="pk_live_49202_cortex_academic_v2" disabled
                                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 3, fontFamily: 'monospace' } }}
                                />
                            </Box>
                            <Button fullWidth variant="outlined" startIcon={<Cable />} sx={{ borderRadius: 3, fontWeight: 900 }}>Regenerate Credentials</Button>
                            <Divider sx={{ opacity: 0.1 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={1000} gutterBottom>Integration Pulse</Typography>
                                <LinearProgress variant="determinate" value={98} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                                <Typography variant="caption" fontWeight={800}>SYSTEM_UPTIME: 98.4% OVER 30D</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Identity Bridge */}
                <Grid item xs={12}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, border: '1px solid rgba(56,189,248,0.2)' }}>
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: alpha('#38bdf8', 0.1), color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Security sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={900}>Azure AD / Zscaler Identity Bridge</Typography>
                                <Typography variant="body2" color="text.secondary">Synchronizing 4,202 identity nodes with central university directory.</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                                <Button variant="contained" sx={{ bgcolor: '#38bdf8', '&:hover': { bgcolor: alpha('#38bdf8', 0.8) }, borderRadius: 3, fontWeight: 900 }}>Re-Sync Directory</Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
