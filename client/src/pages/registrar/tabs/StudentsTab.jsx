import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Avatar, Chip, useTheme, Grid, IconButton, Tabs, Tab, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip,
    LinearProgress, Select, FormControl, InputLabel
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    Search, People, Edit, Block, CheckCircle, School, History,
    Upload, Download, Visibility, SwapHoriz, FilterList, Person,
    Assignment, RemoveCircle, Cancel, Warning, LockPerson, PersonOff,
    Description, Badge
} from "@mui/icons-material";

const STUDENT_STATUS_CONFIG = {
    'Active': { color: '#10b981', label: 'Active' },
    'On Leave': { color: '#f59e0b', label: 'On Leave' },
    'Suspended': { color: '#ef4444', label: 'Suspended' },
    'Graduated': { color: '#6366f1', label: 'Graduated' },
    'Withdrawn': { color: '#94a3b8', label: 'Withdrawn' },
    'Deactivated': { color: '#64748b', label: 'Deactivated' }
};

export default function StudentsTab({
    students = [],
    departments = [],
    onSelectStudent,
    onEditStudent,
    onSuspendStudent,
    onTransferStudent,
    onGenerateEnrollmentLetter,
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");
    const [suspendDialog, setSuspendDialog] = useState({ open: false, student: null, reason: "" });
    const [transferDialog, setTransferDialog] = useState({ open: false, student: null, targetDept: "", targetProgram: "" });
    const [bulkFile, setBulkFile] = useState(null);

    const filtered = students.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = !q || (s.name || "").toLowerCase().includes(q) || (s.studentId || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        const matchDept = deptFilter === "all" || s.department === deptFilter;
        const matchYear = yearFilter === "all" || String(s.year) === yearFilter;
        return matchSearch && matchStatus && matchDept && matchYear;
    });

    const holdsStudents = students.filter(s => s.hasHold || s.feesOutstanding || s.missingDocs);
    const uniqueDepts = [...new Set(students.map(s => s.department).filter(Boolean))];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Student Roster & Management</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    FULL LIFECYCLE MANAGEMENT FOR {students.length} ENROLLED STUDENTS ACROSS {uniqueDepts.length} DEPARTMENTS
                </Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
                <Tab icon={<People sx={{ fontSize: 20 }} />} iconPosition="start" label="Directory" />
                <Tab icon={<Upload sx={{ fontSize: 20 }} />} iconPosition="start" label="Bulk Assignment" />
                <Tab icon={<Warning sx={{ fontSize: 20 }} />} iconPosition="start" label={`Academic Holds (${holdsStudents.length})`} />
            </Tabs>

            {subTab === 0 && (
                <>
                    <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField size="small" placeholder="Search name, ID, or email..." value={search} onChange={e => setSearch(e.target.value)}
                            sx={{ flexGrow: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }}
                        />
                        <TextField select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="all">All Status</MenuItem>
                            {Object.keys(STUDENT_STATUS_CONFIG).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                        <TextField select size="small" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} sx={{ width: 180, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="all">All Departments</MenuItem>
                            {uniqueDepts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </TextField>
                        <TextField select size="small" value={yearFilter} onChange={e => setYearFilter(e.target.value)} sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="all">All Years</MenuItem>
                            {[1, 2, 3, 4, 5].map(y => <MenuItem key={y} value={String(y)}>Year {y}</MenuItem>)}
                        </TextField>
                        <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export</Button>
                    </Card>

                    <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 650 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {["Student Identity", "Department/Program", "Year", "Status", "Fee Clearance", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ bgcolor: 'transparent', borderBottom: '2px solid rgba(255,255,255,0.05)', fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.slice(0, 100).map((s, i) => {
                                        const cfg = STUDENT_STATUS_CONFIG[s.status] || STUDENT_STATUS_CONFIG['Active'];
                                        return (
                                            <TableRow key={i} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }} onClick={() => onSelectStudent?.(s)}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900, fontSize: '0.8rem' }}>{s.name?.[0]}</Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={900}>{s.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{s.studentId || s.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Typography variant="body2" fontWeight={800}>{s.department || s.intendedMajor || '—'}</Typography></TableCell>
                                                <TableCell><Chip label={`Y${s.year || 1}`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                                <TableCell>
                                                    <Chip label={cfg.label.toUpperCase()} size="small" sx={{ fontWeight: 1000, fontSize: '0.6rem', bgcolor: alpha(cfg.color, 0.1), color: cfg.color }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={s.feesCleared ? "CLEARED" : "PENDING"} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: alpha(s.feesCleared ? '#10b981' : '#f59e0b', 0.1), color: s.feesCleared ? '#10b981' : '#f59e0b' }} />
                                                </TableCell>
                                                <TableCell onClick={e => e.stopPropagation()}>
                                                    <Stack direction="row" spacing={0.5}>
                                                        <Tooltip title="View Profile"><IconButton size="small" onClick={() => onSelectStudent?.(s)}><Visibility fontSize="small" /></IconButton></Tooltip>
                                                        <Tooltip title="Edit"><IconButton size="small" onClick={() => onEditStudent?.(s)}><Edit fontSize="small" /></IconButton></Tooltip>
                                                        <Tooltip title="Suspend"><IconButton size="small" color="error" onClick={() => setSuspendDialog({ open: true, student: s, reason: "" })}><Block fontSize="small" /></IconButton></Tooltip>
                                                        <Tooltip title="Transfer"><IconButton size="small" color="info" onClick={() => setTransferDialog({ open: true, student: s, targetDept: "", targetProgram: "" })}><SwapHoriz fontSize="small" /></IconButton></Tooltip>
                                                        <Tooltip title="Enrollment Letter"><IconButton size="small" onClick={() => onGenerateEnrollmentLetter?.(s)}><Description fontSize="small" /></IconButton></Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                            <Typography variant="caption" fontWeight={800} color="text.secondary">Showing {Math.min(filtered.length, 100)} of {filtered.length} records</Typography>
                        </Box>
                    </Card>
                </>
            )}

            {subTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="h6" fontWeight={1000} gutterBottom>Bulk Department Assignment via CSV</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Upload a CSV file with columns: StudentID, Department, Program, Year. The system will batch-assign students accordingly.</Typography>
                            <Box sx={{ p: 4, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 4, textAlign: 'center', mb: 3 }}>
                                <Upload sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography variant="body2" fontWeight={800}>Drop CSV here or click to browse</Typography>
                                <input type="file" accept=".csv" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} onChange={e => setBulkFile(e.target.files?.[0])} />
                            </Box>
                            {bulkFile && (
                                <Alert severity="info" sx={{ borderRadius: 3 }}>
                                    Ready to process: <strong>{bulkFile.name}</strong> ({(bulkFile.size / 1024).toFixed(1)} KB)
                                </Alert>
                            )}
                            <Button fullWidth variant="contained" disabled={!bulkFile} sx={{ mt: 2, borderRadius: 3, fontWeight: 900, py: 1.5 }}>Process Bulk Assignment</Button>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                            <Typography variant="subtitle1" fontWeight={1000} gutterBottom>CSV Format Requirements</Typography>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                StudentID,Department,Program,Year<br />
                                STU001,Computer Science,BSc CS,2<br />
                                STU002,Mathematics,BSc Math,1<br />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {subTab === 2 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h6" fontWeight={1000}>Students with Academic Holds</Typography>
                        <Typography variant="caption" color="text.secondary">Students blocked from activities due to unpaid fees, missing documents, or disciplinary matters.</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Student", "Hold Type", "Details", "Since", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {holdsStudents.length > 0 ? holdsStudents.map((s, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Typography variant="body2" fontWeight={900}>{s.name}</Typography></TableCell>
                                        <TableCell><Chip label={s.feesOutstanding ? "FINANCIAL" : "DOCUMENT"} size="small" color={s.feesOutstanding ? "error" : "warning"} sx={{ fontWeight: 900 }} /></TableCell>
                                        <TableCell><Typography variant="caption">{s.holdReason || "Outstanding balance or missing documentation"}</Typography></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800}>—</Typography></TableCell>
                                        <TableCell><Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900 }}>Resolve</Button></TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <CheckCircle sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No active academic holds</Typography>
                                    </TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* Suspend Dialog */}
            <Dialog open={suspendDialog.open} onClose={() => setSuspendDialog({ open: false, student: null, reason: "" })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Suspend / Deactivate Student</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Provide a reason for suspending <strong>{suspendDialog.student?.name}</strong>. This action can be reversed.</Typography>
                    <TextField fullWidth multiline rows={3} label="Suspension Reason" value={suspendDialog.reason} onChange={e => setSuspendDialog(p => ({ ...p, reason: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setSuspendDialog({ open: false, student: null, reason: "" })}>Cancel</Button>
                    <Button variant="contained" color="error" disabled={!suspendDialog.reason.trim()} onClick={() => { onSuspendStudent?.(suspendDialog.student, suspendDialog.reason); setSuspendDialog({ open: false, student: null, reason: "" }); }}>Confirm Suspension</Button>
                </DialogActions>
            </Dialog>

            {/* Transfer Dialog */}
            <Dialog open={transferDialog.open} onClose={() => setTransferDialog({ open: false, student: null, targetDept: "", targetProgram: "" })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Transfer Student</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Transfer <strong>{transferDialog.student?.name}</strong> to a new department/program.</Typography>
                    <TextField select fullWidth label="Target Department" value={transferDialog.targetDept} onChange={e => setTransferDialog(p => ({ ...p, targetDept: e.target.value }))} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                        {departments.map(d => <MenuItem key={d._id || d.id} value={d.name}>{d.name}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth label="Target Program" value={transferDialog.targetProgram} onChange={e => setTransferDialog(p => ({ ...p, targetProgram: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setTransferDialog({ open: false, student: null, targetDept: "", targetProgram: "" })}>Cancel</Button>
                    <Button variant="contained" disabled={!transferDialog.targetDept} onClick={() => { onTransferStudent?.(transferDialog.student, transferDialog.targetDept, transferDialog.targetProgram); setTransferDialog({ open: false, student: null, targetDept: "", targetProgram: "" }); }}>Confirm Transfer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
