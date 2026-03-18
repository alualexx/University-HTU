import React from "react";
import {
    Box, Container, Typography, Grid, Card, Avatar, Stack, Chip,
    Divider, alpha, useTheme,
} from "@mui/material";
import {
    School, EmojiEvents, Groups, Science, Lightbulb,
    VerifiedUser, Language, WorkOutline, AccessibilityNew,
} from "@mui/icons-material";

const VALUES = [
    { icon: <Lightbulb />, title: "Innovation", desc: "We push the boundaries of knowledge through research, creativity and technological advancement." },
    { icon: <VerifiedUser />, title: "Integrity", desc: "Honesty and transparency are the foundations of every academic and administrative decision we make." },
    { icon: <AccessibilityNew />, title: "Inclusivity", desc: "We welcome students from all backgrounds and believe diversity is one of our greatest strengths." },
    { icon: <Language />, title: "Global Impact", desc: "Our graduates go on to lead institutions, companies, and communities around the world." },
];

const TEAM = [
    { name: "Prof. Ahmad Al-Hassan", role: "University President", color: "#1976d2" },
    { name: "Dr. Sarah Mitchell", role: "VP of Academic Affairs", color: "#7c3aed" },
    { name: "Dr. Omar Khalil", role: "Dean of Engineering", color: "#2e7d32" },
    { name: "Dr. Layla Nasser", role: "Dean of Sciences", color: "#e65100" },
    { name: "Prof. James Carter", role: "Dean of Business", color: "#6a1b9a" },
    { name: "Dr. Amira Yousef", role: "Director of Admissions", color: "#c62828" },
];

const STATS = [
    { value: "25+", label: "Years of Excellence", icon: <EmojiEvents /> },
    { value: "12K+", label: "Active Students", icon: <Groups /> },
    { value: "200+", label: "Expert Faculty", icon: <School /> },
    { value: "50+", label: "Academic Programs", icon: <Science /> },
];

export default function AboutUs() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ── Hero ── */}
            <Box sx={{
                background: isDark
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                    : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 12 },
                position: "relative", overflow: "hidden",
            }}>
                <Box sx={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Chip label="About HTU" sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)", color: "white", fontWeight: 800, border: "1px solid rgba(255,255,255,0.2)" }} />
                    <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", mb: 2, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
                        Building the <Box component="span" sx={{ color: "#60a5fa" }}>Leaders</Box> of Tomorrow
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.65)" sx={{ maxWidth: 600, mx: "auto", fontWeight: 500, lineHeight: 1.8 }}>
                        High Technology University has been at the forefront of academic excellence for over 25 years, shaping future innovators and leaders across every discipline.
                    </Typography>
                </Container>
            </Box>

            {/* ── Stats ── */}
            <Box sx={{ bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {STATS.map((s, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Card elevation={0} sx={{
                                    p: 4, textAlign: "center", borderRadius: 5, height: "100%",
                                    border: "1px solid", borderColor: "divider",
                                    bgcolor: "background.paper",
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }
                                }}>
                                    <Box sx={{ color: "primary.main", mb: 2 }}>{React.cloneElement(s.icon, { sx: { fontSize: 36 } })}</Box>
                                    <Typography variant="h3" fontWeight={1000} sx={{ fontFamily: "Outfit, sans-serif", mb: 0.5 }}>{s.value}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Mission & Vision ── */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Chip label="Our Purpose" sx={{ mb: 2, bgcolor: alpha("#1976d2", 0.1), color: "primary.main", fontWeight: 800 }} />
                        <Typography variant="h3" fontWeight={1000} gutterBottom sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}>
                            A Mission Driven by <Box component="span" sx={{ color: "primary.main" }}>Knowledge</Box>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 4, fontSize: "1.1rem" }}>
                            At High Technology University, we believe that education is the most powerful tool for transforming the world. Our mission is to provide an exceptional academic environment that fosters intellectual curiosity, professional excellence, and personal growth.
                        </Typography>
                        <Box sx={{ p: 4, borderRadius: 4, bgcolor: alpha("#1976d2", 0.05), border: "1px solid", borderColor: alpha("#1976d2", 0.15) }}>
                            <Typography variant="subtitle1" fontWeight={900} color="primary" gutterBottom>Our Vision</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                To be recognized as a global leader in higher education, known for producing graduates who are ethical, innovative, and equipped to navigate the complexities of a rapidly changing world.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                            {VALUES.map((v, i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Card elevation={0} sx={{
                                        p: 3, borderRadius: 4, height: "100%",
                                        border: "1px solid", borderColor: "divider",
                                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "background.paper",
                                        transition: "all 0.3s ease",
                                        "&:hover": { borderColor: "primary.main", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }
                                    }}>
                                        <Box sx={{ color: "primary.main", mb: 1.5 }}>{React.cloneElement(v.icon, { sx: { fontSize: 28 } })}</Box>
                                        <Typography variant="subtitle1" fontWeight={900} gutterBottom>{v.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{v.desc}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Divider />

            {/* ── Leadership Team ── */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: isDark ? "rgba(255,255,255,0.01)" : "#f8fafc" }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <Chip label="Leadership" sx={{ mb: 2, bgcolor: alpha("#6a1b9a", 0.1), color: "#6a1b9a", fontWeight: 800 }} />
                        <Typography variant="h3" fontWeight={1000} sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em" }}>
                            Our Academic <Box component="span" sx={{ color: "primary.main" }}>Leadership</Box>
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {TEAM.map((member, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card elevation={0} sx={{
                                    p: 4, borderRadius: 5, textAlign: "center",
                                    border: "1px solid", borderColor: "divider",
                                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "background.paper",
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-6px)", borderColor: member.color, boxShadow: `0 16px 32px ${alpha(member.color, 0.12)}` }
                                }}>
                                    <Avatar sx={{
                                        width: 72, height: 72, mx: "auto", mb: 2,
                                        bgcolor: alpha(member.color, 0.12), color: member.color,
                                        fontSize: "1.6rem", fontWeight: 900, border: `3px solid ${alpha(member.color, 0.2)}`
                                    }}>
                                        {member.name.split(" ").pop()[0]}
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight={900} gutterBottom>{member.name}</Typography>
                                    <Chip label={member.role} size="small" sx={{ bgcolor: alpha(member.color, 0.1), color: member.color, fontWeight: 700, fontSize: "0.72rem" }} />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
