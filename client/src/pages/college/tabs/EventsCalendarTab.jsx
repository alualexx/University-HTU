import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip, Stack,
    Tabs, Tab, alpha, Avatar, IconButton,
} from "@mui/material";
import { CalendarMonth, Event, Groups, School, NavigateBefore, NavigateNext, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const GRADIENTS = { premium: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" };

export default function EventsCalendarTab({ events }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [subTab, setSubTab] = useState(0);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    const academicEvents = events || [
        { title: "Fall Convocation", date: "2026-09-05", type: "Ceremony", location: "Main Auditorium", attendees: "1200+" },
        { title: "Dean's Townhall", date: "2026-10-12", type: "Meeting", location: "Hall A", attendees: "300" },
        { title: "Guest Lecture: AI Horizons", date: "2026-11-20", type: "Lecture", location: "Virtual", attendees: "500" },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>Events & Calendar Management</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>CEREMONIES • MEETINGS • GUEST LECTURES • OPEN DAYS</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2.5, fontWeight: 900, textTransform: "none", background: GRADIENTS.premium }}>
                    Create Event
                </Button>
            </Box>

            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { height: 3, borderRadius: 2, bgcolor: "#f43f5e" }, "& .MuiTab-root": { fontWeight: 800, textTransform: "none", "&.Mui-selected": { color: "#f43f5e" } } }}>
                {["Upcoming Events", "Committees & Meetings", "Archive & Reports"].map((t, i) => <Tab key={i} label={t} />)}
            </Tabs>

            {subTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ ...glass }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${alpha("#94a3b8", 0.1)}` }}>
                                    <Typography variant="h6" fontWeight={900}>Event Schedule</Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton size="small"><NavigateBefore /></IconButton>
                                        <Typography variant="body2" fontWeight={800}>Sep – Nov 2026</Typography>
                                        <IconButton size="small"><NavigateNext /></IconButton>
                                    </Box>
                                </Box>
                                <Stack sx={{ p: 1 }}>
                                    {academicEvents.map((ev, i) => (
                                        <Box key={i} sx={{ display: "flex", gap: 3, p: 2, "&:hover": { bgcolor: alpha("#f43f5e", 0.02) }, borderRadius: 2 }}>
                                            <Box sx={{ minWidth: 64, textAlign: "center", p: 1.5, bgcolor: alpha("#f43f5e", 0.1), borderRadius: 3 }}>
                                                <Typography variant="h5" fontWeight={1000} color="#f43f5e">{new Date(ev.date).getDate()}</Typography>
                                                <Typography variant="caption" fontWeight={900} color="#f43f5e">{new Date(ev.date).toLocaleString("en", { month: "short" })}</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, pt: 0.5 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                                                    <Typography variant="subtitle1" fontWeight={900}>{ev.title}</Typography>
                                                    <Chip label={ev.type.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.65rem" }} />
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Event sx={{ fontSize: 14 }} /> {ev.location}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Groups sx={{ fontSize: 14 }} /> {ev.attendees} expected</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Card sx={{ ...glass }}>
                                <CardContent sx={{ p: 3, textAlign: "center" }}>
                                    <Avatar sx={{ mx: "auto", mb: 2, bgcolor: alpha("#f43f5e", 0.1), color: "#f43f5e", width: 56, height: 56 }}><School /></Avatar>
                                    <Typography variant="h6" fontWeight={900}>Convocation 2026</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Class of 2026 Graduation Ceremony tracking and preparation.</Typography>
                                    <Button fullWidth variant="outlined" sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none", color: "#f43f5e", borderColor: alpha("#f43f5e", 0.3) }}>Track Readiness</Button>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
