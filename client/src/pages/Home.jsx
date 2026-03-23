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
  Stack,
  Divider,
  useTheme,
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
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/Firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";

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
        p: 4,
        borderRadius: 6,
        background: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-10px)",
          background: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.25)",
          borderColor: (theme) => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 3,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
          fontSize: 28,
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 32, color: 'white' } })}
      </Box>
      <Typography
        variant="h3"
        fontWeight={1000}
        color="white"
        sx={{ lineHeight: 1, mb: 1, fontFamily: 'Outfit, sans-serif' }}
      >
        {count}
        {suffix}
      </Typography>
      <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.5)" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
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
      borderRadius: 6,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      bgcolor: 'background.paper',
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
      "&:hover": {
        transform: "translateY(-12px)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
        borderColor: "primary.main",
        "& .card-icon-box": {
          transform: "scale(1.15) rotate(5deg)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        },
      },
    }}
  >
    <Box sx={{ height: 6, background: gradient }} />
    <CardContent sx={{ flexGrow: 1, p: 4.5 }}>
      <Box
        className="card-icon-box"
        sx={{
          width: 68,
          height: 68,
          borderRadius: 4,
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3.5,
          color: "white",
          fontSize: 36,
          transition: "all 0.4s ease-out",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontWeight: 500 }}>
        {description}
      </Typography>
    </CardContent>
    <Box sx={{ px: 4.5, pb: 4.5 }}>
      <Button
        fullWidth
        variant="contained"
        component={RouterLink}
        to={link}
        endIcon={<ArrowForwardIcon />}
        sx={{
          borderRadius: 3,
          fontWeight: 800,
          textTransform: "none",
          py: 1.5,
          background: gradient,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          }
        }}
      >
        {buttonText}
      </Button>
    </Box>
  </Card>
);

const TestimonialCard = ({ quote, name, role, avatarColor }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 6,
      border: "1px solid",
      borderColor: "divider",
      p: 5,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.4s ease",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
        borderColor: "primary.light",
      },
    }}
  >
    <FormatQuote sx={{ fontSize: 48, color: "primary.main", mb: 2, opacity: 0.2 }} />
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ flexGrow: 1, lineHeight: 1.9, fontStyle: "italic", mb: 4, fontWeight: 500 }}
    >
      "{quote}"
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
      <Avatar sx={{ bgcolor: avatarColor, fontWeight: 1000, width: 52, height: 52, border: '4px solid rgba(0,0,0,0.03)' }}>{name[0]}</Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{name}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{role}</Typography>
      </Box>
      <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} sx={{ fontSize: 16, color: "#f59e0b" }} />
        ))}
      </Box>
    </Box>
  </Card>
);

