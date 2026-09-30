import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, useTheme, Grid, IconButton, Tabs, Tab, Avatar, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    CreditCard, AssignmentInd, Print, Download, Search, CheckCircle,
    Warning, Delete, Visibility, Badge, History, LocalShipping,
    EventBusy, DateRange
} from "@mui/icons-material";

export default function IDManagementTab({
    students = [],
    idRequests = [],
    onIssueId,
    onProcessRequest,
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [previewStudent, setPreviewStudent] = useState(null);

    const pendingRequests = idRequests.filter(r => r.status === 'pending');
    const processedRequests = idRequests.filter(r => r.status !== 'pending');

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>ID Card & Identity Management</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE UNIVERSITY ID CARD LIFECYCLE, FROM ISSUANCE AND PRINTING TO REPLACEMENT AND DEACTIVATION</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Pending Requests', val: pendingRequests.length, icon: <AssignmentInd />, color: '#f59e0b' },
                    { label: 'Cards Issued Today', val: 0, icon: <Badge />, color: '#10b981' },
                    { label: 'Lost Reports', val: 0, icon: <Warning />, color: '#ef4444' },
                    { label: 'Delivery Transit', val: 0, icon: <LocalShipping />, color: '#3b82f6' },
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
                <Tab icon={<AssignmentInd sx={{ fontSize: 20 }} />} iconPosition="start" label={`Pending Requests (${pendingRequests.length})`} />
                <Tab icon={<Badge sx={{ fontSize: 20 }} />} iconPosition="start" label="Card Roster" />
                <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Request History" />
            </Tabs>

            {subTab === 0 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Student", "Request Type", "Date", "Verification", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingRequests.map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), fontWeight: 900, fontSize: '0.75rem' }}>{r.studentName?.[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={900}>{r.studentName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{r.studentId}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Chip label={r.type?.toUpperCase() || 'NEW'} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.6rem' }} /></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800}>{r.timestamp?.toDate?.().toLocaleDateString()}</Typography></TableCell>
                                        <TableCell><Chip label="DOCS VERIFIED" size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.6rem' }} /></TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" variant="contained" onClick={() => setPreviewStudent(r)} sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem' }}>Preview & Print</Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => onProcessRequest?.(r.id, r.studentUid, 'reject')} sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem' }}>Reject</Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {pendingRequests.length === 0 && (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <AssignmentInd sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No pending ID requests</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 1 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
                        <TextField size="small" placeholder="Search student ID or Name..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <Button variant="outlined" startIcon={<Print />} sx={{ borderRadius: 3, fontWeight: 900 }}>Bulk PDF Export</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {["Identity", "ID Number", "Expiry Date", "Status", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ bgcolor: 'transparent', fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.filter(s => s.studentId).map((s, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Typography variant="body2" fontWeight={900}>{s.name}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={800} sx={{ fontFamily: 'monospace' }}>{s.studentId}</Typography></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800}>2028-12-31</Typography></TableCell>
                                        <TableCell><Chip label="ACTIVE" size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.6rem' }} /></TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => setPreviewStudent(s)}><Visibility fontSize="small" /></IconButton>
                                            <IconButton size="small" color="primary"><Print fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* ID Preview Dialog */}
            <Dialog open={!!previewStudent} onClose={() => setPreviewStudent(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900, textAlign: 'center' }}>ID Card Preview</DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    {previewStudent && (
                        <Card sx={{ width: 400, height: 250, borderRadius: 5, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={1000} sx={{ letterSpacing: -1, lineHeight: 1 }}>ALEX UNIVERSITY</Typography>
                                    <Typography variant="caption" fontWeight={800} color="rgba(255,255,255,0.6)">OFFICIAL IDENTIFICATION</Typography>
                                </Box>
                                <Avatar sx={{ width: 60, height: 60, border: '2px solid rgba(255,255,255,0.2)', borderRadius: 2.5 }}>{previewStudent.studentName?.[0] || previewStudent.name?.[0]}</Avatar>
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={900}>{previewStudent.studentName || previewStudent.name}</Typography>
                                <Typography variant="caption" sx={{ display: 'block', mt: -0.5, color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>STUDENT | {previewStudent.department || "COMPUTER SCIENCE"}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>ID NUMBER</Typography>
                                    <Typography variant="body2" fontWeight={1000} sx={{ fontFamily: 'monospace' }}>{previewStudent.studentId}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>EXPIRY DATE</Typography>
                                    <Typography variant="body2" fontWeight={800}>12 / 2028</Typography>
                                </Box>
                            </Box>
                        </Card>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setPreviewStudent(null)}>Close</Button>
                    <Button variant="contained" startIcon={<Print />} onClick={() => { onIssueId?.(previewStudent.id); setPreviewStudent(null); }} sx={{ borderRadius: 3, fontWeight: 900 }}>Print ID Card</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
