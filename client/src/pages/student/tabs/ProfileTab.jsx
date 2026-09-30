import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Avatar, Button, Chip, 
  LinearProgress, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Divider
} from '@mui/material';
import {
  CheckCircle, Description, UploadFile, Edit, 
  School, Phone, Email, LocationOn, Person, ArrowForward
} from '@mui/icons-material';

export default function ProfileTab({ setActiveTab }) {
  const [subTab, setSubTab] = useState('Overview');
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);

  const subTabs = ['Overview', 'Contacts', 'Addresses', 'Documents', 'Enrollment History', 'Emergency Contact'];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
          Student Portal / My Profile
        </Typography>
      </Box>

      {/* Top Profile Banner Card */}
      <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{ width: 68, height: 68, bgcolor: '#0E2033', color: '#fff', fontSize: '1.4rem', fontWeight: 900 }}>
              DG
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0E2033' }}>
                  Daniel Gebremariam
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748B', fontWeight: 600 }}>
                  ዳንኤል ገብረማርያም
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3, mb: 1 }}>
                B.A. in Theology · Year 3 · Student ID HTTU-2026-0001 (HTTU24158)
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="• Active" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                <Chip label="Good Standing" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                <Chip label="Dean's List · Fall 2024" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
              </Stack>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              onClick={() => setEditContactOpen(true)}
              sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}
            >
              Update contacts
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveTab ? setActiveTab('grades') : null}
              sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#C59318' } }}
            >
              Request transcript
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* Internal Navigation Sub-tabs */}
      <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 3 }}>
        <Stack direction="row" spacing={3} sx={{ overflowX: 'auto' }}>
          {subTabs.map((tab) => (
            <Typography
              key={tab}
              onClick={() => setSubTab(tab)}
              sx={{
                pb: 1.5,
                fontSize: '0.88rem',
                fontWeight: subTab === tab ? 800 : 600,
                color: subTab === tab ? '#0E2033' : '#64748B',
                borderBottom: subTab === tab ? '2px solid #D9A621' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </Typography>
          ))}
        </Stack>
      </Box>

      {/* 2-Column Grid */}
      <Grid container spacing={3}>
        {/* Left Column (8 cols): Personal Info, Academic Summary, My Documents */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Card 1: Personal Information */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Personal Information
                </Typography>
                <Chip label="Verified by Registrar" size="small" sx={{ bgcolor: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', fontSize: '0.72rem', height: 22 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Date of Birth</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Mar 14, 2001</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Gender</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Male</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Nationality</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Ethiopian</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Baptism Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Abba Daniel</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Church Parish</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>St. Maryam Parish, Addis Ababa</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Languages</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Amharic, English, Geez (basic)</Typography>
                </Grid>
              </Grid>
            </Card>

            {/* Card 2: Academic Summary */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Academic Summary
                </Typography>
                <Typography 
                  variant="caption" 
                  onClick={() => setActiveTab ? setActiveTab('grades') : null}
                  sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  Degree audit →
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Program</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>B.A. in Theology (160 credits)</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Admission Year</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>2023/2024 · Fall intake</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Current Term</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Spring Semester 2025 · Week 8 of 16</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Credits Earned</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>99 / 160 · 62%</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Cumulative GPA</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', mt: 0.3 }}>3.42 · Good Standing</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>Academic Advisor</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.3 }}>Dr. Tesfaye Melaku</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={62} 
                  sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#12808C' } }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.8 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>62% of program completed</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>61 credits remaining</Typography>
                </Box>
              </Box>
            </Card>

            {/* Card 3: My Documents */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  My Documents
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setUploadDocOpen(true)}
                  startIcon={<UploadFile />}
                  sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
                >
                  Upload
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>High School Transcript</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Uploaded Sep 12, 2023 · PDF · 2 pages</Typography>
                  </Box>
                  <Chip label="• Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Baptism Certificate</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Uploaded Sep 12, 2023 · PDF · 1 page</Typography>
                  </Box>
                  <Chip label="• Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>National ID (Fayda)</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Uploaded Sep 14, 2023 · JPG</Typography>
                  </Box>
                  <Chip label="• Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Recommendation Letter — Parish Priest</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Uploaded Sep 15, 2023 · PDF</Typography>
                  </Box>
                  <Chip label="• Awaiting review" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Right Column (4 cols): Student ID Card, Contact Details, Enrollment History, Emergency Contact */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Widget 1: STUDENT ID CARD */}
            <Card sx={{
              p: 3,
              borderRadius: '16px',
              bgcolor: '#0E2033',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(14, 32, 51, 0.25)',
              border: '1px solid rgba(217, 166, 33, 0.3)'
            }}>
              {/* Gold watermark cross background */}
              <Box sx={{
                position: 'absolute',
                right: -15,
                top: -15,
                width: 130,
                height: 130,
                borderRadius: '50%',
                border: '2px solid rgba(217, 166, 33, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(217, 166, 33, 0.15)',
                fontSize: '80px',
                fontWeight: 'bold',
                pointerEvents: 'none'
              }}>
                ✝
              </Box>

              <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 800, letterSpacing: 2, fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', mb: 1.5 }}>
                STUDENT ID CARD
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2, mb: 0.5 }}>
                Daniel Gebremariam · ዳንኤል
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', display: 'block' }}>ID NUMBER</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>HTTU24158</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', display: 'block' }}>PROGRAM</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#fff' }}>B.A. Theology</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', display: 'block' }}>VALID THRU</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#D9A621' }}>Jul 2027</Typography>
                </Box>
              </Box>
            </Card>

            {/* Widget 2: Contact Details */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  Contact Details
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setEditContactOpen(true)}
                  sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none' }}
                >
                  Edit
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Email</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>daniel.g@httu.edu.et</Typography>
                    <Chip label="• Verified" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontSize: '0.68rem', height: 18 }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Phone</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>+251 914 552 118</Typography>
                    <Chip label="Primary" size="small" sx={{ bgcolor: '#F1F5F9', color: '#475569', fontSize: '0.68rem', height: 18 }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Alt. Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.2 }}>+251 11 667 4402</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Address</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033', mt: 0.2 }}>Bole Sub-city, Woreda 03, Addis Ababa</Typography>
                </Box>
              </Box>
            </Card>

            {/* Widget 3: Enrollment History */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 1.5 }}>
                Enrollment History
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 0.8, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                      <TableCell>TERM</TableCell>
                      <TableCell align="center">CREDITS</TableCell>
                      <TableCell align="right">GPA</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '& td': { py: 0.8, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#0E2033' }}>Spring 2025 <span style={{ color: '#64748B', fontWeight: 400 }}>in progress</span></TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>15</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>—</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 0.8, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#0E2033' }}>Fall 2024</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>18</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#059669' }}>3.65</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 0.8, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#0E2033' }}>Spring 2024</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>17</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#0E2033' }}>3.41</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 0.8, borderBottom: 'none', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#0E2033' }}>Fall 2023</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>16</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#0E2033' }}>3.28</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Widget 4: Emergency Contact */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 1.5 }}>
                Emergency Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Marta Gebremariam</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Relationship</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Mother</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>+251 911 208 774</Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Contact Dialog */}
      <Dialog open={editContactOpen} onClose={() => setEditContactOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Update Contact Details</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Primary Phone" defaultValue="+251 914 552 118" size="small" fullWidth />
            <TextField label="Alt Phone" defaultValue="+251 11 667 4402" size="small" fullWidth />
            <TextField label="Residential Address" defaultValue="Bole Sub-city, Woreda 03, Addis Ababa" size="small" fullWidth multiline rows={2} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditContactOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditContactOpen(false)} sx={{ bgcolor: '#12808C', color: '#fff' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocOpen} onClose={() => setUploadDocOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Upload Verification Document</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Document Title" placeholder="e.g. Parish Recommendation" size="small" fullWidth />
            <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ py: 1.5, borderColor: '#CBD5E1' }}>
              Choose File (PDF or JPG)
              <input type="file" hidden />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUploadDocOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setUploadDocOpen(false)} sx={{ bgcolor: '#12808C', color: '#fff' }}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
