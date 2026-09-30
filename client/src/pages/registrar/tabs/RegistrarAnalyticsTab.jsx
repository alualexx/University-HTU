import React, { useState } from "react";
import {
    Box, Card, Typography, Grid, useTheme, Tabs, Tab, Button,
    Stack, TextField, MenuItem, Divider, alpha
} from "@mui/material";
import {
    Assessment, TrendingUp, Group, School, Paid, History,
    Download, PieChart as PieChartIcon, BarChart as BarChartIcon,
    Timeline, Public, FilterList, Event
} from "@mui/icons-material";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

export default function RegistrarAnalyticsTab({
    students = [],
    courses = [],
    enrollments = [],
    glassStyle
}) {
    const theme = useTheme();
    const [subTab, setSubTab] = useState(0);
    const [dateRange, setDateRange] = useState("semester");

    const enrollmentTrendData = [
        { name: 'Fall 24', students: 1200 },
        { name: 'Spring 25', students: 1450 },
        { name: 'Fall 25', students: 1800 },
        { name: 'Spring 26', students: 2100 },
    ];

    const deptData = [
        { name: 'Computing', value: 400 },
        { name: 'Engineering', value: 300 },
        { name: 'Medicine', value: 300 },
        { name: 'Business', value: 200 },
    ];

    const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Academic & Operational Analytics</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>STRATEGIC DATA VISUALIZATION FOR ENROLLMENT TRENDS, STUDENT RETENTION, AND ACADEMIC PERFORMANCE</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <TextField select size="small" value={dateRange} onChange={e => setDateRange(e.target.value)} sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                        <MenuItem value="semester">Last Semester</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                        <MenuItem value="all">Historical</MenuItem>
                    </TextField>
                    <Button variant="contained" startIcon={<Download />} sx={{ borderRadius: 3, fontWeight: 900 }}>Export Insights</Button>
                </Stack>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Retention Rate', val: '94.2%', trend: '+2.1%', color: '#10b981' },
                    { label: 'Avg Enrollment Gap', val: '12 Days', trend: '-3 Days', color: '#6366f1' },
                    { label: 'Pass Rate (Core)', val: '88.5%', trend: '+4.5%', color: '#a855f7' },
                    { label: 'Revenue Variance', val: '+$142k', trend: '+12%', color: '#f59e0b' },
                ].map((s, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{ ...glassStyle, p: 3, borderRadius: 5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={1000}>{s.label.toUpperCase()}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
                                <Typography variant="h5" fontWeight={1000}>{s.val}</Typography>
                                <Typography variant="caption" fontWeight={900} sx={{ color: s.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{s.trend}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 6, height: 450 }}>
                        <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Enrollment Density Trends</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={enrollmentTrendData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ ...glassStyle, p: 4, borderRadius: 6, height: 450 }}>
                        <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Departmental Enrollment</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={deptData} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                                    {deptData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
