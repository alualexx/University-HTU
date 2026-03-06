import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography, TextField,
  InputAdornment, Chip, Button,
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
    <Box>
      {/* Header Banner */}
      <Box sx={{ background: "linear-gradient(135deg,#0d2b6e 0%,#1976d2 100%)", py: 6, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MenuBook sx={{ color: "white", fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="white" letterSpacing="-0.02em">Course Catalog</Typography>
              <Typography color="rgba(255,255,255,0.75)" variant="body2">Browse {courses.length} courses for the current semester</Typography>
            </Box>
          </Box>
          {/* Search */}
          <TextField
            fullWidth placeholder="Search by course name, code, or department…"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" }, "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.6)" } }, "& input": { color: "white" }, "& input::placeholder": { color: "rgba(255,255,255,0.6)", opacity: 1 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "rgba(255,255,255,0.7)" }} /></InputAdornment> }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Department filter */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
          {depts.map(dept => (
            <Chip
              key={dept} label={dept}
              onClick={() => setSelectedDept(dept)}
              sx={{
                fontWeight: 600, cursor: "pointer",
                bgcolor: selectedDept === dept ? "primary.main" : "white",
                color: selectedDept === dept ? "white" : "text.primary",
                border: "1px solid", borderColor: selectedDept === dept ? "primary.main" : "divider",
                "&:hover": { bgcolor: selectedDept === dept ? "primary.dark" : "grey.100" },
              }}
            />
          ))}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <MenuBook sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No courses found for "{searchTerm}"</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(course => {
              const gradient = deptColors[course.department] || "linear-gradient(135deg,#1976d2,#42a5f5)";
              return (
                <Grid item xs={12} md={6} key={course.id}>
                  <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", borderColor: "transparent" } }}>
                    <Box sx={{ height: 4, background: gradient }} />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ px: 2, py: 0.5, borderRadius: 1.5, background: gradient, color: "white", fontWeight: 700, fontSize: "0.85rem" }}>
                            {course.code}
                          </Box>
                          <Chip label={course.department} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                        </Box>
                        <Chip label={`${course.credits} Cr`} size="small" sx={{ fontWeight: 700, bgcolor: "grey.100" }} />
                      </Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom>{course.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>{course.description}</Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        {[
                          { icon: <Person sx={{ fontSize: 16 }} />, text: course.instructor },
                          { icon: <CalendarToday sx={{ fontSize: 16 }} />, text: course.semester },
                          { icon: <AccessTime sx={{ fontSize: 16 }} />, text: course.schedule },
                        ].map((item, i) => (
                          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                            {item.icon}
                            <Typography variant="body2">{item.text}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <Box sx={{ px: 3, pb: 3 }}>
                      <Button fullWidth variant="outlined" endIcon={<ArrowForward />}
                        sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none", borderWidth: 2, "&:hover": { borderWidth: 2 } }}>
                        View Details
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
