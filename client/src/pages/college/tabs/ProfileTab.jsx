import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
    Divider, alpha, IconButton,
} from "@mui/material";
import {
    Edit, Save, Cancel, AccountBalance, LocationOn, Email, Phone,
    VerifiedUser, Diversity3, Flag, AutoStories, Groups,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { collegesAPI } from "../../../services/api";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
};

const ACCREDITATION_STATUS = {
    accredited: { label: "Accredited", color: "#10b981" },
    conditional: { label: "Conditional", color: "#f59e0b" },
    pending: { label: "Pending Review", color: "#6366f1" },
    expired: { label: "Expired", color: "#ef4444" },
};

export default function ProfileTab({ college, user, onRefresh }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: college?.name || "",
        vision: college?.vision || "To be a leading research and innovation hub in the region.",
        mission: college?.mission || "Providing transformative education and fostering critical thinking.",
        objectives: college?.objectives || "Academic excellence, global partnerships, and community impact.",
        contactEmail: college?.contactEmail || "",
        contactPhone: college?.contactPhone || "",
        location: college?.location || "",
        accreditationStatus: college?.accreditationStatus || "accredited",
        accreditationBody: college?.accreditationBody || "National Accreditation Council",
        accreditationExpiry: college?.accreditationExpiry || "2028-12-31",
        strategicPlan: college?.strategicPlan || "2024-2030 Strategic Vision: Expand research output, grow graduate programs, and strengthen industry partnerships.",
        dean: college?.dean || user?.name || "",
        associateDeanAcademic: college?.associateDeanAcademic || "",
        associateDeanResearch: college?.associateDeanResearch || "",
    });

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const handleSave = async () => {
        try {
            await collegesAPI.update(college._id || college.id, form);
            setEditing(false);
            if (onRefresh) onRefresh();
        } catch (e) { console.error(e); }
    };

    const accStatus = ACCREDITATION_STATUS[form.accreditationStatus] || ACCREDITATION_STATUS.accredited;

    const leadershipRoles = [
        { label: "Dean", value: form.dean, field: "dean" },
        { label: "Associate Dean (Academic)", value: form.associateDeanAcademic, field: "associateDeanAcademic" },
        { label: "Associate Dean (Research)", value: form.associateDeanResearch, field: "associateDeanResearch" },
    ];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>College Profile</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        PROFILE • LEADERSHIP • VISION • ACCREDITATION
                    </Typography>
                </Box>
                {!editing ? (
                    <Button variant="contained" startIcon={<Edit />} onClick={() => setEditing(true)}
                        sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                        Edit Profile
                    </Button>
                ) : (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditing(false)}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none" }}>Cancel</Button>
                        <Button variant="contained" startIcon={<Save />} onClick={handleSave}
                            sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.success }}>Save</Button>
                    </Stack>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* College Identity */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                            <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, background: GRADIENTS.premium, fontSize: "2rem", fontWeight: 1000 }}>
                                {college?.name?.[0] || "C"}
                            </Avatar>
                            <Typography variant="h6" fontWeight={1000}>{college?.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{college?.code || "COL"}</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Chip label={accStatus.label} sx={{ bgcolor: alpha(accStatus.color, 0.1), color: accStatus.color, fontWeight: 900, mb: 1 }} />
                            </Box>
                            <Divider sx={{ my: 2, opacity: 0.15 }} />
                            <Stack spacing={1.5}>
                                {[
                                    { icon: <Email sx={{ fontSize: 16 }} />, value: form.contactEmail || "—" },
                                    { icon: <Phone sx={{ fontSize: 16 }} />, value: form.contactPhone || "—" },
                                    { icon: <LocationOn sx={{ fontSize: 16 }} />, value: form.location || "Main Campus" },
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                                        <Box sx={{ color: "text.secondary" }}>{item.icon}</Box>
                                        <Typography variant="caption" fontWeight={700}>{item.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Main Profile Details */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {/* Leadership */}
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                    <Groups sx={{ color: "#6366f1" }} />
                                    <Typography variant="h6" fontWeight={900}>Leadership</Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    {leadershipRoles.map((role, i) => (
                                        <Grid item xs={12} key={i}>
                                            {editing ? (
                                                <TextField fullWidth label={role.label} value={role.value}
                                                    onChange={e => setForm({ ...form, [role.field]: e.target.value })}
                                                    size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                            ) : (
                                                <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>{role.label}</Typography>
                                                    <Typography variant="caption" fontWeight={900}>{role.value || "—"}</Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Contact Info (edit mode) */}
                        {editing && (
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={900} gutterBottom>Contact & Location</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}><TextField fullWidth size="small" label="Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} /></Grid>
                                        <Grid item xs={6}><TextField fullWidth size="small" label="Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} /></Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Vision & Mission */}
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                    <Flag sx={{ color: "#10b981" }} />
                                    <Typography variant="h6" fontWeight={900}>Vision, Mission & Objectives</Typography>
                                </Box>
                                <Stack spacing={2}>
                                    {[
                                        { label: "Vision", field: "vision", value: form.vision },
                                        { label: "Mission", field: "mission", value: form.mission },
                                        { label: "Objectives", field: "objectives", value: form.objectives },
                                    ].map((item, i) => (
                                        <Box key={i}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</Typography>
                                            {editing ? (
                                                <TextField fullWidth multiline rows={2} value={item.value}
                                                    onChange={e => setForm({ ...form, [item.field]: e.target.value })}
                                                    sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} size="small" />
                                            ) : (
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>{item.value}</Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Accreditation */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                <VerifiedUser sx={{ color: accStatus.color }} />
                                <Typography variant="h6" fontWeight={900}>Accreditation</Typography>
                            </Box>
                            <Stack spacing={2}>
                                {editing ? (
                                    <>
                                        <TextField select fullWidth label="Status" value={form.accreditationStatus} onChange={e => setForm({ ...form, accreditationStatus: e.target.value })} size="small">
                                            {Object.entries(ACCREDITATION_STATUS).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
                                        </TextField>
                                        <TextField fullWidth label="Accreditation Body" value={form.accreditationBody} onChange={e => setForm({ ...form, accreditationBody: e.target.value })} size="small" />
                                        <TextField fullWidth label="Expiry Date" type="date" InputLabelProps={{ shrink: true }} value={form.accreditationExpiry} onChange={e => setForm({ ...form, accreditationExpiry: e.target.value })} size="small" />
                                    </>
                                ) : (
                                    [
                                        { label: "Status", value: <Chip label={accStatus.label} size="small" sx={{ bgcolor: alpha(accStatus.color, 0.1), color: accStatus.color, fontWeight: 900 }} /> },
                                        { label: "Accreditation Body", value: form.accreditationBody },
                                        { label: "Valid Until", value: form.accreditationExpiry },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{item.label}</Typography>
                                            {typeof item.value === "string" ? <Typography variant="body2" fontWeight={900}>{item.value}</Typography> : item.value}
                                        </Box>
                                    ))
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Strategic Plan */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ ...glass }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                <AutoStories sx={{ color: "#8b5cf6" }} />
                                <Typography variant="h6" fontWeight={900}>Strategic Plan</Typography>
                            </Box>
                            {editing ? (
                                <TextField fullWidth multiline rows={5} label="Strategic Plan" value={form.strategicPlan}
                                    onChange={e => setForm({ ...form, strategicPlan: e.target.value })}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                            ) : (
                                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{form.strategicPlan}</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
