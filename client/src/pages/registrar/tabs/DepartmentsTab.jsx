import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, 
  Stack, Avatar, Chip, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, alpha,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { 
  Add, AccountTree, Edit, Delete, School, LocationOn, 
  Timer, Lock, CheckCircle, Error 
} from '@mui/icons-material';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../services/Firebase';
import { useAuth } from '../../../context/AuthContext';

const DepartmentsTab = ({ departments, colleges, isDark, glassStyle }) => {
  const { logAuditActivity, verifyOTP, markOTPUsed } = useAuth();
  
  // Local UI State for Department Dialog
  const [openDeptDialog, setOpenDeptDialog] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({
    name: "", 
    code: "", 
    description: "", 
    headName: "", 
    headEmail: "",
    collegeId: "",
    duration: "4 Years", 
    seats: 100, 
    requirements: "", 
    iconUrl: "", 
    color: "#1976d2",
    isPublished: true,
    admissionOpen: true,
    requiredDocuments: "Transcript, ID/Passport, Photo"
  });
  const [deptOtp, setDeptOtp] = useState("");

  const handleOpenDeptDialog = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ ...dept });
    } else {
      setEditingDept(null);
      setDeptForm({ 
        name: "", code: "", description: "", headName: "", headEmail: "", collegeId: "",
        duration: "4 Years", seats: 100, requirements: "", iconUrl: "", color: "#1976d2",
        isPublished: true, admissionOpen: true, requiredDocuments: "Transcript, ID/Passport, Photo"
      });
      setDeptOtp("");
    }
    setOpenDeptDialog(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    console.log("Saving department...", deptForm);
    try {
      if (!editingDept) {
        // Verify OTP for new department creation
        const otpResult = await verifyOTP(deptOtp, "DEPARTMENT_CREATE");
        if (!otpResult.success) {
          alert(otpResult.message || "Invalid or expired OTP. Please contact Administrator.");
          return;
        }

        const data = { ...deptForm };
        delete data.id;
        await addDoc(collection(db, "departments"), { 
          ...data, 
          status: "pending_credentials",
          createdAt: serverTimestamp() 
        });
        alert("Academic Sector initialized successfully! Awaiting Administrator provisioning.");
      } else {
        const data = { ...deptForm };
        const id = data.id;
        delete data.id;
        await updateDoc(doc(db, "departments", id), data);
      }
      setOpenDeptDialog(false);
      setDeptOtp(""); // Reset OTP
    } catch (error) {
      console.error("Department error:", error);
      alert(`Critical Error: ${error.message || "Unable to save department"}`);
    }
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm("Permanently remove this academic sector?")) {
      try {
        await deleteDoc(doc(db, "departments", id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Department Catalog</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2 }}>ACADEMIC INFRASTRUCTURE</Typography>
        </Box>
        <Button variant="contained" className="btn-premium" startIcon={<Add />} onClick={() => handleOpenDeptDialog()}
          sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none' }}>
          Initialize Sector
        </Button>
      </Box>

      <Grid container spacing={3}>
        {departments?.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
              <AccountTree sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" fontWeight={1000}>ESTABLISHING ACADEMIC NETWORK...</Typography>
            </Box>
          </Grid>
        ) : (
          departments?.map((dept) => (
            <Grid item xs={12} sm={6} md={4} key={dept.id}>
              <Card sx={{ ...glassStyle, borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={dept.admissionOpen ? "LIVE" : "CLOSED"} 
                    size="small" 
                    color={dept.admissionOpen ? "primary" : "error"}
                    sx={{ fontWeight: 1000, fontSize: '0.6rem' }} 
                  />
                  {dept.status === 'pending_credentials' && (
                    <Chip label="PENDING PROVISIONING" size="small" color="warning" sx={{ fontWeight: 1000, fontSize: '0.6rem' }} />
                  )}
                </Box>
                <CardContent sx={{ p: 3, pt: 0, flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', mb: 3, lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 60 }}>
                    {dept.description}
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(dept.color || '#1976d2', 0.1), color: dept.color || '#1976d2', width: 32, height: 32 }}>
                        <School sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.6, fontWeight: 800 }}>FACULTY HEAD</Typography>
                        <Typography variant="body2" fontWeight={1000}>{dept.headName || dept.faculty}</Typography>
                        {dept.headEmail && (
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>{dept.headEmail}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2, px: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Sector"><IconButton size="small" onClick={() => handleOpenDeptDialog(dept)} sx={{ color: 'primary.main' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Remove Sector"><IconButton size="small" onClick={() => handleDeleteDept(dept.id)} sx={{ color: 'error.main' }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </Stack>
                  <Chip label={dept.code} size="small" variant="outlined" sx={{ fontWeight: 1000, fontSize: '0.65rem' }} />
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Department Dialog */}
      <Dialog open={openDeptDialog} onClose={() => setOpenDeptDialog(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255,255,255,0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{editingDept ? 'Modify Sector' : 'Initialize Academic Sector'}</Typography>
        </DialogTitle>
        <form onSubmit={handleSaveDept}>
          <DialogContent sx={{ p: 4 }}>
             {!editingDept && (
               <Box sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: alpha('#6366f1', 0.05), border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <Typography variant="caption" color="primary.main" fontWeight={1000} display="block" sx={{ mb: 1, letterSpacing: 1 }}>AUTHORIZATION REQUIRED</Typography>
                  <TextField 
                    fullWidth 
                    label="One-Time Password (DEPARTMENT_CREATE)" 
                    placeholder="Enter sector entry key"
                    value={deptOtp} 
                    onChange={e => setDeptOtp(e.target.value)} 
                    required 
                    InputProps={{ 
                      sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white' },
                      startAdornment: <Lock sx={{ mr: 1, opacity: 0.5 }} />
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>A valid OTP from the Administrator is required to establish new academic departments.</Typography>
               </Box>
             )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Department Name" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} required />
                  <TextField fullWidth label="Code" value={deptForm.code} onChange={e => setDeptForm({ ...deptForm, code: e.target.value })} required />
                  <FormControl fullWidth required>
                    <InputLabel>Parent College</InputLabel>
                    <Select value={deptForm.collegeId} label="Parent College" onChange={e => setDeptForm({ ...deptForm, collegeId: e.target.value })}>
                      {colleges?.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Faculty Head Name" value={deptForm.headName} onChange={e => setDeptForm({ ...deptForm, headName: e.target.value })} required />
                  <TextField fullWidth label="Head Email" type="email" value={deptForm.headEmail} onChange={e => setDeptForm({ ...deptForm, headEmail: e.target.value })} required />
                  <TextField fullWidth label="Duration" value={deptForm.duration} onChange={e => setDeptForm({ ...deptForm, duration: e.target.value })} />
                  <TextField fullWidth label="Available Seats" type="number" value={deptForm.seats} onChange={e => setDeptForm({ ...deptForm, seats: e.target.value })} />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="About & Requirements" value={deptForm.requirements} onChange={e => setDeptForm({ ...deptForm, requirements: e.target.value })} required />
              </Grid>
            </Grid>
          </DialogContent>
          <Box sx={{ p: 4, pt: 0, display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpenDeptDialog(false)} sx={{ borderRadius: 3, py: 1.5 }}>Cancel</Button>
            <Button fullWidth variant="contained" type="submit" sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>
              {editingDept ? 'Update Sector' : 'Establish Sector'}
            </Button>
          </Box>
        </form>
      </Dialog>
    </Box>
  );
};

export default DepartmentsTab;
