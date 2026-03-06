import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Avatar, Chip, TextField, InputAdornment,
} from "@mui/material";
import { Email, Phone, Groups, Search } from "@mui/icons-material";

const avatarGradients = [
  "linear-gradient(135deg,#1976d2,#42a5f5)",
  "linear-gradient(135deg,#2e7d32,#66bb6a)",
  "linear-gradient(135deg,#e65100,#ffa726)",
  "linear-gradient(135deg,#6a1b9a,#ba68c8)",
  "linear-gradient(135deg,#0d2b6e,#1976d2)",
  "linear-gradient(135deg,#004d40,#26a69a)",
];

const positionColors = {
  "Professor": "#1976d2",
  "Associate Professor": "#2e7d32",
  "Assistant Professor": "#e65100",
};

const facultyMembers = [
  { id: 1, name: "Dr. John Smith", department: "Computer Science", position: "Professor", email: "john.smith@university.edu", phone: "+1 (555) 123-4567", specialization: "Artificial Intelligence, Machine Learning" },
  { id: 2, name: "Dr. Sarah Johnson", department: "Computer Science", position: "Associate Professor", email: "sarah.johnson@university.edu", phone: "+1 (555) 234-5678", specialization: "Database Systems, Data Mining" },
  { id: 3, name: "Prof. Michael Williams", department: "Mathematics", position: "Professor", email: "michael.williams@university.edu", phone: "+1 (555) 345-6789", specialization: "Applied Mathematics, Statistics" },
  { id: 4, name: "Dr. Emily Brown", department: "Physics", position: "Associate Professor", email: "emily.brown@university.edu", phone: "+1 (555) 456-7890", specialization: "Quantum Mechanics, Thermodynamics" },
  { id: 5, name: "Dr. Robert Davis", department: "English", position: "Professor", email: "robert.davis@university.edu", phone: "+1 (555) 567-8901", specialization: "American Literature, Creative Writing" },
  { id: 6, name: "Dr. Jennifer Miller", department: "Chemistry", position: "Assistant Professor", email: "jennifer.miller@university.edu", phone: "+1 (555) 678-9012", specialization: "Organic Chemistry, Biochemistry" },
];

const Faculty = () => {
  const [search, setSearch] = useState("");
  const filtered = facultyMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase()) ||
    m.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(" ").map(n => n[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join("");

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: "linear-gradient(135deg,#0d2b6e 0%,#6a1b9a 100%)", py: 6, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Groups sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="white" letterSpacing="-0.02em">Our Faculty</Typography>
              <Typography color="rgba(255,255,255,0.75)" variant="body2">Meet our {facultyMembers.length} dedicated professors and researchers</Typography>
            </Box>
          </Box>
          <TextField
            fullWidth placeholder="Search by name, department, or specialization…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" } }, "& input": { color: "white" }, "& input::placeholder": { color: "rgba(255,255,255,0.6)", opacity: 1 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "rgba(255,255,255,0.7)" }} /></InputAdornment> }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={3}>
          {filtered.map((member, i) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden", transition: "all 0.35s ease", "&:hover": { transform: "translateY(-8px)", boxShadow: "0 24px 48px rgba(0,0,0,0.12)", borderColor: "transparent" } }}>
                {/* Gradient top strip */}
                <Box sx={{ height: 80, background: avatarGradients[i % avatarGradients.length], position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 72, height: 72,
                      background: avatarGradients[(i + 2) % avatarGradients.length],
                      border: "4px solid white",
                      fontSize: 24, fontWeight: 800,
                      position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    {initials(member.name)}
                  </Avatar>
                </Box>

                <CardContent sx={{ pt: 6, textAlign: "center", pb: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{member.name}</Typography>
                  <Chip
                    label={member.position} size="small"
                    sx={{ fontWeight: 700, mb: 0.5, bgcolor: positionColors[member.position] || "#1976d2", color: "white" }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{member.department}</Typography>
                  <Box sx={{ px: 1, py: 1.5, bgcolor: "grey.50", borderRadius: 2, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontStyle="italic">{member.specialization}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">{member.phone}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Groups sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No faculty found for "{search}"</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Faculty;
