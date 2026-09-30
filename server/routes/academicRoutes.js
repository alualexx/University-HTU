const express = require('express');
const router = express.Router();
const db = require('../database/db');
const eventBus = require('../events/eventBus');
const { gregorianToEthiopian } = require('../utils/ethiopianCalendar');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// --- Programs ---
router.get('/programs', (req, res) => {
  const { degree_level, department_id, status } = req.query;
  const programs = db.find('programs', p => {
    if (degree_level && p.degree_level !== degree_level) return false;
    if (department_id && p.department_id !== department_id) return false;
    if (status && p.status !== status) return false;
    return true;
  });

  // Enrich with department name
  const enriched = programs.map(p => {
    const dept = db.findById('departments', p.department_id);
    return {
      ...p,
      department_name: dept ? dept.name : null,
      department_amharic: dept ? dept.name_amharic : null
    };
  });

  res.json({ success: true, data: enriched });
});

router.post('/programs', authenticate, authorize(['admin', 'academic_dean']), (req, res) => {
  const { name, name_amharic, code, degree_level, department_id, total_credits_required, duration_semesters, description } = req.body;
  if (!name || !code || !degree_level || !department_id || !total_credits_required) {
    return res.status(400).json({ error: 'Missing required program parameters' });
  }

  const newProg = db.insert('programs', {
    name,
    name_amharic,
    code,
    degree_level,
    department_id,
    total_credits_required: Number(total_credits_required),
    duration_semesters: Number(duration_semesters || 8),
    status: 'active',
    description,
    created_by: req.user.id
  });

  res.status(201).json({ success: true, data: newProg });
});

// --- Departments ---
router.get('/departments', (req, res) => {
  const departments = db.find('departments');
  const enriched = departments.map(d => {
    const head = d.head_faculty_id ? db.findById('users', d.head_faculty_id) : null;
    return {
      ...d,
      head_faculty_name: head ? head.full_name : 'To be appointed'
    };
  });
  res.json({ success: true, data: enriched });
});

// --- Courses ---
router.get('/courses', (req, res) => {
  const { department_id, course_type, search } = req.query;
  const courses = db.find('courses', c => {
    if (department_id && c.department_id !== department_id) return false;
    if (course_type && c.course_type !== course_type) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.course_code.toLowerCase().includes(q) || 
             c.title.toLowerCase().includes(q) ||
             (c.title_amharic && c.title_amharic.includes(q));
    }
    return true;
  });

  // Attach prerequisites
  const enriched = courses.map(c => {
    const prereqs = db.find('course_prerequisites', p => p.course_id === c.id).map(p => {
      const target = db.findById('courses', p.prerequisite_course_id);
      return {
        course_id: p.prerequisite_course_id,
        course_code: target ? target.course_code : null,
        title: target ? target.title : null,
        minimum_grade: p.minimum_grade
      };
    });
    return { ...c, prerequisites: prereqs };
  });

  res.json({ success: true, data: enriched });
});

router.post('/courses', authenticate, authorize(['admin', 'academic_dean', 'department_head']), (req, res) => {
  const { course_code, title, title_amharic, description, credit_hours, lecture_hours, lab_hours, course_type, department_id } = req.body;
  if (!course_code || !title || !credit_hours || !course_type) {
    return res.status(400).json({ error: 'Missing required course fields' });
  }

  const course = db.insert('courses', {
    course_code,
    title,
    title_amharic,
    description,
    credit_hours: Number(credit_hours),
    lecture_hours: Number(lecture_hours || 0),
    lab_hours: Number(lab_hours || 0),
    course_type,
    department_id,
    status: 'active'
  });

  eventBus.publish('CourseCreated', 'Academic.Course', course.id, {
    course_id: course.id,
    course_code: course.course_code,
    title: course.title,
    credit_hours: course.credit_hours
  });

  res.status(201).json({ success: true, data: course });
});

// --- Semesters & Scheduling ---
router.get('/semesters', (req, res) => {
  const semesters = db.find('semesters');
  res.json({ success: true, data: semesters });
});

