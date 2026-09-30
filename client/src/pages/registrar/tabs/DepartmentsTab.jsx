import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Card, Typography, Stack, TextField, MenuItem, Button,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, useTheme, Grid, IconButton, Avatar, Tooltip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AccountBalance, People, LibraryBooks, TrendingUp, Search,
  Download, School, Business, BarChart, Group, Percent, Add, Edit, Delete, Lock
} from "@mui/icons-material";
import { departmentsAPI } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

export default function DepartmentsTab({
  departments: departmentsProp = [],
  colleges = [],
  students = [],
  courses = [],
  glassStyle,
  setDepartments: setParentDepartments
}) {
  const { logAuditActivity, verifyOTP, markOTPUsed } = useAuth();
  const theme = useTheme();
  const [search, setSearch] = useState("");

  // Local state so delete/create updates instantly
  const [departments, setDepartments] = useState(departmentsProp);
  const fetchDepts = useCallback(async () => {
    try { const r = await departmentsAPI.getAll(); setDepartments(r.data); } catch (e) { }
  }, []);
  useEffect(() => {
    if (departmentsProp?.length) setDepartments(departmentsProp);
    else fetchDepts();
  }, [departmentsProp, fetchDepts]);

  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: "", collegeId: "", hod: "", college: "", code: "" });
  const [deptOtp, setDeptOtp] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, dept: null, loading: false });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const handleOpenDialog = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ name: dept.name, collegeId: dept.collegeId?._id || dept.collegeId, hod: dept.hod, college: dept.college, code: dept.code || "" });
      setDeptOtp("EXEMPT_FOR_EDIT");
    } else {
      setEditingDept(null);
      setDeptForm({ name: "", collegeId: "", hod: "", college: "", code: "" });
      setDeptOtp("");
    }
    setOpenDeptDialog(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    setDeptLoading(true);
    try {
      if (!editingDept) {
        const otpResult = await verifyOTP(deptOtp, "DEPARTMENT_CREATE");
        if (!otpResult.success) {
          showSnackbar(otpResult.message || "Invalid or expired OTP.", "error");
          setDeptLoading(false);
          return;
        }

        const selectedCol = colleges.find(c => c.id === deptForm.collegeId || c._id === deptForm.collegeId);
        const payload = { ...deptForm, college: selectedCol ? selectedCol.name : "" };

        await departmentsAPI.create(payload);
        await markOTPUsed(otpResult.otpId);
        logAuditActivity("Department Creation", `Created new department: ${deptForm.name}`);
        const res = await departmentsAPI.getAll();
        setDepartments(res.data);
        if (setParentDepartments) setParentDepartments(res.data);
        showSnackbar("Department provisioned successfully!", "success");
      } else {
        const selectedCol = colleges.find(c => c.id === deptForm.collegeId || c._id === deptForm.collegeId);
        const payload = { ...deptForm, college: selectedCol ? selectedCol.name : deptForm.college };
        await departmentsAPI.update(editingDept.id || editingDept._id, payload);
        logAuditActivity("Department Update", `Updated department: ${deptForm.name}`);
        const res = await departmentsAPI.getAll();
        setDepartments(res.data);
        if (setParentDepartments) setParentDepartments(res.data);
        showSnackbar("Department details updated.", "success");
      }
      setOpenDeptDialog(false);
    } catch (err) {
      showSnackbar(`Error: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setDeptLoading(false);
    }
  };

  const handleDeleteDept = (dept) => {
    setDeleteDialog({ open: true, dept, loading: false });
  };

  const confirmDeleteDept = async () => {
    const dept = deleteDialog.dept;
    const id = dept?._id || dept?.id;
    if (!id) { showSnackbar('Missing department ID.', 'error'); setDeleteDialog({ open: false, dept: null, loading: false }); return; }
    setDeleteDialog(d => ({ ...d, loading: true }));
    try {
      await departmentsAPI.delete(String(id));
      setDepartments(prev => prev.filter(d => String(d._id || d.id) !== String(id)));
      if (setParentDepartments) setParentDepartments(prev => prev.filter(d => String(d._id || d.id) !== String(id)));
      logAuditActivity('Department Deletion', `Deleted: ${dept.name}`);
      showSnackbar(`"${dept.name}" removed successfully.`, 'success');
    } catch (err) {
      showSnackbar(`Delete failed: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setDeleteDialog({ open: false, dept: null, loading: false });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={1000}>Departmental Oversite & Performance</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>MONITOR ENROLLMENT QUOTAS, ACADEMIC PERFORMANCE, AND RESOURCE UTILIZATION PER FACULTY SECTOR</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Operational Report</Button>
          <Button variant="contained" className="btn-premium" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Provision Department
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Avg Enrollment', val: '84%', icon: <People />, color: '#10b981' },
          { label: 'Resource Load', val: '72%', icon: <TrendingUp />, color: '#6366f1' },
          { label: 'Academic Standing', val: '3.4 GPA', icon: <School />, color: '#a855f7' },
          { label: 'Accredited Sectors', val: departments.length, icon: <Business />, color: '#f59e0b' },
        ].map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ ...glassStyle, p: 3, borderRadius: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(s.color, 0.1), color: s.color, borderRadius: 2.5 }}>{s.icon}</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={1000}>{s.label.toUpperCase()}</Typography>
                  <Typography variant="h5" fontWeight={1000}>{s.val}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ ...glassStyle, borderRadius: 6, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
          <TextField size="small" placeholder="Search department name..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Department Sector", "Head of Dept", "Faculty", "Students", "Courses", "Intake Ratio", "Actions"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase())).map((d, i) => {
                const studentCount = students.filter(s => s.department === d.name).length;
                const courseCount = courses.filter(c => c.department === d.name).length;
                const ratio = Math.min((studentCount / 400) * 100, 100);
                return (
                  <TableRow key={i}>
                    <TableCell><Typography variant="body2" fontWeight={1000}>{d.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{d.hod || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={800}>{d.college || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={900}>{studentCount}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={900}>{courseCount}</Typography></TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={ratio} sx={{ flexGrow: 1, height: 6, borderRadius: 4 }} />
                        <Typography variant="caption" fontWeight={1000}>{ratio.toFixed(0)}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Modify Details"><IconButton size="small" onClick={() => handleOpenDialog(d)}><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Disband Department"><IconButton size="small" color="error" onClick={() => handleDeleteDept(d)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Initialize Department Dialog */}
      <Dialog open={openDeptDialog} onClose={() => setOpenDeptDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Typography variant="h5" fontWeight={1000}>{editingDept ? 'Modify Department' : 'Initialize Department'}</Typography>
        </DialogTitle>
        <form onSubmit={handleSaveDept}>
          <DialogContent sx={{ p: 4 }}>
            {!editingDept && (
              <Box sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: alpha('#6366f1', 0.05), border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                <Typography variant="caption" color="primary.main" fontWeight={1000} display="block" sx={{ mb: 1 }}>AUTHENTICATION REQUIRED</Typography>
                <TextField fullWidth label="OTP (DEPARTMENT_CREATE)" value={deptOtp} onChange={e => setDeptOtp(e.target.value)} required InputProps={{ sx: { borderRadius: 3 }, startAdornment: <Lock sx={{ mr: 1, opacity: 0.5 }} /> }} />
              </Box>
            )}
            <Stack spacing={3}>
              <TextField fullWidth label="Department Name" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} required InputProps={{ sx: { borderRadius: 3 } }} />
              <TextField fullWidth label="Department Code" value={deptForm.code} onChange={e => setDeptForm({ ...deptForm, code: e.target.value })} required InputProps={{ sx: { borderRadius: 3 } }} />
              <TextField select fullWidth label="Parent College" value={deptForm.collegeId} onChange={e => setDeptForm({ ...deptForm, collegeId: e.target.value })} required InputProps={{ sx: { borderRadius: 3 } }}>
                {colleges.map(c => (
                  <MenuItem key={c._id || c.id} value={c._id || c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Head of Department" value={deptForm.hod} onChange={e => setDeptForm({ ...deptForm, hod: e.target.value })} InputProps={{ sx: { borderRadius: 3 } }} />
            </Stack>
          </DialogContent>
          <Box sx={{ p: 4, pt: 0, display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpenDeptDialog(false)} sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>Cancel</Button>
            <Button fullWidth variant="contained" type="submit" disabled={deptLoading} sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>
              {deptLoading ? <CircularProgress size={24} color="inherit" /> : 'Execute Provision'}
            </Button>
          </Box>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => !deleteDialog.loading && setDeleteDialog({ open: false, dept: null, loading: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{deleteDialog.dept?.name}</strong>? This determines massive structural orphans.
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={() => setDeleteDialog({ open: false, dept: null, loading: false })} disabled={deleteDialog.loading} sx={{ borderRadius: 3, fontWeight: 900 }}>Cancel</Button>
          <Button fullWidth variant="contained" color="error" onClick={confirmDeleteDept} disabled={deleteDialog.loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
            {deleteDialog.loading ? <CircularProgress size={22} color="inherit" /> : 'Delete Department'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
