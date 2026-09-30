import React, { useState } from "react";
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Chip, useTheme, Grid, IconButton, Tabs, Tab, Dialog, DialogTitle,
    DialogContent, DialogActions, Tooltip, Avatar, LinearProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    LibraryBooks, Add, Edit, Delete, Search, Download, Visibility,
    CheckCircle, Cancel, Person, School, BlockSharp, Settings
} from "@mui/icons-material";

export default function CoursesMgmtTab({
    courses = [],
    departments = [],
    enrollments = [],
    onSaveCourse,
    onDeleteCourse,
    onAssignLecturer,
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dialog, setDialog] = useState({ open: false, data: { name: '', code: '', department: '', credits: 3, instructor: '', status: 'active', prerequisites: '', capacity: 40 } });

    const filtered = courses.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !q || (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Course Catalog Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>MANAGE PREREQUISITES, SECTIONS, LECTURER ASSIGNMENTS, AND COURSE STATUS LIFECYCLE</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ open: true, data: { name: '', code: '', department: '', credits: 3, instructor: '', status: 'active', prerequisites: '', capacity: 40 } })} sx={{ borderRadius: 3, fontWeight: 900 }}>Add Course</Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
                <Tab icon={<LibraryBooks sx={{ fontSize: 20 }} />} iconPosition="start" label="Full Catalog" />
                <Tab icon={<Settings sx={{ fontSize: 20 }} />} iconPosition="start" label="Sections & Capacity" />
                <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label="Lecturer Assignments" />
            </Tabs>

            {subTab === 0 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField size="small" placeholder="Search course name or code..." value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <TextField select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="pending_registrar_approval">Pending Approval</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                        <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export Catalog</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Code", "Department", "Credits", "Instructor", "Status", "Enrolled", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ bgcolor: 'transparent', fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map((c, i) => {
                                    const count = enrollments.filter(e => e.courseCode === c.code && e.status === 'approved').length;
                                    return (
                                        <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell><Typography variant="body2" fontWeight={900}>{c.name}</Typography></TableCell>
                                            <TableCell><Typography variant="caption" fontWeight={800} sx={{ fontFamily: 'monospace' }}>{c.code}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" fontWeight={800}>{c.department || '—'}</Typography></TableCell>
                                            <TableCell><Chip label={`${c.credits || 3} CR`} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                            <TableCell><Typography variant="body2">{c.instructor || '—'}</Typography></TableCell>
                                            <TableCell>
                                                <Chip label={(c.status || 'active').toUpperCase()} size="small" sx={{ fontWeight: 1000, fontSize: '0.6rem', bgcolor: alpha(c.status === 'active' ? '#10b981' : c.status === 'inactive' ? '#94a3b8' : '#f59e0b', 0.1), color: c.status === 'active' ? '#10b981' : c.status === 'inactive' ? '#94a3b8' : '#f59e0b' }} />
                                            </TableCell>
                                            <TableCell><Typography fontWeight={900}>{count}/{c.capacity || 40}</Typography></TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => setDialog({ open: true, data: { ...c } })}><Edit fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => onDeleteCourse?.(c._id || c.id)}><Delete fontSize="small" /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 1 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3 }}><Typography variant="h6" fontWeight={1000}>Section & Capacity Management</Typography></Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Section A", "Section B", "Section C", "Total Cap", "Enrolled"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses.filter(c => c.status === 'active').map((c, i) => {
                                    const enrolled = enrollments.filter(e => e.courseCode === c.code && e.status === 'approved').length;
                                    const cap = c.capacity || 40;
                                    return (
                                        <TableRow key={i}>
                                            <TableCell><Typography fontWeight={900}>{c.name}</Typography></TableCell>
                                            <TableCell><Chip label={`${Math.ceil(cap / 3)} seats`} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell><Chip label={`${Math.ceil(cap / 3)} seats`} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell><Chip label={`${cap - 2 * Math.ceil(cap / 3)} seats`} size="small" sx={{ fontWeight: 800 }} /></TableCell>
                                            <TableCell><Typography fontWeight={1000}>{cap}</Typography></TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LinearProgress variant="determinate" value={Math.min((enrolled / cap) * 100, 100)} sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} />
                                                    <Typography variant="caption" fontWeight={1000}>{enrolled}</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 2 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3 }}><Typography variant="h6" fontWeight={1000}>Lecturer → Course Assignments</Typography></Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Course", "Code", "Current Lecturer", "Department", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 1000, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses.filter(c => c.status === 'active').map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Typography fontWeight={900}>{c.name}</Typography></TableCell>
                                        <TableCell><Typography variant="caption" fontWeight={800} sx={{ fontFamily: 'monospace' }}>{c.code}</Typography></TableCell>
                                        <TableCell>
                                            {c.instructor ? (
                                                <Chip icon={<Person sx={{ fontSize: 14 }} />} label={c.instructor} size="small" sx={{ fontWeight: 800 }} />
                                            ) : (
                                                <Chip label="UNASSIGNED" size="small" color="warning" sx={{ fontWeight: 900 }} />
                                            )}
                                        </TableCell>
                                        <TableCell><Typography variant="body2">{c.department}</Typography></TableCell>
                                        <TableCell><Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900 }}>Assign</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* Course Dialog */}
            <Dialog open={dialog.open} onClose={() => setDialog({ open: false, data: {} })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Course Details</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Course Name" value={dialog.data.name || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, name: e.target.value } }))} size="small" />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField fullWidth label="Code" value={dialog.data.code || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, code: e.target.value } }))} size="small" /></Grid>
                            <Grid item xs={6}><TextField fullWidth type="number" label="Credits" value={dialog.data.credits || 3} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, credits: Number(e.target.value) } }))} size="small" /></Grid>
                        </Grid>
                        <TextField select fullWidth label="Department" value={dialog.data.department || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, department: e.target.value } }))} size="small">
                            {departments.map(d => <MenuItem key={d._id || d.id} value={d.name}>{d.name}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Prerequisites (comma-separated codes)" value={dialog.data.prerequisites || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, prerequisites: e.target.value } }))} size="small" />
                        <TextField fullWidth label="Instructor" value={dialog.data.instructor || ''} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, instructor: e.target.value } }))} size="small" />
                        <TextField fullWidth type="number" label="Capacity" value={dialog.data.capacity || 40} onChange={e => setDialog(p => ({ ...p, data: { ...p.data, capacity: Number(e.target.value) } }))} size="small" />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDialog({ open: false, data: {} })}>Cancel</Button>
                    <Button variant="contained" onClick={() => { onSaveCourse?.(dialog.data); setDialog({ open: false, data: {} }); }} sx={{ borderRadius: 3, fontWeight: 900 }}>Save Course</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
