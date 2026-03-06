import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  alpha,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Newspaper as NewsIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon,
  MenuBook,
  Groups,
  EmojiEvents,
  Bolt,
  Star,
  FormatQuote,
  EventAvailable,
  Language,
  WorkOutline,
  Science,
  AssignmentInd,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

/* ─── Animated Counter Hook ─────────────────────────────────── */
const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ value, suffix = "+", label, icon, color, started }) => {
  const count = useCountUp(value, 1800, started);
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          fontSize: 28,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h3"
        fontWeight={800}
        color="white"
        sx={{ lineHeight: 1 }}
      >
        {count}
        {suffix}
      </Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
};

/* ─── Feature Card ───────────────────────────────────────────── */
const FeatureCard = ({ icon, title, description, link, buttonText, gradient }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
        borderColor: "transparent",
        "& .card-icon-box": {
          transform: "scale(1.1) rotate(-5deg)",
        },
      },
    }}
  >
    {/* Gradient bar at top */}
    <Box sx={{ height: 4, background: gradient }} />
    <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
      <Box
        className="card-icon-box"
        sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          color: "white",
          fontSize: 32,
          transition: "transform 0.35s ease",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </CardContent>
    <Box sx={{ px: 3.5, pb: 3 }}>
      <Button
        fullWidth
        variant="outlined"
        component={RouterLink}
        to={link}
        endIcon={<ArrowForwardIcon />}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          borderWidth: 2,
          "&:hover": { borderWidth: 2 },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  </Card>
);

/* ─── Testimonial Card ───────────────────────────────────────── */
const TestimonialCard = ({ quote, name, role, avatarColor }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      p: 3.5,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
      },
    }}
  >
    <FormatQuote sx={{ fontSize: 40, color: "primary.main", mb: 1, opacity: 0.6 }} />
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ flexGrow: 1, lineHeight: 1.8, fontStyle: "italic", mb: 2.5 }}
    >
      {quote}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar sx={{ bgcolor: avatarColor, fontWeight: 700 }}>{name[0]}</Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>{name}</Typography>
        <Typography variant="caption" color="text.secondary">{role}</Typography>
      </Box>
      <Box sx={{ ml: "auto", display: "flex", gap: 0.25 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} sx={{ fontSize: 14, color: "#f59e0b" }} />
        ))}
      </Box>
    </Box>
  </Card>
);

