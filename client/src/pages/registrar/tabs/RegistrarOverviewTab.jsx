import React from "react";
import {
  Box, Grid, Card, Typography, Avatar, Chip, Stack,
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, IconButton, LinearProgress
} from "@mui/material";
import {
  People, School, Description, Assignment, CheckCircle, Warning,
  TrendingUp, ArrowForward, FileUpload, Assessment, FlashOn
} from "@mui/icons-material";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { HTTU_COLORS } from "../../../theme";

const enrollmentTrend = [
  { term: "2023/24", count: 2100 },
  { term: "2024/25 T1", count: 2450 },
  { term: "T2", count: 2680 },
  { term: "2025/26 T1", count: 2950 },
  { term: "T2", count: 3248 },
];

export default function RegistrarOverviewTab() {
  const topMetrics = [
    { label: "Active Students", value: "3,248", sub: "Across all programs", trend: "+4.2% vs last term", color: HTTU_COLORS.teal, icon: <People /> },
    { label: "Pending Admissions", value: "156", sub: "Applications to review", trend: "+12 this week", color: HTTU_COLORS.gold, icon: <Assignment /> },
    { label: "Enrollment Activity", value: "2,184", sub: "Course registrations", trend: "+8.6% vs last week", color: "#2563EB", icon: <School /> },
    { label: "Transcript Requests", value: "67", sub: "Awaiting processing", trend: "+5 this week", color: "#7C3AED", icon: <Description /> },
  ];

  const actionableQueue = [
    { label: "Record Updates", desc: "Student records pending editing review", count: 26, action: "Review Now", color: "#F59E0B" },
    { label: "Document Certification", desc: "Documents pending certification", count: 18, action: "Certify", color: HTTU_COLORS.teal },
    { label: "Transcript Requests", desc: "Transcript requests awaiting processing", count: 67, action: "Process", color: "#7C3AED" },
    { label: "Degree-Audit Exceptions", desc: "Exceptions require advisor review", count: 23, action: "Review", color: "#EF4444" },
  ];

  const recentActivity = [
    { initials: "DG", name: "Daniel Gebremariam", action: "Transcript requested", time: "10 min ago", color: HTTU_COLORS.teal },
    { initials: "HT", name: "Hana Tesfaye", action: "Record updated", time: "25 min ago", color: HTTU_COLORS.gold },
    { initials: "AM", name: "Abraham Mekonnen", action: "Application submitted", time: "1 hour ago", color: "#6366F1" },
    { initials: "SA", name: "Selamawit Assefa", action: "Document certified", time: "2 hours ago", color: "#10B981" },
    { initials: "MT", name: "Michael Tadesse", action: "Course registration completed", time: "3 hours ago", color: "#F97316" },
  ];

  return (
    <Box>
      {/* ── Top Header & Actions ── */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Registrar Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back, Registrar. Here's an overview of today's activity — Spring Semester 2025, Week 14 of 17.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<FileUpload />} size="small" sx={{ borderColor: "#CBD5E1", color: HTTU_COLORS.navy, fontWeight: 700 }}>
            Import records
          </Button>
          <Button variant="outlined" startIcon={<Assessment />} size="small" sx={{ borderColor: "#CBD5E1", color: HTTU_COLORS.navy, fontWeight: 700 }}>
            Generate report
          </Button>
          <Button variant="contained" startIcon={<FlashOn />} size="small" sx={{ bgcolor: HTTU_COLORS.gold, color: "#0E2033", fontWeight: 800, "&:hover": { bgcolor: HTTU_COLORS.goldLight } }}>
            Quick Actions
          </Button>
        </Stack>
      </Box>

      {/* ── 4 Top Metrics ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {topMetrics.map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {m.label}
                </Typography>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: `${m.color}15`, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {React.cloneElement(m.icon, { sx: { fontSize: 18 } })}
                </Box>
              </Box>
              <Typography variant="h3" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif", mb: 0.5 }}>
                {m.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {m.sub}
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: m.color, mt: 0.5, display: "block" }}>
                {m.trend}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Mid Row: Academic Term, Enrollment Trend, Graduation & Audit ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Academic Term */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Academic Term
              </Typography>
              <Chip label="In Progress" size="small" sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.68rem" }} />
            </Box>
            <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
              Spring Semester 2025
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
              Jan 20 – May 30, 2025 · Week 14 of 17
            </Typography>

            <Stack spacing={1.5}>
              {[
                { label: "Add / Drop Deadline", date: "Feb 14, 2025" },
                { label: "Midterm Exams", date: "Mar 10 – Mar 15, 2025" },
                { label: "Withdrawal Deadline", date: "Apr 18, 2025" },
                { label: "Final Exams", date: "May 19 – May 26, 2025" },
              ].map((d, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", pb: 1, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="caption" color="text.secondary">{d.label}</Typography>
                  <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.navy}>{d.date}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Enrollment Trend */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                  Enrollment Trend
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 5 semesters
                </Typography>
              </Box>
              <Chip label="3,248 Total" size="small" sx={{ bgcolor: "#F0FDFA", color: HTTU_COLORS.teal, fontWeight: 800 }} />
            </Box>

            <Box sx={{ height: 190, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="term" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1800, 3500]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke={HTTU_COLORS.teal} strokeWidth={3} dot={{ r: 4, fill: HTTU_COLORS.teal }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 2, p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                ℹ Total enrollments are up 12.4% compared to last semester.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Graduation Candidates & Exceptions */}
        <Grid item xs={12} md={3}>
          <Stack spacing={2.5} sx={{ height: "100%" }}>
            <Card sx={{ p: 2.5, borderRadius: 3, flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">Graduation Candidates</Typography>
                <Chip label="Spring 2025" size="small" sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.68rem" }} />
              </Box>
              <Typography variant="h3" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                78
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Eligible for graduation · Commencement Jun 14, 2025
              </Typography>
            </Card>

            <Card sx={{ p: 2.5, borderRadius: 3, flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">Degree-Audit Exceptions</Typography>
                <Chip label="Needs Review" size="small" sx={{ bgcolor: "#FEF2F2", color: "#EF4444", fontWeight: 700, fontSize: "0.68rem" }} />
              </Box>
              <Typography variant="h3" fontWeight={900} color="#DC2626" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                23
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                9 transfer-credit waivers · 14 course substitutions
              </Typography>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* ── Bottom Row: Actionable Queue & Recent Activity ── */}
      <Grid container spacing={3}>
        {/* Actionable Queue */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Actionable Queue
              </Typography>
              <Chip label="134 open items" size="small" sx={{ bgcolor: "#F1F5F9", fontWeight: 700 }} />
            </Box>

            <Stack spacing={1.5}>
              {actionableQueue.map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.8, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" fontWeight={900} sx={{ color: item.color }}>
                      {item.count}
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 1.5, borderColor: "#CBD5E1", color: HTTU_COLORS.navy, fontWeight: 700, fontSize: "0.75rem" }}>
                      {item.action}
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Recent Activity
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: HTTU_COLORS.teal, cursor: "pointer" }}>
                View All →
              </Typography>
            </Box>

            <Stack spacing={2}>
              {recentActivity.map((act, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: `${act.color}20`, color: act.color, fontWeight: 800, fontSize: "0.75rem" }}>
                      {act.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                        {act.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {act.action}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {act.time}
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
