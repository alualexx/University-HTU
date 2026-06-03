import React, { useState, useEffect } from "react";
import {
    Box, Card, Typography, Button, TextField, Divider,
    CircularProgress, Alert, Stack, Grid, useTheme, Avatar
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    AccountBalanceWallet, CreditCard, VerifiedUser, Security,
    School as SchoolIcon, Receipt, CheckCircle, ArrowForward
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ADMISSION_FEE = 250; // Standard admission/enrollment fee

const AdmissionPayment = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [cardData, setCardData] = useState({
        name: user?.name || "",
        number: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const res = await api.get(`/applications/track/${user.email}`);
                setApplication(res.data);

                // If already paid, or not in awaiting_payment status, redirect
                if (res.data.status === "payment_completed" || res.data.status === "final_approved" || res.data.status === "enrolled") {
                    setSuccess(true);
                    setTimeout(() => navigate("/dashboard"), 1500);
                }
            } catch (err) {
                console.error("Failed to fetch application:", err);
                setError("Could not retrieve your admission records. Please contact support.");
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchApp();
    }, [user, api, navigate]);

    const handlePay = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError("");

        try {
            // Mock payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await api.post(`/applications/${application._id}/pay`, { amount: ADMISSION_FEE });
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => navigate("/student-dashboard"), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed. Please check your card details.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            background: isDark
                ? 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%)'
                : 'radial-gradient(circle at 50% 50%, #eff6ff 0%, #dbeafe 100%)'
        }}>
            <Card sx={{
                maxWidth: 900,
                width: '100%',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                boxShadow: isDark ? '0 32px 64px rgba(0,0,0,0.5)' : '0 32px 64px rgba(37, 99, 235, 0.1)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)'}`,
                backdropFilter: 'blur(20px)'
            }}>
                {/* Left Side: Summary */}
                <Box sx={{
                    flex: 1,
                    p: 6,
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(37, 99, 235, 0.02)',
                    borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                }}>
                    <Stack spacing={4}>
                        <Box>
                            <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3 }}>
                                <SchoolIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Typography variant="h4" fontWeight={1000} gutterBottom sx={{ letterSpacing: -1 }}>
                                Finalize Enrollment
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                Welcome to the university family. Complete your mandatory admission fee to activate your student credentials and ID.
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: 1.5, display: 'block', mb: 2 }}>ENROLLMENT DETAILS</Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight={700}>Full Name</Typography>
                                    <Typography variant="body2" fontWeight={800}>{user?.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight={700}>Major</Typography>
                                    <Typography variant="body2" fontWeight={800}>{application?.intendedMajor}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={1000}>Admission Fee</Typography>
                                    <Typography variant="h5" fontWeight={1000} color="primary.main">${ADMISSION_FEE.toLocaleString()}</Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Stack direction="row" spacing={2} sx={{ opacity: 0.6 }}>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Security sx={{ fontSize: 20, mb: 0.5 }} />
                                <Typography variant="caption" display="block" fontWeight={800}>SECURE</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <VerifiedUser sx={{ fontSize: 20, mb: 0.5 }} />
                                <Typography variant="caption" display="block" fontWeight={800}>VERIFIED</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Receipt sx={{ fontSize: 20, mb: 0.5 }} />
                                <Typography variant="caption" display="block" fontWeight={800}>RECEIPT</Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>

                {/* Right Side: Payment Form */}
                <Box sx={{
                    flex: 1.2,
                    p: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: success ? 'center' : 'flex-start'
                }}>
                    {success ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                <CheckCircle sx={{ fontSize: 48 }} />
                            </Box>
                            <Typography variant="h5" fontWeight={1000} gutterBottom>Payment Successful</Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 4 }}>
                                Your enrollment is now being finalized. Redirecting to your dashboard...
                            </Typography>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <form onSubmit={handlePay}>
                            <Typography variant="h6" fontWeight={900} sx={{ mb: 4 }}>Payment Credentials</Typography>

                            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}>{error}</Alert>}

                            <Stack spacing={3}>
                                <TextField
                                    fullWidth label="Cardholder Name"
                                    value={cardData.name}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                    variant="outlined"
                                    required
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                                <TextField
                                    fullWidth label="Card Number"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardData.number}
                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                                    inputProps={{ maxLength: 19 }}
                                    variant="outlined"
                                    required
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                                <Grid container spacing={3}>
                                    <Grid item xs={7}>
                                        <TextField
                                            fullWidth label="Expiry Date"
                                            placeholder="MM / YY"
                                            value={cardData.expiry}
                                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                            variant="outlined"
                                            required
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth label="CVV"
                                            placeholder="000"
                                            value={cardData.cvv}
                                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                            inputProps={{ maxLength: 3 }}
                                            variant="outlined"
                                            required
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>

                            <Box sx={{ mt: 6 }}>
                                <Button
                                    type="submit"
                                    fullWidth variant="contained" size="large" disableElevation
                                    disabled={processing}
                                    sx={{
                                        borderRadius: 4,
                                        py: 2,
                                        fontWeight: 1000,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                                        boxShadow: '0 8px 24px rgba(49, 46, 129, 0.2)',
                                        '&:hover': { background: '#1e1b4b' }
                                    }}
                                >
                                    {processing ? <CircularProgress size={24} color="inherit" /> : `Process Admission Fee · $${ADMISSION_FEE}`}
                                </Button>
                            </Box>

                            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 3, fontWeight: 700 }}>
                                <Security sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                Encrypted via University Security Layer (V4-SSL)
                            </Typography>
                        </form>
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default AdmissionPayment;
