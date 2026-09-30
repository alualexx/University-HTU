import React, { useState } from 'react';
import {
  Box, Typography, Card, Grid, TextField, Button, MenuItem, 
  Select, FormControl, InputLabel, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
  Chip, Tooltip
} from '@mui/material';
import {
  Search, Close, OpenInNew, Autorenew, EventNote, BookmarkAdd,
  MenuBook, CheckCircle, Warning, Lock, Description, ArrowBack,
  ArrowForward, Visibility
} from '@mui/icons-material';

const SAMPLE_RESULTS = [
  {
    id: 1,
    coverColor: '#1E293B',
    coverText: 'A HISTORY OF THE ETHIOPIAN CHURCH',
    title: 'A History of the Ethiopian Church',
    subtitleAmharic: 'የኢትዮጵያ ቤተ ክርስቲያን ታሪክ',
    author: 'Fr. Getachew Haile',
    year: '2019',
    callNo: 'Call No. BR60 .H34',
    location: 'Main Library',
    available: 3,
    total: 5,
    statusText: '3 of 5 available',
    statusType: 'available', // green
    type: 'physical',
  },
  {
    id: 2,
    coverColor: '#7F1D1D',
    coverText: 'CHURCH HISTORY — ETHIOPIA',
    title: 'Church History — Ethiopia: General Works',
    author: 'Dr. Abraham Mekonnen',
    year: '2021',
    callNo: 'Call No. BR65 .M45',
    location: 'Main Library',
    available: 1,
    total: 4,
    statusText: '1 of 4 available',
    statusType: 'warning', // amber
    type: 'physical',
  },
  {
    id: 3,
    coverColor: '#14532D',
    coverText: 'HISTORY OF THE ETHIOPIAN CHURCH',
    title: 'History of the Ethiopian Church',
    tag: 'M.Thesis',
    author: 'Selamawit Haile',
    year: '2017',
    callNo: 'Call No. THESIS 2017-14',
    location: 'Reading Room',
    available: 2,
    total: 2,
    statusText: '2 of 2 available',
    statusType: 'available', // green
    type: 'thesis',
  },
  {
    id: 4,
    coverColor: '#0F766E',
    coverText: 'DIGITAL EDITION',
    title: 'The Cambridge History of Christianity — Vol. 7',
    author: 'Cambridge UP',
    year: '2024',
    callNo: 'e-Resource',
    location: 'Online Access',
    statusText: 'Unlimited online',
    statusType: 'digital', // blue
    type: 'digital',
  },
  {
    id: 5,
    coverColor: '#D6C7A1',
    coverTextColor: '#451A03',
    coverText: "GE'EZ MS 0187",
    title: "Ge'ez Manuscript — Life of St. Yared",
    tag: 'Special Collection',
    author: '18th century',
    year: "Ge'ez",
    callNo: 'Call No. SC MS 0187',
    location: 'Special Collections',
    statusText: 'Restricted — by appointment',
    statusType: 'restricted', // red/rose
    type: 'manuscript',
  },
];

