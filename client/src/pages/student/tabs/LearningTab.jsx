import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Stack, Chip, Button,
  LinearProgress, Avatar, Tabs, Tab, IconButton, Divider, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup,
  FormControlLabel, FormControl, Paper, Alert
} from '@mui/material';
import {
  MenuBook, PlayArrow, Pause, VolumeUp, GraphicEq, CloudUpload,
  CheckCircle, School, Assignment, Description, Download, Church,
  VideoLibrary, Quiz, Verified, ArrowForward, AccessTime
} from '@mui/icons-material';

const ENROLLED_LMS_COURSES = [
  {
    id: "lms-theo-201",
    code: "TH 201",
    title: "Patristic Christology & Dogmatics",
    title_amharic: "የአበው የነገረ ክርስቶስ ትምህርት",
    instructor: "Dr. Sofia Assefa",
    progress: 68,
    modulesCount: 6,
    completedModules: 4,
    currentLesson: "Lesson 4: St. Cyril of Alexandria & the 12 Anathemas",
    nextDeadline: "Oct 15, 2026 · Exegesis Paper",
    color: "#D9A621"
  },
  {
    id: "lms-gez-101",
    code: "GEZ 101",
    title: "Introduction to Ge'ez Language",
    title_amharic: "የግዕዝ ቋንቋ መግቢያ",
    instructor: "Dr. Alemeyahu Worku",
    progress: 85,
    modulesCount: 5,
    completedModules: 4,
    currentLesson: "Lesson 5: Triconsonantal Verb Conjugation (Qatala)",
    nextDeadline: "Oct 18, 2026 · Vocabulary Quiz 3",
    color: "#12808C"
  },
  {
    id: "lms-chm-101",
    code: "CHM 101",
    title: "St. Yared Sacred Chants & Hymnology",
    title_amharic: "የቅዱስ ያሬድ ዜማና የድጓ ትምህርት",
    instructor: "Memhir Hailemariam Tesfaye",
    progress: 50,
    modulesCount: 8,
    completedModules: 4,
    currentLesson: "Lesson 4: The Ge'ez & Ezel Modalities in Diggua",
    nextDeadline: "Oct 22, 2026 · Audio Recitation",
    color: "#D9A621"
  },
  {
    id: "lms-bib-101",
    code: "BIB 101",
    title: "Old Testament Exegesis & Septuagint",
    title_amharic: "የብሉይ ኪዳን ትርጓሜ",
    instructor: "Dr. Alemeyahu Worku",
    progress: 72,
    modulesCount: 7,
    completedModules: 5,
    currentLesson: "Lesson 5: Genesis Messianic Typology in Ethiopian Tradition",
    nextDeadline: "Oct 25, 2026 · Term Paper",
    color: "#12808C"
  }
];

