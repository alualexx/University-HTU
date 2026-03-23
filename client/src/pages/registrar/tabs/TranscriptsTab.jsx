import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, InputAdornment, Button,
  Avatar, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, MenuItem, Paper,
  Switch, FormControlLabel, Tooltip, CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search, Person, CalendarToday, Add, Edit, Delete, Print, CheckCircle, Save, LibraryBooks,
  School, Check, Close, Assignment, Sync, Info
} from '@mui/icons-material';
import { db } from '../../../services/Firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const TranscriptsTab = ({ isDark, glassStyle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Dialog state
  const [semesterDialog, setSemesterDialog] = useState({ open: false, mode: 'add', data: { term: '', termGPA: 0 } });
  const [courseDialog, setCourseDialog] = useState({ open: false, termIndex: null, mode: 'add', data: { code: '', title: '', credits: 3, grade: 'A' } });

  // Handle Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      // Search by role string equal to 'student'
      const q = query(usersRef, where('role', '==', 'student'));
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => 
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setStudents(results);
    } catch (error) {
      console.error("Error searching students", error);
    }
    setLoading(false);
  };

  // Load Transcript
  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    try {
      const q = query(collection(db, 'transcripts'), where('studentUid', '==', student.id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setTranscriptData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        // Initialize empty transcript
        setTranscriptData({
          studentUid: student.id,
          studentName: student.name,
          studentId: student.studentId || "N/A",
          program: student.department || student.intendedMajor || "General",
          courseBranch: student.intendedMajor || "N/A",
          collegeName: "TECH UNIVERSITY (MAIN CAMPUS)",
          courseDuration: "Four Years (2 Semesters in a Year)",
          admissionYear: student.batch || new Date().getFullYear().toString(),
          completionYear: student.gradYear || (new Date().getFullYear() + 4).toString(),
          mediumOfInstruction: "English",
          termRecords: [],
          cumulativeGPA: 0.0
        });
      }
    } catch (error) {
      console.error("Error loading transcript", error);
    }
    setLoading(false);
  };

  const calculateCGPA = (records) => {
    let totalPoints = 0;
    let totalCredits = 0;
    records?.forEach(term => {
      term.courses?.forEach(course => {
        // Skip dropped courses
        if (course.status === 'Dropped') return;

        let gp = 0;
        const grade = course.grade?.toUpperCase();
        if (grade === 'A' || grade === 'A+') gp = 4.0;
        else if (grade === 'A-') gp = 3.7;
        else if (grade === 'B+') gp = 3.3;
        else if (grade === 'B') gp = 3.0;
        else if (grade === 'B-') gp = 2.7;
        else if (grade === 'C+') gp = 2.3;
        else if (grade === 'C') gp = 2.0;
        else if (grade === 'C-') gp = 1.7;
        else if (grade === 'D') gp = 1.0;
        else if (grade === 'F') gp = 0.0;
        
        totalPoints += gp * (course.credits || 0);
        totalCredits += (course.credits || 0);
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const handleSaveTranscript = async () => {
    if (!transcriptData || !selectedStudent) return;
    try {
      const updatedCGPA = calculateCGPA(transcriptData.termRecords);
      const dataToSave = { 
        ...transcriptData, 
        cumulativeGPA: parseFloat(updatedCGPA),
        lastUpdated: new Date().toISOString()
      };
      
      // 1. Save to transcripts collection
      if (transcriptData.id) {
        await updateDoc(doc(db, 'transcripts', transcriptData.id), dataToSave);
      } else {
        const docRef = doc(collection(db, 'transcripts'));
        await setDoc(docRef, dataToSave);
        dataToSave.id = docRef.id;
      }

      // 2. Sync to user profile for consistency
      const userRef = doc(db, 'users', selectedStudent.id);
      await updateDoc(userRef, {
        department: transcriptData.program,
        status: transcriptData.studentStatus || 'Active'
      });

      setTranscriptData(dataToSave);
      alert("Transcript and Student Profile updated successfully!");
    } catch (error) {
      console.error("Error saving transcript", error);
      alert("Error saving transcript: " + error.message);
    }
  };

  const handleAddSemester = () => {
    const updated = { ...transcriptData };
    updated.termRecords.push({ term: semesterDialog.data.term, courses: [], termGPA: 0.0 });
    setTranscriptData(updated);
    setSemesterDialog({ open: false, mode: 'add', data: { term: '', termGPA: 0 } });
  };

  const handleDeleteSemester = (index) => {
    const updated = { ...transcriptData };
    updated.termRecords.splice(index, 1);
    setTranscriptData(updated);
  };

  const handleAddCourse = () => {
    if (courseDialog.termIndex === null || courseDialog.termIndex === undefined) return;
    const updated = { ...transcriptData };
    if (!updated.termRecords[courseDialog.termIndex].courses) {
      updated.termRecords[courseDialog.termIndex].courses = [];
    }
    updated.termRecords[courseDialog.termIndex].courses.push({ ...courseDialog.data });
    setTranscriptData(updated);
    setCourseDialog({ open: false, termIndex: null, mode: 'add', data: { code: '', title: '', credits: 3, grade: 'A' } });
  };

  const handleDeleteCourse = (termIndex, courseIndex) => {
    const updated = { ...transcriptData };
    updated.termRecords[termIndex].courses.splice(courseIndex, 1);
    setTranscriptData(updated);
  };

  const handleSyncEnrollments = async () => {
    if (!selectedStudent || !transcriptData) return;
    try {
      setLoading(true);
      // Fetch approved enrollments for this student
      const q = query(collection(db, 'enrollments'), where('studentId', '==', selectedStudent.studentId || selectedStudent.uid), where('status', '==', 'approved'));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        alert("No approved enrollments found for this student.");
        setLoading(false);
        return;
      }

      const newCourses = snap.docs.map(d => {
        const data = d.data();
        return {
          code: data.courseCode || data.code || "N/A",
          title: data.courseName || data.name || "N/A",
          credits: data.credits || 3,
          grade: 'A', // Default to A, registrar will edit
          status: 'Active'
        };
      });

      // Filter out courses already in ANY term
      const existingCodes = new Set();
      transcriptData.termRecords?.forEach(term => {
        term.courses?.forEach(c => existingCodes.add(c.code));
      });

      const coursesToAdd = newCourses.filter(c => !existingCodes.has(c.code));

      if (coursesToAdd.length === 0) {
        alert("All approved courses are already in the transcript.");
        setLoading(false);
        return;
      }

      // Add to a "Current Enrollment" term if it exists, or create a new one
      const updated = { ...transcriptData };
      let targetTerm = updated.termRecords.find(t => t.term === "Current Enrollment" || t.term === "Pending Sync");
      
      if (!targetTerm) {
        targetTerm = { term: "Current Enrollment", courses: [], termGPA: "0.00" };
        updated.termRecords.push(targetTerm);
      }

      targetTerm.courses.push(...coursesToAdd);
      setTranscriptData(updated);
      alert(`Imported ${coursesToAdd.length} courses from enrollments!`);
    } catch (err) {
      console.error("Sync error:", err);
      alert("Error syncing enrollments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourseStatus = (termIndex, courseIndex) => {
    const updated = { ...transcriptData };
    const course = updated.termRecords[termIndex].courses[courseIndex];
    course.status = course.status === 'Dropped' ? 'Active' : 'Dropped';
    setTranscriptData(updated);
  };

  const handleDownloadPDF = () => {
    if (!transcriptData) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // 1. Header & Branding
    // Logo Placeholder
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth / 2, 20, 10, 'D');
    doc.setFontSize(8);
    doc.text("LOGO", pageWidth / 2, 21, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ALEX TECHNICAL UNIVERSITY", pageWidth / 2, 38, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("(FORMERLY STATE TECHNICAL COLLEGE)", pageWidth / 2, 43, { align: "center" });
    doc.text("Main Campus, Sector-11, Education City, Alex State, India", pageWidth / 2, 47, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("OFFICIAL TRANSCRIPT", pageWidth / 2, 55, { align: "center" });
    doc.line(pageWidth / 2 - 25, 56, pageWidth / 2 + 25, 56);

    // Contact labels on right
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Off: +91-522-1234567", pageWidth - 15, 43, { align: "right" });
    doc.text("Fax: +91-522-1234568", pageWidth - 15, 47, { align: "right" });

    // 2. Student Bio Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const leftMargin = 15;
    const midPoint = 110;
    let bioY = 65;
    const lineSpacing = 6;

    const drawBioLine = (label, value, x) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, x, bioY);
      doc.text(":", x + 45, bioY);
      doc.setFont("helvetica", "normal");
      doc.text(String(value || "------"), x + 48, bioY);
    };

    drawBioLine("NAME", transcriptData.studentName, leftMargin);
    bioY += lineSpacing;
    drawBioLine("COURSE", transcriptData.program, leftMargin);
    bioY += lineSpacing;
    drawBioLine("BRANCH", transcriptData.courseBranch, leftMargin);
    bioY += lineSpacing;
    drawBioLine("COLLEGE", transcriptData.collegeName, leftMargin);
    bioY += lineSpacing;
    drawBioLine("DURATION OF COURSE", transcriptData.courseDuration, leftMargin);
    bioY += lineSpacing;
    drawBioLine("YEAR OF ADMISSION", transcriptData.admissionYear, leftMargin);
    bioY += lineSpacing;
    drawBioLine("YEAR OF COMPLETION", transcriptData.completionYear, leftMargin);
    bioY += lineSpacing;
    drawBioLine("MEDIUM OF INSTRUCTION", transcriptData.mediumOfInstruction, leftMargin);

    // 3. Academic Records Table
    let tableY = bioY + 10;

    // Helper to calculate SGPA
    const calculateTermSGPA = (courses) => {
      let pts = 0; let creds = 0;
      courses.forEach(c => {
        if (c.status === 'Dropped') return;
        let gp = 0;
        const g = c.grade?.toUpperCase();
        if (g === 'A' || g === 'A+') gp = 4.0;
        else if (g === 'A-') gp = 3.7;
        else if (g === 'B+') gp = 3.3;
        else if (g === 'B') gp = 3.0;
        else if (g === 'B-') gp = 2.7;
        else if (g === 'C+') gp = 2.3;
        else if (g === 'C') gp = 2.0;
        else if (g === 'C-') gp = 1.7;
        else if (g === 'D') gp = 1.0;
        else if (g === 'F') gp = 0.0;
        pts += gp * (c.credits || 0);
        creds += (c.credits || 0);
      });
      return creds > 0 ? (pts / creds).toFixed(2) : "0.00";
    };

    transcriptData.termRecords.forEach((term, index) => {
      // Semester Header Row as a standalone small table or text
      doc.autoTable({
        startY: tableY,
        head: [[`${term.term.toUpperCase()}   ROLL NO: ${transcriptData.studentId || "N/A"}   Session: ${transcriptData.session || "N/A"}`]],
        theme: 'grid',
        styles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 9 },
        margin: { left: 15, right: 15 }
      });
      tableY = doc.lastAutoTable.finalY;

      // Grade Data
      const sgpa = calculateTermSGPA(term.courses);
      const rows = term.courses.map((c, i) => {
        const row = [c.code, c.title, c.credits, c.grade];
        // Add SGPA/Status only to the first row of the semester for rowSpan effect in template style
        // Actually autotable rowSpan is better
        return row;
      });

      // We'll add the remarks column manually in the body with rowSpan
      const bodyData = term.courses.map((c, i) => {
        const row = [c.code, c.title, c.credits, c.grade];
        if (i === 0) {
          row.push({ 
            content: `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Semester\nSGPA : ${sgpa}\n\nPASS`, 
            rowSpan: term.courses.length,
            styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } 
          });
        }
        return row;
      });

      doc.autoTable({
        startY: tableY,
        head: [['CODE', 'SUBJECT', 'CREDIT', 'GRADE', 'REMARKS']],
        body: bodyData,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold', lineWidth: 0.1 },
        styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 35, halign: 'center' }
        },
        margin: { left: 15, right: 15 }
      });

      tableY = doc.lastAutoTable.finalY + 5;
      
      // Check for page break
      if (tableY > 250) {
        doc.addPage();
        tableY = 20;
      }
    });

    // Final Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Cumulative GPA: ${transcriptData.cumulativeGPA}`, 15, doc.internal.pageSize.height - 20);
    doc.text("Registrar Signature: ____________________", pageWidth - 15, doc.internal.pageSize.height - 20, { align: "right" });

    doc.save(`${transcriptData.studentName}_Official_Transcript.pdf`);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={1000} sx={{ fontFamily: 'Outfit, sans-serif' }}>Transcripts Management</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={1000} sx={{ letterSpacing: 2 }}>ACADEMIC RECORDS REPOSITORY</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Search Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, borderRadius: 6, p: 3, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} mb={2}>Student Lookup</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth size="small"
                placeholder="Name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSearch} 
                disabled={loading} 
                sx={{ 
                  borderRadius: 3, 
                  px: 4, 
                  py: 1,
                  background: isDark ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow: isDark ? '0 8px 16px rgba(0,0,0,0.4)' : '0 8px 16px rgba(99,102,241,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isDark ? '0 12px 24px rgba(0,0,0,0.6)' : '0 12px 24px rgba(99,102,241,0.4)',
                    background: isDark ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)'
                  }
                }}
              >
                Search
              </Button>
            </Box>

            <Box sx={{ mt: 3, maxHeight: 400, overflowY: 'auto' }}>
              {students?.map(student => (
                <Box
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  sx={{
                    p: 2, mb: 1, borderRadius: 3, cursor: 'pointer',
                    bgcolor: selectedStudent?.id === student.id ? (isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)') : 'transparent',
                    border: `1px solid ${selectedStudent?.id === student.id ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`,
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }
                  }}
                >
                  <Typography variant="body2" fontWeight={800}>{student.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{student.studentId}</Typography>
                </Box>
              ))}
              {(students?.length === 0 || !students) && !loading && <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 4 }}>No results found.</Typography>}
            </Box>
          </Card>
        </Grid>

        {/* Transcript Editor */}
        <Grid item xs={12} md={8}>
          {selectedStudent && transcriptData ? (
            <Card sx={{ ...glassStyle, borderRadius: 6 }}>
              <Box sx={{ p: 4, background: `linear-gradient(135deg, ${isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)'} 0%, transparent 100%)`, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 800 }}>{selectedStudent.name?.[0]}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={1000}>{selectedStudent.name}</Typography>
                    <Typography variant="subtitle2" color="primary.main" fontWeight={800} sx={{ mb: 2 }}>{selectedStudent.studentId || "PENDING ID"}</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Course"
                          value={transcriptData.program}
                          onChange={(e) => setTranscriptData({ ...transcriptData, program: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Branch"
                          value={transcriptData.courseBranch || ''}
                          onChange={(e) => setTranscriptData({ ...transcriptData, courseBranch: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="College"
                          value={transcriptData.collegeName || ''}
                          onChange={(e) => setTranscriptData({ ...transcriptData, collegeName: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Admission Year"
                          value={transcriptData.admissionYear || ''}
                          onChange={(e) => setTranscriptData({ ...transcriptData, admissionYear: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Completion Year"
                          value={transcriptData.completionYear || ''}
                          onChange={(e) => setTranscriptData({ ...transcriptData, completionYear: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Duration"
                          value={transcriptData.courseDuration || ''}
                          onChange={(e) => setTranscriptData({ ...transcriptData, courseDuration: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth size="small"
                          label="Medium"
                          value={transcriptData.mediumOfInstruction || 'English'}
                          onChange={(e) => setTranscriptData({ ...transcriptData, mediumOfInstruction: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth select size="small"
                          label="Student Status"
                          value={transcriptData.studentStatus || 'Active'}
                          onChange={(e) => setTranscriptData({ ...transcriptData, studentStatus: e.target.value })}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="On Leave">On Leave</MenuItem>
                          <MenuItem value="Suspended">Suspended</MenuItem>
                          <MenuItem value="Graduated">Graduated</MenuItem>
                          <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" fontWeight={1000} color="primary.main">{calculateCGPA(transcriptData?.termRecords)}</Typography>
                    <Typography variant="caption" fontWeight={900}>CUMULATIVE GPA</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 4, alignItems: 'center' }}>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSaveTranscript} sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}>Save Record</Button>
                  <Button variant="outlined" startIcon={<Print />} onClick={handleDownloadPDF} sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}>Export PDF</Button>
                  <Button 
                    variant="outlined" 
                    startIcon={loading ? <CircularProgress size={18} /> : <Sync />} 
                    onClick={handleSyncEnrollments} 
                    disabled={loading}
                    sx={{ borderRadius: 3, fontWeight: 800, px: 3, borderStyle: 'dashed' }}
                  >
                    Sync Enrollments
                  </Button>
                  <Button variant="outlined" startIcon={<Add />} onClick={() => setSemesterDialog({ ...semesterDialog, open: true })} sx={{ borderRadius: 3, fontWeight: 800, px: 3, ml: 'auto' }}>Add Semester</Button>
                </Box>
              </Box>

              <CardContent sx={{ p: 4 }}>
                {!transcriptData?.termRecords || transcriptData.termRecords.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                    <LibraryBooks sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" fontWeight={800}>No academic records yet.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={4}>
                    {transcriptData?.termRecords?.map((term, tIndex) => (
                      <Paper key={tIndex} sx={{ p: 3, borderRadius: 4, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight={900}>{term.term}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined" startIcon={<Add />} onClick={() => setCourseDialog({ open: true, termIndex: tIndex, mode: 'add', data: { code: '', title: '', credits: 3, grade: 'A' } })} sx={{ borderRadius: 2, fontWeight: 700 }}>Add Course</Button>
                            <IconButton size="small" color="error" onClick={() => handleDeleteSemester(tIndex)}><Delete fontSize="small" /></IconButton>
                          </Box>
                        </Box>
                        
                        <TableContainer sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Code</TableCell>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Credits</TableCell>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Grade</TableCell>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {!term.courses || term.courses.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, fontStyle: 'italic', color: 'text.secondary', border: 'none' }}>No courses added for this semester.</TableCell>
                                </TableRow>
                              ) : (
                                term.courses?.map((course, cIndex) => (
                                  <TableRow key={cIndex} sx={{ 
                                    '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}` },
                                    opacity: course.status === 'Dropped' ? 0.5 : 1,
                                    textDecoration: course.status === 'Dropped' ? 'line-through' : 'none'
                                  }}>
                                    <TableCell sx={{ fontWeight: 800 }}>{course.code}</TableCell>
                                    <TableCell fontWeight={700}>{course.title}</TableCell>
                                    <TableCell>{course.credits}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={course.status === 'Dropped' ? 'W/D' : course.grade} 
                                        size="small" 
                                        color={course.grade === 'F' ? 'error' : (course.status === 'Dropped' ? 'default' : 'primary')} 
                                        sx={{ borderRadius: 1.5, fontWeight: 900, height: 24 }} 
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title={course.status === 'Dropped' ? "Re-activate Course" : "Mark as Dropped/Withdrawn"}>
                                        <FormControlLabel
                                          control={
                                            <Switch 
                                              size="small" 
                                              checked={course.status !== 'Dropped'} 
                                              onChange={() => handleToggleCourseStatus(tIndex, cIndex)}
                                              color="primary"
                                            />
                                          }
                                          label={<Typography variant="caption" fontWeight={700}>{course.status || 'Active'}</Typography>}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                      <IconButton size="small" onClick={() => setCourseDialog({ open: true, termIndex: tIndex, mode: 'edit', courseIndex: cIndex, data: { ...course } })}><Edit fontSize="small" /></IconButton>
                                      <IconButton size="small" color="error" onClick={() => handleDeleteCourse(tIndex, cIndex)}><Delete fontSize="small" /></IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 100, mb: 2 }} />
                <Typography variant="h5" fontWeight={1000}>Select a student to manage transcript.</Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Semester Dialog */}
      <Dialog open={semesterDialog.open} onClose={() => setSemesterDialog({ ...semesterDialog, open: false })} maxWidth="xs" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Semester</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth label="Term (e.g. Fall 2026)"
            value={semesterDialog.data.term}
            onChange={(e) => setSemesterDialog(p => ({ ...p, data: { ...p.data, term: e.target.value } }))}
            sx={{ mb: 2, mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSemesterDialog({ ...semesterDialog, open: false })} sx={{ fontWeight: 800 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSemester} disabled={!semesterDialog.data.term} sx={{ fontWeight: 800, borderRadius: 2 }}>Add Term</Button>
        </DialogActions>
      </Dialog>

      {/* Course Dialog */}
      <Dialog open={courseDialog.open} onClose={() => setCourseDialog({ ...courseDialog, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, bgcolor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Course</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="Course Code" value={courseDialog.data.code} onChange={(e) => setCourseDialog(p => ({ ...p, data: { ...p.data, code: e.target.value } }))} />
              <TextField fullWidth label="Credits" type="number" value={courseDialog.data.credits} onChange={(e) => setCourseDialog(p => ({ ...p, data: { ...p.data, credits: parseInt(e.target.value) } }))} />
            </Stack>
            <TextField fullWidth label="Course Title" value={courseDialog.data.title} onChange={(e) => setCourseDialog(p => ({ ...p, data: { ...p.data, title: e.target.value } }))} />
            <TextField select fullWidth label="Grade" value={courseDialog.data.grade} onChange={(e) => setCourseDialog(p => ({ ...p, data: { ...p.data, grade: e.target.value } }))}>
              {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map(g => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCourseDialog({ ...courseDialog, open: false })} sx={{ fontWeight: 800 }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCourse} disabled={!courseDialog.data.code || !courseDialog.data.title} sx={{ fontWeight: 800, borderRadius: 2 }}>Add Course</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TranscriptsTab;
