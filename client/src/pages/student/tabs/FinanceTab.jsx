import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Stack, TextField, Radio, RadioGroup, FormControlLabel,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Description, CheckCircle, Warning, AccountBalanceWallet,
  OpenInNew, Lock, Check
} from '@mui/icons-material';

const INVOICES = [
  {
    id: 'INV-2025-00412',
    term: 'Spring 2025',
    issued: 'Jan 20, 2025',
    due: 'May 15, 2025',
    amount: '16,200.00',
    balance: '4,850.00',
    status: 'Partially paid',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
  },
  {
    id: 'INV-2024-00987',
    term: 'Fall 2024',
    issued: 'Sep 10, 2024',
    due: 'Dec 20, 2024',
    amount: '16,200.00',
    balance: '0.00',
    status: 'Paid',
    statusBg: '#ECFDF5',
    statusColor: '#059669',
  },
];

const INSTALLMENT_PLAN = [
  {
    inst: '1 of 3',
    due: 'Jan 20, 2025',
    amount: '6,480.00',
    status: 'Paid',
    statusBg: '#ECFDF5',
    statusColor: '#059669',
    paidOn: 'Jan 18, 2025',
  },
  {
    inst: '2 of 3',
    due: 'Mar 15, 2025',
    amount: '4,860.00',
    status: 'Partial · 90.00',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
    paidOn: '—',
  },
  {
    inst: '3 of 3',
    due: 'May 15, 2025',
    amount: '4,860.00',
    status: 'Upcoming',
    statusBg: '#F1F5F9',
    statusColor: '#64748B',
    paidOn: '—',
  },
];

const PAYMENT_HISTORY = [
  { receipt: 'RCP-2025-00231', date: 'Jan 18, 2025', method: 'Bank Transfer', methodBg: '#EFF6FF', methodColor: '#2563EB', appliedTo: 'INV-2025-00412 · Inst. 1', amount: '6,480.00' },
  { receipt: 'RCP-2025-00618', date: 'Mar 14, 2025', method: 'telebirr', methodBg: '#ECFDF5', methodColor: '#059669', appliedTo: 'INV-2025-00412 · Inst. 2', amount: '90.00' },
  { receipt: 'RCP-2024-01422', date: 'Dec 18, 2024', method: 'CBE Birr', methodBg: '#ECFDF5', methodColor: '#059669', appliedTo: 'INV-2024-00987 · Final', amount: '8,100.00' },
  { receipt: 'RCP-2024-00871', date: 'Sep 12, 2024', method: 'Bank Transfer', methodBg: '#EFF6FF', methodColor: '#2563EB', appliedTo: 'INV-2024-00987 · Inst. 1', amount: '8,100.00' },
  { receipt: 'SCH-2024-0042', date: 'Sep 10, 2024', method: 'Scholarship', methodBg: '#FEF3C7', methodColor: '#B45309', appliedTo: 'Parish sponsorship credit', amount: '6,000.00' },
];

