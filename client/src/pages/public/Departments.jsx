import React, { useState, useEffect } from "react";
import {
    Box, Container, Typography, Grid, Card, CardContent, Button,
    Chip, CircularProgress, Dialog, DialogContent, DialogTitle,
    IconButton, Divider, Stack, alpha, useTheme, Avatar
} from "@mui/material";
import {
    Close, School, MenuBook, People, ArrowForward, AutoStories,
    Church, AccessTime
} from "@mui/icons-material";
import { departmentsAPI } from "../../services/api";
import { Link as RouterLink } from "react-router-dom";

const FALLBACK_DEPTS = [
    {
        id: "dept-bib",
        code: "BIB",
        name: "Biblical Studies",
        name_amharic: "የመጽሐፍ ቅዱስ ጥናት",
        head: "Dr. Alemeyahu Worku",
        color: "#D9A621",
        description: "Specializing in Old & New Testament exegesis, hermeneutics, and Septuagintal traditions within the 81-book Ethiopian Orthodox Biblical canon.",
        courses: ["Old Testament Exegesis", "Pauline Epistles & Johannine Corpus", "Biblical Hebrew & Greek", "Septuagint Hermeneutics"]
    },
    {
        id: "dept-theo",
        code: "THEO",
        name: "Systematic Theology",
        name_amharic: "ስልታዊ ቴዎሎጂ",
        head: "Dr. Sofia Assefa",
        color: "#12808C",
        description: "Explores Orthodox Christian dogma, Christology, Pneumatology, and Trinitarian theology rooted in the teachings of the holy Church Fathers.",
        courses: ["Patristic Christology", "Theology of the Holy Trinity", "Nicene-Constantinopolitan Creed", "Ecumenical Councils"]
    },
    {
        id: "dept-chis",
        code: "CHIS",
        name: "Church History",
        name_amharic: "የቤተክርስቲያን ታሪክ",
        head: "Rev. Dr. Abeba Zerihun",
        color: "#D9A621",
        description: "History of the Universal Christian Church, Ecumenical Councils, and Ethiopian Orthodox Church patrimony from antiquity to modern times.",
        courses: ["Ancient Church History", "Ethiopian Monastic Traditions", "Nine Saints of Axum", "Ecclesiastical Historiography"]
    },
    {
        id: "dept-past",
        code: "PAST",
        name: "Pastoral Theology",
        name_amharic: "የአርብቶ አደርነት ቴዎሎጂ",
        head: "Archbishop Merkorios Tilahun",
        color: "#12808C",
        description: "Pastoral counseling, spiritual leadership, homiletics, parish administration, and spiritual formation for ordained ministry.",
        courses: ["Pastoral Counseling & Care", "Parish Administration", "Homiletics (Preaching)", "Canonical Ethics"]
    },
    {
        id: "dept-lit",
        code: "LIT",
        name: "Liturgical Studies",
        name_amharic: "የሥርዓተ አምልኮ ጥናት",
        head: "Fr. Teklehaimanot Gebre",
        color: "#D9A621",
        description: "Historical theology of Christian worship, sacramental mystery (Meksi), and comparative analysis of the 14 Ethiopic Eucharistic Liturgies.",
        courses: ["Liturgical Theology", "The 14 Ethiopic Anaphoras", "Sacramentology", "Fetha Nagast (Canon Law)"]
    },
    {
        id: "dept-chm",
        code: "CHM",
        name: "Church Music & Hymnology",
        name_amharic: "የቤተክርስቲያን ዜማና ሙዚቃ",
        head: "Memhir Hailemariam Tesfaye",
        color: "#12808C",
        description: "Mastery of the sacred musical modes invented by St. Yared (Ge'ez, Ezel, Araray), musical notation (Sereye), and liturgical performance.",
        courses: ["St. Yared Modalities", "Diggua & Tsome Diggua", "Liturgical Instruments & Aquaquam", "Mewasiet & Zimare"]
    },
    {
        id: "dept-gez",
        code: "GEZ",
        name: "Ge'ez & Classical Languages",
        name_amharic: "ግዕዝና ጥንታዊ ቋንቋዎች",
        head: "Dr. Alemeyahu Worku",
        color: "#D9A621",
        description: "Grammar, syntax, paleography, and direct transcription of Classical Ethiopic parchment codices, ancient inscriptions, and Syriac texts.",
        courses: ["Introduction to Ge'ez", "Intermediate Ge'ez Syntax", "Parchment Manuscript Reading", "Classical Ethiopic Literature"]
    }
];

