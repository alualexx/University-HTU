import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    TextField, MenuItem, Chip, LinearProgress, alpha, Stack,
    CircularProgress, Fade
} from "@mui/material";
import {
    Person, School, CloudUpload, CheckCircle,
    ArrowBack, ArrowForward, Send, AssignmentInd,
    Male, Female, ArticleOutlined, LockOutlined
} from "@mui/icons-material";
import { applicationsAPI, departmentsAPI } from "../../services/api";

const getDeptMeta = (dept) => {
    if (!dept) return { color: "#D9A621", gradient: "linear-gradient(135deg,#0E2033,#1a365d)", code: "THEO" };
    const n = (dept.name || "").toLowerCase();
    if (n.includes("biblical")) return { color: "#D9A621", gradient: "linear-gradient(135deg,#D9A621,#b45309)", code: "BIB" };
    if (n.includes("theology") || n.includes("systematic")) return { color: "#12808C", gradient: "linear-gradient(135deg,#12808C,#0d5c64)", code: "THEO" };
    if (n.includes("history")) return { color: "#D9A621", gradient: "linear-gradient(135deg,#D9A621,#92400e)", code: "CHIS" };
    if (n.includes("pastoral")) return { color: "#12808C", gradient: "linear-gradient(135deg,#12808C,#047857)", code: "PAST" };
    if (n.includes("liturg")) return { color: "#D9A621", gradient: "linear-gradient(135deg,#D9A621,#b45309)", code: "LIT" };
    if (n.includes("music") || n.includes("yared")) return { color: "#12808C", gradient: "linear-gradient(135deg,#12808C,#0369a1)", code: "CHM" };
    if (n.includes("ge'ez") || n.includes("language")) return { color: "#D9A621", gradient: "linear-gradient(135deg,#D9A621,#78350f)", code: "GEZ" };
    return { color: "#D9A621", gradient: "linear-gradient(135deg,#0E2033,#1e293b)", code: dept.code || "HTTU" };
};

const STEPS = ["Personal Info", "Academic Background", "Documents & Statement", "Review & Submit"];

/* ── Success Screen ── */
const SuccessScreen = ({ applicationId, applicantName, department }) => (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#060913", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: "60vw", height: "60vw", borderRadius: "50%", top: "-20%", right: "-10%", background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 60%)", filter: "blur(100px)" }} />
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
            <Fade in timeout={600}>
                <Card sx={{ borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(30px)", overflow: "hidden", textAlign: "center" }}>
                    <Box sx={{ height: 6, background: "linear-gradient(90deg, #10b981, #3b82f6)" }} />
                    <CardContent sx={{ p: { xs: 5, md: 8 } }}>
                        <Box sx={{ width: 100, height: 100, borderRadius: "50%", mx: "auto", mb: 4, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(16,185,129,0.2)" }}>
                            <CheckCircle sx={{ fontSize: 56, color: "#10b981" }} />
                        </Box>
                        <Chip label="APPLICATION SECURED" sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 1000, letterSpacing: 2, textTransform: 'uppercase', mb: 3, border: "1px solid rgba(16,185,129,0.3)" }} />
                        <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit", mb: 2 }}>
                            You're in the queue, <Box component="span" sx={{ color: "#10b981" }}>{applicantName.split(" ")[0]}</Box>
                        </Typography>
                        <Typography color="rgba(255,255,255,0.5)" sx={{ lineHeight: 1.8, mb: 5, fontSize: "1.1rem" }}>
                            Your application profile for <span style={{ color: "white", fontWeight: 800 }}>{department}</span> is currently transmitting to the Registrar's core framework.
                        </Typography>

                        <Box sx={{ p: 4, borderRadius: 4, bgcolor: "rgba(0,0,0,0.5)", border: "1px dashed rgba(255,255,255,0.1)", mb: 4 }}>
                            <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.4)" sx={{ textTransform: "uppercase", letterSpacing: 3, display: "block", mb: 1 }}>Reference Node</Typography>
                            <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: "monospace", color: "#3b82f6", letterSpacing: 4 }}>
                                {applicationId?.slice(0, 4).toUpperCase()}—{applicationId?.slice(4, 10).toUpperCase()}
                            </Typography>
                        </Box>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" mt={6}>
                            <Button variant="contained" component={RouterLink} to="/" sx={{ borderRadius: 50, textTransform: "none", fontWeight: 900, px: 5, py: 2, background: "linear-gradient(135deg, #10b981, #059669)", "&:hover": { filter: "brightness(1.2)" } }}>Back to Home</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Fade>
        </Container>
    </Box>
);

