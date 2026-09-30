import React, { useState, useEffect } from 'react';
import {
    Box, Card, Typography, Stack, TextField, MenuItem, Button,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Avatar, Chip, useTheme, Grid, IconButton, Tabs, Tab, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel,
    Checkbox, FormControlLabel, LinearProgress, Alert, Select, FormControl,
    InputLabel, Paper, CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    School, CheckCircle, Cancel, Assignment, Download, Search,
    FactCheck, AccountBalance, LibraryBooks, Celebration, Groups,
    Verified, Warning, Person, History, Add, Edit, FileDownload,
    DoneOutline, PendingActions, RemoveCircle, CloudDownload, Info, Lock
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { usersAPI } from '../../../services/api';

const ELIGIBILITY_REQUIREMENTS = {
    minimumCGPA: 2.0,
    minimumCredits: 120,
    maximumYears: 5,
    requiresFinancialClearance: true,
    requiresLibraryClearance: true,
    requiresAcademicClearance: true
};

const CLEARANCE_DEPARTMENTS = [
    { id: 'academics', name: 'Academic Department', icon: '📚', color: '#3b82f6' },
    { id: 'finance', name: 'Finance Office', icon: '💳', color: '#f59e0b' },
    { id: 'library', name: 'Library Services', icon: '📖', color: '#8b5cf6' },
    { id: 'registrar', name: 'Registrar (Final)', icon: '✅', color: '#10b981' }
];

export default function GraduationMgmtTab({
    students = [],
    departments = [],
    isDark = false,
    glassStyle = {},
    showSnackbar = () => { }
}) {
    const { user } = useAuth();
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');

    const canApprove = (deptId) => {
        if (!user) return true;
        if (user.role === 'admin') return true;
        if (deptId === 'finance' && user.role === 'finance') return true;
        if (deptId === 'academics' && (user.role === 'faculty' || user.role === 'college_admin' || user.role === 'teacher')) return true;
        if (deptId === 'library' && user.role === 'library') return true;
        if (deptId === 'registrar' && user.role === 'registrar') return true;
        return false;
    };


    // Wire graduation data from live students prop
    const [loadingMap, setLoadingMap] = useState({});
    const [clearanceDetailsDialog, setClearanceDetailsDialog] = useState({ open: false, student: null });
    const [eligibilityDialog, setEligibilityDialog] = useState({ open: false, student: null });
    const [convocationData, setConvocationData] = useState({
        title: '2026 Spring Graduation Ceremony',
        date: '2026-09-15',
        time: '10:00 AM',
        venue: 'University Auditorium',
        capacity: 2000,
        registered: 0,
        color: '#6366f1'
    });
    const [alumniData, setAlumniData] = useState([]);
    const [convoDialog, setConvoDialog] = useState(false);
    const [localStudents, setLocalStudents] = useState([]);

    useEffect(() => {
        // Map incoming students to graduation-compatible format
        const mapped = students
            .filter(s => s.role === 'student' && ['eligible', 'in_clearance', 'cleared', 'graduated'].includes(s.graduationStatus))
            .map(s => ({
                ...s,
                id: s._id || s.id,
                status: s.graduationStatus,
                clearanceStatus: s.clearanceStatus || { academics: 'pending', finance: 'pending', library: 'pending', registrar: 'pending' },
                academicHolds: s.academicHolds || [],
                fees: { outstanding: s.feesCleared ? 0 : 100, status: s.feesCleared ? 'paid' : 'outstanding' },
                libraryStatus: { outstanding: 0, fines: 0, status: 'clear' },
                convoationRegistered: s.graduationStatus === 'graduated',
                eligibilityDate: s.updatedAt ? s.updatedAt.split('T')[0] : '—'
            }));
        setLocalStudents(mapped);
    }, [students]);

    const setLoading = (id, val) => setLoadingMap(p => ({ ...p, [id]: val }));

    const checkEligibility = (student) => {
        const issues = [];
        const passed = [];
        if ((student.cgpa || 0) < ELIGIBILITY_REQUIREMENTS.minimumCGPA) {
            issues.push({ type: 'CGPA', severity: 'error', message: `CGPA ${student.cgpa || 0} below minimum ${ELIGIBILITY_REQUIREMENTS.minimumCGPA}` });
        } else { passed.push('CGPA Requirement Met'); }
        if ((student.totalCredits || 0) < ELIGIBILITY_REQUIREMENTS.minimumCredits) {
            issues.push({ type: 'CREDITS', severity: 'error', message: `Credits ${student.totalCredits || 0} below minimum ${ELIGIBILITY_REQUIREMENTS.minimumCredits}` });
        } else { passed.push('Credit Hour Requirement Met'); }
        if (student.academicHolds && student.academicHolds.length > 0) {
            issues.push({ type: 'ACADEMIC_HOLDS', severity: 'warning', message: `${student.academicHolds.length} academic hold(s)` });
        } else { passed.push('No Academic Holds'); }
        return { isEligible: issues.length === 0, issues, passed };
    };

    const eligibleStudents = localStudents;

    const eligibleForClearance = students
        .filter(s => s.role === 'student' && s.admissionStatus === 'enrolled' && s.graduationStatus !== 'in_clearance' && s.graduationStatus !== 'cleared' && s.graduationStatus !== 'graduated')
        .map(s => ({
            ...s,
            id: s._id || s.id,
            status: 'eligible',
            clearanceStatus: { academics: 'pending', finance: 'pending', library: 'pending', registrar: 'pending' },
            academicHolds: [],
            fees: { outstanding: s.feesCleared ? 0 : 100, status: s.feesCleared ? 'paid' : 'outstanding' },
            libraryStatus: { outstanding: 0, fines: 0, status: 'clear' },
        }));

    const allEligibleView = [...eligibleForClearance, ...localStudents];

    const getClearanceProgress = (student) => {
        const cs = student.clearanceStatus || {};
        const statuses = typeof cs.get === 'function'
            ? ['academics', 'finance', 'library', 'registrar'].map(d => cs.get(d))
            : Object.values(cs);
        const completed = statuses.filter(s => s === 'approved').length;
        return Math.round((completed / 4) * 100);
    };

    const getClearanceStatusFor = (student, deptId) => {
        const cs = student.clearanceStatus || {};
        if (typeof cs.get === 'function') return cs.get(deptId) || 'pending';
        return cs[deptId] || 'pending';
    };

    const handleStartClearance = (student) => {
        const eligibility = checkEligibility(student);
        setEligibilityDialog({ open: true, student, eligibility });
    };

    const handleInitiateClearance = async (student) => {
        setLoading(student.id, true);
        try {
            const res = await usersAPI.initiateClearance(student.id);
            const updated = res.data;
            setLocalStudents(prev => [
                ...prev.filter(s => s.id !== student.id),
                { ...student, ...updated, id: updated._id, status: 'in_clearance', clearanceStatus: updated.clearanceStatus || { academics: 'pending', finance: 'pending', library: 'pending', registrar: 'pending' } }
            ]);
            setEligibilityDialog({ open: false, student: null });
            showSnackbar(`Clearance workflow started for ${student.name}`, 'success');
        } catch (err) {
            showSnackbar(`Error: ${err.response?.data?.message || err.message}`, 'error');
        } finally {
            setLoading(student.id, false);
        }
    };

    const handleApproveClearanceStep = async (student, deptId, approved) => {
        const key = `${student.id}-${deptId}`;
        setLoading(key, true);
        try {
            const res = await usersAPI.patchClearance(student.id, deptId, approved ? 'approved' : 'rejected');
            const updated = res.data;
            setLocalStudents(prev => prev.map(s => s.id === student.id
                ? { ...s, clearanceStatus: updated.clearanceStatus, status: updated.graduationStatus }
                : s
            ));
            const deptName = CLEARANCE_DEPARTMENTS.find(d => d.id === deptId)?.name || 'Department';
            showSnackbar(`${deptName} ${approved ? 'approved' : 'rejected'} clearance`, approved ? 'success' : 'error');
        } catch (err) {
            showSnackbar(`Error: ${err.response?.data?.message || err.message}`, 'error');
        } finally {
            setLoading(key, false);
        }
    };

    const handleRegisterForConvocation = (student) => {
        setLocalStudents(prev => prev.map(s => s.id === student.id ? { ...s, convoationRegistered: true } : s));
        setAlumniData(prev => [...prev, { ...student, graduationDate: convocationData.date, status: 'alumnus' }]);
        setConvocationData(prev => ({ ...prev, registered: prev.registered + 1 }));
        showSnackbar(`${student.name} registered for convocation!`, 'success');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'eligible': return { bg: '#e0f2fe', text: '#0369a1' };
            case 'in_clearance': return { bg: '#fef3c7', text: '#92400e' };
            case 'cleared': return { bg: '#dcfce7', text: '#166534' };
            case 'graduated': return { bg: '#fce7f3', text: '#be185d' };
            default: return { bg: '#f3f4f6', text: '#4b5563' };
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h5' fontWeight={1000}>Graduation Management System</Typography>
                <Typography variant='caption' color='text.secondary' fontWeight={800}>
                    ELIGIBILITY VERIFICATION, MULTI-DEPARTMENTAL CLEARANCE, AND CONVOCATION REGISTRY
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Eligible Students', val: allEligibleView.length, icon: <School />, color: '#6366f1' },
                    { label: 'In Clearance', val: localStudents.filter(s => s.status === 'in_clearance').length, icon: <PendingActions />, color: '#f59e0b' },
                    { label: 'Cleared for Graduation', val: localStudents.filter(s => s.status === 'cleared').length, icon: <CheckCircle />, color: '#10b981' },
                    { label: 'Convocation Registered', val: localStudents.filter(s => s.convoationRegistered).length, icon: <Celebration />, color: '#ec4899' },
                ].map((stat, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, borderRadius: 2.5, width: 48, height: 48 }}>
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant='caption' color='text.secondary' fontWeight={900} sx={{ fontSize: '0.7rem', letterSpacing: 1 }}>
                                        {stat.label.toUpperCase()}
                                    </Typography>
                                    <Typography variant='h4' fontWeight={1000} sx={{ color: stat.color }}>
                                        {stat.val}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { fontWeight: 900, textTransform: 'none' } }}>
                <Tab icon={<CheckCircle sx={{ fontSize: 20 }} />} iconPosition='start' label='Eligibility Check' />
                <Tab icon={<FactCheck sx={{ fontSize: 20 }} />} iconPosition='start' label='Clearance Workflow' />
                <Tab icon={<Celebration sx={{ fontSize: 20 }} />} iconPosition='start' label='Convocation & Alumni' />
            </Tabs>

            {subTab === 0 && (
                <Card sx={{ ...glassStyle, borderRadius: 5, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField size='small' placeholder='Search students...' value={search} onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1, minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} InputProps={{ startAdornment: <Search sx={{ mr: 1, opacity: 0.5 }} /> }} />
                        <TextField select size='small' value={deptFilter} onChange={e => setDeptFilter(e.target.value)} sx={{ width: 180, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                            <MenuItem value='all'>All Departments</MenuItem>
                            {departments.map(d => <MenuItem key={d._id || d.id} value={d.name}>{d.name}</MenuItem>)}
                        </TextField>
                        <Button variant='contained' startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export List</Button>
                    </Box>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                                    {['Student', 'Department', 'Year', 'CGPA', 'Credits', 'Status', 'Actions'].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900, color: theme.palette.primary.main, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allEligibleView.filter(s => {
                                    const q = search.toLowerCase();
                                    const matchSearch = !q || (s.name || '').toLowerCase().includes(q) || (s.studentId || '').includes(q);
                                    const matchDept = deptFilter === 'all' || s.department === deptFilter;
                                    return matchSearch && matchDept;
                                }).map((s) => (
                                    <TableRow key={s.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
                                        <TableCell>
                                            <Stack direction='row' spacing={1} alignItems='center'>
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontSize: '0.9rem', fontWeight: 900 }}>{s.name[0]}</Avatar>
                                                <Box>
                                                    <Typography variant='body2' fontWeight={900}>{s.name}</Typography>
                                                    <Typography variant='caption' color='text.secondary'>{s.studentId}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell><Typography variant='body2' fontWeight={700}>{s.department}</Typography></TableCell>
                                        <TableCell><Chip label={`Year ${s.year}`} size='small' sx={{ fontWeight: 900 }} /></TableCell>
                                        <TableCell><Typography variant='body2' fontWeight={1000} sx={{ color: (s.cgpa || 0) >= 3.5 ? '#10b981' : (s.cgpa || 0) >= 3.0 ? '#3b82f6' : (s.cgpa || 0) >= 2.0 ? '#f59e0b' : '#ef4444' }}>{(s.cgpa || 0).toFixed(2)}</Typography></TableCell>
                                        <TableCell><Typography variant='body2' fontWeight={900}>{s.totalCredits || 0} <span style={{ opacity: 0.5 }}>/ 120</span></Typography></TableCell>
                                        <TableCell><Chip label={s.status.replace(/_/g, ' ').toUpperCase()} size='small' sx={{ bgcolor: getStatusColor(s.status).bg, color: getStatusColor(s.status).text, fontWeight: 900 }} /></TableCell>
                                        <TableCell><Button size='small' variant='outlined' onClick={() => handleStartClearance(s)} disabled={loadingMap[s.id] || s.status === 'in_clearance' || s.status === 'cleared'} sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem' }}>{loadingMap[s.id] ? <CircularProgress size={14} /> : s.status === 'eligible' ? 'Start Clearance' : 'In Progress'}</Button></TableCell>
                                    </TableRow>
                                ))}
                                {allEligibleView.length === 0 && (<TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}><School sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} /><Typography color='text.secondary' fontWeight={800}>No graduation-eligible students found</Typography></TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {subTab === 1 && (
                <Grid container spacing={3}>
                    {localStudents.filter(s => s.status === 'in_clearance' || s.status === 'cleared').map(student => (
                        <Grid item xs={12} key={student.id}>
                            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                                    <Box>
                                        <Typography variant='h6' fontWeight={900}>{student.name}</Typography>
                                        <Typography variant='caption' color='text.secondary'>{student.studentId} • {student.department}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant='caption' fontWeight={900} sx={{ color: theme.palette.primary.main }}>{getClearanceProgress(student)}% COMPLETE</Typography>
                                        <LinearProgress variant='determinate' value={getClearanceProgress(student)} sx={{ mt: 1, height: 6, borderRadius: 3, backgroundColor: alpha(theme.palette.primary.main, 0.1), '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.primary.main, borderRadius: 3 } }} />
                                    </Box>
                                </Box>
                                <Stack spacing={2}>
                                    {CLEARANCE_DEPARTMENTS.map((dept) => {
                                        const status = getClearanceStatusFor(student, dept.id);
                                        const approveKey = `${student.id}-${dept.id}`;
                                        return (
                                            <Box key={dept.id} sx={{ p: 2.5, borderRadius: 2, backgroundColor: alpha(dept.color, 0.05), border: `2px solid ${alpha(dept.color, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography sx={{ fontSize: '1.5rem' }}>{dept.icon}</Typography>
                                                    <Box>
                                                        <Typography variant='subtitle2' fontWeight={900}>{dept.name}</Typography>
                                                        <Typography variant='caption' color='text.secondary'>{status === 'pending' ? 'Awaiting approval' : status === 'approved' ? 'Approved' : 'Rejected'}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {status === 'pending' && canApprove(dept.id) && (<>
                                                        <Button size='small' variant='outlined' color='success' disabled={loadingMap[approveKey]} onClick={() => handleApproveClearanceStep(student, dept.id, true)} sx={{ borderRadius: 2, fontWeight: 900 }}>{loadingMap[approveKey] ? <CircularProgress size={14} /> : 'Approve'}</Button>
                                                        <Button size='small' variant='outlined' color='error' disabled={loadingMap[approveKey]} onClick={() => handleApproveClearanceStep(student, dept.id, false)} sx={{ borderRadius: 2, fontWeight: 900 }}>Reject</Button>
                                                    </>)}
                                                    {status === 'pending' && !canApprove(dept.id) && (<Chip icon={<Lock sx={{ fontSize: 14 }} />} label='Restricted' size="small" sx={{ fontWeight: 800, color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.05)' }} />)}
                                                    {status === 'approved' && (<Chip label='✓ Approved' sx={{ fontWeight: 900, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />)}
                                                    {status === 'rejected' && (<Chip label='✗ Rejected' sx={{ fontWeight: 900, bgcolor: alpha('#ef4444', 0.1), color: '#ef4444' }} />)}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button variant='contained' fullWidth disabled={getClearanceProgress(student) < 100} sx={{ borderRadius: 3, fontWeight: 900 }}>Complete Clearance &amp; Mark for Graduation</Button>
                                    <Button variant='outlined' onClick={() => setClearanceDetailsDialog({ open: true, student })} sx={{ borderRadius: 3, fontWeight: 900 }}>View Details</Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                    {localStudents.filter(s => s.status === 'in_clearance' || s.status === 'cleared').length === 0 && (
                        <Grid item xs={12}>
                            <Card sx={{ ...glassStyle, p: 8, borderRadius: 4, textAlign: 'center' }}>
                                <PendingActions sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
                                <Typography color='text.secondary' fontWeight={800}>No students currently in clearance workflow. Start by clicking "Start Clearance" on the Eligibility Check tab.</Typography>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}

            {subTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={7}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 4, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant='h6' fontWeight={1000}>Convocation Registry</Typography>
                                <Button size='small' variant='outlined' startIcon={<Edit />} onClick={() => setConvoDialog(true)} sx={{ fontWeight: 900 }}>Edit Details</Button>
                            </Box>
                            <Stack spacing={2} sx={{ mb: 3, p: 2.5, borderRadius: 3, bgcolor: alpha(convocationData.color, 0.05), border: `2px solid ${alpha(convocationData.color, 0.1)}` }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='subtitle2' fontWeight={900}>Event Title</Typography>
                                    <Typography variant='body2'>{convocationData.title}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='subtitle2' fontWeight={900}>Date & Time</Typography>
                                    <Typography variant='body2'>{convocationData.date} at {convocationData.time}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='subtitle2' fontWeight={900}>Venue</Typography>
                                    <Typography variant='body2'>{convocationData.venue}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='subtitle2' fontWeight={900}>Capacity / Registered</Typography>
                                    <Typography variant='body2'>{convocationData.registered} / {convocationData.capacity}</Typography>
                                </Box>
                            </Stack>
                            <Typography variant='subtitle2' fontWeight={900} sx={{ mb: 2 }}>Graduates Ready for Convocation</Typography>
                            <TableContainer sx={{ maxHeight: 300 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>Student</TableCell>
                                            <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>Department</TableCell>
                                            <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {localStudents.filter(s => s.status === 'cleared' && !s.convoationRegistered).map(s => (
                                            <TableRow key={s.id}>
                                                <TableCell><Typography variant='body2' fontWeight={800}>{s.name}</Typography></TableCell>
                                                <TableCell><Typography variant='body2'>{s.department}</Typography></TableCell>
                                                <TableCell><Chip label='Ready' size='small' sx={{ fontWeight: 900, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} /></TableCell>
                                                <TableCell><Button size='small' variant='contained' onClick={() => handleRegisterForConvocation(s)} sx={{ fontWeight: 900, fontSize: '0.7rem', borderRadius: 2 }}>Register</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 4 }}>
                            <Typography variant='h6' fontWeight={1000} sx={{ mb: 3 }}>Diploma Generation</Typography>
                            <Alert severity='info' sx={{ borderRadius: 2, mb: 2 }}>Diplomas can be generated for all convocation-registered graduates. They will include the graduation date and official university seal.</Alert>
                            <Button variant='contained' fullWidth startIcon={<CloudDownload />} sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}>Generate Bulk Diplomas PDF</Button>
                        </Card>
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 4, mb: 3 }}>
                            <Typography variant='h6' fontWeight={1000} sx={{ mb: 3 }}>Alumni Database</Typography>
                            <Stack spacing={2}>
                                <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                    <Typography variant='caption' color='text.secondary' fontWeight={900}>TOTAL ALUMNI RECORDS</Typography>
                                    <Typography variant='h4' fontWeight={1000} sx={{ color: theme.palette.primary.main }}>{alumniData.length}</Typography>
                                </Box>
                                <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha('#10b981', 0.05) }}>
                                    <Typography variant='caption' color='text.secondary' fontWeight={900}>GRADUATES THIS YEAR</Typography>
                                    <Typography variant='h5' fontWeight={1000} sx={{ color: '#10b981' }}>{convocationData.registered}</Typography>
                                </Box>
                                <Button variant='outlined' fullWidth startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}>Export Alumni List (CSV)</Button>
                                <Button variant='outlined' fullWidth startIcon={<Groups />} sx={{ borderRadius: 3, fontWeight: 900, py: 1.5 }}>View Alumni Network</Button>
                            </Stack>
                        </Card>
                        <Card sx={{ ...glassStyle, p: 4, borderRadius: 4 }}>
                            <Typography variant='subtitle2' fontWeight={900} sx={{ mb: 2 }}>Quick Stats</Typography>
                            <Stack spacing={2}>
                                {[{ label: 'Eligibility Verified', val: localStudents.filter(s => s.status !== 'pending' && s.status !== 'rejected').length }, { label: 'In Clearance Process', val: localStudents.filter(s => s.status === 'in_clearance').length }, { label: 'Fully Cleared', val: localStudents.filter(s => s.status === 'cleared').length }, { label: 'Convocation Registered', val: convocationData.registered }].map((stat, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                                        <Typography variant='body2' fontWeight={800}>{stat.label}</Typography>
                                        <Typography variant='body2' fontWeight={1000} sx={{ color: theme.palette.primary.main }}>{stat.val}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Dialog open={eligibilityDialog.open} onClose={() => setEligibilityDialog({ open: false, student: null })} maxWidth='sm' fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 900 }}>Eligibility Assessment</DialogTitle>
                <DialogContent>
                    {eligibilityDialog.student && eligibilityDialog.eligibility && (
                        <Stack spacing={2.5} sx={{ mt: 2 }}>
                            {eligibilityDialog.eligibility.issues.length === 0 ? (<Alert severity='success' sx={{ borderRadius: 2 }}>✓ Student meets all graduation eligibility requirements!</Alert>) : (<Alert severity='warning' sx={{ borderRadius: 2 }}>{eligibilityDialog.eligibility.issues.length} issue(s) found</Alert>)}
                            {eligibilityDialog.eligibility.issues.length > 0 && (
                                <Box>
                                    <Typography variant='subtitle2' fontWeight={900} sx={{ mb: 1 }}>Issues:</Typography>
                                    {eligibilityDialog.eligibility.issues.map((issue, i) => (
                                        <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: 2, bgcolor: alpha('#ef4444', 0.05), border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            <Typography variant='caption' fontWeight={900} sx={{ color: '#ef4444' }}>{issue.type}</Typography>
                                            <Typography variant='body2' sx={{ mt: 0.5 }}>{issue.message}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                            <Box>
                                <Typography variant='subtitle2' fontWeight={900} sx={{ mb: 1 }}>Passed Checks:</Typography>
                                {eligibilityDialog.eligibility.passed.map((check, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, borderRadius: 2, bgcolor: alpha('#10b981', 0.05) }}>
                                        <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />
                                        <Typography variant='body2'>{check}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEligibilityDialog({ open: false, student: null })}>Cancel</Button>
                    <Button variant='contained' onClick={() => handleInitiateClearance(eligibilityDialog.student)} disabled={eligibilityDialog.eligibility?.issues.length > 0} sx={{ fontWeight: 900 }}>Proceed to Clearance</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={clearanceDetailsDialog.open} onClose={() => setClearanceDetailsDialog({ open: false, student: null })} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Clearance Details</DialogTitle>
                <DialogContent>
                    {clearanceDetailsDialog.student && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <Typography variant='caption' fontWeight={900}>FINANCIAL STATUS</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant='body2'>Outstanding Fees:</Typography>
                                    <Typography variant='body2' fontWeight={900}>${clearanceDetailsDialog.student.fees.outstanding}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2'>Status:</Typography>
                                    <Chip label={clearanceDetailsDialog.student.fees.status.toUpperCase()} size='small' sx={{ fontWeight: 900 }} />
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#8b5cf6', 0.05) }}>
                                <Typography variant='caption' fontWeight={900}>LIBRARY STATUS</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant='body2'>Outstanding Items:</Typography>
                                    <Typography variant='body2' fontWeight={900}>{clearanceDetailsDialog.student.libraryStatus.outstanding}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2'>Fines:</Typography>
                                    <Typography variant='body2' fontWeight={900}>${clearanceDetailsDialog.student.libraryStatus.fines}</Typography>
                                </Box>
                            </Box>
                            <Alert severity='info'>Clearance workflow initiated on {clearanceDetailsDialog.student.eligibilityDate}</Alert>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setClearanceDetailsDialog({ open: false, student: null })}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={convoDialog} onClose={() => setConvoDialog(false)} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Edit Convocation Details</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField fullWidth label='Ceremony Title' value={convocationData.title} onChange={(e) => setConvocationData({ ...convocationData, title: e.target.value })} />
                        <TextField fullWidth label='Date' type='date' value={convocationData.date} onChange={(e) => setConvocationData({ ...convocationData, date: e.target.value })} InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth label='Time' type='time' value={convocationData.time} onChange={(e) => setConvocationData({ ...convocationData, time: e.target.value })} InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth label='Venue' value={convocationData.venue} onChange={(e) => setConvocationData({ ...convocationData, venue: e.target.value })} />
                        <TextField fullWidth label='Capacity' type='number' value={convocationData.capacity} onChange={(e) => setConvocationData({ ...convocationData, capacity: parseInt(e.target.value) })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConvoDialog(false)}>Cancel</Button>
                    <Button variant='contained' onClick={() => { setConvoDialog(false); showSnackbar('Convocation details updated!', 'success'); }} sx={{ fontWeight: 900 }}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
