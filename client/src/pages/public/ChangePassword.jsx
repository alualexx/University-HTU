import React, { useState, useEffect } from "react";
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton } from "@mui/material";
import { Lock, Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import { useAuth, ROLE_DASHBOARD_ROUTES } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase";

const ChangePassword = () => {
    const { user, changeUserPassword } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // If user doesn't actually need to change password, send them to dashboard
    useEffect(() => {
        if (user && !user.requiresPasswordChange) {
            navigate(ROLE_DASHBOARD_ROUTES[user.role] || "/dashboard");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const calculateStrength = (password) => {
        let score = 0;
        if (password.length > 7) score += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    const strength = calculateStrength(formData.newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (strength < 3) {
            setError("Password is too weak. Please use a mix of uppercase, lowercase, numbers, and symbols.");
            return;
        }

        setLoading(true);
        const result = await changeUserPassword(formData.newPassword);

        if (result.success) {
            try {
                // Find the user's application by email to update status
                const q = query(collection(db, "applications"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const appDoc = querySnapshot.docs[0];
                    await updateDoc(doc(db, "applications", appDoc.id), {
                        status: "setup_completed"
                    });
                }
            } catch (err) {
                console.error("Failed to update application status:", err);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(ROLE_DASHBOARD_ROUTES[user.role] || "/dashboard");
            }, 2000);
        } else {
            setError(result.error || "Failed to update password.");
            setLoading(false);
        }
    };

    if (!user || (!user.requiresPasswordChange && !success)) return null;

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 100%)", p: 2 }}>
            <Card elevation={0} sx={{ p: 4, width: "100%", maxWidth: 440, borderRadius: 4, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>

                {success ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h5" fontWeight={800} gutterBottom>Password Updated</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Redirecting you to your dashboard...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "#eff6ff", color: "#1976d2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                                <Lock sx={{ fontSize: 28 }} />
                            </Box>
                            <Typography variant="h5" fontWeight={800} gutterBottom>
                                Action Required
                            </Typography>
                            <Typography variant="body2" color="text.secondary" px={2}>
                                For security reasons, you must change your auto-generated password before accessing your account.
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
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

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <Box sx={{ mt: 1, mb: 2, display: "flex", gap: 1 }}>
                                    {[1, 2, 3, 4].map(level => (
                                        <Box
                                            key={level}
                                            sx={{
                                                height: 4, flex: 1, borderRadius: 2,
                                                bgcolor: level <= strength
                                                    ? (strength < 2 ? "#ef4444" : strength < 3 ? "#f59e0b" : "#10b981")
                                                    : "#e2e8f0"
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                                error={formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.newPassword}
                                helperText={formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.newPassword ? "Passwords do not match" : ""}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    textTransform: "none"
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password & Continue"}
                            </Button>
                        </form>
                    </>
                )}
            </Card>
        </Box>
    );
};

export default ChangePassword;
