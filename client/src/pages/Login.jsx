import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTheme, Fade, Stack, Grid, Chip, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, Typography, TextField, Button,
  IconButton, InputAdornment, Alert, CircularProgress, MenuItem
} from "@mui/material";
import {
  Visibility, VisibilityOff, Email, Lock, School,
  ArrowForward, CheckCircle, ErrorOutline, LightMode, DarkMode,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";
import { alpha } from "@mui/material/styles";

const FEATURES = [
  { text: "Real-time Grade Tracking", color: "#60a5fa" },
  { text: "Seamless Resource Access", color: "#34d399" },
  { text: "Advanced Faculty Tools", color: "#fbbf24" },
];

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { login, loading, error, logSecurityEvent, requestPasswordReset } = useAuth();
  const { toggleColorMode } = useColorMode();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [validation, setValidation] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" }
  });

  // Password Reset State
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  const validateEmail = (e) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!e) return { error: true, message: "Email is required" };
    if (!re.test(e)) return { error: true, message: "Please enter a valid email" };
    return { error: false, message: "" };
  };

  const validatePassword = (p) => {
    if (!p) return { error: true, message: "Password is required" };
    if (p.length < 6) return { error: true, message: "Minimum 6 characters" };
    return { error: false, message: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError("");
    if (name === "email") setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    else if (name === "password") setValidation(prev => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const emailVal = validateEmail(formData.email);
    const passVal = validatePassword(formData.password);
    setValidation({ email: emailVal, password: passVal });
    if (emailVal.error || passVal.error) return;
    const result = await login(formData.email, formData.password);
    if (result.success) {
      logSecurityEvent("Identity Management", `Login Successful: ${formData.email}`, "success");
      navigate(result.redirectTo);
    } else {
      logSecurityEvent("Security Protocol", `Failed login attempt: ${formData.email}`, "warning");
      setLocalError(result.error);
    }
  };

  const fillDemo = (email) => {
    setFormData({ email, password: "password123" });
    setValidation({ email: { error: false, message: "" }, password: { error: false, message: "" } });
    setLocalError("");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: isDark ? "#0f172a" : "#f8fafc" }}>
      {/* Left Panel */}
      <Box sx={{
        display: { xs: "none", md: "flex" },
        flex: 1.1,
        background: isDark
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 8,
        position: "relative",
        overflow: "hidden",
        borderRight: isDark ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}>
        {/* Blobs */}
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", top: -100, right: -100, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", bottom: -50, left: -50, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 440 }}>
          {/* Logo */}
          <Box sx={{ 
            display: "inline-flex", p: 1, borderRadius: 4, bgcolor: "white", 
            border: "1px solid rgba(255,255,255,0.15)", mb: 5,
            width: 120, height: 120, overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <Box component="img" src="/logo.png" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </Box>

          <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.04em", mb: 2, lineHeight: 1.1 }}>
            University<br />Resource Center
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.6)" sx={{ mb: 6, lineHeight: 1.8 }}>
            A smarter way to manage your academic journey through our unified portal.
          </Typography>

          <Stack spacing={2}>
            {FEATURES.map((f, i) => (
              <Box key={i} sx={{
                display: "flex", alignItems: "center", gap: 2, p: 2.5,
                bgcolor: "rgba(255,255,255,0.05)", borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.09)" }
              }}>
                <CheckCircle sx={{ color: f.color, flexShrink: 0 }} />
                <Typography color="white" fontWeight={600} variant="body2">{f.text}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box sx={{
        flex: { xs: 1, md: "0 0 560px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: { xs: 4, sm: 8, md: 10 },
        py: 8,
        bgcolor: isDark ? "#0f172a" : "white",
        boxShadow: isDark ? "none" : "-10px 0 40px rgba(0,0,0,0.04)",
        position: "relative",
      }}>
        {/* Top right: dark mode toggle */}
        <Box sx={{ position: "absolute", top: 24, right: 24 }}>
          <IconButton onClick={toggleColorMode} sx={{ bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" } }}>
            {isDark ? <LightMode sx={{ color: "#fbbf24" }} /> : <DarkMode sx={{ color: "#6366f1" }} />}
          </IconButton>
        </Box>

        {/* Mobile logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 6 }}>
          <School sx={{ color: "primary.main", fontSize: 38 }} />
          <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ letterSpacing: "-0.03em" }}>Alex Portal</Typography>
        </Box>

        <Fade in timeout={600}>
          <Box>
            <Chip
              label="Secure Access"
              size="small"
              sx={{ mb: 3, bgcolor: alpha("#1976d2", 0.08), color: "primary.main", fontWeight: 800, border: "1px solid", borderColor: alpha("#1976d2", 0.2) }}
            />
            <Typography variant="h3" fontWeight={1000} gutterBottom sx={{ letterSpacing: "-0.03em", mb: 0.5, fontFamily: "Outfit, sans-serif" }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: "1rem" }}>
              Enter your credentials to access your portal.
            </Typography>

            {(localError || error) && (
              <Fade in>
                <Alert severity="error" icon={<ErrorOutline />}
                  sx={{ mb: 4, borderRadius: 3, fontWeight: 600, border: "1px solid", borderColor: "error.light" }}>
                  {localError || error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth label="Email Address" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  error={validation.email.error} helperText={validation.email.message}
                  required placeholder="name@university.edu"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3, height: 60,
                      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                      "& fieldset": { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    }
                  }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: validation.email.error ? "error.main" : "text.secondary" }} /></InputAdornment> }}
                />

                <TextField
                  fullWidth label="Password" name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password} onChange={handleChange}
                  error={validation.password.error} helperText={validation.password.message}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3, height: 60,
                      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                      "& fieldset": { border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none" },
                      "&:hover fieldset": { borderColor: "primary.main" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: validation.password.error ? "error.main" : "text.secondary" }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Button
                    variant="text" size="small"
                    onClick={() => setShowResetDialog(true)}
                    sx={{ fontWeight: 700, textTransform: "none", color: "primary.main" }}
                  >
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained" disabled={loading}
                  sx={{
                    mt: 1, py: 2, borderRadius: 3,
                    fontSize: "1rem", textTransform: "none", fontWeight: 800,
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                    boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                    "&:hover": { background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", boxShadow: "0 12px 32px rgba(59,130,246,0.45)", transform: "translateY(-1px)" },
                    transition: "all 0.25s ease"
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Sign In <ArrowForward /></Box>}
                </Button>
              </Stack>
            </form>


          </Box>
        </Fade>

        {/* Password Reset Dialog */}
        <Dialog
          open={showResetDialog}
          onClose={() => !resetLoading && setShowResetDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Account Recovery</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your registered email address to request a password reset from the administrator.
            </Typography>

            {resetSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{resetSuccess}</Alert>
            )}
            {resetError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{resetError}</Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={resetLoading}
              placeholder="name@university.edu"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowResetDialog(false)} disabled={resetLoading}>Cancel</Button>
            <Button
              variant="contained"
              disabled={resetLoading || !resetEmail}
              onClick={async () => {
                setResetLoading(true);
                setResetSuccess("");
                setResetError("");
                const result = await requestPasswordReset(resetEmail);
                if (result.success) {
                  setResetSuccess("Request sent! An administrator will review your request.");
                  setResetEmail("");
                  setTimeout(() => setShowResetDialog(false), 3000);
                } else {
                  setResetError(result.error);
                }
                setResetLoading(false);
              }}
              sx={{ borderRadius: 2.5, px: 3, fontWeight: 700, background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
            >
              {resetLoading ? <CircularProgress size={24} color="inherit" /> : "Send Request"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Login;
