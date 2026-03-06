import React from "react";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { GppBad, Home } from "@mui/icons-material";

const Unauthorized = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        maxWidth: 500,
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            bgcolor: "#fff1f2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 3,
                        }}
                    >
                        <GppBad sx={{ fontSize: 48, color: "#e11d48" }} />
                    </Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom letterSpacing="-0.02em">
                        Access Denied
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.7 }}>
                        Oops! It looks like you don't have permission to view this page. If you believe this is an error, please contact the administrator.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/"
                            startIcon={<Home />}
                            sx={{
                                borderRadius: 2.5,
                                px: 3,
                                py: 1.2,
                                fontWeight: 700,
                                textTransform: "none",
                                background: "linear-gradient(135deg, #1976d2, #6a1b9a)",
                                "&:hover": { transform: "translateY(-1px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
                            }}
                        >
                            Return Home
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Unauthorized;