export default function LearningTab() {
  const [selectedCourse, setSelectedCourse] = useState(ENROLLED_LMS_COURSES[0]);
  const [activeTab, setActiveTab] = useState(0); // 0: Modules, 1: Sacred Audio Chants, 2: Video Lecture, 3: Assignments & Quizzes, 4: Certificate
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(42);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("b");

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
      <Paper sx={{
        p: 3, borderRadius: 3, bgcolor: '#0E2033', color: '#fff',
        display: 'flex', flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2,
        border: '1px solid rgba(217,166,33,0.3)'
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Chip 
              icon={<Church sx={{ color: '#D9A621 !important', fontSize: 16 }} />} 
              label="HTTU E-LEARNING (LMS) PORTAL" 
              size="small" 
              sx={{ bgcolor: 'rgba(217,166,33,0.15)', color: '#D9A621', fontWeight: 900, border: '1px solid rgba(217,166,33,0.3)' }} 
            />
            <Chip 
              label="Fall 2025 Semester" 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }} 
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
            Theological Online Study Environment
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            Access course modules, streaming St. Yared liturgical chants, HD video lectures, and graded exegesis assignments.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overall LMS Completion</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#D9A621' }}>68.8%</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Course Selector Tabs */}
      <Grid container spacing={2}>
        {ENROLLED_LMS_COURSES.map((course) => {
          const isSelected = selectedCourse.id === course.id;
          return (
            <Grid item xs={12} sm={6} md={3} key={course.id}>
              <Card 
                onClick={() => setSelectedCourse(course)}
                sx={{
                  p: 2, borderRadius: 3, cursor: 'pointer',
                  border: isSelected ? '2px solid #D9A621' : '1px solid #E2E8F0',
                  bgcolor: isSelected ? '#FFFDF5' : '#fff',
                  boxShadow: isSelected ? '0 8px 20px rgba(217,166,33,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: '#D9A621' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip label={course.code} size="small" sx={{ bgcolor: isSelected ? '#D9A621' : '#F1F5F9', color: isSelected ? '#0E2033' : '#475569', fontWeight: 900 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#16a34a' }}>{course.progress}%</Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0E2033', lineHeight: 1.2, mb: 0.5, height: 34, overflow: 'hidden' }}>
                  {course.title}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={course.progress} 
                  sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: course.color } }} 
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Course LMS Dashboard Area */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pb: 2, borderBottom: '1px solid #E2E8F0' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>
                {selectedCourse.code}: {selectedCourse.title}
              </Typography>
              <Chip label={selectedCourse.title_amharic} size="small" sx={{ bgcolor: 'rgba(217,166,33,0.12)', color: '#b45309', fontWeight: 800 }} />
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Instructor: {selectedCourse.instructor} · {selectedCourse.completedModules} of {selectedCourse.modulesCount} Modules Completed
            </Typography>
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' },
              '& .Mui-selected': { color: '#0E2033', fontWeight: 900 },
              '& .MuiTabs-indicator': { bgcolor: '#D9A621', height: 3 }
            }}
          >
            <Tab label="Modules & Lessons" />
            <Tab label="Sacred Chant Audio" />
            <Tab label="Video Lecture" />
            <Tab label="Assignments & Quizzes" />
            <Tab label="LMS Certificate" />
          </Tabs>
        </Box>

        {/* Tab 0: Modules */}
        {activeTab === 0 && (
          <Box sx={{ pt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              Course Syllabus & Module Progression
            </Typography>
            <Stack spacing={2}>
              {[
                { num: 1, title: "Historical Foundations of Orthodox Dogma", status: "completed", date: "Completed Sep 12" },
                { num: 2, title: "The Nicene-Constantinopolitan Conciliar Decrees", status: "completed", date: "Completed Sep 22" },
                { num: 3, title: "Alexandrian Christology: Mia Physis & St. Athanasius", status: "completed", date: "Completed Oct 02" },
                { num: 4, title: "St. Cyril of Alexandria: The 12 Anathemas & Christological Epistles", status: "in_progress", date: "Current Module · 88% Watched" },
                { num: 5, title: "Comparative Patristic Hermeneutics: Antiochene vs Alexandrian", status: "locked", date: "Unlocks after Module 4" },
                { num: 6, title: "Synthesis & Final Comprehensive Exegesis", status: "locked", date: "Final Capstone" },
              ].map((m) => (
                <Paper key={m.num} sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: m.status === 'in_progress' ? '#FFFDF5' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: m.status === 'completed' ? '#16a34a' : m.status === 'in_progress' ? '#D9A621' : '#E2E8F0', color: '#fff', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 800 }}>
                      {m.status === 'completed' ? '✓' : m.num}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033' }}>
                        Module {m.num}: {m.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>{m.date}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant={m.status === 'in_progress' ? 'contained' : 'outlined'} 
                    size="small" 
                    disabled={m.status === 'locked'}
                    sx={{ 
                      borderRadius: 2, textTransform: 'none', fontWeight: 800, 
                      bgcolor: m.status === 'in_progress' ? '#D9A621' : 'transparent',
                      color: m.status === 'in_progress' ? '#0E2033' : '#475569' 
                    }}
                  >
                    {m.status === 'completed' ? 'Review Lesson' : m.status === 'in_progress' ? 'Continue Study' : 'Locked'}
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Tab 1: Sacred Chant Audio Player */}
        {activeTab === 1 && (
          <Box sx={{ pt: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#0E2033', color: '#fff', border: '1px solid rgba(217,166,33,0.3)', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#D9A621', color: '#0E2033', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraphicEq sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#D9A621' }}>
                    St. Yared Sacred Chant Audio Stream (ቅዱስ ያሬድ ዜማ)
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    High-Fidelity Liturgical Recording · Modal Tone: Ge'ez (ግዕዝ) · Mode 1 of 3
                  </Typography>
                </Box>
              </Box>

              {/* Player HUD */}
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                  ዘይዌድስዋ መላእክት ለማርያም በውስተ ውሳጤ መንጦላዕት (Zeyewedsuha Mela'ekt)
                </Typography>
                <LinearProgress variant="determinate" value={audioProgress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' }, mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>02:18 / 05:40</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" onClick={() => setIsPlayingAudio(!isPlayingAudio)} sx={{ bgcolor: '#D9A621', color: '#0E2033', '&:hover': { bgcolor: '#c29219' } }}>
                      {isPlayingAudio ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <VolumeUp sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
                  </Stack>
                </Box>
              </Box>

              {/* Liturgical Text & Transliteration */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#D9A621', fontWeight: 800, textTransform: 'uppercase' }}>Ge'ez Sacred Text</Typography>
                    <Typography variant="body2" sx={{ color: '#fff', mt: 1, lineHeight: 1.8, fontSize: '0.95rem' }}>
                      ዘይዌድስዋ መላእክት ለማርያም በውስተ ውሳጤ መንጦላዕት፤ ወይብልዋ በሐኪ ማርያም ሐዳስዩ ጣዕዋ ሰሎሞን ዘተነበየ በእንቲአኪ።
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 800, textTransform: 'uppercase' }}>English Liturgical Translation</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1, lineHeight: 1.8, fontSize: '0.9rem' }}>
                      "Whom the angels praise inside the veil, saying to Mary: Rejoice, O Mary, the new heifer of whom Solomon prophesied."
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Tab 2: Video Lecture */}
        {activeTab === 2 && (
          <Box sx={{ pt: 3 }}>
            <Paper sx={{ bgcolor: '#000', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              {/* Simulated Video Player */}
              <Box sx={{
                height: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                background: 'linear-gradient(180deg, #09131F 0%, #000 100%)', color: '#fff', position: 'relative'
              }}>
                <IconButton sx={{ width: 70, height: 70, bgcolor: 'rgba(217,166,33,0.9)', color: '#0E2033', '&:hover': { bgcolor: '#D9A621', transform: 'scale(1.05)' } }}>
                  <PlayArrow sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 2 }}>
                  Module 4 · Lecture 2: St. Cyril of Alexandria & The 12 Anathemas
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  HLS 1080p Stream · English Subtitles with Ge'ez Technical Glosses
                </Typography>

                {/* Progress HUD */}
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                  <LinearProgress variant="determinate" value={88} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' }, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#fff' }}>37:12 / 42:15 (88% Watched · 90% required to complete)</Typography>
                    <Chip label="Speed: 1.0x" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem' }} />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Tab 3: Assignments & Quizzes */}
        {activeTab === 3 && (
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Assignment Card */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip label="EXEGESIS ESSAY" size="small" sx={{ bgcolor: 'rgba(217,166,33,0.15)', color: '#b45309', fontWeight: 900 }} />
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 800 }}>Due: Oct 15, 2026 (In 15 Days)</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 1 }}>
                    Exegetical Analysis of the Third Letter of Cyril to Nestorius
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6, mb: 2, fontSize: '0.88rem' }}>
                    Prepare a 2,500-word critical evaluation examining the 12 Anathematisms with citations from the Ge'ez Haymanote Abew (ሃይማኖተ አበው).
                  </Typography>

                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033', display: 'block', mb: 1 }}>
                      Grading Rubric Weights:
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>• Orthodoxy & Dogmatic Accuracy: 40%</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>• Ge'ez / Patristic Citations: 30%</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>• Structure & Theological Logic: 30%</Typography>
                    <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 700, mt: 0.5, display: 'block' }}>
                      Late Penalty: 5% deduction per 24 hours late.
                    </Typography>
                  </Box>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<CloudUpload />}
                    onClick={() => setUploadModalOpen(true)}
                    sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800, py: 1.2, textTransform: 'none', borderRadius: 2 }}
                  >
                    Submit Assignment Paper (.PDF / .DOCX)
                  </Button>
                </Paper>
              </Grid>

              {/* Quiz Card */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip label="THEOLOGICAL QUIZ" size="small" sx={{ bgcolor: 'rgba(18,128,140,0.15)', color: '#12808C', fontWeight: 900 }} />
                    <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800 }}>Time: 15 Mins · 5 Questions</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0E2033', mb: 1 }}>
                    Patristic Vocabulary & Formulations
                  </Typography>
                  
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', mb: 1.5 }}>
                      Question 1: What does the Cyrilline term "Mia Physis tou Theou Logou Sesarkomene" signify in Orthodox Christology?
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)}>
                        <FormControlLabel value="a" control={<Radio size="small" />} label={<Typography variant="body2">Two separate persons joined by moral harmony</Typography>} />
                        <FormControlLabel value="b" control={<Radio size="small" />} label={<Typography variant="body2">One incarnate nature of God the Word</Typography>} />
                        <FormControlLabel value="c" control={<Radio size="small" />} label={<Typography variant="body2">Absorption of the human nature into divinity</Typography>} />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {quizSubmitted ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Correct! Score: 100%. "One incarnate nature of God the Word" affirms the unbroken unity of Christ.
                    </Alert>
                  ) : null}

                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => setQuizSubmitted(true)}
                    sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, py: 1.2, textTransform: 'none', borderRadius: 2 }}
                  >
                    Submit Quiz Answers
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 4: Certificate of Completion */}
        {activeTab === 4 && (
          <Box sx={{ pt: 3 }}>
            <Paper sx={{
              p: 4, borderRadius: 4, border: '4px double #D9A621', bgcolor: '#FFFDF5',
              maxWidth: 720, mx: 'auto', textAlign: 'center', boxShadow: '0 10px 30px rgba(217,166,33,0.15)'
            }}>
              <Box sx={{ width: 60, height: 60, mx: 'auto', mb: 2, borderRadius: '50%', border: '2px solid #D9A621', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9A621', fontSize: '26px' }}>
                ✝
              </Box>
              <Typography variant="caption" sx={{ letterSpacing: 2, fontWeight: 900, color: '#0E2033', textTransform: 'uppercase' }}>
                Ethiopia Holy Trinity Theology University
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#D9A621', my: 1, fontFamily: 'serif' }}>
                CERTIFICATE OF THEOLOGICAL COMPLETION
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                This is to certify that seminarian
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
                Daniel Gebremariam
              </Typography>
              <Typography variant="body2" sx={{ color: '#D9A621', fontWeight: 700, mb: 2 }}>
                ዳንኤል ገብረማርያም · Student ID: HTTU-2024-01148
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', maxWidth: 500, mx: 'auto', lineHeight: 1.7, mb: 3 }}>
                has successfully mastered all prescribed instructional modules, lecture milestones, liturgical audio recitations, and assessment examinations in <strong>Classical Ge'ez Language & Manuscript Paleography</strong>.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#0E2033' }}>
                    Rev. Dr. Abeba Zerihun
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Dean of Academic Affairs</Typography>
                </Box>
                <Chip 
                  icon={<Verified sx={{ fontSize: 16, color: '#16a34a !important' }} />} 
                  label="VERIFIED: CERT-LMS-2026-000142" 
                  size="small" 
                  sx={{ bgcolor: '#F0FDF4', color: '#16a34a', fontWeight: 800, border: '1px solid #BBF7D0' }} 
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#0E2033' }}>
                    Dr. Alemeyahu Worku
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Department Chair</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0E2033' }}>Upload Exegesis Paper</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            Upload your PDF or Word document. System will run automated plagiarism check and apply the theological rubric.
          </Typography>
          <Box sx={{ p: 4, border: '2px dashed #CBD5E1', borderRadius: 3, textAlign: 'center', bgcolor: '#F8FAFC', cursor: 'pointer' }}>
            <CloudUpload sx={{ fontSize: 48, color: '#D9A621', mb: 1 }} />
            <Typography variant="subtitle2" fontWeight={800} color="#0E2033">Click to Select Document or Drag & Drop</Typography>
            <Typography variant="caption" color="text.secondary">Accepted formats: .pdf, .docx (Max 25MB)</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setUploadModalOpen(false); alert("Document uploaded and queued for plagiarism & rubric analysis!"); }} sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Submit Paper</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
