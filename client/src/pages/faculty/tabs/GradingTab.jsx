import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  CloudUpload,
  Save,
  CheckCircle,
  WarningAmber,
  Add,
  ArrowForward,
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

export default function GradingTab() {
  const [submitted, setSubmitted] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const roster = [
    { name: "Abeba Tesfaye", id: "HTTU24101", assign: 37, mid: 27, final: 28, total: 92, letter: "A", remark: "Excellent" },
    { name: "Bereket Alemu", id: "HTTU24102", assign: 34, mid: 25, final: 26, total: 85, letter: "A-", remark: "—" },
    { name: "Selamawit Yohannes", id: "HTTU24103", assign: 31, mid: 24, final: 24, total: 79, letter: "B+", remark: "—" },
    { name: "Mekdes Abate", id: "HTTU24104", assign: 29, mid: 22, final: 23, total: 74, letter: "B", remark: "—" },
    { name: "Dawit Fekadu", id: "HTTU24105", assign: 26, mid: 19, final: 20, total: 65, letter: "C+", remark: "Attendance warning", warn: true },
    { name: "Hirut Mengesha", id: "HTTU24106", assign: 24, mid: 17, final: 18, total: 59, letter: "C", remark: "—" },
    { name: "Robel Hailu", id: "HTTU24107", assign: 18, mid: 12, final: "—", total: "—", letter: "I", remark: "Incomplete — final missed", incomplete: true },
  ];

  const distribution = [
    { grade: "A", count: 5, fill: "#12808C" },
    { grade: "B", count: 10, fill: "#10B981" },
    { grade: "C", count: 8, fill: "#D9A621" },
    { grade: "D", count: 2, fill: "#F97316" },
    { grade: "F", count: 0, fill: "#EF4444" },
  ];

  const assessments = [
    { title: "Exegetical Paper", detail: "Due Mar 12, 2025 · 20 pts", graded: "25/25 graded", full: true },
    { title: "Midterm Examination", detail: "Mar 10, 2025 · 30 pts", graded: "25/25 graded", full: true },
    { title: "Quizzes (4)", detail: "Weekly · 20 pts", graded: "25/25 graded", full: true },
    { title: "Final Examination", detail: "May 19, 2025 · 30 pts", graded: "24/25 graded", full: false },
  ];

  return (
    <Box>
      {/* ── Breadcrumb ── */}
      <Breadcrumbs sx={{ mb: 1.5, fontSize: "0.82rem" }}>
        <Typography color="text.secondary">Academic</Typography>
        <Typography color="text.secondary">My Courses</Typography>
        <Typography color="text.primary" fontWeight={700}>TH 201 — Systematic Theology I · Section 01</Typography>
      </Breadcrumbs>

      {/* ── Header Strip ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Gradebook — TH 201 Section 01
          </Typography>
          <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
            Spring Semester 2025 · Dr. Alemeyahu Worku · Grades become visible to students only after publication.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}
          >
            Import scores
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSaveToast(true)}
            sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            onClick={() => setSubmitted(true)}
            startIcon={<CheckCircle />}
            sx={{
              bgcolor: HTTU_COLORS.gold,
              color: HTTU_COLORS.navy,
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#c4951d" },
            }}
          >
            {submitted ? "Submitted to Dept Head" : "Submit for Approval"}
          </Button>
        </Box>
      </Box>

      {saveToast && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setSaveToast(false)}>
          Draft saved successfully. Scores will remain private until submitted.
        </Alert>
      )}

      {submitted && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSubmitted(false)}>
          Grade roster for TH 201 Section 01 successfully submitted to Dr. Sofia Assefa (Department Head) for review.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Class Roster Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, overflow: "hidden" }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Class Roster (25)
              </Typography>
              <Chip
                label={submitted ? "Pending Dept Approval" : "Draft — not published"}
                size="small"
                sx={{
                  bgcolor: submitted ? "rgba(18, 128, 140, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: submitted ? HTTU_COLORS.teal : "#B48316",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>

            <Table size="small">
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>STUDENT</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>ID</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>ASSIGNMENTS<br />(40)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>MIDTERM<br />(30)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>FINAL<br />(30)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "0.75rem", color: HTTU_COLORS.navy }}>TOTAL</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "0.75rem", color: HTTU_COLORS.navy }}>LETTER</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: HTTU_COLORS.textSecondary }}>REMARKS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roster.map((row, idx) => (
                  <TableRow key={idx} hover sx={{ bgcolor: row.incomplete ? "rgba(245, 158, 11, 0.04)" : "transparent" }}>
                    <TableCell sx={{ fontWeight: 700, color: HTTU_COLORS.navy }}>{row.name}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: HTTU_COLORS.textSecondary }}>{row.id}</TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.85rem" }}>{row.assign}</TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.85rem" }}>{row.mid}</TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.85rem" }}>{row.final}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, fontSize: "0.9rem", color: HTTU_COLORS.navy }}>{row.total}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.letter}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          minWidth: 32,
                          bgcolor:
                            row.letter.startsWith("A")
                              ? "rgba(16, 185, 129, 0.15)"
                              : row.letter.startsWith("B")
                              ? "rgba(18, 128, 140, 0.15)"
                              : row.letter.startsWith("C")
                              ? "rgba(245, 158, 11, 0.15)"
                              : "#F1F5F9",
                          color:
                            row.letter.startsWith("A")
                              ? HTTU_COLORS.success
                              : row.letter.startsWith("B")
                              ? HTTU_COLORS.teal
                              : row.letter.startsWith("C")
                              ? "#B48316"
                              : "#64748B",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", color: row.warn ? HTTU_COLORS.warning : row.incomplete ? HTTU_COLORS.danger : "text.secondary" }}>
                      {row.remark}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ p: 2, textAlign: "center", bgcolor: "#FAFAFA", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
              <Typography variant="caption" color="text.secondary">
                ... 18 more students
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderTop: `1px solid ${HTTU_COLORS.border}` }}>
              <Typography variant="caption" color="text.secondary">
                ⏱ Submission workflow: <b>Submitted</b> → <b>Approved (Dept Head)</b> → <b>Finalized</b>. Grade changes after finalization require a Grade Change Request.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Grade Distribution, Assessment Columns, Pending Alert */}
        <Grid item xs={12} lg={4}>
          {/* Grade Distribution */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 2 }}>
              Grade Distribution
            </Typography>
            <Box sx={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2, pt: 1.5, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>25</Typography>
                <Typography variant="caption" color="text.secondary">Total students</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.teal}>3.20</Typography>
                <Typography variant="caption" color="text.secondary">Average GPA</Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.success}>96%</Typography>
                <Typography variant="caption" color="text.secondary">Pass rate</Typography>
              </Box>
            </Box>
          </Card>

          {/* Assessment Columns */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Assessment Columns
              </Typography>
              <Button size="small" startIcon={<Add />} sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {assessments.map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 3 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.detail}</Typography>
                  </Box>
                  <Chip
                    label={item.graded}
                    size="small"
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: item.full ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.15)",
                      color: item.full ? HTTU_COLORS.success : "#B48316",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Warning box */}
          <Card sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)", display: "flex", gap: 1.5 }}>
            <WarningAmber sx={{ color: "#B48316", fontSize: 22, mt: 0.2 }} />
            <Box>
              <Typography variant="caption" fontWeight={700} color="#B48316">
                1 grade pending.
              </Typography>
              <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.3 }}>
                Robel Hailu is marked Incomplete. Submitting now will publish 24 of 25 grades.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
