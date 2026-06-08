import React, { useState } from "react";
import {
    Box, Typography, Avatar, Button, Card, CardContent,
    Table, TableBody, TableCell, TableHead, TableRow, Chip,
    Grid, TextField, InputAdornment, IconButton, Tooltip, Stack
} from "@mui/material";
import {
    Search, FilterList, Add, CheckCircle,
    AccountBalanceWallet, VpnKey, Warning
} from "@mui/icons-material";

export default function AccountManagementTab({ isDark, cardSx, gradients }) {
    const [activeRole, setActiveRole] = useState("student"); // student, staff, third-party

    const roles = [
        { id: "student", label: "Student Accounts" },
        { id: "staff", label: "Staff Accounts" },
        { id: "thirdparty", label: "Third-Party Payers" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>Account Management</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Manage financial portfolios and access levels
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 3, fontWeight: 800, textTransform: "none" }}>
                        Create New Account
                    </Button>
                </Stack>
            </Box>

            {/* Role Access Toggles */}
            <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: "auto", pb: 1 }}>
                {roles.map((r) => (
                    <Chip
                        key={r.id}
                        label={r.label}
                        onClick={() => setActiveRole(r.id)}
                        sx={{
                            fontWeight: 800,
                            px: 1,
                            py: 2.5,
                            borderRadius: 3,
                            bgcolor: activeRole === r.id ? "primary.main" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                            color: activeRole === r.id ? "white" : "text.secondary",
                            "&:hover": { bgcolor: activeRole === r.id ? "primary.dark" : "primary.light", color: "white" }
                        }}
                    />
                ))}
            </Stack>

            <Card sx={{ ...cardSx, borderRadius: 4, overflow: "hidden" }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
                        <TextField
                            placeholder="Search accounts by ID or Name..."
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                                sx: { borderRadius: 3, width: { xs: 200, sm: 300 } }
                            }}
                        />
                        <IconButton><FilterList /></IconButton>
                    </Box>

                    <Box sx={{ overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", borderBottom: "none" }}>Account Holder</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", borderBottom: "none" }}>ID / Reference</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", borderBottom: "none" }}>Balance</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", borderBottom: "none" }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", borderBottom: "none" }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Placeholder Row 1 */}
                                <TableRow hover>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: gradients[0] }}>JD</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800}>John Doe</Typography>
                                                <Typography variant="caption" color="text.secondary">BS Computer Science</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Typography variant="body2" fontWeight={700}>STU-2023-001</Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Typography variant="body2" fontWeight={900} color="error.main">$-1,200.00</Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Chip size="small" label="Active" icon={<CheckCircle sx={{ fontSize: "14px" }} />} sx={{ bgcolor: "success.main", color: "white", fontWeight: 800 }} />
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Tooltip title="View Ledger"><IconButton size="small"><AccountBalanceWallet fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Reset Access"><IconButton size="small"><VpnKey fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>

                                {/* Placeholder Row 2 */}
                                <TableRow hover>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: gradients[1] }}>EJ</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800}>Emma Jones</Typography>
                                                <Typography variant="caption" color="text.secondary">BS Information Tech</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Typography variant="body2" fontWeight={700}>STU-2023-002</Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Typography variant="body2" fontWeight={900} color="success.main">$450.00</Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Chip size="small" label="Hold" icon={<Warning sx={{ fontSize: "14px" }} />} sx={{ bgcolor: "warning.main", color: "white", fontWeight: 800 }} />
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 1, borderColor: "divider" }}>
                                        <Tooltip title="View Ledger"><IconButton size="small"><AccountBalanceWallet fontSize="small" /></IconButton></Tooltip>
                                        <Tooltip title="Reset Access"><IconButton size="small"><VpnKey fontSize="small" /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </CardContent>
            </Card>

            {/* Officer/Cashier Toggle Configuration Panel */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2 }}>Quick Access Permissions</Typography>
                <Grid container spacing={3}>
                    {["Cashier", "Auditor", "Officer", "HOD"].map((role, i) => (
                        <Grid item xs={12} sm={6} md={3} key={role}>
                            <Card sx={{ ...cardSx, borderRadius: 3, textAlign: "center", p: 2, border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                                <Typography variant="subtitle1" fontWeight={800}>{role}</Typography>
                                <Button size="small" variant="outlined" sx={{ mt: 1, borderRadius: 2, fontWeight: 700, textTransform: "none" }}>Manage Access</Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