/* ─── Main Page ──────────────────────────────────────────────── */
const Home = () => {
  const { isAuthenticated, user, ROLE_DASHBOARD_ROUTES, maintenanceMode } = useAuth();
  const isAdmin = user?.role === "admin";

  if (maintenanceMode && !isAdmin) {
    return <Navigate to="/maintenance" replace />;
  }

  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  // Trigger counter animation when stats section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: "courses",
      title: "Explore Courses",
      description: "Browse hundreds of cutting-edge programs spanning science, arts, business, and technology. Enroll with a single click.",
      buttonText: "View Courses",
      link: "/courses",
      icon: <MenuBook sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #1976d2, #42a5f5)",
    },
    {
      id: "faculty",
      title: "Meet Our Faculty",
      description: "Learn from world-class professors and researchers who bring real-world expertise into every classroom.",
      buttonText: "View Faculty",
      link: "/faculty",
      icon: <Groups sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
    },
    {
      id: "news",
      title: "Latest News",
      description: "Stay ahead with the latest campus announcements, research breakthroughs, and academic events.",
      buttonText: "Read News",
      link: "/news",
      icon: <NewsIcon sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #e65100, #ffa726)",
    },
    {
      id: "portal",
      title: isAuthenticated ? "My Dashboard" : "Student Portal",
      description: isAuthenticated
        ? "Access your personalized dashboard to track your grades, schedules, and academic progress."
        : "Sign in to access your personalized dashboard, track progress, view grades, and manage your schedule.",
      buttonText: isAuthenticated ? "Go to Dashboard" : "Login to Portal",
      link: isAuthenticated ? (ROLE_DASHBOARD_ROUTES?.[user?.role] || "/dashboard") : "/login",
      icon: <LoginIcon sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #6a1b9a, #ba68c8)",
    },
  ];

  const stats = [
    { value: 50, label: "Programs Offered", icon: <SchoolIcon sx={{ fontSize: 28, color: "white" }} />, color: "linear-gradient(135deg,#1976d2,#42a5f5)", suffix: "+" },
    { value: 1200, label: "Students Enrolled", icon: <Groups sx={{ fontSize: 28, color: "white" }} />, color: "linear-gradient(135deg,#2e7d32,#66bb6a)", suffix: "+" },
    { value: 100, label: "Expert Faculty", icon: <PersonIcon sx={{ fontSize: 28, color: "white" }} />, color: "linear-gradient(135deg,#e65100,#ffa726)", suffix: "+" },
    { value: 95, label: "Graduation Rate", icon: <EmojiEvents sx={{ fontSize: 28, color: "white" }} />, color: "linear-gradient(135deg,#6a1b9a,#ba68c8)", suffix: "%" },
  ];

  const testimonials = [
    { quote: "The university portal transformed how I manage my studies. Everything I need — courses, grades, schedule — is in one beautiful place.", name: "Sarah M.", role: "Computer Science, Year 3", avatarColor: "#1976d2" },
    { quote: "As a faculty member, coordinating with students and managing course materials has never been easier. A genuinely impressive platform.", name: "Dr. Ahmed K.", role: "Professor of Engineering", avatarColor: "#2e7d32" },
    { quote: "The seamless enrollment system saved me hours. I registered for all my courses in minutes without any confusion.", name: "James O.", role: "Business Administration, Year 2", avatarColor: "#e65100" },
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>

      {/* ── Hero Section ── */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "85vh", md: "92vh" },
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 50%, #1565c0 100%)",
          overflow: "hidden",
        }}
      >
        {/* Decorative animated blobs */}
        <Box sx={{
          position: "absolute", width: 500, height: 500,
          borderRadius: "50%", top: -150, right: -100,
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 6s ease-in-out infinite",
          "@keyframes pulse": { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        }} />
        <Box sx={{
          position: "absolute", width: 300, height: 300,
          borderRadius: "50%", bottom: -80, left: -60,
          background: "rgba(255,255,255,0.06)",
          animation: "pulse 8s ease-in-out infinite 2s",
        }} />
        <Box sx={{
          position: "absolute", width: 200, height: 200,
          borderRadius: "50%", top: "40%", right: "20%",
          background: "rgba(255,255,255,0.03)",
          animation: "pulse 10s ease-in-out infinite 1s",
        }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, pt: { xs: 12, md: 16 }, pb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<Bolt sx={{ fontSize: 16, color: "#fbbf24 !important" }} />}
                label="Next-Gen University Portal"
                sx={{
                  mb: 3, bgcolor: "rgba(255,255,255,0.12)",
                  color: "white", border: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: 600, fontSize: "0.8rem",
                  "& .MuiChip-icon": { color: "#fbbf24" },
                }}
              />
              <Typography
                variant="h1"
                component="h1"
                fontWeight={800}
                color="white"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.8rem" },
                  lineHeight: 1.15,
                  mb: 3,
                  letterSpacing: "-0.02em",
                }}
              >
                Empowering{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #93c5fd, #c4b5fd)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Academic
                </Box>{" "}
                Excellence
              </Typography>
              <Typography
                variant="h6"
                color="rgba(255,255,255,0.8)"
                sx={{ mb: 5, lineHeight: 1.7, maxWidth: 520, fontWeight: 400 }}
              >
                Your complete university management platform — designed to connect students,
                faculty, and administrators in one seamless experience.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={isAuthenticated ? (ROLE_DASHBOARD_ROUTES?.[user?.role] || "/dashboard") : "/login"}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "white", color: "primary.dark",
                    fontWeight: 700, px: 4, py: 1.5,
                    borderRadius: 2.5, textTransform: "none", fontSize: "1rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "#f0f4ff", transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" },
                    transition: "all 0.25s ease",
                  }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/apply"
                    startIcon={<AssignmentInd />}
                    sx={{
                      background: "linear-gradient(135deg, #ea580c, #f97316)",
                      color: "white", fontWeight: 800, px: 4, py: 1.5,
                      borderRadius: 2.5, textTransform: "none", fontSize: "1rem",
                      boxShadow: "0 8px 28px rgba(234,88,12,0.4)",
                      "&:hover": { background: "linear-gradient(135deg,#c2410c,#ea580c)", transform: "translateY(-2px)", boxShadow: "0 12px 36px rgba(234,88,12,0.5)" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Apply Now
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/courses"
                  sx={{
                    color: "white", borderColor: "rgba(255,255,255,0.5)",
                    fontWeight: 600, px: 4, py: 1.5,
                    borderRadius: 2.5, textTransform: "none", fontSize: "1rem",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "white", bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)", borderWidth: 2,
                    },
                    transition: "all 0.25s ease",
                  }}
                >
                  Browse Courses
                </Button>
              </Box>
            </Grid>

            {/* Hero right — floating card */}
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
              <Box sx={{ position: "relative", width: "100%", maxWidth: 380 }}>
                <Box
                  sx={{
                    borderRadius: 5,
                    p: 4,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
                    animation: "float 5s ease-in-out infinite",
                    "@keyframes float": {
                      "0%,100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-16px)" },
                    },
                  }}
                >
                  {[
                    { label: "Active Students", value: "1,200+", color: "#93c5fd" },
                    { label: "Courses Available", value: "150+", color: "#86efac" },
                    { label: "Faculty Members", value: "100+", color: "#fcd34d" },
                    { label: "Graduation Rate", value: "95%", color: "#c4b5fd" },
                  ].map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", py: 1.5,
                        borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      }}
                    >
                      <Typography color="rgba(255,255,255,0.75)" variant="body2">{item.label}</Typography>
                      <Typography fontWeight={700} sx={{ color: item.color }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
                {/* Decorative dot */}
                <Box sx={{
                  position: "absolute", width: 20, height: 20, borderRadius: "50%",
                  bgcolor: "#fbbf24", top: -10, right: 40,
                  boxShadow: "0 0 20px rgba(251,191,36,0.6)",
                }} />
                <Box sx={{
                  position: "absolute", width: 14, height: 14, borderRadius: "50%",
                  bgcolor: "#86efac", bottom: -6, left: 30,
                  boxShadow: "0 0 16px rgba(134,239,172,0.6)",
                }} />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Wave divider */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
            <path d="M0 80L48 69.3C96 59 192 37 288 32C384 27 480 37 576 48C672 59 768 69 864 69.3C960 69 1056 59 1152 48C1248 37 1344 27 1392 21.3L1440 16V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#ffffff" />
          </svg>
        </Box>
      </Box>

      {/* ── Admissions/Promotional Banner ── */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
              border: "1px solid",
              borderColor: "primary.light",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative background pattern */}
            <Box
              sx={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: "50%",
                background: "radial-gradient(circle at top right, rgba(25,118,210,0.1), transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8} sx={{ p: 5 }}>
                <Chip
                  label="Admissions Now Open"
                  color="error"
                  icon={<EventAvailable />}
                  sx={{ mb: 2, fontWeight: 700, px: 1 }}
                />
                <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom letterSpacing="-0.02em">
                  Fall 2026 Enrollment
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400, maxWidth: 600 }}>
                  Apply today to secure your spot in our top-ranked programs. Early decision deadlines are approaching quickly. Scholarships are available for eligible students.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/apply"
                    startIcon={<AssignmentInd />}
                    sx={{
                      background: "linear-gradient(135deg, #ea580c, #f97316)",
                      color: "white", fontWeight: 800, px: 4, py: 1.5,
                      borderRadius: 2, textTransform: "none", fontSize: "1rem",
                      boxShadow: "0 8px 24px rgba(234,88,12,0.35)",
                      "&:hover": { background: "linear-gradient(135deg,#c2410c,#ea580c)", transform: "translateY(-2px)", boxShadow: "0 12px 30px rgba(234,88,12,0.5)" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    component={RouterLink}
                    to="/apply"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: "primary.main", fontWeight: 700,
                      textTransform: "none", fontSize: "1rem",
                      "&:hover": { bgcolor: "rgba(25,118,210,0.05)" }
                    }}
                  >
                    View Departments & Requirements
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" }, pr: 5, pb: 4 }}>
                <Box
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    bgcolor: "white",
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                    transform: "rotate(3deg)",
                  }}
                >
                  <Typography variant="h2" fontWeight={900} color="primary.main">
                    15<span style={{ fontSize: "1.5rem" }}>%</span>
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                    Acceptance Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* ── Stats Section ── */}
      <Box
        ref={statsRef}
        sx={{
          background: "linear-gradient(135deg, #0d2b6e 0%, #1565c0 100%)",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={700} color="rgba(255,255,255,0.6)" textAlign="center" mb={5} letterSpacing={3} sx={{ textTransform: "uppercase", fontSize: "0.85rem" }}>
            By The Numbers
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <StatCard {...stat} started={statsStarted} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features Section ── */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="Everything You Need" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: "primary.main", color: "white" }} />
            <Typography variant="h3" fontWeight={800} gutterBottom letterSpacing="-0.02em">
              Explore Our Features
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 520, mx: "auto" }}>
              A comprehensive suite of tools designed to simplify university life for everyone.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.id}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── About Section ── */}
      <Box sx={{ bgcolor: "white", py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="Who We Are" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: "success.main", color: "white" }} />
              <Typography variant="h3" fontWeight={800} gutterBottom letterSpacing="-0.02em">
                About Our University
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
                We are committed to providing world-class education and fostering academic
                excellence across all disciplines. Our modern portal makes it effortless for
                students, faculty, and administrators to collaborate and thrive.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 4 }}>
                From intelligent course management and streamlined enrollment to real-time grade
                tracking and faculty coordination — we've built the tools your academic journey deserves.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/courses"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 4, py: 1.4 }}
              >
                Explore Programs
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {[
                  { label: "Programs Offered", value: "50+", icon: <SchoolIcon />, gradient: "linear-gradient(135deg,#1976d2,#42a5f5)" },
                  { label: "Students Enrolled", value: "1,200+", icon: <Groups />, gradient: "linear-gradient(135deg,#2e7d32,#66bb6a)" },
                  { label: "Expert Faculty", value: "100+", icon: <PersonIcon />, gradient: "linear-gradient(135deg,#e65100,#ffa726)" },
                  { label: "Years of Excellence", value: "25+", icon: <EmojiEvents />, gradient: "linear-gradient(135deg,#6a1b9a,#ba68c8)" },
                ].map((item, i) => (
                  <Grid item xs={6} key={i}>
                    <Box
                      sx={{
                        p: 3, borderRadius: 4, textAlign: "center",
                        background: item.gradient, color: "white",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.04)" },
                      }}
                    >
                      <Box sx={{ fontSize: 32, mb: 1 }}>{item.icon}</Box>
                      <Typography variant="h4" fontWeight={800}>{item.value}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>{item.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Why Choose Us Section ── */}
      <Box sx={{ bgcolor: "white", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="The University Advantage" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: "info.main", color: "white" }} />
            <Typography variant="h3" fontWeight={800} gutterBottom letterSpacing="-0.02em">
              Why Choose Us?
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 650, mx: "auto" }}>
              We don't just teach. We prepare you to lead and innovate in a rapidly evolving world.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { title: "Global Network", desc: "Connect with alumni and partner institutions across 50+ countries. Gain a truly international perspective.", icon: <Language />, color: "#1976d2", gradient: "linear-gradient(135deg, #1976d2, #42a5f5)" },
              { title: "Career Guaranteed", desc: "98% of our graduates find employment or pursue advanced degrees within six months of graduation.", icon: <WorkOutline />, color: "#2e7d32", gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)" },
              { title: "Innovation Labs", desc: "24/7 access to state-of-the-art research facilities, maker spaces, and technology incubators.", icon: <Science />, color: "#6a1b9a", gradient: "linear-gradient(135deg, #6a1b9a, #ba68c8)" },
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      borderColor: "transparent",
                    }
                  }}
                >
                  <Box sx={{
                    width: 60, height: 60, borderRadius: 3,
                    background: alpha(feature.color, 0.1),
                    color: feature.color, display: "flex",
                    alignItems: "center", justifyContent: "center", mb: 3,
                    fontSize: 32
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials Section ── */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="What People Say" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: "warning.main", color: "white" }} />
            <Typography variant="h3" fontWeight={800} gutterBottom letterSpacing="-0.02em">
              Voices from Campus
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <TestimonialCard {...t} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0d2b6e 0%, #1976d2 60%, #6a1b9a 100%)",
          py: 10,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", top: -150, left: -100,
        }} />
        <Box sx={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", bottom: -80, right: -60,
        }} />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom letterSpacing="-0.02em">
            Ready to Begin Your{" "}
            <Box component="span" sx={{ background: "linear-gradient(90deg,#93c5fd,#c4b5fd)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Journey?
            </Box>
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.75)" sx={{ mb: 5, fontWeight: 400 }}>
            Join thousands of students and faculty already using the platform.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/login"
              sx={{
                bgcolor: "white", color: "primary.dark", fontWeight: 700,
                px: 5, py: 1.6, borderRadius: 2.5, textTransform: "none", fontSize: "1rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                "&:hover": { bgcolor: "#f0f4ff", transform: "translateY(-2px)" },
                transition: "all 0.25s ease",
              }}
            >
              Sign In Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/courses"
              sx={{
                color: "white", borderColor: "rgba(255,255,255,0.5)", fontWeight: 600,
                px: 5, py: 1.6, borderRadius: 2.5, textTransform: "none", fontSize: "1rem", borderWidth: 2,
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)", borderWidth: 2, transform: "translateY(-2px)" },
                transition: "all 0.25s ease",
              }}
            >
              Explore Courses
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
