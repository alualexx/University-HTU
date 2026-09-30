import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
} from "@mui/material";
import {
  CheckCircle,
  ExpandMore,
  ArrowForward,
  Login as LoginIcon,
  Download,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  CalendarToday,
  School,
  AccountBalance,
  HelpOutline,
} from "@mui/icons-material";

const HTTU_COLORS = {
  navy: "#0E2033",
  gold: "#D9A621",
  teal: "#12808C",
  canvas: "#F4F6F8",
  cardBg: "#FFFFFF",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  border: "#E2E8F0",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export default function Apply() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Requirements");

  const navItems = [
    { label: "Requirements", id: "requirements" },
    { label: "Documents", id: "documents" },
    { label: "Fees", id: "fees" },
    { label: "How to apply", id: "how-to-apply" },
    { label: "Dates", id: "dates" },
    { label: "Aid", id: "aid" },
    { label: "FAQ", id: "faq" },
  ];

  const scrollTo = (id, label) => {
    setActiveNav(label);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const programsCriteria = [
    {
      level: "Certificate",
      program: "Church Music",
      minReq: "Grade 10 completion (GCE) or documented parish choir service",
      minScore: "—",
      conditions: "Audition in melekket or chant",
      seats: 40,
    },
    {
      level: "Certificate",
      program: "Parish Administration",
      minReq: "Grade 10 completion (GCE)",
      minScore: "—",
      conditions: "Parish secretary nomination",
      seats: 35,
    },
    {
      level: "Undergraduate",
      program: "B.A. Theology",
      minReq: "Grade 12 EUEE, 4 core subjects passed",
      minScore: "500",
      conditions: "Baptism certificate · age ≥ 18",
      seats: 120,
    },
    {
      level: "Undergraduate",
      program: "B.A. Biblical Studies",
      minReq: "Grade 12 EUEE, 4 core subjects passed",
      minScore: "520",
      conditions: "English placement test ≥ B2",
      seats: 80,
    },
    {
      level: "Postgraduate",
      program: "M.Div. Pastoral Ministry",
      minReq: "Recognised bachelor degree, CGPA ≥ 2.75",
      minScore: "2.75",
      conditions: "2 years ministry + diocesan letter",
      seats: 45,
    },
    {
      level: "Postgraduate",
      program: "M.A. Systematic Theology",
      minReq: "BA in Theology or related, CGPA ≥ 3.00",
      minScore: "3.00",
      conditions: "Research proposal + interview",
      seats: 25,
    },
    {
      level: "Transfer",
      program: "All undergraduate",
      minReq: "≥ 24 credits completed at a recognised HEI, good standing",
      minScore: "2.50",
      conditions: "Credit transfer assessed by dept. head",
      seats: 15,
    },
    {
      level: "Mature",
      program: "Certificate / B.A.",
      minReq: "Age ≥ 25 without formal qualification",
      minScore: "—",
      conditions: "Entrance exam 60% + parish referral",
      seats: 10,
    },
  ];

  const requiredDocuments = [
    { title: "Baptism certificate", desc: "Issued by the parish · all applicants" },
    { title: "National ID or passport", desc: "Photo page · valid at registration" },
    { title: "Two passport photos", desc: "Recent, white background, 3×4 cm" },
    { title: "Grade 12 result slip", desc: "EUEE result · undergraduate applicants" },
    { title: "Degree & grade transcript", desc: "Sealed or verified copy · postgraduate" },
    { title: "Two recommendation letters", desc: "One from clergy, one academic or employer" },
    { title: "Diocesan / parish referral", desc: "Required for M.Div. and clergy applicants" },
    { title: "Medical certificate", desc: "Government health centre, within 6 months" },
    { title: "Application fee receipt", desc: "ETB 300 · reference number must match the form" },
    { title: "Marriage certificate", desc: "If applicable · required for campus housing" },
    { title: "Music portfolio or audition tape", desc: "Certificate in Church Music only" },
    { title: "Research proposal (2 pages)", desc: "M.A. Systematic Theology thesis track" },
  ];

  const feeTable = [
    { program: "B.A. Theology", level: "UG", tuition: "18,600", reg: "450", grad: "1,200", total: "22,050" },
    { program: "B.A. Biblical Studies", level: "UG", tuition: "18,600", reg: "450", grad: "1,200", total: "22,050" },
    { program: "M.Div. Pastoral Ministry", level: "PG", tuition: "22,400", reg: "600", grad: "1,500", total: "26,500" },
    { program: "M.A. Systematic Theology", level: "PG", tuition: "22,400", reg: "600", grad: "1,500", total: "26,500" },
    { program: "Certificate in Church Music", level: "Cert", tuition: "9,800", reg: "300", grad: "600", total: "11,400" },
    { program: "Certificate in Parish Administration", level: "Cert", tuition: "9,800", reg: "300", grad: "600", total: "11,400" },
    { program: "Campus housing (optional, per year)", level: "Other", tuition: "7,200", reg: "—", grad: "—", total: "7,200" },
    { program: "Library deposit (refundable)", level: "Other", tuition: "500", reg: "—", grad: "—", total: "500" },
  ];

  const appSteps = [
    { num: 1, title: "Create your application (public)", desc: "Fill the online form or collect a paper form at the Registrar's office · pay ETB 300" },
    { num: 2, title: "Attach documents", desc: "Scans uploaded to the form; originals presented at verification" },
    { num: 3, title: "Committee review", desc: "Departmental capacity check; entrance exam/interview where required · monthly sittings" },
    { num: 4, title: "Receive your decision (login required)", desc: "Portal credentials are issued by SMS and email · offer letter downloadable from the portal" },
    { num: 5, title: "Accept and pay the deposit (login required)", desc: "ETB 3,000 within 14 days of the offer · invoice generated in the Finance module" },
    { num: 6, title: "Verify documents in person", desc: "Registrar's office, Mon-Fri 08:30-16:30 · student ID issued on the spot" },
    { num: 7, title: "Register for courses (login required)", desc: "Advisor-approved course list, 12-21 credit hours per semester · timetable published" },
  ];

  return (
    <Box sx={{ bgcolor: HTTU_COLORS.canvas, minHeight: "100vh", pb: 8 }}>
      {/* ── Top Header Hero ── */}
      <Box sx={{ bgcolor: HTTU_COLORS.navy, color: "white", pt: 6, pb: 7, px: 3, position: "relative" }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.gold }} />
                <Typography
                  variant="caption"
                  sx={{ color: HTTU_COLORS.gold, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}
                >
                  PUBLIC PAGE · OPEN TO ALL VISITORS
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ fontFamily: "'Outfit', sans-serif", mb: 2 }}>
                Admissions, requirements & fees
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.7, maxWidth: 640 }}>
                Everything you need to apply is published here — entry requirements by level, the document checklist, tuition
                and payment channels, key dates and the admissions office contacts. No account is needed to read this page;
                a portal account is created for you only after you are admitted.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.12)", p: 3, borderRadius: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/apply/form")}
                  sx={{
                    bgcolor: HTTU_COLORS.gold,
                    color: HTTU_COLORS.navy,
                    fontWeight: 800,
                    py: 1.5,
                    fontSize: "1rem",
                    mb: 2,
                    "&:hover": { bgcolor: "#c4951d" },
                  }}
                >
                  Start an application
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    fontWeight: 700,
                    py: 1.2,
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255, 255, 255, 0.05)" },
                  }}
                >
                  Login to UMS portal
                </Button>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", textAlign: "center", mt: 1.5 }}>
                  🔒 Check application status — login required
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Sub-navigation sticky strip ── */}
      <Box sx={{ bgcolor: "white", borderBottom: `1px solid ${HTTU_COLORS.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", gap: 1, py: 1.5, overflowX: "auto" }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollTo(item.id, item.label)}
                sx={{
                  color: activeNav === item.label ? HTTU_COLORS.navy : HTTU_COLORS.textSecondary,
                  bgcolor: activeNav === item.label ? "rgba(14, 32, 51, 0.08)" : "transparent",
                  fontWeight: activeNav === item.label ? 800 : 600,
                  fontSize: "0.85rem",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* ── Main Left Content Column ── */}
          <Grid item xs={12} lg={8.5}>
            {/* Section 1: Entry Requirements by Level */}
            <Box id="requirements" sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy}>
                    Entry requirements by level
                  </Typography>
                  <Typography variant="body2" color={HTTU_COLORS.textSecondary}>
                    Minimum thresholds published per program by the Admission Committee. Meeting a threshold does not guarantee admission — places are limited by departmental capacity.
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                  Approved by Senate · 12 Dec 2024
                </Typography>
              </Box>

              <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }}>LEVEL</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }}>PROGRAM</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }}>MINIMUM ACADEMIC REQUIREMENT</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }} align="center">MIN. SCORE</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }}>OTHER CONDITIONS</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", color: HTTU_COLORS.textSecondary }} align="right">SEATS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {programsCriteria.map((row, idx) => (
                      <TableRow key={idx} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>
                          <Chip
                            label={row.level}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              bgcolor:
                                row.level === "Undergraduate"
                                  ? "rgba(18, 128, 140, 0.12)"
                                  : row.level === "Postgraduate"
                                  ? "rgba(14, 32, 51, 0.1)"
                                  : "rgba(217, 166, 33, 0.15)",
                              color:
                                row.level === "Undergraduate"
                                  ? HTTU_COLORS.teal
                                  : row.level === "Postgraduate"
                                  ? HTTU_COLORS.navy
                                  : "#B48316",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: HTTU_COLORS.navy }}>{row.program}</TableCell>
                        <TableCell sx={{ fontSize: "0.82rem", color: HTTU_COLORS.textSecondary }}>{row.minReq}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{row.minScore}</TableCell>
                        <TableCell sx={{ fontSize: "0.82rem", color: HTTU_COLORS.textSecondary }}>{row.conditions}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: HTTU_COLORS.navy }}>{row.seats}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="caption" color="text.secondary">
                    Entrance exam and interview dates are announced on this page; results are published to applicants' portal accounts.
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Section 2: Required Documents */}
            <Box id="documents" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                Required documents
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mb: 3 }}>
                Upload clear scans (PDF or JPG, max 5 MB each) with the online form, or bring originals plus one photocopy set to the Registrar's office. Incomplete files are returned for correction and re-join the queue at the back.
              </Typography>

              <Grid container spacing={2}>
                {requiredDocuments.map((doc, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: `1px solid ${HTTU_COLORS.border}`,
                        height: "100%",
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <CheckCircle sx={{ color: HTTU_COLORS.success, fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} color={HTTU_COLORS.navy}>
                          {doc.title}
                        </Typography>
                        <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
                          {doc.desc}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Section 3: Fees & Payment */}
            <Box id="fees" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                Fees & payment
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mb: 3 }}>
                All amounts in Ethiopian Birr (ETB) per academic year, approved by the Board for 2025/26. Invoices are generated in the portal after admission; a 5% late fee applies per month on overdue balances.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={7.5}>
                  <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, overflow: "hidden" }}>
                    <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Tuition and charges by program <Typography component="span" variant="caption" color="text.secondary">(Academic year 2025/26)</Typography>
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>PROGRAM</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>LEVEL</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>TUITION / YEAR</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>REGISTRATION</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>GRADUATION FEE</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>TOTAL YEAR 1</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {feeTable.map((row, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", color: HTTU_COLORS.navy }}>{row.program}</TableCell>
                            <TableCell>
                              <Chip label={row.level} size="small" sx={{ fontSize: "0.65rem", height: 20 }} />
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.8rem" }}>{row.tuition}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.8rem" }}>{row.reg}</TableCell>
                            <TableCell align="right" sx={{ fontSize: "0.8rem" }}>{row.grad}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.85rem", color: HTTU_COLORS.navy }}>
                              {row.total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">
                        Tuition may be paid in three installments: 40% at registration, 30% mid-semester, 30% before final exams.
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4.5}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                      One-time applicant charges
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Application fee</Typography>
                      <Typography variant="body2" fontWeight={800}>ETB 300</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Entrance exam & interview</Typography>
                      <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.success}>Free</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Admission deposit (credited to tuition)</Typography>
                      <Typography variant="body2" fontWeight={800}>ETB 3,000</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Student ID card</Typography>
                      <Typography variant="body2" fontWeight={800}>ETB 150</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Document verification</Typography>
                      <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.success}>Free</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic" }}>
                      The application fee is non-refundable. The deposit is refundable only if the applicant withdraws before the semester begins.
                    </Typography>
                  </Card>

                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                    <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                      Accepted payment channels
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                      {["Commercial Bank of Ethiopia", "Bank transfer", "telebirr", "CBE Birr", "M-Pesa", "Cheque", "Cash at the Bursar"].map((chan) => (
                        <Chip key={chan} label={chan} size="small" sx={{ bgcolor: "#F1F5F9", fontWeight: 600, fontSize: "0.75rem" }} />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Quote your application reference (e.g. APP-2025-01284) so the receipt reconciles automatically.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Section 4: How to Apply */}
            <Box id="how-to-apply" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                How to apply
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mb: 3 }}>
                The application itself is submitted on this public site. From step 4 onward you work inside the UMS portal with credentials sent to you by SMS and email.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {appSteps.map((step) => (
                      <Card key={step.num} sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}`, display: "flex", gap: 2, alignItems: "flex-start" }}>
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
                            flexShrink: 0,
                          }}
                        >
                          {step.num}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                            {step.title}
                          </Typography>
                          <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5, fontSize: "0.85rem" }}>
                            {step.desc}
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card sx={{ bgcolor: HTTU_COLORS.navy, color: "white", p: 3, borderRadius: 3, mb: 3 }} id="dates">
                    <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.gold}>
                      Fall 2025 key dates
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mb: 2 }}>
                      Gregorian calendar · East Africa Time
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {[
                        { date: "Jan 6", label: "Applications open", year: "2025" },
                        { date: "Apr 30", label: "Applications close", year: "2025" },
                        { date: "May 14", label: "Committee decision", year: "2025" },
                        { date: "May 30", label: "Results published", year: "2025" },
                        { date: "Jun 15", label: "Deposit deadline", year: "2025" },
                        { date: "Aug 25", label: "Document verification", year: "— Sep 5" },
                        { date: "Sep 8", label: "Orientation week", year: "2025" },
                        { date: "Sep 15", label: "Semester begins", year: "2025" },
                        { date: "Sep 29", label: "Add / drop closes", year: "2025" },
                      ].map((item, idx) => (
                        <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", pb: 1 }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: HTTU_COLORS.gold, minWidth: 60 }}>
                            {item.date}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "white", flex: 1, px: 1 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            {item.year}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      sx={{
                        bgcolor: HTTU_COLORS.gold,
                        color: HTTU_COLORS.navy,
                        fontWeight: 800,
                        mt: 3,
                        "&:hover": { bgcolor: "#c4951d" },
                      }}
                    >
                      Download the admissions guide (PDF)
                    </Button>
                  </Card>

                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                        Spring 2026 intake
                      </Typography>
                      <Chip label="Planned" size="small" sx={{ bgcolor: "#E2E8F0", fontSize: "0.7rem" }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Applications open</Typography>
                      <Typography variant="caption" fontWeight={700}>Oct 1, 2025</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Applications close</Typography>
                      <Typography variant="caption" fontWeight={700}>Dec 15, 2025</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                      <Typography variant="caption" color="text.secondary">Results published</Typography>
                      <Typography variant="caption" fontWeight={700}>Jan 12, 2026</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                      <Typography variant="caption" color="text.secondary">Semester begins</Typography>
                      <Typography variant="caption" fontWeight={700}>Feb 9, 2026</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Section 5: Scholarships & Financial Aid */}
            <Box id="aid" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                Scholarships & financial aid
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mb: 3 }}>
                Awarded by the Scholarship Committee each semester. Applications are submitted through the portal after admission; supporting documents are verified by the Finance and HR offices.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                        Diocesan scholarship
                      </Typography>
                      <Chip label="Up to 100%" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
                    </Box>
                    <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ lineHeight: 1.6 }}>
                      For candidates nominated by a diocese for ordained ministry. Covers tuition, registration and housing; requires a signed service commitment of three years after graduation.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                        Merit scholarship
                      </Typography>
                      <Chip label="50%" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700 }} />
                    </Box>
                    <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ lineHeight: 1.6 }}>
                      Continuing students with a semester CGPA of 3.75 or above and no disciplinary record. Renewed each semester on the same conditions.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                        Need-based grant
                      </Typography>
                      <Chip label="25 – 50%" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
                    </Box>
                    <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ lineHeight: 1.6 }}>
                      Assessed from household income evidence and a kebele letter. Limited to 60 students per year; priority to widows, orphans and rural parish servants.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Section 6: Questions applicants ask (FAQ) */}
            <Box id="faq" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                Questions applicants ask
              </Typography>
              <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mb: 3 }}>
                If your question is not answered here, contact the Registrar & Admissions Office — replies within two working days.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  {
                    q: "Do I need an account to read this page or to start an application?",
                    a: "No. The public website — programs, requirements, fees, calendar, library catalogue search and news — is open to everyone. You only sign in after the committee issues a decision and your portal credentials arrive by SMS and email.",
                  },
                  {
                    q: "Where does the Login button take me?",
                    a: "To the UMS sign-in page, the single entry point for all nine portals: Admin, Registrar, Dean, Department Head, Faculty, Student, Finance Officer, HR Manager and Librarian. Your role determines what you see after signing in.",
                  },
                  {
                    q: "Can I apply for more than one program?",
                    a: "Yes — one application form per program, each with its own ETB 300 fee and reference number. The committee reviews them independently.",
                  },
                  {
                    q: "How do I know my documents were accepted?",
                    a: "The checklist status is shown in your portal account. Documents requiring correction are listed with a reason; re-upload restores your place in the review queue within 48 hours.",
                  },
                  {
                    q: "Is weekend or evening study available?",
                    a: "The B.A. in Theology runs a weekend cohort, and both certificates are taught in the evening. Postgraduate programs are cohort-based with intensive residential blocks.",
                  },
                  {
                    q: "What if I cannot pay the full tuition at registration?",
                    a: "Request the three-installment plan when you accept the offer. A 5% late fee per month applies to overdue installments, and registration for the next semester is blocked until the balance is cleared.",
                  },
                ].map((faq, idx) => (
                  <Accordion key={idx} sx={{ borderRadius: "10px !important", border: `1px solid ${HTTU_COLORS.border}`, boxShadow: "none", "&:before": { display: "none" } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" fontWeight={700} color={HTTU_COLORS.navy}>
                        Q. {faq.q}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ lineHeight: 1.7 }}>
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* ── Right Sticky Sidebar ── */}
          <Grid item xs={12} lg={3.5}>
            {/* What needs a login card */}
            <Card sx={{ p: 3, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                🔒 What needs a login
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                {[
                  "Application status & committee decision",
                  "Admission offer letter (PDF)",
                  "Invoice, deposit receipt and payment history",
                  "Course registration and timetable",
                  "Grades, transcripts and certificates",
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: HTTU_COLORS.gold }} />
                    <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ fontSize: "0.82rem" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <MuiLink
                component="button"
                onClick={() => navigate("/login")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: HTTU_COLORS.teal,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <ArrowForward sx={{ fontSize: 16 }} /> Open the sign-in page
              </MuiLink>
            </Card>

            {/* Intake status card */}
            <Card sx={{ p: 3, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                Intake status
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Applications received</Typography>
                  <Typography variant="body2" fontWeight={800}>1,284</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Documents complete</Typography>
                  <Typography variant="body2" fontWeight={800}>1,047</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Admitted</Typography>
                  <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.teal}>486</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color={HTTU_COLORS.textSecondary}>Deposit paid</Typography>
                  <Typography variant="body2" fontWeight={800}>311</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>Seats remaining</Typography>
                  <Typography variant="body2" fontWeight={900} color="#B48316">54</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic" }}>
                Figures updated weekly by the Registrar's office · 28 Mar 2025
              </Typography>
            </Card>

            {/* Registrar & Admissions Office Contact Card */}
            <Card sx={{ p: 3, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
                Registrar & Admissions Office
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Contact person</Typography>
                  <Typography variant="body2" fontWeight={700}>Meskerem Abebe · Registrar</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Telephone</Typography>
                  <Typography variant="body2" fontWeight={600}>+251 11 551 0142 ext. 210</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600} color={HTTU_COLORS.teal}>admissions@httu.edu.et</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Office</Typography>
                  <Typography variant="body2">Administration block, room 104</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Hours</Typography>
                  <Typography variant="body2">Mon–Fri 08:30–16:30 EAT</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Postal address</Typography>
                  <Typography variant="body2">P.O. Box 1142, Addis Ababa</Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => window.location.href = "mailto:admissions@httu.edu.et"}
                sx={{
                  bgcolor: HTTU_COLORS.teal,
                  fontWeight: 700,
                  mt: 2.5,
                  "&:hover": { bgcolor: "#0f6c77" },
                }}
              >
                Send an enquiry
              </Button>
            </Card>

            {/* Already applied? */}
            <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(18, 128, 140, 0.06)", border: `1px solid rgba(18, 128, 140, 0.2)` }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1 }}>
                Already applied?
              </Typography>
              <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mb: 1.5, lineHeight: 1.5 }}>
                • Sign in to track your application stage<br />
                • Download your offer letter and invoice<br />
                • Pay the deposit by telebirr or CBE Birr
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/login")}
                startIcon={<LoginIcon />}
                sx={{
                  color: HTTU_COLORS.navy,
                  borderColor: HTTU_COLORS.navy,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  "&:hover": { bgcolor: "rgba(14, 32, 51, 0.05)" },
                }}
              >
                Login to the UMS portal
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ── Bottom Callout Banner ── */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Card
          sx={{
            bgcolor: HTTU_COLORS.navy,
            color: "white",
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.gold} sx={{ mb: 0.5 }}>
              Fall 2025 applications close April 30
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              54 seats remain across the twelve programs. Submit the public application form now — you will receive portal credentials only if you are admitted.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/apply/form")}
              sx={{
                bgcolor: HTTU_COLORS.gold,
                color: HTTU_COLORS.navy,
                fontWeight: 800,
                px: 3,
                py: 1.2,
                "&:hover": { bgcolor: "#c4951d" },
              }}
            >
              Start an application
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.4)",
                fontWeight: 700,
                px: 3,
                py: 1.2,
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Login
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
