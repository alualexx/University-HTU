import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const DepartmentCard = ({ dept, onApply, globalAdmissionOpen }) => {
    const [hovered, setHovered] = useState(false);
    const styles = getDeptStyles(dept.name);
    const isAdmissionEnabled = globalAdmissionOpen && dept.admissionOpen;

    return (
        <Card
            elevation={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 8,
                border: "1px solid",
                borderColor: hovered ? "primary.light" : "divider",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                transform: hovered ? "translateY(-12px)" : "none",
                boxShadow: hovered ? `0 32px 64px -12px ${alpha(styles.color, 0.2)}` : "0 4px 12px rgba(0,0,0,0.03)",
                bgcolor: 'background.paper',
                opacity: isAdmissionEnabled ? 1 : 0.8
            }}
        >
            <Box sx={{ height: 8, background: styles.gradient }} />

            <CardContent sx={{ flexGrow: 1, p: 5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                    <Box sx={{
                        width: 84, height: 84, borderRadius: 4,
                        background: styles.gradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", flexShrink: 0,
                        boxShadow: `0 12px 24px ${alpha(styles.color, 0.3)}`,
                        transition: "all 0.4s ease",
                        transform: hovered ? "scale(1.1) rotate(-8deg)" : "none",
                    }}>
                        {styles.icon}
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Chip
                            label={isAdmissionEnabled ? "OPEN" : "CLOSED"}
                            size="small"
                            color={isAdmissionEnabled ? "success" : "error"}
                            sx={{ fontWeight: 1000, fontSize: "0.65rem", mb: 1, px: 1 }}
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                            <People sx={{ fontSize: 16, color: "primary.main" }} />
                            <Typography variant="caption" color="text.primary" fontWeight={1000}>{dept.seats || "N/A"} SEATS</Typography>
                        </Box>
                    </Box>
                </Box>

                <Typography variant="h4" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: "-0.02em", mb: 1 }}>
                    {dept.name}
                </Typography>
                <Typography variant="caption" fontWeight={900} color="primary.main" sx={{ mb: 3, display: "block", textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    {dept.faculty || "University Department"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, fontWeight: 500 }}>
                    {dept.description || "Join our comprehensive program designed for the next generation of professionals."}
                </Typography>

                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                <Typography variant="caption" fontWeight={1000} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: 1.2, mb: 2, display: "block" }}>
                    Admission Requirements
                </Typography>
                <Stack spacing={1.5}>
                    {(dept.requiredDocuments || ["High School Transcript", "Identification Document"]).map((req, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: alpha(styles.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle sx={{ fontSize: 10, color: styles.color }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>{req}</Typography>
                        </Box>
                    ))}
                </Stack>
            </CardContent>

            <Box sx={{ px: 5, pb: 5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onApply(dept.id)}
                    disabled={!isAdmissionEnabled}
                    endIcon={<ArrowForward />}
                    sx={{
                        borderRadius: 4,
                        fontWeight: 1000,
                        textTransform: "none",
                        py: 2.2,
                        fontSize: '1rem',
                        background: isAdmissionEnabled ? styles.gradient : '#94a3b8',
                        boxShadow: isAdmissionEnabled ? `0 12px 32px ${alpha(styles.color, 0.3)}` : "none",
                        "&:hover": {
                            background: isAdmissionEnabled ? styles.gradient : '#94a3b8',
                            boxShadow: isAdmissionEnabled ? `0 16px 48px ${alpha(styles.color, 0.45)}` : "none",
                            transform: isAdmissionEnabled ? "scale(1.02)" : "none",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    {isAdmissionEnabled
                        ? "Initiate Application"
                        : (globalAdmissionOpen ? "Admissions Closed" : "Portal Deactivated")
                    }
                </Button>
            </Box>
        </Card>
    );
};

const Apply = () => {
    const navigate = useNavigate();
    const { globalAdmissionOpen } = useAuth();
    const [admissionsPosts, setAdmissionsPosts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch departments from API
                const deptRes = await departmentsAPI.getAll();
                // We keep the isPublished check if the API returns all, 
                // or just show what the API returns in this simplified demo
                setDepartments(deptRes.data.filter(d => d.isPublished !== false));

                // Fetch announcements/admissions posts from API
                const postRes = await announcementsAPI.getAll({ category: "admission" });
                setAdmissionsPosts(postRes.data);
            } catch (err) {
                console.error("Error fetching apply page data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApply = (deptId) => {
        navigate(`/apply/${deptId}`);
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "Recently";
        if (typeof dateValue.toDate === 'function') {
            return dateValue.toDate().toLocaleDateString();
        }
        if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString();
        }
        return "Recently";
    };

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ── Premium Hero ── */}
            <Box sx={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                pt: { xs: 15, md: 22 }, pb: { xs: 15, md: 22 },
                position: "relative", overflow: "hidden",
            }}>
                {/* Background effects */}
                <Box sx={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: -150, right: -150, background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", filter: 'blur(80px)' }} />
                <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: -100, left: -100, background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)", filter: 'blur(60px)' }} />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.2, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4 }}>
                        <School sx={{ color: 'primary.main', fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={1000} sx={{ color: 'white', letterSpacing: 1.5, textTransform: 'uppercase' }}>Academic Intake Cycle 2026</Typography>
                    </Box>

                    <Typography variant="h1" fontWeight={1000} color="white" sx={{ fontSize: { xs: "2.8rem", md: "4.5rem" }, letterSpacing: "-0.04em", mb: 3, fontFamily: 'Outfit, sans-serif' }}>
                        Architect Your <Box component="span" sx={{ color: 'primary.main' }}>Destiny</Box>
                    </Typography>

                    <Typography variant="h5" color="rgba(255,255,255,0.5)" sx={{ mb: 8, fontWeight: 500, maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
                        Join a global network of innovators and leaders. Select your specialized domain from our world-class departments below to begin your digital application process.
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { value: departments.length.toString().padStart(2, '0'), label: "Specialized Schools" },
                            { value: "570", label: "Intellectual Slots" },
                            { value: "100%", label: "Encrypted Intake" },
                        ].map((stat) => (
                            <Grid item key={stat.label}>
                                <Box sx={{
                                    p: 4, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                                    minWidth: 180
                                }}>
                                    <Typography variant="h3" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight={1000} sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>{stat.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Admissions Live Feed ── */}
            {admissionsPosts.length > 0 && (
                <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 10 }}>
                    <Stack spacing={2}>
                        {admissionsPosts.map((post) => (
                            <Alert
                                key={post.id}
                                icon={<CampaignOutlined fontSize="inherit" />}
                                severity={post.isImportant ? "error" : "info"}
                                sx={{
                                    borderRadius: 4,
                                    alignItems: "center",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
                                    border: "1px solid",
                                    borderColor: post.isImportant ? alpha("#ef4444", 0.3) : alpha("#0ea5e9", 0.3),
                                    bgcolor: "background.paper",
                                    px: 3, py: 1.5,
                                    "& .MuiAlert-message": { width: "100%" }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 2 }}>
                                    <Box>
                                        <Typography variant="body1" fontWeight={900}>{post.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{post.content}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
                                        <Chip label={post.tag} size="small" sx={{ fontWeight: 800, fontSize: "0.65rem", textTransform: 'uppercase' }} />
                                        <Typography variant="caption" fontWeight={700} color="text.disabled">{formatDate(post.date)}</Typography>
                                    </Box>
                                </Box>
                            </Alert>
                        ))}
                    </Stack>
                </Container>
            )}

            {/* ── Department Grid ── */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Box textAlign="left" mb={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ width: 40, height: 4, bgcolor: 'primary.main', borderRadius: 2 }} />
                        <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 2, textTransform: 'uppercase' }}>DEPARTMENTS</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: "-0.02em" }}>
                        Specialized Programs
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 600 }}>
                        Every program is designed to bridge the gap between academic theory and industry excellence.
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : departments.length > 0 ? (
                    <Grid container spacing={4}>
                        {departments.map((dept) => (
                            <Grid item xs={12} sm={6} md={4} key={dept.id}>
                                <DepartmentCard dept={dept} onApply={handleApply} globalAdmissionOpen={globalAdmissionOpen} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ p: 8, textAlign: 'center', bgcolor: alpha('#475569', 0.05), borderRadius: 6 }}>
                        <Typography variant="h5" fontWeight={700} color="text.secondary">No programs currently published.</Typography>
                        <Typography variant="body1" color="text.secondary">Please check back later or contact the registrar's office.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Apply;
