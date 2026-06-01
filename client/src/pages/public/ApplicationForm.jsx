import React, { useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    TextField, MenuItem, Chip, Avatar, Stepper, Step, StepLabel,
    StepContent, Alert, Divider, IconButton, LinearProgress, alpha, Stack,
} from "@mui/material";
import {
    Person, School, Description, CloudUpload, CheckCircle,
    ArrowBack, ArrowForward, Send, AccessTime, HourglassTop,
    AssignmentInd, Email, Phone, CalendarToday, Public,
    Male, Female, ArticleOutlined,
} from "@mui/icons-material";
import {
    collection, doc, setDoc, serverTimestamp, addDoc
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { applicationsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* ── Department lookup ─────────────────────────────────── */
const DEPARTMENTS = {
    "computer-science": { name: "Computer Science", code: "CS", color: "#1976d2", gradient: "linear-gradient(135deg,#1976d2,#42a5f5)" },
    "electrical-engineering": { name: "Electrical Engineering", code: "EE", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
    "business-administration": { name: "Business Administration", code: "BBA", color: "#2e7d32", gradient: "linear-gradient(135deg,#2e7d32,#66bb6a)" },
    "medicine": { name: "Medicine & Surgery", code: "MBBS", color: "#e53935", gradient: "linear-gradient(135deg,#e53935,#ef9a9a)" },
    "law": { name: "Law & Jurisprudence", code: "LLB", color: "#6a1b9a", gradient: "linear-gradient(135deg,#6a1b9a,#ba68c8)" },
    "architecture": { name: "Architecture & Design", code: "ARCH", color: "#e65100", gradient: "linear-gradient(135deg,#e65100,#ff8a65)" },
};

const STEPS = ["Personal Information", "Academic Background", "Documents & Statement", "Review & Submit"];

/* ── Pending Confirmation ─────────────────────────────── */
const PendingScreen = ({ applicationId, applicantName, department }) => (
    <Box sx={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        py: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', position: 'relative', overflow: 'hidden'
    }}>
        {/* Background effects */}
        <Box sx={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: -150, right: -150, background: "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)", filter: 'blur(80px)' }} />
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: -100, left: -100, background: "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)", filter: 'blur(60px)' }} />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
            <Card elevation={0} sx={{
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden", textAlign: "center", bgcolor: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5)'
            }}>
                <Box sx={{ height: 8, background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                    {/* Premium Animated Icon */}
                    <Box sx={{
                        width: 120, height: 120, borderRadius: 5, mx: "auto", mb: 5,
                        background: "rgba(255,255,255,0.03)", border: '1px solid rgba(255,255,255,0.1)',
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: 'relative'
                    }}>
                        <CheckCircle sx={{ fontSize: 64, color: "#10b981", filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.4))' }} />
                        <Box sx={{ position: 'absolute', inset: -10, border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, animation: 'spin 10s linear infinite', "@keyframes spin": { "100%": { transform: 'rotate(360deg)' } } }} />
                    </Box>

                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 100, bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', mb: 3 }}>
                        <Typography variant="caption" fontWeight={1000} sx={{ color: '#10b981', letterSpacing: 1.5, textTransform: 'uppercase' }}>Submission Confirmed</Typography>
                    </Box>

                    <Typography variant="h3" fontWeight={1000} color="white" gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: "-0.02em", mb: 2 }}>
                        Destiny <Box component="span" sx={{ color: 'primary.main' }}>Initiated</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, mb: 6, fontWeight: 500, fontSize: '1.1rem' }}>
                        Greetings, <strong>{applicantName}</strong>. Your application for <strong>{department}</strong> has been encrypted and securely transmitted to the Office of the Registrar.
                    </Typography>

                    <Box sx={{
                        p: 4, borderRadius: 6, bgcolor: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.05)", mb: 6, textAlign: "center"
                    }}>
                        <Typography variant="caption" fontWeight={1000} color="rgba(255,255,255,0.3)" sx={{ textTransform: "uppercase", letterSpacing: 2, display: "block", mb: 2 }}>
                            Protocol Reference ID
                        </Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'monospace', color: 'primary.main', letterSpacing: 4 }}>
                            {applicationId?.slice(0, 4).toUpperCase()}—{applicationId?.slice(4, 10).toUpperCase()}
                        </Typography>
                    </Box>

                    <Box sx={{ bgcolor: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.1)', borderRadius: 5, p: 3, textAlign: 'left', mb: 6 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Email sx={{ color: 'primary.main', mt: 0.5 }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>Communication Dispatch</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                                    A confirmation has been sent to your registered email. Standard review protocols take <strong>3–7 academic cycles</strong>.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/"
                            sx={{ borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 5, py: 2, fontSize: '1rem', bgcolor: 'primary.main', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-4px)' } }}
                        >
                            Return to Nexus
                        </Button>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/apply"
                            sx={{ borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 5, py: 2, fontSize: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' } }}
                        >
                            Review Domains
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    </Box>
);

/* ── Main Form ─────────────────────────────────────────── */
const ApplicationForm = () => {
    const { departmentId } = useParams();
    const navigate = useNavigate();
    const dept = DEPARTMENTS[departmentId];

    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        // Personal
        firstName: "", lastName: "", dateOfBirth: "", gender: "",
        nationality: "", phone: "", email: "", address: "",
        // Academic
        highSchoolName: "", graduationYear: "", gpa: "", gradeSystem: "",
        previousQualification: "", extraCurricular: "",
        // Statement & Documents
        personalStatement: "", whyThisDepartment: "",
        idDocumentName: "", transcriptName: "", photoName: "",
    });

    if (!dept) {
        return (
            <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box textAlign="center">
                    <Typography variant="h5" fontWeight={700} gutterBottom>Department not found</Typography>
                    <Button component={RouterLink} to="/apply" variant="contained">Browse Departments</Button>
                </Box>
            </Box>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleFileChange = (fieldName) => (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, [fieldName]: file.name });
    };

    const validateStep = () => {
        const newErrors = {};
        if (activeStep === 0) {
            if (!form.firstName) newErrors.firstName = "Required";
            if (!form.lastName) newErrors.lastName = "Required";
            if (!form.dateOfBirth) newErrors.dateOfBirth = "Required";
            if (!form.gender) newErrors.gender = "Required";
            if (!form.phone) newErrors.phone = "Required";
            if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
        }
        if (activeStep === 1) {
            if (!form.highSchoolName) newErrors.highSchoolName = "Required";
            if (!form.graduationYear) newErrors.graduationYear = "Required";
            if (!form.gpa) newErrors.gpa = "Required";
        }
        if (activeStep === 2) {
            if (!form.personalStatement || form.personalStatement.length < 50)
                newErrors.personalStatement = "Please write at least 50 characters";
            if (!form.whyThisDepartment || form.whyThisDepartment.length < 30)
                newErrors.whyThisDepartment = "Required (min 30 chars)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) setActiveStep((p) => p + 1);
    };

    const handleBack = () => setActiveStep((p) => p - 1);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Generate valid Protocol Reference ID: ABCD—123456 (em-dash \u2014)
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 26)]).join('');
            const part2 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const refId = `${part1}\u2014${part2}`;

            const submissionData = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
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
                documents: {
                    idDocument: form.idDocumentName,
                    transcript: form.transcriptName,
                    photo: form.photoName,
                },
                intendedMajor: dept.name,
                departmentId,
                departmentCode: dept.code,
                referenceId: refId,
                status: "pending_dept_review"
            };

            const response = await applicationsAPI.submit(submissionData);

            if (response.data.success) {
                // Also save to Firestore for redundancy/legacy tracking if needed
                // But we mainly need it for the ID the server returns
                const newDocRef = await addDoc(collection(db, "applications"), {
                    ...submissionData,
                    submittedAt: serverTimestamp(),
                });

                setApplicationId(newDocRef.id);
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Submission error:", err);
            setErrors({ submit: "An error occurred during submission. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return <PendingScreen applicationId={applicationId} applicantName={`${form.firstName} ${form.lastName}`} department={dept.name} />;
    }

    const progress = ((activeStep) / (STEPS.length - 1)) * 100;

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ── Premium Header ── */}
            <Box sx={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                pt: { xs: 15, md: 18 }, pb: 12,
                position: "relative", overflow: "hidden",
            }}>
                {/* Background effects */}
                <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: -100, right: -100, background: `radial-gradient(circle, ${alpha(dept.color, 0.15)} 0%, transparent 70%)`, filter: 'blur(80px)' }} />

                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/apply")}
                        sx={{ color: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 1000, mb: 4, px: 2, borderRadius: 3, "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" } }}
                    >
                        Back to Domains
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 6 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 4, background: dept.gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 12px 24px ${alpha(dept.color, 0.3)}`
                        }}>
                            <Avatar sx={{ bgcolor: "transparent", width: 40, height: 40, fontSize: "1.2rem", fontWeight: 1000, color: 'white' }}>
                                {dept.code[0]}
                            </Avatar>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 1 }}>
                                <Typography variant="caption" fontWeight={1000} sx={{ color: 'primary.main', letterSpacing: 1.5, textTransform: 'uppercase' }}>Academic Intake Cycle 2026</Typography>
                            </Box>
                            <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: "-0.02em" }}>
                                {dept.name}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Sophisticated Progress */}
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', animation: 'pulse 2s infinite' }} />
                                <Typography variant="caption" fontWeight={1000} sx={{ color: 'white', letterSpacing: 1, textTransform: 'uppercase' }}>
                                    PROTOCOL {activeStep + 1}: {STEPS[activeStep]}
                                </Typography>
                            </Box>
                            <Typography variant="caption" fontWeight={1000} sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
                                {Math.round(progress)}% INTEGRITY
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 4, borderRadius: 2,
                                bgcolor: "rgba(255,255,255,0.05)",
                                "& .MuiLinearProgress-bar": { background: dept.gradient, borderRadius: 2 }
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -4, pb: 10, position: "relative", zIndex: 1 }}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>

                        {/* ── Step 0: Personal Information ── */}
                        {activeStep === 0 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3, bgcolor: alpha(dept.color, 0.08), color: dept.color,
                                        border: `1px solid ${alpha(dept.color, 0.1)}`
                                    }}>
                                        <Person sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                                            Personal Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Provide your basic identification details for our records.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Given Name *" name="firstName" value={form.firstName} onChange={handleChange}
                                            error={!!errors.firstName} helperText={errors.firstName}
                                            variant="outlined"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Family Name *" name="lastName" value={form.lastName} onChange={handleChange}
                                            error={!!errors.lastName} helperText={errors.lastName}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Birth Date *" name="dateOfBirth" type="date" value={form.dateOfBirth}
                                            onChange={handleChange} InputLabelProps={{ shrink: true }}
                                            error={!!errors.dateOfBirth} helperText={errors.dateOfBirth}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth select label="Gender *" name="gender" value={form.gender} onChange={handleChange}
                                            error={!!errors.gender} helperText={errors.gender}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Nationality / Citizenship *" name="nationality" value={form.nationality} onChange={handleChange}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Contact Number *" name="phone" value={form.phone} onChange={handleChange}
                                            error={!!errors.phone} helperText={errors.phone}
                                            placeholder="+1 (555) 000-0000"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Email Correspondence *" name="email" type="email" value={form.email} onChange={handleChange}
                                            error={!!errors.email} helperText={errors.email}
                                            placeholder="intel@university.edu"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Residential Address" name="address" value={form.address} onChange={handleChange} multiline rows={3}
                                            placeholder="Street address, City, Postal Code, Country"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 1: Academic Background ── */}
                        {activeStep === 1 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3, bgcolor: alpha(dept.color, 0.08), color: dept.color,
                                        border: `1px solid ${alpha(dept.color, 0.1)}`
                                    }}>
                                        <School sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                                            Academic Credentials
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Your educational trajectory and performance metrics.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Primary Secondary Institution / High School *" name="highSchoolName" value={form.highSchoolName}
                                            onChange={handleChange} error={!!errors.highSchoolName} helperText={errors.highSchoolName}
                                            placeholder="The Global Academy of Excellence"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Year of Completion *" name="graduationYear" value={form.graduationYear} onChange={handleChange}
                                            type="number" inputProps={{ min: 2010, max: 2026 }}
                                            error={!!errors.graduationYear} helperText={errors.graduationYear}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth select label="Evaluation Framework *" name="gradeSystem" value={form.gradeSystem} onChange={handleChange}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                                            <MenuItem value="gpa_4">Cumulative GPA (4.0 scale)</MenuItem>
                                            <MenuItem value="percentage">Total Percentage (%)</MenuItem>
                                            <MenuItem value="grade_letter">Alphabetical (A–F)</MenuItem>
                                            <MenuItem value="other">Specified Alternative</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Composite Score / Final Grade *" name="gpa" value={form.gpa} onChange={handleChange}
                                            placeholder="e.g. 3.92 / 4.0 or 94.5% or A+"
                                            error={!!errors.gpa} helperText={errors.gpa || "Your verified final cumulative academic result"}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Distinctions / Specialized Certifications" name="previousQualification"
                                            value={form.previousQualification} onChange={handleChange} multiline rows={3}
                                            placeholder="List any international diplomas (IB, A-Levels), technical certifications, or significant academic awards (optional)"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth label="Leadership & External Contributions" name="extraCurricular"
                                            value={form.extraCurricular} onChange={handleChange} multiline rows={3}
                                            placeholder="Athletics, societies, volunteer initiatives, innovation projects, etc. (optional)"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 2: Documents & Statement ── */}
                        {activeStep === 2 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3, bgcolor: alpha(dept.color, 0.08), color: dept.color,
                                        border: `1px solid ${alpha(dept.color, 0.1)}`
                                    }}>
                                        <ArticleOutlined sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                                            Dossier & Narrative
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Verified documentation and your personal mission statement.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="caption" fontWeight={1000} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 2, mb: 3, display: "block" }}>
                                    Required Credentials (PDF/IMG)
                                </Typography>
                                <Grid container spacing={3} sx={{ mb: 6 }}>
                                    {[
                                        { label: "Government ID / Passport *", field: "idDocumentName", accept: "image/*,.pdf" },
                                        { label: "Academic Transcripts *", field: "transcriptName", accept: ".pdf,image/*" },
                                        { label: "Biometric Photo *", field: "photoName", accept: "image/*" },
                                        { label: "Recommendation Letter", field: "recommendationLetterName", accept: ".pdf,image/*" },
                                    ].map((doc) => (
                                        <Grid item xs={12} sm={4} key={doc.field}>
                                            <Box
                                                component="label"
                                                sx={{
                                                    display: "flex", flexDirection: "column", alignItems: "center",
                                                    gap: 2, p: 4, borderRadius: 5, cursor: "pointer",
                                                    border: "1px solid", borderColor: form[doc.field] ? "success.main" : "divider",
                                                    bgcolor: form[doc.field] ? alpha("#10b981", 0.03) : "transparent",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    "&:hover": { borderColor: dept.color, bgcolor: alpha(dept.color, 0.02), transform: 'translateY(-4px)' }
                                                }}
                                            >
                                                <input type="file" hidden accept={doc.accept} onChange={handleFileChange(doc.field)} />
                                                {form[doc.field] ? (
                                                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CheckCircle sx={{ fontSize: 24, color: "white" }} />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CloudUpload sx={{ fontSize: 24, color: "text.disabled" }} />
                                                    </Box>
                                                )}
                                                <Typography variant="caption" fontWeight={1000} textAlign="center" color={form[doc.field] ? "success.main" : "text.secondary"} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                    {form[doc.field] || doc.label}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ mb: 6, opacity: 0.6 }} />

                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth multiline rows={6}
                                            label="Personal Statement & Motivation *"
                                            name="personalStatement"
                                            value={form.personalStatement}
                                            onChange={handleChange}
                                            error={!!errors.personalStatement}
                                            helperText={errors.personalStatement || `Analytical Depth: ${form.personalStatement.length} characters — Describe your academic journey and career aspirations.`}
                                            placeholder="What unique perspectives do you bring to our university? Describe a challenge you overcame..."
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth multiline rows={4}
                                            label={`Strategic Interest in ${dept.name} *`}
                                            name="whyThisDepartment"
                                            value={form.whyThisDepartment}
                                            onChange={handleChange}
                                            error={!!errors.whyThisDepartment}
                                            helperText={errors.whyThisDepartment || `Motivation Clarity: Explain why this specific domain aligns with your trajectory.`}
                                            placeholder={`Why did you choose ${dept.name} as your primary field of study?`}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 3: Review & Submission ── */}
                        {activeStep === 3 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3, bgcolor: alpha(dept.color, 0.08), color: dept.color,
                                        border: `1px solid ${alpha(dept.color, 0.1)}`
                                    }}>
                                        <AssignmentInd sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                                            Final Confirmation
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            Ensure all data nodes are accurate before initializing submission.
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 6, p: 3, borderRadius: 3, bgcolor: alpha('#38bdf8', 0.05), border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircle sx={{ color: '#38bdf8' }} />
                                    <Typography variant="body2" fontWeight={600} color="#0369a1">
                                        Data Integrity Check: All protocols validated. Submission ready.
                                    </Typography>
                                </Box>

                                {/* Summary sections */}
                                {[
                                    {
                                        title: "Core Identity",
                                        rows: [
                                            ["Full Name", `${form.firstName} ${form.lastName}`],
                                            ["Email / SMS", `${form.email} / ${form.phone}`],
                                            ["Birth Segment", form.dateOfBirth],
                                            ["Citizenship", form.nationality],
                                        ]
                                    },
                                    {
                                        title: "Academic Pedigree",
                                        rows: [
                                            ["Institution", form.highSchoolName],
                                            ["Completion Year", form.graduationYear],
                                            ["Performance Metric", `${form.gpa} (${form.gradeSystem})`],
                                        ]
                                    },
                                    {
                                        title: "Encrypted Dossier",
                                        rows: [
                                            ["Identification", form.idDocumentName || "NOT UPLOADED"],
                                            ["Transcripts", form.transcriptName || "NOT UPLOADED"],
                                            ["Biometric", form.photoName || "NOT UPLOADED"],
                                        ]
                                    },
                                ].map((section) => (
                                    <Box key={section.title} sx={{ mb: 4, p: 4, borderRadius: 6, bgcolor: "rgba(0,0,0,0.01)", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 2, textTransform: "uppercase", mb: 3, display: "block" }}>
                                            {section.title}
                                        </Typography>
                                        <Grid container spacing={3}>
                                            {section.rows.map(([label, value]) => (
                                                <Grid item xs={12} sm={6} key={label}>
                                                    <Typography variant="caption" color="text.disabled" fontWeight={1000} sx={{ letterSpacing: 0.5, display: "block", mb: 0.5 }}>{label}</Typography>
                                                    <Typography variant="body1" fontWeight={800} sx={{ color: 'text.primary' }}>{value || "—"}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}

                                <Box sx={{
                                    p: 4, borderRadius: 6,
                                    background: `linear-gradient(135deg, ${alpha(dept.color, 0.1)} 0%, ${alpha(dept.color, 0.02)} 100%)`,
                                    border: `1px solid ${alpha(dept.color, 0.2)}`,
                                    display: 'flex', alignItems: 'center', gap: 3
                                }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: dept.color, animation: 'pulse 2s infinite' }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Strategic Domain: {dept.name}</Typography>
                                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                            {dept.code} PROGRAM · FALL ADMISSIONS CYCLE
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        {/* Navigation buttons */}
                        <Divider sx={{ my: 6, opacity: 0.6 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={activeStep === 0 ? () => navigate("/apply") : handleBack}
                                sx={{ borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 4, py: 1.8, fontSize: '1rem', border: '1px solid', borderColor: 'divider', color: 'text.secondary', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary', color: 'text.primary' } }}
                            >
                                {activeStep === 0 ? "Abort Process" : "Protocol Retreat"}
                            </Button>

                            {activeStep < STEPS.length - 1 ? (
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                    onClick={handleNext}
                                    sx={{
                                        borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 5, py: 1.8, fontSize: '1rem',
                                        background: dept.gradient,
                                        boxShadow: `0 12px 32px ${alpha(dept.color, 0.3)}`,
                                        "&:hover": { background: dept.gradient, boxShadow: `0 16px 48px ${alpha(dept.color, 0.45)}`, transform: 'translateX(4px)' }
                                    }}
                                >
                                    Proceed to Protocol {activeStep + 2}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={submitting ? null : <Send />}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    sx={{
                                        borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 6, py: 2, fontSize: '1.1rem',
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        boxShadow: "0 20px 48px rgba(16,185,129,0.3)",
                                        "&:hover": { background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 24px 60px rgba(16,185,129,0.45)", transform: 'scale(1.02)' },
                                        "&.Mui-disabled": { background: "rgba(16,185,129,0.3)", color: "rgba(255,255,255,0.5)" }
                                    }}
                                >
                                    {submitting ? "Transmitting..." : "Initialize Submission"}
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
