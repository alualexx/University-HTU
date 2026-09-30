import React from "react";
import {
    Box, Container, Typography, Grid, Card, Avatar, Stack, Chip,
    Divider, alpha, useTheme
} from "@mui/material";
import {
    School, EmojiEvents, Groups, AutoStories, Church,
    VerifiedUser, Language, AccountBalance, MenuBook
} from "@mui/icons-material";
import { HTTU_COLORS } from "../../theme";

const STATS = [
    { value: "1,700+", label: "Years of Christian Heritage", icon: <Church />, color: "#D9A621" },
    { value: "3,248", label: "Active Seminarians & Scholars", icon: <Groups />, color: "#12808C" },
    { value: "84", label: "Ordained Faculty & Scholars", icon: <School />, color: "#D9A621" },
    { value: "7", label: "Theological Departments", icon: <AutoStories />, color: "#12808C" },
];

const VALUES = [
    { 
        icon: <VerifiedUser />, 
        title: "Orthodox Dogma & Sacred Tradition", 
        desc: "Faithfully transmitting the Apostolic faith, Nicene Creed, and patristic heritage of the Ethiopian Orthodox Tewahedo Church.", 
        color: "#D9A621" 
    },
    { 
        icon: <MenuBook />, 
        title: "Patristic Exegesis & Ge'ez Texts", 
        desc: "Rigorous scholarly study, linguistic preservation, and translation of ancient parchment manuscripts and Ethiopian Church Fathers.", 
        color: "#12808C" 
    },
    { 
        icon: <Church />, 
        title: "Pastoral & Monastic Formation", 
        desc: "Cultivating consecrated priests, deacons, spiritual directors, and theologians to shepherd parishes worldwide.", 
        color: "#D9A621" 
    },
    { 
        icon: <Language />, 
        title: "St. Yared Hymnology & Liturgical Arts", 
        desc: "Safeguarding ancient liturgical music (Diggua, Tsome Diggua, Zimare), iconography, and ecclesiastical rites.", 
        color: "#12808C" 
    },
];

const TEAM = [
    { name: "Archbishop Merkorios Tilahun", title: "ብፁዕ አቡነ መርቆሬዎስ ጥላሁን", role: "University President", color: "#D9A621" },
    { name: "Rev. Dr. Abeba Zerihun", title: "መልአከ ብርሃን ዶ/ር አበበ ዘሪሁን", role: "Dean of Academic Affairs", color: "#12808C" },
    { name: "Dr. Sofia Assefa", title: "ዶ/ር ሶፊያ አሰፋ", role: "Head of Systematic Theology", color: "#D9A621" },
    { name: "Dr. Alemeyahu Worku", title: "ዶ/ር ዓለማየሁ ወርቁ", role: "Head of Biblical Studies & Ge'ez", color: "#12808C" },
    { name: "Tsehay Girma", title: "ፀሐይ ግርማ", role: "Chief Librarian & Archivist", color: "#D9A621" },
    { name: "Meskerem Abebe", title: "መስከረም አበበ", role: "University Registrar", color: "#12808C" },
];

