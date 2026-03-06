import React, { useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    TextField, MenuItem, Chip, Avatar, Stepper, Step, StepLabel,
    StepContent, Alert, Divider, IconButton, LinearProgress, alpha,
} from "@mui/material";
import {
    Person, School, Description, CloudUpload, CheckCircle,
    ArrowBack, ArrowForward, Send, AccessTime, HourglassTop,
    AssignmentInd, Email, Phone, CalendarToday, Public,
    Male, Female, ArticleOutlined,
} from "@mui/icons-material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/Firebase";

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
    <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", py: 8 }}>
        <Container maxWidth="sm">
            <Card elevation={0} sx={{ borderRadius: 5, border: "1px solid", borderColor: "divider", overflow: "hidden", textAlign: "center" }}>
                <Box sx={{ height: 6, background: "linear-gradient(90deg, #1976d2, #6a1b9a)" }} />
                <CardContent sx={{ p: 6 }}>
                    {/* Animated icon */}
                    <Box sx={{
                        width: 100, height: 100, borderRadius: "50%", mx: "auto", mb: 3,
                        background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(234,88,12,0.2)",
                        animation: "pulse 2s ease-in-out infinite",
                        "@keyframes pulse": { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.06)" } },
                    }}>
                        <HourglassTop sx={{ fontSize: 48, color: "#ea580c" }} />
                    </Box>

                    <Chip
                        label="Application Submitted"
                        icon={<CheckCircle sx={{ fontSize: "16px !important", color: "#16a34a !important" }} />}
                        sx={{ mb: 2, bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, border: "1px solid #bbf7d0" }}
                    />

                    <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: "-0.02em" }}>
                        You're on the list, {applicantName.split(" ")[0]}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                        Your application to <strong>{department}</strong> has been received and is currently under review by our Registrar's Office.
                    </Typography>

                    <Box sx={{
                        p: 2.5, borderRadius: 3, bgcolor: "#f8fafc",
                        border: "1px solid", borderColor: "divider", mb: 4, textAlign: "left"
                    }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1.5 }}>
                            Application Reference
                        </Typography>
                        <Typography variant="h6" fontWeight={800} fontFamily="monospace" color="primary">
                            #{applicationId?.slice(0, 12).toUpperCase()}
                        </Typography>
                    </Box>

                    <Alert severity="info" sx={{ borderRadius: 2.5, textAlign: "left", mb: 4 }}>
                        <Typography variant="body2">
                            You will be notified via <strong>email and SMS</strong> once a decision has been made. This process typically takes <strong>3–7 business days</strong>.
                        </Typography>
                    </Alert>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/"
                            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 4, py: 1.3 }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/apply"
                            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 4, py: 1.3 }}
                        >
                            View Departments
                        </Button>
                    </Box>
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
            const docRef = await addDoc(collection(db, "applications"), {
                // Identity
                name: `${form.firstName} ${form.lastName}`,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                nationality: form.nationality,
                address: form.address,
                // Academic
                highSchoolName: form.highSchoolName,
                graduationYear: form.graduationYear,
                highSchoolGrades: form.gpa,
                gradeSystem: form.gradeSystem,
                previousQualification: form.previousQualification,
                extraCurricular: form.extraCurricular,
                // Statements
                personalStatement: form.personalStatement,
                whyThisDepartment: form.whyThisDepartment,
                // Documents (names only in this demo)
                documents: {
                    idDocument: form.idDocumentName,
                    transcript: form.transcriptName,
                    photo: form.photoName,
                },
                // Application meta
                intendedMajor: dept.name,
                departmentId,
                departmentCode: dept.code,
                status: "pending",
                submittedAt: serverTimestamp(),
            });
            setApplicationId(docRef.id);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return <PendingScreen applicationId={applicationId} applicantName={`${form.firstName} ${form.lastName}`} department={dept.name} />;
    }

    const progress = ((activeStep) / (STEPS.length - 1)) * 100;

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header */}
            <Box sx={{
                background: dept.gradient,
                pt: { xs: 14, md: 16 }, pb: 10,
                position: "relative", overflow: "hidden",
            }}>
                <Box sx={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/apply")}
                        sx={{ color: "rgba(255,255,255,0.8)", textTransform: "none", fontWeight: 600, mb: 3, "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
                    >
                        Back to Departments
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48, fontSize: "1rem", fontWeight: 900, backdropFilter: "blur(10px)" }}>
                            {dept.code}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={900} color="white" sx={{ letterSpacing: "-0.02em" }}>
                                {dept.name}
                            </Typography>
                            <Typography variant="body1" color="rgba(255,255,255,0.8)">
                                Application Form — Fall 2026 Intake
                            </Typography>
                        </Box>
                    </Box>

                    {/* Progress */}
                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" color="rgba(255,255,255,0.8)" fontWeight={700}>
                                Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep]}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.8)" fontWeight={700}>
                                {Math.round(progress)}% Complete
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 6, borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.2)",
                                "& .MuiLinearProgress-bar": { bgcolor: "white", borderRadius: 3 }
                            }}
                        />
                    </Box>
                </Container>

                {/* Wave */}
                <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
                    <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
                        <path d="M0 50L720 20L1440 50V50H0Z" fill="#f8fafc" />
                    </svg>
                </Box>
            </Box>

            <Container maxWidth="md" sx={{ mt: -4, pb: 10, position: "relative", zIndex: 1 }}>
                <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>

                        {/* ── Step 0: Personal Info ── */}
                        {activeStep === 0 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                                    <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(dept.color, 0.1), color: dept.color }}>
                                        <Person />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800}>Personal Information</Typography>
                                        <Typography variant="body2" color="text.secondary">Your basic personal details</Typography>
                                    </Box>
                                </Box>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="First Name *" name="firstName" value={form.firstName} onChange={handleChange}
                                            error={!!errors.firstName} helperText={errors.firstName}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange}
                                            error={!!errors.lastName} helperText={errors.lastName}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Date of Birth *" name="dateOfBirth" type="date" value={form.dateOfBirth}
                                            onChange={handleChange} InputLabelProps={{ shrink: true }}
                                            error={!!errors.dateOfBirth} helperText={errors.dateOfBirth}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth select label="Gender *" name="gender" value={form.gender} onChange={handleChange}
                                            error={!!errors.gender} helperText={errors.gender}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                            <MenuItem value="prefer_not">Prefer not to say</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Nationality *" name="nationality" value={form.nationality} onChange={handleChange}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Phone Number *" name="phone" value={form.phone} onChange={handleChange}
                                            error={!!errors.phone} helperText={errors.phone}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange}
                                            error={!!errors.email} helperText={errors.email}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Home Address" name="address" value={form.address} onChange={handleChange} multiline rows={2}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 1: Academic Background ── */}
                        {activeStep === 1 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                                    <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(dept.color, 0.1), color: dept.color }}>
                                        <School />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800}>Academic Background</Typography>
                                        <Typography variant="body2" color="text.secondary">Your educational history and achievements</Typography>
                                    </Box>
                                </Box>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="High School / Secondary School Name *" name="highSchoolName" value={form.highSchoolName}
                                            onChange={handleChange} error={!!errors.highSchoolName} helperText={errors.highSchoolName}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Graduation Year *" name="graduationYear" value={form.graduationYear} onChange={handleChange}
                                            type="number" inputProps={{ min: 2010, max: 2026 }}
                                            error={!!errors.graduationYear} helperText={errors.graduationYear}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth select label="Grade System *" name="gradeSystem" value={form.gradeSystem} onChange={handleChange}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                                            <MenuItem value="gpa_4">GPA (4.0 scale)</MenuItem>
                                            <MenuItem value="percentage">Percentage (%)</MenuItem>
                                            <MenuItem value="grade_letter">Grade Letters (A–F)</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="GPA / Final Grade *" name="gpa" value={form.gpa} onChange={handleChange}
                                            placeholder="e.g. 3.8 / 4.0 or 92% or A+"
                                            error={!!errors.gpa} helperText={errors.gpa || "Enter your final cumulative grade"}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Previous Qualifications / Certificates" name="previousQualification"
                                            value={form.previousQualification} onChange={handleChange} multiline rows={2}
                                            placeholder="List any diplomas, certifications, or awards (optional)"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Extracurricular Activities" name="extraCurricular"
                                            value={form.extraCurricular} onChange={handleChange} multiline rows={2}
                                            placeholder="Sports, clubs, volunteering, leadership roles, etc. (optional)"
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 2: Documents & Statement ── */}
                        {activeStep === 2 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                                    <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(dept.color, 0.1), color: dept.color }}>
                                        <Description />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800}>Documents & Statement</Typography>
                                        <Typography variant="body2" color="text.secondary">Upload required documents and write your personal statement</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="subtitle2" fontWeight={700} mb={2}>Required Documents</Typography>
                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    {[
                                        { label: "National ID / Passport *", field: "idDocumentName", accept: "image/*,.pdf" },
                                        { label: "Academic Transcripts *", field: "transcriptName", accept: ".pdf,image/*" },
                                        { label: "Passport-size Photo *", field: "photoName", accept: "image/*" },
                                    ].map((doc) => (
                                        <Grid item xs={12} sm={4} key={doc.field}>
                                            <Box
                                                component="label"
                                                sx={{
                                                    display: "flex", flexDirection: "column", alignItems: "center",
                                                    gap: 1.5, p: 3, borderRadius: 3, cursor: "pointer",
                                                    border: "2px dashed", borderColor: form[doc.field] ? "success.main" : "divider",
                                                    bgcolor: form[doc.field] ? alpha("#16a34a", 0.04) : "#fafafa",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": { borderColor: dept.color, bgcolor: alpha(dept.color, 0.03) }
                                                }}
                                            >
                                                <input type="file" hidden accept={doc.accept} onChange={handleFileChange(doc.field)} />
                                                {form[doc.field] ? (
                                                    <CheckCircle sx={{ fontSize: 32, color: "success.main" }} />
                                                ) : (
                                                    <CloudUpload sx={{ fontSize: 32, color: "text.disabled" }} />
                                                )}
                                                <Typography variant="caption" fontWeight={700} textAlign="center" color={form[doc.field] ? "success.main" : "text.secondary"}>
                                                    {form[doc.field] || doc.label}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth multiline rows={5}
                                            label="Personal Statement *"
                                            name="personalStatement"
                                            value={form.personalStatement}
                                            onChange={handleChange}
                                            error={!!errors.personalStatement}
                                            helperText={errors.personalStatement || `${form.personalStatement.length} characters — tell us about yourself, your interests and goals`}
                                            placeholder="Describe yourself, your passions, your life experiences, and what drives you academically..."
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth multiline rows={4}
                                            label={`Why ${dept.name}? *`}
                                            name="whyThisDepartment"
                                            value={form.whyThisDepartment}
                                            onChange={handleChange}
                                            error={!!errors.whyThisDepartment}
                                            helperText={errors.whyThisDepartment || "Explain your motivation for choosing this specific department"}
                                            placeholder={`Explain why you're passionate about ${dept.name} and what you hope to achieve...`}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* ── Step 3: Review & Submit ── */}
                        {activeStep === 3 && (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                                    <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: alpha(dept.color, 0.1), color: dept.color }}>
                                        <AssignmentInd />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={800}>Review Your Application</Typography>
                                        <Typography variant="body2" color="text.secondary">Please confirm everything before submitting</Typography>
                                    </Box>
                                </Box>

                                <Alert severity="info" sx={{ borderRadius: 2.5, mb: 4 }}>
                                    Please review your information carefully. Once submitted, you cannot edit your application.
                                </Alert>

                                {/* Summary cards */}
                                {[
                                    {
                                        title: "Personal Information",
                                        rows: [
                                            ["Full Name", `${form.firstName} ${form.lastName}`],
                                            ["Email", form.email],
                                            ["Phone", form.phone],
                                            ["Date of Birth", form.dateOfBirth],
                                            ["Gender", form.gender],
                                            ["Nationality", form.nationality],
                                        ]
                                    },
                                    {
                                        title: "Academic Background",
                                        rows: [
                                            ["High School", form.highSchoolName],
                                            ["Graduation Year", form.graduationYear],
                                            ["GPA / Grade", form.gpa],
                                            ["Grade System", form.gradeSystem],
                                        ]
                                    },
                                    {
                                        title: "Documents",
                                        rows: [
                                            ["ID Document", form.idDocumentName || "—"],
                                            ["Transcripts", form.transcriptName || "—"],
                                            ["Photo", form.photoName || "—"],
                                        ]
                                    },
                                ].map((section) => (
                                    <Box key={section.title} sx={{ mb: 3, p: 3, borderRadius: 3, bgcolor: "#f8fafc", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" fontWeight={800} mb={2} color={dept.color}>{section.title}</Typography>
                                        <Grid container spacing={1.5}>
                                            {section.rows.map(([label, value]) => (
                                                <Grid item xs={12} sm={6} key={label}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">{label}</Typography>
                                                    <Typography variant="body2" fontWeight={700}>{value || "—"}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}

                                <Box sx={{ p: 3, borderRadius: 3, background: dept.gradient, color: "white", mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={800} mb={0.5}>Applying to: {dept.name}</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.85 }}>Fall 2026 Intake · {dept.code} Program</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Navigation buttons */}
                        <Divider sx={{ my: 4 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={activeStep === 0 ? () => navigate("/apply") : handleBack}
                                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 3, py: 1.2 }}
                            >
                                {activeStep === 0 ? "All Departments" : "Previous"}
                            </Button>

                            {activeStep < STEPS.length - 1 ? (
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                    onClick={handleNext}
                                    sx={{
                                        borderRadius: 2.5, textTransform: "none", fontWeight: 800, px: 4, py: 1.3,
                                        background: dept.gradient,
                                        boxShadow: `0 6px 20px ${alpha(dept.color, 0.35)}`,
                                        "&:hover": { background: dept.gradient, boxShadow: `0 10px 30px ${alpha(dept.color, 0.45)}` }
                                    }}
                                >
                                    Next Step
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={submitting ? null : <Send />}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    sx={{
                                        borderRadius: 2.5, textTransform: "none", fontWeight: 800, px: 5, py: 1.3,
                                        background: "linear-gradient(135deg, #16a34a, #22c55e)",
                                        boxShadow: "0 6px 20px rgba(22,163,74,0.35)",
                                        "&:hover": { background: "linear-gradient(135deg, #15803d, #16a34a)", boxShadow: "0 10px 30px rgba(22,163,74,0.45)" },
                                        "&.Mui-disabled": { background: "linear-gradient(135deg, #86efac, #bbf7d0)", color: "white" }
                                    }}
                                >
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