export default function LibCatalogTab({ onNavigateCirculation }) {
  const [searchQuery, setSearchQuery] = useState('church history');
  const [authorFilter, setAuthorFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('Church history');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [collectionFilter, setCollectionFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('Available now');
  const [sortBy, setSortBy] = useState('Relevance');
  const [page, setPage] = useState(1);

  // Modals
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [reserveModal, setReserveModal] = useState(null);
  const [manuscriptViewerOpen, setManuscriptViewerOpen] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);

  const handleCheckoutClick = (item) => {
    setCheckoutModal(item);
  };

  const handleReserveClick = (item) => {
    setReserveModal(item);
  };

  const handleOpenManuscript = (item) => {
    setSelectedManuscript(item || SAMPLE_RESULTS[4]);
    setManuscriptViewerOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Title & Subtitle */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px', mb: 0.5 }}>
          Library Catalog
        </Typography>
        <Typography variant="body1" sx={{ color: '#12808C', fontWeight: 600 }}>
          Discover. Borrow. Learn. Serve.
        </Typography>
      </Box>

      {/* Main Grid: Left Search + Results (8 cols), Right Sidebar (4 cols) */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {/* Search & Filters Container */}
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', mb: 3, bgcolor: '#fff' }}>
            {/* Primary Search Bar */}
            <TextField
              fullWidth
              size="medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, journals, theses, authors, subjects, ISBN..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#64748B', mr: 0.5 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Close fontSize="small" sx={{ color: '#94A3B8' }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: { 
                  borderRadius: '8px', 
                  bgcolor: '#fff',
                  border: '1px solid #CBD5E1',
                  '& fieldset': { border: 'none' },
                  fontSize: '0.95rem'
                }
              }}
              sx={{ mb: 2 }}
            />

            {/* Filter Dropdowns Row 1 */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Author</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Fr. Getachew Haile">Fr. Getachew Haile</MenuItem>
                  <MenuItem value="Dr. Abraham Mekonnen">Dr. Abraham Mekonnen</MenuItem>
                  <MenuItem value="Selamawit Haile">Selamawit Haile</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Subject</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Church history">Church history</MenuItem>
                  <MenuItem value="Biblical Studies">Biblical Studies</MenuItem>
                  <MenuItem value="Systematic Theology">Systematic Theology</MenuItem>
                  <MenuItem value="Ge'ez Liturgy">Ge'ez Liturgy</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Language</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Amharic">Amharic</MenuItem>
                  <MenuItem value="Ge'ez">Ge'ez</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Material Type</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Book">Book</MenuItem>
                  <MenuItem value="Manuscript">Manuscript</MenuItem>
                  <MenuItem value="Thesis">Thesis</MenuItem>
                  <MenuItem value="e-Resource">e-Resource</MenuItem>
                </Select>
              </Grid>
            </Grid>

            {/* Filter Dropdowns Row 2 */}
            <Grid container spacing={1.5} alignItems="flex-end">
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Year</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2020-2023">2020–2023</MenuItem>
                  <MenuItem value="2010-2019">2010–2019</MenuItem>
                  <MenuItem value="Pre-2000">Pre-2000</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Collection</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={collectionFilter}
                  onChange={(e) => setCollectionFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Main Library">Main Library</MenuItem>
                  <MenuItem value="Special Collections">Special Collections</MenuItem>
                  <MenuItem value="Reading Room">Reading Room</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mb: 0.5, display: 'block' }}>Availability</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={availFilter}
                  onChange={(e) => setAvailFilter(e.target.value)}
                  sx={{ borderRadius: '6px', fontSize: '0.82rem', bgcolor: '#F8FAFC' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Available now">Available now</MenuItem>
                  <MenuItem value="On Loan">On Loan</MenuItem>
                  <MenuItem value="Digital Only">Digital Only</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#0E2033',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 0.9,
                    borderRadius: '6px',
                    '&:hover': { bgcolor: '#1A334E' }
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Results Summary & Sorting Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
              Showing 1–12 of 248 results
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.84rem' }}>
                Sort by:
              </Typography>
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ 
                  bgcolor: '#fff', borderRadius: '6px', fontSize: '0.84rem', 
                  '& .MuiSelect-select': { py: 0.6, px: 1.5 } 
                }}
              >
                <MenuItem value="Relevance">Relevance</MenuItem>
                <MenuItem value="Newest">Newest First</MenuItem>
                <MenuItem value="Title">Title (A-Z)</MenuItem>
                <MenuItem value="Author">Author</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Result Cards List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SAMPLE_RESULTS.map((item) => {
              const isDigital = item.type === 'digital';
              const isManuscript = item.type === 'manuscript';

              return (
                <Card 
                  key={item.id}
                  sx={{ 
                    p: 2.5, borderRadius: '10px', border: '1px solid #E2E8F0', 
                    boxShadow: 'none', bgcolor: '#fff',
                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2.5, alignItems: { xs: 'flex-start', sm: 'center' },
                    transition: 'all 0.15s ease',
                    '&:hover': { borderColor: '#CBD5E1', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }
                  }}
                >
                  {/* Book Spine / Cover Mock */}
                  <Box sx={{
                    width: { xs: '100%', sm: 84 },
                    height: 104,
                    flexShrink: 0,
                    bgcolor: item.coverColor,
                    color: item.coverTextColor || '#fff',
                    borderRadius: '6px',
                    p: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <Typography sx={{ 
                      fontSize: '0.64rem', 
                      fontWeight: 900, 
                      letterSpacing: '0.5px',
                      lineHeight: 1.2,
                      textTransform: 'uppercase'
                    }}>
                      {item.coverText}
                    </Typography>
                  </Box>

                  {/* Middle Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '1rem', lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                      {item.tag && (
                        <Chip 
                          label={item.tag} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            bgcolor: item.tag === 'Special Collection' ? '#FEF3C7' : '#F1F5F9',
                            color: item.tag === 'Special Collection' ? '#B45309' : '#475569'
                          }} 
                        />
                      )}
                    </Box>

                    {item.subtitleAmharic && (
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', mb: 0.5, fontWeight: 500 }}>
                        {item.subtitleAmharic}
                      </Typography>
                    )}

                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', display: 'block', mb: 1.2 }}>
                      {item.author} &nbsp;·&nbsp; {item.year} &nbsp;·&nbsp; {item.callNo} &nbsp;·&nbsp; {item.location}
                    </Typography>

                    {/* Availability Bar & Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 300 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Box sx={{ 
                          width: 8, height: 8, borderRadius: '50%',
                          bgcolor: 
                            item.statusType === 'available' ? '#10B981' :
                            item.statusType === 'warning' ? '#F59E0B' :
                            item.statusType === 'digital' ? '#3B82F6' : '#EF4444'
                        }} />
                        <Typography variant="caption" sx={{ 
                          fontWeight: 700, 
                          color: 
                            item.statusType === 'available' ? '#047857' :
                            item.statusType === 'warning' ? '#B45309' :
                            item.statusType === 'digital' ? '#1D4ED8' : '#B91C1C',
                          fontSize: '0.78rem'
                        }}>
                          {item.statusText}
                        </Typography>
                      </Box>
                    </Box>

                    {item.total && (
                      <Box sx={{ width: '100%', maxWidth: 220, mt: 0.8 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(item.available / item.total) * 100} 
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: '#E2E8F0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: item.available === item.total ? '#10B981' : item.available === 1 ? '#F59E0B' : '#12808C'
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Actions Column */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'row', sm: 'column' }, 
                    gap: 1, 
                    width: { xs: '100%', sm: 110 },
                    flexShrink: 0
                  }}>
                    {isDigital ? (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleOpenManuscript(item)}
                        endIcon={<OpenInNew sx={{ fontSize: '14px !important' }} />}
                        sx={{
                          bgcolor: '#0E2033',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          py: 0.7,
                          borderRadius: '6px',
                          '&:hover': { bgcolor: '#1A334E' }
                        }}
                      >
                        Open
                      </Button>
                    ) : isManuscript ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleOpenManuscript(item)}
                        sx={{
                          borderColor: '#CBD5E1',
                          color: '#0E2033',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          py: 0.7,
                          borderRadius: '6px',
                          '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' }
                        }}
                      >
                        Request
                      </Button>
                    ) : (
                      <>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleCheckoutClick(item)}
                          disabled={item.available === 0}
                          sx={{
                            bgcolor: '#12808C',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textTransform: 'none',
                            py: 0.7,
                            borderRadius: '6px',
                            '&:hover': { bgcolor: '#0D626B' }
                          }}
                        >
                          Checkout
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleReserveClick(item)}
                          sx={{
                            borderColor: '#CBD5E1',
                            color: '#475569',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textTransform: 'none',
                            py: 0.7,
                            borderRadius: '6px',
                            '&:hover': { bgcolor: '#F8FAFC', borderColor: '#94A3B8' }
                          }}
                        >
                          Reserve
                        </Button>
                      </>
                    )}
                  </Box>
                </Card>
              );
            })}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 4, mb: 4 }}>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#64748B' }}>
              &lt;
            </Button>
            <Button size="small" variant="contained" sx={{ minWidth: 32, p: 0.5, bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>
              1
            </Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#0E2033', fontWeight: 600 }}>
              2
            </Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#0E2033', fontWeight: 600 }}>
              3
            </Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#0E2033', fontWeight: 600 }}>
              4
            </Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#0E2033', fontWeight: 600 }}>
              5
            </Button>
            <Typography variant="body2" sx={{ color: '#94A3B8', px: 0.5 }}>...</Typography>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#0E2033', fontWeight: 600 }}>
              21
            </Button>
            <Button size="small" variant="outlined" sx={{ minWidth: 32, p: 0.5, borderColor: '#E2E8F0', color: '#64748B' }}>
              &gt;
            </Button>
          </Box>
        </Grid>

        {/* Right Column: 4 Sidebar Cards */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Widget 1: Circulation Actions (2x2 Grid) */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
                Circulation Actions
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={onNavigateCirculation}
                    sx={{
                      bgcolor: '#0E2033',
                      color: '#fff',
                      py: 2,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.8,
                      '&:hover': { bgcolor: '#1A334E' }
                    }}
                  >
                    <OpenInNew sx={{ fontSize: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'none' }}>Checkout</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={onNavigateCirculation}
                    sx={{
                      bgcolor: '#12808C',
                      color: '#fff',
                      py: 2,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.8,
                      '&:hover': { bgcolor: '#0D626B' }
                    }}
                  >
                    <Autorenew sx={{ fontSize: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'none' }}>Return</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={onNavigateCirculation}
                    sx={{
                      bgcolor: '#D9A621',
                      color: '#0E2033',
                      py: 2,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.8,
                      '&:hover': { bgcolor: '#C59318' }
                    }}
                  >
                    <Autorenew sx={{ fontSize: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'none' }}>Renew</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={() => setReserveModal(SAMPLE_RESULTS[0])}
                    sx={{
                      bgcolor: '#6B46C1',
                      color: '#fff',
                      py: 2,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.8,
                      '&:hover': { bgcolor: '#553C9A' }
                    }}
                  >
                    <EventNote sx={{ fontSize: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'none' }}>Reserve</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Card>

            {/* Widget 2: My Account Overview */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
                My Account Overview
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Overdue Items</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View details</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626' }}>2</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Total Fines</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Pay fines</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626' }}>ETB 120.00</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Items on Loan</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>View loans</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#12808C' }}>3</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E2033' }}>Active Reservations</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Queue positions</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>1</Typography>
                </Box>
              </Box>
            </Card>

            {/* Widget 3: Member Privileges Table */}
            <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 1.5 }}>
                Member Privileges
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1, px: 1, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                      <TableCell>MEMBER TYPE</TableCell>
                      <TableCell align="center">MAX BOOKS</TableCell>
                      <TableCell align="right">LOAN PERIOD</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '& td': { py: 1, px: 1, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0E2033' }}>Students</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>5</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>14 days</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 1, px: 1, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0E2033' }}>Faculty</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>10</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>30 days</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 1, px: 1, borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0E2033' }}>Staff</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>5</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>21 days</TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { py: 1, px: 1, borderBottom: 'none', fontSize: '0.8rem' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#0E2033' }}>External Researchers</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>3</TableCell>
                      <TableCell align="right" sx={{ color: '#64748B' }}>7 days</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, fontSize: '0.72rem', lineHeight: 1.4, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                Overdue fine ETB 2/day · reserve ETB 5/day · max 2 renewals · suspension above ETB 200.
              </Typography>
            </Card>

            {/* Widget 4: Digital Manuscript Viewer Card */}
            <Card sx={{ 
              p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', 
              boxShadow: 'none', bgcolor: '#fff',
              display: 'flex', flexDirection: 'column', gap: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 0.5 }}>
                    Digital Manuscript Viewer
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.4 }}>
                    Explore rare Ge'ez manuscripts from our special collections.
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 48, height: 48, borderRadius: '8px', 
                  bgcolor: '#FEF3C7', color: '#D9A621',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MenuBook sx={{ fontSize: 28 }} />
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={() => handleOpenManuscript(null)}
                endIcon={<OpenInNew sx={{ fontSize: '15px !important' }} />}
                sx={{
                  bgcolor: '#0E2033',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  py: 1,
                  borderRadius: '6px',
                  '&:hover': { bgcolor: '#1A334E' }
                }}
              >
                Open Viewer
              </Button>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Checkout Modal */}
      <Dialog open={Boolean(checkoutModal)} onClose={() => setCheckoutModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>
          Circulation Desk Checkout
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {checkoutModal && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0E2033' }}>
                  {checkoutModal.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  {checkoutModal.callNo} · {checkoutModal.location}
                </Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Patron ID / Barcode"
                defaultValue="HTTU24158 (Daniel Gebremariam)"
              />
              <TextField
                fullWidth
                size="small"
                label="Item Barcode"
                defaultValue="HTTU-LIB-00918"
              />
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                ✓ Patron verified: Loan period 14 days · Due: October 14, 2026
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCheckoutModal(null)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setCheckoutModal(null)}
            sx={{ bgcolor: '#12808C', color: '#fff', fontWeight: 700 }}
          >
            Confirm Checkout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reserve Modal */}
      <Dialog open={Boolean(reserveModal)} onClose={() => setReserveModal(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>
          Hold & Reservation Request
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {reserveModal && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">
                Place a hold on <strong>{reserveModal.title}</strong>. You will be notified via SMS and email when the item is ready at the Main Circulation Desk.
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Patron ID"
                defaultValue="HTTU24158"
              />
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Hold fee: ETB 5.00 · Reserved shelf hold period: 3 calendar days upon arrival.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReserveModal(null)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setReserveModal(null)}
            sx={{ bgcolor: '#6B46C1', color: '#fff', fontWeight: 700 }}
          >
            Confirm Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manuscript Viewer Modal */}
      <Dialog open={manuscriptViewerOpen} onClose={() => setManuscriptViewerOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Ge'ez Manuscript Viewer — Special Collections
          </Typography>
          <IconButton size="small" onClick={() => setManuscriptViewerOpen(false)} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#0E1726', color: '#fff' }}>
          <Box sx={{ textAlign: 'center', p: 3, border: '2px dashed #334155', borderRadius: '12px', bgcolor: '#0A0F1D' }}>
            <Typography variant="h5" sx={{ color: '#D9A621', fontFamily: 'serif', mb: 2 }}>
              በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto', mb: 3 }}>
              Item SC MS 0187: 18th Century Parchment Manuscript (Branna) recounting the hymns and life of St. Yared (ዛሬድ). Preserved under climate-controlled vault archives at Holy Trinity Theology University Library.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Chip label="Resolution: 600 DPI IIIF" sx={{ bgcolor: '#1E293B', color: '#38BDF8' }} />
              <Chip label="Condition: Pristine" sx={{ bgcolor: '#1E293B', color: '#4ADE80' }} />
              <Chip label="Access: On-Premises Reading Room" sx={{ bgcolor: '#1E293B', color: '#FACC15' }} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#0E2033' }}>
          <Button onClick={() => setManuscriptViewerOpen(false)} sx={{ color: '#D9A621', fontWeight: 700 }}>
            Close Viewer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
