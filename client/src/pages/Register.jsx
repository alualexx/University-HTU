import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, MenuItem, Stepper, Step, StepLabel,
  Card, CardContent
} from "@mui/material";
import { Person, Email, School, Badge, ArrowForward, ArrowBack, Description, Grade, CheckCircleOutline } from "@mui/icons-material";
import { db } from "../services/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const steps = ["Personal Info", "Program Selection", "Requirements"];

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    intendedMajor: "",
    highSchoolGrades: "",
    personalStatement: "",
    studentId: "", // Legacy, but keeping for structure
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const validateStep = () => {
    if (activeStep === 0 && (!formData.name || !formData.email)) {
      setLocalError("Please fill in your name and email.");
      return false;
    }
    if (activeStep === 1 && formData.role === "student" && !formData.intendedMajor) {
      setLocalError("Please select an intended major.");
      return false;
    }
    if (activeStep === 2) {
      if (!formData.highSchoolGrades || !formData.personalStatement) {
        setLocalError("Please provide your grades and a brief personal statement.");
        return false;
      }
    }
    setLocalError("");
    return true;
  };

  const handleNext = () => { if (validateStep()) setActiveStep((s) => s + 1); };
  const handleBack = () => { setLocalError(""); setActiveStep((s) => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    setLocalError("");

    try {
      // Add a new document to the "applications" collection
      await addDoc(collection(db, "applications"), {
        ...formData,
        status: "pending",
        submittedAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setLocalError("Failed to submit application. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: 2 } };

  if (success) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f0f4f8", p: 3 }}>
        <Card elevation={0} sx={{ maxWidth: 500, width: "100%", borderRadius: 4, textAlign: "center", p: 5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
          <CheckCircleOutline sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>Application Submitted</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            Thank you, {formData.name}, for applying to our university. Your application is now pending review by the Registrar's Office.
            <br /><br />
            If accepted, you will receive an email with your official student portal credentials.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/"
            sx={{ borderRadius: 2.5, px: 4, py: 1.5, textTransform: "none", fontWeight: 700 }}
          >
            Return to Home Page
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Panel */}
      <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1, background: "linear-gradient(135deg,#0d2b6e 0%,#1976d2 50%,#6a1b9a 100%)", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 6, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: -100, right: -100, background: "rgba(255,255,255,0.05)" }} />
        <Box sx={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", bottom: -50, left: -50, background: "rgba(255,255,255,0.07)" }} />
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Box sx={{ width: 80, height: 80, borderRadius: 3, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, border: "1px solid rgba(255,255,255,0.2)" }}>
            <School sx={{ fontSize: 44, color: "white" }} />
          </Box>
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom letterSpacing="-0.02em">Apply for Admission</Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={400} sx={{ maxWidth: 350, mx: "auto", lineHeight: 1.7 }}>
            Begin your academic journey today. Submit your application for review by our admissions board.
          </Typography>
          {[
            { emoji: "📝", text: "Submit your academic records" },
            { emoji: "🎯", text: "Choose your core program" },
            { emoji: "📋", text: "Registrar reviews your application" },
            { emoji: "🔑", text: "Receive portal credentials upon entry" },
          ].map((item, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2.5, p: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <Typography fontSize={22}>{item.emoji}</Typography>
              <Typography color="rgba(255,255,255,0.85)" variant="body2">{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Panel - Form */}
      <Box sx={{ flex: { xs: 1, md: "0 0 520px" }, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 3, sm: 6 }, py: 6, bgcolor: "white", overflowY: "auto" }}>
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
          <School sx={{ color: "primary.main", fontSize: 32 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">University Portal</Typography>
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing="-0.02em">New Application</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Fill out the details below to complete your admission request.</Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {localError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{localError}</Alert>}

        <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* Step 0 */}
          {activeStep === 0 && (
            <Box>
              <TextField fullWidth label="Full Legal Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.secondary" }} /></InputAdornment> }} />
              <TextField fullWidth label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.secondary" }} /></InputAdornment> }} />
            </Box>
          )}

          {/* Step 1 */}
          {activeStep === 1 && (
            <Box>
              <TextField fullWidth select label="Application Type" name="role" value={formData.role} onChange={handleChange} margin="normal" required sx={inputSx} disabled>
                <MenuItem value="student">🎓 Undergraduate Student</MenuItem>
              </TextField>

              <TextField fullWidth select label="Intended Major" name="intendedMajor" value={formData.intendedMajor} onChange={handleChange} margin="normal" required sx={inputSx}>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Business Administration">Business Administration</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Arts & Humanities">Arts & Humanities</MenuItem>
                <MenuItem value="Pre-Med / Biology">Pre-Med / Biology</MenuItem>
              </TextField>
            </Box>
          )}

          {/* Step 2 */}
          {activeStep === 2 && (
            <Box>
              <TextField
                fullWidth label="High School GPA / Grades Summary" name="highSchoolGrades"
                value={formData.highSchoolGrades} onChange={handleChange} margin="normal" required sx={inputSx}
                placeholder="e.g., 3.8 GPA or 95% Average"
                InputProps={{ startAdornment: <InputAdornment position="start"><Grade sx={{ color: "text.secondary" }} /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Personal Statement (Brief)" name="personalStatement"
                value={formData.personalStatement} onChange={handleChange} margin="normal" required sx={inputSx}
                multiline rows={4}
                placeholder="Why do you want to join our university?"
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack />} sx={{ borderRadius: 2.5, fontWeight: 600, textTransform: "none", flex: 1 }}>Back</Button>
            )}
            <Button
              type="submit" variant="contained" size="large" disabled={loading}
              endIcon={!loading && (activeStep < steps.length - 1 ? <ArrowForward /> : null)}
              sx={{
                flex: 2, py: 1.6, borderRadius: 2.5, fontWeight: 700, fontSize: "1rem", textTransform: "none",
                background: "linear-gradient(135deg,#1976d2,#6a1b9a)",
                boxShadow: "0 8px 24px rgba(25,118,210,0.4)",
                "&:hover": { boxShadow: "0 12px 32px rgba(25,118,210,0.5)", transform: "translateY(-1px)" },
                transition: "all 0.25s ease",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : activeStep < steps.length - 1 ? "Next Step" : "Submit Application"}
            </Button>
          </Box>
        </form>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
          Already admitted?{" "}
          <Box component={RouterLink} to="/login" sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>Sign in to Portal</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
