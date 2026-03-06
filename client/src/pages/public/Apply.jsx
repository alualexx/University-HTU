import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    Chip, Avatar, alpha, Divider,
} from "@mui/material";
import {
    Computer, Engineering, BusinessCenter, Science, Palette,
    HealthAndSafety, Gavel, Agriculture, ArrowForward, School,
    AccessTime, People, MenuBook, Star, CheckCircle,
} from "@mui/icons-material";

const departments = [
    {
        id: "computer-science",
        name: "Computer Science",
        code: "CS",
        icon: <Computer sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #1976d2, #42a5f5)",
        color: "#1976d2",
        description: "Dive into algorithms, AI, software engineering, and cutting-edge computing technologies that shape the digital world.",
        requirements: ["High School Diploma", "Min GPA: 3.0", "Mathematics (Advanced)", "Physics or Chemistry"],
        seats: 120,
        duration: "4 Years",
        department: "Faculty of Computing",
    },
    {
        id: "electrical-engineering",
        name: "Electrical Engineering",
        code: "EE",
        icon: <Engineering sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        color: "#f59e0b",
        description: "Master circuit design, power systems, electronics, and emerging technologies in telecommunications and automation.",
        requirements: ["High School Diploma", "Min GPA: 3.0", "Mathematics (Advanced)", "Physics (Mandatory)"],
        seats: 90,
        duration: "4 Years",
        department: "Faculty of Engineering",
    },
    {
        id: "business-administration",
        name: "Business Administration",
        code: "BBA",
        icon: <BusinessCenter sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
        color: "#2e7d32",
        description: "Develop leadership, management, marketing, and financial skills needed to thrive in today's competitive business environment.",
        requirements: ["High School Diploma", "Min GPA: 2.8", "Economics or Commerce", "English Proficiency"],
        seats: 150,
        duration: "4 Years",
        department: "Faculty of Business",
    },
    {
        id: "medicine",
        name: "Medicine & Surgery",
        code: "MBBS",
        icon: <HealthAndSafety sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #e53935, #ef9a9a)",
        color: "#e53935",
        description: "Pursue a career in healthcare with comprehensive medical education, clinical training, and research opportunities.",
        requirements: ["High School Diploma", "Min GPA: 3.8", "Biology (Mandatory)", "Chemistry (Mandatory)", "Physics"],
        seats: 60,
        duration: "6 Years",
        department: "Faculty of Medicine",
    },
    {
        id: "law",
        name: "Law & Jurisprudence",
        code: "LLB",
        icon: <Gavel sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #6a1b9a, #ba68c8)",
        color: "#6a1b9a",
        description: "Study constitutional law, civil rights, corporate law, and international legal frameworks to become an effective legal professional.",
        requirements: ["High School Diploma", "Min GPA: 3.2", "English (Advanced)", "Social Sciences"],
        seats: 80,
        duration: "4 Years",
        department: "Faculty of Law",
    },
    {
        id: "architecture",
        name: "Architecture & Design",
        code: "ARCH",
        icon: <Palette sx={{ fontSize: 36 }} />,
        gradient: "linear-gradient(135deg, #e65100, #ff8a65)",
        color: "#e65100",
        description: "Blend creativity with technical mastery in spatial design, urban planning, sustainable architecture, and digital visualization.",
        requirements: ["High School Diploma", "Min GPA: 2.9", "Mathematics", "Art or Design Portfolio"],
        seats: 70,
        duration: "5 Years",
        department: "Faculty of Arts & Design",
    },
];

