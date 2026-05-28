import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Stack, Chip, Tooltip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, alpha, CircularProgress, Alert, MenuItem
} from '@mui/material';
import { Add, Edit, Delete, Grade, RestartAlt, Save } from '@mui/icons-material';
import { db } from '../../../services/Firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query
} from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

// HTU default grading scale (seeded on first load)
const DEFAULT_GRADES = [
  { minMark: 90, maxMark: 100, fixedGrade: 4.0,  letterGrade: 'A+',  status: 'Excellent',       classDesc: 'First class with Great distinction' },
  { minMark: 85, maxMark: 89,  fixedGrade: 4.0,  letterGrade: 'A',   status: 'Excellent',       classDesc: 'First class with Great distinction' },
  { minMark: 80, maxMark: 84,  fixedGrade: 3.75, letterGrade: 'A-',  status: '',                classDesc: ''                                   },
  { minMark: 75, maxMark: 79,  fixedGrade: 3.5,  letterGrade: 'B+',  status: 'Very Good',       classDesc: 'First class with Distinction'       },
  { minMark: 70, maxMark: 74,  fixedGrade: 3.0,  letterGrade: 'B',   status: 'Very Good',       classDesc: 'First class with Distinction'       },
  { minMark: 65, maxMark: 69,  fixedGrade: 2.75, letterGrade: 'B-',  status: 'Good',            classDesc: 'First class'                        },
  { minMark: 60, maxMark: 64,  fixedGrade: 2.5,  letterGrade: 'C+',  status: '',                classDesc: 'Second class'                       },
  { minMark: 50, maxMark: 59,  fixedGrade: 2.0,  letterGrade: 'C',   status: 'Satisfactory',    classDesc: 'Second class'                       },
  { minMark: 45, maxMark: 49,  fixedGrade: 1.75, letterGrade: 'C-',  status: 'Unsatisfactory',  classDesc: 'Lower class'                        },
  { minMark: 40, maxMark: 44,  fixedGrade: 1.0,  letterGrade: 'D',   status: 'Very Poor',       classDesc: 'Lower class'                        },
  { minMark: 30, maxMark: 39,  fixedGrade: 0.0,  letterGrade: 'Fx',  status: 'Fail',            classDesc: 'Lowest class'                       },
  { minMark: 0,  maxMark: 29,  fixedGrade: 0.0,  letterGrade: 'F',   status: 'Fail',            classDesc: 'Lowest class'                       },
];

const LETTER_GRADE_COLORS = {
  'A+': '#10b981', 'A': '#10b981', 'A-': '#34d399',
  'B+': '#6366f1', 'B': '#6366f1', 'B-': '#818cf8',
  'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#fbbf24',
  'D':  '#f97316',
  'Fx': '#ef4444', 'F': '#dc2626',
};

const STATUS_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Unsatisfactory', 'Very Poor', 'Fail', ''];

const emptyForm = {
  minMark: '', maxMark: '', fixedGrade: '', letterGrade: '', status: '', classDesc: ''
};

