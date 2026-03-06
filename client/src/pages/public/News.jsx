import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Chip, Button,
} from "@mui/material";
import { CalendarToday, Visibility, ArrowForward, Newspaper } from "@mui/icons-material";

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

  const filtered = selected === "all" ? newsItems : newsItems.filter(n => n.category === selected);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: "linear-gradient(135deg,#0d2b6e 0%,#e65100 100%)", py: 6, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Newspaper sx={{ color: "white", fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="white" letterSpacing="-0.02em">Latest News</Typography>
              <Typography color="rgba(255,255,255,0.75)" variant="body2">Stay updated with university announcements and events</Typography>
            </Box>
          </Box>
          {/* Category filters */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <Chip key={cat.id} label={cat.label} onClick={() => setSelected(cat.id)}
                sx={{
                  fontWeight: 600, cursor: "pointer",
                  bgcolor: selected === cat.id ? "white" : "rgba(255,255,255,0.15)",
                  color: selected === cat.id ? "primary.main" : "white",
                  border: "1px solid", borderColor: selected === cat.id ? "white" : "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  "&:hover": { bgcolor: selected === cat.id ? "white" : "rgba(255,255,255,0.25)" },
                }} />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Newspaper sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No news in this category</Typography>
          </Box>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden", mb: 4, transition: "all 0.3s", "&:hover": { boxShadow: "0 20px 48px rgba(0,0,0,0.1)" } }}>
                <Box sx={{ height: 6, background: categoryConfig[featured.category]?.gradient || "primary.main" }} />
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                    <Typography fontSize={22}>{categoryConfig[featured.category]?.emoji}</Typography>
                    <Chip label={categoryConfig[featured.category]?.label || featured.category} size="small"
                      sx={{ fontWeight: 700, background: categoryConfig[featured.category]?.gradient, color: "white", border: "none" }} />
                    <Chip label="Featured" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em" gutterBottom>{featured.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 700 }}>{featured.content}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{fmt(featured.date)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Visibility sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{featured.views.toLocaleString()} views</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">By {featured.author}</Typography>
                    <Button variant="contained" endIcon={<ArrowForward />} sx={{
                      ml: "auto", borderRadius: 2.5, fontWeight: 700, textTransform: "none",
                      background: categoryConfig[featured.category]?.gradient, border: "none", "&:hover": { opacity: 0.9, background: categoryConfig[featured.category]?.gradient }
                    }}>
                      Read Article
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Rest of the news */}
            {rest.length > 0 && (
              <Grid container spacing={3}>
                {rest.map(news => {
                  const cfg = categoryConfig[news.category] || {};
                  return (
                    <Grid item xs={12} md={6} key={news.id}>
                      <Card elevation={0} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden", transition: "all 0.3s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", borderColor: "transparent" } }}>
                        <Box sx={{ height: 4, background: cfg.gradient }} />
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography fontSize={18}>{cfg.emoji}</Typography>
                              <Chip label={cfg.label || news.category} size="small" sx={{ fontWeight: 700, background: cfg.gradient, color: "white", border: "none" }} />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Visibility sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">{news.views.toLocaleString()}</Typography>
                            </Box>
                          </Box>
                          <Typography variant="h6" fontWeight={700} gutterBottom>{news.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>{news.content}</Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                              <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">{fmt(news.date)}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">{news.author}</Typography>
                          </Box>
                        </CardContent>
                        <Box sx={{ px: 3, pb: 3 }}>
                          <Button fullWidth endIcon={<ArrowForward />}
                            sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none", color: cfg.gradient ? "primary.main" : "inherit" }}>
                            Read More
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
