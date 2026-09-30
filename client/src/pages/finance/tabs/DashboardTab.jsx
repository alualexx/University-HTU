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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  AccountBalance,
  Receipt,
  TrendingUp,
  WarningAmber,
  Download,
  CheckCircle,
  Close,
  CreditCard,
  PhoneAndroid,
  LocalAtm,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
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

export default function DashboardTab() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const monthlyCollections = [
    { month: "Sep", tuition: 2.2, fees: 0.5, other: 0.1, billed: 3.5 },
    { month: "Oct", tuition: 2.8, fees: 0.4, other: 0.1, billed: 4.0 },
    { month: "Nov", tuition: 2.9, fees: 0.6, other: 0.2, billed: 4.1 },
    { month: "Dec", tuition: 2.7, fees: 0.5, other: 0.2, billed: 3.8 },
    { month: "Jan", tuition: 3.6, fees: 0.8, other: 0.2, billed: 4.8 },
    { month: "Feb", tuition: 3.1, fees: 0.6, other: 0.1, billed: 4.2 },
  ];

  const invoiceStatusData = [
    { name: "Paid", value: 1718, color: "#10B981" },
    { name: "Partial", value: 529, color: "#12808C" },
    { name: "Sent", value: 396, color: "#3B82F6" },
    { name: "Overdue", value: 431, color: "#EF4444" },
    { name: "Draft / cancelled", value: 230, color: "#94A3B8" },
  ];

  const recentPayments = [
    { receipt: "RCP-2025-00618", payer: "Abeba Tesfaye", id: "HTTU-2026-0001", invoice: "INV-2025-01148", method: "telebirr", date: "Mar 5 · 09:31", amount: "2,230.00", status: "Posted" },
    { receipt: "RCP-2025-00617", payer: "Daniel Gebremariam", id: "HTTU24158", invoice: "INV-2025-01131", method: "Bank transfer", date: "Mar 5 · 09:12", amount: "4,850.00", status: "Posted" },
    { receipt: "RCP-2025-00616", payer: "Meron Haile", id: "HTTU24090", invoice: "INV-2025-01102", method: "CBE Birr", date: "Mar 5 · 08:47", amount: "7,770.00", status: "Awaiting reconcile" },
    { receipt: "RCP-2025-00615", payer: "Kalkidan Fikru", id: "HTTU23244", invoice: "INV-2025-01098", method: "Cash", date: "Mar 4 · 16:20", amount: "1,500.00", status: "Posted" },
    { receipt: "RCP-2025-00614", payer: "Yared Alemu", id: "HTTU23090", invoice: "INV-2025-01076", method: "M-Pesa", date: "Mar 4 · 14:05", amount: "3,200.00", status: "Posted" },
    { receipt: "RCP-2025-00613", payer: "St. Michael Parish", id: "—", invoice: "—", method: "Cheque", date: "Mar 4 · 11:38", amount: "50,000.00", status: "Cheque pending" },
  ];

  const pendingDecisions = [
    { req: "Late-fee waiver — Hanna Mengistu", by: "Student · HTTU22041", amt: "1,845.00", status: "Officer review" },
    { req: "Refund — duplicate telebirr charge", by: "System · auto-detected", amt: "3,200.00", status: "Urgent" },
    { req: "Installment plan — 4 terms", by: "Thomas Belete · HTTU23117", amt: "12,400.00", status: "Officer review" },
    { req: "Scholarship disbursement — clergy dependants", by: "Dean's office", amt: "216,000.00", status: "Approved · to post" },
    { req: "Library fine write-off — damaged returns", by: "Librarian", amt: "4,120.00", status: "Queued" },
  ];

  const reconciliationData = [
    { item: "Merit scholarship (GPA ≥ 3.75)", beneficiaries: "64 students", committed: "1,280,000", disbursed: "768,000", status: "On track" },
    { item: "Clergy & dependant waiver", beneficiaries: "38 students", committed: "684,000", disbursed: "468,000", status: "On track" },
    { item: "Hardship / emergency fund", beneficiaries: "22 students", committed: "330,000", disbursed: "291,500", status: "88% used" },
    { item: "Staff tuition benefit", beneficiaries: "11 staff", committed: "198,000", disbursed: "132,000", status: "On track" },
    { item: "Bank reconciliation — CBE 1000...4471", beneficiaries: "—", committed: "18,420,318", disbursed: "18,420,318", status: "Balanced" },
    { item: "telebirr merchant settlement", beneficiaries: "—", committed: "4,973,600", disbursed: "4,886,120", status: "ETB 87K in transit" },
    { item: "Petty cash float — bursar desk", beneficiaries: "—", committed: "50,000", disbursed: "48,340", status: "Counted Mar 4" },
  ];

  return (
    <Box>
      {/* ── Top Header Strip ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Finance Dashboard
          </Typography>
          <Typography variant="body2" color={HTTU_COLORS.textSecondary} sx={{ mt: 0.5 }}>
            All amounts in Ethiopian Birr (ETB) · term Jan 20 – May 30, 2025 · Wed Mar 5, 2025
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Chip label="FY 2024/25 · Spring Semester" size="small" sx={{ bgcolor: "rgba(18, 128, 140, 0.12)", color: HTTU_COLORS.teal, fontWeight: 700 }} />
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            Export ledger
          </Button>
          <Button variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, textTransform: "none", fontWeight: 700 }}>
            Reconcile bank
          </Button>
          <Button variant="contained" sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#c4951d" } }}>
            Record payment
          </Button>
        </Box>
      </Box>

      {/* ── 4 Stat HUD Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(16, 185, 129, 0.1)", color: HTTU_COLORS.success }}>
                <AccountBalance sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>COLLECTED THIS TERM</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>18.42M</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              ETB · 2,684 receipts posted
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
              ↑ +9.3% vs Fall 2024
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.1)", color: HTTU_COLORS.danger }}>
                <Receipt sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>OUTSTANDING BALANCE</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>4.26M</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              ETB · 318 overdue invoices
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.danger} sx={{ display: "block", mt: 0.5 }}>
              ↑ +0.41M in 30 days
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(18, 128, 140, 0.1)", color: HTTU_COLORS.teal }}>
                <TrendingUp sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>COLLECTION RATE</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>81.2%</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              of ETB 22.68M billed this term
            </Typography>
            <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.success} sx={{ display: "block", mt: 0.5 }}>
              ↑ Target 78% · met
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316" }}>
                <WarningAmber sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="caption" fontWeight={700} color={HTTU_COLORS.textSecondary}>LATE FEES CHARGED</Typography>
            </Box>
            <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.navy}>214K</Typography>
            <Typography variant="caption" color={HTTU_COLORS.textSecondary} sx={{ display: "block", mt: 0.5 }}>
              ETB · 5% per month on overdue
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              — 46 waiver requests pending
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ── Main Section: Collections vs Billed & Right Metrics ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Column: Monthly Collections vs Billed */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Monthly Collections vs Billed
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.teal }} /> Tuition
                </Typography>
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: HTTU_COLORS.gold }} /> Fees
                </Typography>
                <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#6366F1" }} /> Other income
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCollections}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="tuition" stackId="a" fill={HTTU_COLORS.teal} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="fees" stackId="a" fill={HTTU_COLORS.gold} />
                  <Bar dataKey="other" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: `1px solid ${HTTU_COLORS.border}`, textAlign: "center" }}>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Tuition collected</Typography>
                <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>ETB 14.86M</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Fees collected</Typography>
                <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>ETB 2.71M</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Other income</Typography>
                <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.navy}>ETB 0.85M</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Late fees & fines</Typography>
                <Typography variant="subtitle1" fontWeight={900} color={HTTU_COLORS.danger}>ETB 0.24M</Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column: Invoice Status & Aging */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Invoice Status
              </Typography>
              <Chip label="This term ▾" size="small" sx={{ fontSize: "0.68rem" }} />
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <Box sx={{ position: "relative", width: 110, height: 110, mx: "auto" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={invoiceStatusData} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>3,304</Typography>
                    <Typography variant="caption" sx={{ fontSize: "0.6rem", color: "text.secondary", display: "block", mt: -0.5 }}>invoices</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={7}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {invoiceStatusData.map((item, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, color: HTTU_COLORS.textSecondary }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: item.color }} /> {item.name}
                      </Typography>
                      <Typography variant="caption" fontWeight={800}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Receivables Aging */}
            <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${HTTU_COLORS.border}` }}>
              <Typography variant="caption" fontWeight={800} color={HTTU_COLORS.navy} sx={{ display: "block", mb: 1 }}>
                Receivables aging
              </Typography>
              {[
                { range: "0–30 days", amt: "1.96M", count: 184, color: HTTU_COLORS.teal, val: 80 },
                { range: "31–60 days", amt: "1.24M", count: 88, color: HTTU_COLORS.gold, val: 50 },
                { range: "61–90 days", amt: "0.72M", count: 34, color: "#F97316", val: 30 },
                { range: "> 90 days", amt: "0.34M", count: 12, color: HTTU_COLORS.danger, val: 15 },
              ].map((ag, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.2 }}>
                    <Typography variant="caption" color="text.secondary">{ag.range}</Typography>
                    <Typography variant="caption" fontWeight={800}>{ag.amt} · <span style={{ color: "#94A3B8" }}>{ag.count}</span></Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={ag.val} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: ag.color } }} />
                </Box>
              ))}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic", fontSize: "0.68rem" }}>
                Registration holds auto-apply above ETB 5,000 overdue · 214 students affected
              </Typography>
            </Box>
          </Card>

          {/* Payment Method Mix */}
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Payment Method Mix
              </Typography>
              <Chip label="Last 90 days ▾" size="small" sx={{ fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { method: "Bank transfer", pct: "44%", amt: "8.1M", val: 44, col: "#3B82F6" },
                { method: "telebirr", pct: "27%", amt: "5.0M", val: 27, col: "#12808C" },
                { method: "CBE Birr", pct: "15%", amt: "2.8M", val: 15, col: "#10B981" },
                { method: "Cash (bursar)", pct: "9%", amt: "1.7M", val: 9, col: "#D9A621" },
                { method: "M-Pesa", pct: "4%", amt: "0.7M", val: 4, col: "#F97316" },
                { method: "Cheque", pct: "1%", amt: "0.2M", val: 1, col: "#64748B" },
              ].map((pm, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.2 }}>
                    <Typography variant="caption" fontWeight={600}>{pm.method}</Typography>
                    <Typography variant="caption" fontWeight={800}>{pm.pct} · <span style={{ color: "#94A3B8" }}>{pm.amt}</span></Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pm.val} sx={{ height: 4, borderRadius: 2, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: pm.col } }} />
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontSize: "0.68rem" }}>
              Mobile money now 46% of student payments · gateway fee 0.9% · settlement T+1
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ── Bottom Section: Recent Payments & Pending Decisions & Scholarships ── */}
      <Grid container spacing={3}>
        {/* Left: Recent Payments Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}`, mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Recent Payments
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: "0.75rem", borderColor: HTTU_COLORS.border }}>
                  Export CSV
                </Button>
                <Button size="small" sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 700, color: HTTU_COLORS.teal }}>
                  All transactions →
                </Button>
              </Box>
            </Box>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>RECEIPT</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STUDENT / PAYER</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>INVOICE</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>METHOD</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>DATE</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>AMOUNT (ETB)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPayments.map((p, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, color: HTTU_COLORS.teal, cursor: "pointer" }}>{p.receipt}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{p.payer}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.id}</Typography>
                    </TableCell>
                    <TableCell>
                      {p.invoice !== "—" ? (
                        <Typography
                          variant="body2"
                          onClick={() => setSelectedInvoice(p.invoice)}
                          sx={{ color: HTTU_COLORS.teal, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                        >
                          {p.invoice}
                        </Typography>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={p.method} size="small" sx={{ fontSize: "0.68rem", height: 20 }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{p.date}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{p.amount}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={p.status}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: p.status === "Posted" ? "rgba(16, 185, 129, 0.12)" : "rgba(217, 166, 33, 0.15)",
                          color: p.status === "Posted" ? HTTU_COLORS.success : "#B48316",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pending Finance Decisions */}
          <Card sx={{ borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight={800} color={HTTU_COLORS.navy}>
                Pending Finance Decisions
              </Typography>
              <Chip label="14 open" size="small" sx={{ bgcolor: "rgba(217, 166, 33, 0.15)", color: "#B48316", fontWeight: 700, fontSize: "0.68rem" }} />
            </Box>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>REQUEST</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>REQUESTED BY</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>AMOUNT (ETB)</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem" }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingDecisions.map((dec, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, color: HTTU_COLORS.navy }}>{dec.req}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem" }}>{dec.by}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{dec.amt}</TableCell>
                    <TableCell>
                      <Chip
                        label={dec.status}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: dec.status.includes("Urgent") ? "rgba(239, 68, 68, 0.12)" : "rgba(245, 158, 11, 0.15)",
                          color: dec.status.includes("Urgent") ? HTTU_COLORS.danger : "#B48316",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained" sx={{ fontSize: "0.7rem", py: 0.2, bgcolor: HTTU_COLORS.teal, textTransform: "none" }}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* Right: Scholarships, Waivers & Reconciliation */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${HTTU_COLORS.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy}>
                Scholarships, Waivers & Reconciliation
              </Typography>
              <Chip label="FY 2024/25 ▾" size="small" sx={{ fontSize: "0.68rem" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {reconciliationData.map((row, idx) => (
                <Box key={idx} sx={{ pb: 1, borderBottom: idx < 6 ? `1px solid ${HTTU_COLORS.border}` : 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={700} color={HTTU_COLORS.navy}>{row.item}</Typography>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        bgcolor: row.status.includes("On track") || row.status.includes("Balanced") || row.status.includes("Counted") ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.15)",
                        color: row.status.includes("On track") || row.status.includes("Balanced") || row.status.includes("Counted") ? HTTU_COLORS.success : "#B48316",
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Committed: {row.committed} ETB</Typography>
                    <Typography variant="caption" fontWeight={700}>Disbursed: {row.disbursed} ETB</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, fontStyle: "italic", fontSize: "0.68rem" }}>
              Month-end close Mar 31 · payroll run Mar 28 · audit trail retained 10 years
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ── Modal for Screen 06: Invoice Detail (Plate 10) ── */}
      <Dialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F8FAFC", borderBottom: `1px solid ${HTTU_COLORS.border}`, py: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h6" fontWeight={900} color={HTTU_COLORS.navy}>
                Invoice INV-2025-01148
              </Typography>
              <Chip label="Overdue · 18 days" size="small" sx={{ bgcolor: "rgba(239, 68, 68, 0.12)", color: HTTU_COLORS.danger, fontWeight: 700, fontSize: "0.7rem" }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Abeba Tesfaye · HTTU-2026-0001 · B.A. Theology, Year 3 · Issued Jan 20, 2025 · Due Feb 15, 2025
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedInvoice(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left: Line Items & Installment Plan */}
            <Grid item xs={12} md={7.5}>
              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1.5 }}>
                Line Items (Spring Semester 2025)
              </Typography>
              <Table size="small" sx={{ mb: 3 }}>
                <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.7rem" }}>CATEGORY</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>QTY</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.7rem" }}>AMOUNT (ETB)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { desc: "Tuition Fee (18 credit hours · Year 3 rate)", cat: "Tuition", qty: 1, amt: "15,000.00" },
                    { desc: "Registration Fee", cat: "Fees", qty: 1, amt: "1,500.00" },
                    { desc: "Library & Resources Fee", cat: "Fees", qty: 1, amt: "800.00" },
                    { desc: "Technology Fee (LMS & lab access)", cat: "Fees", qty: 1, amt: "1,200.00" },
                    { desc: "Late Payment Fee (5% per month on overdue)", cat: "Penalty", qty: 2, amt: "925.00" },
                  ].map((it, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{it.desc}</TableCell>
                      <TableCell sx={{ fontSize: "0.8rem" }}>{it.cat}</TableCell>
                      <TableCell align="center" sx={{ fontSize: "0.8rem" }}>{it.qty}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{it.amt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total billed</Typography>
                  <Typography variant="subtitle2" fontWeight={900}>ETB 19,425.00</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Paid to date</Typography>
                  <Typography variant="subtitle2" fontWeight={900} color={HTTU_COLORS.success}>ETB 10,000.00</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Balance due</Typography>
                  <Typography variant="subtitle2" fontWeight={900} color={HTTU_COLORS.danger}>ETB 9,425.00</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" fontWeight={800} color={HTTU_COLORS.navy} sx={{ mb: 1.5 }}>
                Installment Plan (3 installments)
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { inst: "1 of 3 · 40%", due: "Jan 20, 2025", amt: "7,770.00", status: "Paid", paidOn: "Jan 18, 2025" },
                  { inst: "2 of 3 · 30%", due: "Feb 15, 2025", amt: "5,827.50", status: "Partial · 2,230.00", paidOn: "Mar 5, 2025" },
                  { inst: "3 of 3 · 30%", due: "Apr 15, 2025", amt: "5,827.50", status: "Pending", paidOn: "—" },
                ].map((row, idx) => (
                  <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: `1px solid ${HTTU_COLORS.border}`, borderRadius: 2 }}>
                    <Typography variant="caption" fontWeight={700}>{row.inst}</Typography>
                    <Typography variant="caption">{row.due}</Typography>
                    <Typography variant="caption" fontWeight={800}>{row.amt} ETB</Typography>
                    <Chip label={row.status} size="small" sx={{ fontSize: "0.65rem", height: 20 }} />
                    <Typography variant="caption" color="text.secondary">{row.paidOn}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right: Payment Actions & Methods */}
            <Grid item xs={12} md={4.5}>
              <Card sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${HTTU_COLORS.border}`, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Balance due</Typography>
                <Typography variant="h4" fontWeight={900} color={HTTU_COLORS.danger}>
                  ETB 9,425.00
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ display: "block", mb: 2 }}>
                  Due Feb 15, 2025 · 18 days overdue
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption">51% collected</Typography>
                    <Typography variant="caption" fontWeight={700}>ETB 10,000 of 19,425</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={51} sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF2F7", "& .MuiLinearProgress-bar": { bgcolor: HTTU_COLORS.teal } }} />
                </Box>
                <Button fullWidth variant="contained" sx={{ bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, mb: 1, "&:hover": { bgcolor: "#c4951d" } }}>
                  Record Payment
                </Button>
                <Button fullWidth variant="outlined" sx={{ borderColor: HTTU_COLORS.border, color: HTTU_COLORS.navy, fontWeight: 700 }}>
                  Adjust / Issue Credit Note
                </Button>
              </Card>

              <Card sx={{ p: 2, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <Typography variant="caption" fontWeight={800} color="error.main">
                  ⚠️ Registration hold active
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  Student cannot register for courses or request transcripts until the balance is cleared. Manage hold.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
