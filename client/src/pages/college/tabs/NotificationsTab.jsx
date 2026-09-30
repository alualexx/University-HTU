import React, { useState, useEffect } from "react";
import {
    Box, Card, CardContent, Typography, Chip, Stack,
    Avatar, IconButton, alpha, Button, CircularProgress,
} from "@mui/material";
import { NotificationsActive, Circle, CheckCircle, MarkEmailRead } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { notificationsAPI } from "../../../services/api";

const TYPE_CONFIG = {
    urgent: { color: "#ef4444", label: "URGENT" },
    warning: { color: "#f59e0b", label: "WARNING" },
    info: { color: "#3b82f6", label: "INFO" },
    success: { color: "#10b981", label: "SUCCESS" },
};

export default function NotificationsTab() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const glass = {
        background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.5)",
        borderRadius: 3,
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await notificationsAPI.getAll();
                setNotifications(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => (n._id || n.id) === id ? { ...n, read: true } : n));
        } catch (e) { console.error(e); }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.read);
        await Promise.allSettled(unread.map(n => notificationsAPI.markAsRead(n._id || n.id)));
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h5" fontWeight={1000}>
                        System Notifications & Alerts
                        {unreadCount > 0 && (
                            <Chip label={unreadCount} size="small"
                                sx={{ ml: 1.5, bgcolor: "#ef4444", color: "#fff", fontWeight: 900, height: 20 }} />
                        )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                        DEADLINES • BUDGET ALERTS • COLLEGE-WIDE BROADCASTS
                    </Typography>
                </Box>
                {unreadCount > 0 && (
                    <Button startIcon={<MarkEmailRead />} variant="outlined" onClick={handleMarkAllRead}
                        sx={{ borderRadius: 2, fontWeight: 800, textTransform: "none" }}>
                        Mark All Read
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : notifications.length === 0 ? (
                <Box sx={{ ...glass, p: 8, textAlign: "center" }}>
                    <CheckCircle sx={{ fontSize: 60, color: "#10b981", opacity: 0.4, mb: 2 }} />
                    <Typography color="text.secondary" fontWeight={700}>You're all caught up — no notifications</Typography>
                </Box>
            ) : (
                <Stack spacing={2} sx={{ maxWidth: 860 }}>
                    {notifications.map(n => {
                        const id = n._id || n.id;
                        const typeKey = n.type || "info";
                        const cfg = TYPE_CONFIG[typeKey] || TYPE_CONFIG.info;
                        const color = cfg.color;
                        const isRead = n.read;

                        return (
                            <Card key={id} sx={{
                                ...glass,
                                opacity: isRead ? 0.7 : 1,
                                borderLeft: `3px solid ${isRead ? "transparent" : color}`,
                                transition: "0.2s",
                            }}>
                                <CardContent sx={{ p: 3, display: "flex", gap: 3, alignItems: "flex-start" }}>
                                    <Avatar sx={{ bgcolor: alpha(color, 0.12), color, mt: 0.5 }}>
                                        <NotificationsActive />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                                            <Typography variant="subtitle1" fontWeight={900}>{n.title || n.message}</Typography>
                                            <Chip label={n.source || cfg.label} size="small"
                                                sx={{ fontWeight: 900, fontSize: "0.65rem" }} />
                                        </Box>
                                        {n.title && n.message && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {n.message}
                                            </Typography>
                                        )}
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="caption" fontWeight={800} sx={{ color }}>
                                                {cfg.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                                {n.timestamp ? new Date(n.timestamp).toLocaleString() : (n.createdAt ? new Date(n.createdAt).toLocaleString() : "")}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <IconButton size="small" onClick={() => !isRead && handleMarkRead(id)}
                                        sx={{ color: isRead ? "text.disabled" : color }}>
                                        <Circle sx={{ fontSize: 12 }} />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}
