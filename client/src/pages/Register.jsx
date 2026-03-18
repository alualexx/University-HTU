import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, MenuItem, Stepper, Step, StepLabel,
  Card, CardContent, Avatar, Paper, Stack, Grid, Fade, Zoom, Chip
} from "@mui/material";
import {
  Person, Email, School, Badge, ArrowForward, ArrowBack,
  Description, Grade, CheckCircleOutline, Phone, CloudUpload,
  CameraAlt, CalendarToday, Assignment, Lock, Info, ErrorOutline,
  NavigateNext, NavigateBefore
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/Firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot } from "firebase/firestore";

const steps = ["Profile", "Academic", "Documents", "Identity", "Review"];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const { userIp, logSecurityEvent, globalAdmissionOpen } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "departments"), where("isPublished", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Files
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [recommendationFile, setRecommendationFile] = useState(null);
  const [nationalIdFile, setNationalIdFile] = useState(null);

  const fileInputRef = useRef(null);
  const recInputRef = useRef(null);
  const nationalIdInputRef = useRef(null);

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [dynamicDocs, setDynamicDocs] = useState({});
  const generateRefId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let part1 = "";
    let part2 = "";
    for (let i = 0; i < 4; i++) part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 6; i++) part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    return `${part1}\u2014${part2}`;
  };
  const [referenceIdPreview] = useState(generateRefId());

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    role: "student",
    intendedMajor: "",
    level: "Year 1",
    highSchoolName: "",
    highSchoolGrades: "",
    personalStatement: "",
  });

  const [validation, setValidation] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[\d\s\-]{10,20}$/.test(phone);

  const getFieldError = (name, value) => {
    switch (name) {
      case "name": return !value ? "Legal name is required" : "";
      case "email": return !validateEmail(value) ? "Invalid email address" : "";
      case "phone": return !validatePhone(value) ? "Invalid phone format" : "";
      case "dob": {
        if (!value) return "Date of birth is required";
        const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 15) return "Applicants must be at least 15 years old";
        return "";
      }
      case "intendedMajor": return !value ? "Please select a major" : "";
      case "highSchoolName": return !value ? "School name is required" : "";
      case "highSchoolGrades": return !value ? "Grades are required" : "";
      case "personalStatement": return value.length < 50 ? "Statement must be at least 50 characters" : "";
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidation(prev => ({ ...prev, [name]: getFieldError(name, value) }));

    if (name === "intendedMajor") {
      const dept = departments.find(d => d.name === value);
      setSelectedDept(dept);
      // Reset dynamic docs when major changes
      setDynamicDocs({});
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Type validation
    const allowedImage = ["image/jpeg", "image/png", "image/jpg"];
    const allowedDoc = [...allowedImage, "application/pdf"];

    if (type === 'photo' && !allowedImage.includes(file.type)) {
      setLocalError("Photo must be JPG or PNG"); return;
    }
    if ((type === 'rec' || type === 'id') && !allowedDoc.includes(file.type)) {
      setLocalError("File must be PDF, JPG or PNG"); return;
    }

    // Size validation (Firestore 1MB limit check)
    if (file.size > 800 * 1024) {
      setLocalError(`File size exceeds 800KB. Please compress the file.`);
      return;
    }

    setLocalError("");
    if (type === 'photo') {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setDynamicDocs(prev => ({ ...prev, [type]: file }));
    }
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.name && validateEmail(formData.email) && formData.dob && !getFieldError("dob", formData.dob);
    }
    if (activeStep === 1) {
      return formData.intendedMajor && formData.highSchoolName && formData.highSchoolGrades;
    }
    if (activeStep === 2) {
      if (!selectedDept) return false;
      const required = selectedDept.requiredDocuments || ["Transcript", "ID/Passport"];
      const hasAllDocs = required.every(docName => dynamicDocs[docName]);
      return hasAllDocs && formData.personalStatement.length >= 50;
    }
    if (activeStep === 3) {
      return photoFile;
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setActiveStep((s) => s + 1);
      setLocalError("");
    } else {
      setLocalError("Please fix the errors below and fill all required fields.");
    }
  };

  const handleBack = () => {
    setLocalError("");
    setActiveStep((s) => s - 1);
  };

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
    setLoading(true);
    try {
      const docsBase64 = {};
      for (const [key, file] of Object.entries(dynamicDocs)) {
        docsBase64[key] = await fileToBase64(file);
      }

      const applicationData = {
        ...formData,
        documents: {
          ...docsBase64,
          photo: await fileToBase64(photoFile),
        },
        referenceId: referenceIdPreview,
        status: "pending_dept_review",
        ipAddress: userIp || "Unknown",
        submittedAt: serverTimestamp(),
        lastStatusUpdate: serverTimestamp()
      };

      await addDoc(collection(db, "applications"), applicationData);
      logSecurityEvent("Identity Management", `New Application Submitted: ${formData.email} [${referenceIdPreview}]`, "info");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setLocalError("Submission failed. Database connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f5f9", p: 3 }}>
        <Zoom in>
          <Card elevation={0} className="glass-panel" sx={{ maxWidth: 600, width: "100%", textAlign: "center", p: 6 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: "50%", bgcolor: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 4 }}>
              <CheckCircleOutline sx={{ fontSize: 64, color: "#22c55e" }} />
            </Box>
            <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: "-0.04em" }}>Application Received</Typography>
            <Typography variant="h6" color="primary" fontWeight={900} sx={{ mb: 2 }}>Reference ID: {referenceIdPreview}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, opacity: 0.8 }}>
              Thank you, <b>{formData.name}</b>. Your application is being processed. Please save your Reference ID for tracking.
            </Typography>
            <Button
              variant="contained" className="btn-premium" size="large"
              component={RouterLink} to="/"
              sx={{ py: 2, px: 6, borderRadius: 4 }}
            >
              Return Home
            </Button>
          </Card>
        </Zoom>
      </Box>
    );
  }

  if (!globalAdmissionOpen) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8fafc", p: 3 }}>
        <Card elevation={0} sx={{ maxWidth: 500, textAlign: 'center', p: 6, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'error.light', color: 'error.main', mx: 'auto', mb: 3 }}>
            <ErrorOutline sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" fontWeight={900} gutterBottom>Admissions Closed</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The general admission period is currently closed. Please check back later or contact the registrar's office for more information.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/" sx={{ borderRadius: 3, py: 1.5, px: 4 }}>Return Home</Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f8fafc" }}>
      {/* Visual Context Panel */}
      <Box sx={{
        display: { xs: "none", lg: "flex" },
        flex: 0.8,
        background: "linear-gradient(135deg, #1e40af 0%, #1e1b4b 100%)",
        color: "white", p: 8, flexDirection: "column", justifyContent: "center", position: "relative"
      }}>
        <Box sx={{ zIndex: 1 }}>
          <Chip label="2026 Admissions" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", mb: 4, backdropFilter: 'blur(10px)' }} />
          <Typography variant="h2" fontWeight={900} gutterBottom sx={{ lineHeight: 1 }}>
            Shape Your <br /><Box component="span" sx={{ color: "#60a5fa" }}>Future</Box> With Us.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, mb: 6, maxWidth: 500 }}>
            Join a community of scholars and innovators. Your journey to excellence begins with a single step.
          </Typography>

          <Stack spacing={4}>
            {[
              { icon: <Assignment />, title: "Digital Portfolio", desc: "Upload and manage your records seamlessly" },
              { icon: <Lock />, title: "Secure Processing", desc: "Your data is protected with industry-standard encryption" },
              { icon: <CheckCircleOutline />, title: "Instant Status", desc: "Track your review progress in real-time" }
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>{item.icon}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.6 }}>{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Main Registration Form */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: { xs: 3, md: 8, xl: 12 }, overflowY: "auto" }}>
        <Box sx={{ maxWidth: 800, mx: "auto", width: "100%" }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.04em", mb: 1 }}>Join the University</Typography>
            <Typography variant="body1" color="text.secondary">Complete the 5 steps to submit your official application.</Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 8 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": { color: "primary.main" },
                      "&.Mui-completed": { color: "#22c55e" }
                    }
                  }}
                >
                  <Typography fontWeight={700}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {localError && <Fade in><Alert severity="error" icon={<ErrorOutline />} sx={{ mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'error.light' }}>{localError}</Alert></Fade>}

          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            {/* Step 0 - Profile */}
            {activeStep === 0 && (
              <Fade in>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}><Person color="primary" /> Personal Profile</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Full Legal Name" name="name" value={formData.name} onChange={handleChange} error={!!validation.name} helperText={validation.name} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!validation.email} helperText={validation.email} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={!!validation.phone} helperText={validation.phone || "Include country code (+962...)"} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} error={!!validation.dob} helperText={validation.dob} required InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Step 1 - Academic */}
            {activeStep === 1 && (
              <Fade in>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}><School color="primary" /> Academic Selection</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField fullWidth select label="Intended Major" name="intendedMajor" value={formData.intendedMajor} onChange={handleChange} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                        {departments.map(dept => (
                          <MenuItem key={dept.id} value={dept.name} disabled={!dept.admissionOpen}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                              <span>{dept.name}</span>
                              {!dept.admissionOpen && <Chip label="CLOSED" size="small" color="error" variant="outlined" sx={{ ml: 1, fontSize: '0.6rem', fontWeight: 900 }} />}
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                      {selectedDept && !selectedDept.admissionOpen && (
                        <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
                          Admission for this program is currently closed. You can view the requirements but cannot submit an application.
                        </Alert>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="High School Name" name="highSchoolName" value={formData.highSchoolName} onChange={handleChange} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="GPA / Final Score" name="highSchoolGrades" value={formData.highSchoolGrades} onChange={handleChange} placeholder="e.g., 3.9 GPA / 98.5%" required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Step 2 - Documents */}
            {activeStep === 2 && (
              <Fade in>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}><Description color="primary" /> Portfolio & Documents</Typography>
                  <Stack spacing={4}>
                    {selectedDept && (selectedDept.requiredDocuments || ["Transcript", "ID/Passport"]).map((docName, idx) => (
                      <Box key={idx} sx={{ p: 3, border: '2px dashed #cbd5e1', borderRadius: 4, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>{docName}</Typography>
                        <input type="file" hidden id={`file-${idx}`} onChange={(e) => handleFileUpload(e, docName)} />
                        <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => document.getElementById(`file-${idx}`).click()} sx={{ borderRadius: 2, mr: 2 }}>
                          {dynamicDocs[docName] ? "Change File" : "Upload File"}
                        </Button>
                        {dynamicDocs[docName] && <Chip label={dynamicDocs[docName].name} onDelete={() => setDynamicDocs(prev => {
                          const next = {...prev};
                          delete next[docName];
                          return next;
                        })} color="primary" />}
                      </Box>
                    ))}

                    <TextField fullWidth label="Personal Statement" name="personalStatement" multiline rows={4} value={formData.personalStatement} onChange={handleChange} placeholder="Tell us about yourself (min 50 characters)" error={!!validation.personalStatement} helperText={validation.personalStatement || `${formData.personalStatement.length}/50 minimum`} required sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                  </Stack>
                </Box>
              </Fade>
            )}

            {/* Step 3 - Identity */}
            {activeStep === 3 && (
              <Fade in>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}><CameraAlt color="primary" /> Official Photo</Typography>
                  <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'photo')} />
                  <Box
                    onClick={() => fileInputRef.current.click()}
                    sx={{ width: 240, height: 240, mx: 'auto', borderRadius: 6, border: '3px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', mb: 4, transition: 'all 0.3s ease', "&:hover": { borderColor: 'primary.main', bgcolor: 'rgba(30,64,175,0.05)' } }}
                  >
                    {photoPreview ? <Box component="img" src={photoPreview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CameraAlt sx={{ fontSize: 64, color: '#94a3b8' }} />}
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Please upload a clear, front-facing passport photo.</Typography>
                  <Button variant="contained" className="btn-premium" startIcon={<CloudUpload />} onClick={() => fileInputRef.current.click()} sx={{ py: 1.5, px: 4, borderRadius: 3 }}>Choose Photo</Button>
                </Box>
              </Fade>
            )}

            {/* Step 4 - Review */}
            {activeStep === 4 && (
              <Fade in>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutline color="success" /> Confirmation
                  </Typography>
                  <Card elevation={0} sx={{ bgcolor: '#f8fafc', borderRadius: 4, p: 3, mb: 4 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar src={photoPreview} sx={{ width: 140, height: 140, mx: 'auto', border: '4px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
                        <Typography variant="h6" fontWeight={800} sx={{ mt: 2 }}>{formData.name}</Typography>
                        <Chip label={formData.intendedMajor} color="primary" size="small" sx={{ mt: 1 }} />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Email</Typography><Typography fontWeight={600}>{formData.email}</Typography></Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Phone</Typography><Typography fontWeight={600}>{formData.phone}</Typography></Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">High School</Typography><Typography fontWeight={600}>{formData.highSchoolName}</Typography></Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Grades</Typography><Typography fontWeight={600}>{formData.highSchoolGrades}</Typography></Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="primary" fontWeight={800}>Reference ID</Typography><Typography color="primary" fontWeight={800}>{referenceIdPreview}</Typography></Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Card>
                  <Alert severity="info" icon={<Info />} sx={{ borderRadius: 3 }}>
                    By submitting, you certify that all information provided is accurate and truthful.
                  </Alert>
                </Box>
              </Fade>
            )}

            {/* Navigation */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button disabled={activeStep === 0 || loading} onClick={handleBack} startIcon={<NavigateBefore />} sx={{ py: 1.5, px: 4, borderRadius: 3, fontWeight: 700 }}>Back</Button>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" className="btn-premium" onClick={handleNext} endIcon={<NavigateNext />} sx={{ py: 1.5, px: 6, borderRadius: 3, flexGrow: 1, maxWidth: 300 }}>Continue</Button>
              ) : (
                <Button variant="contained" className="btn-premium" onClick={handleSubmit} disabled={loading || (selectedDept && !selectedDept.admissionOpen)} sx={{ py: 1.5, px: 6, borderRadius: 3, flexGrow: 1, maxWidth: 300 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Final Application"}
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;

