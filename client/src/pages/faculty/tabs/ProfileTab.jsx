import React, { useState } from "react";
import {
    Box, Typography, Grid, Card, CardContent, Avatar,
    Button, TextField, Divider, Stack, IconButton, Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PhotoCamera, Edit, Security, Badge, Description } from "@mui/icons-material";

const GlassCard = ({ children, sx = {} }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return (
        <Card sx={{
            borderRadius: 6,
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(99, 102, 241, 0.05)",
            ...sx
        }}>
            {children}
        </Card>
    );
};

export default function ProfileTab({ user }) {
    const [editMode, setEditMode] = useState(false);

    // Stub state for profile fields
    const [profile, setProfile] = useState({
        phone: "+1 234 567 8900",
        office: "Room 304, Computing Block",
        bio: "Senior Lecturer specializing in Machine Learning and Distributed Systems.",
        specializations: ["Machine Learning", "Cloud Computing", "AI Ethics"],
        contractType: "Full-Time Tenured",
        employeeId: user?.employeeId || "EMP-94827"
    });

    const handleSave = () => setEditMode(false);

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight={1000}>Profile & Account Management</Typography>
                <Button
                    variant={editMode ? "contained" : "outlined"}
                    startIcon={editMode ? null : <Edit />}
                    onClick={editMode ? handleSave : () => setEditMode(true)}
                    sx={{ borderRadius: 3, fontWeight: 900 }}
                >
                    {editMode ? "Save Changes" : "Edit Profile"}
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column: Avatar & Quick Info */}
                <Grid item xs={12} md={4}>
                    <GlassCard sx={{ p: 4, textAlign: "center", position: "relative" }}>
                        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                            <Avatar sx={{ width: 120, height: 120, fontSize: "3rem", fontWeight: 900, background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)" }}>
                                {user?.name?.[0]}
                            </Avatar>
                            {editMode && (
                                <IconButton sx={{ position: "absolute", bottom: -10, right: -10, bgcolor: "background.paper", boxShadow: 2, "&:hover": { bgcolor: "primary.light" } }}>
                                    <PhotoCamera color="primary" />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="h5" fontWeight={1000}>{user?.name}</Typography>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ textTransform: "uppercase", mt: 0.5, letterSpacing: 1 }}>
                            {user?.department} Department
                        </Typography>

                        <Divider sx={{ my: 3, opacity: 0.1 }} />

                        <Stack spacing={2} textAlign="left">
                            <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">EMPLOYEE ID</Typography>
                                <Typography variant="body2" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}><Badge fontSize="small" /> {profile.employeeId}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">CONTRACT TYPE</Typography>
                                <Typography variant="body2" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}><Description fontSize="small" /> {profile.contractType}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">SECURITY</Typography>
                                <Button size="small" startIcon={<Security />} sx={{ mt: 0.5, textTransform: "none", fontWeight: 800, borderRadius: 2 }}>Change Password</Button>
                            </Box>
                        </Stack>
                    </GlassCard>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid item xs={12} md={8}>
                    <GlassCard sx={{ p: 4, height: "100%" }}>
                        <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Contact & Office Information</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email Address" fullWidth variant="filled"
                                    value={user?.email || ""} disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone Number" fullWidth variant="filled"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Office Location" fullWidth variant="filled"
                                    value={profile.office}
                                    onChange={e => setProfile({ ...profile, office: e.target.value })}
                                    disabled={!editMode}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4, opacity: 0.1 }} />

                        <Typography variant="h6" fontWeight={900} sx={{ mb: 3 }}>Professional Biography</Typography>
                        <TextField
                            label="Biography" fullWidth variant="filled" multiline rows={4}
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            disabled={!editMode} sx={{ mb: 3 }}
                        />

                        <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1 }}>Specializations</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                            {profile.specializations.map((spec, i) => (
                                <Chip key={i} label={spec} color="primary" sx={{ fontWeight: 800 }} onDelete={editMode ? () => { } : undefined} />
                            ))}
                            {editMode && <Chip label="+ Add Specialization" variant="outlined" sx={{ fontWeight: 800, borderStyle: "dashed" }} />}
                        </Stack>

                    </GlassCard>
                </Grid>
            </Grid>
        </Box>
    );
}
