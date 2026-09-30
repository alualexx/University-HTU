import React, { useState, useEffect } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography, TextField,
  InputAdornment, Chip, Button, alpha, useTheme, Stack
} from "@mui/material";
import { Search, CalendarToday, AccessTime, Person, ArrowForward, MenuBook, Church } from "@mui/icons-material";
import { coursesAPI } from "../../services/api";

const DEPARTMENTS = [
  "All",
  "Biblical Studies",
  "Systematic Theology",
  "Church History",
  "Pastoral Theology",
  "Liturgical Studies",
  "Church Music",
  "Ge'ez & Classical Languages"
];

const FALLBACK_COURSES = [
  {
    course_code: "GEZ-101",
    title: "Introduction to Ge'ez Language",
    title_amharic: "የግዕዝ ቋንቋ መግቢያ",
    department: "Ge'ez & Classical Languages",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 1)",
    description: "Phonology, Fidel syllabary, morphology, and foundational liturgical vocabulary of Classical Ethiopic."
  },
  {
    course_code: "GEZ-201",
    title: "Intermediate Ge'ez & Manuscript Reading",
    title_amharic: "ከፍተኛ የግዕዝ ቋንቋና የብራና ንባብ",
    department: "Ge'ez & Classical Languages",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 2)",
    description: "Advanced verbal systems, syntax, and direct paleographic transcription from authentic vellum parchment codices."
  },
  {
    course_code: "THEO-101",
    title: "Introduction to Orthodox Theology",
    title_amharic: "የኦርቶዶክስ ቴዎሎጂ መግቢያ",
    department: "Systematic Theology",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 1)",
    description: "Foundational dogma, Holy Tradition, Nicene-Constantinopolitan Creed, and divine revelation in Eastern Orthodoxy."
  },
  {
    course_code: "THEO-201",
    title: "Patristic Christology & Dogmatics",
    title_amharic: "የአበው የነገረ ክርስቶስ ትምህርት",
    department: "Systematic Theology",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 2)",
    description: "Cyrilline and Alexandrian Christological formulations, St. Athanasius, St. Cyril, and ecumenical conciliar decrees."
  },
  {
    course_code: "BIB-101",
    title: "Old Testament Exegesis & Septuagint",
    title_amharic: "የብሉይ ኪዳን ትርጓሜና የሰባው ሊቃናት ትርጉም",
    department: "Biblical Studies",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 1)",
    description: "Historical, linguistic, and typological study of the Ethiopian Orthodox 81-book Biblical Canon."
  },
  {
    course_code: "CHIS-101",
    title: "History of the Ethiopian Orthodox Church",
    title_amharic: "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታሪክ",
    department: "Church History",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 1)",
    description: "Apostolic introduction, 4th-century Ezana conversion, Nine Saints, monastic expansion, and medieval manuscript scriptoria."
  },
  {
    course_code: "LIT-101",
    title: "Liturgical Theology & Eucharistic Anaphoras",
    title_amharic: "የሥርዓተ አምልኮ ቴዎሎጂና የቅዳሴ መጻሕፍት",
    department: "Liturgical Studies",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 2)",
    description: "Theological structure, historical development, and sacramental spirituality of the 14 Ethiopic Eucharistic Liturgies."
  },
  {
    course_code: "CHM-101",
    title: "St. Yared Sacred Chants & Hymnology",
    title_amharic: "የቅዱስ ያሬድ ዜማና የድጓ ትምህርት",
    department: "Church Music",
    credit_hours: 3,
    lecture_hours: 2,
    lab_hours: 2,
    level: "Undergraduate (Year 1)",
    description: "Modal system of St. Yared (Ge'ez, Ezel, Araray), musical notation (Sereye), and performance of Diggua."
  },
  {
    course_code: "PAST-201",
    title: "Pastoral Theology & Parish Leadership",
    title_amharic: "የአርብቶ አደርነት ቴዎሎጂና የሰበካ አመራር",
    department: "Pastoral Theology",
    credit_hours: 3,
    lecture_hours: 3,
    level: "Undergraduate (Year 2)",
    description: "Spiritual counseling, parish administration, diaconal outreach, and canonical obligations of the priesthood."
  }
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getAll({ status: "active" });
        if (response.data && response.data.length > 0) {
          // Normalize API data to include department name and fallback properties
          const normalized = response.data.map(c => ({
            ...c,
            title: c.title || c.name,
            course_code: c.course_code || c.code,
            department: c.department_name || c.department || "Theology Core"
          }));
          setCourses(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch courses, using comprehensive HTTU catalog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => {
    const matchesDept = selectedDept === "All" || (c.department || "").toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.course_code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.title_amharic || "").includes(searchTerm) ||
      (c.department || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: '#09131F', minHeight: '100vh', color: "white" }}>
      {/* Header */}
      <Box sx={{
        position: 'relative', pt: { xs: 14, md: 18 }, pb: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "radial-gradient(circle at 50% 20%, #122842 0%, #09131F 80%)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 4, mb: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: 50, bgcolor: 'rgba(217,166,33,0.15)', border: '1px solid rgba(217,166,33,0.3)', mb: 2 }}>
                <Church sx={{ color: '#D9A621', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={900} sx={{ color: '#D9A621', letterSpacing: 1 }}>
                  THEOLOGICAL CURRICULUM
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', mb: 1, fontSize: { xs: "2.2rem", md: "3.5rem" } }}>
                Official Course <Box component="span" sx={{ color: "#D9A621" }}>Catalog</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 640 }}>
                Explore accredited coursework in Biblical exegesis, Patristics, Classical Ge'ez, Church History, Liturgics, and St. Yared Sacred Chants.
              </Typography>
            </Box>

            {/* Search Input */}
            <TextField
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code, title, or Ge'ez..."
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
                  width: { xs: '100%', sm: 320 }
                }
              }}
            />
          </Box>

          {/* Department Filter Pills */}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
            {DEPARTMENTS.map(dept => (
              <Chip
                key={dept}
                label={dept}
                clickable
                onClick={() => setSelectedDept(dept)}
                sx={{
                  bgcolor: selectedDept === dept ? '#D9A621' : 'rgba(255,255,255,0.05)',
                  color: selectedDept === dept ? '#0E2033' : 'rgba(255,255,255,0.8)',
                  fontWeight: selectedDept === dept ? 900 : 500,
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: selectedDept === dept ? '#c29219' : 'rgba(255,255,255,0.1)' }
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Courses Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {filtered.map((course, idx) => (
            <Grid item xs={12} sm={6} md={4} key={course.course_code || idx}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={course.course_code}
                      size="small"
                      sx={{ bgcolor: 'rgba(217,166,33,0.15)', color: '#D9A621', fontWeight: 900, borderRadius: 1.5 }}
                    />
                    <Chip
                      label={`${course.credit_hours} Credits`}
                      size="small"
                      sx={{ bgcolor: 'rgba(18,128,140,0.15)', color: '#12808C', fontWeight: 800, borderRadius: 1.5 }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5, lineHeight: 1.3 }}>
                    {course.title}
                  </Typography>

                  {course.title_amharic && (
                    <Typography variant="body2" sx={{ color: '#D9A621', fontWeight: 700, mb: 1.5, fontSize: '0.85rem' }}>
                      {course.title_amharic}
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, mb: 2, flex: 1, fontSize: '0.86rem' }}>
                    {course.description}
                  </Typography>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      {course.department}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 700 }}>
                      Active Intake
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
