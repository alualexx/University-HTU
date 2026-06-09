import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack, Avatar,
    TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs, Tab, alpha, Divider, LinearProgress, InputAdornment,
} from "@mui/material";
import { Search, School, TrendingUp, People, Warning, CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

const GRADIENTS = {
    premium: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
};

export default function FacultyStaffTab({ departments, facultyList: initialFaculty }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");

    const faculty = initialFaculty || [];

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const promotionRequests = [
        { name: "Dr. Ahmad Khalil", dept: "Computer Science", current: "Associate Professor", target: "Full Professor", years: 6, publications: 18, status: "pending" },
        { name: "Dr. Sara Hassan", dept: "Engineering", current: "Assistant Professor", target: "Associate Professor", years: 4, publications: 9, status: "under_review" },
    ];

    const leaveRequests = [
        { name: "Prof. Mohammed Ali", dept: "Business", type: "Medical Leave", from: "2026-06-15", to: "2026-06-30", status: "pending" },
        { name: "Dr. Fatima Omar", dept: "Sciences", type: "Conference Leave", from: "2026-07-01", to: "2026-07-05", status: "approved" },
        { name: "Dr. Khalid Nasser", dept: "Humanities", type: "Annual Leave", from: "2026-08-01", to: "2026-08-15", status: "pending" },
    ];

    const grievances = [
        { id: "GR-001", type: "Workload Dispute", dept: "Engineering", date: "2026-05-20", status: "open" },
        { id: "GR-002", type: "Promotion Appeal", dept: "Sciences", date: "2026-05-15", status: "under_review" },
    ];

    const filtered = faculty.filter(f => {
        const ms = !search || f.name?.toLowerCase().includes(search.toLowerCase());
        const md = deptFilter === "all" || f.department === deptFilter;
        return ms && md;
    });

    const subTabs = ["Faculty Directory", "Workload", "Promotions & Tenure", "Leave Requests", "Grievances"];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={1000}>Faculty & Staff Oversight</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800}>DIRECTORY • WORKLOAD • PROMOTIONS • LEAVES • GRIEVANCES</Typography>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none" } }}>
                {subTabs.map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <Box>
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <TextField size="small" placeholder="Search faculty…" value={search} onChange={e => setSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
                            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                        <TextField select size="small" label="Department" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                            sx={{ minWidth: 200 }}>
                            <option value="all">All Departments</option>
                            {departments?.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </TextField>
                    </Stack>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {[
                            { label: "Total Faculty", value: faculty.length, color: "#6366f1" },
                            { label: "Professors", value: Math.floor(faculty.length * 0.3), color: "#10b981" },
                            { label: "On Leave", value: leaveRequests.filter(r => r.status === "approved").length, color: "#f59e0b" },
                            { label: "PhD Holders", value: Math.floor(faculty.length * 0.72), color: "#8b5cf6" },
                        ].map((s, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 2.5, textAlign: "center" }}>
                                        <Typography variant="h4" fontWeight={1000} color={s.color}>{s.value}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{s.label}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <TableContainer sx={{ ...glass }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Faculty Member", "Department", "Position", "Status", "Actions"].map(h => (
                                        <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.slice(0, 20).map(f => (
                                    <TableRow key={f._id}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar sx={{ background: GRADIENTS.premium, fontWeight: 900, fontSize: "1rem" }}>{f.name?.[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={900}>{f.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{f.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{f.department}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{f.position || "Lecturer"}</TableCell>
                                        <TableCell>
                                            <Chip label={f.status?.toUpperCase() || "ACTIVE"} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha("#10b981", 0.1), color: "#10b981" }} />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small" sx={{ fontWeight: 800, textTransform: "none" }}>View Profile</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>No faculty found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {subTab === 1 && (
                <Grid container spacing={3}>
                    {(departments?.length > 0 ? departments : [{ name: "Sample Dept", _id: "1" }]).slice(0, 6).map((dept, i) => {
                        const avgLoad = (i % 6) + 8;
                        const pct = Math.round((avgLoad / 15) * 100);
                        return (
                            <Grid item xs={12} md={6} key={i}>
                                <Card sx={{ ...glass }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                            <Typography variant="subtitle1" fontWeight={900}>{dept.name}</Typography>
                                            <Chip label={pct > 80 ? "HIGH" : "NORMAL"} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha(pct > 80 ? "#ef4444" : "#10b981", 0.1), color: pct > 80 ? "#ef4444" : "#10b981" }} />
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Avg Credit Hours / Faculty</Typography>
                                            <Typography variant="caption" fontWeight={900}>{avgLoad} / 15</Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: alpha("#94a3b8", 0.15), "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: pct > 80 ? "#ef4444" : "#10b981" } }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {subTab === 2 && (
                <Stack spacing={3}>
                    {promotionRequests.map((req, i) => (
                        <Card key={i} sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Avatar sx={{ background: GRADIENTS.premium, fontWeight: 900 }}>{req.name[0]}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={900}>{req.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{req.dept}</Typography>
                                        </Box>
                                    </Box>
                                    <Chip label={req.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b" }} />
                                </Box>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    {[{ l: "Current", v: req.current }, { l: "Target", v: req.target }, { l: "Service", v: `${req.years} yrs` }, { l: "Publications", v: req.publications }].map((item, j) => (
                                        <Grid item xs={6} sm={3} key={j}>
                                            <Box sx={{ p: 1.5, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={800}>{item.l}</Typography>
                                                <Typography variant="body2" fontWeight={900}>{item.v}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" variant="contained" color="success" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                    <Button size="small" variant="outlined" color="warning" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Defer</Button>
                                    <Button size="small" variant="text" sx={{ fontWeight: 800, textTransform: "none" }}>View File</Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {subTab === 3 && (
                <TableContainer sx={{ ...glass }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Faculty", "Dept", "Leave Type", "From", "To", "Status", "Actions"].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaveRequests.map((req, i) => {
                                const colors = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };
                                return (
                                    <TableRow key={i}>
                                        <TableCell sx={{ fontWeight: 800 }}>{req.name}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{req.dept}</TableCell>
                                        <TableCell><Chip label={req.type} size="small" sx={{ fontWeight: 900 }} /></TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{req.from}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{req.to}</TableCell>
                                        <TableCell><Chip label={req.status.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha(colors[req.status], 0.1), color: colors[req.status] }} /></TableCell>
                                        <TableCell>
                                            {req.status === "pending" && (
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" color="success" variant="contained" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Approve</Button>
                                                    <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 900, textTransform: "none" }}>Reject</Button>
                                                </Stack>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {subTab === 4 && (
                <Stack spacing={2}>
                    {grievances.map((g, i) => (
                        <Card key={i} sx={{ ...glass }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={900}>Case {g.id}: {g.type}</Typography>
                                        <Typography variant="caption" color="text.secondary">{g.dept} · Filed {g.date}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip label={g.status.replace("_", " ").toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem", bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b" }} />
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}>Respond</Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
