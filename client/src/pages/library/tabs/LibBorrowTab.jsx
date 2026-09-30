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
  TextField,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  QrCodeScanner,
  LocalAtm,
  WarningAmber,
  CheckCircle,
  Print,
  Bookmark,
  AssignmentTurnedIn,
  Add,
  Download,
} from "@mui/icons-material";

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

export default function LibBorrowTab() {
  const [confirmed, setConfirmed] = useState(false);

  const activeLoans = [
    { title: "The Doctrine of the Trinity", isbn: "ISBN 978-1-8573-2214-6", callNo: "GST 1142.4", patron: "Daniel Gebremariam", id: "HTTU24158", type: "Student", borrowed: "Mar 5", due: "Mar 19", renewals: "0 / 2", status: "On loan" },
    { title: "Introduction to the Old Testament", isbn: "Amharic edition · 2019", callNo: "OT 210.5", patron: "Sara Getachew", id: "HTTU24002", type: "Student", borrowed: "Feb 24", due: "Mar 10", renewals: "1 / 2", status: "Due in 5 days" },
    { title: "Church Fathers: An Anthology", isbn: "", callNo: "CH 301.2", patron: "Dr. Alemeyahu Worku", id: "EMP-2026-000042", type: "Faculty", borrowed: "Feb 12", due: "Mar 14", renewals: "0 / 2", status: "On loan" },
    { title: "Pastoral Counselling in Context", isbn: "", callNo: "PT 220.8", patron: "Hanna Mengistu", id: "HTTU22041", type: "Student", borrowed: "Feb 10", due: "Feb 24", renewals: "2 / 2", status: "Overdue · 9 d · ETB 18" },
    { title: "Ge'ez Psalter (facsimile)", isbn: "Reading room only · not for loan", callNo: "MS 0042", patron: "Dr. Sofia Assefa", id: "EMP-2026-000031", type: "Faculty", borrowed: "Mar 3", due: "Mar 6", renewals: "—", status: "Supervised use" },
    { title: "Ethiopian Church History, Vol. II", isbn: "", callNo: "CH 205.1", patron: "Meron Haile", id: "HTTU24090", type: "Student", borrowed: "Feb 28", due: "Mar 14", renewals: "0 / 2", status: "Reserved by 1" },
  ];

  const recentDeskEvents = [
    { time: "09:42", action: "Check-out", item: "The Doctrine of the Trinity", patron: "Daniel Gebremariam · HTTU24158", result: "Due Mar 19", resColor: "teal" },
    { time: "09:31", action: "Return", item: "Introduction to the Old Testament", patron: "Sara Getachew · HTTU24002", result: "No fine", resColor: "success" },
    { time: "09:18", action: "Renewal", item: "Church Fathers: An Anthology", patron: "Dr. Alemeyahu Worku", result: "2nd of 2", resColor: "info" },
    { time: "08:56", action: "Fine payment", item: "Overdue 9 days · ETB 18", patron: "Hanna Mengistu · HTTU22041", result: "telebirr", resColor: "teal" },
    { time: "08:40", action: "Hold release", item: "Biblical Hermeneutics, 4th ed.", patron: "Meron Tadesse · HTTU21088", result: "Collected", resColor: "teal" },
  ];

  return (
    <Box>
      {/* ── Top Header Strip ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Circulation Desk
          </Typography>
          <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
            Check-out, returns, renewals, holds and fines · Wed Mar 5, 2025
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Chip label="Desk open · 08:00–20:00" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            End-of-day report
          </Button>
          <Button variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            Return item
          </Button>
          <Button variant="contained" sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}>
            Check out
          </Button>
        </Box>
      </Box>

      {/* ── 4 Stat HUD Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                <Bookmark sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>ITEMS ON LOAN</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>412</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              318 students · 71 faculty · 23 staff
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
              ↑ +18 today
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: HTTU_COLORS.danger }}>
                <WarningAmber sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>OVERDUE</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>37</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              ETB 1,884 fines accruing · 2 ETB/day
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
              ↑ +5 since Monday
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                <AssignmentTurnedIn sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>HOLDS QUEUE</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>18</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              6 ready for collection · 3 expiring
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              ↑ Longest wait 12 days
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.1)", color: HTTU_COLORS.success }}>
                <LocalAtm sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>FINES COLLECTED (MAR)</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>2,340</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              ETB · 96 transactions
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
              ↑ 4 accounts suspended &gt; 200 ETB
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ── Main Section: Check Out to Patron & Side Panels ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Column: Check Out to Patron + Activity Log */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Check Out to Patron
              </Typography>
              <Chip label="• Barcode reader ready" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", color: HTTU_COLORS.success, fontWeight: 700, fontSize: "0.7rem" }} />
            </Box>

            {/* Scanned Item Banner */}
            <Box sx={{ p: 2, bgcolor: HTTU_COLORS.navy, color: "white", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <QrCodeScanner sx={{ color: HTTU_COLORS.gold, fontSize: 28 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>Scanned item</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>The Doctrine of the Trinity · GST 1142.4</Typography>
                </Box>
              </Box>
              <Typography variant="body2" fontWeight={700} sx={{ color: HTTU_COLORS.gold }}>
                978-1-8573-2214-6
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Patron</Typography>
                <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                  Daniel Gebremariam — HTTU24158 · Student · Year 3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  3 of 5 items on loan · no outstanding fines · account active
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Loan period</Typography>
                <Typography variant="body2" fontWeight={800} color={HTTU_COLORS.navy}>
                  14 days · due Wed Mar 19, 2025
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Student policy · renewable twice if not reserved
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Item barcode / call number</Typography>
                <Typography variant="body2" fontWeight={600}>HTTU-BK-014882 · GST 1142.4</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Branch / shelf</Typography>
                <Typography variant="body2" fontWeight={600}>Main Library · Floor 2 · Systematic Theology</Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={() => setConfirmed(true)}
                sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}
              >
                Confirm check-out
              </Button>
              <Button variant="outlined" startIcon={<Add />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Add another item
              </Button>
              <Button variant="outlined" startIcon={<Print />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
                Print receipt
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                Today: 41 check-outs · 29 returns · 6 renewals
              </Typography>
            </Box>

            {confirmed && (
              <Alert severity="success" sx={{ mt: 2 }} onClose={() => setConfirmed(false)}>
                Check-out confirmed! Due date: Mar 19, 2025. Receipt sent to daniel.g@httu.edu.et.
              </Alert>
            )}

            {/* Desk Activity Feed */}
            <Box sx={{ mt: 3, pt: 2.5, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>TIME</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>ACTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>ITEM</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>PATRON</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDeskEvents.map((evt, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{evt.time}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{evt.action}</TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>{evt.item}</TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>{evt.patron}</TableCell>
                      <TableCell align="right">
                        <Chip label={evt.result} size="small" sx={{ fontSize: "0.65rem", height: 20 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>

          {/* Active Loans Table */}
          <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Active Loans
              </Typography>
              <Chip label="All patrons ▾" size="small" sx={{ fontSize: "0.72rem" }} />
            </Box>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ITEM</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>CALL NO.</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>PATRON</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>TYPE</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>BORROWED</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>DUE</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>RENEWALS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeLoans.map((l, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{l.title}</Typography>
                      {l.isbn && <Typography variant="caption" color="text.secondary">{l.isbn}</Typography>}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{l.callNo}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{l.patron}</Typography>
                      <Typography variant="caption" color="text.secondary">{l.id}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{l.type}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{l.borrowed}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", fontWeight: 700 }}>{l.due}</TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.8rem" }}>{l.renewals}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={l.status}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: l.status.includes("Overdue") ? "rgba(239, 68, 68, 0.12)" : l.status.includes("Due in") ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.12)",
                          color: l.status.includes("Overdue") ? HTTU_COLORS.danger : l.status.includes("Due in") ? "#B48316" : HTTU_COLORS.success,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* Right Column: Loan Policy, Overdue & Suspensions, Queue */}
        <Grid item xs={12} lg={4}>
          {/* Loan Policy */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Loan Policy
              </Typography>
              <Typography variant="caption" color={HTTU_COLORS.teal} fontWeight={700} sx={{ cursor: "pointer" }}>Edit →</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Student</Typography>
                  <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>14 d</Typography>
                  <Typography variant="caption" color="text.secondary">5 items · 14 days</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Faculty</Typography>
                  <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>30 d</Typography>
                  <Typography variant="caption" color="text.secondary">10 items · 30 days</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Staff</Typography>
                  <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>21 d</Typography>
                  <Typography variant="caption" color="text.secondary">5 items · 21 days</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">External borrower</Typography>
                  <Typography variant="h5" fontWeight={900} color={HTTU_COLORS.navy}>7 d</Typography>
                  <Typography variant="caption" color="text.secondary">3 items · 7 days</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, borderTop: `1px solid ${HTTU_COLORS.border}`, pt: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Renewals</Typography><Typography variant="caption" fontWeight={700}>2 per item, if unreserved</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Overdue fine</Typography><Typography variant="caption" fontWeight={700}>ETB 2 per item per day</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Suspension</Typography><Typography variant="caption" fontWeight={700} color="error.main">Fines above ETB 200</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="caption" color="text.secondary">Manuscripts</Typography><Typography variant="caption" fontWeight={700}>Reading room, supervised</Typography></Box>
            </Box>
          </Card>

          {/* Overdue & Suspensions */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Overdue & Suspensions
              </Typography>
              <Chip label="37 items" size="small" sx={{ bgcolor: "rgba(239, 68, 68, 0.12)", color: HTTU_COLORS.danger, fontWeight: 700, fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { name: "Hanna Mengistu", detail: "9 days · ETB 18 · reminder sent ×2", status: "Notify" },
                { name: "Thomas Belete", detail: "24 days · ETB 216 · account suspended", status: "Blocked", blocked: true },
                { name: "Yared Alemu", detail: "4 days · ETB 8 · renewal not permitted", status: "Notify" },
                { name: "Kalkidan Fikru", detail: "2 days · ETB 4 · item recalled", status: "Notify" },
              ].map((ov, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: idx < 3 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{ov.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{ov.detail}</Typography>
                  </Box>
                  <Chip
                    label={ov.status}
                    size="small"
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: ov.blocked ? "rgba(239, 68, 68, 0.15)" : "#F1F5F9",
                      color: ov.blocked ? HTTU_COLORS.danger : HTTU_COLORS.navy,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          {/* Collection by Category */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Collection by Category
              </Typography>
              <Chip label="18,420 titles ▾" size="small" sx={{ fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {[
                { name: "Biblical Studies", count: "4,860", val: 80, col: HTTU_COLORS.teal },
                { name: "Systematic Theology", count: "3,790", val: 65, col: "#3B82F6" },
                { name: "Church History", count: "2,840", val: 50, col: "#8B5CF6" },
                { name: "Practical Theology", count: "2,180", val: 40, col: HTTU_COLORS.gold },
                { name: "Ge'ez & languages", count: "1,060", val: 20, col: "#F97316" },
                { name: "Manuscripts (digital)", count: "412", val: 10, col: HTTU_COLORS.success },
              ].map((c, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                    <Typography variant="caption" fontWeight={600}>{c.name}</Typography>
                    <Typography variant="caption" fontWeight={800}>{c.count}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={c.val} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: c.col } }} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