const FormField = ({ label, name, value, onChange, error, helperText, type = "text", multiline = false, rows, select, children, placeholder, inputProps, InputLabelProps, color }) => (
    <TextField
        fullWidth label={label} name={name} value={value} onChange={onChange}
        error={!!error} helperText={error || helperText} type={type}
        multiline={multiline} rows={rows} select={select} placeholder={placeholder}
        inputProps={inputProps} InputLabelProps={{ ...InputLabelProps, sx: { color: "rgba(255,255,255,0.5)", "&.Mui-focused": { color } } }}
        variant="outlined"
        sx={{
            "& .MuiOutlinedInput-root": {
                borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: alpha(color, 0.5) },
                "&.Mui-focused fieldset": { borderColor: color, borderWidth: 2 },
            },
            "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)", opacity: 1 },
            "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.4)" },
            "& .Mui-error .MuiFormHelperText-root": { color: "#ef4444" },
            "& .MuiSelect-icon": { color: "rgba(255,255,255,0.5)" }
        }}
    >{children}</TextField>
);

const StepHeader = ({ icon: Icon, title, subtitle, color }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 6, pb: 4, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 4, bgcolor: alpha(color, 0.1), color, border: `1px solid ${alpha(color, 0.2)}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${alpha(color, 0.2)}`, flexShrink: 0 }}>
            <Icon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
            <Typography variant="h3" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit", mb: 1 }}>{title}</Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.5)" fontWeight={500}>{subtitle}</Typography>
        </Box>
    </Box>
);

