import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Select, MenuItem,
  Chip, LinearProgress, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import {
  CalendarMonth, FileDownload, Print, Schedule, Room,
  CheckCircle, School, OpenInNew, HelpOutline
} from '@mui/icons-material';

const DAYS = [
  { name: 'Monday', date: 'Mar 3' },
  { name: 'Tuesday', date: 'Mar 4' },
  { name: 'Wednesday', date: 'Mar 5' },
  { name: 'Thursday', date: 'Mar 6' },
  { name: 'Friday', date: 'Mar 7' },
  { name: 'Saturday', date: 'Mar 8' },
];

const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const MY_COURSES = [
  {
    code: 'NT',
    bg: '#0F766E',
    number: 'NT 305',
    title: 'Pauline Epistles',
    instructor: 'Dr. Tesfaye Melaku',
    credits: '3 cr · Sec 01',
    progress: 58,
    attendance: 92,
  },
  {
    code: 'TH',
    bg: '#D97706',
    number: 'TH 201',
    title: 'Systematic Theology I',
    instructor: 'Dr. Alemeyahu Worku',
    credits: '4 cr · Sec 01',
    progress: 61,
    attendance: 88,
  },
  {
    code: 'BI',
    bg: '#7C3AED',
    number: 'BI 210',
    title: 'Biblical Interpretation',
    instructor: 'Dr. Sofia Assefa',
    credits: '3 cr · Sec 02',
    progress: 54,
    attendance: 76,
  },
  {
    code: 'PT',
    bg: '#EA580C',
    number: 'PT 220',
    title: 'Pastoral Care',
    instructor: 'Dr. Bethlehem Tesema',
    credits: '3 cr · Sec 01',
    progress: 49,
    attendance: 95,
  },
  {
    code: 'CH',
    bg: '#059669',
    number: 'CH 301',
    title: 'Church History',
    instructor: 'Fr. Dawit Gebre',
    credits: '2 cr · Sec 01',
    progress: 63,
    attendance: 90,
  },
];

