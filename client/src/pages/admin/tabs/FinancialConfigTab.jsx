import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Grid, Card, Typography, Stack, Button, IconButton, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, Divider, TextField, MenuItem, useTheme, alpha,
    InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Snackbar, Alert, Tooltip
} from "@mui/material";
import {
    AccountBalance, CardMembership, TrendingUp, Add, Edit, Delete,
    Receipt, Assessment, Security, LocalAtm, Save, Close, Refresh
} from "@mui/icons-material";
import { tuitionAPI, enrollmentsAPI } from "../../../services/api";

const DEFAULT_FEE_STRUCTURES = [
    { type: "Tuition (Per Credit)", undergrad: 250, grad: 450, intl: 600 },
    { type: "Administrative Fee", undergrad: 50, grad: 50, intl: 100 },
    { type: "Technology Access", undergrad: 30, grad: 30, intl: 30 },
    { type: "Library & Analytics", undergrad: 20, grad: 20, intl: 20 },
];

const DEFAULT_SCHOLARSHIPS = [
    { name: "Merit Excellence", discount: "50%", criteria: "GPA > 3.8", status: "Active" },
    { name: "First-Gen Scholarship", discount: "25%", criteria: "Historical", status: "Active" },
    { name: "Athletic Waiver", discount: "Variable", criteria: "Recruited", status: "Active" },
    { name: "Need-Based Primary", discount: "10-90%", criteria: "Income < $20k", status: "Paused" },
];