export default function Departments() {
    const [departments, setDepartments] = useState(FALLBACK_DEPTS);
    const [selectedDept, setSelectedDept] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await departmentsAPI.getAll();
                if (res.data && res.data.length > 0) {
                    const merged = res.data.map((d, i) => ({
                        ...FALLBACK_DEPTS[i % FALLBACK_DEPTS.length],
                        ...d,
                        name: d.name || FALLBACK_DEPTS[i % FALLBACK_DEPTS.length].name,
                        code: d.code || FALLBACK_DEPTS[i % FALLBACK_DEPTS.length].code,
                        head: d.head_faculty_name || FALLBACK_DEPTS[i % FALLBACK_DEPTS.length].head
                    }));
                    setDepartments(merged);
                }
            } catch (err) {
                console.log("Using theological fallback departments");
            }
        };
        fetchDepts();
    }, []);

    const handleViewDetails = (dept) => {
        setSelectedDept(dept);
        setDialogOpen(true);
    };

    return (
        <Box sx={{ bgcolor: "#09131F", minHeight: "100vh", color: "white" }}>
            {/* Header */}
            <Box sx={{
                position: "relative",
                pt: { xs: 14, md: 18 }, pb: 8,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "radial-gradient(circle at 50% 20%, #122842 0%, #09131F 80%)"
            }}>
                <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                    <Chip 
                        icon={<Church sx={{ color: "#D9A621 !important", fontSize: 18 }} />} 
                        label="7 Theological Departments" 
                        sx={{ mb: 2.5, bgcolor: "rgba(217,166,33,0.12)", color: "#D9A621", fontWeight: 800, border: "1px solid rgba(217,166,33,0.3)" }} 
                    />
                    <Typography variant="h2" fontWeight={1000} sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", mb: 2, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
                        Academic <Box component="span" sx={{ color: "#D9A621" }}>Departments</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 650, mx: "auto", fontSize: "1.05rem" }}>
                        Explore our 7 specialized Orthodox theological departments offering accredited Bachelor of Theology (BTh), Master of Divinity (MDiv), and Diploma programs.
                    </Typography>
                </Container>
            </Box>

            {/* Grid */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={3.5}>
                    {departments.map((dept) => (
                        <Grid item xs={12} sm={6} md={4} key={dept.id || dept.code}>
                            <Card sx={{
                                bgcolor: "rgba(14, 32, 51, 0.5)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 4,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    borderColor: dept.color || "#D9A621",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.5)"
                                }
                            }}>
                                <CardContent sx={{ p: 3.5, flex: 1, display: "flex", flexDirection: "column" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Chip
                                            label={dept.code}
                                            size="small"
                                            sx={{ bgcolor: alpha(dept.color || "#D9A621", 0.15), color: dept.color || "#D9A621", fontWeight: 900, borderRadius: 1.5 }}
                                        />
                                        <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                                            Chair: {dept.head}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff", mb: 0.5, lineHeight: 1.3 }}>
                                        {dept.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#D9A621", fontWeight: 700, mb: 1.5 }}>
                                        {dept.name_amharic}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.65, mb: 2.5, flex: 1, fontSize: "0.86rem" }}>
                                        {dept.description}
                                    </Typography>

                                    {dept.courses && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 1 }}>
                                                Core Disciplines:
                                            </Typography>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                                                {dept.courses.slice(0, 3).map((c, i) => (
                                                    <Chip key={i} label={c} size="small" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", fontSize: "0.72rem" }} />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handleViewDetails(dept)}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            borderRadius: 2.5,
                                            borderColor: alpha(dept.color || "#D9A621", 0.4),
                                            color: dept.color || "#D9A621",
                                            fontWeight: 800,
                                            textTransform: "none",
                                            "&:hover": {
                                                borderColor: dept.color || "#D9A621",
                                                bgcolor: alpha(dept.color || "#D9A621", 0.1)
                                            }
                                        }}
                                    >
                                        Department Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Modal Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#0E2033",
                        color: "white",
                        borderRadius: 4,
                        border: "1px solid rgba(217,166,33,0.3)"
                    }
                }}
            >
                {selectedDept && (
                    <>
                        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", p: 3 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff" }}>
                                    {selectedDept.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#D9A621", fontWeight: 700 }}>
                                    {selectedDept.name_amharic} · {selectedDept.code}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setDialogOpen(false)} sx={{ color: "rgba(255,255,255,0.6)" }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, mb: 3 }}>
                                {selectedDept.description}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: "#D9A621", fontWeight: 800, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Program Offerings
                            </Typography>
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Chip label="Bachelor of Theology (B.Th.) · 4 Years / 130 Credits" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", justifyContent: "flex-start" }} />
                                <Chip label="Master of Divinity (M.Div.) · 2 Years / 60 Credits" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", justifyContent: "flex-start" }} />
                                <Chip label="Diploma in Orthodox Theological Studies · 2 Years" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#fff", justifyContent: "flex-start" }} />
                            </Stack>
                            <Button 
                                variant="contained" 
                                component={RouterLink} 
                                to="/apply" 
                                fullWidth 
                                sx={{ bgcolor: "#D9A621", color: "#0E2033", fontWeight: 800, py: 1.2, textTransform: "none", borderRadius: 2 }}
                            >
                                Apply for Admission in this Department
                            </Button>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
