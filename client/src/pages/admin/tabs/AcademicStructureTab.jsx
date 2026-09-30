import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Grid, Card, Typography, Stack, Button, IconButton, Avatar, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, Divider, TextField, MenuItem, useTheme, alpha,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
    Snackbar, Alert, Tooltip
} from "@mui/material";
import {
    AccountTree, Business, People, School, Add, Edit, Delete,
    Search, CheckCircle, Warning, Close, Save
} from "@mui/icons-material";
import { collegesAPI, departmentsAPI, usersAPI } from "../../../services/api";

export default function AcademicStructureTab() {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [leaderSearch, setLeaderSearch] = useState("");
    const [deptSearch, setDeptSearch] = useState("");
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

    // Dialog state
    const [dialog, setDialog] = useState({ open: false, mode: "college", editData: null });
    const [form, setForm] = useState({ name: "", code: "", deanId: "", status: "active", description: "", credits: "", type: "Core", collegeId: "" });
    const [saving, setSaving] = useState(false);

    const glassStyle = {
        background: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.05)",
    };

    const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [colRes, deptRes, userRes] = await Promise.all([
                collegesAPI.getAll(),
                departmentsAPI.getAll(),
                usersAPI.getAll(),
            ]);
            setColleges(colRes.data || []);
            setDepartments(deptRes.data || []);
            setUsers(userRes.data || []);
        } catch (err) {
            showSnack("Failed to load structure data", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDialog = (mode, editData = null) => {
        setDialog({ open: true, mode, editData });
        if (editData) {
            setForm({
                name: editData.name || "",
                code: editData.code || "",
                deanId: editData.deanId || editData.dean?._id || "",
                status: editData.status || "active",
                description: editData.description || "",
                credits: editData.creditHours || editData.credits || "",
                type: editData.type || "Core",
                collegeId: editData.collegeId || editData.college?._id || "",
            });
        } else {
            setForm({ name: "", code: "", deanId: "", status: "active", description: "", credits: "", type: "Core", collegeId: "" });
        }
    };
    const closeDialog = () => { setDialog({ open: false, mode: "college", editData: null }); setSaving(false); };

    const handleSave = async () => {
        if (!form.name) return showSnack("Name is required.", "warning");
        setSaving(true);
        try {
            const { mode, editData } = dialog;
            if (mode === "college") {
                if (!form.code) return showSnack("College code is required.", "warning");
                let deanName = "Unassigned";
                let deanEmail = "unassigned@university.edu";
                if (form.deanId) {
                    const selectedDean = users.find(u => (u._id || u.id) === form.deanId);
                    if (selectedDean) {
                        deanName = selectedDean.name;
                        deanEmail = selectedDean.email;
                    }
                }
                const payload = {
                    name: form.name,
                    code: form.code,
                    deanId: form.deanId || undefined,
                    deanName,
                    deanEmail,
                    status: form.status,
                    description: form.description
                };
                if (editData) await collegesAPI.update(editData._id || editData.id, payload);
                else await collegesAPI.create(payload);
                showSnack(editData ? "College updated." : "College provisioned.");
            } else {
                const payload = { name: form.name, collegeId: form.collegeId || undefined, description: form.description, creditHours: form.credits, type: form.type };
                if (editData) await departmentsAPI.update(editData._id || editData.id, payload);
                else await departmentsAPI.create(payload);
                showSnack(editData ? "Department updated." : "Department created.");
            }
            closeDialog();
            fetchData();
        } catch (err) {
            showSnack(err.response?.data?.message || "Save failed.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (type, item) => {
        if (!window.confirm(`Delete "${item.name}"? This action cannot be undone.`)) return;
        try {
            if (type === "college") await collegesAPI.delete(item._id || item.id);
            else await departmentsAPI.delete(item._id || item.id);
            showSnack(`${item.name} removed.`);
            fetchData();
        } catch {
            showSnack("Delete failed.", "error");
        }
    };

    // Computed metrics
    const activeColleges = colleges.filter(c => c.status === "Active").length;
    const totalDepts = departments.length;
    const totalPrograms = departments.reduce((s, d) => s + (d.programs?.length || 0), 0);
    const accredited = colleges.filter(c => c.status === "Active").length;
    const accRate = colleges.length ? Math.round((accredited / colleges.length) * 100) : 0;

    // Dean lookup
    const deanUsers = users.filter(u => u.role === "college_admin" || u.role === "faculty" || u.role === "admin" || u.role === "teacher");
    const getDean = (col) => {
        if (col.dean && typeof col.dean === "object") return col.dean.name || "—";
        if (col.deanId) {
            const u = users.find(u => u._id === col.deanId || u.id === col.deanId);
            return u?.name || "—";
        }
        return col.deanName || "—";
    };

    const filteredDesns = colleges.filter(c => getDean(c).toLowerCase().includes(leaderSearch.toLowerCase()) || c.name.toLowerCase().includes(leaderSearch.toLowerCase()));
    const filteredDepts = departments.filter(d => d.name?.toLowerCase().includes(deptSearch.toLowerCase()) || d.collegeId?.toString().includes(deptSearch.toLowerCase()));

    const CollegeStatusChip = ({ status }) => (
        <Chip label={status} size="small" sx={{
            fontWeight: 900, fontSize: "0.6rem", textTransform: 'capitalize',
            bgcolor: alpha(status === "active" ? "#10b981" : "#f59e0b", 0.1),
            color: status === "active" ? "#10b981" : "#f59e0b"
        }} icon={status === "active" ? <CheckCircle sx={{ fontSize: "0.85rem !important" }} /> : <Warning sx={{ fontSize: "0.85rem !important" }} />} />
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Academic & Structural Governance</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE HIERARCHICAL ENTITIES, LEADERSHIP ASSIGNMENTS, AND PROGRAM LIFECYCLES</Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: "0.9rem" } }}>
                <Tab icon={<AccountTree sx={{ fontSize: 20 }} />} iconPosition="start" label="Entity Hierarchy" />
                <Tab icon={<People sx={{ fontSize: 20 }} />} iconPosition="start" label="Leadership Registry" />
                <Tab icon={<School sx={{ fontSize: 20 }} />} iconPosition="start" label="Department Portfolio" />
            </Tabs>

            {/* ── TAB 0: Entity Hierarchy ── */}
            {subTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={900}>College Ecosystem</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{colleges.length} colleges registered</Typography>
                                </Box>
                                <Button variant="contained" startIcon={<Add />} onClick={() => openDialog("college")} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Provision New College</Button>
                            </Box>
                            {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {["Operational Entity", "Dean / Head", "Departments", "Status", "Actions"].map(h => (
                                                    <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {colleges.map((col, i) => {
                                                const deptCount = departments.filter(d => d.collegeId === (col._id || col.id) || d.college === (col._id || col.id)).length;
                                                return (
                                                    <TableRow key={col._id || i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                                        <TableCell sx={{ fontWeight: 800 }}>{col.name}</TableCell>
                                                        <TableCell>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem", bgcolor: alpha(theme.palette.primary.main, 0.2) }}>{getDean(col)[0]}</Avatar>
                                                                <Typography variant="body2" fontWeight={700}>{getDean(col)}</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 900, color: "primary.main" }}>{deptCount || col.departments?.length || 0}</TableCell>
                                                        <TableCell><CollegeStatusChip status={col.status || "active"} /></TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Edit"><IconButton size="small" onClick={() => openDialog("college", col)}><Edit fontSize="small" /></IconButton></Tooltip>
                                                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete("college", col)}><Delete fontSize="small" /></IconButton></Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {colleges.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, opacity: 0.4 }}>No colleges found. Provision one above.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, height: "100%" }}>
                            <Typography variant="h6" fontWeight={900} gutterBottom>Structural Insights</Typography>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                {[
                                    { label: "Total Colleges", value: colleges.length },
                                    { label: "Total Departments", value: totalDepts },
                                    { label: "Active Programs", value: totalPrograms || "—" },
                                    { label: "Accreditation Rate", value: `${accRate}%` },
                                ].map((stat, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", pb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={700}>{stat.label}</Typography>
                                        <Typography variant="body2" fontWeight={1000}>{stat.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                            {colleges.some(c => c.status !== "active") && (
                                <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.warning.main, 0.08), borderRadius: 3, border: "1px solid rgba(245,158,11,0.2)" }}>
                                    <Typography variant="caption" fontWeight={800} color="warning.main" sx={{ display: "block", mb: 1 }}>OPERATIONAL_ALERT</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {colleges.filter(c => c.status !== "active").map(c => c.name).join(", ")} require accreditation renewal.
                                    </Typography>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ── TAB 1: Leadership Registry ── */}
            {subTab === 1 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={900}>Leadership Registry</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={800}>DEAN & HEAD OF DEPARTMENT (HOD) ASSIGNMENT MATRIX</Typography>
                        </Box>
                        <TextField placeholder="Search personnel..." size="small" value={leaderSearch} onChange={e => setLeaderSearch(e.target.value)}
                            sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                            InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
                        />
                    </Box>
                    {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                        <Grid container spacing={3}>
                            {filteredDesns.map((c, i) => (
                                <Grid item xs={12} sm={6} md={4} key={c._id || i}>
                                    <Card sx={{ bgcolor: "rgba(255,255,255,0.02)", borderRadius: 4, p: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: "primary.main", fontWeight: 900 }}>{getDean(c)[0] || "?"}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={900}>{getDean(c)}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={800}>DEAN • {c.name}</Typography>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ my: 2, opacity: 0.1 }} />
                                        <Button fullWidth size="small" variant="outlined" onClick={() => openDialog("college", c)} sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>
                                            Reassign Leadership
                                        </Button>
                                    </Card>
                                </Grid>
                            ))}
                            {filteredDesns.length === 0 && <Grid item xs={12}><Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>No matching leaders found.</Typography></Grid>}
                        </Grid>
                    )}
                </Card>
            )}

            {/* ── TAB 2: Department Portfolio ── */}
            {subTab === 2 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={900}>Department Portfolio</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{departments.length} departments across {colleges.length} colleges</Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <TextField placeholder="Search departments…" size="small" value={deptSearch} onChange={e => setDeptSearch(e.target.value)}
                                sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
                            />
                            <Button variant="contained" startIcon={<Add />} onClick={() => openDialog("dept")} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Add Department</Button>
                        </Stack>
                    </Box>
                    {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box> : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {["Department Name", "College", "Code", "Status", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDepts.map((dept, i) => {
                                        const college = colleges.find(c => c._id === dept.collegeId || c.id === dept.collegeId || c._id === dept.college);
                                        return (
                                            <TableRow key={dept._id || i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                                <TableCell sx={{ fontWeight: 800 }}>{dept.name}</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>{college?.name || dept.collegeName || "—"}</TableCell>
                                                <TableCell sx={{ fontWeight: 900, color: "primary.main" }}>{dept.code || "—"}</TableCell>
                                                <TableCell>
                                                    <Chip label={dept.status || "Active"} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha(dept.status === "Inactive" ? "#ef4444" : "#10b981", 0.1), color: dept.status === "Inactive" ? "#ef4444" : "#10b981" }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openDialog("dept", dept)}><Edit fontSize="small" /></IconButton></Tooltip>
                                                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete("dept", dept)}><Delete fontSize="small" /></IconButton></Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredDepts.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, opacity: 0.4 }}>No departments found.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            )}

            {/* ── Create / Edit Dialog ── */}
            <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
                <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {dialog.editData ? `Edit ${dialog.mode === "college" ? "College" : "Department"}` : `Provision New ${dialog.mode === "college" ? "College" : "Department"}`}
                    <IconButton onClick={closeDialog} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField fullWidth label={dialog.mode === "college" ? "College Name" : "Department Name"} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        {dialog.mode === "college" ? (
                            <>
                                <TextField fullWidth label="College Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. ENG" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                                <TextField select fullWidth label="Assign Dean" value={form.deanId} onChange={e => setForm({ ...form, deanId: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    <MenuItem value="">No Dean Assigned</MenuItem>
                                    {deanUsers.map(u => <MenuItem key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.email})</MenuItem>)}
                                </TextField>
                                <TextField select fullWidth label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="pending_provisioning">Pending Provisioning</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </TextField>
                            </>
                        ) : (
                            <>
                                <TextField select fullWidth label="Parent College" value={form.collegeId} onChange={e => setForm({ ...form, collegeId: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    <MenuItem value="">No College</MenuItem>
                                    {colleges.map(c => <MenuItem key={c._id || c.id} value={c._id || c.id}>{c.name}</MenuItem>)}
                                </TextField>
                                <TextField select fullWidth label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    <MenuItem value="Core">Core</MenuItem>
                                    <MenuItem value="Elective">Elective</MenuItem>
                                    <MenuItem value="Specialized">Specialized</MenuItem>
                                </TextField>
                            </>
                        )}
                        <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeDialog} sx={{ borderRadius: 2, fontWeight: 900 }}>Cancel</Button>
                    <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />} onClick={handleSave} disabled={saving} sx={{ borderRadius: 2, fontWeight: 900 }}>
                        {saving ? "Saving…" : dialog.editData ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
