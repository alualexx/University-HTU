import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, 
  Stack, Avatar, Chip, Divider, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, alpha,
  CircularProgress
} from '@mui/material';
import { 
  Add, Business, Edit, Delete, Person, Email, Lock 
} from '@mui/icons-material';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../services/Firebase';
import { useAuth } from '../../../context/AuthContext';

const CollegesTab = ({ colleges, isDark, glassStyle }) => {
  const { logAuditActivity, verifyOTP, markOTPUsed } = useAuth();
  
  // Local UI State for College Dialog
  const [openCollegeDialog, setOpenCollegeDialog] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [collegeForm, setCollegeForm] = useState({
    name: "",
    description: "",
    deanName: "",
    deanEmail: "",
    code: "",
    color: "#4f46e5",
    icon: "Business"
  });
  const [collegeOtp, setCollegeOtp] = useState("");
  const [collegeLoading, setCollegeLoading] = useState(false);

  const handleOpenCollegeDialog = (college = null) => {
    if (college) {
      setEditingCollege(college);
      setCollegeForm({
        name: college.name,
        description: college.description,
        deanName: college.deanName,
        deanEmail: college.deanEmail,
        code: college.code,
        color: college.color || "#4f46e5",
        icon: college.icon || "Business"
      });
    } else {
      setEditingCollege(null);
      setCollegeForm({ name: "", description: "", deanName: "", deanEmail: "", code: "", color: "#4f46e5", icon: "Business" });
      setCollegeOtp("");
    }
    setOpenCollegeDialog(true);
  };

  const handleSaveCollege = async (e) => {
    e.preventDefault();
    setCollegeLoading(true);
    console.log("Saving college...", collegeForm);
    try {
      if (!editingCollege) {
        // Verify OTP for new colleges
        const otpResult = await verifyOTP(collegeOtp, "COLLEGE_CREATE");
        if (!otpResult.success) {
          alert(otpResult.message || "Invalid or expired OTP. Please contact Administrator.");
          setCollegeLoading(false);
          return;
        }

        // Security reinforcement: Check if college name matches the OTP target
        if (otpResult.data.targetName.toLowerCase() !== collegeForm.name.toLowerCase()) {
           if(!window.confirm(`OTP was issued for "${otpResult.data.targetName}", but you are creating "${collegeForm.name}". Proceed anyway?`)) {
             setCollegeLoading(false);
             return;
           }
        }

        await addDoc(collection(db, "colleges"), { 
          ...collegeForm, 
          status: "pending_credentials",
          createdAt: serverTimestamp() 
        });
        
        await markOTPUsed(otpResult.otpId);
        logAuditActivity("College Creation", `Created new college: ${collegeForm.name}`);
        alert("College created successfully! It is now pending Administrator provisioning for credentials.");
      } else {
        await updateDoc(doc(db, "colleges", editingCollege.id), collegeForm);
        logAuditActivity("College Update", `Updated college: ${collegeForm.name}`);
      }
      setOpenCollegeDialog(false);
    } catch (err) {
      console.error("Error saving college:", err);
      alert(`Conflict/Error: ${err.message || "Failed to save college."}`);
    } finally {
      setCollegeLoading(false);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm("Are you sure you want to delete this college? This will orphan all associated departments and data.")) {
      try {
        await deleteDoc(doc(db, "colleges", collegeId));
        logAuditActivity("College Deletion", `Deleted college with ID: ${collegeId}`);
      } catch (err) {
        console.error("Error deleting college:", err);
        alert("Failed to delete college.");
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>University Colleges</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2, opacity: 0.7 }}>CORE ACADEMIC PILLARS</Typography>
        </Box>
        <Button variant="contained" className="btn-premium" startIcon={<Add />} onClick={() => handleOpenCollegeDialog()} 
          sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 1000, textTransform: 'none', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
          Initialize new College
        </Button>
      </Box>

      <Grid container spacing={3}>
        {colleges.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
              <Business sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" fontWeight={1000}>NO COLLEGES REGISTERED</Typography>
            </Box>
          </Grid>
        ) : (
          colleges.map((college) => (
            <Grid item xs={12} sm={6} md={4} key={college.id}>
              <Card sx={{ 
                ...glassStyle, 
                borderRadius: 5, 
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.4s',
                '&:hover': { transform: 'translateY(-8px)', borderColor: college.color || 'primary.main', boxShadow: `0 20px 40px ${alpha(college.color || '#6366f1', 0.15)}` }
              }}>
                <Box sx={{ 
                  p: 3, 
                  background: `linear-gradient(135deg, ${alpha(college.color || '#6366f1', 0.2)} 0%, transparent 100%)`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                }}>
                  <Box>
                    <Chip label={college.code || "COL"} size="small" sx={{ fontWeight: 1000, bgcolor: alpha(college.color || '#6366f1', 0.15), color: college.color || '#6366f1', mb: 1, border: `1px solid ${alpha(college.color || '#6366f1', 0.3)}` }} />
                    <Typography variant="h6" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>{college.name}</Typography>
                    {college.status === 'pending_credentials' && (
                      <Chip label="PENDING PROVISIONING" size="small" color="warning" sx={{ fontWeight: 1000, fontSize: '0.6rem', mt: 1, borderRadius: 1 }} />
                    )}
                  </Box>
                  <Avatar sx={{ bgcolor: alpha(college.color || '#6366f1', 0.1), color: college.color || '#6366f1' }}>
                    <Business />
                  </Avatar>
                </Box>
                <CardContent sx={{ p: 3, pt: 0, flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary', mb: 3, lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 60 }}>
                    {college.description || "No description provided for this college."}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, opacity: 0.6 }} />
                      <Typography variant="caption" fontWeight={900}>DEAN: {college.deanName || "NOT ASSIGNED"}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 18, opacity: 0.6 }} />
                      <Typography variant="caption" fontWeight={900}>{college.deanEmail || "N/A"}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                <Box sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'flex-end', gap: 1, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                  <Tooltip title="Modify College"><IconButton size="small" onClick={() => handleOpenCollegeDialog(college)} sx={{ color: "primary.main", bgcolor: 'rgba(99, 102, 241, 0.05)' }}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete College"><IconButton size="small" onClick={() => handleDeleteCollege(college.id)} sx={{ color: "error.main", bgcolor: 'rgba(239, 68, 68, 0.05)' }}><Delete fontSize="small" /></IconButton></Tooltip>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* College Dialog */}
      <Dialog open={openCollegeDialog} onClose={() => setOpenCollegeDialog(false)} maxWidth="sm" fullWidth 
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none', p: 1 } }}>
        <DialogTitle sx={{ p: 4, pb: 1 }}>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>{editingCollege ? 'Modify College' : 'Initialize College'}</Typography>
          <Typography variant="caption" color="primary.main" fontWeight={900} sx={{ letterSpacing: 2 }}>UNIVERSITY HIERARCHY EXPANSION</Typography>
        </DialogTitle>
        <form onSubmit={handleSaveCollege}>
          <DialogContent sx={{ p: 4 }}>
            {!editingCollege && (
               <Box sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: alpha('#6366f1', 0.05), border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <Typography variant="caption" color="primary.main" fontWeight={1000} display="block" sx={{ mb: 1, letterSpacing: 1 }}>AUTHENTICATION REQUIRED</Typography>
                  <TextField 
                    fullWidth 
                    label="One-Time Password (COLLEGE_CREATE)" 
                    placeholder="Enter hierarchy expansion key"
                    value={collegeOtp} 
                    onChange={e => setCollegeOtp(e.target.value)} 
                    required 
                    InputProps={{ 
                      sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white' },
                      startAdornment: <Lock sx={{ mr: 1, opacity: 0.5 }} />
                    }}
                  />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>Creators must provide a valid OTP generated by the System Administrator to initialize new colleges.</Typography>
               </Box>
            )}
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField fullWidth label="College Name" value={collegeForm.name} onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })} required 
                    InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Code" value={collegeForm.code} onChange={e => setCollegeForm({ ...collegeForm, code: e.target.value })} required 
                    InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
                  />
                </Grid>
              </Grid>
              <TextField fullWidth multiline rows={3} label="Vision & Description" value={collegeForm.description} onChange={e => setCollegeForm({ ...collegeForm, description: e.target.value })} required 
                InputProps={{ sx: { borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Dean Name" value={collegeForm.deanName} onChange={e => setCollegeForm({ ...collegeForm, deanName: e.target.value })} required 
                    InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Dean Email" type="email" value={collegeForm.deanEmail} onChange={e => setCollegeForm({ ...collegeForm, deanEmail: e.target.value })} required 
                    InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
                  />
                </Grid>
              </Grid>
              <TextField fullWidth label="Theme Color (HEX)" value={collegeForm.color} onChange={e => setCollegeForm({ ...collegeForm, color: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}
              />
            </Stack>
          </DialogContent>
          <Box sx={{ p: 4, pt: 0, display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpenCollegeDialog(false)} sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000 }}>Cancel</Button>
            <Button fullWidth variant="contained" type="submit" disabled={collegeLoading} sx={{ borderRadius: 3, py: 1.5, fontWeight: 1000, bgcolor: editingCollege ? 'primary.main' : '#6366f1' }}>
              {collegeLoading ? <CircularProgress size={24} color="inherit" /> : (editingCollege ? 'Update Pillar' : 'Establish College')}
            </Button>
          </Box>
        </form>
      </Dialog>
    </Box>
  );
};

export default CollegesTab;
