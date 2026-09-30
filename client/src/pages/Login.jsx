import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, Button, Checkbox, FormControlLabel,
  InputAdornment, IconButton, Alert, CircularProgress, Divider, Paper, Chip, Stack
} from "@mui/material";
import {
  Visibility, VisibilityOff, PersonOutline, LockOutlined, Security,
  AccountBalance, Church
} from "@mui/icons-material";
import { useAuth, ROLE_DASHBOARD_ROUTES } from "../context/AuthContext";
import { HTTU_COLORS } from "../theme";

const DEMO_ACCOUNTS = [
  { label: "Student", user: "john.doe", pass: "password123", role: "student" },
  { label: "Faculty", user: "dr.abebe", pass: "password123", role: "faculty" },
  { label: "Dept Head", user: "fr.yohannes", pass: "password123", role: "department_head" },
  { label: "Dean", user: "dean", pass: "password123", role: "dean" },
  { label: "Registrar", user: "registrar", pass: "password123", role: "registrar" },
  { label: "Finance", user: "finance", pass: "password123", role: "finance" },
  { label: "HR Manager", user: "hr", pass: "password123", role: "hr" },
  { label: "Librarian", user: "librarian", pass: "password123", role: "librarian" },
  { label: "Admin", user: "admin", pass: "admin123", role: "admin" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("daniel.g@httu.edu.et");
  const [password, setPassword] = useState("••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState("en"); // en, am, gez
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Map placeholder password to real password if needed
      const realPassword = password === "••••••••••" ? "password123" : password;
      const res = await login(username, realPassword);
      if (res?.success) {
        const dest = ROLE_DASHBOARD_ROUTES[res.user?.role] || "/dashboard";
        navigate(dest);
      } else {
        setError(res?.error || "Invalid username or password");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (account) => {
    setUsername(account.user);
    setPassword(account.pass);
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#09131F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
        background: "radial-gradient(circle at 50% 50%, #10243E 0%, #07111D 100%)",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1040,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* ── Left Branding Panel ── */}
        <Box
          sx={{
            flex: { xs: "none", md: "0 0 46%" },
            bgcolor: HTTU_COLORS.navy,
            p: { xs: 5, md: 7 },
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Decorative Gold Triangle in Corner */}
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 180,
              height: 180,
              bgcolor: HTTU_COLORS.gold,
              transform: "rotate(45deg)",
              opacity: 0.9,
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* University Gold Emblem */}
            <Box
              sx={{
                width: 104,
                height: 104,
                borderRadius: "28px",
                border: `3px solid ${HTTU_COLORS.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 4,
                bgcolor: "rgba(217, 166, 33, 0.08)",
                boxShadow: "0 0 30px rgba(217, 166, 33, 0.2)",
              }}
            >
              <Church sx={{ fontSize: 56, color: HTTU_COLORS.gold }} />
            </Box>

            <Typography
              variant="h4"
              fontWeight={900}
              color="white"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.2,
                mb: 2,
                fontSize: { xs: "1.75rem", md: "2.1rem" },
              }}
            >
              Ethiopia Holy Trinity Theology University
            </Typography>

            {/* Gold Divider Line */}
            <Box
              sx={{
                width: 60,
                height: 4,
                bgcolor: HTTU_COLORS.gold,
                borderRadius: 2,
                mx: "auto",
                mb: 2.5,
              }}
            />

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.75)",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              University Management System
            </Typography>
          </Box>
        </Box>

        {/* ── Right Form Panel ── */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#FFFFFF",
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Top Language Toggle */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Stack direction="row" spacing={0.5} sx={{ bgcolor: "#F1F5F9", p: 0.5, borderRadius: 2 }}>
              {[
                { code: "en", label: "English" },
                { code: "am", label: "Amharic" },
                { code: "gez", label: "Geez" },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  size="small"
                  onClick={() => setLanguage(lang.code)}
                  sx={{
                    px: 1.5,
                    py: 0.3,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    borderRadius: 1.5,
                    color: language === lang.code ? "#FFFFFF" : "#64748B",
                    bgcolor: language === lang.code ? HTTU_COLORS.navy : "transparent",
                    "&:hover": {
                      bgcolor: language === lang.code ? HTTU_COLORS.navy : "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  {lang.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Form Header */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "rgba(217, 166, 33, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <LockOutlined sx={{ color: HTTU_COLORS.gold, fontSize: 20 }} />
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to access the University Management System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Fields */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.8 }}>
                Email or Username
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="daniel.g@httu.edu.et"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#F8FAFC",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: HTTU_COLORS.gold },
                    "&.Mui-focused fieldset": { borderColor: HTTU_COLORS.navy, borderWidth: 1.5 },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 0.8 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#F8FAFC",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: HTTU_COLORS.gold },
                    "&.Mui-focused fieldset": { borderColor: HTTU_COLORS.navy, borderWidth: 1.5 },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      color: "#94A3B8",
                      "&.Mui-checked": { color: HTTU_COLORS.teal },
                    }}
                  />
                }
                label={<Typography variant="body2" color="text.secondary" fontWeight={500}>Remember me</Typography>}
              />
              <Typography
                variant="body2"
                sx={{
                  color: HTTU_COLORS.teal,
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* Primary Action Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: HTTU_COLORS.gold,
                color: "#0E2033",
                fontWeight: 800,
                py: 1.2,
                borderRadius: 2.5,
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: HTTU_COLORS.goldLight,
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#0E2033" }} /> : "Sign in"}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", my: 2.5 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption" sx={{ px: 2, color: "#94A3B8", fontWeight: 700 }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* University SSO Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AccountBalance sx={{ color: HTTU_COLORS.navy }} />}
              sx={{
                borderColor: "#CBD5E1",
                color: HTTU_COLORS.navy,
                fontWeight: 700,
                py: 1.1,
                borderRadius: 2.5,
                "&:hover": {
                  borderColor: HTTU_COLORS.navy,
                  bgcolor: "rgba(14, 32, 51, 0.04)",
                },
              }}
            >
              Use university SSO
            </Button>

            {/* Security Notice Box */}
            <Box
              sx={{
                mt: 3,
                p: 1.8,
                borderRadius: 2.5,
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Security sx={{ color: HTTU_COLORS.teal, fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography variant="caption" fontWeight={800} color={HTTU_COLORS.navy} sx={{ display: "block" }}>
                  Your data is safe and secure
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: "block" }}>
                  This system is protected with enterprise-grade security to keep your university data confidential.
                </Typography>
              </Box>
            </Box>

            {/* Demo Quick-Selection Bar */}
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #E2E8F0" }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                Quick Demo Sign-In
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                {DEMO_ACCOUNTS.map((acc) => (
                  <Chip
                    key={acc.label}
                    label={acc.label}
                    size="small"
                    onClick={() => handleSelectDemo(acc)}
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      bgcolor: username === acc.user ? HTTU_COLORS.navy : "#F1F5F9",
                      color: username === acc.user ? "#FFFFFF" : "#334155",
                      "&:hover": { bgcolor: HTTU_COLORS.gold, color: "#0E2033" },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