router.get('/course-offerings', (req, res) => {
  const { semester_id, faculty_id } = req.query;
  const offerings = db.find('course_offerings', off => {
    if (semester_id && off.semester_id !== semester_id) return false;
    if (faculty_id && off.faculty_id !== faculty_id) return false;
    return true;
  });

  const enriched = offerings.map(off => {
    const course = db.findById('courses', off.course_id);
    const faculty = off.faculty_id ? db.findById('users', off.faculty_id) : null;
    const room = off.room_id ? db.findById('rooms', off.room_id) : null;
    return {
      ...off,
      course_code: course ? course.course_code : null,
      course_title: course ? course.title : null,
      course_title_amharic: course ? course.title_amharic : null,
      credits: course ? course.credit_hours : null,
      faculty_name: faculty ? faculty.full_name : 'Unassigned',
      room_info: room ? `${room.building_name} - ${room.room_number}` : 'TBA'
    };
  });

  res.json({ success: true, data: enriched });
});

router.get('/course-offerings/conflicts', (req, res) => {
  const { faculty_id, room_id, semester_id, start_time, end_time, days_of_week } = req.query;
  const days = days_of_week ? (Array.isArray(days_of_week) ? days_of_week.map(Number) : days_of_week.split(',').map(Number)) : [];
  
  const check = db.checkOfferingConflicts({
    faculty_id,
    room_id,
    semester_id,
    start_time,
    end_time,
    days_of_week: days
  });

  res.json({ success: true, ...check });
});

router.post('/course-offerings', authenticate, authorize(['admin', 'academic_dean', 'department_head']), (req, res) => {
  const { course_id, semester_id, section_number, faculty_id, room_id, max_enrollment, schedule_pattern, start_time, end_time, days_of_week } = req.body;
  
  // Conflict Check
  const conflicts = db.checkOfferingConflicts({
    faculty_id,
    room_id,
    semester_id,
    start_time,
    end_time,
    days_of_week
  });

  if (conflicts.has_conflicts) {
    return res.status(409).json({
      error: 'Scheduling conflict detected',
      conflicts: conflicts.conflicts
    });
  }

  const offering = db.insert('course_offerings', {
    course_id,
    semester_id,
    section_number: section_number || 'A',
    faculty_id,
    room_id,
    max_enrollment: Number(max_enrollment || 30),
    current_enrollment: 0,
    schedule_pattern,
    start_time,
    end_time,
    days_of_week,
    status: 'open'
  });

  eventBus.publish('CourseOfferingCreated', 'Academic.Offering', offering.id, {
    offering_id: offering.id,
    course_id: offering.course_id,
    semester_id: offering.semester_id,
    faculty_id: offering.faculty_id
  });

  res.status(201).json({ success: true, data: offering });
});

// --- Grades & Grading Approvals ---
router.post('/grades/bulk', authenticate, authorize(['faculty', 'department_head', 'admin']), (req, res) => {
  const { course_offering_id, grades } = req.body;
  if (!course_offering_id || !Array.isArray(grades) || grades.length === 0) {
    return res.status(400).json({ error: 'course_offering_id and grades array required' });
  }

  const gradePointMap = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0,
    'I': 0.0, 'W': 0.0
  };

  const offering = db.findById('course_offerings', course_offering_id);
  const course = offering ? db.findById('courses', offering.course_id) : null;
  const credits = course ? course.credit_hours : 3;

  const inserted = [];
  for (const item of grades) {
    const grade_points = gradePointMap[item.letter_grade] || 0.0;
    const gradeRecord = db.insert('grades', {
      student_id: item.student_id,
      course_offering_id,
      enrollment_id: item.enrollment_id,
      letter_grade: item.letter_grade,
      grade_points,
      credits,
      submitted_by: req.user.id,
      status: 'submitted',
      remarks: item.remarks || null
    });
    inserted.push(gradeRecord);
  }

  eventBus.publish('GradeSubmitted', 'Academic.Grades', course_offering_id, {
    course_offering_id,
    submitted_by: req.user.id,
    student_count: inserted.length
  });

  res.status(201).json({
    success: true,
    message: `${inserted.length} grades submitted successfully for department head approval`,
    data: { submitted_count: inserted.length, status: 'submitted' }
  });
});