/* ─── Main Page ──────────────────────────────────────────────── */
const Home = () => {
  const { isAuthenticated, user, ROLE_DASHBOARD_ROUTES, maintenanceMode, globalAdmissionOpen } = useAuth();
  const isAdmin = user?.role === "admin";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (maintenanceMode && !isAdmin) {
    return <Navigate to="/maintenance" replace />;
  }

  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [latestNews, setLatestNews] = useState([]);

  // Fetch real-time news
  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("date", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const [publishedDepts, setPublishedDepts] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "departments"), where("isPublished", "==", true));
    const unsub = onSnapshot(q, (snapshot) => {
      setPublishedDepts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

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
          minHeight: { xs: "90vh", md: "95vh" },
          display: "flex",
          alignItems: "center",
          background: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #2563eb 100%)", // Vibrant blue for light mode
          overflow: "hidden",
        }}
      >
        {/* Advanced background lighting effects */}
        <Box sx={{
          position: "absolute", width: 800, height: 800,
          borderRadius: "50%", top: -200, right: -200,
          background: isDark
            ? "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <Box sx={{
          position: "absolute", width: 600, height: 600,
          borderRadius: "50%", bottom: -150, left: -150,
          background: isDark
            ? "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, pt: { xs: 15, md: 20 }, pb: 10 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: globalAdmissionOpen ? '#10b981' : '#ef4444', boxShadow: `0 0 12px ${globalAdmissionOpen ? '#10b981' : '#ef4444'}` }} />
                <Typography variant="caption" fontWeight={900} sx={{ color: 'white', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.8 }}>
                  Fall 2026 Admissions {globalAdmissionOpen ? "Open" : "Closed"}
                </Typography>
              </Box>

              <Typography
                variant="h1"
                fontWeight={1000}
                color="white"
                sx={{
                  fontSize: { xs: "3rem", md: "4.5rem" },
                  lineHeight: 1.1,
                  mb: 3.5,
                  letterSpacing: "-0.03em",
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                Where Intelligence {" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Meets
                </Box>{" "}
                Ambition
              </Typography>

              <Typography
                variant="h6"
                sx={{ mb: 6, lineHeight: 1.8, maxWidth: 560, fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}
              >
                The unified digital ecosystem for the modern academic world. Seamlessly manage your journey, track your progress, and excel in your field.
              </Typography>

              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={isAuthenticated ? (ROLE_DASHBOARD_ROUTES?.[user?.role] || "/dashboard") : "/login"}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "white", color: "#0f172a",
                    fontWeight: 1000, px: 5, py: 2,
                    borderRadius: 3.5, textTransform: "none", fontSize: "1.05rem",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    "&:hover": { bgcolor: "#f1f5f9", transform: "translateY(-4px)", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" },
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {isAuthenticated ? "Enter Core Dashboard" : "Initiate Access"}
                </Button>

                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/apply"
                    startIcon={<AssignmentInd />}
                    sx={{
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "white", fontWeight: 900, px: 5, py: 2,
                      borderRadius: 3.5, textTransform: "none", fontSize: "1.05rem",
                      backdropFilter: 'blur(10px)',
                      "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)", transform: "translateY(-4px)" },
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    Deploy Application
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Hero right — dynamic glass card showcase */}
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
              <Box sx={{ position: "relative" }}>
                {/* Background glow */}
                <Box sx={{ position: 'absolute', inset: -50, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

                <Card sx={{
                  width: 420,
                  borderRadius: 8,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                  p: 5,
                  position: 'relative',
                  zIndex: 1,
                  animation: 'float 8s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(1deg)' },
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 6 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontWeight: 1000, fontSize: '1.5rem', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)' }}>ALX</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif' }}>University Core</Typography>
                      <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.5)" sx={{ letterSpacing: 1 }}>SYSTEM STATUS: OPTIMAL</Typography>
                    </Box>
                  </Box>

                  <Stack spacing={4}>
                    {[
                      { label: 'Active Roster', value: '14,208', growth: '+12%', color: '#10b981' },
                      { label: 'Intelligence Modules', value: '452', growth: '+28', color: '#6366f1' },
                      { label: 'System Bandwidth', value: '98.9%', growth: 'Stable', color: '#a855f7' },
                    ].map((stat, i) => (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" fontWeight={900} color="rgba(255,255,255,0.4)" sx={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>{stat.label}</Typography>
                          <Typography variant="caption" fontWeight={900} color={stat.color}>{stat.growth}</Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box key={i} sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: i < 3 ? 'primary.main' : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </Box>
                    <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.3)" sx={{ mt: 2, display: 'block' }}>Operational Infrastructure Ver. 4.0.2</Typography>
                  </Box>
                </Card>

                {/* Decorative floating elements */}
                <Box sx={{ position: 'absolute', top: -30, right: -20, width: 80, height: 80, borderRadius: 4, bgcolor: 'rgba(99, 102, 241, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', animation: 'float 6s ease-in-out infinite 1s' }} />
                <Box sx={{ position: 'absolute', bottom: 40, left: -40, width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', opacity: 0.2, animation: 'float 10s ease-in-out infinite 0.5s' }} />
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
      <Box sx={{ bgcolor: "background.default", py: 12 }}>
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              borderRadius: 8,
              background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={12} md={8} sx={{ p: { xs: 5, md: 8 } }}>
                <Chip
                  label="Enrolling Now"
                  sx={{ mb: 3, fontWeight: 900, bgcolor: alpha("#ef4444", 0.1), color: "#ef4444", border: '1px solid rgba(239, 68, 68, 0.2)', px: 1 }}
                />
                <Typography variant="h2" fontWeight={1000} color="text.primary" gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif' }}>
                  Fall Semester <Box component="span" sx={{ color: 'primary.main' }}>2026</Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 500, lineHeight: 1.8, maxWidth: 580 }}>
                  Take the first step towards your future. Our global admissions portal is now open for all undergraduate and postgraduate programs. Priority scholarship deadline: April 15.
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/apply"
                    startIcon={<AssignmentInd />}
                    sx={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white", fontWeight: 1000, px: 5, py: 2,
                      borderRadius: 3.5, textTransform: "none", fontSize: "1.05rem",
                      boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 15px 40px rgba(16, 185, 129, 0.4)" },
                    }}
                  >
                    Initiate Application
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    component={RouterLink}
                    to="/courses"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: "text.primary", fontWeight: 900, fontSize: "1.05rem", textTransform: "none",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.03)" }
                    }}
                  >
                    Explore Requirements
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" }, pr: 8 }}>
                <Box sx={{
                  p: 6, borderRadius: 6, bgcolor: 'primary.main', color: 'white',
                  textAlign: 'center', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                  transform: 'rotate(4deg)'
                }}>
                  <Typography variant="h1" fontWeight={1000}>15%</Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ opacity: 0.8 }}>Selection Index</Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* ── Academic Programs Section ── */}
      <Box sx={{ py: 15, bgcolor: isDark ? 'rgba(255,255,255,0.01)' : '#ffffff', position: 'relative' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 4, mb: 2, display: 'block' }}>EXCELLENCE IN EDUCATION</Typography>
            <Typography variant="h2" fontWeight={1000} gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif' }}>
              Academic <Box component="span" sx={{ color: 'primary.main' }}>Programs</Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 600, mx: "auto" }}>
              Explore our diverse range of published programs, each designed to empower your career in the modern world.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {publishedDepts.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ py: 5 }}>Explore our core values while we prepare our semester catalog.</Typography>
              </Grid>
            ) : publishedDepts.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.id}>
                <Card sx={{ 
                  borderRadius: 6, height: '100%', display: 'flex', flexDirection: 'column',
                  bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { transform: 'translateY(-12px)', borderColor: dept.color || 'primary.main', boxShadow: `0 30px 60px ${alpha(dept.color || '#6366f1', 0.1)}` }
                }}>
                  <Box sx={{ p: 4, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: alpha(dept.color || '#6366f1', 0.1), color: dept.color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                      <SchoolIcon />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip label={dept.admissionOpen ? "OPEN" : "CLOSED"} size="small" variant="filled" 
                        sx={{ fontWeight: 1000, bgcolor: dept.admissionOpen ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1), color: dept.admissionOpen ? '#10b981' : '#ef4444', mb: 1 }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', mb: 1.5 }}>{dept.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {dept.description}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={900} display="block">DURATION</Typography>
                        <Typography variant="body2" fontWeight={800}>{dept.duration}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={900} display="block">FACULTY</Typography>
                        <Typography variant="body2" fontWeight={800}>{dept.faculty}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <Divider sx={{ mx: 4, opacity: 0.1 }} />
                  <Box sx={{ p: 4, pt: 3 }}>
                    <Button fullWidth variant="outlined" component={RouterLink} to="/apply" 
                      sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', py: 1.2, borderColor: alpha(dept.color || '#6366f1', 0.3), color: dept.color || 'primary.main', '&:hover': { bgcolor: alpha(dept.color || '#6366f1', 0.05), borderColor: dept.color || 'primary.main' } }}>
                      Initiate Enrollment
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
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
      <Box sx={{ bgcolor: "background.default", py: 10 }}>
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
      <Box sx={{ py: 15, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 4, mb: 2, display: 'block' }}>OUR MISSION</Typography>
              <Typography variant="h2" fontWeight={1000} gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif', mb: 3 }}>
                Redefining the <Box component="span" sx={{ color: 'primary.main' }}>Academic</Box> Standard
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem', lineHeight: 1.9, mb: 4, fontWeight: 500 }}>
                High Technology University isn't just an institution; it's a launchpad for the next generation of innovators.
                Our digital infrastructure is built to support a seamless, intelligence-driven educational experience.
              </Typography>
              <Stack spacing={4} sx={{ mb: 6 }}>
                {[
                  { title: "Empowerment via Technology", desc: "Access 24/7 cloud-based academic resources anywhere in the world." },
                  { title: "Integrated Collaboration", desc: "Real-time sync between students, faculty, and administrative nodes." },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: alpha('#6366f1', 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/courses"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 4, textTransform: "none", fontWeight: 1000, px: 5, py: 2, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
              >
                Explore Curriculums
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', inset: -40, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                <Grid container spacing={3}>
                  {[
                    { label: "Majors", value: "50+", icon: <SchoolIcon />, color: "#6366f1" },
                    { label: "Active Scholars", value: "12K+", icon: <Groups />, color: "#10b981" },
                    { label: "Elite Faculty", value: "200+", icon: <PersonIcon />, color: "#f59e0b" },
                    { label: "Years Lead", value: "25+", icon: <EmojiEvents />, color: "#a855f7" },
                  ].map((item, i) => (
                    <Grid item xs={6} key={i}>
                      <Card sx={{
                        p: 4, borderRadius: 6, textAlign: "center",
                        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                        transition: "all 0.4s ease",
                        "&:hover": { transform: "translateY(-10px)", borderColor: item.color, boxShadow: `0 20px 40px ${alpha(item.color, 0.1)}` },
                      }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: alpha(item.color, 0.1), color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 32 }}>{item.icon}</Box>
                        <Typography variant="h4" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{item.value}</Typography>
                        <Typography variant="caption" fontWeight={900} sx={{ color: 'text.secondary', letterSpacing: 1 }}>{item.label.toUpperCase()}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Latest News / Announcements Section ── */}
      <Box sx={{ py: 15, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Chip label="Live Updates" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: "info.main", color: "white" }} />
            <Typography variant="h2" fontWeight={1000} gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif' }}>
              Campus <span style={{ color: theme.palette.primary.main }}>Announcements</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 520, mx: "auto" }}>
              Stay informed with real-time updates directly from the university administration.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {latestNews.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ py: 5 }}>No recent announcements available.</Typography>
              </Grid>
            ) : latestNews.map((newsItem, i) => (
              <Grid item xs={12} md={4} key={newsItem.id || i}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4, height: "100%", borderRadius: 6,
                    bgcolor: 'background.paper', border: "1px solid", borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", borderColor: "primary.light" }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Chip size="small" label={newsItem.category || "General"} sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {newsItem.date?.toDate ? new Date(newsItem.date.toDate()).toLocaleDateString() : (newsItem.date || "Just now")}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.4 }}>
                    {newsItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                    {newsItem.content}
                  </Typography>
                  <Button variant="text" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 800, textTransform: 'none', p: 0, '&:hover': { background: 'transparent', color: 'primary.dark' } }}>
                    Read Full Story
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Why Choose Us Section ── */}
      <Box sx={{ py: 15, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 4, mb: 2, display: 'block' }}>THE ALEX ADVANTAGE</Typography>
            <Typography variant="h2" fontWeight={1000} gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif' }}>
              Why Engineers Choose Us
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { title: "Global Intelligence", desc: "Our network spans 50+ countries with partner nodes in leading tech hubs.", icon: <Language />, color: "#6366f1" },
              { title: "Career Deployment", desc: "98.9% success rate in high-tier industry placement within 6 months.", icon: <WorkOutline />, color: "#10b981" },
              { title: "Quantum Innovation", desc: "Access to the most advanced research labs and computational clusters.", icon: <Science />, color: "#a855f7" },
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    p: 6,
                    height: "100%",
                    borderRadius: 8,
                    bgcolor: 'background.paper',
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
                      borderColor: feature.color,
                    }
                  }}
                >
                  <Box sx={{
                    width: 72, height: 72, borderRadius: 4,
                    background: alpha(feature.color, 0.1),
                    color: feature.color, display: "flex",
                    alignItems: "center", justifyContent: "center", mb: 4,
                    fontSize: 36,
                    boxShadow: `0 8px 16px ${alpha(feature.color, 0.2)}`
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontWeight: 500 }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials Section ── */}
      <Box sx={{ bgcolor: "background.default", py: 10 }}>
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
          py: 15,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: 'center' }}>
          <Typography variant="h2" fontWeight={1000} color="white" gutterBottom sx={{ letterSpacing: "-0.03em", fontFamily: 'Outfit, sans-serif' }}>
            Ready to Accelerate Your <Box component="span" sx={{ color: 'primary.main' }}>Future?</Box>
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.6)" sx={{ mb: 6, fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            Join the elite circle of students and faculty currently utilizing the Alex Core ecosystem.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to={isAuthenticated ? (ROLE_DASHBOARD_ROUTES?.[user?.role] || "/dashboard") : "/login"}
              sx={{
                bgcolor: "white", color: "#0f172a",
                fontWeight: 1000, px: 6, py: 2.5,
                borderRadius: 4, textTransform: "none", fontSize: "1.1rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                "&:hover": { bgcolor: "#f1f5f9", transform: "translateY(-4px)" }
              }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Login to Portal"}
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/departments"
                sx={{
                  color: "white", borderColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
                  fontWeight: 800, px: 5, py: 2,
                  borderRadius: 3.5, textTransform: "none", fontSize: "1.05rem",
                  "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Explore Departments
              </Button>
            )}
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
