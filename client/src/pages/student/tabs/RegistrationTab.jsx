import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Stack, Button,
  TextField, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, LinearProgress, Alert, Paper, Divider
} from '@mui/material';
import {
  CheckCircle, Warning, Lock, AccessTime, School,
  ArrowForward, DeleteOutline
} from '@mui/icons-material';
import { HTTU_COLORS } from '../../../theme';

export default function RegistrationTab({ user, setActiveTab }) {
  const [selectedCourses, setSelectedCourses] = useState([
    { id: "c1", code: "NT 305", title: "Pauline Epistles", section: "Sec 01", schedule: "MW 8:00", credits: 3 },
    { id: "c2", code: "TH 201", title: "Systematic Theology I", section: "Sec 01", schedule: "TTh 10:00", credits: 4 },
    { id: "c3", code: "BI 210", title: "Biblical Interpretation", section: "Sec 02", schedule: "MW 13:00", credits: 3 },
    { id: "c4", code: "PT 220", title: "Pastoral Care", section: "Sec 01", schedule: "TTh 15:00", credits: 3 },
    { id: "c5", code: "CH 301", title: "Church History", section: "Sec 01", schedule: "F 9:00", credits: 2 },
  ]);

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const availableSections = [
    {
      id: "sec-1",
      code: "TH 305",
      title: "Church History I",
      dept: "Department of Theology",
      section: "Sec 01",
      instructor: "Dr. Hanna Bekele",
      schedule: "MW 9:00–10:30",
      location: "Room 201, Main Building",
      seatsTaken: 22,
      maxSeats: 30,
      waitlist: 0,
      credits: 3,
      status: "open",
    },
    {
      id: "sec-2",
      code: "BI 320",
      title: "Hebrew Exegesis",
      dept: "Department of Biblical Studies",
      section: "Sec 01",
      instructor: "Fr. Dawit Gebre",
      schedule: "TTh 11:00–12:30",
      location: "Room 108, Theology Hall",
      seatsTaken: 26,
      maxSeats: 30,
      waitlist: 2,
      credits: 3,
      status: "open",
    },
    {
      id: "sec-3",
      code: "PT 310",
      title: "Homiletics I",
      dept: "Department of Ministry",
      section: "Sec 02",
      instructor: "Dr. Bethlehem Tesema",
      schedule: "F 13:00–16:00",
      location: "Chapel Annex",
      seatsTaken: 12,
      maxSeats: 30,
      waitlist: 0,
      credits: 2,
      status: "blocked",
      blockReason: "Prerequisites not met: PT 210 required",
    },
    {
      id: "sec-4",
      code: "GEZ 101",
      title: "Introduction to Geez",
      dept: "Department of Liturgical Studies",
      section: "Sec 01",
      instructor: "Memhir Selamawit Haile",
      schedule: "MW 14:00–15:30",
      location: "Room 004, Manuscript Lab",
      seatsTaken: 29,
      maxSeats: 30,
      waitlist: 5,
      credits: 2,
      status: "waitlist",
    },
    {
      id: "sec-5",
      code: "CH 320",
      title: "History of the Ethiopian Church",
      dept: "Department of Church History",
      section: "Sec 01",
      instructor: "Dr. Abraham Mekonnen",
      schedule: "TTh 8:00–9:30",
      location: "Room 210, Main Building",
      seatsTaken: 18,
      maxSeats: 30,
      waitlist: 0,
      credits: 3,
      status: "open",
    },
  ];

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

  const handleDrop = (id) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== id));
  };

  const handleRegister = (sec) => {
    if (selectedCourses.some(c => c.code === sec.code)) {
      alert("You already selected this course!");
      return;
    }
    if (totalCredits + sec.credits > 21) {
      alert("Credit limit reached: max 21 credits permitted!");
      return;
    }
    setSelectedCourses([
      ...selectedCourses,
      {
        id: sec.id,
        code: sec.code,
        title: sec.title,
        section: sec.section,
        schedule: sec.schedule.split("–")[0],
        credits: sec.credits,
      }
    ]);
  };

  return (
    <Box>
      {/* ── Breadcrumb & Title ── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          Academic / Course Registration
        </Typography>
        <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif", mt: 0.5 }}>
          Course Registration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse open sections for the Spring Semester 2025 and build your schedule.
        </Typography>
      </Box>

      {/* ── Top Schedule Banner ── */}
      <Card sx={{ bgcolor: HTTU_COLORS.navy, color: "white", p: 3, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }} display="block">
                  Spring Semester 2025
                </Typography>
                <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.gold}>
                  Registration window
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Jan 6 – Jan 17, 2025<br />Opens 08:00 · closes 23:59
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }} display="block">
                  Add / drop deadline
                </Typography>
                <Typography variant="body2" fontWeight={800} color="white">
                  Feb 14, 2025
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  100% refund window
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }} display="block">
                  Withdrawal deadline
                </Typography>
                <Typography variant="body2" fontWeight={800} color="white">
                  Apr 18, 2025
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Grade of 'W' assigned
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.gold}>
              {totalCredits} <Typography component="span" variant="body1" sx={{ color: "white" }}>/ 21 credits selected</Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mb: 1 }}>
              Minimum 12 credits per semester
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(totalCredits / 21) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.gold },
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* ── Main Two-Column Layout ── */}
      <Grid container spacing={3}>
        {/* Left Column: Open Sections */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>
                Open Sections
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <TextField
                  select
                  size="small"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  sx={{ width: 140 }}
                >
                  <MenuItem value="All">Department: All</MenuItem>
                  <MenuItem value="Theology">Theology</MenuItem>
                  <MenuItem value="Biblical">Biblical Studies</MenuItem>
                  <MenuItem value="Church History">Church History</MenuItem>
                </TextField>
                <TextField
                  placeholder="Filter courses..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 160 }}
                />
              </Stack>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>COURSE</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>SECTION / INSTRUCTOR</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>SCHEDULE</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>SEATS</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>CREDITS</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: "0.75rem", color: "text.secondary" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableSections.map((sec) => (
                    <TableRow key={sec.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                          {sec.code} — {sec.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sec.dept}
                        </Typography>
                        {sec.blockReason && (
                          <Typography variant="caption" color="error.main" fontWeight={700} display="block">
                            ⚠ {sec.blockReason}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {sec.section}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sec.instructor}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.navy} display="block">
                          {sec.schedule}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sec.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {sec.seatsTaken}/{sec.maxSeats}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          waitlist {sec.waitlist}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800}>
                          {sec.credits}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {sec.status === "blocked" ? (
                          <Button size="small" disabled variant="outlined" sx={{ borderRadius: 1.5, fontSize: "0.75rem" }}>
                            Blocked
                          </Button>
                        ) : sec.status === "waitlist" ? (
                          <Button size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: "0.75rem", borderColor: HTTU_COLORS.gold, color: "#92400E" }}>
                            Join Waitlist
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleRegister(sec)}
                            sx={{ bgcolor: HTTU_COLORS.teal, borderRadius: 1.5, fontSize: "0.75rem", "&:hover": { bgcolor: HTTU_COLORS.tealDark } }}
                          >
                            Register
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right Column: My Selections */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>
                My Selections
              </Typography>
              <Chip label={`${totalCredits} credits`} size="small" sx={{ bgcolor: "#F0FDFA", color: HTTU_COLORS.teal, fontWeight: 800 }} />
            </Box>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {selectedCourses.map((c) => (
                <Box key={c.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5, borderBottom: "1px solid #F1F5F9" }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                      {c.code} — {c.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.section} · {c.schedule} · {c.credits} cr
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDrop(c.id)}
                    sx={{ minWidth: 40, fontSize: "0.75rem", fontWeight: 700 }}
                  >
                    Drop
                  </Button>
                </Box>
              ))}
            </Stack>

            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total credits</Typography>
                <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>{totalCredits} / 21</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Estimated tuition</Typography>
                <Typography variant="body2" fontWeight={900} color={HTTU_COLORS.navy}>ETB 15,000.00</Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: HTTU_COLORS.gold,
                color: "#0E2033",
                fontWeight: 900,
                py: 1.3,
                borderRadius: 2,
                fontSize: "0.95rem",
                "&:hover": { bgcolor: HTTU_COLORS.goldLight },
              }}
            >
              Submit Registration
            </Button>

            {/* Financial Hold Notice */}
            <Alert severity="warning" sx={{ mt: 3, borderRadius: 2, fontSize: "0.8rem" }}>
              <Typography variant="caption" fontWeight={800} display="block">
                Financial hold on your account
              </Typography>
              An outstanding balance of ETB 4,850.00 must be settled before registration is finalized.{" "}
              <Typography
                component="span"
                variant="caption"
                fontWeight={800}
                sx={{ textDecoration: "underline", cursor: "pointer", color: "#92400E" }}
                onClick={() => setActiveTab && setActiveTab(6)}
              >
                Pay now
              </Typography>
            </Alert>
          </Card>

          {/* Registration Rules Card */}
          <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <Typography variant="caption" fontWeight={900} color={HTTU_COLORS.navy} display="block" sx={{ mb: 1, textTransform: "uppercase" }}>
              Registration Rules
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.6 }}>
              • 12–21 credits per semester · prerequisites enforced<br />
              • Sections close at full capacity · drops after Feb 14 require advisor approval
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