router.post('/grades/:id/approve', authenticate, authorize(['department_head', 'academic_dean', 'admin']), (req, res) => {
  const grade = db.findById('grades', req.params.id);
  if (!grade) {
    return res.status(404).json({ error: 'Grade record not found' });
  }

  const updated = db.update('grades', grade.id, {
    status: 'approved',
    approved_by: req.user.id,
    approved_at: new Date().toISOString()
  });

  // Auto-sync to student registration record
  const registration = db.findOne('course_registrations', r => 
    r.course_offering_id === grade.course_offering_id && r.enrollment_id === grade.enrollment_id
  );
  if (registration) {
    db.update('course_registrations', registration.id, {
      grade: grade.letter_grade,
      grade_points: grade.grade_points,
      status: grade.letter_grade === 'F' ? 'failed' : 'completed'
    });
  }

  eventBus.publish('GradeApproved', 'Academic.Grades', grade.id, {
    grade_id: grade.id,
    student_id: grade.student_id,
    course_offering_id: grade.course_offering_id,
    approved_by: req.user.id
  });

  res.json({ success: true, message: 'Grade approved and student transcript ledger updated', data: updated });
});

// --- Official Transcripts ---
router.post('/transcripts/generate', authenticate, authorize(['registrar', 'admin']), (req, res) => {
  const { student_id, type = 'official' } = req.body;
  const student = db.findById('students', student_id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const gpaSummary = db.calculateGPA(student_id);
  const verificationCode = `EHTTU-2026-${uuidv4().substring(0, 8).toUpperCase()}`;

  const transcript = db.insert('transcripts', {
    student_id,
    type,
    verification_code: verificationCode,
    file_url: `https://storage.httu.edu.et/transcripts/${verificationCode}.pdf`,
    qr_code_url: `https://storage.httu.edu.et/transcripts/qr/${verificationCode}.png`,
    status: 'active',
    generated_by: req.user.id
  });

  eventBus.publish('TranscriptGenerated', 'Academic.Transcript', transcript.id, {
    transcript_id: transcript.id,
    student_id,
    verification_code: verificationCode
  });

  res.status(201).json({
    success: true,
    data: {
      id: transcript.id,
      verification_code: verificationCode,
      file_url: transcript.file_url,
      student_name: `${student.first_name} ${student.last_name}`,
      student_id_number: student.student_id_number,
      baptism_name: student.baptism_name,
      cumulative_gpa: gpaSummary.cumulative_gpa,
      academic_standing: gpaSummary.standing,
      is_deans_list: gpaSummary.is_deans_list
    }
  });
});

// Public Verification Endpoint (No Auth Required)
router.get('/transcripts/verify/:code', (req, res) => {
  const transcript = db.findOne('transcripts', t => t.verification_code === req.params.code);
  if (!transcript || transcript.status !== 'active') {
    return res.status(404).json({ success: false, valid: false, message: 'Transcript record not found or revoked' });
  }

  const student = db.findById('students', transcript.student_id);
  const prog = student ? db.findById('programs', student.program_id) : null;
  const gpa = db.calculateGPA(transcript.student_id);

  res.json({
    success: true,
    valid: true,
    data: {
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
      baptism_name: student ? student.baptism_name : null,
      student_id_number: student ? student.student_id_number : null,
      program: prog ? prog.name : 'Bachelor of Theology',
      cumulative_gpa: gpa.cumulative_gpa,
      academic_standing: gpa.standing,
      generated_at: transcript.created_at,
      institution: "Ethiopia Holy Trinity Theology University (HTTU)",
      verification_status: "authentic"
    }
  });
});

// --- Dual Academic Calendar ---
router.get('/academic-calendar/events', (req, res) => {
  const events = db.find('academic_calendar_events');
  // Enrich each event with calculated Ethiopian date if needed
  const enriched = events.map(evt => {
    const eth = gregorianToEthiopian(evt.start_date);
    return {
      ...evt,
      computed_ethiopian_date: eth ? eth.formattedEn : null,
      computed_ethiopian_date_am: eth ? eth.formattedAm : null
    };
  });
  res.json({ success: true, data: enriched });
});

module.exports = router;
