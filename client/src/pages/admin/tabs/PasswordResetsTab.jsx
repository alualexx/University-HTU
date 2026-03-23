import React from "react";
import {
  Box, Card, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Chip, Stack, Tooltip, IconButton, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Person, CheckCircle, Block, Password, History
} from "@mui/icons-material";

const PasswordResetsTab = ({
  passwordResetsList,
  handleApproveReset,
  handleManualCredentialReset,
  handleRejectReset,
  glassStyle
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Password Reset Requests</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Managing {passwordResetsList.length} total requests ({passwordResetsList.filter(r => r.status === "pending").length} pending)
            </Typography>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["User Identity", "Role", "Timestamp", "Status", "Manual Control"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {passwordResetsList.length > 0 ? passwordResetsList.map((req) => (
                <TableRow key={req.id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900 }}>
                        {req.name?.[0] || <Person />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={900}>{req.name || "Unknown User"}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{req.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ p: 3 }}>
                    <Chip label={req.role || "student"} size="small" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                  </TableCell>
                  <TableCell sx={{ p: 3 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>{req.requestedAt?.toDate()?.toLocaleString() || 'Pending...'}</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 3 }}>
                    <Chip 
                      label={req.status} 
                      size="small" 
                      color={req.status === 'approved' ? 'success' : req.status === 'pending' ? 'warning' : 'error'}
                      sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5 }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ p: 3 }}>
                    {req.status === "pending" ? (
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Approve Request">
                          <IconButton size="small" onClick={() => handleApproveReset(req)} sx={{ color: "success.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Generate Manual Code">
                          <IconButton size="small" onClick={() => handleManualCredentialReset(req.email, req.name)} sx={{ color: "info.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Password fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Request">
                          <IconButton size="small" onClick={() => handleRejectReset(req)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>
                        Processed by {req.processedBy || "Admin"}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <History sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                    <Typography color="text.secondary" fontWeight={800}>No pending reset requests</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default PasswordResetsTab;
