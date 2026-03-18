import React from "react";
import {
  Box, Card, Typography, Stack, TextField, Button, Avatar, Chip, Tooltip, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, alpha, useTheme
} from "@mui/material";
import {
  Search, PersonAdd, CheckCircle, Block, LockReset, Password, Delete
} from "@mui/icons-material";

const UserManagementTab = ({
  usersList,
  userSearch,
  setUserSearch,
  handleOpenDialog,
  handleToggleUserActive,
  handleDirectPasswordReset,
  handleManualCredentialReset,
  handleDeleteUser,
  glassStyle
}) => {
  const theme = useTheme();

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={900}>Identity Directory</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>Managing {usersList.length} Registered Entities</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              placeholder="Search identity..." size="small" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
              sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' } }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
            />
            <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenDialog} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 900, px: 3 }}>Deploy User</Button>
          </Stack>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Operational Identity", "Classification", "Access Status", "Protocol Date", "Command"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 900, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{
                        width: 44, height: 44, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main',
                        fontWeight: 900, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.05)'
                      }}>
                        {row.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={900}>{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{row.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Chip
                      label={row.role} size="small"
                      sx={{
                        fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem',
                        borderRadius: 1.5,
                        bgcolor: alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.1),
                        color: row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981',
                        border: `1px solid ${alpha(row.role === 'admin' ? '#ef4444' : row.role === 'teacher' ? '#6366f1' : '#10b981', 0.2)}`
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{
                        width: 8, height: 8, borderRadius: "50%",
                        bgcolor: row.disabled ? "#ef4444" : "#10b981",
                        boxShadow: `0 0 10px ${row.disabled ? '#ef4444' : '#10b981'}`
                      }} />
                      <Typography variant="caption" fontWeight={900} color={row.disabled ? "error" : "success"}>
                        {row.disabled ? "REVOKED" : "VERIFIED"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '---'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)', p: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title={row.disabled ? "Grant Access" : "Revoke Access"}>
                        <IconButton size="small" onClick={() => handleToggleUserActive(row.id, row.disabled)} sx={{ color: row.disabled ? "success.main" : "warning.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                          {row.disabled ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Email Reset Link">
                        <IconButton size="small" onClick={() => handleDirectPasswordReset(row.email, row.name)} sx={{ color: "primary.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <LockReset fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Manual Override (Custom Pass)">
                        <IconButton size="small" onClick={() => handleManualCredentialReset(row.email, row.name)} sx={{ color: "info.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Password fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Emergency Purge">
                        <IconButton size="small" onClick={() => handleDeleteUser(row.id)} sx={{ color: "error.main", bgcolor: 'rgba(255,255,255,0.03)' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserManagementTab;