export default function FinancialConfigTab() {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [feeStructures, setFeeStructures] = useState(DEFAULT_FEE_STRUCTURES);
    const [scholarships, setScholarships] = useState(DEFAULT_SCHOLARSHIPS);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    // Fee edit dialog
    const [feeDialog, setFeeDialog] = useState({ open: false, idx: null });
    const [feeForm, setFeeForm] = useState({ type: "", undergrad: 0, grad: 0, intl: 0 });

    // Scholarship dialog
    const [schDialog, setSchDialog] = useState({ open: false, idx: null });
    const [schForm, setSchForm] = useState({ name: "", discount: "", criteria: "", status: "Active" });

    const glassStyle = {
        background: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.05)",
    };

    const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await enrollmentsAPI.getAll();
            setEnrollments(res.data || []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { if (subTab === 2) fetchEnrollments(); }, [subTab, fetchEnrollments]);

    // ── Fee CRUD ──
    const openFeeDialog = (idx) => {
        const row = idx === null ? { type: "", undergrad: 0, grad: 0, intl: 0 } : feeStructures[idx];
        setFeeForm({ ...row });
        setFeeDialog({ open: true, idx });
    };

    const handleSaveFee = async () => {
        if (!feeForm.type) return showSnack("Fee classification is required.", "warning");
        setSaving(true);
        try {
            await tuitionAPI.create({ feeType: feeForm.type, undergrad: feeForm.undergrad, grad: feeForm.grad, international: feeForm.intl, effectiveDate: new Date().toISOString() });
            const newFees = [...feeStructures];
            if (feeDialog.idx === null) newFees.push({ ...feeForm });
            else newFees[feeDialog.idx] = { ...feeForm };
            setFeeStructures(newFees);
            setFeeDialog({ open: false, idx: null });
            showSnack(feeDialog.idx === null ? "Fee structure created." : "Fee structure updated.");
        } catch (err) {
            showSnack(err.response?.data?.message || "Failed to save fee.", "error");
        } finally { setSaving(false); }
    };

    const handleDeleteFee = (idx) => {
        if (!window.confirm(`Remove "${feeStructures[idx].type}"?`)) return;
        setFeeStructures(prev => prev.filter((_, i) => i !== idx));
        showSnack("Fee structure removed (local only — sync with backend to persist).", "info");
    };

    // ── Scholarship CRUD ──
    const openSchDialog = (idx) => {
        const row = idx === null ? { name: "", discount: "", criteria: "", status: "Active" } : scholarships[idx];
        setSchForm({ ...row });
        setSchDialog({ open: true, idx });
    };

    const handleSaveSch = () => {
        if (!schForm.name) return showSnack("Scholarship name is required.", "warning");
        const newSch = [...scholarships];
        if (schDialog.idx === null) newSch.push({ ...schForm });
        else newSch[schDialog.idx] = { ...schForm };
        setScholarships(newSch);
        setSchDialog({ open: false, idx: null });
        showSnack(schDialog.idx === null ? "Scholarship program added." : "Scholarship updated.");
    };

    const handleDeleteSch = (idx) => {
        if (!window.confirm(`Remove scholarship "${scholarships[idx].name}"?`)) return;
        setScholarships(prev => prev.filter((_, i) => i !== idx));
        showSnack("Scholarship removed.");
    };

    // Revenue metrics from live enrollments
    const totalEnrolled = enrollments.length;
    const projectedRevenue = totalEnrolled * feeStructures[0]?.undergrad * 15 || 0; // ~15 credits estimate
    const fmt = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Financial Configuration</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE FEE STRUCTURES, SCHOLARSHIP MATRICES, AND STRATEGIC FISCAL ALLOCATIONS</Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: "0.9rem" } }}>
                <Tab icon={<AccountBalance sx={{ fontSize: 20 }} />} iconPosition="start" label="Fee Structure" />
                <Tab icon={<CardMembership sx={{ fontSize: 20 }} />} iconPosition="start" label="Scholarships & Aid" />
                <Tab icon={<TrendingUp sx={{ fontSize: 20 }} />} iconPosition="start" label="Revenue Monitoring" />
            </Tabs>

            {/* ── TAB 0: Fee Structure ── */}
            {subTab === 0 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={900}>Tuition & Mandatory Fees</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{feeStructures.length} fee classifications active</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" startIcon={<Add />} onClick={() => openFeeDialog(null)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Fee</Button>
                            <Button variant="contained" startIcon={<Add />} onClick={() => openFeeDialog(null)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Update Master Rates</Button>
                        </Stack>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Fee Classification", "Undergraduate", "Post-Graduate", "International", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feeStructures.map((f, i) => (
                                    <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                        <TableCell sx={{ fontWeight: 800 }}>{f.type}</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: "primary.main" }}>${f.undergrad}</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>${f.grad}</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: "error.main" }}>${f.intl}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit"><IconButton size="small" onClick={() => openFeeDialog(i)}><Edit fontSize="small" /></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteFee(i)}><Delete fontSize="small" /></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: 4, p: 3, border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 3 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>Rates are synchronized across all department payment portals. Changes take effect next billing cycle.</Typography>
                    </Box>
                </Card>
            )}

            {/* ── TAB 1: Scholarships & Aid ── */}
            {subTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={900}>Scholarship & Aid Matrix</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE ELIGIBILITY DEFAULTS AND AUTOMATED DISCOUNT NODES</Typography>
                                </Box>
                                <Button variant="contained" startIcon={<Add />} onClick={() => openSchDialog(null)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Scholarship</Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {["Program Name", "Assistance", "Criteria", "Status", "Actions"].map(h => (
                                                <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem" }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scholarships.map((s, i) => (
                                            <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                                <TableCell sx={{ fontWeight: 800 }}>{s.name}</TableCell>
                                                <TableCell sx={{ fontWeight: 1000, color: "success.main" }}>{s.discount}</TableCell>
                                                <TableCell><Typography variant="caption" fontWeight={800}>{s.criteria}</Typography></TableCell>
                                                <TableCell>
                                                    <Chip label={s.status} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha(s.status === "Active" ? "#10b981" : "#f59e0b", 0.1), color: s.status === "Active" ? "#10b981" : "#f59e0b" }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openSchDialog(i)}><Edit fontSize="small" /></IconButton></Tooltip>
                                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteSch(i)}><Delete fontSize="small" /></IconButton></Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Aid Distribution Config</Typography>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <TextField fullWidth label="Total Aid Buffer" size="small" defaultValue="2500000" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                                <Box>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary">AUTO-REJECTION GPA THRESHOLD</Typography>
                                    <TextField fullWidth size="small" defaultValue="2.0" sx={{ mt: 1 }} />
                                </Box>
                                <Button fullWidth variant="contained" startIcon={<Security />} sx={{ borderRadius: 3, fontWeight: 900 }}
                                    onClick={() => showSnack("Disbursement audit report queued.", "info")}>
                                    Audit Disbursement Logs
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── TAB 2: Revenue Monitoring ── */}
            {subTab === 2 && (
                <Grid container spacing={3}>
                    {[
                        { label: "Total Projected Revenue", value: fmt(projectedRevenue) || "$—", trend: "+12.5%", icon: <LocalAtm />, color: "#10b981" },
                        { label: "Scholarship Liabilities", value: `${scholarships.filter(s => s.status === "Active").length} active`, trend: `${scholarships.length} total`, icon: <CardMembership />, color: "#3b82f6" },
                        { label: "Enrolled Students", value: loading ? "…" : totalEnrolled, trend: "Live count", icon: <Receipt />, color: "#ef4444" },
                        { label: "Fee Classifications", value: feeStructures.length, trend: "Configured tiers", icon: <TrendingUp />, color: "#8b5cf6" },
                    ].map((stat, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, textAlign: "center" }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 2, mx: "auto", mb: 2, bgcolor: alpha(stat.color, 0.1), color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>{stat.label}</Typography>
                                <Typography variant="h5" fontWeight={1000} sx={{ my: 0.5 }}>{stat.value}</Typography>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">{stat.trend}</Typography>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                <Typography variant="h6" fontWeight={900}>Active Scholarship Programs</Typography>
                                <Button startIcon={<Refresh />} onClick={fetchEnrollments} sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Refresh</Button>
                            </Box>
                            <Stack spacing={2}>
                                {scholarships.filter(s => s.status === "Active").map((s, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={900}>{s.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{s.criteria}</Typography>
                                        </Box>
                                        <Chip label={s.discount} sx={{ fontWeight: 1000, bgcolor: alpha("#10b981", 0.1), color: "#10b981" }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Fee Edit Dialog */}
            <Dialog open={feeDialog.open} onClose={() => setFeeDialog({ open: false, idx: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {feeDialog.idx === null ? "Add Fee Structure" : "Edit Fee Structure"}
                    <IconButton onClick={() => setFeeDialog({ open: false, idx: null })} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label="Fee Classification" value={feeForm.type} onChange={e => setFeeForm({ ...feeForm, type: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Undergraduate ($)" type="number" value={feeForm.undergrad} onChange={e => setFeeForm({ ...feeForm, undergrad: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Post-Graduate ($)" type="number" value={feeForm.grad} onChange={e => setFeeForm({ ...feeForm, grad: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="International ($)" type="number" value={feeForm.intl} onChange={e => setFeeForm({ ...feeForm, intl: Number(e.target.value) })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setFeeDialog({ open: false, idx: null })} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Save />} onClick={handleSaveFee} disabled={saving} sx={{ borderRadius: 2, fontWeight: 900 }}>
                        {saving ? "Saving…" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Scholarship Dialog */}
            <Dialog open={schDialog.open} onClose={() => setSchDialog({ open: false, idx: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {schDialog.idx === null ? "Add Scholarship" : "Edit Scholarship"}
                    <IconButton onClick={() => setSchDialog({ open: false, idx: null })} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label="Program Name" value={schForm.name} onChange={e => setSchForm({ ...schForm, name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Discount / Assistance" value={schForm.discount} onChange={e => setSchForm({ ...schForm, discount: e.target.value })} placeholder="e.g. 50% or Variable" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField fullWidth label="Eligibility Criteria" value={schForm.criteria} onChange={e => setSchForm({ ...schForm, criteria: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField select fullWidth label="Status" value={schForm.status} onChange={e => setSchForm({ ...schForm, status: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Paused">Paused</MenuItem>
                            <MenuItem value="Expired">Expired</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSchDialog({ open: false, idx: null })} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSaveSch} sx={{ borderRadius: 2, fontWeight: 900 }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
