import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tabs, Tab, LinearProgress, Divider, alpha, InputAdornment,
    FormControl, InputLabel, Select,
} from "@mui/material";
import {
    Search, Warning as WarningIcon, School, CheckCircle, PersonAdd,
    TrendingUp, Assignment, Add as AddIcon, Visibility, Close as CloseIcon,
    ErrorOutline, PendingActions, SwapHoriz, Gavel, Print, Download,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { usersAPI, enrollmentsAPI, attendanceAPI, notificationsAPI } from "../../../services/api";

const GRADIENTS = {
    primary: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    secondary: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    premium: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
};

const GPA_SCALE = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, D: 1.0, F: 0.0 };

function computeGPA(enrollments) {
    if (!enrollments || enrollments.length === 0) return "N/A";
    const graded = enrollments.filter(e => e.grade && GPA_SCALE[e.grade] !== undefined);
    if (graded.length === 0) return "N/A";
    const sum = graded.reduce((acc, e) => acc + (GPA_SCALE[e.grade] || 0), 0);
    return (sum / graded.length).toFixed(2);
}

export default function StudentsTab({ courses, department, user, advisors }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCourse, setFilterCourse] = useState("all");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openProfile, setOpenProfile] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [openGraduation, setOpenGraduation] = useState(false);
    const [openAddDrop, setOpenAddDrop] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [warningType, setWarningType] = useState("academic_warning");
    const [addDropRequests] = useState([
        { id: 1, studentName: "John Doe", courseFrom: "CS301", courseTo: "CS302", reason: "Schedule conflict", status: "pending" },
        { id: 2, studentName: "Sara Ali", courseFrom: "MATH201", courseTo: "MATH202", reason: "Prerequisite completed", status: "pending" },
    ]);
    const [complaints] = useState([
        { id: 1, studentName: "Ahmed Al-Rashid", type: "Grade Appeal", message: "Final exam grade seems incorrect.", status: "open", date: "2026-06-01" },
        { id: 2, studentName: "Fatima Hassan", type: "Faculty Complaint", message: "Attendance not being tracked correctly.", status: "under_review", date: "2026-05-28" },
    ]);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 16,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchStudents(); fetchEnrollments(); fetchAttendance(); }, [department]);

    const fetchStudents = async () => {
        try {
            const res = await usersAPI.getAll();
            const all = res.data || [];
            setStudents(all.filter(u => u.role === "student" && u.department === department));
        } catch (e) { console.error(e); }
    };

    const fetchEnrollments = async () => {
        try {
            const res = await enrollmentsAPI.getAll({ department });
            setEnrollments(res.data || []);
        } catch (e) { console.error(e); }
    };

    const fetchAttendance = async () => {
        try {
            const courseIds = courses.map(c => c._id);
            if (courseIds.length === 0) return;
            const res = await attendanceAPI.get({ department });
            setAttendance(res.data || []);
        } catch (e) { console.error(e); }
    };

    const getStudentEnrollments = (studentId) =>
        enrollments.filter(e => e.studentId === studentId || e.userId === studentId);

    const getStudentAttendance = (studentId) =>
        attendance.filter(a => a.studentId === studentId);

    const getAttendanceRate = (studentId) => {
        const att = getStudentAttendance(studentId);
        if (att.length === 0) return "N/A";
        const present = att.filter(a => a.status === "present").length;
        return Math.round((present / att.length) * 100) + "%";
    };

    const filteredStudents = students.filter(s => {
        const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
        const matchCourse = filterCourse === "all" || getStudentEnrollments(s._id).some(e => e.courseId === filterCourse);
        return matchSearch && matchCourse;
    });

    const handleIssueWarning = async () => {
        try {
            await notificationsAPI.create({
                userId: selectedStudent._id,
                title: warningType === "probation" ? "Academic Probation Notice" : "Academic Warning",
                message: warningText,
                type: warningType,
                issuedBy: user?._id || user?.uid,
                department,
            });
            setOpenWarning(false);
            setWarningText("");
        } catch (e) { console.error(e); }
    };

    const handleOpenStudent = (student) => {
        setSelectedStudent(student);
        setOpenProfile(true);
    };

    const subTabs = ["Student List", "Attendance", "Add/Drop Requests", "Complaints & Appeals"];

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5 }}>Student Oversight</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        ACADEMIC PROGRESS • ATTENDANCE • WARNINGS • GRADUATION
                    </Typography>
                </Box>
                <Chip label={`${students.length} Students`} sx={{ fontWeight: 900, bgcolor: alpha("#6366f1", 0.1), color: "#6366f1" }} />
            </Box>

            <Tabs value={activeSubTab} onChange={(_, v) => setActiveSubTab(v)} sx={{
                mb: 3,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                "& .MuiTab-root": { fontWeight: 800, textTransform: "none" }
            }}>
                {subTabs.map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {/* Student List */}
            {activeSubTab === 0 && (
                <Box>
                    {/* Filters */}
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <TextField size="small" placeholder="Search by name or email…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
                            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField select size="small" label="Filter by Course" value={filterCourse}
                            onChange={e => setFilterCourse(e.target.value)} sx={{ minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                            <MenuItem value="all">All Courses</MenuItem>
                            {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.code} — {c.name}</MenuItem>)}
                        </TextField>
                    </Stack>

                    <Grid container spacing={3}>
                        {filteredStudents.map(student => {
                            const studentEnr = getStudentEnrollments(student._id);
                            const gpa = computeGPA(studentEnr);
                            const attRate = getAttendanceRate(student._id);
                            const gpaNum = parseFloat(gpa);
                            const isAtRisk = !isNaN(gpaNum) && gpaNum < 2.0;

                            return (
                                <Grid item xs={12} md={6} lg={4} key={student._id}>
                                    <Card sx={{ ...glass, transition: "0.3s", "&:hover": { transform: "translateY(-4px)" } }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                                    <Avatar sx={{ width: 44, height: 44, background: isAtRisk ? GRADIENTS.danger : GRADIENTS.premium, fontWeight: 900 }}>
                                                        {student.name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={900}>{student.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>{student.email}</Typography>
                                                    </Box>
                                                </Box>
                                                {isAtRisk && <Chip label="AT RISK" size="small" sx={{ bgcolor: alpha("#ef4444", 0.1), color: "#ef4444", fontWeight: 900, fontSize: "0.6rem" }} />}
                                            </Box>
                                            <Divider sx={{ my: 1.5, opacity: 0.1 }} />
                                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                                {[
                                                    { label: "GPA", value: gpa, color: gpaNum >= 3.0 ? "#10b981" : gpaNum >= 2.0 ? "#f59e0b" : "#ef4444" },
                                                    { label: "Courses", value: studentEnr.length },
                                                    { label: "Attendance", value: attRate },
                                                    { label: "Year", value: student.academicYear || student.year || "-" },
                                                ].map((item, i) => (
                                                    <Grid item xs={6} key={i}>
                                                        <Box sx={{ p: 1, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ fontSize: "0.6rem" }}>{item.label}</Typography>
                                                            <Typography variant="body2" fontWeight={900} color={item.color || "text.primary"}>{item.value}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Stack direction="row" spacing={1}>
                                                <Button fullWidth size="small" variant="outlined" startIcon={<Visibility />} onClick={() => handleOpenStudent(student)}
                                                    sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none", fontSize: "0.75rem" }}>
                                                    Profile
                                                </Button>
                                                <Button size="small" variant="outlined" color="warning" startIcon={<WarningIcon />}
                                                    onClick={() => { setSelectedStudent(student); setOpenWarning(true); }}
                                                    sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none", fontSize: "0.75rem", minWidth: 0, px: 1.5 }}>
                                                    Warn
                                                </Button>
                                                <Button size="small" variant="outlined" color="success" startIcon={<CheckCircle />}
                                                    onClick={() => { setSelectedStudent(student); setOpenGraduation(true); }}
                                                    sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none", fontSize: "0.75rem", minWidth: 0, px: 1.5 }}>
                                                    Clear
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                        {filteredStudents.length === 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ ...glass, p: 6, textAlign: "center" }}>
                                    <School sx={{ fontSize: 60, color: "text.secondary", opacity: 0.2, mb: 2 }} />
                                    <Typography color="text.secondary" fontWeight={700}>No students found</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Attendance Overview */}
            {activeSubTab === 1 && (
                <Box>
                    <TableContainer sx={{ ...glass }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                    {courses.slice(0, 5).map(c => (
                                        <TableCell key={c._id} align="center" sx={{ fontWeight: 900, fontSize: "0.7rem" }}>{c.code}</TableCell>
                                    ))}
                                    <TableCell align="center" sx={{ fontWeight: 900 }}>Overall</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.slice(0, 20).map(s => {
                                    const attRate = getAttendanceRate(s._id);
                                    const attNum = parseInt(attRate) || 0;
                                    return (
                                        <TableRow key={s._id} sx={{ "&:hover": { bgcolor: alpha("#fff", 0.02) } }}>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", background: GRADIENTS.premium }}>{s.name?.[0]}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={800}>{s.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{s.studentId || s._id?.slice(-6)}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            {courses.slice(0, 5).map(c => {
                                                const courseAtt = attendance.filter(a => a.courseId === c._id && a.studentId === s._id);
                                                const pct = courseAtt.length > 0 ? Math.round(courseAtt.filter(a => a.status === "present").length / courseAtt.length * 100) : null;
                                                return (
                                                    <TableCell key={c._id} align="center">
                                                        {pct !== null ? (
                                                            <Chip label={`${pct}%`} size="small" sx={{
                                                                fontWeight: 900, fontSize: "0.65rem",
                                                                bgcolor: pct >= 75 ? alpha("#10b981", 0.1) : pct >= 60 ? alpha("#f59e0b", 0.1) : alpha("#ef4444", 0.1),
                                                                color: pct >= 75 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444",
                                                            }} />
                                                        ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell align="center">
                                                <Box>
                                                    <Typography variant="body2" fontWeight={900}
                                                        color={attNum >= 75 ? "#10b981" : attNum >= 60 ? "#f59e0b" : "#ef4444"}>
                                                        {attRate}
                                                    </Typography>
                                                    <LinearProgress variant="determinate" value={attNum || 0}
                                                        sx={{
                                                            height: 4, borderRadius: 2, mt: 0.5, bgcolor: alpha("#94a3b8", 0.1),
                                                            "& .MuiLinearProgress-bar": { borderRadius: 2, bgcolor: attNum >= 75 ? "#10b981" : attNum >= 60 ? "#f59e0b" : "#ef4444" }
                                                        }} />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Add/Drop Requests */}
            {activeSubTab === 2 && (
                <Box>
                    <Grid container spacing={3}>
                        {addDropRequests.map(req => (
                            <Grid item xs={12} md={6} key={req.id}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                                <Avatar sx={{ background: GRADIENTS.secondary }}>{req.studentName[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={900}>{req.studentName}</Typography>
                                                    <Chip label="PENDING REVIEW" size="small" sx={{ bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b", fontWeight: 900, fontSize: "0.6rem" }} />
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                            <Chip label={req.courseFrom} size="small" sx={{ fontWeight: 900 }} />
                                            <SwapHoriz color="action" />
                                            <Chip label={req.courseTo} size="small" color="primary" sx={{ fontWeight: 900 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{req.reason}</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button fullWidth size="small" variant="contained" color="success"
                                                sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                            <Button fullWidth size="small" variant="outlined" color="error"
                                                sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Complaints & Appeals */}
            {activeSubTab === 3 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Message</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 900 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complaints.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell fontWeight={800}>{c.studentName}</TableCell>
                                    <TableCell><Chip label={c.type} size="small" sx={{ fontWeight: 800, fontSize: "0.65rem" }} /></TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{c.date}</TableCell>
                                    <TableCell>
                                        <Chip label={c.status.replace(/_/g, " ").toUpperCase()} size="small" sx={{
                                            fontWeight: 900, fontSize: "0.6rem",
                                            bgcolor: c.status === "open" ? alpha("#f59e0b", 0.1) : alpha("#6366f1", 0.1),
                                            color: c.status === "open" ? "#f59e0b" : "#6366f1",
                                        }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="text" sx={{ fontWeight: 800 }}>Respond</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Student Profile Dialog */}
            <Dialog open={openProfile} onClose={() => setOpenProfile(false)} maxWidth="md" fullWidth
                PaperProps={{ sx: { ...glass, backgroundImage: "none" } }}>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={1000}>Student Profile</Typography>
                    <IconButton onClick={() => setOpenProfile(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (() => {
                        const enrs = getStudentEnrollments(selectedStudent._id);
                        const gpa = computeGPA(enrs);
                        return (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                                    <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2, fontSize: "2.5rem", background: GRADIENTS.premium }}>
                                        {selectedStudent.name?.[0]}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={900}>{selectedStudent.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedStudent.email}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    {[
                                        { label: "Student ID", value: selectedStudent.studentId || selectedStudent._id?.slice(-8) },
                                        { label: "Year", value: selectedStudent.academicYear || selectedStudent.year || "—" },
                                        { label: "GPA", value: gpa },
                                        { label: "Attendance", value: getAttendanceRate(selectedStudent._id) },
                                    ].map((item, i) => (
                                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={800}>{item.label}</Typography>
                                            <Typography variant="caption" fontWeight={900}>{item.value}</Typography>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="subtitle1" fontWeight={900} gutterBottom>Enrolled Courses</Typography>
                                    {enrs.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">No enrollment records</Typography>
                                    ) : (
                                        <Stack spacing={1}>
                                            {enrs.map((e, i) => (
                                                <Box key={i} sx={{ p: 2, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography variant="body2" fontWeight={800}>{e.courseCode || e.courseId}</Typography>
                                                    <Chip label={e.grade || "N/A"} size="small" sx={{
                                                        fontWeight: 900,
                                                        bgcolor: e.grade ? alpha("#10b981", 0.1) : alpha("#94a3b8", 0.1),
                                                        color: e.grade ? "#10b981" : "#94a3b8",
                                                    }} />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" fontWeight={900} gutterBottom>Generate Report</Typography>
                                        <Button variant="outlined" startIcon={<Print />} sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none", mr: 1 }}>
                                            Print Progress Report
                                        </Button>
                                        <Button variant="outlined" startIcon={<Download />} color="success" sx={{ borderRadius: 2.5, fontWeight: 800, textTransform: "none" }}>
                                            Export PDF
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* Warning Dialog */}
            <Dialog open={openWarning} onClose={() => setOpenWarning(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { ...glass, backgroundImage: "none" } }}>
                <DialogTitle fontWeight={1000} color="warning.main">Issue Academic Warning</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField select fullWidth label="Warning Type" value={warningType}
                            onChange={e => setWarningType(e.target.value)}>
                            <MenuItem value="academic_warning">Academic Warning</MenuItem>
                            <MenuItem value="probation">Academic Probation</MenuItem>
                            <MenuItem value="attendance_warning">Attendance Warning</MenuItem>
                            <MenuItem value="conduct_warning">Conduct Warning</MenuItem>
                        </TextField>
                        <TextField fullWidth multiline rows={4} label="Warning Message"
                            placeholder="Describe the reason for this warning…"
                            value={warningText} onChange={e => setWarningText(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenWarning(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={handleIssueWarning} sx={{ borderRadius: 2, fontWeight: 900 }}>
                        Issue Warning
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Graduation Clearance Dialog */}
            <Dialog open={openGraduation} onClose={() => setOpenGraduation(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { ...glass, backgroundImage: "none" } }}>
                <DialogTitle fontWeight={1000} color="success.main">Graduation Clearance</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Review graduation eligibility for <strong>{selectedStudent.name}</strong>
                            </Typography>
                            <Stack spacing={2}>
                                {[
                                    { label: "Minimum Credit Hours (120)", check: true },
                                    { label: "Minimum GPA ≥ 2.0", check: parseFloat(computeGPA(getStudentEnrollments(selectedStudent._id))) >= 2.0 },
                                    { label: "No Outstanding Fees", check: true },
                                    { label: "All Core Courses Passed", check: true },
                                    { label: "No Active Academic Probation", check: true },
                                ].map((item, i) => (
                                    <Box key={i} sx={{
                                        display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2,
                                        bgcolor: item.check ? alpha("#10b981", 0.05) : alpha("#ef4444", 0.05)
                                    }}>
                                        {item.check
                                            ? <CheckCircle sx={{ color: "#10b981" }} />
                                            : <ErrorOutline sx={{ color: "#ef4444" }} />}
                                        <Typography variant="body2" fontWeight={700}>{item.label}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenGraduation(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" color="success" sx={{ borderRadius: 2, fontWeight: 900 }}>
                        Approve Clearance
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
