import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Container, Grid, Typography, Button, Card, CardContent,
  Chip, Stack, Divider, Paper
} from "@mui/material";
import {
  School, AutoStories, CalendarMonth, Verified, Campaign,
  Search, ArrowForward, CheckCircle, Church, LibraryBooks,
  AccessTime, Groups, WorkspacePremium
} from "@mui/icons-material";
import { HTTU_COLORS } from "../theme";

export default function Home() {
  const visitorCards = [
    {
      title: "Program catalogue",
      desc: "Curricula, credit hours and modes of study for all 12 programs.",
      icon: <School sx={{ color: HTTU_COLORS.teal }} />,
      link: "/departments",
    },
    {
      title: "Admission requirements",
      desc: "Entry routes, documents, fees and the Fall 2025 calendar.",
      icon: <Verified sx={{ color: HTTU_COLORS.teal }} />,
      link: "/apply",
    },
    {
      title: "Academic calendar",
      desc: "Term dates, exam weeks, graduation and public holidays.",
      icon: <CalendarMonth sx={{ color: HTTU_COLORS.teal }} />,
      link: "/departments",
    },
    {
      title: "Library catalogue search",
      desc: "Search 18,420 titles and the digital manuscript collection.",
      icon: <Search sx={{ color: HTTU_COLORS.teal }} />,
      link: "/login",
    },
    {
      title: "News, events & notices",
      desc: "Commencements, parish outreach days and senate announcements.",
      icon: <Campaign sx={{ color: HTTU_COLORS.teal }} />,
      link: "/news",
    },
    {
      title: "Certificate verification",
      desc: "Verify a transcript or graduation certificate by its QR code.",
      icon: <WorkspacePremium sx={{ color: HTTU_COLORS.teal }} />,
      link: "/track",
    },
  ];

  const programs = [
    {
      level: "Undergraduate",
      title: "B.A. in Theology",
      desc: "Systematic, historical and practical theology with a parish internship each year.",
      duration: "4 years",
      credits: "160 Credit hours",
      mode: "Regular / weekend",
    },
    {
      level: "Undergraduate",
      title: "B.A. in Biblical Studies",
      desc: "Exegesis in Hebrew and Greek, hermeneutics and the Ethiopian canon.",
      duration: "4 years",
      credits: "154 Credit hours",
      mode: "Regular",
    },
    {
      level: "Postgraduate",
      title: "M.Div. Pastoral Ministry",
      desc: "Cohort-based formation for ordained and lay leaders, with field placement.",
      duration: "3 years",
      credits: "96 Credit hours",
      mode: "Cohort",
    },
    {
      level: "Postgraduate",
      title: "M.A. Systematic Theology",
      desc: "Thesis-track patristics, Christology and contemporary Ethiopian theology.",
      duration: "2 years",
      credits: "64 Credit hours",
      mode: "Thesis",
    },
    {
      level: "Certificate",
      title: "Certificate in Church Music",
      desc: "Merekker, Ziq chant notation and liturgical practice — evening classes.",
      duration: "1 year",
      credits: "36 Credit hours",
      mode: "Evening",
    },
    {
      level: "Certificate",
      title: "Certificate in Parish Administration",
      desc: "Bookkeeping, records and communication for parish secretaries.",
      duration: "1 year",
      credits: "30 Credit hours",
      mode: "Weekend",
    },
  ];

  const admissionsSteps = [
    { num: 1, title: "Submit the application", desc: "Online or paper form with ETB 300 fee - parish referral optional." },
    { num: 2, title: "Upload documents", desc: "Baptism certificate, transcript, national ID, photo, two recommendations." },
    { num: 3, title: "Academic review", desc: "Admission committee meets monthly - entry score published per program." },
    { num: 4, title: "Accept & pay deposit", desc: "ETB 3,000 within 14 days - bank transfer, telebirr or CBE Birr." },
    { num: 5, title: "Enrol & register", desc: "Documents verified in person - student ID issued - portal account created." },
  ];

  const newsCards = [
    {
      type: "CONFERENCE",
      date: "MAY 22, 2025",
      title: "International Patristics Conference hosted at HTTU",
      desc: "Three days on the Cappadocian Fathers with speakers from Addis Ababa, Nairobi and Oxford. Open to the public.",
      headerBg: "#0F766E",
    },
    {
      type: "COMMENCEMENT",
      date: "JUN 14, 2025",
      title: "Graduation ceremony — class of 2025",
      desc: "412 graduates expected. Families welcome. Holy Trinity Cathedral grounds, 09:00.",
      headerBg: "#B45309",
    },
    {
      type: "LIBRARY",
      date: "FEB 26, 2025",
      title: "Ge'ez manuscript digitization reaches 412 items",
      desc: "The digital reading room is open to researchers; supervised access for visitors on weekdays.",
      headerBg: "#4338CA",
    },
  ];

  return (
    <Box sx={{ bgcolor: HTTU_COLORS.canvas, minHeight: "100vh" }}>
      {/* ── Top Hero Section ── */}
      <Box
        sx={{
          bgcolor: HTTU_COLORS.navy,
          color: "white",
          pt: { xs: 8, md: 10 },
          pb: { xs: 10, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <Chip
                label="PUBLIC WEBSITE — NO LOGIN REQUIRED"
                size="small"
                sx={{
                  bgcolor: "rgba(217, 166, 33, 0.15)",
                  color: HTTU_COLORS.gold,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: 1,
                  mb: 2.5,
                  border: `1px solid rgba(217, 166, 33, 0.3)`,
                }}
              />
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.15,
                  mb: 2.5,
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                }}
              >
                Faithful scholarship for the Church and for Ethiopia
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 620,
                }}
              >
                Holy Trinity Theology University forms pastors, teachers and scholars in the Orthodox tradition.
                Browse our programs, admission requirements, academic calendar and library catalogue freely —
                portal login is only needed once you study or work here.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <Button
                  component={RouterLink}
                  to="/apply"
                  variant="contained"
                  sx={{
                    bgcolor: HTTU_COLORS.gold,
                    color: "#0E2033",
                    fontWeight: 800,
                    px: 3.5,
                    py: 1.3,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    "&:hover": { bgcolor: HTTU_COLORS.goldLight },
                  }}
                >
                  Apply for Fall 2025
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.3,
                    borderRadius: 2,
                    fontSize: "0.95rem",
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)" },
                  }}
                >
                  → Login to UMS portal
                </Button>
              </Stack>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                Students, staff & faculty: the Login button opens the UMS sign-in page where you enter your portal credentials. Visitors keep browsing this public site without an account.
              </Typography>
            </Grid>

            {/* Right Card: Fall 2025 Intake */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "white",
                  color: HTTU_COLORS.navy,
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  Fall 2025 intake is open
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                  Applications reviewed 1,284 · 486 admitted so far
                </Typography>

                <Stack spacing={2} sx={{ mb: 3.5 }}>
                  {[
                    { label: "Applications open", date: "Jan 6, 2025" },
                    { label: "Admission committee", date: "Mar 12, 2025" },
                    { label: "Applications close", date: "Apr 30, 2025" },
                    { label: "Semester begins", date: "Sep 15, 2025" },
                  ].map((row, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", pb: 1, borderBottom: "1px solid #F1F5F9" }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {row.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>
                        {row.date}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button
                  component={RouterLink}
                  to="/apply"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: HTTU_COLORS.gold,
                    color: "#0E2033",
                    fontWeight: 800,
                    py: 1.3,
                    borderRadius: 2,
                    mb: 1.5,
                    "&:hover": { bgcolor: HTTU_COLORS.goldLight },
                  }}
                >
                  Start an application
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    component={RouterLink}
                    to="/track"
                    variant="caption"
                    fontWeight={700}
                    sx={{ color: HTTU_COLORS.teal, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                  >
                    Check application status — no login required
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Key Statistics Strip ── */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E2E8F0", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between" textAlign="center">
            {[
              { val: "1,842", label: "Enrolled students · Spring 2025" },
              { val: "12", label: "Degree & certificate programs" },
              { val: "68", label: "Academic staff · 38% PhD / Th.D." },
              { val: "18,420+", label: "Library titles incl. Ge'ez manuscripts" },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography variant="h3" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stat.val}
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── What Visitors Can Browse Section ── */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                What visitors can browse without an account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Everything below is public. Signed-in users additionally reach registration, grades, fees, payroll and circulation services.
              </Typography>
            </Box>
            <Typography
              component={RouterLink}
              to="/login"
              variant="body2"
              fontWeight={700}
              sx={{ color: HTTU_COLORS.teal, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Portal login →
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {visitorCards.map((card, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  component={RouterLink}
                  to={card.link}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    textDecoration: "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)",
                      borderColor: HTTU_COLORS.teal,
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                      {card.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={800} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif", mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {card.desc}
                    </Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, mt: 3, display: "block" }}>
                    Open access →
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Programs of Study ── */}
      <Box sx={{ py: 8, bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                Programs of study
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Accredited by HERQA · taught in English with Amharic and Ge'ez sources
              </Typography>
            </Box>
            <Typography
              component={RouterLink}
              to="/departments"
              variant="body2"
              fontWeight={700}
              sx={{ color: HTTU_COLORS.teal, textDecoration: "none" }}
            >
              Full catalogue →
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {programs.map((prog, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Chip
                      label={prog.level}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        bgcolor: prog.level === "Undergraduate" ? "#EFF6FF" : prog.level === "Postgraduate" ? "#FAF5FF" : "#FEF3C7",
                        color: prog.level === "Undergraduate" ? "#2563EB" : prog.level === "Postgraduate" ? "#7E22CE" : "#B45309",
                        mb: 1.5,
                      }}
                    />
                    <Typography variant="h6" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                      {prog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 3 }}>
                      {prog.desc}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{prog.duration}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Credits</Typography>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{prog.credits.split(" ")[0]}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Mode</Typography>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{prog.mode}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Admissions at a Glance ── */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Admissions at a glance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
            Five-step flow from application to first lecture — full guide on the Admissions page
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                {admissionsSteps.map((step) => (
                  <Box key={step.num} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: HTTU_COLORS.navy,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {step.num}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ bgcolor: HTTU_COLORS.navy, color: "white", p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={800} color={HTTU_COLORS.gold} sx={{ mb: 1 }}>
                  Fall 2025 key dates
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mb: 3 }}>
                  All dates Gregorian · 1440 scenario
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {[
                    { date: "Jan 6", label: "Applications open" },
                    { date: "Mar 12", label: "Admission committee" },
                    { date: "Apr 30", label: "Applications close" },
                    { date: "Jun 14", label: "Commencement 2025" },
                    { date: "Sep 8", label: "Orientation week" },
                    { date: "Sep 15", label: "Semester begins" },
                  ].map((d, i) => (
                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", pb: 0.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.gold}>{d.date}</Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>{d.label}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Button
                  component={RouterLink}
                  to="/apply"
                  fullWidth
                  variant="outlined"
                  sx={{ borderColor: HTTU_COLORS.gold, color: HTTU_COLORS.gold, fontWeight: 700, borderRadius: 2 }}
                >
                  Requirements & fees
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── News, Events & Notices ── */}
      <Box sx={{ py: 8, bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                News, events & notices
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Public announcements from the Senate, the Dean's office and the Library
              </Typography>
            </Box>
            <Typography component={RouterLink} to="/news" variant="body2" fontWeight={700} sx={{ color: HTTU_COLORS.teal, textDecoration: "none" }}>
              All news →
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {newsCards.map((news, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ bgcolor: news.headerBg, color: "white", px: 3, py: 2.5 }}>
                    <Typography variant="caption" fontWeight={800} sx={{ letterSpacing: 1.5, opacity: 0.9 }}>
                      {news.type}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1 }}>
                        {news.date}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color={HTTU_COLORS.navy} sx={{ lineHeight: 1.3, mb: 1.5 }}>
                        {news.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {news.desc}
                      </Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, mt: 3, cursor: "pointer" }}>
                      Read announcement →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ bgcolor: "#07111D", color: "rgba(255,255,255,0.7)", pt: 8, pb: 4, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={900} color="white" sx={{ mb: 1.5 }}>
                HOLY TRINITY THEOLOGY UNIVERSITY
              </Typography>
              <Typography variant="caption" display="block" sx={{ lineHeight: 1.8 }}>
                P.O. Box 1142, Addis Ababa, Ethiopia<br />
                +251 11 551 0142 · info@httu.edu.et<br />
                Office hours: Mon–Fri 08:30–17:00 EAT<br />
                Accredited by the Higher Education Relevance & Quality Agency (HERQA).
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="caption" fontWeight={800} color="white" display="block" sx={{ mb: 2, letterSpacing: 1 }}>
                PUBLIC SITE
              </Typography>
              <Stack spacing={1}>
                {["Home", "About the university", "Program catalogue", "Admissions & fees", "Academic calendar", "Library catalogue", "News & events"].map((item, i) => (
                  <Typography key={i} variant="caption" sx={{ cursor: "pointer", "&:hover": { color: "white" } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" fontWeight={800} color="white" display="block" sx={{ mb: 2, letterSpacing: 1 }}>
                PORTAL · LOGIN REQUIRED
              </Typography>
              <Stack spacing={1}>
                {["UMS sign-in (all roles)", "Student portal", "Staff & faculty portal", "Finance & HR offices"].map((item, i) => (
                  <Typography key={i} component={RouterLink} to="/login" variant="caption" sx={{ color: "inherit", textDecoration: "none", cursor: "pointer", "&:hover": { color: "white" } }}>
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" fontWeight={800} color="white" display="block" sx={{ mb: 2, letterSpacing: 1 }}>
                APPLICANTS
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 2, lineHeight: 1.6 }}>
                Start an application on the public Admissions page. After submission you receive portal credentials by SMS and email to track status, upload documents and pay fees.
              </Typography>
              <Button
                component={RouterLink}
                to="/apply"
                size="small"
                variant="contained"
                sx={{ bgcolor: HTTU_COLORS.gold, color: "#0E2033", fontWeight: 800, borderRadius: 2 }}
              >
                Apply for Fall 2025
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
              © 2026 Ethiopia Holy Trinity Theology University · University Management System v2.0.1
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
              This public site needs no account · portal sessions require sign-in
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
