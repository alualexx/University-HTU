import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, LinearProgress, Stack,
  Select, MenuItem, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import {
  Description, Schedule, CheckCircle, School, Add, FileDownload,
  MailOutline, ArrowForward, Close, Check, ErrorOutline,
  CalendarMonth, AssignmentTurnedIn, Person
} from '@mui/icons-material';

const APPLICANT_QUEUE = [
  {
    id: 'APP-2025-00318',
    name: 'Meron Tadesse',
    amharicName: 'መሮን ታደሰ',
    program: 'M.A. Systematic Theology',
    route: 'Direct',
    score: 87.4,
    docStatus: 'Complete',
    docType: 'success',
    appliedDate: 'Feb 12',
    status: 'Committee review',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    actions: ['Review', 'Admit']
  },
  {
    id: 'APP-2025-00402',
    name: 'Yohannes Bekele',
    program: 'B.A. Theology',
    route: 'Parish referral',
    score: 79.1,
    docStatus: 'Complete',
    docType: 'success',
    appliedDate: 'Feb 18',
    status: 'Admitted',
    statusColor: '#2563EB',
    statusBg: '#EFF6FF',
    actions: ['Letter']
  },
  {
    id: 'APP-2025-00455',
    name: 'Hanna Mengistu',
    program: 'B.A. Biblical Studies',
    route: 'Transfer (seminary)',
    score: 74.8,
    docStatus: 'Transcript pending',
    docType: 'warning',
    appliedDate: 'Feb 21',
    status: 'On hold',
    statusColor: '#64748B',
    statusBg: '#F1F5F9',
    actions: ['Request docs']
  },
  {
    id: 'APP-2025-00511',
    name: 'Dawit Solomon',
    amharicName: 'ዳዊት ሰሎሞን',
    program: 'M.Div. Pastoral Ministry',
    route: 'Direct',
    score: 91.2,
    docStatus: 'Complete',
    docType: 'success',
    appliedDate: 'Feb 25',
    status: 'Enrolled',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    actions: ['Profile']
  },
  {
    id: 'APP-2025-00588',
    name: 'Sara Girma',
    program: 'Certificate in Church Music',
    route: 'Direct',
    score: 71.5,
    docStatus: 'Missing baptism cert.',
    docType: 'error',
    appliedDate: 'Mar 1',
    status: 'Incomplete',
    statusColor: '#DC2626',
    statusBg: '#FEF2F2',
    actions: ['Request docs']
  },
  {
    id: 'APP-2025-00604',
    name: 'Nahom Assefa',
    program: 'B.A. Theology (weekend)',
    route: 'Diploma upgrade',
    score: 82.0,
    docStatus: 'Complete',
    docType: 'success',
    appliedDate: 'Mar 2',
    status: 'Committee review',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    actions: ['Review', 'Admit']
  },
  {
    id: 'APP-2025-00641',
    name: 'Bethlehem Kebede',
    program: 'B.A. Biblical Studies',
    route: 'Parish referral',
    score: 76.3,
    docStatus: 'Complete',
    docType: 'success',
    appliedDate: 'Mar 3',
    status: 'Awaiting score check',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    actions: ['Review']
  },
];

const PROGRAM_CAPACITY = [
  {
    name: 'B.A. Theology',
    sub: '4 years · 160 credits',
    mode: 'Regular',
    approved: 200,
    admitted: 168,
    enrolled: 151,
    pct: 76,
    status: 'Open',
    statusColor: '#10B981'
  },
  {
    name: 'B.A. Theology',
    sub: 'Weekend / extension',
    mode: 'Weekend',
    approved: 120,
    admitted: 104,
    enrolled: 92,
    pct: 77,
    status: 'Open',
    statusColor: '#10B981'
  },
  {
    name: 'B.A. Biblical Studies',
    sub: '4 years · 160 credits',
    mode: 'Regular',
    approved: 90,
    admitted: 82,
    enrolled: 74,
    pct: 82,
    status: 'Open',
    statusColor: '#10B981'
  },
  {
    name: 'M.Div. Pastoral Ministry',
    sub: '3 years · 96 credits',
    mode: 'Cohort',
    approved: 60,
    admitted: 58,
    enrolled: 56,
    pct: 93,
    status: 'Nearly full',
    statusColor: '#F59E0B'
  },
  {
    name: 'M.A. Systematic Theology',
    sub: 'Thesis track',
    mode: 'Thesis track',
    approved: 40,
    admitted: 22,
    enrolled: 18,
    pct: 45,
    status: 'Below target',
    statusColor: '#EF4444'
  },
  {
    name: 'Certificate in Church Music',
    sub: '1 year · 32 credits',
    mode: 'Evening',
    approved: 30,
    admitted: 24,
    enrolled: 19,
    pct: 63,
    status: 'Open',
    statusColor: '#10B981'
  },
];

