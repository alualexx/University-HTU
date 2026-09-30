import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Grid, Card, Typography, Stack, Button, IconButton, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, Divider, TextField, MenuItem, useTheme, alpha,
    Slider, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Snackbar, Alert, Tooltip
} from "@mui/material";
import {
    AutoGraph, LockClock, Description, Add, Edit, Delete,
    Save, Refresh, Calculate, AssignmentTurnedIn, Close
} from "@mui/icons-material";
import { systemAPI } from "../../../services/api";

const DEFAULT_SCALE = [
    { grade: "A", minPct: 90, maxPct: 100, points: 4.0 },
    { grade: "B", minPct: 80, maxPct: 89.9, points: 3.0 },
    { grade: "C", minPct: 70, maxPct: 79.9, points: 2.0 },
    { grade: "D", minPct: 60, maxPct: 69.9, points: 1.0 },
    { grade: "F", minPct: 0, maxPct: 59.9, points: 0.0 },
];

export default function GradingConfigTab() {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [gradingScale, setGradingScale] = useState(DEFAULT_SCALE);
    const [config, setConfig] = useState({
        calcType: "weighted", threshold: 60, roundGPA: true, curving: false,
        midTermLock: true, finalFreeze: false, latePenalty: false,
        showWeights: true, deanSig: true, probity: true, watermark: false, qrNode: false
    });
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    // Edit dialog
    const [editDialog, setEditDialog] = useState({ open: false, idx: null });
    const [editForm, setEditForm] = useState({ grade: "", minPct: 0, maxPct: 100, points: 0 });

    const glassStyle = {
        background: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.05)",
    };

    const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await systemAPI.getSettings("grading");
            if (res.data?.scale) setGradingScale(res.data.scale);
            if (res.data?.config) setConfig(res.data.config);
        } catch {
            // Settings may not exist yet — use defaults
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchConfig(); }, [fetchConfig]);

    const saveConfig = async (scale = gradingScale, cfg = config) => {
        setSaving(true);
        try {
            await systemAPI.updateSettings("grading", { scale, config: cfg });
            showSnack("Grading configuration synced successfully.");
        } catch (err) {
            showSnack(err.response?.data?.message || "Failed to save config.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Reset to default grading scale? This will overwrite current settings.")) return;
        setGradingScale(DEFAULT_SCALE);
        await saveConfig(DEFAULT_SCALE, config);
    };

    const openEdit = (idx) => {
        const row = idx === null ? { grade: "", minPct: 0, maxPct: 100, points: 0 } : gradingScale[idx];
        setEditForm({ ...row });
        setEditDialog({ open: true, idx });
    };

    const handleSaveRow = async () => {
        if (!editForm.grade) return showSnack("Grade letter is required.", "warning");
        const newScale = [...gradingScale];
        if (editDialog.idx === null) {
            newScale.push({ ...editForm });
        } else {
            newScale[editDialog.idx] = { ...editForm };
        }
        setGradingScale(newScale);
        setEditDialog({ open: false, idx: null });
        await saveConfig(newScale, config);
    };

    const handleDeleteRow = async (idx) => {
        if (!window.confirm(`Remove grade "${gradingScale[idx].grade}" from scale?`)) return;
        const newScale = gradingScale.filter((_, i) => i !== idx);
        setGradingScale(newScale);
        await saveConfig(newScale, config);
    };

    const handleConfigChange = async (key, val) => {
        const newCfg = { ...config, [key]: val };
        setConfig(newCfg);
        await saveConfig(gradingScale, newCfg);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Grading & Assessment Configuration</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>DEFINE ASSESSMENT STANDARDS, GPA SCALARS, AND TRANSCRIPT GENERATION PROTOCOLS</Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: "0.9rem" } }}>
                <Tab icon={<AutoGraph sx={{ fontSize: 20 }} />} iconPosition="start" label="Grading Scales" />
                <Tab icon={<LockClock sx={{ fontSize: 20 }} />} iconPosition="start" label="Submission Controls" />
                <Tab icon={<Description sx={{ fontSize: 20 }} />} iconPosition="start" label="Transcript Protocols" />
            </Tabs>

            {/* ── TAB 0: Grading Scales ── */}
            {subTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={900}>Global GPA & Scale Matrix</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{gradingScale.length} grade levels configured</Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" startIcon={<Add />} onClick={() => openEdit(null)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Grade</Button>
                                    <Button variant="outlined" startIcon={<Refresh />} onClick={handleReset} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Reset to Defaults</Button>
                                </Stack>
                            </Box>

                            {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {["Letter Grade", "Percentage Range", "GPA Points / 4.0", "Actions"].map(h => (
                                                    <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {gradingScale.map((g, i) => (
                                                <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                                    <TableCell><Chip label={g.grade} sx={{ fontWeight: 1000, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }} /></TableCell>
                                                    <TableCell sx={{ fontWeight: 800 }}>{g.minPct}% — {g.maxPct}%</TableCell>
                                                    <TableCell sx={{ fontWeight: 1000 }}>{Number(g.points).toFixed(1)}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Edit Grade"><IconButton size="small" onClick={() => openEdit(i)}><Edit fontSize="small" /></IconButton></Tooltip>
                                                        <Tooltip title="Remove Grade"><IconButton size="small" color="error" onClick={() => handleDeleteRow(i)}><Delete fontSize="small" /></IconButton></Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            <Button fullWidth variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />} onClick={() => saveConfig()} disabled={saving}
                                sx={{ mt: 4, borderRadius: 3, fontWeight: 900, py: 1.5 }}>
                                {saving ? "Syncing…" : "Commit Multi-Scale Sync"}
                            </Button>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Scalar Calculation Logic</Typography>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <TextField select fullWidth label="Calculation Type" size="small" value={config.calcType} onChange={e => handleConfigChange("calcType", e.target.value)}>
                                    <MenuItem value="weighted">Weighted Average</MenuItem>
                                    <MenuItem value="cumulative">Simple Cumulative</MenuItem>
                                </TextField>
                                <Box>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary">PASSING THRESHOLD (%)</Typography>
                                    <Slider value={config.threshold} step={5} marks min={0} max={100} valueLabelDisplay="auto"
                                        onChange={(_, v) => handleConfigChange("threshold", v)} />
                                </Box>
                                <Divider sx={{ opacity: 0.1 }} />
                                <FormControlLabel control={<Switch checked={config.roundGPA} onChange={e => handleConfigChange("roundGPA", e.target.checked)} />}
                                    label={<Typography variant="body2" fontWeight={800}>Round up GPA decimals</Typography>} />
                                <FormControlLabel control={<Switch checked={config.curving} onChange={e => handleConfigChange("curving", e.target.checked)} />}
                                    label={<Typography variant="body2" fontWeight={800}>Enable relative curving</Typography>} />
                                <Button variant="contained" startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Save />} onClick={() => saveConfig()} disabled={saving}
                                    sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                                    {saving ? "Saving…" : "Save Config"}
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── TAB 1: Submission Controls ── */}
            {subTab === 1 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Typography variant="h6" fontWeight={900} gutterBottom>Faculty Grade Submission Engine</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Configure the operational window for grade entry and automated result calculation.</Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: "Mid-Term Lock", desc: "Automated submission cut-off for semester mid-terms.", statusKey: "midTermLock" },
                            { title: "Final Grade Freeze", desc: "Prevents modification after registrar approval.", statusKey: "finalFreeze" },
                            { title: "Late Entry Penalty", desc: "Automated GPA reduction for overdue faculty submissions.", statusKey: "latePenalty" }
                        ].map((rule, i) => (
                            <Grid item xs={12} key={i}>
                                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.03), borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={900}>{rule.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{rule.desc}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip label={config[rule.statusKey] ? "Armed" : "Inactive"} size="small" sx={{ fontWeight: 1000, bgcolor: config[rule.statusKey] ? "error.main" : "grey.800", color: "white" }} />
                                        <Switch checked={!!config[rule.statusKey]} onChange={(e) => handleConfigChange(rule.statusKey, e.target.checked)} />
                                        <Tooltip title="Edit Rule"><IconButton><Edit fontSize="small" /></IconButton></Tooltip>
                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            )}

            {/* ── TAB 2: Transcript Protocols ── */}
            {subTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Transcript Composition</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Customize the official document layout for students and external verification.</Typography>
                            <Stack spacing={2}>
                                {[
                                    { label: "Show Individual Subject Weights", key: "showWeights" },
                                    { label: "Include Dean Signature", key: "deanSig" },
                                    { label: "Display Academic Probity Notices", key: "probity" },
                                    { label: "Watermark Official Seal", key: "watermark" },
                                    { label: "QR Verification Node", key: "qrNode" }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <Typography variant="body2" fontWeight={800}>{item.label}</Typography>
                                        <Switch checked={!!config[item.key]} onChange={(e) => handleConfigChange(item.key, e.target.checked)} size="small" />
                                    </Box>
                                ))}
                                <Button fullWidth variant="outlined" startIcon={<Calculate />} sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }}
                                    onClick={() => showSnack("GPA mass recalculation queued for all students.", "info")}>
                                    Trigger GPA Mass Recalculation
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, border: "1px solid rgba(56,189,248,0.3)", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                            <Box sx={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, bgcolor: "primary.main", filter: "blur(100px)", opacity: 0.15, borderRadius: "50%" }} />
                            <Box sx={{ zIndex: 1 }}>
                                <AssignmentTurnedIn sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
                                <Typography variant="h6" fontWeight={900}>Transcriptor Preview Live</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>DOCUMENT_ENGINE_V2_ONLINE</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Edit Grade Dialog */}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, idx: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {editDialog.idx === null ? "Add Grade Level" : "Edit Grade Level"}
                    <IconButton onClick={() => setEditDialog({ open: false, idx: null })} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label="Grade Letter" value={editForm.grade} onChange={e => setEditForm({ ...editForm, grade: e.target.value.toUpperCase() })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} inputProps={{ maxLength: 2 }} />
                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth label="Min %" type="number" value={editForm.minPct} onChange={e => setEditForm({ ...editForm, minPct: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                            <TextField fullWidth label="Max %" type="number" value={editForm.maxPct} onChange={e => setEditForm({ ...editForm, maxPct: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        </Stack>
                        <TextField fullWidth label="GPA Points" type="number" value={editForm.points} onChange={e => setEditForm({ ...editForm, points: Number(e.target.value) })} inputProps={{ step: 0.5, min: 0, max: 4 }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditDialog({ open: false, idx: null })} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSaveRow} sx={{ borderRadius: 2, fontWeight: 900 }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