export default function FinanceTab() {
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [payAmount, setPayAmount] = useState('4,770.00');
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);

  const handlePay = () => {
    setPaymentSuccessModal(true);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Student Portal / Fees & Payments
        </Typography>
      </Box>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px' }}>
            Fees & Payments
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Student account · HTTU-2026-0001 · All amounts in Ethiopian Birr (ETB)
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Description />}
          onClick={() => alert("Generating full official fee statement PDF...")}
          sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff', borderRadius: '8px' }}
        >
          Statement (PDF)
        </Button>
      </Box>

      {/* 4 Top KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Outstanding Balance
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountBalanceWallet fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              ETB 4,850.00
            </Typography>
            <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 700, display: 'block' }}>
              Due May 15, 2025
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Billed 2024/25
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Description fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              ETB 32,400.00
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              2 invoices
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Paid to Date
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              ETB 27,550.00
            </Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block' }}>
              4 payments
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Scholarship Credit
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountBalanceWallet fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              ETB 6,000.00
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              Parish sponsorship · 20%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid: Left Invoices & Installments (8 cols) + Right Payment & Holds (4 cols) */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Invoices Table Card */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Invoices
                </Typography>
                <Select
                  size="small"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.78rem', '& .MuiSelect-select': { py: 0.4, px: 1.2 } }}
                >
                  <MenuItem value="2024/2025">Academic year 2024/2025</MenuItem>
                  <MenuItem value="2023/2024">Academic year 2023/2024</MenuItem>
                </Select>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                      <TableCell>INVOICE</TableCell>
                      <TableCell>TERM</TableCell>
                      <TableCell>ISSUED</TableCell>
                      <TableCell>DUE</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="right">BALANCE</TableCell>
                      <TableCell align="right">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {INVOICES.map((inv) => (
                      <TableRow key={inv.id} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                        <TableCell sx={{ fontWeight: 800, color: '#12808C' }}>{inv.id}</TableCell>
                        <TableCell sx={{ color: '#334155' }}>{inv.term}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{inv.issued}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{inv.due}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{inv.amount}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: inv.balance !== '0.00' ? '#DC2626' : '#0E2033' }}>{inv.balance}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={inv.status}
                            size="small"
                            sx={{
                              height: 20,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              bgcolor: inv.statusBg,
                              color: inv.statusColor
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Installment Plan Card */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Spring 2025 Installment Plan
                </Typography>
                <Chip label="3 installments" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                      <TableCell>INSTALLMENT</TableCell>
                      <TableCell>DUE DATE</TableCell>
                      <TableCell align="right">AMOUNT (ETB)</TableCell>
                      <TableCell>STATUS</TableCell>
                      <TableCell align="right">PAID ON</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {INSTALLMENT_PLAN.map((plan) => (
                      <TableRow key={plan.inst} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                        <TableCell sx={{ fontWeight: 800, color: '#0E2033' }}>{plan.inst}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{plan.due}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{plan.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={plan.status}
                            size="small"
                            sx={{
                              height: 20,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              bgcolor: plan.statusBg,
                              color: plan.statusColor
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#64748B' }}>{plan.paidOn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
                Late fee 5% per month applies after the due date. Balances above ETB 0 block registration and transcript requests.
              </Typography>
            </Card>

            {/* Payment History Card */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Payment History
                </Typography>
                <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer' }}>
                  All receipts →
                </Typography>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                      <TableCell>RECEIPT</TableCell>
                      <TableCell>DATE</TableCell>
                      <TableCell>METHOD</TableCell>
                      <TableCell>APPLIED TO</TableCell>
                      <TableCell align="right">AMOUNT (ETB)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PAYMENT_HISTORY.map((row) => (
                      <TableRow key={row.receipt} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                        <TableCell sx={{ fontWeight: 800, color: '#0E2033' }}>{row.receipt}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{row.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.method}
                            size="small"
                            sx={{
                              height: 20,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              bgcolor: row.methodBg,
                              color: row.methodColor
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{row.appliedTo}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#0E2033' }}>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Grid>

        {/* Right Column: Make a Payment & Holds */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Widget 1: Make a Payment */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
                Make a Payment
              </Typography>

              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>
                Amount (ETB)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={`ETB ${payAmount}`}
                onChange={(e) => setPayAmount(e.target.value.replace('ETB ', ''))}
                sx={{ mb: 1.5, '& input': { fontWeight: 800, fontSize: '1.05rem', color: '#0E2033' } }}
              />

              <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setPayAmount('4,770.00')}
                  sx={{ borderColor: payAmount === '4,770.00' ? '#12808C' : '#E2E8F0', color: '#0E2033', fontSize: '0.72rem', textTransform: 'none', flex: 1 }}
                >
                  Inst. 2 balance · 4,770
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setPayAmount('4,850.00')}
                  sx={{ borderColor: payAmount === '4,850.00' ? '#12808C' : '#E2E8F0', color: '#0E2033', fontSize: '0.72rem', textTransform: 'none', flex: 1 }}
                >
                  Full balance · 4,850
                </Button>
              </Stack>

              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 1, display: 'block' }}>
                Payment method
              </Typography>

              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.2, borderRadius: '8px', border: paymentMethod === 'telebirr' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  bgcolor: paymentMethod === 'telebirr' ? '#F0FDF4' : '#fff', cursor: 'pointer'
                }} onClick={() => setPaymentMethod('telebirr')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>telebirr</Typography>
                  </Box>
                  <Radio checked={paymentMethod === 'telebirr'} size="small" sx={{ color: '#10B981', '&.Mui-checked': { color: '#10B981' } }} />
                </Box>

                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.2, borderRadius: '8px', border: paymentMethod === 'cbe' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  bgcolor: paymentMethod === 'cbe' ? '#F0FDF4' : '#fff', cursor: 'pointer'
                }} onClick={() => setPaymentMethod('cbe')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Bank Transfer · CBE</Typography>
                  </Box>
                  <Radio checked={paymentMethod === 'cbe'} size="small" sx={{ color: '#10B981', '&.Mui-checked': { color: '#10B981' } }} />
                </Box>

                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.2, borderRadius: '8px', border: paymentMethod === 'mpesa' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  bgcolor: paymentMethod === 'mpesa' ? '#F0FDF4' : '#fff', cursor: 'pointer'
                }} onClick={() => setPaymentMethod('mpesa')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>M-Pesa</Typography>
                  </Box>
                  <Radio checked={paymentMethod === 'mpesa'} size="small" sx={{ color: '#10B981', '&.Mui-checked': { color: '#10B981' } }} />
                </Box>

                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.2, borderRadius: '8px', border: paymentMethod === 'bursar' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  bgcolor: paymentMethod === 'bursar' ? '#F0FDF4' : '#fff', cursor: 'pointer'
                }} onClick={() => setPaymentMethod('bursar')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Cash at Bursar</Typography>
                  </Box>
                  <Radio checked={paymentMethod === 'bursar'} size="small" sx={{ color: '#10B981', '&.Mui-checked': { color: '#10B981' } }} />
                </Box>
              </RadioGroup>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePay}
                sx={{
                  bgcolor: '#D9A621',
                  color: '#0E2033',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  py: 1.2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#C59318' }
                }}
              >
                Pay ETB {payAmount}
              </Button>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'center', mt: 1, fontSize: '0.72rem' }}>
                You will be redirected to the provider to authorize this payment.
              </Typography>
            </Card>

            {/* Widget 2: No Active Holds Alert */}
            <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #BBF7D0', bgcolor: '#F0FDF4' }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <CheckCircle sx={{ color: '#10B981', fontSize: 20, mt: 0.2 }} />
                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, fontSize: '0.78rem', lineHeight: 1.4 }}>
                  <strong>No active holds.</strong> Clearing the remaining balance keeps you eligible for Spring 2026 registration and transcript requests.
                </Typography>
              </Box>
            </Card>

            {/* Widget 3: Financial Aid */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Financial Aid
                </Typography>
                <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer' }}>
                  Details →
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Parish Sponsorship</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>20% tuition · renewed Sep 2024</Typography>
                  </Box>
                  <Chip label="• Active" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.7rem', height: 20 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Need-Based Grant 2025/26</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Application window opens Jun 1, 2025</Typography>
                  </Box>
                  <Chip label="Not started" size="small" sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontSize: '0.7rem', height: 20 }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Payment Gateway Modal Simulator */}
      <Dialog open={paymentSuccessModal} onClose={() => setPaymentSuccessModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Payment Simulator</DialogTitle>
        <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: '#10B981', my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>
            Payment Successful!
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
            Receipt <strong>RCP-2025-00729</strong> has been issued. Your account balance has been updated in the Registrar and Finance databases.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth variant="contained" onClick={() => setPaymentSuccessModal(false)} sx={{ bgcolor: '#0E2033', color: '#fff' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