const DepartmentCard = ({ dept, onApply }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Card
            elevation={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                border: "1px solid",
                borderColor: hovered ? "transparent" : "divider",
                overflow: "hidden",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                transform: hovered ? "translateY(-8px)" : "none",
                boxShadow: hovered ? `0 24px 60px ${alpha(dept.color, 0.18)}` : "0 2px 8px rgba(0,0,0,0.04)",
            }}
        >
            {/* Gradient bar */}
            <Box sx={{ height: 5, background: dept.gradient }} />

            <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                {/* Icon + code */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
                    <Box sx={{
                        width: 68, height: 68, borderRadius: 3,
                        background: dept.gradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", flexShrink: 0,
                        transition: "transform 0.3s ease",
                        transform: hovered ? "scale(1.08) rotate(-4deg)" : "none",
                    }}>
                        {dept.icon}
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Chip label={dept.code} size="small" sx={{ fontWeight: 800, fontSize: "0.7rem", mb: 0.5, bgcolor: alpha(dept.color, 0.1), color: dept.color }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                            <People sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">{dept.seats} seats</Typography>
                        </Box>
                    </Box>
                </Box>

                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.01em" }}>
                    {dept.name}
                </Typography>
                <Typography variant="caption" sx={{ color: dept.color, fontWeight: 700, mb: 1.5, display: "block" }}>
                    {dept.department}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
                    {dept.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Meta */}
                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{dept.duration}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <MenuBook sx={{ fontSize: 15, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Full-Time</Typography>
                    </Box>
                </Box>

                {/* Requirements */}
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8, mb: 1, display: "block" }}>
                    Entry Requirements
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
                    {dept.requirements.map((req, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <CheckCircle sx={{ fontSize: 13, color: dept.color }} />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>{req}</Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>

            {/* Apply button */}
            <Box sx={{ px: 3.5, pb: 3.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onApply(dept.id)}
                    endIcon={<ArrowForward />}
                    sx={{
                        borderRadius: 2.5,
                        fontWeight: 800,
                        textTransform: "none",
                        py: 1.4,
                        background: dept.gradient,
                        boxShadow: `0 6px 20px ${alpha(dept.color, 0.35)}`,
                        "&:hover": {
                            background: dept.gradient,
                            boxShadow: `0 10px 30px ${alpha(dept.color, 0.5)}`,
                            transform: "translateY(-1px)",
                        },
                        transition: "all 0.25s ease",
                    }}
                >
                    Apply to This Department
                </Button>
            </Box>
        </Card>
    );
};

const Apply = () => {
    const navigate = useNavigate();

    const handleApply = (deptId) => {
        navigate(`/apply/${deptId}`);
    };

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
            {/* Hero */}
            <Box sx={{
                background: "linear-gradient(135deg, #0d2b6e 0%, #1565c0 55%, #1976d2 100%)",
                pt: { xs: 14, md: 18 }, pb: 14,
                position: "relative", overflow: "hidden",
            }}>
                {/* Blobs */}
                <Box sx={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", top: -200, right: -150, background: "rgba(255,255,255,0.04)" }} />
                <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", bottom: -80, left: -60, background: "rgba(255,255,255,0.05)" }} />

                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Chip
                        icon={<School sx={{ fontSize: 16, color: "#fbbf24 !important" }} />}
                        label="Fall 2026 Admissions Open"
                        sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 700, "& .MuiChip-icon": { color: "#fbbf24" } }}
                    />
                    <Typography variant="h2" fontWeight={900} color="white" sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, letterSpacing: "-0.03em", mb: 2.5 }}>
                        Choose Your{" "}
                        <Box component="span" sx={{ background: "linear-gradient(90deg, #93c5fd, #c4b5fd)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Department
                        </Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ mb: 5, fontWeight: 400, maxWidth: 600, mx: "auto", lineHeight: 1.7 }}>
                        Explore our world-class programs and find the perfect fit for your academic ambitions.
                        Review requirements and apply directly online.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
                        {[
                            { value: "6", label: "Departments" },
                            { value: "570+", label: "Available Seats" },
                            { value: "100%", label: "Online Process" },
                        ].map((stat) => (
                            <Box key={stat.label} sx={{ textAlign: "center" }}>
                                <Typography variant="h4" fontWeight={900} color="white">{stat.value}</Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.65)" fontWeight={600}>{stat.label}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>

                {/* Wave */}
                <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
                        <path d="M0 60L48 52C96 44 192 28 288 24C384 20 480 28 576 36C672 44 768 52 864 52C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" fill="#f8fafc" />
                    </svg>
                </Box>
            </Box>

            {/* Department Grid */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing="-0.02em">
                        Available Programs
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto" }}>
                        Click on any department card to view full details and start your application.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {departments.map((dept) => (
                        <Grid item xs={12} sm={6} md={4} key={dept.id}>
                            <DepartmentCard dept={dept} onApply={handleApply} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Apply;