export default function TimetableTab({ setActiveTab }) {
  const [selectedWeek, setSelectedWeek] = useState('Week 8 · Mar 3 – Mar 7, 2025');
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Student Portal / Class Schedule
        </Typography>
      </Box>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px' }}>
            Class Schedule & My Courses
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Spring Semester 2025 · Week 8 of 16 · 15 credits · 5 courses
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            sx={{ borderRadius: '8px', bgcolor: '#fff', fontSize: '0.84rem', fontWeight: 600, '& .MuiSelect-select': { py: 0.8, px: 1.5 } }}
          >
            <MenuItem value="Week 8 · Mar 3 – Mar 7, 2025">Week 8 · Mar 3 – Mar 7, 2025</MenuItem>
            <MenuItem value="Week 9 · Mar 10 – Mar 14, 2025">Week 9 · Mar 10 – Mar 14, 2025</MenuItem>
            <MenuItem value="Week 10 · Mar 17 – Mar 21, 2025">Week 10 · Mar 17 – Mar 21, 2025</MenuItem>
          </Select>

          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff', borderRadius: '8px' }}
          >
            Export .ics
          </Button>

          <Button
            variant="contained"
            onClick={handlePrint}
            startIcon={<Print />}
            sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#C59318' } }}
          >
            Print schedule
          </Button>
        </Stack>
      </Box>

      {/* Row 1: Weekly Timetable (8 cols) + Right Widgets (4 cols) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Timetable Grid */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            {/* Header with Course Dots Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Weekly Timetable
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#0F766E' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.72rem' }}>NT 305</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#D97706' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.72rem' }}>TH 201</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.72rem' }}>BI 210</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EA580C' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.72rem' }}>PT 220</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', fontSize: '0.72rem' }}>CH 301</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Custom Timetable Grid Container */}
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 680 }}>
                {/* Days Header */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '50px repeat(6, 1fr)', borderBottom: '1px solid #E2E8F0', pb: 1, textAlign: 'center' }}>
                  <Box />
                  {DAYS.map((d) => (
                    <Box key={d.name}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033', display: 'block', fontSize: '0.75rem' }}>{d.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>{d.date}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Grid Body */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '50px repeat(6, 1fr)', position: 'relative', pt: 1 }}>
                  {/* Time labels column */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {TIME_SLOTS.map((t) => (
                      <Box key={t} sx={{ height: 50, color: '#94A3B8', fontSize: '0.68rem', fontWeight: 600, pt: 0.2 }}>
                        {t}
                      </Box>
                    ))}
                  </Box>

                  {/* Day Columns */}
                  {/* Monday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* NT 305: 8:00 - 9:30 */}
                    <Box sx={{
                      position: 'absolute', top: 0, left: 4, right: 4, height: 75,
                      bgcolor: '#0F766E', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        NT 305 · Pauline Epistles
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lecture · Room 201
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Tesfaye Melaku
                      </Typography>
                    </Box>

                    {/* BI 210: 13:00 - 14:30 (top = 250px) */}
                    <Box sx={{
                      position: 'absolute', top: 250, left: 4, right: 4, height: 75,
                      bgcolor: '#7C3AED', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        BI 210 · Biblical Interpretation
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Seminar · Room 203
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Sofia Assefa
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tuesday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* TH 201: 10:00 - 11:30 (top = 100px) */}
                    <Box sx={{
                      position: 'absolute', top: 100, left: 4, right: 4, height: 75,
                      bgcolor: '#D97706', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        TH 201 · Systematic Theology I
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lecture · Room 105
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Alemeyahu Worku
                      </Typography>
                    </Box>

                    {/* PT 220: 15:00 - 16:30 (top = 350px) */}
                    <Box sx={{
                      position: 'absolute', top: 350, left: 4, right: 4, height: 75,
                      bgcolor: '#EA580C', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        PT 220 · Pastoral Care
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lab · Room 204
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Bethlehem Tesema
                      </Typography>
                    </Box>
                  </Box>

                  {/* Wednesday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* NT 305: 8:00 - 9:30 */}
                    <Box sx={{
                      position: 'absolute', top: 0, left: 4, right: 4, height: 75,
                      bgcolor: '#0F766E', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        NT 305 · Pauline Epistles
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lecture · Room 201
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Tesfaye Melaku
                      </Typography>
                    </Box>

                    {/* BI 210: 13:00 - 14:30 */}
                    <Box sx={{
                      position: 'absolute', top: 250, left: 4, right: 4, height: 75,
                      bgcolor: '#7C3AED', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        BI 210 · Biblical Interpretation
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Seminar · Room 203
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Sofia Assefa
                      </Typography>
                    </Box>
                  </Box>

                  {/* Thursday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* TH 201: 10:00 - 11:30 */}
                    <Box sx={{
                      position: 'absolute', top: 100, left: 4, right: 4, height: 75,
                      bgcolor: '#D97706', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        TH 201 · Systematic Theology I
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lecture · Room 105
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Alemeyahu Worku
                      </Typography>
                    </Box>

                    {/* PT 220: 15:00 - 16:30 */}
                    <Box sx={{
                      position: 'absolute', top: 350, left: 4, right: 4, height: 75,
                      bgcolor: '#EA580C', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        PT 220 · Pastoral Care
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Lab · Room 204
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Dr. Bethlehem Tesema
                      </Typography>
                    </Box>
                  </Box>

                  {/* Friday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* CH 301: 9:00 - 11:30 (top = 50px, height = 125px) */}
                    <Box sx={{
                      position: 'absolute', top: 50, left: 4, right: 4, height: 125,
                      bgcolor: '#059669', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        CH 301 · Church History
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Extended session · Room 210
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Fr. Dawit Gebre
                      </Typography>
                    </Box>
                  </Box>

                  {/* Saturday */}
                  <Box sx={{ borderLeft: '1px solid #F1F5F9', position: 'relative', height: 450, px: 0.5 }}>
                    {/* Study Lab: 9:00 - 11:00 (top = 50px, height = 100px) */}
                    <Box sx={{
                      position: 'absolute', top: 50, left: 4, right: 4, height: 100,
                      bgcolor: '#0E2033', color: '#fff', borderRadius: '6px', p: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', display: 'block', lineHeight: 1.2 }}>
                        Study & Manuscript Lab
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.64rem', opacity: 0.9, display: 'block' }}>
                        Self-study · Library
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8, display: 'block' }}>
                        Optional
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right: Today's Schedule & Load & Conflicts */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Widget 1: Today · Thursday */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Today · Thursday
                </Typography>
                <Chip label="2 classes" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>
                        TH 201 — Systematic Theology I
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        10:00 – 11:30 · Room 105
                      </Typography>
                    </Box>
                    <Chip label="• Now" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800, fontSize: '0.7rem', height: 20 }} />
                  </Box>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>
                        PT 220 — Pastoral Care
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        15:00 – 16:30 · Room 204
                      </Typography>
                    </Box>
                    <Chip label="In 4h" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                  </Box>
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
                Chapel service Fridays 10:00 · Main Chapel (attendance recorded)
              </Typography>
            </Card>

            {/* Widget 2: Load & Conflicts */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
                Load & Conflicts
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Contact hours</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>15 hrs / week</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Credits</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>15 of 21 max</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Conflicts</Typography>
                  <Chip label="• None detected" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                </Box>

                <Box sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.3 }}>Rooms</Typography>
                  <Typography variant="caption" sx={{ color: '#0E2033', fontWeight: 600 }}>
                    Main Bldg 201/210 · Theology Hall 105 · Ministry Ctr 203/204
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Row 2: My Courses Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0E2033' }}>
          My Courses
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          Progress synced from the E-Learning service · last sync 12 min ago
        </Typography>
      </Box>

      {/* Courses Cards Grid */}
      <Grid container spacing={2.5}>
        {MY_COURSES.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.number}>
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: course.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                  {course.code}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0E2033', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {course.number} — {course.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    {course.instructor} · {course.credits}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Course progress</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>{course.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={course.progress} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: course.bg } }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Attendance</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: course.attendance >= 85 ? '#059669' : '#D97706' }}>{course.attendance}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={course.attendance} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: course.attendance >= 85 ? '#10B981' : '#F59E0B' } }} />
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ bgcolor: '#0F766E', color: '#fff', fontSize: '0.74rem', textTransform: 'none', py: 0.5, flex: 1, '&:hover': { bgcolor: '#0D626B' } }}
                >
                  Open LMS
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setActiveTab ? setActiveTab('grades') : null}
                  sx={{ borderColor: '#CBD5E1', color: '#475569', fontSize: '0.74rem', textTransform: 'none', py: 0.5, flex: 1 }}
                >
                  View grades
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}

        {/* 6th Card: Academic Support Office */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#F8FAFC', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 0.8 }}>
              Need help with a course?
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.82rem', mb: 2, lineHeight: 1.4 }}>
              Book advisor office hours or request tutoring from the Academic Support office.
            </Typography>
            <Typography
              variant="body2"
              onClick={() => setAdvisorModalOpen(true)}
              sx={{ color: '#12808C', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Book office hours →
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Book Office Hours Dialog */}
      <Dialog open={advisorModalOpen} onClose={() => setAdvisorModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Book Advisor Office Hours</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Advisor" defaultValue="Dr. Tesfaye Melaku (Biblical Studies)" size="small" fullWidth disabled />
            <TextField label="Preferred Date & Time" defaultValue="Tuesday, 14:00 - 15:00" size="small" fullWidth />
            <TextField label="Reason for Appointment" placeholder="e.g. Exegetical paper guidance" size="small" fullWidth multiline rows={2} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAdvisorModalOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setAdvisorModalOpen(false)} sx={{ bgcolor: '#12808C', color: '#fff' }}>Confirm Booking</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
