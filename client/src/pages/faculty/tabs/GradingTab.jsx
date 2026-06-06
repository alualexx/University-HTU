import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tabs, Tab, Divider, alpha, LinearProgress,
    Select, FormControl, InputLabel,
} from "@mui/material";
import {
    Grade, CheckCircle, PendingActions, Send, Refresh,
    Add as AddIcon, Close as CloseIcon, School, TrendingUp,
    Assignment, ThumbUp, ThumbDown, Warning as WarningIcon,
    Download, Assessment,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { enrollmentsAPI, notificationsAPI } from "../../../services/api";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
};

const GRADE_OPTIONS = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "F", "IN", "W"];
const GPA_MAP = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, D: 1.0, F: 0.0, IN: null, W: null };

function gradeColor(grade) {
    if (!grade || grade === "N/A") return "#94a3b8";
    if (["A", "A-"].includes(grade)) return "#10b981";
    if (["B+", "B", "B-"].includes(grade)) return "#6366f1";
    if (["C+", "C"].includes(grade)) return "#f59e0b";
    if (grade === "D") return "#f97316";
    if (grade === "F") return "#ef4444";
    return "#94a3b8";
}

const RUBRIC_TEMPLATES = [
    { id: 1, name: "Midterm Exam Rubric", criteria: ["Content Knowledge (40%)", "Problem Solving (30%)", "Presentation (20%)", "References (10%)"] },
    { id: 2, name: "Assignment Rubric", criteria: ["Completeness (30%)", "Accuracy (40%)", "Formatting (20%)", "Originality (10%)"] },
    { id: 3, name: "Project Report Rubric", criteria: ["Introduction (15%)", "Methodology (25%)", "Results (30%)", "Discussion (20%)", "Conclusion (10%)"] },
];

