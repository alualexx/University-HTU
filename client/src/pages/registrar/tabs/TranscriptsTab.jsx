import React, { useState } from "react";
import {
  Box, Card, Typography, Stack, TextField, MenuItem, Button,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, useTheme, Grid, IconButton, Tabs, Tab, Avatar, Tooltip,
  LinearProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Description, Print, Download, Search, Verified, Warning,
  History, QrCode, Paid, Send, Block, FactCheck, School
} from "@mui/icons-material";

export default function TranscriptsTab({
  students = [],
  glassStyle
}) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [subTab, setSubTab] = useState(0);

  const transcriptRequests = [
    { name: 'John Doe', id: 'STU001', type: 'Official', status: 'pending', date: '2h ago' },
    { name: 'Jane Smith', id: 'STU002', type: 'Unofficial', status: 'completed', date: '5h ago' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight={1000}>Transcript & Academic Records</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>GENERATE OFFICIAL TRANSCRIPTS, VERIFY AUTHENTICITY WITH QR CODES, AND PROCESS SEALED RECORD REQUESTS</Typography>
        </Box>
        <Button variant="contained" startIcon={<Print />} sx={{ borderRadius: 3, fontWeight: 900 }}>Bulk Print Transcripts</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Pending Requests', val: 12, icon: <History />, color: '#f59e0b' },
          { label: 'Processed (MTD)', val: 145, icon: <Verified />, color: '#10b981' },
          { label: 'Revenue (Transcripts)', val: '$2,450', icon: <Paid />, color: '#6366f1' },
          { label: 'Blocked Records', val: 3, icon: <Block />, color: '#ef4444' },
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

      <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
        <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Request Queue" />
        <Tab icon={<Verified sx={{ fontSize: 20 }} />} iconPosition="start" label="Authenticity Verification" />
        <Tab icon={<Description sx={{ fontSize: 20 }} />} iconPosition="start" label="Official Records" />
      </Tabs>

      {subTab === 0 && (
        <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
            <TextField size="small" placeholder="Search request by student ID or name..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Student", "ID Number", "Type", "Requested", "Status", "Actions"].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transcriptRequests.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell><Typography variant="body2" fontWeight={900}>{r.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={800}>{r.id}</Typography></TableCell>
                    <TableCell><Chip label={r.type.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} /></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={800}>{r.date}</Typography></TableCell>
                    <TableCell><Chip label={r.status.toUpperCase()} size="small" color={r.status === 'completed' ? 'success' : 'warning'} sx={{ fontWeight: 1000, fontSize: '0.6rem' }} /></TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" disabled={r.status === 'completed'} sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem' }}>Generate PDF</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {subTab === 1 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5, textAlign: 'center', py: 10 }}>
          <QrCode sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" fontWeight={900}>Authenticity Verification Engine</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Verify transcript integrity using secure QR codes and reference numbers.</Typography>
          <Button variant="contained" sx={{ borderRadius: 3, fontWeight: 900 }}>Scan Reference Code</Button>
        </Card>
      )}
    </Box>
  );
}
