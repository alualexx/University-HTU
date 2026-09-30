import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Stack, Button,
  Chip, Avatar, CircularProgress, Divider
} from '@mui/material';
import {
  School, CheckCircle, Warning, AccountBalanceWallet,
  MenuBook, AccessTime, ArrowForward, NotificationsActive,
  CalendarToday, AssignmentOutlined, Campaign
} from '@mui/icons-material';
import { HTTU_COLORS } from '../../../theme';

export default function DashboardTab({ user, setActiveTab }) {
  const studentName = user?.first_name || "Daniel";

  const enrolledCourses = [
    { code: "NT 305", title: "Pauline Epistles", instructor: "Dr. Testage Melaku", credits: 3, badgeColor: "#0284C7" },
    { code: "TH 201", title: "Systematic Theology I", instructor: "Dr. Alemeyahu Worku", credits: 4, badgeColor: "#D97706" },
    { code: "BI 210", title: "Biblical Interpretation", instructor: "Dr. Sofia Assefa", credits: 3, badgeColor: "#7C3AED" },
    { code: "PT 220", title: "Pastoral Care", instructor: "Dr. Bethlehem Tesema", credits: 3, badgeColor: "#EA580C" },
    { code: "CH 301", title: "Church History", instructor: "Fr. Dawit Gebre", credits: 3, badgeColor: "#059669" },
  ];

  const todayClasses = [
    { time: "08:00 AM", code: "NT 305", title: "Pauline Epistles", loc: "Room 201", eta: "In 30 min", prof: "Dr. Alemeyahu Worku" },
    { time: "10:00 AM", code: "TH 201", title: "Systematic Theology I", loc: "Room 105", eta: "In 2h", prof: "Dr. Alemeyahu Worku" },
    { time: "01:00 PM", code: "BI 210", title: "Biblical Interpretation", loc: "Room 203", eta: "In 5h", prof: "Dr. Sofia Assefa" },
    { time: "03:00 PM", code: "PT 220", title: "Pastoral Care", loc: "Room 204", eta: "In 7h", prof: "Dr. Bethlehem Tesema" },
  ];

  const recentGrades = [
    { title: "Old Testament Survey", code: "BI 101 · Jan 20, 2025", grade: "A", color: "#059669" },
    { title: "Introduction to Theology", code: "TH 101 · Jan 18, 2025", grade: "B+", color: "#2563EB" },
    { title: "Hermeneutics I", code: "BI 205 · Jan 15, 2025", grade: "A-", color: "#059669" },
    { title: "Christian Ethics", code: "TH 210 · Jan 10, 2025", grade: "B", color: "#2563EB" },
    { title: "Worship & Liturgy", code: "PT 101 · Jan 8, 2025", grade: "A", color: "#059669" },
  ];

  const assignmentsDue = [
    { title: "Exegetical Paper — Romans 8", course: "NT 305 — Pauline Epistles · May 2, 2025", badge: "2 days left", badgeColor: "#DC2626" },
    { title: "Theology Reflection Journal", course: "TH 201 — Systematic Theology I · May 5, 2025", badge: "5 days left", badgeColor: "#D97706" },
    { title: "Biblical Interpretation Assignment", course: "BI 210 — Biblical Interpretation · May 7, 2025", badge: "7 days left", badgeColor: "#D97706" },
    { title: "Church History Timeline Project", course: "CH 301 — Church History · May 9, 2025", badge: "9 days left", badgeColor: "#64748B" },
  ];

  const announcements = [
    {
      title: "Midterm Exam Schedule Released",
      desc: "Midterm exams will be held during Week 10. Check the schedule posted on the notice board and portal. · Apr 28, 2025",
      star: true,
    },
    {
      title: "Chapel Service — This Friday",
      desc: "Join us for chapel service this Friday at 10:00 AM in the Main Chapel. All students are encouraged to attend. · Apr 27, 2025",
    },
    {
      title: "Library Workshop: Research Skills",
      desc: "Join the library team for a workshop on academic research skills. May 6, 2025 at 2:00 PM in the Library Hall. · Apr 25, 2025",
    },
  ];

  return (
    <Box>
      {/* ── Top Welcome Banner ── */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Welcome back, {studentName} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening in your academic journey — Spring Semester 2025, Week 8 of 16.
          </Typography>
        </Box>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          Spring Semester 2025 · Jan 20 – May 30
        </Typography>
      </Box>

      {/* ── 4 Top Metric Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* GPA */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
              Cumulative GPA
            </Typography>
            <Typography variant="h3" fontWeight={900} color={HTTU_COLORS.navy} sx={{ my: 1, fontFamily: "'Outfit', sans-serif" }}>
              3.42
            </Typography>
            <Chip
              label="Good Standing"
              size="small"
              icon={<CheckCircle sx={{ fontSize: "14px !important" }} />}
              sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.72rem" }}
            />
          </Card>
        </Grid>

        {/* Academic Standing */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
              Academic Standing
            </Typography>
            <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy} sx={{ mt: 1.5, mb: 0.5 }}>
              Good Standing
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Keep up the great work!
            </Typography>
          </Card>
        </Grid>

        {/* Degree Progress */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
                  Degree Progress
                </Typography>
                <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy} sx={{ mt: 0.5 }}>
                  99 / 160 credits
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: HTTU_COLORS.teal, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                  onClick={() => setActiveTab && setActiveTab(3)}
                >
                  View Degree Audit →
                </Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={62} size={54} thickness={4} sx={{ color: HTTU_COLORS.teal }} />
                <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="caption" fontWeight={800} color={HTTU_COLORS.navy}>62%</Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Outstanding Balance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
              Outstanding Balance
            </Typography>
            <Typography variant="h5" fontWeight={900} color="#DC2626" sx={{ my: 0.5 }}>
              ETB 4,850.00
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              Due by May 15, 2025
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{ bgcolor: HTTU_COLORS.gold, color: "#0E2033", fontWeight: 800, borderRadius: 1.5, py: 0.4 }}
              onClick={() => setActiveTab && setActiveTab(6)}
            >
              Make a Payment
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* ── Mid Section: Enrolled Courses, Upcoming Classes, Recent Grades ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 1. Enrolled Courses */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>
                Enrolled Courses (5)
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }}>
                View all →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {enrolledCourses.map((c, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: c.badgeColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem" }}>
                      {c.code.split(" ")[0]}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                        {c.code} — {c.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.instructor} · {c.credits} cr
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="Active" size="small" sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.68rem" }} />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* 2. Upcoming Classes */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>
                Upcoming Classes
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }}>
                Full schedule →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {todayClasses.map((cl, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", pb: 1.5, borderBottom: i < todayClasses.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" display="block">
                      {cl.time}
                    </Typography>
                    <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                      {cl.code} — {cl.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Lecture · {cl.prof}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.teal} display="block">
                      {cl.eta}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cl.loc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* 3. Recent Grades */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>
                Recent Grades
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }} onClick={() => setActiveTab && setActiveTab(5)}>
                View all →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {recentGrades.map((g, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                      {g.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {g.code}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={900} sx={{ color: g.color }}>
                    {g.grade}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* ── Bottom Section: Assignments Due & Announcements ── */}
      <Grid container spacing={3}>
        {/* Assignments Due */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>
                Assignments Due
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }}>
                View all →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {assignmentsDue.map((a, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5, borderBottom: i < assignmentsDue.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.course}
                    </Typography>
                  </Box>
                  <Chip
                    label={a.badge}
                    size="small"
                    sx={{ bgcolor: "#FEF2F2", color: a.badgeColor, fontWeight: 700, fontSize: "0.7rem" }}
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>
                Announcements
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }}>
                View all announcements →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {announcements.map((ann, i) => (
                <Box key={i} sx={{ pb: 1.5, borderBottom: i < announcements.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {ann.star && "⭐"} {ann.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", lineHeight: 1.5 }}>
                    {ann.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
