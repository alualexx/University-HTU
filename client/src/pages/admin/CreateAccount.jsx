import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, Typography, Button, CircularProgress, Alert, Container, Grid, Avatar, Chip } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/Firebase";
import { useAuth, ROLES } from "../../context/AuthContext";
import { PersonAdd, ArrowBack, VpnKey, Email, Badge } from "@mui/icons-material";

const CreateAccount = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const { registerUserByAdmin } = useAuth();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const docRef = doc(db, "applications", applicationId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setApplication({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Application not found.");
                }
            } catch (err) {
                console.error("Error fetching application:", err);
                setError("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [applicationId]);

    const handleGenerate = async () => {
        setGenerating(true);
        setError("");

        // Generate a secure one-time password
        const tempPassword = Math.random().toString(36).slice(-8) + "Aa1@";

        // Parse year from level (e.g. "Year 1" -> 1)
        const parsedYear = application.level ? parseInt(application.level.replace(/\D/g, "")) : 1;

        const userData = {
            name: application.name,
            email: application.email,
            password: tempPassword,
            role: ROLES.STUDENT,
            studentId: application.studentId, // From registrar
            year: parsedYear,
            employeeId: ""
        };

        const result = await registerUserByAdmin(userData);

        if (result.success) {
            try {
                await updateDoc(doc(db, "applications", applicationId), {
                    status: "enrolled"
                });
                setCredentials({
                    email: application.email,
                    password: tempPassword,
                    studentId: application.studentId
                });
            } catch (err) {
                console.error("Error updating application status:", err);
                setError("Account created, but failed to update status: " + err.message);
            }
        } else {
            setError(result.error || "Failed to generate account.");
        }
        setGenerating(false);
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate("/admin-dashboard")} sx={{ mb: 4, fontWeight: 700 }}>
                Back to Dashboard
            </Button>

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Box sx={{ p: 4, bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="h5" fontWeight={800} gutterBottom>
                        Create Portal Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate initial login credentials for an approved applicant.
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

                    {application && !credentials && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                                    <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 24, fontWeight: 800 }}>
                                        {application.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>{application.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{application.email}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                                    <Chip label={application.studentId || "ID Pending"} color="primary" sx={{ fontWeight: 800, fontFamily: "monospace" }} />
                                    <Chip label={application.intendedMajor} variant="outlined" sx={{ fontWeight: 600 }} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: "background.default" }}>
                                    <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <VpnKey sx={{ fontSize: 18, color: "warning.main" }} /> Security Policy
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                                        Clicking "Generate Account" will securely create a new user profile and a One-Time Password (OTP).
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, color: "error.main" }}>
                                        The student will be forced to change this password upon their first login.
                                    </Typography>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                                    sx={{
                                        py: 1.5, px: 4, borderRadius: 2, fontWeight: 700, textTransform: "none",
                                        background: "linear-gradient(135deg, #1976d2, #6a1b9a)"
                                    }}
                                >
                                    {generating ? "Processing..." : "Generate Account Credentials"}
                                </Button>
                            </Grid>
                        </Grid>
                    )}

                    {credentials && (
                        <Box sx={{ textAlign: "center", maxWidth: 500, mx: "auto", py: 4 }}>
                            <Alert severity="success" sx={{ mb: 4, borderRadius: 3, textAlign: "left", p: 3 }}>
                                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                                    Account Successfully Generated!
                                </Typography>
                                <Typography variant="body2">
                                    Please securely provide these credentials to the student. They will be prompted to set a permanent password.
                                </Typography>
                            </Alert>

                            <Card variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: "left", bgcolor: "#f8fafc" }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        <Badge fontSize="small" /> Student ID
                                    </Typography>
                                    <Typography variant="h6" fontFamily="monospace" fontWeight={800} color="primary.main">
                                        {credentials.studentId}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        <Email fontSize="small" /> Email (Username)
                                    </Typography>
                                    <Typography variant="h6" fontFamily="monospace" fontWeight={800}>
                                        {credentials.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        <VpnKey fontSize="small" /> One-Time Password (OTP)
                                    </Typography>
                                    <Typography variant="h5" fontFamily="monospace" fontWeight={800} color="error.main" sx={{ p: 2, bgcolor: "#fee2e2", borderRadius: 2, border: "1px dashed #ef4444", textAlign: "center" }}>
                                        {credentials.password}
                                    </Typography>
                                </Box>
                            </Card>

                            <Button
                                variant="outlined"
                                onClick={() => navigate("/admin-dashboard")}
                                sx={{ mt: 4, fontWeight: 700, borderRadius: 2 }}
                            >
                                Return to Pending Admissions
                            </Button>
                        </Box>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default CreateAccount;
