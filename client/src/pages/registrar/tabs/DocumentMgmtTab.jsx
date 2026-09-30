import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    useTheme, Grid, IconButton, Avatar, Chip, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Description, Folder, FileUpload, Search, Download, Print,
    Verified, Warning, Policy, History, Archive, Gavel, MoreVert
} from "@mui/icons-material";

export default function DocumentMgmtTab({
    glassStyle
}) {
    const theme = useTheme();
    const [search, setSearch] = useState("");

    const policyDocs = [
        { name: 'Student Code of Conduct 2026', type: 'PDF', size: '2.4 MB', date: 'Jan 2026' },
        { name: 'Graduation Requirements Policy', type: 'PDF', size: '1.2 MB', date: 'Feb 2026' },
        { name: 'Financial Aid Regulations', type: 'DOCX', size: '0.8 MB', date: 'Dec 2025' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Document Repository & Policy Vault</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>SECURE STORAGE FOR UNIVERSITY POLICIES, OFFICIAL LETTER TEMPLATES, AND HISTORICAL ACADEMIC RECORDS</Typography>
                </Box>
                <Button variant="contained" startIcon={<FileUpload />} sx={{ borderRadius: 3, fontWeight: 900 }}>Upload Document</Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Policy Vault', count: 42, icon: <Policy />, color: '#6366f1' },
                    { label: 'Official Templates', count: 18, icon: <Description />, color: '#10b981' },
                    { label: 'Archive Logs', count: '3.2k', icon: <Archive />, color: '#a855f7' },
                    { label: 'Legal Records', count: 124, icon: <Gavel />, color: '#ef4444' },
                ].map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(s.color, 0.1), color: s.color, borderRadius: 2.5 }}>{s.icon}</Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={1000}>{s.label.toUpperCase()}</Typography>
                                    <Typography variant="h5" fontWeight={1000}>{s.count}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
                            <TextField size="small" placeholder="Search documents or policies..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                            <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Bulk Download</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {["Document Name", "Format", "Size", "Released", "Status", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {policyDocs.map((doc, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Folder sx={{ color: 'primary.main', opacity: 0.7 }} />
                                                    <Typography variant="body2" fontWeight={900}>{doc.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell><Chip label={doc.type} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem' }} /></TableCell>
                                            <TableCell><Typography variant="caption" fontWeight={800}>{doc.size}</Typography></TableCell>
                                            <TableCell><Typography variant="caption" fontWeight={800}>{doc.date}</Typography></TableCell>
                                            <TableCell><Chip label="VERIFIED" size="small" color="success" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} /></TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Download fontSize="small" /></IconButton>
                                                <IconButton size="small"><Print fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                        <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Template Manager</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Official university letterheads for enrollment confirmation, clearance, and graduation.</Typography>
                        <Stack spacing={2}>
                            {['Enrollment_Confirmation.tpl', 'Clearance_Cert.tpl', 'Graduation_Letter.tpl'].map((tpl, i) => (
                                <Box key={i} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" fontWeight={800}>{tpl}</Typography>
                                    <IconButton size="small" color="primary"><Edit fontSize="small" /></IconButton>
                                </Box>
                            ))}
                            <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 900 }}>Manage All Templates</Button>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
