import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Chip, Button, alpha, Stack
} from "@mui/material";
import { CalendarToday, Church, ArrowForward, Newspaper, Share, School } from "@mui/icons-material";

const THEOLOGICAL_NEWS = [
  {
    id: "news-1",
    title: "Feast of the Holy Trinity 82nd Annual Theological Convocation & Symposium",
    title_amharic: "የበዓለ ሥላሴ 82ኛው ዓመታዊ የነገረ መለኮት ጉባዔ",
    category: "convocation",
    date: "2026-06-15",
    readTime: "4 min read",
    author: "Office of the Academic Dean",
    summary: "His Holiness the Patriarch and members of the Holy Synod will preside over the graduating class of 2026, conferring BTh, MDiv, and honorary doctorates on distinguished patristic scholars."
  },
  {
    id: "news-2",
    title: "Digital Restoration & IIIF Publication of 14th-Century Ge'ez Tetraevangelion",
    title_amharic: "የ14ኛው መቶ ክፍለ ዘመን የግዕዝ አርባዕቱ ወንጌል የዲጂታል ጥበቃ",
    category: "research",
    date: "2026-05-28",
    readTime: "6 min read",
    author: "Special Collections & Manuscript Department",
    summary: "Chief Librarian Tsehay Girma announces the successful high-resolution multispectral scanning of manuscript SC MS 0187, now publicly accessible via the HTTU Digital Library."
  },
  {
    id: "news-3",
    title: "Fall 2025 Regular & Distance Theological Admissions Officially Open",
    title_amharic: "የ2018 ዓ.ም የመደበኛና የርቀት ትምህርት ምዝገባ ተጀመረ",
    category: "admissions",
    date: "2026-05-10",
    readTime: "3 min read",
    author: "Central Registrar Office",
    summary: "Prospective seminarians, ordained deacons, and theological candidates are invited to submit applications for Bachelor of Theology (BTh), Master of Divinity (MDiv), and Church Music programs."
  },
  {
    id: "news-4",
    title: "National St. Yared Sacred Chant Festival: 1,500 Seminarians Convene",
    title_amharic: "ብሔራዊ የቅዱስ ያሬድ የዜማና የድጓ ፌስቲቫል በቅድስት ሥላሴ ተካሄደ",
    category: "event",
    date: "2026-04-22",
    readTime: "5 min read",
    author: "Department of Church Music",
    summary: "Under the patronage of Archbishop Merkorios Tilahun, chant masters from Axum, Gondar, and Lalibela performed rare selections from Diggua, Zimare, and Mewasiet."
  },
  {
    id: "news-5",
    title: "HERQA Confirms Full Institutional Accreditation Renewal Through 2029",
    title_amharic: "የትምህርት ጥራት ማረጋገጫ ኤጀንሲ (HERQA) እውቅናውን አደሰ",
    category: "academic",
    date: "2026-03-30",
    readTime: "3 min read",
    author: "Quality Assurance Directorate",
    summary: "The Higher Education Relevance and Quality Agency (HERQA) gave a 98% compliance score to HTTU's revised curriculum, library holdings, and faculty research output."
  }
];

const CATEGORIES = [
  { id: "all", label: "All Dispatches" },
  { id: "convocation", label: "Convocation & Synod" },
  { id: "admissions", label: "Admissions & Intake" },
  { id: "research", label: "Manuscript Research" },
  { id: "academic", label: "Academic Notices" },
  { id: "event", label: "Liturgical Events" }
];

export default function News() {
  const [selected, setSelected] = useState("all");

  const filtered = selected === "all" 
    ? THEOLOGICAL_NEWS 
    : THEOLOGICAL_NEWS.filter(n => n.category === selected);

  return (
    <Box sx={{ bgcolor: '#09131F', minHeight: '100vh', color: "white" }}>
      {/* Header */}
      <Box sx={{
        position: 'relative', pt: { xs: 14, md: 18 }, pb: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "radial-gradient(circle at 50% 20%, #122842 0%, #09131F 80%)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: 50, bgcolor: 'rgba(217,166,33,0.15)', border: '1px solid rgba(217,166,33,0.3)', mb: 2 }}>
              <Church sx={{ color: '#D9A621', fontSize: 18 }} />
              <Typography variant="caption" fontWeight={900} sx={{ color: '#D9A621', letterSpacing: 1 }}>
                OFFICIAL UNIVERSITY COMMUNIQUÉ
              </Typography>
            </Box>
            <Typography variant="h2" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', mb: 1, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
              News & Academic <Box component="span" sx={{ color: "#D9A621" }}>Dispatches</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 640 }}>
              Official communiqués from the Holy Synod, Office of the President, Academic Dean, and University Research Centers.
            </Typography>
          </Box>

          {/* Categories */}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
            {CATEGORIES.map(cat => (
              <Chip
                key={cat.id}
                label={cat.label}
                clickable
                onClick={() => setSelected(cat.id)}
                sx={{
                  bgcolor: selected === cat.id ? '#D9A621' : 'rgba(255,255,255,0.05)',
                  color: selected === cat.id ? '#0E2033' : 'rgba(255,255,255,0.8)',
                  fontWeight: selected === cat.id ? 900 : 500,
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: selected === cat.id ? '#c29219' : 'rgba(255,255,255,0.1)' }
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* News List */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3.5}>
          {filtered.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card sx={{
                bgcolor: 'rgba(14, 32, 51, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: '#D9A621',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                }
              }}>
                <CardContent sx={{ p: 3.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={item.category.toUpperCase()}
                      size="small"
                      sx={{ bgcolor: 'rgba(217,166,33,0.15)', color: '#D9A621', fontWeight: 900, borderRadius: 1.5 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#94A3B8' }}>
                      <CalendarToday sx={{ fontSize: 14 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.date}</Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5, lineHeight: 1.3 }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#D9A621', fontWeight: 700, mb: 1.5, fontSize: '0.85rem' }}>
                    {item.title_amharic}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, mb: 2.5, flex: 1, fontSize: '0.88rem' }}>
                    {item.summary}
                  </Typography>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      By {item.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 700 }}>
                      {item.readTime}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
