import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert
} from '@mui/material';
import {
  FileDownload, Refresh, CheckCircle, Warning, Lock,
  School, Print, HelpOutline
} from '@mui/icons-material';

const FALL_GRADES = [
  { code: 'BI 101', title: 'Old Testament Survey', credits: 3, score: 91, grade: 'A', points: '12.0', instructor: 'Fr. Dawit Gebre' },
  { code: 'TH 101', title: 'Introduction to Theology', credits: 3, score: 84, grade: 'B+', points: '10.0', instructor: 'Dr. Alemeyahu Worku' },
  { code: 'BI 205', title: 'Hermeneutics I', credits: 3, score: 88, grade: 'A-', points: '11.0', instructor: 'Dr. Sofia Assefa' },
  { code: 'TH 210', title: 'Christian Ethics', credits: 3, score: 80, grade: 'B', points: '9.0', instructor: 'Dr. Hanna Bekele' },
  { code: 'PT 101', title: 'Worship & Liturgy', credits: 3, score: 93, grade: 'A', points: '12.0', instructor: 'Dr. Bethlehem Tesema' },
  { code: 'GEZ 101', title: 'Introduction to Geez', credits: 3, score: 86, grade: 'B+', points: '10.0', instructor: 'Memhir Selamawit Haile' },
];

