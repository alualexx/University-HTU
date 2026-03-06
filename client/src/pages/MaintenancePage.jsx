import React from "react";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Construction, Engineering, Update, ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const MaintenancePage = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 100%)",
                color: "white",
                p: 3
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: 6,
                        textAlign: "center",
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)"
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#fef2f2",
                            color: "#dc2626",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px"
                        }}
                    >
                        <Construction sx={{ fontSize: 40 }} />
                    </Box>

                    <Typography variant="h3" fontWeight={900} color="#1e293b" gutterBottom>
                        Under Maintenance
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: "1.1rem" }}>
                        The University Portal is currently undergoing scheduled improvements to serve you better. We'll be back online shortly.
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 6 }}>
                        {[
                            { icon: <Engineering />, label: "Engineers working" },
                            { icon: <Update />, label: "Security Updates" }
                        ].map((item, i) => (
                            <Box key={i} sx={{ textAlign: "center" }}>
                                <Box sx={{ color: "#3b82f6", mb: 0.5 }}>{item.icon}</Box>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        startIcon={<ArrowBack />}
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)"
                        }}
                    >
                        Check Again
                    </Button>

                    <Typography variant="body2" sx={{ mt: 4, opacity: 0.6, color: "text.secondary" }}>
                        Admins can still sign in through the primary gateway.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default MaintenancePage;
