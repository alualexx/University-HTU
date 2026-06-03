import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    TextField, MenuItem, Chip, LinearProgress, alpha, Stack,
    CircularProgress, Fade, Stepper, Step, StepLabel, Divider,
} from "@mui/material";
import {
    Person, School, Description, CloudUpload, CheckCircle,
    ArrowBack, ArrowForward, Send, AssignmentInd, Phone,
    CalendarToday, Public, Male, Female, ArticleOutlined,
    LockOutlined, InfoOutlined,
} from "@mui/icons-material";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../services/Firebase";
import { applicationsAPI, departmentsAPI } from "../../services/api";

/* ── Department meta helper ────────────────────────────── */
const getDeptMeta = (dept) => {
    if (!dept) return { color: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)", code: "DEPT" };
    const n = (dept.name || "").toLowerCase();
    if (n.includes("computer") || n.includes("software") || n.includes("it")) return { color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)", code: dept.code || "CS" };
    if (n.includes("engineering")) return { color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#d97706)", code: dept.code || "ENG" };
    if (n.includes("science")) return { color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", code: dept.code || "SCI" };
    if (n.includes("business") || n.includes("management") || n.includes("finance")) return { color: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)", code: dept.code || "BBA" };
    if (n.includes("art") || n.includes("design") || n.includes("architecture")) return { color: "#ec4899", gradient: "linear-gradient(135deg,#ec4899,#db2777)", code: dept.code || "ART" };
    if (n.includes("law")) return { color: "#64748b", gradient: "linear-gradient(135deg,#64748b,#475569)", code: dept.code || "LAW" };
    if (n.includes("medicine") || n.includes("medical")) return { color: "#e53935", gradient: "linear-gradient(135deg,#e53935,#ef9a9a)", code: dept.code || "MED" };
    if (n.includes("theology") || n.includes("divinity") || n.includes("religion")) return { color: "#7c4dff", gradient: "linear-gradient(135deg,#7c4dff,#651fff)", code: dept.code || "THEO" };
    return { color: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)", code: dept.code || "DEPT" };
};

const STEPS = ["Personal Info", "Academic Background", "Documents & Statement", "Review & Submit"];

/* ── Success Screen ─────────────────────────────────────── */
const SuccessScreen = ({ applicationId, applicantName, department }) => (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a,#1e293b)", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", top: -100, right: -100, background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
            <Fade in timeout={600}>
                <Card elevation={0} sx={{ borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", bgcolor: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", overflow: "hidden", textAlign: "center" }}>
                    <Box sx={{ height: 6, background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)" }} />
                    <CardContent sx={{ p: { xs: 5, md: 8 } }}>
                        <Box sx={{ width: 96, height: 96, borderRadius: "50%", mx: "auto", mb: 4, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircle sx={{ fontSize: 52, color: "#10b981" }} />
                        </Box>
                        <Chip label="APPLICATION SUBMITTED" sx={{ bgcolor: "rgba(16,185,129,0.1)", color: "#10b981", fontWeight: 800, letterSpacing: 1, mb: 3, border: "1px solid rgba(16,185,129,0.2)" }} />
                        <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", mb: 2 }}>
                            You're on your way, <Box component="span" sx={{ color: "primary.main" }}>{applicantName.split(" ")[0]}</Box>
                        </Typography>
                        <Typography color="rgba(255,255,255,0.45)" sx={{ lineHeight: 1.8, mb: 5, fontSize: "1.05rem" }}>
                            Your application for <strong style={{ color: "rgba(255,255,255,0.7)" }}>{department}</strong> has been securely submitted to the Registrar's Office.
                        </Typography>

                        <Box sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)", mb: 4 }}>
                            <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.3)" sx={{ textTransform: "uppercase", letterSpacing: 2, display: "block", mb: 1 }}>Reference ID</Typography>
                            <Typography variant="h5" fontWeight={900} sx={{ fontFamily: "monospace", color: "primary.main", letterSpacing: 4 }}>
                                {applicationId?.slice(0, 4).toUpperCase()}—{applicationId?.slice(4, 10).toUpperCase()}
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", mb: 5, textAlign: "left" }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <LockOutlined sx={{ color: "primary.main", mt: 0.3, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="body2" fontWeight={700} color="white" mb={0.5}>Email & Access Credentials</Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.4)" sx={{ lineHeight: 1.6 }}>
                                        The admin will send your university email and OTP login credentials once your application is reviewed (3–7 business days).
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                            <Button variant="contained" component={RouterLink} to="/" sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800, px: 4, py: 1.5 }}>Back to Home</Button>
                            <Button variant="outlined" component={RouterLink} to="/apply" sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800, px: 4, py: 1.5, borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", "&:hover": { borderColor: "white", color: "white" } }}>View Departments</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    </Box>
);

/* ── Field Component ─────────────────────────────────────── */
const FormField = ({ label, name, value, onChange, error, helperText, type = "text", multiline = false, rows, select, children, placeholder, inputProps, InputLabelProps, color }) => (
    <TextField
        fullWidth label={label} name={name} value={value} onChange={onChange}
        error={!!error} helperText={error || helperText} type={type}
        multiline={multiline} rows={rows} select={select} placeholder={placeholder}
        inputProps={inputProps} InputLabelProps={InputLabelProps}
        variant="outlined"
        sx={{
            "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "rgba(0,0,0,0.01)",
                "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                "&:hover fieldset": { borderColor: color || "primary.main" },
                "&.Mui-focused fieldset": { borderColor: color || "primary.main" },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: color || "primary.main" },
        }}
    >{children}</TextField>
);

