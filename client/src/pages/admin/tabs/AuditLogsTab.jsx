import React from "react";
import {
  Box, Card, Typography, Stack, TextField, MenuItem, Button, IconButton,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Chip, useTheme, Divider, Grid
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Search, Storage, History, FilterList, Download, DeleteSweep,
  AdminPanelSettings, Shield
} from "@mui/icons-material";

const AuditLogsTab = ({
  activities,
  logSearch,
  setLogSearch,
  logFilter,
  setLogFilter,
  handleExportLogs,
  exportLoading,
  glassStyle
}) => {
  const theme = useTheme();

  const filteredLogs = activities.filter(log => {
    const searchLower = logSearch.toLowerCase();
    const matchesSearch =
      (log.action || "").toLowerCase().includes(searchLower) ||
      (log.adminName || "").toLowerCase().includes(searchLower) ||
      (log.details || "").toLowerCase().includes(searchLower);

    const matchesFilter = logFilter === 'all' || log.sector === logFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Administrative Audit Intelligence</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>TRACK STRATEGIC MANEUVERS, SYSTEM MUTATIONS, AND ACCESS VECTORS ACROSS ALL SECTORS</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small" placeholder="Search protocol ID, admin, or action..."
              value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
              sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
            />
            <TextField
              select size="small" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
              sx={{ width: 180, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="all">All Sectors</MenuItem>
              <MenuItem value="security">Security Intelligence</MenuItem>
              <MenuItem value="users">Identity Mgmt</MenuItem>
              <MenuItem value="academic">Academic Core</MenuItem>
              <MenuItem value="finance">Financial Node</MenuItem>
              <MenuItem value="system">Operational Control</MenuItem>
            </TextField>
            <Button
              variant="contained" startIcon={<Download />} onClick={handleExportLogs} disabled={exportLoading}
              sx={{ borderRadius: 3, fontWeight: 900, px: 3 }}
            >
              Export Dossier
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, border: '1px solid rgba(56,189,248,0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" fontWeight={1000} color="primary.main">RETENTION_POLICY</Typography>
                <Typography variant="body2" fontWeight={1000}>90 Day Historical Trail</Typography>
              </Box>
              <IconButton size="small" color="primary"><DeleteSweep /></IconButton>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ ...glassStyle, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', overflow: "hidden" }}>
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
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "---"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 1000, fontSize: '0.75rem' }}>
                        {(log.adminName || "U")[0]}
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
