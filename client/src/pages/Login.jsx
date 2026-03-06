import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, School, ArrowForward } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!formData.email || !formData.password) { setLocalError("Please fill in all fields"); return; }
    const result = await login(formData.email, formData.password);
    if (result.success) navigate(result.redirectTo);
    else setLocalError(result.error);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Panel - Branding */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 50%, #6a1b9a 100%)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: -100, right: -100, background: "rgba(255,255,255,0.05)" }} />
        <Box sx={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", bottom: -50, left: -50, background: "rgba(255,255,255,0.07)" }} />
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Box sx={{ width: 80, height: 80, borderRadius: 3, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, border: "1px solid rgba(255,255,255,0.2)" }}>
            <School sx={{ fontSize: 44, color: "white" }} />
          </Box>
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom letterSpacing="-0.02em">
            University Portal
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={400} sx={{ maxWidth: 320, mx: "auto", lineHeight: 1.7 }}>
            Your complete academic management platform for students, faculty, and staff.
          </Typography>
          {/* Info strips */}
          {[
            { label: "Students Enrolled", value: "1,200+" },
            { label: "Active Courses", value: "150+" },
            { label: "Expert Faculty", value: "100+" },
          ].map((item, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mt: i === 0 ? 5 : 1.5, p: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)" }}>
              <Typography color="rgba(255,255,255,0.7)" variant="body2">{item.label}</Typography>
              <Typography color="white" fontWeight={700} variant="body2">{item.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 480px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: 6,
          bgcolor: "white",
        }}
      >
        {/* Mobile logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
          <School sx={{ color: "primary.main", fontSize: 32 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">University Portal</Typography>
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing="-0.02em">
          Welcome back
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to access your dashboard
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{localError || error}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email Address" name="email" type="email"
            value={formData.email} onChange={handleChange} margin="normal" required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.secondary" }} /></InputAdornment> }}
          />
          <TextField
            fullWidth label="Password" name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password} onChange={handleChange} margin="normal" required
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={loading} endIcon={!loading && <ArrowForward />}
            sx={{
              mt: 4, mb: 2, py: 1.6, borderRadius: 2.5, fontWeight: 700,
              fontSize: "1rem", textTransform: "none",
              background: "linear-gradient(135deg, #1976d2, #6a1b9a)",
              boxShadow: "0 8px 24px rgba(25,118,210,0.4)",
              "&:hover": { boxShadow: "0 12px 32px rgba(25,118,210,0.5)", transform: "translateY(-1px)" },
              transition: "all 0.25s ease",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2, fontWeight: 600 }}>
            Quick Account Access (Demo)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Admin Portal", email: "admin@university.edu", color: "#6a1b9a" },
              { label: "Registrar", email: "registrar@university.edu", color: "#1976d2" },
              { label: "Faculty", email: "head@university.edu", color: "#00796b" },
              { label: "Student", email: "student@university.edu", color: "#e65100" }
            ].map((demo) => (
              <Button
                key={demo.label}
                variant="outlined"
                size="small"
                onClick={() => {
                  setFormData({ email: demo.email, password: "password123" });
                  setLocalError("");
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: demo.color,
                  color: demo.color,
                  "&:hover": { bgcolor: `${demo.color}08`, borderColor: demo.color }
                }}
              >
                {demo.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
