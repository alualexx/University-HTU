import React, { useState } from "react";
import {
  Box, Container, Grid, Card, CardContent, Typography,
  Avatar, Chip, TextField, InputAdornment, Stack, alpha,
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ── Premium Header ── */}
      <Box sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        pt: 15, pb: 10, position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <Container maxWidth="lg">
          <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 100, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
                <Groups sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="caption" fontWeight={1000} sx={{ color: 'white', letterSpacing: 1.5, textTransform: 'uppercase' }}>Academic Authority</Typography>
              </Box>
              <Typography variant="h2" fontWeight={1000} color="white" sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', mb: 1 }}>
                Our <Box component="span" sx={{ color: 'primary.main' }}>Faculty</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Meet the global experts driving innovation and academic excellence.
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
              placeholder="Search by name, department, or expertise…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: "primary.main" }} /></InputAdornment>
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 15, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 8, border: '1px dashed', borderColor: 'divider' }}>
            <Groups sx={{ fontSize: 84, color: "divider", mb: 3 }} />
            <Typography variant="h5" fontWeight={1000} color="text.secondary">No faculty members matched</Typography>
            <Typography variant="body1" color="text.disabled">Try refining your search terms.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filtered.map((member, i) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card elevation={0} sx={{
                  height: "100%", borderRadius: 6, border: "1px solid", borderColor: "divider",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { transform: "translateY(-10px)", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.12)", borderColor: 'primary.light' }
                }}>
                  <Box sx={{ height: 100, background: avatarGradients[i % avatarGradients.length], position: "relative" }}>
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2))' }} />
                    <Avatar
                      sx={{
                        width: 92, height: 92,
                        background: avatarGradients[(i + 1) % avatarGradients.length],
                        border: "6px solid white",
                        fontSize: 28, fontWeight: 1000,
                        fontFamily: 'Outfit, sans-serif',
                        position: "absolute", bottom: -46, left: "50%", transform: "translateX(-50%)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                      }}
                    >
                      {initials(member.name)}
                    </Avatar>
                  </Box>

                  <CardContent sx={{ pt: 8, textAlign: "center", px: 4, pb: 5 }}>
                    <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em', mb: 1 }}>{member.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                      <Chip
                        label={member.position} size="small"
                        sx={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', py: 1.5, bgcolor: alpha(positionColors[member.position] || "#1e293b", 0.1), color: positionColors[member.position] || "#1e293b", border: `1px solid ${alpha(positionColors[member.position] || "#1e293b", 0.2)}` }}
                      />
                    </Box>

                    <Typography variant="body2" fontWeight={800} color="primary.main" sx={{ mb: 3, letterSpacing: 1, textTransform: 'uppercase' }}>{member.department}</Typography>

                    <Box sx={{ px: 2, py: 2, bgcolor: alpha('#000', 0.02), borderRadius: 4, mb: 4, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontStyle: "italic", lineHeight: 1.6 }}>"{member.specialization}"</Typography>
                    </Box>

                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, color: "text.secondary" }}>
                        <Email sx={{ fontSize: 18, opacity: 0.6 }} />
                        <Typography variant="body2" fontWeight={600}>{member.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, color: "text.secondary" }}>
                        <Phone sx={{ fontSize: 18, opacity: 0.6 }} />
                        <Typography variant="body2" fontWeight={600}>{member.phone}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Faculty;