const GradingSystemTab = ({ isDark, glassStyle }) => {
  const { logAuditActivity } = useAuth();
  const [grades, setGrades]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [seeding, setSeeding]     = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing]     = useState(null); // null = add, object = edit
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [error, setError]         = useState('');

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'grading_system'), orderBy('minMark', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setGrades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error('Grading system fetch error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Seed defaults if collection is empty
  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const col = collection(db, 'grading_system');
      await Promise.all(DEFAULT_GRADES.map(g => addDoc(col, { ...g, createdAt: serverTimestamp() })));
      logAuditActivity?.('Grading System Seeded', 'Loaded HTU default grading scale');
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (grade) => {
    setEditing(grade);
    setForm({
      minMark:    grade.minMark ?? '',
      maxMark:    grade.maxMark ?? '',
      fixedGrade: grade.fixedGrade ?? '',
      letterGrade: grade.letterGrade ?? '',
      status:     grade.status ?? '',
      classDesc:  grade.classDesc ?? '',
    });
    setError('');
    setDialogOpen(true);
  };

  const validate = () => {
    if (form.minMark === '' || form.maxMark === '') return 'Min and Max marks are required.';
    if (Number(form.minMark) > Number(form.maxMark))  return 'Min mark cannot exceed Max mark.';
    if (form.letterGrade.trim() === '')                return 'Letter grade is required.';
    if (form.fixedGrade === '')                        return 'Fixed grade number is required.';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);
    try {
      const payload = {
        minMark:    Number(form.minMark),
        maxMark:    Number(form.maxMark),
        fixedGrade: Number(form.fixedGrade),
        letterGrade: form.letterGrade.trim().toUpperCase(),
        status:     form.status,
        classDesc:  form.classDesc,
        updatedAt:  serverTimestamp(),
      };
      if (editing) {
        await updateDoc(doc(db, 'grading_system', editing.id), payload);
        logAuditActivity?.('Grading Scale Updated', `Updated grade band: ${payload.letterGrade}`);
      } else {
        await addDoc(collection(db, 'grading_system'), { ...payload, createdAt: serverTimestamp() });
        logAuditActivity?.('Grading Scale Created', `Added grade band: ${payload.letterGrade}`);
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'grading_system', id));
      logAuditActivity?.('Grading Scale Deleted', `Removed grade band ID: ${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const cellSx = { borderBottom: `1px solid ${borderColor}`, py: 2.5 };
  const headSx = { borderBottom: `2px solid ${borderColor}`, fontWeight: 900, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1.5, py: 3 };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>
            Grading System
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 2, opacity: 0.7 }}>
            HTU UNDERGRADUATE GRADING SCALE · {grades.length} BANDS DEFINED
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {grades.length === 0 && !loading && (
            <Button
              variant="outlined"
              startIcon={seeding ? <CircularProgress size={16} color="inherit" /> : <RestartAlt />}
              onClick={handleSeedDefaults}
              disabled={seeding}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3 }}
            >
              Load HTU Defaults
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAdd}
            sx={{
              borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.25)'
            }}
          >
            Add Grade Band
          </Button>
        </Stack>
      </Box>

      {/* Info banner */}
      <Box sx={{
        mb: 3, p: 2.5, borderRadius: 4,
        background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.05)',
        border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)'}`,
        display: 'flex', alignItems: 'center', gap: 2
      }}>
        <Grade sx={{ color: '#6366f1', fontSize: 22 }} />
        <Typography variant="body2" fontWeight={800} color="text.secondary">
          Continuous assessment accounts for 50–60% of the total grade. The remaining 40–50% is allocated to the final exam. A student must score at least <strong>C (2.0)</strong> in each module and maintain a CGPA ≥ 2.0 to graduate.
        </Typography>
      </Box>

      {/* Table */}
      <Card sx={{ ...glassStyle, borderRadius: 6, border: `1px solid ${borderColor}` }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : grades.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12, opacity: 0.3 }}>
              <Grade sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" fontWeight={1000}>NO GRADING BANDS CONFIGURED</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Use "Load HTU Defaults" to seed the standard scale.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Raw Mark Range', 'Fixed Grade', 'Letter Grade', 'Status Description', 'Class Description', 'Actions'].map(h => (
                      <TableCell key={h} sx={headSx}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map(grade => {
                    const color = LETTER_GRADE_COLORS[grade.letterGrade] || '#6366f1';
                    return (
                      <TableRow
                        key={grade.id}
                        sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}
                      >
                        {/* Range */}
                        <TableCell sx={cellSx}>
                          <Box sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1,
                            px: 2, py: 0.8, borderRadius: 3,
                            bgcolor: alpha(color, 0.1), border: `1px solid ${alpha(color, 0.25)}`
                          }}>
                            <Typography variant="body2" fontWeight={1000} sx={{ fontFamily: 'monospace', color }}>
                              [{grade.minMark} – {grade.maxMark}]
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Fixed Grade */}
                        <TableCell sx={cellSx}>
                          <Typography variant="body2" fontWeight={1000} sx={{ fontFamily: 'monospace', color }}>
                            {Number(grade.fixedGrade).toFixed(2)}
                          </Typography>
                        </TableCell>

                        {/* Letter Grade */}
                        <TableCell sx={cellSx}>
                          <Chip
                            label={grade.letterGrade}
                            size="small"
                            sx={{
                              fontWeight: 1000, fontSize: '0.85rem', px: 1,
                              bgcolor: alpha(color, 0.15), color,
                              border: `1px solid ${alpha(color, 0.3)}`
                            }}
                          />
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={cellSx}>
                          <Typography variant="body2" fontWeight={800} color={grade.status ? 'text.primary' : 'text.disabled'}>
                            {grade.status || '—'}
                          </Typography>
                        </TableCell>

                        {/* Class Description */}
                        <TableCell sx={cellSx}>
                          <Typography variant="body2" fontWeight={700} color="text.secondary">
                            {grade.classDesc || '—'}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell sx={cellSx} align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Edit Band">
                              <IconButton size="small" onClick={() => openEdit(grade)} sx={{ color: 'primary.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Band">
                              <IconButton size="small" onClick={() => setDeleteId(grade.id)} sx={{ color: 'error.main', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            ...glassStyle, borderRadius: 6,
            bgcolor: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)',
            backgroundImage: 'none', p: 1
          }
        }}
      >
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>
            {editing ? 'Edit Grade Band' : 'Add Grade Band'}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 2 }}>
            GRADING SCALE CONFIGURATION
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
          <Stack spacing={3}>
            {/* Mark Range Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Min Mark" type="number"
                value={form.minMark}
                onChange={e => setForm(f => ({ ...f, minMark: e.target.value }))}
                InputProps={{ inputProps: { min: 0, max: 100 }, sx: { borderRadius: 3 } }}
              />
              <TextField
                label="Max Mark" type="number"
                value={form.maxMark}
                onChange={e => setForm(f => ({ ...f, maxMark: e.target.value }))}
                InputProps={{ inputProps: { min: 0, max: 100 }, sx: { borderRadius: 3 } }}
              />
            </Box>

            {/* Grade Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Fixed Grade Number" type="number"
                value={form.fixedGrade}
                onChange={e => setForm(f => ({ ...f, fixedGrade: e.target.value }))}
                InputProps={{ inputProps: { min: 0, max: 4, step: 0.25 }, sx: { borderRadius: 3 } }}
                helperText="e.g. 4.0, 3.75, 2.5"
              />
              <TextField
                label="Letter Grade"
                value={form.letterGrade}
                onChange={e => setForm(f => ({ ...f, letterGrade: e.target.value }))}
                InputProps={{ sx: { borderRadius: 3 } }}
                helperText="e.g. A+, B, C-"
              />
            </Box>

            {/* Status */}
            <TextField
              select fullWidth label="Status Description"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              InputProps={{ sx: { borderRadius: 3 } }}
            >
              {STATUS_OPTIONS.map(s => (
                <MenuItem key={s} value={s}>{s || '— None —'}</MenuItem>
              ))}
            </TextField>

            {/* Class Desc */}
            <TextField
              fullWidth label="Class Description"
              value={form.classDesc}
              onChange={e => setForm(f => ({ ...f, classDesc: e.target.value }))}
              InputProps={{ sx: { borderRadius: 3 } }}
              helperText="e.g. First class with Great distinction"
            />
          </Stack>
        </DialogContent>

        <Box sx={{ p: 4, pt: 0, display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={() => setDialogOpen(false)} sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>
            Cancel
          </Button>
          <Button
            fullWidth variant="contained" onClick={handleSave} disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
            sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000, background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            {editing ? 'Update Band' : 'Create Band'}
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { ...glassStyle, borderRadius: 5, bgcolor: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)', backgroundImage: 'none' } }}
      >
        <DialogTitle fontWeight={900}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove this grade band from the grading scale. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(deleteId)} sx={{ borderRadius: 2, fontWeight: 900, px: 4 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradingSystemTab;
