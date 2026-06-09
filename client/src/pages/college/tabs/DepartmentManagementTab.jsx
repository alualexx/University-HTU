import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tabs, Tab, alpha, LinearProgress, Divider,
} from "@mui/material";
import {
    Add, Edit, Delete, CheckCircle, Warning, Business, People, School,
    TrendingUp, SwapHoriz, VerifiedUser, Assessment,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { departmentsAPI, coursesAPI } from "../../../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from "recharts";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
};

export default function DepartmentManagementTab({ college, departments, setDepartments, pendingCourses, setPendingCourses }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [form, setForm] = useState({ name: "", code: "", faculty: "", headName: "", headEmail: "", color: "#6366f1" });
    const [saving, setSaving] = useState(false);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const handleOpen = (dept = null) => {
        setEditingDept(dept);
        setForm(dept ? { name: dept.name, code: dept.code, faculty: dept.faculty || "", headName: dept.headName || "", headEmail: dept.headEmail || "", color: dept.color || "#6366f1" } : { name: "", code: "", faculty: "", headName: "", headEmail: "", color: "#6366f1" });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!college) return;
        setSaving(true);
        try {
            if (editingDept) {
                await departmentsAPI.update(editingDept._id || editingDept.id, form);
            } else {
                await departmentsAPI.create({ ...form, collegeId: college._id || college.id, parentCollege: college.name });
            }
            const res = await departmentsAPI.getAll({ collegeId: college._id || college.id });
            setDepartments(res.data || []);
            setOpenDialog(false);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleDelete = async (dept) => {
        if (!window.confirm(`Remove department "${dept.name}"?`)) return;
        try {
            await departmentsAPI.delete(dept._id || dept.id);
            setDepartments(prev => prev.filter(d => (d._id || d.id) !== (dept._id || dept.id)));
        } catch (e) { console.error(e); }
    };

    const handleApproveCourse = async (course) => {
        try {
            await coursesAPI.update(course._id || course.id, { status: "pending_registrar_approval" });
            setPendingCourses && setPendingCourses(prev => prev.filter(c => (c._id || c.id) !== (course._id || course.id)));
        } catch (e) { console.error(e); }
    };

    const handleRejectCourse = async (course) => {
        try {
            await coursesAPI.update(course._id || course.id, { status: "rejected_by_college" });
            setPendingCourses && setPendingCourses(prev => prev.filter(c => (c._id || c.id) !== (course._id || course.id)));
        } catch (e) { console.error(e); }
    };

    const deptPerf = departments.map(d => ({
        name: d.code || d.name?.slice(0, 8),
        students: d.studentCount || Math.floor(Math.random() * 200 + 60),
        color: d.color || "#6366f1",
    }));

    const subTabs = ["Departments", "Program Proposals", "Performance", "Budget Requests"];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Department Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        DEPARTMENTS • HOD ASSIGNMENT • PROGRAMS • BUDGETS
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}
                    sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Add Department
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {subTabs.map((t, i) => <Tab key={i} label={t === "Program Proposals" ? `${t} (${pendingCourses?.length || 0})` : t} />)}
            </Tabs>

            {/* Departments Grid */}
            {subTab === 0 && (
                <Grid container spacing={3}>
                    {(departments || []).map(dept => (
                        <Grid item xs={12} sm={6} md={4} key={dept._id || dept.id}>
                            <Card sx={{ ...glass, transition: "0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                        <Box>
                                            <Chip label={dept.code} size="small" sx={{ bgcolor: alpha(dept.color || "#6366f1", 0.1), color: dept.color || "#6366f1", fontWeight: 900, mb: 1 }} />
                                            <Typography variant="subtitle1" fontWeight={1000}>{dept.name}</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton size="small" onClick={() => handleOpen(dept)}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(dept)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                                        </Stack>
                                    </Box>
                                    <Divider sx={{ my: 1.5, opacity: 0.1 }} />
                                    <Stack spacing={1}>
                                        {[
                                            { label: "Head of Dept", value: dept.headName || "Unassigned" },
                                            { label: "Faculty", value: dept.faculty || "—" },
                                            { label: "Students", value: dept.studentCount || "—" },
                                        ].map((item, i) => (
                                            <Box key={i} sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={800}>{item.label}</Typography>
                                                <Typography variant="caption" fontWeight={900}>{item.value}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                        <Button size="small" variant="outlined" fullWidth sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none", fontSize: "0.7rem" }}>
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {(departments || []).length === 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ ...glass, p: 8, textAlign: "center" }}>
                                <Business sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                <Typography color="text.secondary" fontWeight={700}>No departments registered yet</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Program Proposals (Course Approvals) */}
            {subTab === 1 && (
                <Box>
                    {(!pendingCourses || pendingCourses.length === 0) ? (
                        <Box sx={{ ...glass, p: 8, textAlign: "center" }}>
                            <CheckCircle sx={{ fontSize: 60, color: "#10b981", opacity: 0.4, mb: 2 }} />
                            <Typography color="text.secondary" fontWeight={700}>No program proposals awaiting approval</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ ...glass }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Course / Module</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Code</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Target</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Instructor</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Credits</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(pendingCourses || []).map(course => (
                                        <TableRow key={course._id || course.id}>
                                            <TableCell sx={{ fontWeight: 800 }}>{course.name}</TableCell>
                                            <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{course.code}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{course.department}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Yr {course.year} Sem {course.semester}</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{course.instructorName || "—"}</TableCell>
                                            <TableCell><Chip label={`${course.credits || 3} cr`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Button size="small" variant="contained" color="success" onClick={() => handleApproveCourse(course)}
                                                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                    <Button size="small" variant="outlined" color="error" onClick={() => handleRejectCourse(course)}
                                                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* Performance Chart */}
            {subTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Student Enrollment by Department</Typography>
                                <Box sx={{ height: 320 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={deptPerf}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis dataKey="name" tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <RTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Bar dataKey="students" radius={[6, 6, 0, 0]} barSize={36}>
                                                {deptPerf.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Department Summary</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {[
                                        { label: "Total Departments", value: departments.length },
                                        { label: "Departments w/ HOD", value: departments.filter(d => d.headName).length },
                                        { label: "Accredited Depts", value: departments.filter(d => d.accreditationStatus === "accredited").length },
                                        { label: "Avg Students/Dept", value: departments.length ? Math.round(deptPerf.reduce((a, d) => a + d.students, 0) / departments.length) : 0 },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${alpha("#94a3b8", 0.1)}`, pb: 1 }}>
                                            <Typography variant="body2" color="text.secondary" fontWeight={700}>{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={900}>{item.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Budget Requests */}
            {subTab === 3 && (
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Department budget requests pending dean approval this fiscal year.</Typography>
                    {[
                        { dept: "Computer Science", amount: 12000, reason: "New lab equipment", status: "pending" },
                        { dept: "Engineering", amount: 25000, reason: "Research tooling and licenses", status: "pending" },
                        { dept: "Business", amount: 8000, reason: "Conference & workshop funding", status: "approved" },
                    ].map((req, i) => (
                        <Card key={i} sx={{ ...glass, mb: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ background: GRADIENTS.premium }}><Business /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={900}>{req.dept} Department</Typography>
                                            <Typography variant="caption" color="text.secondary">{req.reason}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="h6" fontWeight={1000} color="#6366f1">${req.amount.toLocaleString()}</Typography>
                                        {req.status === "pending" ? (
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" variant="contained" color="success" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                <Button size="small" variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                            </Stack>
                                        ) : (
                                            <Chip label="APPROVED" size="small" sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", fontWeight: 900 }} />
                                        )}
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Add/Edit Department Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>{editingDept ? "Edit Department" : "Add New Department"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Department Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <TextField fullWidth label="Department Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                        <TextField fullWidth label="Faculty Area" value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} placeholder="e.g. Engineering Sciences" />
                        <TextField fullWidth label="Head of Department (Name)" value={form.headName} onChange={e => setForm({ ...form, headName: e.target.value })} />
                        <TextField fullWidth label="HOD Email" value={form.headEmail} onChange={e => setForm({ ...form, headEmail: e.target.value })} />
                        <Box>
                            <Typography variant="caption" fontWeight={800} gutterBottom>Department Color</Typography>
                            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: "100%", height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}
                        sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>{saving ? "Saving…" : "Save"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
