import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Avatar, Chip, TextField, InputAdornment, Stack, alpha
} from "@mui/material";
import { Email, Phone, Groups, Search, Church, School } from "@mui/icons-material";

const FACULTY_MEMBERS = [
  {
    id: 1,
    name: "Dr. Alemeyahu Worku",
    amharic_name: "ዶ/ር ዓለማየሁ ወርቁ",
    department: "Biblical Studies & Ge'ez",
    position: "Professor & Department Chair",
    ordination: "Priest · Ordained 2012",
    email: "dr.alemeyahu@httu.edu.et",
    phone: "+251 11 123 4567",
    specialization: "Old Testament Exegesis, Septuagint, Classical Ge'ez Paleography"
  },
  {
    id: 2,
    name: "Dr. Sofia Assefa",
    amharic_name: "ዶ/ር ሶፊያ አሰፋ",
    department: "Systematic Theology",
    position: "Associate Professor & Department Chair",
    ordination: "Theologian & Scholar",
    email: "fr.yohannes@httu.edu.et",
    phone: "+251 11 123 4568",
    specialization: "Patristic Christology, Nicene-Constantinopolitan Dogmatics, Trinity Theology"
  },
  {
    id: 3,
    name: "Rev. Dr. Abeba Zerihun",
    amharic_name: "መልአከ ብርሃን ዶ/ር አበበ ዘሪሁን",
    department: "Church History & Patristics",
    position: "Professor & Academic Dean",
    ordination: "Archpriest (Mel'ake Birhan) · Ordained 2004",
    email: "dean@httu.edu.et",
    phone: "+251 11 123 4569",
    specialization: "Ecumenical Councils, Ethiopian Monasticism, Ancient Christian Heritage"
  },
  {
    id: 4,
    name: "Archbishop Merkorios Tilahun",
    amharic_name: "ብፁዕ አቡነ መርቆሬዎስ ጥላሁን",
    department: "Pastoral Theology",
    position: "Professor & University President",
    ordination: "Archbishop (Abune) · Holy Synod Member",
    email: "president@httu.edu.et",
    phone: "+251 11 123 4570",
    specialization: "Pastoral Counseling, Spiritual Formation, Diocesan Administration"
  },
  {
    id: 5,
    name: "Memhir Hailemariam Tesfaye",
    amharic_name: "መምህር ኃይለማርያም ተስፋዬ",
    department: "Church Music & Hymnology",
    position: "Senior Lecturer & Music Director",
    ordination: "Merigeta & Sacred Chant Master",
    email: "music.chair@httu.edu.et",
    phone: "+251 11 123 4571",
    specialization: "St. Yared Modalities (Ge'ez, Ezel, Araray), Diggua, Tsome Diggua, Aquaquam"
  },
  {
    id: 6,
    name: "Fr. Teklehaimanot Gebre",
    amharic_name: "ቀሲስ ተክለሃይማኖት ገብሬ",
    department: "Liturgical Studies",
    position: "Assistant Professor & Liturgics Chair",
    ordination: "Priest · Ordained 2016",
    email: "liturgics@httu.edu.et",
    phone: "+251 11 123 4572",
    specialization: "Eucharistic Anaphoras, Sacramentology, Fetha Nagast (Canon Law)"
  },
  {
    id: 7,
    name: "Tsehay Girma",
    amharic_name: "ፀሐይ ግርማ",
    department: "Manuscript Archives & Library",
    position: "Chief Librarian & Archivist",
    ordination: "Manuscript Conservator",
    email: "librarian@httu.edu.et",
    phone: "+251 11 123 4573",
    specialization: "Ancient Ge'ez Vellum Restoration, MARC21 Cataloging, IIIF Digital Preservation"
  }
];

export default function Faculty() {
  const [search, setSearch] = useState("");

  const filtered = FACULTY_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.amharic_name.includes(search) ||
    m.department.toLowerCase().includes(search.toLowerCase()) ||
    m.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#09131F', minHeight: '100vh', color: "white" }}>
      {/* Header */}
      <Box sx={{
        position: 'relative', pt: { xs: 14, md: 18 }, pb: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "radial-gradient(circle at 50% 20%, #122842 0%, #09131F 80%)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: 50, bgcolor: 'rgba(217,166,33,0.15)', border: '1px solid rgba(217,166,33,0.3)', mb: 2 }}>
                <Church sx={{ color: '#D9A621', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={900} sx={{ color: '#D9A621', letterSpacing: 1 }}>
                  THEOLOGICAL SCHOLARS & CLERGY
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', mb: 1, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
                Distinguished <Box component="span" sx={{ color: "#D9A621" }}>Faculty</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 640 }}>
                Ordained hierarchs, patristic theologians, Ge'ez paleographers, and masters of sacred hymnody guiding our seminarians.
              </Typography>
            </Box>

            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, department, or field..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#D9A621' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  width: { xs: '100%', sm: 340 }
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Faculty Cards Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {filtered.map((faculty) => (
            <Grid item xs={12} sm={6} md={4} key={faculty.id}>
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
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{
                      width: 58, height: 58,
                      bgcolor: 'rgba(217,166,33,0.15)',
                      color: '#D9A621',
                      border: '2px solid #D9A621',
                      fontSize: '1.2rem',
                      fontWeight: 900
                    }}>
                      ✝
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                        {faculty.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 700, display: 'block' }}>
                        {faculty.amharic_name}
                      </Typography>
                      <Chip
                        label={faculty.ordination}
                        size="small"
                        sx={{ bgcolor: 'rgba(18,128,140,0.15)', color: '#12808C', fontWeight: 700, fontSize: '0.68rem', height: 20, mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                    {faculty.department}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, mb: 1.5 }}>
                    {faculty.position}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem', lineHeight: 1.6, flex: 1, mb: 2 }}>
                    <strong>Specialization:</strong> {faculty.specialization}
                  </Typography>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: '#D9A621' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{faculty.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ fontSize: 16, color: '#12808C' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{faculty.phone}</Typography>
                    </Box>
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
