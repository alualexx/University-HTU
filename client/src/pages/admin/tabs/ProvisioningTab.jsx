import React from "react";
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, InputAdornment, CircularProgress, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Business, Apartment, PersonAdd, Delete, Person, Email, Lock, AssignmentTurnedIn
} from "@mui/icons-material";
import { doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { collegesAPI, departmentsAPI } from "../../../services/api";

const ProvisioningTab = ({
  pendingEntities,
  user,
  db,
  registerUserByAdmin,
  logActivity,
  gradients,
  glassStyle
}) => {
  const theme = useTheme();
  const [openProvisionDialog, setOpenProvisionDialog] = React.useState(false);
  const [provisioningEntity, setProvisioningEntity] = React.useState(null);
  const [provisionLoading, setProvisionLoading] = React.useState(false);
  const [provisionForm, setProvisionForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleOpenProvisionDialog = (entity = null) => {
    setProvisioningEntity(entity);
    setProvisionForm({
      name: entity?.type === 'college' ? entity.deanName || '' : (entity?.headName || entity?.faculty || ''),
      email: entity?.type === 'college' ? entity.deanEmail || '' : entity?.headEmail || '',
      password: '',
    });
    setOpenProvisionDialog(true);
  };

  const handleProvisionEntity = async (e) => {
    e.preventDefault();
    if (!provisioningEntity || !provisionForm.name || !provisionForm.email || !provisionForm.password) {
      alert('Please fill all fields.');
      return;
    }

    setProvisionLoading(true);
    try {
      // 1. Create user in Firebase Auth and Firestore using registerUserByAdmin
      const result = await registerUserByAdmin({
        name: provisionForm.name,
        email: provisionForm.email,
        password: provisionForm.password,
        role: provisioningEntity.type === 'college' ? 'college_admin' : 'faculty',
        collegeId: provisioningEntity.type === 'college' ? provisioningEntity.id : provisioningEntity.collegeId,
        departmentId: provisioningEntity.type === 'department' ? provisioningEntity.id : null,
      });

      if (!result.success) throw new Error(result.error);

      // 2. Update the entity (college or department) to active
      if (provisioningEntity.type === 'college') {
        await collegesAPI.update(provisioningEntity.id, {
          status: 'active',
          provisionedBy: user?.name || "Admin"
        });
      } else {
        await departmentsAPI.update(provisioningEntity.id, {
          status: 'active',
          provisionedBy: user?.name || "Admin"
        });
      }

      logActivity('Provisioning', `Provisioned ${provisioningEntity.type} admin: ${provisionForm.email}`);
      alert(`${provisioningEntity.type} activated successfully!`);
      setOpenProvisionDialog(false);
    } catch (err) {
      console.error("Provisioning error:", err);
      alert(`Provisioning failed: ${err.message}`);
    } finally {
      setProvisionLoading(false);
    }
  };

  const handleDeletePendingEntity = async (entity) => {
    if (!window.confirm(`Are you sure you want to reject and delete this ${entity.type} "${entity.name}"? This action cannot be undone.`)) return;

    try {
      if (entity.type === 'college') {
        await collegesAPI.delete(entity.id);
      } else {
        await departmentsAPI.delete(entity.id);
      }
      logActivity('Rejection', `Rejected pending ${entity.type}: ${entity.name}`);
      alert(`${entity.type} rejected and removed from queue.`);
    } catch (err) {
      console.error("Deletion error:", err);
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Onboarding Provisioning Queue</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 2 }}>
          {pendingEntities.length} NEW ENTITIES REQUIRING SECURITY CREDENTIALS
        </Typography>
      </Box>

      {pendingEntities.length === 0 ? (
        <Card sx={{ ...glassStyle, borderRadius: 5, p: 10, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <AssignmentTurnedIn sx={{ fontSize: 64, opacity: 0.1, mb: 2 }} />
          <Typography variant="h6" fontWeight={800} color="text.secondary">Queue is currently clear.</Typography>
          <Typography variant="body2" color="text.secondary">New colleges/departments created by the Registrar will appear here.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingEntities.map((entity) => (
            <Grid item xs={12} md={6} key={entity.id}>
              <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: entity.type === 'college' ? 'primary.main' : 'secondary.main', color: 'white' }}>
                      {entity.type === 'college' ? <Business /> : <Apartment />}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={1000}>{entity.name}</Typography>
                      <Chip label={entity.type.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 20 }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    Created {entity.createdAt?.toDate()?.toLocaleDateString()}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Registrar has created this {entity.type}. Please provision the {entity.type === 'college' ? 'Dean' : 'Department Head'} account to activate the entity.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth variant="contained" startIcon={<PersonAdd />}
                      onClick={() => handleOpenProvisionDialog(entity)}
                      sx={{ borderRadius: 3, fontWeight: 900, textTransform: 'none', background: gradients[0] }}
                    >
                      Provision Admin
                    </Button>
                    <Tooltip title="Reject Entity">
                      <IconButton onClick={() => handleDeletePendingEntity(entity)} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Provisioning Dialog */}
      <Dialog open={openProvisionDialog} onClose={() => setOpenProvisionDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { ...glassStyle, borderRadius: 6, backgroundImage: 'none', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Provision Security Credentials</DialogTitle>
        <form onSubmit={handleProvisionEntity}>
          <DialogContent>
            <Stack spacing={3}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                <Typography variant="caption" color="info.main" fontWeight={900} sx={{ display: 'block', mb: 0.5 }}>TARGET ENTITY</Typography>
                <Typography variant="body2" fontWeight={800}>{provisioningEntity?.name} ({provisioningEntity?.type})</Typography>
              </Box>
              
              <TextField fullWidth label="Full Name" value={provisionForm.name} onChange={e => setProvisionForm({ ...provisionForm, name: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />
              
              <TextField fullWidth label="Official Email" type="email" value={provisionForm.email} onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />

              <TextField fullWidth label="Temporary Password" value={provisionForm.password} onChange={e => setProvisionForm({ ...provisionForm, password: e.target.value })} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>, sx: { borderRadius: 3 } }} />
              
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                This password will be required for first login and must be changed immediately.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpenProvisionDialog(false)} sx={{ fontWeight: 900 }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={provisionLoading} sx={{ borderRadius: 3, px: 4, fontWeight: 900, background: gradients[1] }}>
              {provisionLoading ? <CircularProgress size={24} color="inherit" /> : 'Activate & Notify'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProvisioningTab;