/* ── Step Header ─────────────────────────────────────────── */
const StepHeader = ({ icon: Icon, title, subtitle, color }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 5, pb: 4, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(color, 0.08), color, border: `1px solid ${alpha(color, 0.15)}`, display: "flex" }}>
            <Icon sx={{ fontSize: 26 }} />
        </Box>
        <Box>
            <Typography variant="h5" fontWeight={900} sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 0.3 }}>{subtitle}</Typography>
        </Box>
    </Box>
);

/* ── Main Form ─────────────────────────────────────────────── */
const ApplicationForm = () => {
    const { departmentId } = useParams();
    const navigate = useNavigate();

    const [deptData, setDeptData] = useState(null);
    const [deptLoading, setDeptLoading] = useState(true);
    const [deptError, setDeptError] = useState(false);

    useEffect(() => {
        const fetchDept = async () => {
            setDeptLoading(true);
            try {
                const res = await departmentsAPI.getAll();
                const found = res.data.find(d =>
                    d._id === departmentId || d.id === departmentId || d.slug === departmentId ||
                    (d.name || "").toLowerCase().replace(/\s+/g, "-") === departmentId
                );
                if (found) {
                    const meta = getDeptMeta(found);
                    setDeptData({ ...found, ...meta, name: found.name, code: found.code || meta.code });
                } else setDeptError(true);
            } catch { setDeptError(true); }
            finally { setDeptLoading(false); }
        };
        fetchDept();
    }, [departmentId]);

    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        firstName: "", lastName: "", dateOfBirth: "", gender: "",
        nationality: "", phone: "", address: "",
        highSchoolName: "", graduationYear: "", gpa: "", gradeSystem: "",
        previousQualification: "", extraCurricular: "",
        personalStatement: "", whyThisDepartment: "",
        idDocument: null, idDocumentName: "",
        transcript: null, transcriptName: "",
        photo: null, photoName: "",
        recommendationLetter: null, recommendationLetterName: "",
    });

    const [uploading, setUploading] = useState(false);

    if (deptLoading) return <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress size={40} /></Box>;
    if (deptError || !deptData) return (
        <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box textAlign="center">
                <Typography variant="h5" fontWeight={700} mb={2}>Department not found</Typography>
                <Button component={RouterLink} to="/apply" variant="contained" sx={{ borderRadius: 3, textTransform: "none" }}>Browse Departments</Button>
            </Box>
        </Box>
    );

    const dept = deptData;
    const progress = (activeStep / (STEPS.length - 1)) * 100;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };
    const handleFileChange = (field) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, [field]: file, [`${field}Name`]: file.name });
        }
    };
    const validate = () => {
        const e = {};
        if (activeStep === 0) {
            if (!form.firstName) e.firstName = "Required";
            if (!form.lastName) e.lastName = "Required";
            if (!form.dateOfBirth) e.dateOfBirth = "Required";
            if (!form.gender) e.gender = "Required";
            if (!form.phone) e.phone = "Required";
        }
        if (activeStep === 1) {
            if (!form.highSchoolName) e.highSchoolName = "Required";
            if (!form.graduationYear) e.graduationYear = "Required";
            if (!form.gpa) e.gpa = "Required";
        }
        if (activeStep === 2) {
            if (!form.personalStatement || form.personalStatement.length < 50) e.personalStatement = "At least 50 characters required";
            if (!form.whyThisDepartment || form.whyThisDepartment.length < 30) e.whyThisDepartment = "At least 30 characters required";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleNext = () => { if (validate()) setActiveStep(p => p + 1); };
    const handleBack = () => setActiveStep(p => p - 1);

    const handleSubmit = async () => {
        setSubmitting(true);
        setUploading(true);
        const part1 = Array.from({ length: 4 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");
        const part2 = Array.from({ length: 6 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("");
        const refId = `${part1}\u2014${part2}`;

        try {
            // 1. Upload Documents to Firebase Storage
            const docUrls = {};
            const uploadPromises = [];
            const filesToUpload = [
                { key: 'idDocument', file: form.idDocument },
                { key: 'transcript', file: form.transcript },
                { key: 'photo', file: form.photo },
                { key: 'recommendationLetter', file: form.recommendationLetter }
            ];

            if (storage) {
                for (const item of filesToUpload) {
                    if (item.file) {
                        const fileRef = storageRef(storage, `applications/${refId}/${item.key}_${item.file.name}`);
                        const uploadTask = Promise.race([
                            uploadBytes(fileRef, item.file).then(async (snapshot) => {
                                const url = await getDownloadURL(snapshot.ref);
                                docUrls[item.key] = url;
                            }),
                            new Promise((_, reject) => setTimeout(() => reject(new Error(`Upload too long: ${item.key}`)), 20000))
                        ]);
                        uploadPromises.push(uploadTask);
                    }
                }
            }

            try {
                await Promise.all(uploadPromises);
            } catch (uErr) {
                console.error("Upload process error:", uErr);
            }
            setUploading(false);

            const data = {
                firstName: form.firstName,
                lastName: form.lastName,
                name: `${form.firstName} ${form.lastName}`,
                phone: form.phone,
                email: form.email || `pending_${refId.toLowerCase()}@htu.edu`,
                dob: form.dateOfBirth,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                nationality: form.nationality,
                address: form.address,
                highSchoolName: form.highSchoolName,
                graduationYear: form.graduationYear,
                highSchoolGrades: form.gpa,
                gradeSystem: form.gradeSystem,
                previousQualification: form.previousQualification,
                extraCurricular: form.extraCurricular,
                personalStatement: form.personalStatement,
                whyThisDepartment: form.whyThisDepartment,
                documents: docUrls,
                intendedMajor: dept.name,
                departmentId,
                departmentCode: dept.code,
                referenceId: refId,
                status: "pending_dept_review",
            };

            // 2. Submit to MongoDB API
            await applicationsAPI.submit(data);

            // 3. Backup to Firestore
            const ref = await addDoc(collection(db, "applications"), { ...data, submittedAt: serverTimestamp() });
            setApplicationId(ref.id);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission Error:", err.response?.data || err.message);
            setErrors({ submit: `Submission Failed: ${err.response?.data?.message || err.message}` });
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    if (submitted) return <SuccessScreen applicationId={applicationId} applicantName={`${form.firstName} ${form.lastName}`} department={dept.name} />;

    /* ── render ── */
    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ── Header ── */}
            <Box sx={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)", pt: { xs: 14, md: 18 }, pb: 10, position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: -100, right: -100, background: `radial-gradient(circle,${alpha(dept.color, 0.12)} 0%,transparent 70%)`, filter: "blur(80px)" }} />
                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate("/apply")}
                        sx={{ color: "rgba(255,255,255,0.35)", textTransform: "none", fontWeight: 700, mb: 5, px: 2, borderRadius: 2, "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" } }}>
                        Back to Departments
                    </Button>

                    <Stack direction="row" spacing={2.5} alignItems="center" mb={5}>
                        <Box sx={{ width: 60, height: 60, borderRadius: 3, background: dept.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 24px ${alpha(dept.color, 0.3)}` }}>
                            <School sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Chip label={dept.code} size="small" sx={{ bgcolor: alpha(dept.color, 0.15), color: dept.color, fontWeight: 800, mb: 0.5 }} />
                            <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                                {dept.name}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Progress */}
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="caption" fontWeight={800} color="rgba(255,255,255,0.5)" sx={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
                                Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep]}
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.3)" sx={{ letterSpacing: 1 }}>
                                {Math.round(progress)}%
                            </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={progress} sx={{
                            height: 5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.06)",
                            "& .MuiLinearProgress-bar": { background: dept.gradient, borderRadius: 3 }
                        }} />
                        <Stack direction="row" spacing={1} mt={2} sx={{ display: { xs: "none", md: "flex" } }}>
                            {STEPS.map((s, i) => (
                                <Box key={s} sx={{ flex: 1, py: 0.8, px: 1.5, borderRadius: 2, bgcolor: i === activeStep ? alpha(dept.color, 0.2) : i < activeStep ? alpha(dept.color, 0.08) : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: i === activeStep ? alpha(dept.color, 0.4) : "transparent", textAlign: "center" }}>
                                    <Typography variant="caption" fontWeight={700} color={i === activeStep ? dept.color : "rgba(255,255,255,0.25)"} sx={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 0.5 }}>{s}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* ── Form Card ── */}
            <Container maxWidth="md" sx={{ mt: -4, pb: 10, position: "relative", zIndex: 1 }}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "visible" }}>
                    <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                        <Fade in key={activeStep} timeout={300}>
                            <Box>
                                {/* ── Step 0: Personal Info ── */}
                                {activeStep === 0 && (
                                    <Box>
                                        <StepHeader icon={Person} title="Personal Information" subtitle="Your identification details as they appear on official documents." color={dept.color} />

                                        {/* OTP notice */}
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 3, borderRadius: 3, bgcolor: alpha(dept.color, 0.05), border: `1px solid ${alpha(dept.color, 0.15)}`, mb: 5 }}>
                                            <LockOutlined sx={{ color: dept.color, fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                                            <Box>
                                                <Typography variant="body2" fontWeight={700} color={dept.color} mb={0.3}>University Email & Password</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    Your university email and OTP login credentials will be provided by the Registrar's Office after your application is reviewed and accepted.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Date of Birth *" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} type="date" InputLabelProps={{ shrink: true }} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Gender *" name="gender" value={form.gender} onChange={handleChange} error={errors.gender} select color={dept.color}>
                                                    <MenuItem value="male"><Stack direction="row" spacing={1} alignItems="center"><Male fontSize="small" /> <span>Male</span></Stack></MenuItem>
                                                    <MenuItem value="female"><Stack direction="row" spacing={1} alignItems="center"><Female fontSize="small" /> <span>Female</span></Stack></MenuItem>
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Nationality *" name="nationality" value={form.nationality} onChange={handleChange} error={errors.nationality} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Phone Number *" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+1 555 000 0000" color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormField label="Residential Address" name="address" value={form.address} onChange={handleChange} multiline rows={3} placeholder="Street, City, Postal Code, Country" color={dept.color} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* ── Step 1: Academic Background ── */}
                                {activeStep === 1 && (
                                    <Box>
                                        <StepHeader icon={School} title="Academic Background" subtitle="Your educational history and academic achievements." color={dept.color} />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormField label="High School / Secondary Institution *" name="highSchoolName" value={form.highSchoolName} onChange={handleChange} error={errors.highSchoolName} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Graduation Year *" name="graduationYear" value={form.graduationYear} onChange={handleChange} error={errors.graduationYear} type="number" inputProps={{ min: 2010, max: 2026 }} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Grade System *" name="gradeSystem" value={form.gradeSystem} onChange={handleChange} select color={dept.color}>
                                                    <MenuItem value="gpa_4">GPA (4.0 scale)</MenuItem>
                                                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                                                    <MenuItem value="grade_letter">Letter Grade (A–F)</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormField label="Final Grade / Score *" name="gpa" value={form.gpa} onChange={handleChange} error={errors.gpa} placeholder="e.g. 3.9 / 4.0 or 95% or A+" helperText="Your verified cumulative academic result" color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormField label="Additional Qualifications / Certifications" name="previousQualification" value={form.previousQualification} onChange={handleChange} multiline rows={3} placeholder="IB, A-levels, technical certs, awards (optional)" color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormField label="Extracurricular Activities" name="extraCurricular" value={form.extraCurricular} onChange={handleChange} multiline rows={3} placeholder="Sports, clubs, volunteering, projects (optional)" color={dept.color} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* ── Step 2: Documents & Statement ── */}
                                {activeStep === 2 && (
                                    <Box>
                                        <StepHeader icon={ArticleOutlined} title="Documents & Statement" subtitle="Upload your documents and write your personal statement." color={dept.color} />

                                        <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1.5, mb: 2.5, display: "block" }}>Required Documents</Typography>
                                        <Grid container spacing={2.5} mb={5}>
                                            {[
                                                { label: "Government ID / Passport", field: "idDocumentName", accept: "image/*,.pdf" },
                                                { label: "Academic Transcripts", field: "transcriptName", accept: ".pdf,image/*" },
                                                { label: "Biometric Photo", field: "photoName", accept: "image/*" },
                                                { label: "Recommendation Letter (optional)", field: "recommendationLetterName", accept: ".pdf,image/*" },
                                            ].map((doc) => (
                                                <Grid item xs={12} sm={6} key={doc.field}>
                                                    <Box component="label" sx={{
                                                        display: "flex", alignItems: "center", gap: 2, p: 3, borderRadius: 3, cursor: "pointer",
                                                        border: "1.5px dashed", borderColor: form[doc.field] ? "success.main" : alpha(dept.color, 0.3),
                                                        bgcolor: form[doc.field] ? alpha("#10b981", 0.04) : alpha(dept.color, 0.02),
                                                        transition: "all 0.25s ease",
                                                        "&:hover": { borderColor: dept.color, bgcolor: alpha(dept.color, 0.05) }
                                                    }}>
                                                        <input type="file" hidden accept={doc.accept} onChange={handleFileChange(doc.field.replace('Name', ''))} />
                                                        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: form[doc.field] ? alpha("#10b981", 0.1) : alpha(dept.color, 0.08), flexShrink: 0 }}>
                                                            {form[doc.field] ? <CheckCircle sx={{ color: "success.main", fontSize: 22 }} /> : <CloudUpload sx={{ color: dept.color, fontSize: 22 }} />}
                                                        </Box>
                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography variant="caption" fontWeight={800} sx={{ color: form[doc.field] ? "success.main" : "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>{doc.label}</Typography>
                                                            <Typography variant="caption" color="text.disabled" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{form[doc.field] || "Click to upload"}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Divider sx={{ mb: 5, opacity: 0.5 }} />

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormField label="Personal Statement *" name="personalStatement" value={form.personalStatement} onChange={handleChange} error={errors.personalStatement} multiline rows={6} placeholder="Describe your academic journey, goals, and what makes you a strong candidate..." helperText={!errors.personalStatement ? `${form.personalStatement.length} / 50+ characters` : undefined} color={dept.color} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormField label={`Why ${dept.name}? *`} name="whyThisDepartment" value={form.whyThisDepartment} onChange={handleChange} error={errors.whyThisDepartment} multiline rows={4} placeholder={`Explain why you chose ${dept.name} and how it aligns with your career goals...`} helperText={!errors.whyThisDepartment ? `${form.whyThisDepartment.length} / 30+ characters` : undefined} color={dept.color} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* ── Step 3: Review ── */}
                                {activeStep === 3 && (
                                    <Box>
                                        <StepHeader icon={AssignmentInd} title="Review & Submit" subtitle="Verify all your details before submitting your application." color={dept.color} />

                                        {errors.submit && (
                                            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: alpha("#ef4444", 0.06), border: "1px solid", borderColor: alpha("#ef4444", 0.2), mb: 4 }}>
                                                <Typography variant="body2" fontWeight={700} color="error">{errors.submit}</Typography>
                                            </Box>
                                        )}

                                        {[
                                            {
                                                title: "Personal Details",
                                                rows: [
                                                    ["Full Name", `${form.firstName} ${form.lastName}`],
                                                    ["Date of Birth", form.dateOfBirth],
                                                    ["Gender", form.gender],
                                                    ["Nationality", form.nationality],
                                                    ["Phone", form.phone],
                                                ]
                                            },
                                            {
                                                title: "Academic Background",
                                                rows: [
                                                    ["Institution", form.highSchoolName],
                                                    ["Graduation Year", form.graduationYear],
                                                    ["Grade / Score", `${form.gpa} (${form.gradeSystem})`],
                                                ]
                                            },
                                            {
                                                title: "Documents",
                                                rows: [
                                                    ["ID / Passport", form.idDocumentName || "Not uploaded"],
                                                    ["Transcripts", form.transcriptName || "Not uploaded"],
                                                    ["Photo", form.photoName || "Not uploaded"],
                                                ]
                                            },
                                        ].map((section) => (
                                            <Box key={section.title} sx={{ mb: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                                                <Box sx={{ px: 3, py: 2, bgcolor: alpha(dept.color, 0.04), borderBottom: "1px solid", borderColor: "divider" }}>
                                                    <Typography variant="caption" fontWeight={900} color={dept.color} sx={{ textTransform: "uppercase", letterSpacing: 1.5 }}>{section.title}</Typography>
                                                </Box>
                                                <Grid container sx={{ p: 2 }} spacing={0}>
                                                    {section.rows.map(([lbl, val]) => (
                                                        <Grid item xs={12} sm={6} key={lbl} sx={{ p: 1.5 }}>
                                                            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 0.3 }}>{lbl}</Typography>
                                                            <Typography variant="body2" fontWeight={700} color={val?.includes("Not") ? "error.main" : "text.primary"}>{val || "—"}</Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        ))}

                                        <Box sx={{ p: 3, borderRadius: 4, background: `linear-gradient(135deg,${alpha(dept.color, 0.08)},${alpha(dept.color, 0.02)})`, border: `1px solid ${alpha(dept.color, 0.2)}`, display: "flex", alignItems: "center", gap: 2.5, mt: 4 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: dept.color, boxShadow: `0 0 0 4px ${alpha(dept.color, 0.2)}`, flexShrink: 0 }} />
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={900} sx={{ fontFamily: "Outfit, sans-serif", color: dept.color }}>{dept.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{dept.code} · Intake 2026</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Fade>

                        {/* ── Navigation ── */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
                            <Button variant="outlined" startIcon={<ArrowBack />} onClick={activeStep === 0 ? () => navigate("/apply") : handleBack}
                                sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800, px: 3.5, py: 1.5, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "text.primary", color: "text.primary" } }}>
                                {activeStep === 0 ? "Cancel" : "Back"}
                            </Button>

                            {activeStep < STEPS.length - 1 ? (
                                <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}
                                    sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800, px: 4, py: 1.5, background: dept.gradient, boxShadow: `0 8px 24px ${alpha(dept.color, 0.35)}`, "&:hover": { background: dept.gradient, boxShadow: `0 12px 32px ${alpha(dept.color, 0.5)}`, transform: "translateY(-2px)" }, transition: "all 0.2s" }}>
                                    Continue
                                </Button>
                            ) : (
                                <Button variant="contained" startIcon={submitting ? null : <Send />} onClick={handleSubmit} disabled={submitting}
                                    sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800, px: 5, py: 1.5, background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)", "&:hover": { background: "linear-gradient(135deg,#059669,#047857)", transform: "translateY(-2px)" }, "&.Mui-disabled": { background: "rgba(16,185,129,0.25)", color: "rgba(255,255,255,0.5)" }, transition: "all 0.2s" }}>
                                    {submitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ApplicationForm;
