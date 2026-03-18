import React from "react";
import {
  Box, Card, Typography, Stack, TextField, MenuItem, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, alpha, useTheme
} from "@mui/material";
import {
  Search, Storage, History
} from "@mui/icons-material";

const AuditLogsTab = ({
  activities,
  logSearch,
  setLogSearch,
  logFilter,
  setLogFilter,
  handleExportLogs,
  exportLoading,
  gradients,
  glassStyle
}) => {
  const theme = useTheme();

  const filteredLogs = activities.filter(log => {
    const matchesSearch = 
      log.action?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.adminName?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details?.toLowerCase().includes(logSearch.toLowerCase());
    
    const matchesFilter = logFilter === 'all' || log.sector === logFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Box>
      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Security Audit Intelligence</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>High-fidelity trail of all administrative maneuvers.</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small" placeholder="Search protocol..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
              sx={{ width: 220, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)' } }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
            />
            <TextField
              select size="small" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
              sx={{ width: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <MenuItem value="all">All Sectors</MenuItem>
              <MenuItem value="security">Security Protocol</MenuItem>
              <MenuItem value="users">Identity Mgmt</MenuItem>
              <MenuItem value="system">Core Control</MenuItem>
            </TextField>
            <Button
              variant="contained" startIcon={<Storage />} onClick={handleExportLogs} disabled={exportLoading}
              sx={{ borderRadius: 3, textTransform: "none", fontWeight: 1000, background: gradients[3], px: 3 }}
            >
              Export Dossier
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Operational Time", "Admin Identity", "Strategic Action", "Intelligence Details", "IP Vector"].map((h) => (
                  <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 1000, color: "text.secondary", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1.5, p: 3 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.03)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ p: 3 }}>
                    <Typography variant="body2" fontWeight={1000} color="primary.main">
                      {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                      {log.timestamp?.toDate().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 1000, fontSize: '0.75rem' }}>
                        {log.adminName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={900}>{log.adminName}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>{log.adminEmail}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action} size="small"
                      sx={{
                        bgcolor: alpha(log.color || theme.palette.primary.main, 0.1),
                        color: log.color || "primary.main",
                        fontWeight: 1000, borderRadius: 1.5, fontSize: '0.65rem', border: `1px solid ${alpha(log.color || theme.palette.primary.main, 0.2)}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>{log.details}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 1000, fontFamily: 'monospace', color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1, py: 0.5, borderRadius: 1 }}>
                      {log.ipAddress || "Unknown"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <History sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2, mb: 1 }} />
                    <Typography color="text.secondary" fontWeight={800}>Protocol Audit Empty</Typography>
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

export default AuditLogsTab;
