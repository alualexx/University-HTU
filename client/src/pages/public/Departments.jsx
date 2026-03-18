import React, { useState, useEffect } from "react";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    Chip, CircularProgress, Dialog, DialogContent, DialogTitle,
    IconButton, Divider, Stack, alpha, useTheme, Avatar,
} from "@mui/material";
import {
    Close, School, MenuBook, People, ArrowForward, AutoStories,
    BusinessCenter, ExpandMore, AccessTime,
} from "@mui/icons-material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../services/Firebase";
import { Link as RouterLink } from "react-router-dom";

/* ── Detail Dialog ─────────────────────────────────────────── */
function DepartmentDetailDialog({ dept, open, onClose }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    if (!dept) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            PaperProps={{ sx: { borderRadius: 4, bgcolor: isDark ? "#0f172a" : "background.paper", border: "1px solid", borderColor: "divider" } }}>
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{
                    background: dept.gradient || "linear-gradient(135deg, #1976d2, #42a5f5)",
                    p: 4, display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56, fontSize: "1.4rem", fontWeight: 900, color: "white" }}>
                            {(dept.code || dept.name)?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={900} color="white" sx={{ fontFamily: "Outfit, sans-serif" }}>
                                {dept.name}
                            </Typography>
                            {dept.code && (
                                <Chip label={dept.code} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 800, mt: 0.5 }} />
                            )}
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                {dept.description && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom>About This Department</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>{dept.description}</Typography>
                    </Box>
                )}
                {dept.courses && dept.courses.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AutoStories sx={{ color: "primary.main" }} /> Course Catalog
                        </Typography>
                        <Grid container spacing={2}>
                            {dept.courses.map((course, i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Box sx={{
                                        p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider",
                                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                                        display: "flex", alignItems: "center", gap: 2
                                    }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(dept.color || "#1976d2", 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <MenuBook sx={{ fontSize: 18, color: dept.color || "primary.main" }} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={700}>{course}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
                {dept.details && (
                    <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha(dept.color || "#1976d2", 0.04), border: "1px solid", borderColor: alpha(dept.color || "#1976d2", 0.2) }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{dept.details}</Typography>
                    </Box>
                )}
                <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={`/apply/${dept.slug || "computer-science"}`}
                        endIcon={<ArrowForward />}
                        sx={{
                            background: dept.gradient || "linear-gradient(135deg, #1976d2, #42a5f5)",
                            borderRadius: 3, textTransform: "none", fontWeight: 800, px: 4,
                            boxShadow: `0 8px 20px ${alpha(dept.color || "#1976d2", 0.3)}`,
                        }}
                    >
                        Apply to This Department
                    </Button>
                    <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 700 }}>
                        Close
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

/* ── Department Card ──────────────────────────────────────── */
function DepartmentCard({ dept, onViewDetails }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const color = dept.color || "#1976d2";
    const gradient = dept.gradient || `linear-gradient(135deg, ${color}, ${color}99)`;

    return (
        <Card elevation={0} sx={{
            height: "100%", borderRadius: 5, border: "1px solid", borderColor: "divider",
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "background.paper",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            "&:hover": { transform: "translateY(-8px)", borderColor: color, boxShadow: `0 20px 40px ${alpha(color, 0.15)}` }
        }}>
            {/* Gradient top bar */}
            <Box sx={{ height: 6, background: gradient }} />
            <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: alpha(color, 0.12), color, width: 52, height: 52, fontSize: "1.2rem", fontWeight: 900 }}>
                        {(dept.code || dept.name)?.[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={900} sx={{ fontFamily: "Outfit, sans-serif", lineHeight: 1.2, mb: 0.5 }}>
                            {dept.name}
                        </Typography>
                        {dept.code && (
                            <Chip label={dept.code} size="small" sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 800, fontSize: "0.7rem" }} />
                        )}
                    </Box>
                </Box>

                {dept.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, flexGrow: 1, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}>
                        {dept.description}
                    </Typography>
                )}

                {dept.courses && dept.courses.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1, display: "block", mb: 1 }}>
                            {dept.courses.length} Courses Available
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                            {dept.courses.slice(0, 3).map((c, i) => (
                                <Chip key={i} label={c} size="small" sx={{ bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", fontSize: "0.7rem", fontWeight: 600 }} />
                            ))}
                            {dept.courses.length > 3 && (
                                <Chip label={`+${dept.courses.length - 3}`} size="small" sx={{ bgcolor: alpha(color, 0.1), color, fontSize: "0.7rem", fontWeight: 700 }} />
                            )}
                        </Box>
                    </Box>
                )}

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onViewDetails(dept)}
                    endIcon={<ArrowForward />}
                    sx={{
                        borderRadius: 3, textTransform: "none", fontWeight: 800,
                        borderColor: alpha(color, 0.4), color,
                        "&:hover": { bgcolor: alpha(color, 0.06), borderColor: color }
                    }}
                >
                    See Details
                </Button>
            </CardContent>
        </Card>
    );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function Departments() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "departments"), orderBy("name", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setDepartments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    const handleViewDetails = (dept) => {
        setSelectedDept(dept);
        setDialogOpen(true);
    };

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ── Hero Section ── */}
            <Box sx={{
                background: isDark
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                    : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 12 },
                position: "relative", overflow: "hidden",
            }}>
                <Box sx={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
                <Box sx={{ position: "absolute", bottom: -50, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Chip label="University Departments" sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)", color: "white", fontWeight: 800, border: "1px solid rgba(255,255,255,0.2)" }} />
                    <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", mb: 2, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
                        Explore Our <Box component="span" sx={{ color: "#60a5fa" }}>Departments</Box>
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.65)" sx={{ maxWidth: 560, mx: "auto", fontWeight: 500, lineHeight: 1.8 }}>
                        Browse every academic department, their course catalog, and discover the program that aligns with your goals.
                    </Typography>
                </Container>
            </Box>

            {/* ── Departments Grid ── */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                        <CircularProgress size={48} />
                    </Box>
                ) : departments.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 12 }}>
                        <School sx={{ fontSize: 64, color: "text.disabled", mb: 3 }} />
                        <Typography variant="h5" fontWeight={700} color="text.secondary">
                            Department catalog is being prepared.
                        </Typography>
                        <Typography variant="body1" color="text.disabled" sx={{ mt: 1 }}>
                            The Registrar will publish department details soon. Check back shortly.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {departments.map((dept) => (
                            <Grid item xs={12} sm={6} md={4} key={dept.id}>
                                <DepartmentCard dept={dept} onViewDetails={handleViewDetails} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* ── Detail Dialog ── */}
            <DepartmentDetailDialog dept={selectedDept} open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </Box>
    );
}