export default function ApplicationForm() {
    const { departmentId } = useParams();
    const navigate = useNavigate();

    const [deptData, setDeptData] = useState(null);
    const [deptLoading, setDeptLoading] = useState(true);
    const [deptError, setDeptError] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", dateOfBirth: "", gender: "", nationality: "", phone: "", address: "",
        highSchoolName: "", graduationYear: "", gpa: "", gradeSystem: "", previousQualification: "", extraCurricular: "",
        personalStatement: "", whyThisDepartment: "",
        idDocument: null, idDocumentName: "", transcript: null, transcriptName: "", photo: null, photoName: "", recommendationLetter: null, recommendationLetterName: "",
    });

    useEffect(() => {
        const fetchDept = async () => {
            setDeptLoading(true);
            try {
                const res = await departmentsAPI.getById(departmentId);
                if (res.data) {
                    const meta = getDeptMeta(res.data);
                    setDeptData({ ...res.data, ...meta, name: res.data.name, code: res.data.code || meta.code });
                } else {
                    setDeptError(true);
                }
            } catch (err) {
                console.error("Error fetching department:", err);
                setDeptError(true);
            } finally {
                setDeptLoading(false);
            }
        };
        if (departmentId) {
            fetchDept();
        } else {
            setDeptError(true);
            setDeptLoading(false);
        }
    }, [departmentId]);

    if (deptLoading) return <Box sx={{ minHeight: "100vh", bgcolor: "#060913", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress sx={{ color: "white" }} /></Box>;
    if (deptError || !deptData) return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#060913", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box textAlign="center">
                <Typography variant="h3" color="white" fontWeight={1000} mb={2}>Sector Offline</Typography>
                <Button component={RouterLink} to="/apply" variant="contained" sx={{ borderRadius: 50, px: 4, py: 1.5, textTransform: "none" }}>Browse Domains</Button>
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
        if (file) setForm({ ...form, [field]: file, [`${field}Name`]: file.name });
    };

    const validate = () => {
        const e = {};
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (activeStep === 0) {
            if (!form.firstName) e.firstName = "Required";
            if (!form.lastName) e.lastName = "Required";
            if (!form.email) e.email = "Required";
            else if (!validateEmail(form.email)) e.email = "Invalid email address";
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
            if (!form.personalStatement || form.personalStatement.length < 50) e.personalStatement = "At least 50 chars required";
            if (!form.whyThisDepartment || form.whyThisDepartment.length < 30) e.whyThisDepartment = "At least 30 chars required";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => { if (validate()) setActiveStep(p => p + 1); };
    const handleBack = () => setActiveStep(p => p - 1);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) { resolve(""); return; }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const refId = `${Array.from({ length: 4 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("")}—${Array.from({ length: 6 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("")}`;

        try {
            const docsBase64 = {};
            if (form.idDocument) docsBase64.idDocument = await fileToBase64(form.idDocument);
            if (form.transcript) docsBase64.transcript = await fileToBase64(form.transcript);
            if (form.photo) docsBase64.photo = await fileToBase64(form.photo);
            if (form.recommendationLetter) docsBase64.recommendationLetter = await fileToBase64(form.recommendationLetter);

            const data = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                dob: form.dateOfBirth,
                gender: form.gender,
                nationality: form.nationality,
                address: form.address,
                highSchoolName: form.highSchoolName,
                graduationYear: form.graduationYear,
                gradeSystem: form.gradeSystem,
                highSchoolGrades: form.gpa,
                previousQualification: form.previousQualification,
                extraCurricular: form.extraCurricular,
                personalStatement: form.personalStatement,
                whyThisDepartment: form.whyThisDepartment,
                college: dept.collegeId?.name || "University Department",
                department: dept.name,
                program: form.whyThisDepartment?.substring(0, 50),
                year: "1",
                semester: "Fall 2026",
                referenceId: refId,
                documents: docsBase64,
            };

            const response = await applicationsAPI.submit(data);

            setApplicationId(refId);
            setSubmitted(true);
        } catch (err) {
            setErrors({ submit: `Transmission Failed: ${err.response?.data?.message || err.message}` });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) return <SuccessScreen applicationId={applicationId} applicantName={`${form.firstName} ${form.lastName}`} department={dept.name} />;

    return (
        <Box sx={{ bgcolor: "#060913", minHeight: "100vh", color: "white" }}>
            <Box sx={{ pt: { xs: 15, md: 20 }, pb: 10, position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", width: "50vw", height: "50vw", borderRadius: "50%", top: "-30%", left: "-10%", background: `radial-gradient(circle, ${alpha(dept.color, 0.2)} 0%, transparent 60%)`, filter: "blur(100px)" }} />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate("/apply")}
                        sx={{ color: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 800, mb: 4, borderRadius: 50, px: 2, "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" } }}>
                        Abort Process
                    </Button>

                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="flex-end" mb={6}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ width: 80, height: 80, borderRadius: 4, background: dept.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${alpha(dept.color, 0.3)}` }}>
                                <School sx={{ color: "white", fontSize: 40 }} />
                            </Box>
                            <Box>
                                <Chip label={dept.code} size="small" sx={{ bgcolor: alpha(dept.color, 0.2), color: "white", fontWeight: 900, mb: 1, px: 1, border: `1px solid ${alpha(dept.color, 0.4)}` }} />
                                <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit", letterSpacing: "-0.02em" }}>{dept.name}</Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Box sx={{ bgcolor: "rgba(255,255,255,0.02)", p: 4, borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.5)" sx={{ textTransform: "uppercase", letterSpacing: 2 }}>Phase {activeStep + 1} // {STEPS[activeStep]}</Typography>
                            <Typography variant="h6" fontWeight={1000} color={dept.color}>{Math.round(progress)}%</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.05)", "& .MuiLinearProgress-bar": { background: dept.gradient, borderRadius: 3 } }} />
                        <Stack direction="row" spacing={2} mt={3} sx={{ display: { xs: "none", md: "flex" } }}>
                            {STEPS.map((s, i) => (
                                <Box key={s} sx={{ flex: 1, py: 1.5, px: 2, borderRadius: 3, bgcolor: i === activeStep ? alpha(dept.color, 0.15) : i < activeStep ? "rgba(255,255,255,0.05)" : "transparent", border: "1px solid", borderColor: i === activeStep ? alpha(dept.color, 0.5) : "rgba(255,255,255,0.05)", textAlign: "center" }}>
                                    <Typography variant="caption" fontWeight={900} color={i === activeStep ? "white" : "rgba(255,255,255,0.3)"} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{s}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 15 }}>
                <Card sx={{ borderRadius: 6, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.05)", overflow: "visible" }}>
                    <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                        <Fade in key={activeStep} timeout={400}>
                            <Box>
                                {/* Step 0 */}
                                {activeStep === 0 && (
                                    <Box>
                                        <StepHeader icon={Person} title="Subject Identification" subtitle="Official bio-data synchronization." color={dept.color} />

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3, borderRadius: 3, bgcolor: alpha(dept.color, 0.1), border: `1px solid ${alpha(dept.color, 0.2)}`, mb: 6 }}>
                                            <LockOutlined sx={{ color: dept.color, fontSize: 24 }} />
                                            <Box>
                                                <Typography variant="body1" fontWeight={800} color="white">Secure Identity Node</Typography>
                                                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontSize: "0.85rem" }}>Credentials will be beamed upon administration clearance.</Typography>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={4}>
                                            <Grid item xs={12} sm={6}><FormField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Email Address" name="email" value={form.email} onChange={handleChange} error={errors.email} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Birth Date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} type="date" InputLabelProps={{ shrink: true }} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} error={errors.gender} select color={dept.color} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "#0f172a", color: "white" } } } }}>
                                                    <MenuItem value="male"><Stack direction="row" spacing={1} alignItems="center"><Male /> <span>Male</span></Stack></MenuItem>
                                                    <MenuItem value="female"><Stack direction="row" spacing={1} alignItems="center"><Female /> <span>Female</span></Stack></MenuItem>
                                                    <MenuItem value="other"><Stack direction="row" spacing={1} alignItems="center"><span>Other</span></Stack></MenuItem>
                                                    <MenuItem value="prefer_not_to_say"><Stack direction="row" spacing={1} alignItems="center"><span>Prefer not to say</span></Stack></MenuItem>
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} error={errors.nationality} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Comm Link (Phone)" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} color={dept.color} /></Grid>
                                            <Grid item xs={12}><FormField label="Physical Coordinates" name="address" value={form.address} onChange={handleChange} multiline rows={3} color={dept.color} /></Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 1 */}
                                {activeStep === 1 && (
                                    <Box>
                                        <StepHeader icon={School} title="Academic Metrics" subtitle="Previous institutional performance data." color={dept.color} />
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}><FormField label="Prior Institution" name="highSchoolName" value={form.highSchoolName} onChange={handleChange} error={errors.highSchoolName} color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}><FormField label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} error={errors.graduationYear} type="number" color={dept.color} /></Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField label="Grading Paradigm" name="gradeSystem" value={form.gradeSystem} onChange={handleChange} select color={dept.color} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: "#0f172a", color: "white" } } } }}>
                                                    <MenuItem value="gpa_4">GPA Base-4.0</MenuItem>
                                                    <MenuItem value="percentage">Percentage Scale</MenuItem>
                                                    <MenuItem value="grade_letter">Letter Metric</MenuItem>
                                                </FormField>
                                            </Grid>
                                            <Grid item xs={12}><FormField label="Final Metric Score" name="gpa" value={form.gpa} onChange={handleChange} error={errors.gpa} color={dept.color} /></Grid>
                                            <Grid item xs={12}><FormField label="Auxiliary Certifications" name="previousQualification" value={form.previousQualification} onChange={handleChange} multiline rows={3} color={dept.color} /></Grid>
                                            <Grid item xs={12}><FormField label="Extracurricular Ventures" name="extraCurricular" value={form.extraCurricular} onChange={handleChange} multiline rows={3} color={dept.color} /></Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 2 */}
                                {activeStep === 2 && (
                                    <Box>
                                        <StepHeader icon={ArticleOutlined} title="Data Uploads" subtitle="Attach verified physical counterparts." color={dept.color} />

                                        <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.4)" sx={{ textTransform: "uppercase", letterSpacing: 2, mb: 3, display: "block" }}>Required Packets</Typography>
                                        <Grid container spacing={3} mb={6}>
                                            {[{ label: "Global ID", field: "idDocumentName" }, { label: "Transcripts", field: "transcriptName" }, { label: "Biometric Scan", field: "photoName" }, { label: "Recommendation", field: "recommendationLetterName" }].map((doc) => (
                                                <Grid item xs={12} sm={6} key={doc.field}>
                                                    <Box component="label" sx={{
                                                        display: "flex", alignItems: "center", gap: 3, p: 3, borderRadius: 4, cursor: "pointer",
                                                        border: "1px dashed", borderColor: form[doc.field] ? "#10b981" : "rgba(255,255,255,0.2)",
                                                        bgcolor: form[doc.field] ? alpha("#10b981", 0.1) : "rgba(255,255,255,0.02)",
                                                        transition: "all 0.3s ease", "&:hover": { borderColor: dept.color, bgcolor: alpha(dept.color, 0.05) }
                                                    }}>
                                                        <input type="file" hidden onChange={handleFileChange(doc.field.replace('Name', ''))} />
                                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: form[doc.field] ? alpha("#10b981", 0.2) : "rgba(255,255,255,0.05)" }}>
                                                            {form[doc.field] ? <CheckCircle sx={{ color: "#10b981", fontSize: 24 }} /> : <CloudUpload sx={{ color: "white", fontSize: 24 }} />}
                                                        </Box>
                                                        <Box sx={{ minWidth: 0 }}>
                                                            <Typography variant="body2" fontWeight={800} color={form[doc.field] ? "#10b981" : "white"} sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 0.5 }}>{doc.label}</Typography>
                                                            <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{form[doc.field] || "Awaiting file..."}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Grid container spacing={4}>
                                            <Grid item xs={12}><FormField label="Personal Statement" name="personalStatement" value={form.personalStatement} onChange={handleChange} error={errors.personalStatement} multiline rows={6} color={dept.color} /></Grid>
                                            <Grid item xs={12}><FormField label={`Why ${dept.name}?`} name="whyThisDepartment" value={form.whyThisDepartment} onChange={handleChange} error={errors.whyThisDepartment} multiline rows={4} color={dept.color} /></Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Step 3 */}
                                {activeStep === 3 && (
                                    <Box>
                                        <StepHeader icon={AssignmentInd} title="Final Verification" subtitle="Ensure all metrics are aligned prior to dispatch." color={dept.color} />
                                        {errors.submit && <Typography color="error" mb={4}>{errors.submit}</Typography>}

                                        {[{ title: "Bio-Data", rows: [["Name", `${form.firstName} ${form.lastName}`], ["Email", form.email], ["Comm", form.phone]] }, { title: "Metrics", rows: [["Institute", form.highSchoolName], ["Score", form.gpa]] }].map((sec) => (
                                            <Box key={sec.title} sx={{ mb: 4, borderRadius: 4, bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                    <Typography variant="caption" fontWeight={1000} color={dept.color} sx={{ letterSpacing: 2, textTransform: "uppercase" }}>{sec.title}</Typography>
                                                </Box>
                                                <Grid container sx={{ p: 2 }}>
                                                    {sec.rows.map(([lbl, val]) => (
                                                        <Grid item xs={12} sm={6} key={lbl} sx={{ p: 2 }}>
                                                            <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight={800} sx={{ letterSpacing: 1, textTransform: "uppercase", display: "block", mb: 1 }}>{lbl}</Typography>
                                                            <Typography variant="body1" fontWeight={800} color="white">{val || "—"}</Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        ))}

                                        <Box sx={{ p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${alpha(dept.color, 0.15)}, transparent)`, border: `1px solid ${alpha(dept.color, 0.3)}`, display: "flex", alignItems: "center", gap: 3, mt: 6 }}>
                                            <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: dept.color, boxShadow: `0 0 15px ${dept.color}` }} />
                                            <Box>
                                                <Typography variant="h5" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit" }}>{dept.name}</Typography>
                                                <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 2 }}>{dept.code} /// Intake 2026</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Fade>

                        {/* Navigation */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 8, pt: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <Button variant="outlined" startIcon={<ArrowBack />} onClick={activeStep === 0 ? () => navigate("/apply") : handleBack}
                                sx={{ borderRadius: 50, textTransform: "none", fontWeight: 900, px: 4, py: 1.5, borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "white", color: "white" } }}>
                                {activeStep === 0 ? "Abort" : "Reverse"}
                            </Button>

                            {activeStep < STEPS.length - 1 ? (
                                <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}
                                    sx={{ borderRadius: 50, textTransform: "none", fontWeight: 900, px: 5, py: 1.5, background: dept.gradient, "&:hover": { filter: "brightness(1.2)" } }}>
                                    Proceed
                                </Button>
                            ) : (
                                <Button variant="contained" startIcon={submitting ? null : <Send />} onClick={handleSubmit} disabled={submitting}
                                    sx={{ borderRadius: 50, textTransform: "none", fontWeight: 900, px: 6, py: 1.5, background: "linear-gradient(135deg, #10b981, #059669)", "&:hover": { filter: "brightness(1.2)" } }}>
                                    {submitting ? "Transmitting..." : "Initialize Transfer"}
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