export default function GradesTab() {
  const [selectedTerm, setSelectedTerm] = useState('Fall 2024');
  const [gradeReviewDialog, setGradeReviewDialog] = useState(false);
  const [degreeAuditDialog, setDegreeAuditDialog] = useState(false);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Student Portal / Grades & Degree Audit
        </Typography>
      </Box>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px' }}>
            Grades & Degree Audit
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Grades are visible only after faculty submission and department approval.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            sx={{ borderRadius: '8px', bgcolor: '#fff', fontSize: '0.84rem', fontWeight: 600, '& .MuiSelect-select': { py: 0.8, px: 1.5 } }}
          >
            <MenuItem value="Fall 2024">Term: Fall 2024</MenuItem>
            <MenuItem value="Spring 2024">Term: Spring 2024</MenuItem>
            <MenuItem value="Fall 2023">Term: Fall 2023</MenuItem>
          </Select>

          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={() => alert("Downloading official transcript...")}
            sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff', borderRadius: '8px' }}
          >
            Download transcript
          </Button>

          <Button
            variant="contained"
            onClick={() => setDegreeAuditDialog(true)}
            sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#C59318' } }}
          >
            Run degree audit
          </Button>
        </Stack>
      </Box>

      {/* Top 5 Stat Metrics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              Fall 2024 semester GPA
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>
              3.65
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              Cumulative GPA
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>
              3.42
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              Credits earned
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mt: 0.5 }}>
              99 / 160
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              Academic standing
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#059669', mt: 0.7 }}>
              Good Standing
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={6} sm={4} md={2.4}>
          <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
              Honors
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#B45309', mt: 0.7 }}>
              Dean's List
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Main Row: Grades Table (8 cols) + Right Degree Audit (4 cols) */}
      <Grid container spacing={3}>
        {/* Left Column: Grades Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Fall 2024 — Final Grades
              </Typography>
              <Chip label="• Published · Jan 18, 2025" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1.2, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                    <TableCell>COURSE</TableCell>
                    <TableCell>TITLE</TableCell>
                    <TableCell align="center">CREDITS</TableCell>
                    <TableCell align="center">SCORE</TableCell>
                    <TableCell align="center">GRADE</TableCell>
                    <TableCell align="center">GRADE POINTS</TableCell>
                    <TableCell align="right">INSTRUCTOR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {FALL_GRADES.map((row) => (
                    <TableRow key={row.code} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                      <TableCell sx={{ fontWeight: 800, color: '#0E2033' }}>{row.code}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{row.title}</TableCell>
                      <TableCell align="center">{row.credits}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>{row.score}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.grade}
                          size="small"
                          sx={{
                            height: 22,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            bgcolor: row.grade.startsWith('A') ? '#ECFDF5' : '#EFF6FF',
                            color: row.grade.startsWith('A') ? '#059669' : '#2563EB',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#0E2033' }}>{row.points}</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>{row.instructor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Table Footer with Summary Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2.5, pt: 2, borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Term credits: <strong style={{ color: '#0E2033' }}>18</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Term grade points: <strong style={{ color: '#0E2033' }}>64.0</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Semester GPA: <strong style={{ color: '#059669' }}>3.65</strong>
                </Typography>
              </Box>

              <Typography
                variant="body2"
                onClick={() => setGradeReviewDialog(true)}
                sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                Request grade review →
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Degree Audit & Official Transcript */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Widget 1: Degree Audit — B.A. Theology */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Degree Audit — B.A. Theology
                </Typography>
                <Chip label="62%" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, fontSize: '0.72rem', height: 22 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Category 1 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>Core Biblical Studies</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>30 / 36 cr</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(30/36)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' } }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    6 credits remaining · BI 320, BI 330 planned Spring 2026
                  </Typography>
                </Box>

                {/* Category 2 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>Theology & Doctrine</Typography>
                    <Chip label="• 24 / 24 cr · Met" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.66rem', height: 18 }} />
                  </Box>
                  <LinearProgress variant="determinate" value={100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    All required courses completed with C or better
                  </Typography>
                </Box>

                {/* Category 3 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>Church History & Tradition</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>12 / 18 cr</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(12/18)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#D97706' } }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    CH 320 in progress equivalent · CH 410 pending
                  </Typography>
                </Box>

                {/* Category 4 (Alert) */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>Ministry & Pastoral Practice</Typography>
                    <Chip label="• 9 / 24 cr" size="small" sx={{ bgcolor: '#FEF2F2', color: '#DC2626', fontWeight: 700, fontSize: '0.66rem', height: 18 }} />
                  </Box>
                  <LinearProgress variant="determinate" value={(9/24)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#EF4444' } }} />
                  <Typography variant="caption" sx={{ color: '#DC2626', fontSize: '0.68rem', mt: 0.3, display: 'block', fontWeight: 600 }}>
                    PT 310 blocked by prerequisite · see advisor
                  </Typography>
                </Box>

                {/* Category 5 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>Languages (Geez / Hebrew / Greek)</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>12 / 20 cr</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={(12/20)*100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#D97706' } }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    Geez II recommended next term
                  </Typography>
                </Box>

                {/* Category 6 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>General Education & Electives</Typography>
                    <Chip label="• 12 / 12 cr · Met" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.66rem', height: 18 }} />
                  </Box>
                  <LinearProgress variant="determinate" value={100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    Includes 3 cr community service
                  </Typography>
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 2.5, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.68rem' }}>
                Curriculum version 2023 · effective Sep 2023 · Audit run Mar 6, 2025 09:14
              </Typography>
            </Card>

            {/* Widget 2: Official Transcript */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
                Official Transcript
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Last issued</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>Feb 2, 2025 · by Registrar</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Verification code</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033', fontFamily: 'monospace' }}>EHTTU-2026-ABC123</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Format</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#0E2033' }}>PDF with QR verification</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Status</Typography>
                  <Chip label="• Active" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.68rem', height: 18 }} />
                </Box>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => alert("Downloading verified PDF transcript...")}
                  sx={{ bgcolor: '#12808C', color: '#fff', fontWeight: 700, fontSize: '0.8rem', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#0D626B' } }}
                >
                  Download PDF
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => alert("Transcript reissue request submitted to Registrar's Office.")}
                  sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, fontSize: '0.8rem', textTransform: 'none', borderRadius: '6px' }}
                >
                  Request new copy
                </Button>
              </Stack>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Grade Review Dialog */}
      <Dialog open={gradeReviewDialog} onClose={() => setGradeReviewDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Request Grade Review</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select size="small" defaultValue="TH 210" fullWidth>
              {FALL_GRADES.map(g => (
                <MenuItem key={g.code} value={g.code}>{g.code} — {g.title} ({g.grade})</MenuItem>
              ))}
            </Select>
            <TextField label="Reason for Review" placeholder="Provide details for the instructor and department head..." multiline rows={3} size="small" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGradeReviewDialog(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { alert("Grade review request submitted."); setGradeReviewDialog(false); }} sx={{ bgcolor: '#12808C', color: '#fff' }}>Submit Request</Button>
        </DialogActions>
      </Dialog>

      {/* Degree Audit Simulator Dialog */}
      <Dialog open={degreeAuditDialog} onClose={() => setDegreeAuditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Live Degree Audit Engine</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Degree audit re-calculated against Curriculum Version 2023. Current progress: <strong>99 of 160 credits (62%)</strong>.
          </Alert>
          <Typography variant="body2" sx={{ color: '#334155', mb: 1 }}>
            • <strong>Prerequisite check:</strong> PT 310 requires completion of PT 210 with C or above.
          </Typography>
          <Typography variant="body2" sx={{ color: '#334155' }}>
            • <strong>Expected Graduation:</strong> July 2027 upon completion of remaining 61 credits including B.A. Senior Thesis.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDegreeAuditDialog(false)} sx={{ color: '#0E2033', fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
