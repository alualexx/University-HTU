import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Chip, Button, alpha, Stack
} from "@mui/material";
import { CalendarToday, Visibility, ArrowForward, Newspaper } from "@mui/icons-material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../services/Firebase";

const categoryConfig = {
  announcement: { label: "Announcement", gradient: "linear-gradient(135deg,#1976d2,#42a5f5)", emoji: "📢" },
  event: { label: "Event", gradient: "linear-gradient(135deg,#6a1b9a,#ba68c8)", emoji: "🎉" },
  academic: { label: "Academic", gradient: "linear-gradient(135deg,#2e7d32,#66bb6a)", emoji: "🎓" },
  research: { label: "Research", gradient: "linear-gradient(135deg,#e65100,#ffa726)", emoji: "🔬" },
};

const newsItems = [
  { id: 1, title: "Fall 2024 Registration Now Open", content: "Students can now register for Fall 2024 courses through the student portal. Early registration is recommended to secure preferred class times.", category: "announcement", date: "2024-03-01", views: 1250, author: "Registrar's Office" },
  { id: 2, title: "Annual Science Fair 2024", content: "Join us for the annual science fair showcasing innovative research projects from students across all departments. Guest speakers include leading researchers from industry.", category: "event", date: "2024-03-15", views: 890, author: "Student Activities" },
  { id: 3, title: "New Computer Science Laboratory Opened", content: "We are excited to announce the opening of our state-of-the-art computer science laboratory featuring the latest hardware and software for student research.", category: "academic", date: "2024-02-28", views: 654, author: "CS Department" },
  { id: 4, title: "Research Grant Awarded for AI Study", content: "Dr. John Smith has received a prestigious research grant to study artificial intelligence applications in healthcare. The project will span three years.", category: "research", date: "2024-02-25", views: 432, author: "Research Office" },
  { id: 5, title: "Spring Break Schedule", content: "The university will be closed for spring break from March 15-22. All classes and administrative offices will resume on March 23.", category: "announcement", date: "2024-02-20", views: 2100, author: "Administration" },
  { id: 6, title: "Career Fair 2024", content: "Over 50 companies will be participating in our annual career fair. Students are encouraged to bring their resumes and dress professionally.", category: "event", date: "2024-02-18", views: 1567, author: "Career Services" },
];

const categories = [{ id: "all", label: "All News" }, ...Object.entries(categoryConfig).map(([id, c]) => ({ id, label: c.label }))];

