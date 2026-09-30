import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Checkbox,
  FormControlLabel,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  Layers,
  People,
  Assignment,
  Notifications,
  AccessTime,
  CheckCircle,
  WarningAmber,
  ArrowForward,
  CloudUpload,
  Campaign,
  Grade,
  EventNote,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const HTTU_COLORS = {
  navy: "#0E2033",
  gold: "#D9A621",
  teal: "#12808C",
  canvas: "#F4F6F8",
  border: "#E2E8F0",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
};

export default function OverviewTab({ user, onSelectGradebook }) {
  const sections = [
    {
      code: "TH 201",
      title: "Systematic Theology I — Sec 01",
      schedule: "TTh 10:00–11:30 · Room 105 · 42 enrolled · 3 credits",
      progress: 47,
      week: "week 7 of 15",
      avg: "Class avg B · 4 below 2.0 · attendance 91%",
      badge: "Grades pending",
      badgeColor: "warning",
    },
    {
      code: "TH 201",
      title: "Systematic Theology I — Sec 02",
      schedule: "TTh 13:00–14:30 · Room 105 · 38 enrolled · 3 credits",
      progress: 53,
      week: "week 7 of 15",
      avg: "Class avg B+ · 1 below 2.0 · attendance 94%",
      badge: "Up to date",
      badgeColor: "success",
    },
    {
      code: "TH 320",
      title: "Christology — Sec 01",
      schedule: "MW 11:00–12:30 · Room 208 · 28 enrolled · 4 credits",
      progress: 44,
      week: "week 7 of 15",
      avg: "Class avg A- · 0 below 2.0 · attendance 89%",
      badge: "Up to date",
      badgeColor: "success",
    },
    {
      code: "PT 110",
      title: "Introduction to Ministry — Sec 01",
      schedule: "Fri 14:00–17:00 · Room 204 · 18 enrolled · 2 credits",
      progress: 40,
      week: "week 7 of 15",
      avg: "Class avg B- · 2 below 2.0 · attendance 82%",
      badge: "Midterm not entered",
      badgeColor: "danger",
    },
  ];

  const distributionData = [
    { grade: "F", count: 3, fill: "#EF4444" },
    { grade: "D", count: 5, fill: "#F97316" },
    { grade: "C", count: 9, fill: "#D9A621" },
    { grade: "B", count: 14, fill: "#12808C" },
    { grade: "A", count: 11, fill: "#10B981" },
  ];

  return (
    <Box>
      {/* ── Top Header Strip ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Welcome back, Dr. Alemeyahu
          </Typography>
          <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
            You teach 4 sections this semester · next class TH 201 at 10:00 in Room 105 · Wed Mar 5, 2025
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="outlined" startIcon={<EventNote />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            Take attendance
          </Button>
          <Button variant="outlined" startIcon={<Campaign />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            Post announcement
          </Button>
          <Button
            variant="contained"
            onClick={onSelectGradebook}
            sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}
          >
            Submit grades
          </Button>
        </Box>
      </Box>

      {/* ── 4 Stat Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                <Layers sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>MY COURSES</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>4</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              TH 201 ×2 · TH 320 · PT 110
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.teal} sx={{ display: "block", mt: 0.5 }}>
              → 24 contact hours / week
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(14, 32, 51, 0.1)", color: HTTU_COLORS.navy }}>
                <People sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>STUDENTS TAUGHT</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>126</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              Unique: 98 · 12 advisees
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
              ↑ Attendance avg 88%
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316" }}>
                <Grade sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>GRADES TO SUBMIT</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>2</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              Quiz 2 (TH 201) · Midterm (PT 110)
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
              ↓ Deadline Mar 28, 2025
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                <Notifications sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>UNREAD MESSAGES</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>7</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              4 students · 2 dept · 1 registrar
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.warning} sx={{ display: "block", mt: 0.5 }}>
              ↑ Oldest unanswered 2 days
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ── Main Dashboard Layout ── */}
      <Grid container spacing={3}>
        {/* Left Column (Sections, Grade Distribution, Tasks, Materials) */}
        <Grid item xs={12} lg={8}>
          {/* My Sections Card Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={800} color={HTTU_COLORS.navy}>
              My Sections
            </Typography>
            <Chip label="Spring Semester 2025" size="small" sx={{ bgcolor: "#E2E8F0", fontWeight: 700 }} />
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {sections.map((sec, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: "rgba(18, 128, 140, 0.12)",
                          color: HTTU_COLORS.teal,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                      >
                        {sec.code}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                          {sec.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={sec.badge}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        bgcolor:
                          sec.badgeColor === "success"
                            ? "rgba(16, 185, 129, 0.12)"
                            : sec.badgeColor === "warning"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(239, 68, 68, 0.12)",
                        color:
                          sec.badgeColor === "success"
                            ? HTTU_COLORS.success
                            : sec.badgeColor === "warning"
                            ? "#B48316"
                            : HTTU_COLORS.danger,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mb: 2 }}>
                    {sec.schedule}
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={600} color={HTTU_COLORS.textSecondary}>Syllabus progress</Typography>
                      <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.navy}>{sec.progress}% · {sec.week}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={sec.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#EDF2F7",
                        "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal },
                      }}
                    />
                  </Box>

                  <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ fontWeight: 600 }}>
                    {sec.avg}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Grade Distribution & My Tasks Row */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    Grade Distribution — TH 201 Sec 01
                  </Typography>
                  <Chip label="Current average" size="small" sx={{ fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <RechartsTooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 1.5, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
                  <Typography variant="caption" color="text.secondary">Class average: <b>2.94</b></Typography>
                  <Typography variant="caption" color="text.secondary">Highest: <b>3.92</b></Typography>
                  <Typography variant="caption" color="error.main">Below 2.0: <b>4</b></Typography>
                  <Typography variant="caption" color="text.secondary">Graded: <b>42 / 42</b></Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                    My Tasks
                  </Typography>
                  <Chip label="5 open" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700, fontSize: "0.68rem" }} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>Enter Midterm grades — PT 110</Typography>
                      <Typography variant="caption" color="text.secondary">Due Mar 28 · 18 students · draft not started</Typography>
                    </Box>
                    <Button size="small" variant="contained" sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", fontSize: "0.75rem" }}>
                      Enter
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>Submit Quiz 2 — TH 201 Sec 01</Typography>
                      <Typography variant="caption" color="text.secondary">Weight 10% · 38 of 42 marked</Typography>
                    </Box>
                    <Button size="small" variant="contained" onClick={onSelectGradebook} sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", fontSize: "0.75rem" }}>
                      Submit
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: `1px solid ${HTTU_COLORS.border}` }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>Approve 2 leave-of-absence letters</Typography>
                      <Typography variant="caption" color="text.secondary">Dept. Head referral · students HTTU23117, HTTU24002</Typography>
                    </Box>
                    <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: HTTU_COLORS.border }}>
                      Review
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle sx={{ color: HTTU_COLORS.success, fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">Upload Lecture 14 slides (Done)</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle sx={{ color: HTTU_COLORS.success, fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">Post Quiz 1 feedback (Done)</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Course Materials & e-Learning */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Course Materials & e-Learning
              </Typography>
              <Button size="small" variant="outlined" startIcon={<CloudUpload />} sx={{ textTransform: "none", fontWeight: 700, borderColor: HTTU_COLORS.border }}>
                Upload material
              </Button>
            </Box>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>TITLE</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>COURSE</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>TYPE</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>UPLOADED</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>VIEWS</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { title: "Lecture 14 — Trinity in the Cappadocian Fathers", file: "slides.pdf · 2.4 MB", course: "TH 201 Sec 01/02", type: "Slides", date: "Mar 4, 2025", views: 64, status: "Published" },
                  { title: "Quiz 2 — Christological Controversies", file: "45 min · 20 marks · single attempt", course: "TH 201 Sec 01", type: "Assessment", date: "Mar 5, 2025", views: 38, status: "Open until Mar 9" },
                  { title: "Reading pack — Mysterium Christi (chs 3–5)", file: "readings.pdf · 6.1 MB · library reserve copy", course: "TH 320", type: "Reading", date: "Feb 26, 2025", views: 22, status: "Published" },
                  { title: "Midterm exam paper — draft", file: "Needs moderator review before release", course: "PT 110", type: "Assessment", date: "Mar 2, 2025", views: "—", status: "Draft" },
                  { title: "Amharic glossary of theological terms", file: "glossary-am.docx · open access", course: "All sections", type: "Reference", date: "Jan 28, 2025", views: 218, status: "Published" },
                ].map((mat, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{mat.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{mat.file}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{mat.course}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{mat.type}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{mat.date}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{mat.views}</TableCell>
                    <TableCell>
                      <Chip
                        label={mat.status}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: mat.status === "Published" ? "rgba(16, 185, 129, 0.12)" : mat.status === "Draft" ? "#F1F5F9" : "rgba(18, 128, 140, 0.15)",
                          color: mat.status === "Published" ? HTTU_COLORS.success : mat.status === "Draft" ? "#64748B" : HTTU_COLORS.teal,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* Right Column (Today's Schedule, Students Needing Attention, Messages) */}
        <Grid item xs={12} lg={4}>
          {/* Today Schedule Card */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Today · Wed Mar 5
              </Typography>
              <Chip label="Full timetable →" size="small" sx={{ fontSize: "0.68rem", cursor: "pointer" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { time: "08:00", title: "Advising hours", desc: "Office 3.12 · 3 advisees booked" },
                { time: "10:00", title: "TH 201 Sec 01 — Room 105", desc: "Lecture 14: Trinity in the Fathers · Quiz 2 due" },
                { time: "11:00", title: "Department meeting prep", desc: "Curriculum revision draft for Dean review" },
                { time: "13:00", title: "TH 201 Sec 02 — Room 105", desc: "Lecture 14: Trinity in the Fathers" },
                { time: "15:00", title: "Thesis supervision — Meron Tadesse", desc: "M.A. Systematic Theology · chapter 2 draft" },
                { time: "16:30", title: "Research block", desc: "Ge'ez manuscript project · ethics clearance pending" },
              ].map((sch, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "flex-start", pb: 1, borderBottom: idx < 5 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Typography variant="caption" fontWeight={800} sx={{ width: 44, color: HTTU_COLORS.teal }}>
                    {sch.time}
                  </Typography>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>
                      {sch.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sch.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Students Needing Attention */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Students Needing Attention
              </Typography>
              <Chip label="All 8 →" size="small" sx={{ fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { name: "Hanna Mengistu · HTTU22041", note: "TH 201 Sec 01 · 1.62 avg · 3 unexcused absences", status: "At risk", color: "danger" },
                { name: "Thomas Belete · HTTU23117", note: "TH 201 Sec 02 · 1.84 avg · no midterm submission", status: "At risk", color: "danger" },
                { name: "Sara Getachew · HTTU24002", note: "PT 110 · 2.10 avg · attendance 71%", status: "Watch", color: "warning" },
                { name: "Yared Alemu · HTTU23090", note: "TH 320 · missed 2 assignments · extension granted", status: "Watch", color: "warning" },
              ].map((stu, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 3 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{stu.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{stu.note}</Typography>
                  </Box>
                  <Chip
                    label={stu.status}
                    size="small"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      bgcolor: stu.color === "danger" ? "rgba(239, 68, 68, 0.12)" : "rgba(245, 158, 11, 0.15)",
                      color: stu.color === "danger" ? HTTU_COLORS.danger : "#B48316",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Messages */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Messages
              </Typography>
              <Chip label="7 unread" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700, fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { sender: "Hanna Mengistu", text: "Request to retake Quiz 2 — medical certificate attached", time: "2 h" },
                { sender: "Dr. Sofia Assefa (Dept. Head)", text: "Reminder: curriculum revision draft due Mar 14", time: "5 h" },
                { sender: "Meskerem Abebe (Registrar)", text: "Room change approved for TH 320 from Mar 10", time: "1 d" },
                { sender: "Yared Alemu", text: "Question about extension on Assignment 3", time: "1 d" },
                { sender: "Hanna Bekele (HR)", text: "Annual performance review form ready for sign-off", time: "2 d" },
              ].map((msg, idx) => (
                <Box key={idx} sx={{ pb: 1, borderBottom: idx < 4 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{msg.sender}</Typography>
                    <Typography variant="caption" color="text.secondary">{msg.time}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2 }}>
                    {msg.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
