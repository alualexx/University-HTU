import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Select, FormControl, InputLabel, alpha, CircularProgress, useTheme, Avatar
} from '@mui/material';
import {
    Group, Search, Block, Security, VerifiedUser, Refresh
} from '@mui/icons-material';
import { libraryAPI } from '../../../services/api';

export default function LibMembersTab({ glassStyle }) {
    const theme = useTheme();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Dialog State
    const [openPrivilege, setOpenPrivilege] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [privilegeLevel, setPrivilegeLevel] = useState('standard');

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await libraryAPI.getLibraryMembers();
            setMembers(res.data);
        } catch (error) {
            console.error("Error fetching library members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleUpdatePrivilege = async () => {
        try {
            await libraryAPI.updateMemberPrivilege(selectedMember._id, { privilegeLevel });
            setOpenPrivilege(false);
            fetchMembers();
        } catch (error) {
            console.error("Error updating privilege:", error);
        }
    };

    // Filter Logic
    const filteredMembers = members.filter(m => {
        if (!search) return true;
        const s = search.toLowerCase();
        return m.name?.toLowerCase().includes(s) || m.studentId?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s);
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900}>Member Accounts</Typography>
                    <Typography variant="body2" color="text.secondary">Review user standing, adjust borrowing tiers, and manage suspensions</Typography>
                </Box>
            </Box>

            <Card sx={{ ...glassStyle, p: 3, borderRadius: 4, mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search by name, email, or IDs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    />
                    <IconButton onClick={fetchMembers} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}><Refresh /></IconButton>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900 }}>Member Profile</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>System Role</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Unpaid Balance</TableCell>
                                <TableCell sx={{ fontWeight: 900 }}>Privilege Tier</TableCell>
                                <TableCell sx={{ fontWeight: 900 }} align="right">Controls</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : filteredMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Group sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                        <Typography color="text.secondary" fontWeight={800}>No members match criteria.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredMembers.map((member) => (
                                <TableRow key={member._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main }}>
                                                {member.name?.charAt(0) || '?'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={800} color="primary">{member.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }} fontWeight={600}>{member.role}</Typography>
                                        <Typography variant="caption" color="text.secondary">ID: {member.studentId || member.facultyId || 'N/A'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700} color={member.libraryFines > 0 ? 'error' : 'text.primary'}>
                                            ${member.libraryFines || 0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={member.borrowingPrivilege?.toUpperCase() || 'STANDARD'}
                                            icon={member.borrowingPrivilege === 'suspended' ? <Block /> : member.borrowingPrivilege === 'premium' ? <VerifiedUser /> : <Security />}
                                            sx={{
                                                fontWeight: 900,
                                                bgcolor: member.borrowingPrivilege === 'suspended' ? alpha('#ef4444', 0.1) : member.borrowingPrivilege === 'premium' ? alpha('#8b5cf6', 0.1) : alpha('#10b981', 0.1),
                                                color: member.borrowingPrivilege === 'suspended' ? '#ef4444' : member.borrowingPrivilege === 'premium' ? '#8b5cf6' : '#10b981'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => { setSelectedMember(member); setPrivilegeLevel(member.borrowingPrivilege || 'standard'); setOpenPrivilege(true); }}
                                            sx={{ borderRadius: 2, fontWeight: 800, py: 0.5 }}
                                        >
                                            Adjust Access
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Change Privilege Dialog */}
            <Dialog open={openPrivilege} onClose={() => setOpenPrivilege(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, ...glassStyle } }}>
                <DialogTitle fontWeight={900}>Modify Account Privilege</DialogTitle>
                <DialogContent dividers>
                    {selectedMember && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="body1" fontWeight={800}>{selectedMember.name}</Typography>
                                <Typography variant="body2" color="text.secondary">Current Balance: ${selectedMember.libraryFines || 0}</Typography>
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>Enforce Privilege Level</InputLabel>
                                <Select value={privilegeLevel} label="Enforce Privilege Level" onChange={(e) => setPrivilegeLevel(e.target.value)}>
                                    <MenuItem value="restricted">Restricted (In-Library Use Only)</MenuItem>
                                    <MenuItem value="standard">Standard (Default Policy limit)</MenuItem>
                                    <MenuItem value="premium">Premium (Extended Limits - Faculty/Res)</MenuItem>
                                    <MenuItem value="suspended">Suspended (Blocked from Library Services)</MenuItem>
                                </Select>
                            </FormControl>

                            {privilegeLevel === 'suspended' && (
                                <Box sx={{ p: 2, bgcolor: alpha('#ef4444', 0.1), borderRadius: 2, border: '1px solid #ef4444' }}>
                                    <Typography variant="body2" color="error" fontWeight={800}>
                                        Suspending this member will prevent all further checkouts and catalog reservations until manually revoked.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenPrivilege(false)} sx={{ fontWeight: 800 }}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleUpdatePrivilege} sx={{ borderRadius: 2, fontWeight: 900 }}>Update Policy</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