const News = () => {
  const [selected, setSelected] = useState("all");
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNewsItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = selected === "all" ? newsItems : newsItems.filter(n => n.category === selected);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ── Premium Header ── */}
      <Box sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        pt: 15, pb: 10, position: 'relative', overflow: 'hidden'
      }}>
        {/* Background effects */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230, 81, 0, 0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <Container maxWidth="lg">
          <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
                <Newspaper sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={1000} sx={{ color: 'white', letterSpacing: 1.5, textTransform: 'uppercase' }}>University Intelligence</Typography>
              </Box>
              <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', mb: 1 }}>
                Campus <Box component="span" sx={{ color: 'primary.main' }}>Pulse</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Real-time updates from the heart of our academic ecosystem.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {categories.map(cat => (
                <Chip
                  key={cat.id} label={cat.label}
                  onClick={() => setSelected(cat.id)}
                  sx={{
                    px: 3, py: 3, borderRadius: 4, fontWeight: 900, cursor: "pointer", fontSize: '0.9rem',
                    bgcolor: selected === cat.id ? "white" : "rgba(255,255,255,0.03)",
                    color: selected === cat.id ? "#0f172a" : "white",
                    border: "1px solid", borderColor: selected === cat.id ? "white" : "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: selected === cat.id ? "white" : "rgba(255,255,255,0.08)" },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 15, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 8, border: '1px dashed', borderColor: 'divider' }}>
            <Newspaper sx={{ fontSize: 84, color: "divider", mb: 3 }} />
            <Typography variant="h5" fontWeight={1000} color="text.secondary">The transmission is quiet</Typography>
            <Typography variant="body1" color="text.disabled">No updates available in this sector.</Typography>
          </Box>
        ) : (
          <>
            {/* ── Featured Story ── */}
            {featured && (
              <Card elevation={0} sx={{
                borderRadius: 8, border: "1px solid", borderColor: "divider",
                overflow: "hidden", mb: 8, position: 'relative',
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { transform: "translateY(-10px)", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.15)", borderColor: 'primary.light' }
              }}>
                <Box sx={{ height: 10, background: categoryConfig[featured.category]?.gradient }} />
                <CardContent sx={{ p: { xs: 4, md: 8 } }}>
                  <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: categoryConfig[featured.category]?.gradient, color: 'white' }}>
                          <Typography variant="h5" sx={{ lineHeight: 1 }}>{categoryConfig[featured.category]?.emoji}</Typography>
                        </Box>
                        <Stack>
                          <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>
                            {categoryConfig[featured.category]?.label}
                          </Typography>
                          <Typography variant="caption" fontWeight={800} color="text.disabled">
                            FEATURED INTELLIGENCE
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography variant="h2" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', mb: 3 }}>
                        {featured.title}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.8, mb: 6, fontWeight: 500 }}>
                        {featured.content}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", mb: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <CalendarToday sx={{ fontSize: 20, color: "primary.main" }} />
                          <Typography variant="body1" fontWeight={800}>{fmt(featured.date)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Visibility sx={{ fontSize: 20, color: "primary.main" }} />
                          <Typography variant="body1" fontWeight={800}>{featured.views.toLocaleString()} Readers</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 1000 }}>
                            {featured.author[0]}
                          </Box>
                          <Typography variant="body1" fontWeight={800}>{featured.author}</Typography>
                        </Box>
                      </Box>

                      <Button variant="contained" size="large" endIcon={<ArrowForward />} sx={{
                        px: 5, py: 2.5, borderRadius: 5, fontWeight: 1000, textTransform: "none", fontSize: '1.1rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        background: categoryConfig[featured.category]?.gradient,
                        "&:hover": { transform: 'translateY(-4px)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }
                      }}>
                        Read Full Briefing
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box sx={{
                        width: '100%', height: 400, borderRadius: 6,
                        background: `${categoryConfig[featured.category]?.gradient}, rgba(0,0,0,0.05)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden'
                      }}>
                        <Newspaper sx={{ fontSize: 180, color: 'rgba(255,255,255,0.2)', filter: 'blur(2px)' }} />
                        <Box sx={{ position: 'absolute', inset: 0, border: '24px solid rgba(255,255,255,0.1)' }} />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* ── Secondary Grid ── */}
            {rest.length > 0 && (
              <Grid container spacing={4}>
                {rest.map(news => {
                  const cfg = categoryConfig[news.category] || {};
                  return (
                    <Grid item xs={12} md={6} key={news.id}>
                      <Card elevation={0} sx={{
                        height: "100%", display: "flex", flexDirection: "column",
                        borderRadius: 6, border: "1px solid", borderColor: "divider",
                        overflow: "hidden", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateY(-8px)", boxShadow: "0 24px 48px rgba(0,0,0,0.1)", borderColor: 'primary.light' }
                      }}>
                        <Box sx={{ height: 6, background: cfg.gradient }} />
                        <CardContent sx={{ flexGrow: 1, p: 5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Typography fontSize={24}>{cfg.emoji}</Typography>
                              <Chip label={cfg.label} size="small" sx={{ fontWeight: 1000, color: 'primary.main', bgcolor: alpha('#6366f1', 0.08), border: 'none', px: 1, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }} />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: 'text.disabled' }}>
                              <Visibility sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={800}>{news.views.toLocaleString()}</Typography>
                            </Box>
                          </Box>

                          <Typography variant="h4" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em', mb: 2 }}>
                            {news.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, fontWeight: 500 }}>
                            {news.content}
                          </Typography>

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 'auto', pt: 3, borderTop: '1px solid', borderColor: alpha('#000', 0.05) }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.disabled" }}>
                              <CalendarToday sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={900}>{fmt(news.date)}</Typography>
                            </Box>
                            <Typography variant="caption" fontWeight={1000} color="text.primary">{news.author}</Typography>
                          </Box>
                        </CardContent>
                        <Box sx={{ px: 5, pb: 5 }}>
                          <Button fullWidth variant="contained" endIcon={<ArrowForward />}
                            sx={{ borderRadius: 4, fontWeight: 1000, textTransform: "none", py: 2, bgcolor: alpha('#000', 0.02), color: 'text.primary', border: '1px solid rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                            Expanded Transmission
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default News;
