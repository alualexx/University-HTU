import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography, TextField,
  InputAdornment, Chip, Button, alpha,
} from "@mui/material";
import { Search, CalendarToday, AccessTime, Person, ArrowForward, MenuBook } from "@mui/icons-material";

const deptColors = {
  "Computer Science": "linear-gradient(135deg,#1976d2,#42a5f5)",
  "Mathematics": "linear-gradient(135deg,#2e7d32,#66bb6a)",
  "English": "linear-gradient(135deg,#e65100,#ffa726)",
  "Physics": "linear-gradient(135deg,#6a1b9a,#ba68c8)",
};

const courses = [
  { id: 1, code: "CS101", name: "Introduction to Computer Science", department: "Computer Science", credits: 4, instructor: "Dr. Smith", semester: "Fall 2024", schedule: "Mon/Wed 10:00–11:30", description: "Fundamental concepts of computer science including algorithms, data structures, and programming basics." },
  { id: 2, code: "CS201", name: "Data Structures and Algorithms", department: "Computer Science", credits: 4, instructor: "Dr. Johnson", semester: "Fall 2024", schedule: "Tue/Thu 14:00–15:30", description: "Study of fundamental data structures and algorithms with emphasis on implementation and analysis." },
  { id: 3, code: "MATH101", name: "Calculus I", department: "Mathematics", credits: 4, instructor: "Prof. Williams", semester: "Fall 2024", schedule: "Mon/Wed/Fri 09:00–10:00", description: "Introduction to differential calculus including limits, derivatives, and applications." },
  { id: 4, code: "ENG101", name: "English Composition", department: "English", credits: 3, instructor: "Ms. Davis", semester: "Fall 2024", schedule: "Tue/Thu 11:00–12:30", description: "Development of academic writing skills including essays, research papers, and critical analysis." },
  { id: 5, code: "PHY101", name: "Physics I", department: "Physics", credits: 4, instructor: "Dr. Brown", semester: "Fall 2024", schedule: "Mon/Wed 14:00–16:00", description: "Introduction to mechanics, thermodynamics, and waves with laboratory component." },
  { id: 6, code: "CS301", name: "Database Systems", department: "Computer Science", credits: 3, instructor: "Dr. Miller", semester: "Spring 2024", schedule: "Wed 16:00–19:00", description: "Study of database design, SQL, transaction processing, and database management systems." },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const depts = ["All", ...new Set(courses.map(c => c.department))];

  const filtered = courses.filter(c =>
    (selectedDept === "All" || c.department === selectedDept) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ── Premium Header ── */}
      <Box sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        pt: 15, pb: 10, position: 'relative', overflow: 'hidden'
      }}>
        {/* Background effects */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <Container maxWidth="lg">
          <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
                <MenuBook sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={900} sx={{ color: 'white', letterSpacing: 1.5, textTransform: 'uppercase' }}>Academic Intelligence</Typography>
              </Box>
              <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', mb: 1 }}>
                Course <Box component="span" sx={{ color: 'primary.main' }}>Catalog</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Explore over {courses.length} specialized modules designed for industry excellence.
              </Typography>
            </Box>

            <TextField
              sx={{
                width: { xs: "100%", md: 450 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(20px)",
                  border: '1px solid rgba(255,255,255,0.1)',
                  "& fieldset": { border: 'none' },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                  "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.08)", border: '1px solid rgba(99, 102, 241, 0.5)' }
                },
                "& input": { color: "white", py: 2.5, fontWeight: 600 },
                "& input::placeholder": { color: "rgba(255,255,255,0.4)", opacity: 1 }
              }}
              placeholder="Search by name, code, or domain…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: "primary.main" }} /></InputAdornment>
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {depts.map(dept => (
              <Chip
                key={dept} label={dept}
                onClick={() => setSelectedDept(dept)}
                sx={{
                  px: 2, py: 2.5, borderRadius: 3, fontWeight: 900, cursor: "pointer", fontSize: '0.85rem',
                  bgcolor: selectedDept === dept ? "primary.main" : "rgba(255,255,255,0.03)",
                  color: "white",
                  border: "1px solid", borderColor: selectedDept === dept ? "primary.main" : "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: selectedDept === dept ? "primary.dark" : "rgba(255,255,255,0.08)" },
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 15, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 8, border: '1px dashed', borderColor: 'divider' }}>
            <MenuBook sx={{ fontSize: 84, color: "divider", mb: 3 }} />
            <Typography variant="h5" fontWeight={1000} color="text.secondary">No courses matching your criteria</Typography>
            <Typography variant="body1" color="text.disabled">Try adjusting your search terms or department filter.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filtered.map(course => {
              const gradient = deptColors[course.department] || "linear-gradient(135deg,#6366f1,#a855f7)";
              return (
                <Grid item xs={12} md={6} key={course.id}>
                  <Card elevation={0} sx={{
                    height: "100%", borderRadius: 6, border: "1px solid", borderColor: "divider",
                    overflow: "hidden", display: "flex", flexDirection: "column",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": { transform: "translateY(-10px)", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.12)", borderColor: 'primary.light' }
                  }}>
                    <Box sx={{ height: 6, background: gradient }} />
                    <CardContent sx={{ flexGrow: 1, p: 5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ px: 2, py: 1, borderRadius: 2, background: alpha('#000', 0.03), border: '1px solid rgba(0,0,0,0.05)', color: "text.primary", fontWeight: 1000, fontSize: "0.9rem", fontFamily: 'Outfit, sans-serif' }}>
                            {course.code}
                          </Box>
                          <Chip label={course.department} size="small" variant="outlined" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }} />
                        </Box>
                        <Typography variant="caption" fontWeight={1000} color="primary.main" sx={{ bgcolor: alpha('#6366f1', 0.08), px: 1.5, py: 0.5, borderRadius: 100 }}>{course.credits} CREDITS</Typography>
                      </Box>

                      <Typography variant="h4" fontWeight={1000} gutterBottom sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em', mb: 2 }}>{course.name}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 4, fontWeight: 500 }}>{course.description}</Typography>

                      <Grid container spacing={2}>
                        {[
                          { icon: <Person />, label: 'INSTRUCTOR', val: course.instructor },
                          { icon: <CalendarToday />, label: 'SEMESTER', val: course.semester },
                          { icon: <AccessTime />, label: 'SCHEDULE', val: course.schedule },
                        ].map((item, i) => (
                          <Grid item xs={12} sm={4} key={i}>
                            <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block', mb: 0.5, letterSpacing: 1 }}>{item.label}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {React.cloneElement(item.icon, { sx: { fontSize: 16, color: 'primary.main' } })}
                              <Typography variant="body2" fontWeight={800} color="text.primary">{item.val}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                    <Box sx={{ px: 5, pb: 5 }}>
                      <Button
                        fullWidth variant="contained" endIcon={<ArrowForward />}
                        sx={{ borderRadius: 4, fontWeight: 1000, textTransform: "none", py: 2, bgcolor: alpha('#000', 0.02), color: 'text.primary', border: '1px solid rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                      >
                        Module Specifications
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Courses;