export default function AboutUs() {
    return (
        <Box sx={{ bgcolor: "#09131F", minHeight: "100vh", color: "white", overflow: "hidden" }}>
            {/* Hero */}
            <Box sx={{
                position: "relative",
                pt: { xs: 14, md: 20 }, pb: { xs: 10, md: 14 },
                zIndex: 1, borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "radial-gradient(circle at 50% 20%, #132742 0%, #09131F 80%)"
            }}>
                <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                    <Chip 
                        icon={<Church sx={{ color: "#D9A621 !important", fontSize: 18 }} />} 
                        label="Ethiopia Holy Trinity Theology University · ቅድስት ሥላሴ ዩኒቨርሲቲ" 
                        sx={{ mb: 4, bgcolor: "rgba(217,166,33,0.12)", color: "#D9A621", fontWeight: 800, border: "1px solid rgba(217,166,33,0.3)", letterSpacing: 0.5 }} 
                    />
                    <Typography variant="h1" fontWeight={1000} sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", mb: 3, fontSize: { xs: "2.5rem", md: "4.5rem" }, lineHeight: 1.15 }}>
                        Guardians of the <br />
                        <Box component="span" sx={{ color: "#D9A621" }}>Apostolic Faith</Box> & Holy Tradition
                    </Typography>
                    <Typography variant="h6" color="rgba(255,255,255,0.7)" sx={{ maxWidth: 780, mx: "auto", fontWeight: 400, lineHeight: 1.8, fontSize: { xs: "1rem", md: "1.2rem" } }}>
                        Chartered by the Holy Synod of the Ethiopian Orthodox Tewahedo Church, Holy Trinity Theology University (HTTU) stands as the premier theological higher education institution in the Horn of Africa, cultivating scholars, clergy, and spiritual servant leaders.
                    </Typography>
                </Container>
            </Box>

            {/* Core Purpose / Story */}
            <Box sx={{ py: 12, position: "relative" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <Card sx={{
                                background: "rgba(14, 32, 51, 0.6)", backdropFilter: "blur(20px)",
                                border: "1px solid rgba(217,166,33,0.2)", borderRadius: 6, p: { xs: 4, md: 6 },
                                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
                            }}>
                                <Typography variant="caption" fontWeight={900} color="#D9A621" sx={{ letterSpacing: 2, display: "block", mb: 1.5, textTransform: "uppercase" }}>
                                    Historical Legacy & Sacred Mandate
                                </Typography>
                                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "Outfit", mb: 3, color: "#fff" }}>
                                    Faithful to Scripture, Rooted in <Box component="span" color="#D9A621">Patristic Wisdom</Box>
                                </Typography>
                                <Typography variant="body1" color="rgba(255,255,255,0.75)" sx={{ lineHeight: 1.9, fontSize: "1.05rem", mb: 4 }}>
                                    Founded to advance Orthodox theological inquiry, preserve sacred Ge'ez hymnody and liturgy, and nurture clergy for over 50 million faithful, HTTU bridges millennia-old traditional ecclesiastical learning with rigorous 21st-century accredited higher education.
                                </Typography>
                                <Box sx={{ p: 3.5, borderRadius: 3, background: "rgba(217, 166, 33, 0.08)", border: "1px solid rgba(217, 166, 33, 0.25)" }}>
                                    <Typography variant="subtitle2" fontWeight={900} color="#D9A621" gutterBottom sx={{ letterSpacing: 1 }}>
                                        INSTITUTIONAL VISION
                                    </Typography>
                                    <Typography variant="body2" color="rgba(255,255,255,0.85)" sx={{ lineHeight: 1.8 }}>
                                        To be the foremost global center of Oriental Orthodox theology, Biblical exegesis, Ethiopian paleography, and liturgical excellence, preparing ministers who illuminate Church and society with divine truth.
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <Typography variant="h4" fontWeight={900} sx={{ fontFamily: "Outfit", mb: 4, color: "#fff" }}>
                                The Four Pillars of Formation
                            </Typography>
                            <Grid container spacing={2.5}>
                                {VALUES.map((v, i) => (
                                    <Grid item xs={12} sm={6} key={i}>
                                        <Card sx={{
                                            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: 4, p: 3, height: "100%", transition: "all 0.3s ease",
                                            "&:hover": { transform: "translateY(-5px)", borderColor: v.color, bgcolor: "rgba(255,255,255,0.04)" }
                                        }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: 2, background: alpha(v.color, 0.15), color: v.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                                {v.icon}
                                            </Box>
                                            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1, fontFamily: "Outfit", color: "#fff" }}>{v.title}</Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.65)" sx={{ lineHeight: 1.7, fontSize: "0.88rem" }}>{v.desc}</Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Row */}
            <Box sx={{ py: 8, background: "#060D17", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {STATS.map((s, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                    <Box sx={{ color: s.color, mb: 1.5 }}>
                                        {React.cloneElement(s.icon, { sx: { fontSize: 40 } })}
                                    </Box>
                                    <Typography variant="h3" fontWeight={1000} color="white" sx={{ fontFamily: "Outfit", mb: 0.5 }}>{s.value}</Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Academic Leadership */}
            <Box sx={{ py: 12, position: "relative" }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <Chip label="Academic Administration & Faculty Chairs" sx={{ mb: 2, bgcolor: "rgba(217,166,33,0.12)", color: "#D9A621", fontWeight: 800, border: "1px solid rgba(217,166,33,0.3)" }} />
                        <Typography variant="h3" fontWeight={900} sx={{ fontFamily: "Outfit, sans-serif" }}>
                            University <Box component="span" sx={{ color: "#D9A621" }}>Leadership</Box>
                        </Typography>
                    </Box>
                    <Grid container spacing={3} justifyContent="center">
                        {TEAM.map((member, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card sx={{
                                    p: 4, borderRadius: 4, textAlign: "center",
                                    border: "1px solid rgba(255,255,255,0.08)", background: "rgba(14, 32, 51, 0.4)",
                                    backdropFilter: "blur(10px)", transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-6px)", borderColor: member.color }
                                }}>
                                    <Avatar sx={{
                                        width: 72, height: 72, mx: "auto", mb: 2,
                                        bgcolor: alpha(member.color, 0.15),
                                        color: member.color, fontSize: "1.4rem", fontWeight: 900,
                                        border: `2px solid ${member.color}`
                                    }}>
                                        ✝
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight={900} sx={{ fontFamily: "Outfit", mb: 0.2, color: "#fff" }}>{member.name}</Typography>
                                    <Typography variant="caption" sx={{ color: "#D9A621", fontWeight: 700, display: "block", mb: 0.5 }}>{member.title}</Typography>
                                    <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.5)">{member.role}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
