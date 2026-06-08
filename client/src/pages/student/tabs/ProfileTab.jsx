import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Avatar, Button, TextField, Stack,
    Chip, Divider, IconButton, alpha, Switch, FormControlLabel, LinearProgress,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { usersAPI, authAPI } from '../../../services/api';
import {
    Person, Edit, Save, CameraAlt, Email, Phone, Badge, School,
    CalendarMonth, LocationOn, Lock, Visibility, VisibilityOff, Shield
} from '@mui/icons-material';

export default function ProfileTab({ user, isDark, glassStyle, gradients }) {
    const [editing, setEditing] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        address: user?.address || '',
        emergencyContact: user?.emergencyContact || '',
    });
    const [passDialogOpen, setPassDialogOpen] = useState(false);
    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleSaveProfile = async () => {
        try {
            await usersAPI.updateProfile(formData);
            setEditing(false);
            alert('Profile updated successfully');
        } catch (e) {
            alert('Error updating profile');
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    await usersAPI.updateProfile({ photoURL: reader.result });
                    alert('Photo updated successfully! (Refresh to see globally)');
                } catch (err) {
                    alert('Error uploading photo');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = async () => {
        if (passForm.newPassword !== passForm.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await authAPI.changePassword({ oldPassword: passForm.oldPassword, newPassword: passForm.newPassword });
            setPassDialogOpen(false);
            setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully');
        } catch (e) {
            alert('Error changing password');
        }
    };

    const profileCompletion = [user?.name, user?.email, formData.phone, formData.address].filter(Boolean).length / 4 * 100;

    const infoRows = [
        { icon: <Badge />, label: 'Student ID', value: user?.studentId || user?._id?.slice(-8)?.toUpperCase() || '—', color: '#6366f1' },
        { icon: <Email />, label: 'Email', value: user?.email || '—', color: '#3b82f6' },
        { icon: <School />, label: 'Department', value: user?.department || '—', color: '#8b5cf6' },
        { icon: <CalendarMonth />, label: 'Year / Semester', value: `Year ${user?.year || '—'} · Semester ${user?.semester || '—'}`, color: '#10b981' },
        { icon: <Person />, label: 'Role', value: user?.role?.toUpperCase() || 'STUDENT', color: '#f59e0b' },
    ];

    return (
        <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, mb: 0.5 }}>Profile & Account</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>MANAGE YOUR INFORMATION</Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {/* Left: Avatar + Quick Info */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, overflow: 'visible', position: 'relative' }}>
                        <Box sx={{ height: 100, background: gradients[0], borderRadius: '16px 16px 0 0' }} />
                        <CardContent sx={{ textAlign: 'center', mt: -6, pb: 4 }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    src={user?.photoURL}
                                    sx={{ width: 100, height: 100, mx: 'auto', border: `4px solid ${isDark ? '#1e1e2f' : '#fff'}`, fontSize: 36, fontWeight: 900, background: gradients[1] }}
                                >
                                    {user?.name?.[0] || 'S'}
                                </Avatar>
                                <IconButton component="label" size="small" sx={{ position: 'absolute', bottom: 0, right: -4, bgcolor: 'primary.main', color: 'white', width: 30, height: 30, '&:hover': { bgcolor: 'primary.dark' } }}>
                                    <CameraAlt sx={{ fontSize: 16 }} />
                                    <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                </IconButton>
                            </Box>
                            <Typography variant="h6" fontWeight={900} sx={{ mt: 2 }}>{user?.name || 'Student'}</Typography>
                            <Chip label={user?.role?.toUpperCase() || 'STUDENT'} size="small" sx={{ mt: 0.5, fontWeight: 900, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />

                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary">Profile Completion</Typography>
                                    <Typography variant="caption" fontWeight={900} color="primary.main">{profileCompletion}%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={profileCompletion} sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: gradients[0], borderRadius: 3 } }} />
                            </Box>

                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5 }}>ACADEMIC STANDING</Typography>
                                <Box sx={{ mt: 1.5, p: 2, borderRadius: 3, bgcolor: alpha('#10b981', 0.08), border: `1px solid ${alpha('#10b981', 0.15)}` }}>
                                    <Typography variant="subtitle2" fontWeight={900} color="success.main">Good Standing</Typography>
                                    <Typography variant="caption" color="text.secondary">No academic warnings on record</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Detailed Info */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...glassStyle, borderRadius: 4, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={900}>Personal Information</Typography>
                                <Button startIcon={editing ? <Save /> : <Edit />} variant={editing ? 'contained' : 'outlined'} size="small" onClick={() => editing ? handleSaveProfile() : setEditing(true)} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>
                                    {editing ? 'Save Changes' : 'Edit Profile'}
                                </Button>
                            </Box>
                            <Stack spacing={2.5}>
                                {infoRows.map((row, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', transition: '0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' } }}>
                                        <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: alpha(row.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: row.color }}>
                                            {React.cloneElement(row.icon, { sx: { fontSize: 20 } })}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 1 }}>{row.label.toUpperCase()}</Typography>
                                            <Typography variant="body2" fontWeight={900}>{row.value}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                                {/* Editable fields */}
                                {editing && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <TextField label="Phone Number" size="small" fullWidth value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} InputProps={{ startAdornment: <Phone sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} /> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                        <TextField label="Address" size="small" fullWidth value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} /> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                        <TextField label="Emergency Contact" size="small" fullWidth value={formData.emergencyContact} onChange={e => setFormData(p => ({ ...p, emergencyContact: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card sx={{ ...glassStyle, borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Shield sx={{ color: '#6366f1' }} />
                                <Typography variant="h6" fontWeight={900}>Security Settings</Typography>
                            </Box>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }}>
                                    <Lock sx={{ color: 'text.secondary' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={900}>Password</Typography>
                                        <Typography variant="caption" color="text.secondary">Last changed: Unknown</Typography>
                                    </Box>
                                    <Button size="small" variant="outlined" onClick={() => setPassDialogOpen(true)} sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>Change</Button>
                                </Box>
                                <FormControlLabel control={<Switch defaultChecked color="primary" />} label={<Box><Typography variant="subtitle2" fontWeight={800}>Email Notifications</Typography><Typography variant="caption" color="text.secondary">Receive updates about grades and registration</Typography></Box>} sx={{ ml: 0, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', width: '100%' }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog open={passDialogOpen} onClose={() => setPassDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ p: 3, pb: 1 }}><Typography variant="h6" fontWeight={900}>Change Password</Typography></DialogTitle>
                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Current Password" type="password" size="small" fullWidth value={passForm.oldPassword} onChange={e => setPassForm(p => ({ ...p, oldPassword: e.target.value }))} InputProps={{ sx: { borderRadius: 3 } }} />
                        <TextField label="New Password" type="password" size="small" fullWidth value={passForm.newPassword} onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))} InputProps={{ sx: { borderRadius: 3 } }} />
                        <TextField label="Confirm New Password" type="password" size="small" fullWidth value={passForm.confirmPassword} onChange={e => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))} InputProps={{ sx: { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setPassDialogOpen(false)} sx={{ fontWeight: 800, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handlePasswordChange} disabled={!passForm.oldPassword || !passForm.newPassword || !passForm.confirmPassword} sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none' }}>Update Password</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
