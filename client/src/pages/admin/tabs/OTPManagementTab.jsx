import React from "react";
import {
  Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, alpha
} from "@mui/material";
import {
  Key, Assignment, CheckCircle, Delete, Lock
} from "@mui/icons-material";
import { doc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";

const OTPManagementTab = ({
  otpsList,
  collegesList,
  departmentsList,
  db,
  gradients,
  glassStyle,
  logActivity,
  user
}) => {
  const [openOtpDialog, setOpenOtpDialog] = React.useState(false);
  const [otpLoading, setOtpLoading] = React.useState(false);
  const [otpFormData, setOtpFormData] = React.useState({
    type: "COLLEGE_CREATE",
    targetName: "",
    targetId: ""
  });

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (!otpFormData.targetName) return alert("Target Name is required");
    
    setOtpLoading(true);
    try {
      const generateCode = (length) => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const code = generateCode(8);
      
      await addDoc(collection(db, "otps"), {
        code,
        type: otpFormData.type,
        targetName: otpFormData.targetName,
        targetId: otpFormData.targetId || null,
        isUsed: false,
        createdBy: user?.name || "Admin",
        createdById: user?.uid,
        createdAt: serverTimestamp()
      });

      logActivity("OTP Generation", `Generated ${otpFormData.type} for "${otpFormData.targetName}"`);
      setOpenOtpDialog(false);
      setOtpFormData({ type: "COLLEGE_CREATE", targetName: "" });
      alert(`OTP Generated Successfully: ${code}\n\nProvide this code to the authorized registrar or dean.`);
    } catch (err) {
      console.error("OTP generation error:", err);
      alert("Failed to generate OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleDeleteOTP = async (otpId) => {
    if (window.confirm("Are you sure you want to revoke this OTP?")) {
      try {
        await deleteDoc(doc(db, "otps", otpId));
        logActivity("OTP Revocation", `Revoked OTP ID: ${otpId}`);
      } catch (err) {
        console.error("Error deleting OTP:", err);
      }
    }
  };

  return (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 6, mb: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Box>
            <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Access Authorization Registry</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
              Managing {otpsList.length} Authorization Keys
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Key />}
            onClick={() => setOpenOtpDialog(true)}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3, background: gradients[0] }}
          >
            Generate Access Key
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Access Code", "Protocol Type", "Target Entity", "Status", "Genesis", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {otpsList.map((otp) => (
                <TableRow key={otp.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="body2" fontWeight={1000} sx={{ letterSpacing: 2, color: 'primary.main', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                      {otp.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={otp.type}
                      size="small"
                      sx={{
                        fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5,
                        bgcolor: alpha(otp.type === 'COLLEGE_CREATE' ? '#0ea5e9' : '#8b5cf6', 0.1),
                        color: otp.type === 'COLLEGE_CREATE' ? '#0ea5e9' : '#8b5cf6'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="body2" fontWeight={900}>{otp.targetName}</Typography>
                    {otp.targetId && (
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        ID: {otp.targetId.substring(0, 8)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={otp.isUsed ? 'EXHAUSTED' : 'READY'}
                      size="small"
                      color={otp.isUsed ? 'error' : 'success'}
                      sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5 }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Box>
                      <Typography variant="caption" display="block" fontWeight={800}>{otp.createdBy}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>{otp.createdAt?.toDate()?.toLocaleString() || 'N/A'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Copy Code">
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText(otp.code); alert(`Copied: ${otp.code}`); }} sx={{ color: 'info.main', bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Assignment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={otp.isUsed ? 'Mark as Ready (Reset)' : 'Mark as Exhausted'}>
                        <IconButton size="small"
                          onClick={async () => {
                            await updateDoc(doc(db, 'otps', otp.id), { isUsed: !otp.isUsed });
                            logActivity('OTP Status Toggle', `Toggled OTP ${otp.code} → ${!otp.isUsed ? 'READY' : 'EXHAUSTED'}`);
                          }}
                          sx={{ color: otp.isUsed ? 'success.main' : 'warning.main', bgcolor: 'rgba(255,255,255,0.03)' }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Revoke OTP">
                        <IconButton size="small" onClick={() => handleDeleteOTP(otp.id)} sx={{ color: 'error.main', bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {otpsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Lock sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>No active authorization keys found in registry.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generate OTP Dialog */}
      <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 1, ...glassStyle, minWidth: 420 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Generate Authorization Key</DialogTitle>
        <form onSubmit={handleGenerateOTP}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary" fontWeight={700}>
                Deploy a one-time authorization key for hierarchy expansion.
              </Typography>
              <TextField
                fullWidth
                select
                label="Protocol Type"
                value={otpFormData.type}
                onChange={(e) => setOtpFormData({ ...otpFormData, type: e.target.value, targetName: '', targetId: '' })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <MenuItem value="COLLEGE_CREATE">College Creation (COLLEGE_CREATE)</MenuItem>
                <MenuItem value="DEPARTMENT_CREATE">Department Creation (DEPARTMENT_CREATE)</MenuItem>
              </TextField>

              {/* Smart Target Picker */}
              {otpFormData.type === 'COLLEGE_CREATE' ? (
                collegesList.length > 0 ? (
                  <TextField
                    fullWidth select label="Target College"
                    value={otpFormData.targetId || ''}
                    onChange={(e) => {
                      const col = collegesList.find(c => c.id === e.target.value);
                      setOtpFormData({ ...otpFormData, targetId: e.target.value, targetName: col?.name || '' });
                    }}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  >
                    {collegesList.map(c => <MenuItem key={c.id} value={c.id}>{c.name} ({c.code})</MenuItem>)}
                    <MenuItem value="__new__">+ New College (enter name manually)</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth label="Target College Name"
                    placeholder="e.g. College of Engineering"
                    value={otpFormData.targetName}
                    onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                    required
                    helperText="No colleges exist yet — enter the intended college name"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                )
              ) : (
                departmentsList.length > 0 ? (
                  <TextField
                    fullWidth select label="Target Department"
                    value={otpFormData.targetId || ''}
                    onChange={(e) => {
                      const dept = departmentsList.find(d => d.id === e.target.value);
                      setOtpFormData({ ...otpFormData, targetId: e.target.value, targetName: dept?.name || '' });
                    }}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  >
                    {departmentsList.map(d => {
                      const parentCollege = collegesList.find(c => c.id === d.collegeId);
                      return <MenuItem key={d.id} value={d.id}>{d.name} {parentCollege ? `· ${parentCollege.code}` : ''}</MenuItem>;
                    })}
                    <MenuItem value="__new__">+ New Department (enter name manually)</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    fullWidth label="Target Department Name"
                    placeholder="e.g. Department of Computer Science"
                    value={otpFormData.targetName}
                    onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                    required
                    helperText="No departments exist yet — enter the intended department name"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                )
              )}

              {/* Manual name override when '+ New' is selected */}
              {(otpFormData.targetId === '__new__') && (
                <TextField
                  fullWidth label="New Entity Name"
                  placeholder={otpFormData.type === 'COLLEGE_CREATE' ? 'e.g. College of Engineering' : 'e.g. Dept. of Computer Science'}
                  value={otpFormData.targetName}
                  onChange={(e) => setOtpFormData({ ...otpFormData, targetName: e.target.value })}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenOtpDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={otpLoading || !otpFormData.targetName}
              sx={{ borderRadius: 2.5, px: 4, fontWeight: 900, background: gradients[0] }}
            >
              {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Key'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OTPManagementTab;
