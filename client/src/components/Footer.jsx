import React from "react";
import {
  Box, Container, Typography, Grid, Link, IconButton,
  Divider, alpha, useTheme, Stack, Button, Chip,
} from "@mui/material";
import {
  Facebook, Twitter, Instagram, LinkedIn,
  Email, Phone, LocationOn, School,
  ArrowForward, AssignmentInd, AccessTime, CheckCircle,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Departments", path: "/departments" },
    { label: "About Us", path: "/about" },
    { label: "Admissions", path: "/apply" },
  ];

  const admissionsLinks = [
    { label: "Apply Now", path: "/apply" },
    { label: "Deadlines", path: "/apply" },
    { label: "Requirements", path: "/apply" },
    { label: "Check Status", path: "/login" },
  ];

  const socialLinks = [
    { icon: <Facebook />, label: "Facebook", color: "#1877F2" },
    { icon: <Twitter />, label: "Twitter", color: "#1DA1F2" },
    { icon: <Instagram />, label: "Instagram", color: "#E4405F" },
    { icon: <LinkedIn />, label: "LinkedIn", color: "#0A66C2" },
  ];

  // Dynamic text colors
  const textColorPrimary = isDark ? "white" : "text.primary";
  const textColorSecondary = isDark ? "rgba(255,255,255,0.65)" : "text.secondary";
  const textColorMuted = isDark ? "rgba(255,255,255,0.4)" : "text.disabled";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? "#0a0f1e" : "background.paper",
        color: textColorPrimary,
        pt: { xs: 8, md: 10 },
        pb: 0,
        mt: "auto",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: "absolute", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
        zIndex: 0
      }} />
      <Box sx={{
        position: "absolute", bottom: 0, left: -80, width: 300, height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 70%)`,
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6}>

          {/* Brand & About */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{
                  p: 1, borderRadius: "12px",
                  background: "linear-gradient(135deg, #1976d2, #0d47a1)",
                  display: "flex", boxShadow: "0 4px 16px rgba(25,118,210,0.4)"
                }}>
                  <School sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>
                    UNIVERSITY
                  </Typography>
                  <Typography variant="caption" sx={{ color: textColorSecondary, letterSpacing: 2, fontWeight: 700 }}>
                    PORTAL SYSTEM
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: textColorSecondary, lineHeight: 1.8, maxWidth: 320 }}>
                Empowering the next generation of leaders through world-class education. Our portal
                provides a seamless experience for the entire university community — students, faculty, and administrators.
              </Typography>

              {/* Admissions CTA Card */}
              <Box sx={{
                p: 3, borderRadius: 3,
                background: isDark
                  ? "linear-gradient(135deg, rgba(234,88,12,0.1) 0%, rgba(249,115,22,0.05) 100%)"
                  : "linear-gradient(135deg, rgba(234,88,12,0.05) 0%, rgba(249,115,22,0.02) 100%)",
                border: "1px solid",
                borderColor: alpha("#ea580c", 0.2),
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Chip
                    label="Admissions Open"
                    size="small"
                    icon={<AccessTime sx={{ fontSize: "14px !important", color: "#ea580c !important" }} />}
                    sx={{ bgcolor: alpha("#ea580c", 0.1), color: "#ea580c", fontWeight: 800, fontSize: "0.7rem", border: "1px solid", borderColor: alpha("#ea580c", 0.2) }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: textColorSecondary, mb: 2, lineHeight: 1.6, fontWeight: 500 }}>
                  Applications for the Fall 2026 intake are now open. Secure your spot today.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/apply"
                  variant="contained"
                  startIcon={<AssignmentInd />}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #ea580c, #f97316)",
                    textTransform: "none", fontWeight: 800, borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
                    "&:hover": { background: "linear-gradient(135deg, #c2410c, #ea580c)", transform: "translateY(-1px)" },
                    transition: "all 0.2s ease"
                  }}
                >
                  Apply Now
                </Button>
              </Box>

            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, position: "relative", display: "inline-block" }}>
              Quick Links
              <Box sx={{ position: "absolute", bottom: -8, left: 0, width: 28, height: 3, bgcolor: "primary.main", borderRadius: 1 }} />
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    color: textColorSecondary,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": { color: "primary.main", transform: "translateX(5px)" }
                  }}
                >
                  <ArrowForward sx={{ fontSize: 13, color: "primary.main" }} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Admissions */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, position: "relative", display: "inline-block" }}>
              Admissions
              <Box sx={{ position: "absolute", bottom: -8, left: 0, width: 28, height: 3, bgcolor: "#ea580c", borderRadius: 1 }} />
            </Typography>
            <Stack spacing={1.5}>
              {admissionsLinks.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    color: textColorSecondary,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": { color: "#ea580c", transform: "translateX(5px)" }
                  }}
                >
                  <ArrowForward sx={{ fontSize: 13, color: "#ea580c" }} />
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact & Socials */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, position: "relative", display: "inline-block" }}>
              Connect with Us
              <Box sx={{ position: "absolute", bottom: -8, left: 0, width: 28, height: 3, bgcolor: "primary.main", borderRadius: 1 }} />
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  sx={{
                    bgcolor: isDark ? "rgba(255,255,255,0.06)" : alpha(theme.palette.divider, 0.5),
                    color: textColorSecondary,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: social.color,
                      color: "white",
                      transform: "translateY(-4px)",
                      boxShadow: `0 6px 16px ${alpha(social.color, 0.4)}`
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>

            <Stack spacing={2}>
              {[
                { icon: <LocationOn sx={{ color: "#3b82f6" }} />, title: "Visit Us", content: "123 University Avenue, Academic Square, NY 10001" },
                { icon: <Phone sx={{ color: "#10b981" }} />, title: "Call Center", content: "+1 (800) 123-PORTAL" },
                { icon: <Email sx={{ color: "#ef4444" }} />, title: "Official Email", content: "support@university.edu" },
              ].map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex", alignItems: "flex-start", gap: 2, p: 2,
                    borderRadius: 3,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : alpha(theme.palette.background.default, 0.6),
                    border: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.06)" : alpha(theme.palette.divider, 0.8),
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : alpha(theme.palette.background.default, 0.9), borderColor: "primary.main" }
                  }}
                >
                  <Box sx={{ mt: 0.25, flexShrink: 0, p: 1, borderRadius: 2, bgcolor: isDark ? 'transparent' : 'white', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: textColorMuted, fontWeight: 800, display: "block", mb: 0.25, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textColorPrimary, fontWeight: 600, lineHeight: 1.5 }}>
                      {item.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box sx={{ mt: { xs: 6, md: 8 }, py: 3, borderTop: "1px solid", borderColor: "divider" }}>
          <Grid container justifyContent="space-between" alignItems="center" spacing={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <Grid item>
              <Typography variant="body2" sx={{ color: textColorMuted, textAlign: { xs: 'center', md: 'left' }, fontWeight: 500 }}>
                © {new Date().getFullYear()} University Portal System. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={3} justifyContent="center">
                {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((text) => (
                  <Link key={text} href="#" color="inherit" underline="none"
                    sx={{ color: textColorMuted, fontSize: "0.85rem", fontWeight: 600, "&:hover": { color: "primary.main" } }}>
                    {text}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
