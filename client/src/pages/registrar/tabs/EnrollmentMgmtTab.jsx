import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Avatar, Chip, useTheme, Grid, IconButton, Tabs, Tab, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip,
    LinearProgress, Stepper, Step, StepLabel, StepContent, Paper,
    FormControl, InputLabel, Select, RadioGroup, FormControlLabel, Radio,
    InputAdornment, Collapse, CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Search, HowToReg, PersonAdd, PersonRemove, WarningAmber,
    CheckCircle, Lock, LockOpen, Class, SwapHoriz, Download,
    ListAlt, School, BookmarkAdd, SwitchAccount, FiberNew,
    PersonSearch, AssignmentTurnedIn, FilterList, Refresh
} from "@mui/icons-material";

// ─────────────────────────────────────────────────────────────────────────────
// Registration Type Selector Card
// ─────────────────────────────────────────────────────────────────────────────
function RegistrationTypeSelector({ value, onChange }) {
    const theme = useTheme();
    const types = [
        {
            id: "new",
            label: "New Student Registration",
            sub: "First-time enrollment — assign student to program, college and initial courses.",
            icon: <FiberNew sx={{ fontSize: 40 }} />,
            color: "#6366f1",
            badge: "ADMISSION",
        },
        {
            id: "existing",
            label: "Existing Student Registration",
            sub: "Semester course registration for currently enrolled students.",
            icon: <SwitchAccount sx={{ fontSize: 40 }} />,
            color: "#10b981",
            badge: "RETURNING",
        },
    ];
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {types.map((t) => (
                <Grid item xs={12} md={6} key={t.id}>
                    <Card
                        onClick={() => onChange(t.id)}
                        sx={{
                            p: 4, borderRadius: 5, cursor: "pointer",
                            border: value === t.id
                                ? `2px solid ${t.color}`
                                : `2px solid ${alpha(t.color, 0.15)}`,
                            background: value === t.id
                                ? alpha(t.color, 0.07)
                                : "transparent",
                            transition: "all 0.25s ease",
                            "&:hover": { border: `2px solid ${t.color}`, transform: "translateY(-2px)" },
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                            <Avatar sx={{ bgcolor: alpha(t.color, 0.12), color: t.color, width: 64, height: 64, borderRadius: 3 }}>
                                {t.icon}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                                    <Typography variant="h6" fontWeight={1000}>{t.label}</Typography>
                                    <Chip label={t.badge} size="small" sx={{ bgcolor: alpha(t.color, 0.12), color: t.color, fontWeight: 1000, fontSize: "0.6rem" }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary">{t.sub}</Typography>
                            </Box>
                            {value === t.id && (
                                <CheckCircle sx={{ color: t.color, fontSize: 28, mt: 0.5, flexShrink: 0 }} />
                            )}
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pending Applications Queue (Phase 2 - Registrar Approval)
// ─────────────────────────────────────────────────────────────────────────────
function PendingApplicationsQueue({ students, glassStyle, setStudents }) {
    const [loadingMap, setLoadingMap] = useState({});

    // Filter applicants currently awaiting registrar approval
    const pendingApplicants = students.filter(s => s.admissionStatus === "pending_registrar");

    const handleApprove = async (studentId) => {
        setLoadingMap(p => ({ ...p, [studentId]: true }));
        try {
            // Import usersAPI dynamically or assume it's passed/available context global
            // Quick workaround: we'll use a dynamic import or fetch
            const { usersAPI } = await import("../../../services/api");
            await usersAPI.patch(studentId, { admissionStatus: "pending_admin_provision" });

            // Update local state to remove them from this queue
            if (setStudents) {
                setStudents(prev => prev.map(s => s._id === studentId ? { ...s, admissionStatus: "pending_admin_provision" } : s));
            } else {
                window.location.reload(); // Fallback if no setStudents prop
            }
        } catch (err) {
            alert(`Approval failed: ${err.message}`);
        } finally {
            setLoadingMap(p => ({ ...p, [studentId]: false }));
        }
    };

    return (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h6" fontWeight={1000}>
                    <FiberNew sx={{ mr: 1, verticalAlign: "middle", color: "#6366f1" }} />
                    Pending Web Applications ({pendingApplicants.length})
                </Typography>
                <Chip label="ACTION REQUIRED" color="warning" size="small" sx={{ fontWeight: 900 }} />
            </Box>

            {pendingApplicants.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <CheckCircle sx={{ fontSize: 64, color: "#10b981", opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" fontWeight={900}>Queue is Empty</Typography>
                    <Typography variant="body2" color="text.secondary">All online registration applications have been processed.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {pendingApplicants.map(applicant => (
                        <Grid item xs={12} key={applicant._id || applicant.id}>
                            <Card sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Avatar sx={{ bgcolor: alpha("#6366f1", 0.1), color: "#6366f1", width: 56, height: 56 }}>{applicant.name?.[0]}</Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={900}>{applicant.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{applicant.email} • {applicant.phone || "No Phone"}</Typography>

                                            <Stack direction="row" spacing={1} mt={1}>
                                                <Chip label={applicant.college} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", fontWeight: 800 }} />
                                                <Chip label={applicant.department} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", fontWeight: 800 }} />
                                            </Stack>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Button
                                            variant="outlined" color="error"
                                            sx={{ borderRadius: 3, fontWeight: 900 }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="contained" color="success"
                                            onClick={() => handleApprove(applicant._id || applicant.id)}
                                            disabled={loadingMap[applicant._id || applicant.id]}
                                            sx={{ borderRadius: 3, fontWeight: 900 }}
                                        >
                                            {loadingMap[applicant._id || applicant.id] ? <CircularProgress size={20} color="inherit" /> : "Approve Placement"}
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Card>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Existing Student Registration – Course Selection & Semester Form
// ─────────────────────────────────────────────────────────────────────────────
function ExistingStudentRegistrationForm({ students, courses, enrollments, glassStyle, onDropStudent }) {
    const theme = useTheme();
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [semester, setSemester] = useState("Fall 2026");
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [dropDialog, setDropDialog] = useState({ open: false, enrollment: null, reason: "" });

    const filtered = students.filter(s => {
        const q = search.toLowerCase();
        return !q || (s.name || "").toLowerCase().includes(q) || (s.studentId || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q);
    }).slice(0, 30);

    const activeCourses = courses.filter(c => c.status === "active");
    const studentEnrollments = enrollments.filter(e => e.studentId === selectedStudent?._id || e.studentId === selectedStudent?.id);

    const toggleCourse = (cid) => {
        setSelectedCourses(prev => prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]);
    };

    return (
        <Grid container spacing={3}>
            {/* Left – Student Picker */}
            <Grid item xs={12} md={4}>
                <Card sx={{ ...glassStyle, p: 3, borderRadius: 5, height: "100%" }}>
                    <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 2 }}>
                        <PersonSearch sx={{ mr: 1, verticalAlign: "middle", fontSize: 20 }} />
                        Select Student
                    </Typography>
                    <TextField
                        fullWidth size="small" placeholder="Search by name, ID, or email..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5, fontSize: 18 }} /> }}
                        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                        {filtered.map((s, i) => (
                            <Box
                                key={i}
                                onClick={() => { setSelectedStudent(s); setSelectedCourses([]); }}
                                sx={{
                                    p: 2, borderRadius: 3, cursor: "pointer", mb: 1,
                                    border: selectedStudent?._id === s._id || selectedStudent?.id === s.id
                                        ? "1.5px solid #10b981"
                                        : "1.5px solid rgba(255,255,255,0.05)",
                                    bgcolor: selectedStudent?._id === s._id || selectedStudent?.id === s.id
                                        ? alpha("#10b981", 0.06) : "transparent",
                                    transition: "all 0.2s",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.03)" }
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.primary.main, 0.1), fontSize: "0.8rem", fontWeight: 900 }}>
                                        {s.name?.[0]}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight={900} noWrap>{s.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{s.studentId || s.email}</Typography>
                                    </Box>
                                    <Chip
                                        label={`Y${s.year || 1}`} size="small"
                                        sx={{ fontWeight: 900, fontSize: "0.6rem" }}
                                    />
                                </Box>
                            </Box>
                        ))}
                        {filtered.length === 0 && (
                            <Box sx={{ textAlign: "center", py: 6 }}>
                                <PersonSearch sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                <Typography color="text.secondary" variant="body2">{search ? "No students found" : "Search to find a student"}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Grid>

            {/* Right – Course Selection */}
            <Grid item xs={12} md={8}>
                {!selectedStudent ? (
                    <Card sx={{ ...glassStyle, p: 6, borderRadius: 5, textAlign: "center", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <SwitchAccount sx={{ fontSize: 72, opacity: 0.15, mb: 2 }} />
                        <Typography variant="h6" fontWeight={900} sx={{ opacity: 0.6 }}>Select a student from the list</Typography>
                        <Typography variant="body2" color="text.secondary">Choose a student to view their current enrollments and register them for new courses.</Typography>
                    </Card>
                ) : (
                    <Stack spacing={3}>
                        {/* Student Header */}
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ width: 52, height: 52, bgcolor: alpha("#10b981", 0.12), color: "#10b981", fontWeight: 900, fontSize: "1.3rem" }}>
                                        {selectedStudent.name?.[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={1000}>{selectedStudent.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{selectedStudent.department || selectedStudent.intendedMajor || "—"} · {selectedStudent.studentId || selectedStudent.email}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                    <Chip label={`Year ${selectedStudent.year || 1}`} sx={{ fontWeight: 900 }} />
                                    <Chip label={selectedStudent.status || "Active"} color="success" sx={{ fontWeight: 900 }} />
                                    <Chip label={selectedStudent.feesCleared ? "FEES CLEARED" : "FEES PENDING"} color={selectedStudent.feesCleared ? "success" : "warning"} sx={{ fontWeight: 900 }} />
                                </Box>
                            </Box>
                        </Card>

                        {/* Current Enrollments */}
                        <Card sx={{ ...glassStyle, borderRadius: 5, overflow: "hidden" }}>
                            <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1" fontWeight={1000}>Current Enrollments ({studentEnrollments.length})</Typography>
                                <TextField select size="small" value={semester} onChange={e => setSemester(e.target.value)} sx={{ width: 160, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                    {["Fall 2026", "Spring 2026", "Summer 2026"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                            </Box>
                            {studentEnrollments.length > 0 ? (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                {["Course", "Credits", "Status", "Action"].map(h => (
                                                    <TableCell key={h} sx={{ fontWeight: 1000, fontSize: "0.65rem", textTransform: "uppercase", color: "text.secondary" }}>{h}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {studentEnrollments.map((e, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={900}>{e.courseName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{e.courseCode}</Typography>
                                                    </TableCell>
                                                    <TableCell><Chip label={`${e.credits || 3} CR`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                                    <TableCell><Chip label={(e.status || "pending").toUpperCase()} size="small" color={e.status === "approved" ? "success" : "warning"} sx={{ fontWeight: 900, fontSize: "0.6rem" }} /></TableCell>
                                                    <TableCell>
                                                        <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, fontSize: "0.65rem", py: 0.3 }}
                                                            onClick={() => setDropDialog({ open: true, enrollment: e, reason: "" })}>
                                                            Drop
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ p: 4, textAlign: "center" }}>
                                    <HowToReg sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                    <Typography color="text.secondary" variant="body2">No enrollments for this semester</Typography>
                                </Box>
                            )}
                        </Card>

                        {/* Add New Courses */}
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 5 }}>
                            <Typography variant="subtitle1" fontWeight={1000} sx={{ mb: 2 }}>
                                <BookmarkAdd sx={{ mr: 1, verticalAlign: "middle", fontSize: 20, color: "#10b981" }} />
                                Register for New Courses
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {activeCourses.slice(0, 9).map((c, i) => {
                                    const cid = c._id || c.id || c.code;
                                    const alreadyEnrolled = studentEnrollments.some(e => e.courseCode === c.code || e.courseId === cid);
                                    const sel = selectedCourses.includes(cid);
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card
                                                onClick={() => !alreadyEnrolled && toggleCourse(cid)}
                                                sx={{
                                                    p: 2, borderRadius: 3.5, cursor: alreadyEnrolled ? "not-allowed" : "pointer",
                                                    opacity: alreadyEnrolled ? 0.5 : 1,
                                                    border: sel ? "2px solid #10b981" : "2px solid rgba(255,255,255,0.06)",
                                                    bgcolor: alreadyEnrolled ? alpha("#94a3b8", 0.05) : sel ? alpha("#10b981", 0.07) : "transparent",
                                                    transition: "all 0.2s",
                                                    "&:hover": !alreadyEnrolled ? { border: "2px solid #10b981" } : {},
                                                }}
                                            >
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                                    <Chip label={c.code || "N/A"} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", fontFamily: "monospace", bgcolor: alpha("#10b981", 0.1), color: "#10b981" }} />
                                                    {alreadyEnrolled ? <Chip label="ENROLLED" size="small" sx={{ fontWeight: 900, fontSize: "0.55rem", bgcolor: alpha("#94a3b8", 0.1), color: "#94a3b8" }} /> :
                                                        sel && <CheckCircle sx={{ color: "#10b981", fontSize: 18 }} />}
                                                </Box>
                                                <Typography variant="body2" fontWeight={900}>{c.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{c.creditHours || 3} Credit Hours</Typography>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            {selectedCourses.length > 0 && (
                                <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>{selectedCourses.length} new course(s) selected for registration</Alert>
                            )}
                            <Button
                                fullWidth variant="contained" size="large"
                                disabled={selectedCourses.length === 0}
                                startIcon={<CheckCircle />}
                                sx={{ borderRadius: 3, py: 1.5, fontWeight: 900, background: "linear-gradient(135deg, #10b981, #059669)" }}
                            >
                                Confirm Course Registration
                            </Button>
                        </Card>
                    </Stack>
                )}
            </Grid>

            {/* Drop Dialog */}
            <Dialog open={dropDialog.open} onClose={() => setDropDialog({ open: false, enrollment: null, reason: "" })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Drop Course</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Dropping <strong>{dropDialog.enrollment?.courseName}</strong> for <strong>{selectedStudent?.name}</strong>.
                    </Typography>
                    <TextField fullWidth multiline rows={3} label="Reason for drop" value={dropDialog.reason}
                        onChange={e => setDropDialog(p => ({ ...p, reason: e.target.value }))}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDropDialog({ open: false, enrollment: null, reason: "" })}>Cancel</Button>
                    <Button variant="contained" color="error" disabled={!dropDialog.reason.trim()}
                        onClick={() => { onDropStudent?.(dropDialog.enrollment, dropDialog.reason); setDropDialog({ open: false, enrollment: null, reason: "" }); }}>
                        Confirm Drop
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function EnrollmentMgmtTab({
    students = [],
    courses = [],
    enrollments = [],
    departments = [],
    regLock = false,
    onlineRegOpen = false,
    onOpenRegistration,
    onCloseRegistration,
    onStartOnlineReg,
    onEndOnlineReg,
    onManualEnroll,
    onDropStudent,
    glassStyle
}) {
    const [mainTab, setMainTab] = useState(0);
    const [regType, setRegType] = useState("new");
    const activeCourses = courses.filter(c => c.status === "active");
    const pendingEnrollments = enrollments.filter(e => e.status === "pending");

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Enrollment Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        CONTROL COURSE REGISTRATION LIFECYCLE, CAPACITY, AND STUDENT ENROLLMENT ACROSS ALL SEMESTERS
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                        icon={regLock ? <Lock /> : <LockOpen />}
                        label={regLock ? "REGISTRATION CLOSED" : "REGISTRATION OPEN"}
                        color={regLock ? "error" : "success"}
                        sx={{ fontWeight: 1000, px: 1 }}
                    />
                    <Button
                        variant="contained"
                        color={regLock ? "success" : "error"}
                        onClick={regLock ? onOpenRegistration : onCloseRegistration}
                        startIcon={regLock ? <LockOpen /> : <Lock />}
                        sx={{ borderRadius: 3, fontWeight: 900 }}
                    >
                        {regLock ? "Open Registration" : "Close Registration"}
                    </Button>
                </Stack>
            </Box>

            {/* ── Online Registration controls ──────────────── */}
            <Card sx={{ ...glassStyle, p: 2.5, borderRadius: 4, mb: 3, border: `1.5px solid ${alpha(onlineRegOpen ? "#10b981" : "#6366f1", 0.25)}` }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: onlineRegOpen ? "#10b981" : "#ef4444", boxShadow: `0 0 0 4px ${alpha(onlineRegOpen ? "#10b981" : "#ef4444", 0.15)}` }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight={1000}>Online Registration Window</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {onlineRegOpen
                                    ? "Students can currently self-register for courses online."
                                    : "Online self-registration is currently closed for students."}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                            label={onlineRegOpen ? "OPEN" : "CLOSED"}
                            size="small"
                            color={onlineRegOpen ? "success" : "default"}
                            sx={{ fontWeight: 1000, fontSize: "0.65rem" }}
                        />
                        {onlineRegOpen ? (
                            <Button
                                variant="contained" color="error" size="small"
                                onClick={onEndOnlineReg}
                                startIcon={<Lock sx={{ fontSize: 16 }} />}
                                sx={{ borderRadius: 3, fontWeight: 900, fontSize: "0.78rem" }}
                            >
                                End Online Registration
                            </Button>
                        ) : (
                            <Button
                                variant="contained" color="success" size="small"
                                onClick={onStartOnlineReg}
                                startIcon={<LockOpen sx={{ fontSize: 16 }} />}
                                sx={{ borderRadius: 3, fontWeight: 900, fontSize: "0.78rem" }}
                            >
                                Start Online Registration
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Card>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: "Total Enrolled", val: enrollments.length, color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", icon: <HowToReg sx={{ fontSize: 24 }} /> },
                    { label: "Pending Approvals", val: students.filter(s => s.admissionStatus === "pending_registrar").length, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", icon: <WarningAmber sx={{ fontSize: 24 }} /> },
                    { label: "Active Courses", val: activeCourses.length, color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", icon: <Class sx={{ fontSize: 24 }} /> },
                    { label: "Total Students", val: students.length, color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", icon: <School sx={{ fontSize: 24 }} /> },
                ].map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{
                            ...glassStyle, p: 3, borderRadius: 5, borderTop: `4px solid ${s.color}`,
                            position: "relative", overflow: "hidden",
                            transition: "all 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: `0 12px 24px ${alpha(s.color, 0.2)}` }
                        }}>
                            <Box sx={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: s.gradient, opacity: 0.1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1 }}>{s.label.toUpperCase()}</Typography>
                                <Box sx={{ p: 1, borderRadius: 3, bgcolor: alpha(s.color, 0.1), color: s.color, display: "flex" }}>
                                    {s.icon}
                                </Box>
                            </Box>
                            <Typography variant="h3" fontWeight={1000} sx={{ color: s.color, letterSpacing: -1 }}>{s.val}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Navigation Tabs */}
            <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none" } }}>
                <Tab icon={<HowToReg sx={{ fontSize: 20 }} />} iconPosition="start" label="Registration Portal" />
                <Tab icon={<ListAlt sx={{ fontSize: 20 }} />} iconPosition="start" label={`Course Enrollments (${enrollments.length})`} />
                <Tab icon={<WarningAmber sx={{ fontSize: 20 }} />} iconPosition="start" label="Conflicts & Waitlists" />
                <Tab icon={<Class sx={{ fontSize: 20 }} />} iconPosition="start" label="Course Capacity" />
            </Tabs>

            {/* ── REGISTRATION PORTAL TAB ── */}
            {mainTab === 0 && (
                <Box>
                    <RegistrationTypeSelector value={regType} onChange={setRegType} />
                    {regType === "new" && (
                        <PendingApplicationsQueue
                            students={students}
                            glassStyle={glassStyle}
                        />
                    )}
                    {regType === "existing" && (
                        <ExistingStudentRegistrationForm
                            students={students}
                            courses={courses}
                            enrollments={enrollments}
                            glassStyle={glassStyle}
                            onDropStudent={onDropStudent}
                        />
                    )}
                </Box>
            )}

            {/* ── COURSE ENROLLMENTS TAB ── */}
            {mainTab === 1 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: "hidden" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField size="small" placeholder="Search student or course..." sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                            InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <TextField select size="small" defaultValue="Fall 2026" sx={{ width: 160, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                            {["Fall 2026", "Spring 2026", "Summer 2026"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                        <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {["Student", "Course", "Credits", "Type", "Status", "Action"].map(h => (
                                        <TableCell key={h} sx={{ bgcolor: "transparent", fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1.5 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrollments.slice(0, 80).map((e, i) => (
                                    <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                                        <TableCell><Typography variant="body2" fontWeight={900}>{e.studentName}</Typography><Typography variant="caption" color="text.secondary">{e.studentId}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={800}>{e.courseName}</Typography><Typography variant="caption" color="text.secondary">{e.courseCode}</Typography></TableCell>
                                        <TableCell><Chip label={`${e.credits || 3} CR`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                        <TableCell><Chip label={(e.type || "student").toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: "0.6rem" }} /></TableCell>
                                        <TableCell><Chip label={(e.status || "pending").toUpperCase()} size="small" color={e.status === "approved" ? "success" : e.status === "rejected" ? "error" : "warning"} sx={{ fontWeight: 1000, fontSize: "0.6rem" }} /></TableCell>
                                        <TableCell>
                                            <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, fontSize: "0.65rem" }}>Drop</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {enrollments.length === 0 && (
                                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <HowToReg sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No enrollments found</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* ── CONFLICTS TAB ── */}
            {mainTab === 2 && (
                <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, textAlign: "center", py: 10 }}>
                    <WarningAmber sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" fontWeight={900}>Conflict Detection Engine</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Detects schedule conflicts, prerequisite violations, and capacity overflows.</Typography>
                    <Button variant="contained" sx={{ borderRadius: 3, fontWeight: 900 }}>Run Conflict Scan</Button>
                </Card>
            )}

            {/* ── CAPACITY TAB ── */}
            {mainTab === 3 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: "hidden" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <Typography variant="h6" fontWeight={1000}>Course Capacity Monitor</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Code", "Capacity", "Enrolled", "Utilization", "Waitlisted"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase" }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeCourses.map((c, i) => {
                                    const enrolled = enrollments.filter(e => e.courseCode === c.code && e.status === "approved").length;
                                    const cap = c.capacity || 40;
                                    const pct = Math.min((enrolled / cap) * 100, 100);
                                    return (
                                        <TableRow key={i}>
                                            <TableCell><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                                            <TableCell><Typography variant="caption" fontWeight={800} sx={{ fontFamily: "monospace" }}>{c.code}</Typography></TableCell>
                                            <TableCell><Typography fontWeight={800}>{cap}</Typography></TableCell>
                                            <TableCell><Typography fontWeight={900}>{enrolled}</Typography></TableCell>
                                            <TableCell sx={{ minWidth: 150 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <LinearProgress variant="determinate" value={pct} sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: alpha(pct > 90 ? "#ef4444" : "#3b82f6", 0.1), "& .MuiLinearProgress-bar": { bgcolor: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#10b981" } }} />
                                                    <Typography variant="caption" fontWeight={1000}>{pct.toFixed(0)}%</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Chip label={c.waitlisted || 0} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                        </TableRow>
                                    );
                                })}
                                {activeCourses.length === 0 && (
                                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Typography color="text.secondary">No active courses</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}
        </Box>
    );
}