export default function RegistrarAdmissionsTab() {
  const [selectedApp, setSelectedApp] = useState('APP-2025-00318');
  const [programFilter, setProgramFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Oldest');
  const [reviewDialog, setReviewDialog] = useState(null);

  const currentApp = APPLICANT_QUEUE.find(a => a.id === selectedApp) || APPLICANT_QUEUE[0];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb & Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Registrar / Admissions — Fall 2025 intake
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px' }}>
              Admissions & Applications
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Fall 2025 intake · 1,284 applications received · next admission committee meeting Mar 12, 2025
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff' }}
            >
              Export list
            </Button>
            <Button
              variant="outlined"
              startIcon={<MailOutline />}
              sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff' }}
            >
              Send admission letters
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#C59318' } }}
            >
              New application
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* 4 KPI Top Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Applications Received
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Description fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              1,284
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              Fall 2025 · opened Jan 6, 2025
            </Typography>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ +14.6% vs Fall 2024
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Awaiting Review
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Schedule fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              214
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              162 documents verified · 52 incomplete
            </Typography>
            <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↓ Target: clear by Mar 20
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Admitted
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              486
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              398 UG · 76 PG · 12 certificate
            </Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ 31.3% acceptance rate
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Enrolled (confirmed)
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <School fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              402
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              Deposit paid · ID HTTU25... issued
            </Typography>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ 82.7% yield
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Applicant Review Queue (Left) & Admission Funnel (Right) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Column: Applicant Review Queue */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Applicant Review Queue
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Select
                  size="small"
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All programs</MenuItem>
                  <MenuItem value="Theology">Theology</MenuItem>
                  <MenuItem value="Biblical Studies">Biblical Studies</MenuItem>
                  <MenuItem value="Pastoral Ministry">Pastoral Ministry</MenuItem>
                </Select>
                <Select
                  size="small"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.8rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="Oldest">Sorted: oldest first</MenuItem>
                  <MenuItem value="Newest">Sorted: newest first</MenuItem>
                  <MenuItem value="Score">Highest score</MenuItem>
                </Select>
              </Stack>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1.2, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                    <TableCell>APPLICANT</TableCell>
                    <TableCell>PROGRAM APPLIED FOR</TableCell>
                    <TableCell>ENTRY ROUTE</TableCell>
                    <TableCell align="center">ENTRY SCORE</TableCell>
                    <TableCell>DOCUMENTS</TableCell>
                    <TableCell>APPLIED</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {APPLICANT_QUEUE.map((app) => (
                    <TableRow 
                      key={app.id} 
                      hover 
                      selected={selectedApp === app.id}
                      onClick={() => setSelectedApp(app.id)}
                      sx={{ cursor: 'pointer', '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                          {app.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                          {app.id} {app.amharicName && `· ${app.amharicName}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 600 }}>{app.program}</TableCell>
                      <TableCell sx={{ color: '#64748B' }}>{app.route}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, color: '#0E2033' }}>{app.score}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.docStatus}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: app.docType === 'success' ? '#ECFDF5' : app.docType === 'warning' ? '#FEF3C7' : '#FEF2F2',
                            color: app.docType === 'success' ? '#059669' : app.docType === 'warning' ? '#B45309' : '#DC2626'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748B' }}>{app.appliedDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: app.statusBg,
                            color: app.statusColor
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                          {app.actions.includes('Review') && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={(e) => { e.stopPropagation(); setReviewDialog(app); }}
                              sx={{ bgcolor: '#12808C', color: '#fff', fontSize: '0.72rem', py: 0.3, px: 1, minWidth: 'auto', textTransform: 'none', '&:hover': { bgcolor: '#0D626B' } }}
                            >
                              Review
                            </Button>
                          )}
                          {app.actions.includes('Admit') && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => { e.stopPropagation(); alert(`Admission letter drafted for ${app.name}`); }}
                              sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontSize: '0.72rem', py: 0.3, px: 1, minWidth: 'auto', textTransform: 'none' }}
                            >
                              Admit
                            </Button>
                          )}
                          {app.actions.includes('Letter') && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => { e.stopPropagation(); alert(`Printing admission letter for ${app.name}`); }}
                              sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontSize: '0.72rem', py: 0.3, px: 1, minWidth: 'auto', textTransform: 'none' }}
                            >
                              Letter
                            </Button>
                          )}
                          {app.actions.includes('Request docs') && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => { e.stopPropagation(); alert(`Automated document request SMS sent to ${app.name}`); }}
                              sx={{ borderColor: '#CBD5E1', color: '#64748B', fontSize: '0.72rem', py: 0.3, px: 1, minWidth: 'auto', textTransform: 'none' }}
                            >
                              Request docs
                            </Button>
                          )}
                          {app.actions.includes('Profile') && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => { e.stopPropagation(); setSelectedApp(app.id); }}
                              sx={{ borderColor: '#CBD5E1', color: '#10B981', fontSize: '0.72rem', py: 0.3, px: 1, minWidth: 'auto', textTransform: 'none' }}
                            >
                              Profile
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography variant="body2" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                View all 1,284 applications →
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Admission Funnel & Applicant Source */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Admission Funnel
              </Typography>
              <Select
                size="small"
                defaultValue="Fall 2025"
                sx={{ borderRadius: '6px', fontSize: '0.78rem', '& .MuiSelect-select': { py: 0.4, px: 1 } }}
              >
                <MenuItem value="Fall 2025">Fall 2025</MenuItem>
                <MenuItem value="Spring 2025">Spring 2025</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>Applied</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>1,284</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#94A3B8' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>Documents complete</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>1,002 — 78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#3B82F6' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>Under academic review</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>808 — 63%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={63} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#12808C' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>Admitted</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>486 — 38%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={38} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>Deposit paid</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>402 — 31%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={31} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' } }} />
              </Box>
            </Box>

            {/* Applicant Source */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0E2033', mb: 1.5 }}>
              Applicant source
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Parish referral</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>694</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(694/1284)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#6B46C1' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Direct / website</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>412</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(412/1284)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Transfer</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>141</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(141/1284)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#12808C' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Diploma upgrade</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>37</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(37/1284)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#F59E0B' } }} />
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
              282 incomplete applications receive an automated reminder every 7 days
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Program Capacity (Left) & Document Verification Side Panel (Right) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Column: Program Capacity */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Program Capacity — Fall 2025 Intake
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
              >
                Adjust intake
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1.2, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                    <TableCell>PROGRAM</TableCell>
                    <TableCell>MODE</TableCell>
                    <TableCell align="center">APPROVED INTAKE</TableCell>
                    <TableCell align="center">ADMITTED</TableCell>
                    <TableCell align="center">ENROLLED</TableCell>
                    <TableCell>SEATS FILLED</TableCell>
                    <TableCell align="right">STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PROGRAM_CAPACITY.map((prog, idx) => (
                    <TableRow key={idx} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                          {prog.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                          {prog.sub}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#334155' }}>{prog.mode}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>{prog.approved}</TableCell>
                      <TableCell align="center" sx={{ color: '#64748B' }}>{prog.admitted}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, color: '#0E2033' }}>{prog.enrolled}</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', minWidth: 70 }}>
                            {prog.enrolled} of {prog.approved} · {prog.pct}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={prog.pct} 
                          sx={{ 
                            height: 5, 
                            borderRadius: 2, 
                            bgcolor: '#F1F5F9',
                            mt: 0.5,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: prog.pct > 90 ? '#10B981' : prog.pct < 50 ? '#EF4444' : '#12808C'
                            }
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={prog.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: `${prog.statusColor}15`,
                            color: prog.statusColor
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
              M.A. intake flagged to the Dean · marketing push approved for the remaining 22 seats
            </Typography>
          </Card>
        </Grid>

        {/* Right Column: Document Verification Side Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Document Verification
              </Typography>
              <Select
                size="small"
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                sx={{ borderRadius: '6px', fontSize: '0.75rem', '& .MuiSelect-select': { py: 0.3, px: 1 } }}
              >
                {APPLICANT_QUEUE.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.id}</MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Completed application form</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Feb 12</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Baptism certificate</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>Verified · Holy Trinity Cathedral</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Official transcript (B.A.)</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>GPA 3.62 · sealed</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Passport-size photo</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Uploaded</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>National ID copy</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>Verified</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Two recommendation letters</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Parish father · former lecturer</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.8, borderBottom: '1px solid #F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorOutline sx={{ fontSize: 16, color: '#EF4444' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#DC2626' }}>Research proposal (PG)</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>Not received · requested Mar 3</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Application fee ETB 300</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>telebirr · RCP-2025-00412</Typography>
              </Box>
            </Box>

            <Alert severity="warning" icon={false} sx={{ mt: 2, p: 1, borderRadius: '8px', fontSize: '0.74rem', bgcolor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>
              7 of 8 documents verified · application cannot be admitted until the proposal is filed
            </Alert>
          </Card>
        </Grid>
      </Grid>

      {/* Row 4: 3 Bottom Widgets (Enrolment Steps, Admission Calendar, Certification & Requests) */}
      <Grid container spacing={3}>
        {/* Widget 1: Enrolment Steps */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Enrolment Steps
              </Typography>
              <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer' }}>
                Guide →
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                  1
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Receive admission letter</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Sent by email and portal · accept within 14 days</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                  2
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Pay enrolment deposit</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>ETB 3,000 · bank, telebirr or CBE Birr</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                  3
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Verify original documents</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>In person at the Registrar's desk</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                  4
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Issue student ID & portal account</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>ID HTTU25... · credentials by SMS and email</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#F8FAFC', color: '#94A3B8', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                  5
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Register for courses</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Orientation week · advisor-assisted</Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
              402 of 486 admitted students have completed all five steps
            </Typography>
          </Card>
        </Grid>

        {/* Widget 2: Admission Calendar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Admission Calendar
              </Typography>
              <Chip label="Fall 2025" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.82rem' }}>
                  Jan 6 — Applications opened
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Online and paper forms · ETB 300 fee
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#B45309', fontSize: '0.82rem' }}>
                  Mar 12 — Admission committee
                </Typography>
                <Typography variant="caption" sx={{ color: '#92400E' }}>
                  214 applications to decide · 10:00, Senate Hall
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.82rem' }}>
                  Apr 30 — Applications close
                </Typography>
                <Typography variant="caption" sx={{ color: '#1E40AF' }}>
                  Late files accepted only for certificate programs
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#FAF5FF', border: '1px solid #E9D5FF' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#7E22CE', fontSize: '0.82rem' }}>
                  Sep 15 — Semester begins
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B21A8' }}>
                  Orientation Sep 8–12 · registration Sep 8–19
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Widget 3: Certification & Requests */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Certification & Requests
              </Typography>
              <Chip label="23 open" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Official transcripts</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>9 pending · code EHTTU-2026-... · ETB 150 each</Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontSize: '0.72rem', py: 0.3, px: 1, textTransform: 'none' }}>
                  Process
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Enrolment verification letters</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>7 pending · embossed seal</Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontSize: '0.72rem', py: 0.3, px: 1, textTransform: 'none' }}>
                  Process
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Temporary graduation certificates</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>5 pending · commencement Jun 14, 2025</Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontSize: '0.72rem', py: 0.3, px: 1, textTransform: 'none' }}>
                  Process
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', fontSize: '0.82rem' }}>Transfer credit evaluations</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>2 pending · Dean sign-off required</Typography>
                </Box>
                <Chip label="Referred" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.7rem', height: 20 }} />
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
              Documents issued with QR verification · 148 certifications issued this academic year
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog open={Boolean(reviewDialog)} onClose={() => setReviewDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>
          Admissions Review — {reviewDialog?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {reviewDialog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">
                Application: <strong>{reviewDialog.id}</strong> | Program: <strong>{reviewDialog.program}</strong>
              </Typography>
              <Typography variant="body2">
                Score: <strong>{reviewDialog.score} / 100</strong> | Route: <strong>{reviewDialog.route}</strong>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admissions Committee Decision Notes"
                placeholder="Enter rationale, prerequisites, or conditional stipulations..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialog(null)} sx={{ color: '#64748B' }}>Close</Button>
          <Button variant="contained" onClick={() => setReviewDialog(null)} sx={{ bgcolor: '#12808C', color: '#fff', fontWeight: 700 }}>
            Submit Recommendation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