export default function GradingTab({ courses, user, department }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [enrollments, setEnrollments] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]);
    const [openGradeModal, setOpenGradeModal] = useState(false);
    const [selectedEnr, setSelectedEnr] = useState(null);
    const [tempGrade, setTempGrade] = useState("");
    const [openRubric, setOpenRubric] = useState(false);
    const [openAppeal, setOpenAppeal] = useState(false);
    const [pendingApprovals, setPendingApprovals] = useState([]);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 16,
    };

    useEffect(() => { fetchAllEnrollments(); }, [department]);

    useEffect(() => {
        if (selectedCourse) fetchCourseEnrollments(selectedCourse);
    }, [selectedCourse]);

    const fetchAllEnrollments = async () => {
        try {
            const res = await enrollmentsAPI.getAll({ department });
            const data = res.data || [];
            setAllEnrollments(data);
            setPendingApprovals(data.filter(e => e.gradeStatus === "submitted" || e.gradeStatus === "pending_approval"));
        } catch (e) { console.error(e); }
    };

    const fetchCourseEnrollments = async (courseId) => {
        try {
            const res = await enrollmentsAPI.getAll({ courseId });
            setEnrollments(res.data || []);
        } catch (e) { console.error(e); }
    };

    const handleSaveGrade = async () => {
        if (!selectedEnr || !tempGrade) return;
        try {
            await enrollmentsAPI.update(selectedEnr._id || selectedEnr.id, {
                grade: tempGrade,
                gradeStatus: "submitted",
                gradedAt: new Date().toISOString(),
                gradedBy: user?._id || user?.uid,
            });
            setOpenGradeModal(false);
            setTempGrade("");
            fetchCourseEnrollments(selectedCourse);
        } catch (e) { console.error(e); }
    };

    const handleApproveGrade = async (enrId) => {
        try {
            await enrollmentsAPI.update(enrId, { gradeStatus: "approved", approvedBy: user?._id || user?.uid, approvedAt: new Date().toISOString() });
            fetchAllEnrollments();
        } catch (e) { console.error(e); }
    };

    const handleForwardToRegistrar = async () => {
        try {
            const approved = allEnrollments.filter(e => e.gradeStatus === "approved");
            for (const enr of approved) {
                await enrollmentsAPI.update(enr._id, { gradeStatus: "forwarded_to_registrar" });
            }
            fetchAllEnrollments();
            alert(`${approved.length} grade records forwarded to Registrar.`);
        } catch (e) { console.error(e); }
    };

    // Grade distribution data for chart
    const gradeDistribution = GRADE_OPTIONS.filter(g => !["IN", "W"].includes(g)).map(grade => ({
        grade,
        count: enrollments.filter(e => e.grade === grade).length,
        fill: gradeColor(grade),
    })).filter(d => d.count > 0);

    // GPA computation
    const computeStudentGPA = (studentId) => {
        const studentEnrs = allEnrollments.filter(e => e.studentId === studentId && e.grade && GPA_MAP[e.grade] !== null);
        if (studentEnrs.length === 0) return null;
        const sum = studentEnrs.reduce((acc, e) => acc + (GPA_MAP[e.grade] || 0), 0);
        return (sum / studentEnrs.length).toFixed(2);
    };

    const gradeAppeals = [
        { id: 1, studentName: "Sara Mohammed", courseCode: "CS301", currentGrade: "C+", requestedGrade: "B-", reason: "Midterm calculation error", date: "2026-06-01" },
        { id: 2, studentName: "Khalid Ali", courseCode: "MATH201", currentGrade: "D", requestedGrade: "C", reason: "Final exam attendance not counted", date: "2026-05-30" },
    ];

    const subTabs = ["Gradebook", "HOD Approval Queue", "Grade Appeals", "GPA Overview", "Rubric Templates"];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Grading & Assessment</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        GRADE MANAGEMENT • APPROVAL WORKFLOW • GPA TRACKING
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Send />} onClick={handleForwardToRegistrar}
                    sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Forward Approved to Registrar
                </Button>
            </Box>

            <Tabs value={activeSubTab} onChange={(_, v) => setActiveSubTab(v)} sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none", fontSize: "0.85rem" }
            }}>
                {subTabs.map((t, i) => (
                    <Tab key={i} label={i === 1 ? `${t} (${pendingApprovals.length})` : t} />
                ))}
            </Tabs>

            {/* Gradebook */}
            {activeSubTab === 0 && (
                <Box>
                    <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
                        <TextField select label="Select Course" value={selectedCourse}
                            onChange={e => setSelectedCourse(e.target.value)} sx={{ minWidth: 300 }}>
                            {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code} — {c.name}</MenuItem>)}
                        </TextField>
                        {selectedCourse && (
                            <Chip label={`${enrollments.length} students`} sx={{ fontWeight: 900, bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }} />
                        )}
                    </Box>

                    {selectedCourse && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={900} gutterBottom>Student Gradebook</Typography>
                                        {enrollments.length > 0 ? (
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 900 }}>Grade</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 900 }}>Status</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 900 }}>GPA Points</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 900 }}>Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {enrollments.map(enr => (
                                                            <TableRow key={enr._id || enr.id} sx={{ "&:hover": { bgcolor: alpha("#fff", 0.01) } }}>
                                                                <TableCell>
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", background: GRADIENTS.premium }}>
                                                                            {enr.studentName?.[0] || "S"}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight={800}>{enr.studentName || "Student"}</Typography>
                                                                            <Typography variant="caption" color="text.secondary">{enr.studentId?.slice(-6) || enr.userId?.slice(-6)}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip label={enr.grade || "N/A"} size="small" sx={{
                                                                        fontWeight: 900, bgcolor: alpha(gradeColor(enr.grade), 0.1), color: gradeColor(enr.grade),
                                                                    }} />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Chip label={(enr.gradeStatus || "not_graded").replace(/_/g, " ").toUpperCase()}
                                                                        size="small" sx={{
                                                                            fontWeight: 900, fontSize: "0.6rem",
                                                                            bgcolor: enr.gradeStatus === "approved" ? alpha("#10b981", 0.1) :
                                                                                enr.gradeStatus === "submitted" ? alpha("#f59e0b", 0.1) : alpha("#94a3b8", 0.1),
                                                                            color: enr.gradeStatus === "approved" ? "#10b981" :
                                                                                enr.gradeStatus === "submitted" ? "#f59e0b" : "#94a3b8"
                                                                        }} />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Typography variant="body2" fontWeight={900} color={enr.grade ? gradeColor(enr.grade) : "text.secondary"}>
                                                                        {enr.grade && GPA_MAP[enr.grade] !== null ? GPA_MAP[enr.grade]?.toFixed(1) : "—"}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Button size="small" onClick={() => { setSelectedEnr(enr); setTempGrade(enr.grade || ""); setOpenGradeModal(true); }}
                                                                        sx={{ fontWeight: 800, textTransform: "none" }}>
                                                                        {enr.grade ? "Update" : "Grade"}
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box sx={{ py: 6, textAlign: "center" }}>
                                                <School sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                                <Typography color="text.secondary">No students enrolled in this course</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Grade Distribution Chart */}
                            <Grid item xs={12} lg={4}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight={900} gutterBottom>Grade Distribution</Typography>
                                        {gradeDistribution.length > 0 ? (
                                            <Box sx={{ height: 280 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={gradeDistribution}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                                        <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontWeight: 700, fontSize: 12 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: 700, fontSize: 12 }} />
                                                        <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                                                            {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        ) : (
                                            <Box sx={{ py: 6, textAlign: "center" }}>
                                                <Assessment sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2 }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Grade data will appear here</Typography>
                                            </Box>
                                        )}
                                        <Divider sx={{ my: 2 }} />
                                        <Stack spacing={1}>
                                            {[
                                                { label: "Total Students", value: enrollments.length },
                                                { label: "Graded", value: enrollments.filter(e => e.grade).length },
                                                { label: "Passed (≥C)", value: enrollments.filter(e => e.grade && !["D", "F"].includes(e.grade)).length },
                                                { label: "Failed (F/D)", value: enrollments.filter(e => ["D", "F"].includes(e.grade)).length },
                                            ].map((item, i) => (
                                                <Box key={i} sx={{ display: "flex", justifyContent: "space-between" }}>
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

                    {!selectedCourse && (
                        <Box sx={{ ...glass, p: 8, textAlign: "center" }}>
                            <Grade sx={{ fontSize: 64, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" fontWeight={700}>Select a course to view the gradebook</Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* HOD Approval Queue */}
            {activeSubTab === 1 && (
                <Box>
                    {pendingApprovals.length === 0 ? (
                        <Box sx={{ ...glass, p: 8, textAlign: "center" }}>
                            <CheckCircle sx={{ fontSize: 64, color: "#10b981", opacity: 0.4, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" fontWeight={700}>No pending grade approvals</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ ...glass }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Course</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 900 }}>Grade</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Submitted By</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingApprovals.map(enr => (
                                        <TableRow key={enr._id}>
                                            <TableCell fontWeight={800}>{enr.studentName || "Student"}</TableCell>
                                            <TableCell><Chip label={enr.courseCode || enr.courseId?.slice(-6)} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell align="center">
                                                <Chip label={enr.grade} size="small" sx={{ fontWeight: 900, bgcolor: alpha(gradeColor(enr.grade), 0.1), color: gradeColor(enr.grade) }} />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>{enr.gradedByName || "Faculty"}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Button size="small" variant="contained" color="success" startIcon={<ThumbUp />}
                                                        onClick={() => handleApproveGrade(enr._id)}
                                                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                    <Button size="small" variant="outlined" color="error" startIcon={<ThumbDown />}
                                                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Return</Button>
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

            {/* Grade Appeals */}
            {activeSubTab === 2 && (
                <Grid container spacing={3}>
                    {gradeAppeals.map(appeal => (
                        <Grid item xs={12} md={6} key={appeal.id}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                            <Avatar sx={{ background: GRADIENTS.warning }}>{appeal.studentName[0]}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={900}>{appeal.studentName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{appeal.date}</Typography>
                                            </Box>
                                        </Box>
                                        <Chip label={appeal.courseCode} size="small" sx={{ fontWeight: 900 }} />
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                        <Chip label={appeal.currentGrade} size="small" sx={{ bgcolor: alpha(gradeColor(appeal.currentGrade), 0.1), color: gradeColor(appeal.currentGrade), fontWeight: 900 }} />
                                        <Typography variant="caption" color="text.secondary">→ requested →</Typography>
                                        <Chip label={appeal.requestedGrade} size="small" sx={{ bgcolor: alpha(gradeColor(appeal.requestedGrade), 0.1), color: gradeColor(appeal.requestedGrade), fontWeight: 900 }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{appeal.reason}</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button size="small" variant="contained" color="success" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>
                                            Approve Appeal
                                        </Button>
                                        <Button size="small" variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>
                                            Reject
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* GPA Overview */}
            {activeSubTab === 3 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>GPA Distribution by Course</Typography>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={courses.map(c => {
                                            const courseEnrs = allEnrollments.filter(e => e.courseId === c._id && e.grade && GPA_MAP[e.grade] !== null);
                                            const avg = courseEnrs.length > 0 ? courseEnrs.reduce((a, e) => a + (GPA_MAP[e.grade] || 0), 0) / courseEnrs.length : 0;
                                            return { name: c.code, gpa: parseFloat(avg.toFixed(2)) };
                                        })}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha("#94a3b8", 0.1)} />
                                            <XAxis dataKey="name" tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[0, 4]} tick={{ fontWeight: 700, fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                                            <Bar dataKey="gpa" radius={[6, 6, 0, 0]} barSize={36} fill="#6366f1" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass, background: GRADIENTS.premium, color: "white" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={900} gutterBottom>Department GPA Summary</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {[
                                        { label: "Total Enrollments", value: allEnrollments.length },
                                        { label: "Graded Records", value: allEnrollments.filter(e => e.grade).length },
                                        { label: "A/A- Students", value: allEnrollments.filter(e => ["A", "A-"].includes(e.grade)).length },
                                        { label: "Failing Students", value: allEnrollments.filter(e => e.grade === "F").length },
                                        { label: "Incomplete (IN)", value: allEnrollments.filter(e => e.grade === "IN").length },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", pb: 1 }}>
                                            <Typography variant="body2" fontWeight={700} sx={{ opacity: 0.7 }}>{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={900}>{item.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Rubric Templates */}
            {activeSubTab === 4 && (
                <Grid container spacing={3}>
                    {RUBRIC_TEMPLATES.map(rubric => (
                        <Grid item xs={12} md={4} key={rubric.id}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", gap: 1.5, mb: 2, alignItems: "center" }}>
                                        <Avatar sx={{ background: GRADIENTS.premium }}><Assignment /></Avatar>
                                        <Typography variant="subtitle1" fontWeight={900}>{rubric.name}</Typography>
                                    </Box>
                                    <Stack spacing={1}>
                                        {rubric.criteria.map((cr, i) => (
                                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#6366f1" }} />
                                                <Typography variant="body2" fontWeight={700}>{cr}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                    <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>
                                        Use Template
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...glass, border: "2px dashed", borderColor: "divider" }}>
                            <CardContent sx={{ p: 3, textAlign: "center", py: 6 }}>
                                <AddIcon sx={{ fontSize: 40, color: "text.secondary", opacity: 0.4, mb: 1 }} />
                                <Typography variant="subtitle1" fontWeight={900} color="text.secondary">New Rubric Template</Typography>
                                <Button variant="outlined" sx={{ mt: 2, borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>
                                    Create Template
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Grade Entry Dialog */}
            <Dialog open={openGradeModal} onClose={() => setOpenGradeModal(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderRadius: 4 } }}>
                <DialogTitle fontWeight={1000}>
                    {selectedEnr?.grade ? "Update Grade" : "Enter Grade"}: {selectedEnr?.studentName || "Student"}
                </DialogTitle>
                <DialogContent>
                    <TextField select fullWidth label="Final Grade" value={tempGrade}
                        onChange={e => setTempGrade(e.target.value)} sx={{ mt: 2 }}>
                        {GRADE_OPTIONS.map(g => <MenuItem key={g} value={g}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: gradeColor(g) }} />{g}</Box></MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenGradeModal(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button onClick={handleSaveGrade} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, background: GRADIENTS.premium }}>
                        Save Grade
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
