const express = require('express');
const router = express.Router();
const db = require('../database/db');
const eventBus = require('../events/eventBus');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// --- Student Registration & Profiles ---
router.get('/students', authenticate, (req, res) => {
  const { search, status, program_id } = req.query;
  const students = db.find('students', s => {
    if (status && s.status !== status) return false;
    if (program_id && s.program_id !== program_id) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.student_id_number.toLowerCase().includes(q) ||
             s.first_name.toLowerCase().includes(q) ||
             s.last_name.toLowerCase().includes(q) ||
             (s.amharic_name && s.amharic_name.includes(q)) ||
             (s.baptism_name && s.baptism_name.toLowerCase().includes(q));
    }
    return true;
  });

  const enriched = students.map(s => {
    const prog = db.findById('programs', s.program_id);
    const gpaData = db.calculateGPA(s.id);
    return {
      ...s,
      program_name: prog ? prog.name : 'Bachelor of Theology',
      cumulative_gpa: gpaData.cumulative_gpa,
      academic_standing: gpaData.standing
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

router.get('/students/:id', authenticate, (req, res) => {
  const student = db.findById('students', req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  const prog = db.findById('programs', student.program_id);
  const gpaData = db.calculateGPA(student.id);

  // Retrieve enrollment history with courses & grades
  const enrollments = db.find('enrollments', e => e.student_id === student.id).map(enr => {
    const sem = db.findById('semesters', enr.semester_id);
    const regs = db.find('course_registrations', r => r.enrollment_id === enr.id).map(reg => {
      const offering = db.findById('course_offerings', reg.course_offering_id);
      const course = offering ? db.findById('courses', offering.course_id) : null;
      return {
        ...reg,
        course_code: course ? course.course_code : null,
        course_title: course ? course.title : null
      };
    });
    return {
      ...enr,
      semester_name: sem ? sem.name : 'Unknown Semester',
      registrations: regs
    };
  });

  res.json({
    success: true,
    data: {
      ...student,
      program_name: prog ? prog.name : 'Bachelor of Theology',
      academic_summary: gpaData,
      enrollment_history: enrollments
    }
  });
});

router.post('/students', authenticate, authorize(['admin', 'registrar']), (req, res) => {
  const { first_name, last_name, amharic_name, date_of_birth, gender, phone, email, address, city, region, baptism_name, church_parish, program_id } = req.body;
  
  if (!first_name || !last_name || !email || !date_of_birth || !gender) {
    return res.status(400).json({ error: 'Missing required student fields' });
  }

  // Generate standardized student ID: HTTU-YYYY-NNNN
  const year = new Date().getFullYear();
  const count = db.find('students').length + 1;
  const student_id_number = `HTTU-${year}-${String(count).padStart(4, '0')}`;

  const newStudent = db.insert('students', {
    student_id_number,
    first_name,
    last_name,
    amharic_name,
    date_of_birth,
    gender,
    nationality: 'Ethiopian',
    phone,
    email,
    address,
    city: city || 'Addis Ababa',
    region: region || 'Addis Ababa',
    photo_url: req.body.photo_url || null,
    baptism_name,
    church_parish,
    status: 'active',
    admission_date: new Date().toISOString().split('T')[0],
    program_id: program_id || 'prog-bth'
  });

  // Cross-module event
  eventBus.publish('StudentCreated', 'SIS.Student', newStudent.id, {
    student_id: newStudent.id,
    student_id_number: newStudent.student_id_number,
    first_name: newStudent.first_name,
    last_name: newStudent.last_name,
    email: newStudent.email,
    program_id: newStudent.program_id,
    baptism_name: newStudent.baptism_name,
    church_parish: newStudent.church_parish
  });

  // Automatically register library membership
  db.insert('library_members', {
    user_id: newStudent.id,
    member_type: 'student',
    student_id: newStudent.id,
    employee_id: null,
    max_books_allowed: 5,
    max_loan_days: 14,
    membership_start: newStudent.admission_date,
    status: 'active'
  });

  res.status(201).json({ success: true, data: newStudent });
});

// --- Admissions Applications ---
router.get('/admissions/applications', authenticate, authorize(['admin', 'registrar', 'academic_dean']), (req, res) => {
  const { status, program_id, academic_year } = req.query;
  const apps = db.find('applications', a => {
    if (status && a.status !== status) return false;
    if (program_id && a.program_id !== program_id) return false;
    if (academic_year && a.academic_year !== academic_year) return false;
    return true;
  });

  const enriched = apps.map(a => {
    const prog = db.findById('programs', a.program_id);
    const reviewer = a.reviewer_id ? db.findById('users', a.reviewer_id) : null;
    return {
      ...a,
      program_name: prog ? prog.name : 'Bachelor of Theology',
      reviewer_name: reviewer ? reviewer.full_name : null
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

router.post('/admissions/applications', (req, res) => {
  const { applicant_name, email, phone, program_id, academic_year, baptism_name, church_parish } = req.body;
  if (!applicant_name || !email || !phone || !program_id) {
    return res.status(400).json({ error: 'Applicant name, email, phone, and program are required' });
  }

  // Duplicate Check: unique index (email, program_id, academic_year)
  const existing = db.findOne('applications', a => 
    a.email.toLowerCase() === email.toLowerCase() && 
    a.program_id === program_id && 
    a.academic_year === (academic_year || '2026-2027')
  );

  if (existing) {
    return res.status(409).json({ error: 'An application for this program and academic cycle already exists with this email' });
  }

  const application = db.insert('applications', {
    applicant_name,
    email,
    phone,
    program_id,
    academic_year: academic_year || '2026-2027',
    application_date: new Date().toISOString(),
    status: 'submitted',
    baptism_name,
    church_parish,
    documents_complete: false,
    interview_score: null,
    entrance_exam_score: null,
    decision: null
  });

  eventBus.publish('ApplicationSubmitted', 'SIS.Application', application.id, {
    application_id: application.id,
    applicant_name: application.applicant_name,
    email: application.email,
    program_id: application.program_id
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully. Confirmation email queued.',
    data: application
  });
});

router.put('/admissions/applications/:id/status', authenticate, authorize(['admin', 'registrar', 'academic_dean']), (req, res) => {
  const { status, reviewer_id, review_notes, interview_score, entrance_exam_score, decision } = req.body;
  const app = db.findById('applications', req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const updates = {};
  if (status) updates.status = status;
  if (reviewer_id) updates.reviewer_id = reviewer_id;
  if (review_notes) updates.review_notes = review_notes;
  if (interview_score !== undefined) updates.interview_score = Number(interview_score);
  if (entrance_exam_score !== undefined) updates.entrance_exam_score = Number(entrance_exam_score);
  if (decision) {
    updates.decision = decision;
    updates.decision_date = new Date().toISOString();
  }

  const updated = db.update('applications', app.id, updates);

  // If accepted, auto-create student record
  if (decision === 'accepted' && app.decision !== 'accepted') {
    eventBus.publish('ApplicationDecisionMade', 'SIS.Application', app.id, {
      application_id: app.id,
      applicant_email: app.email,
      decision: 'accepted',
      program_id: app.program_id
    });
  }

  res.json({ success: true, data: updated });
});

// --- Semester Enrollment & Course Registration ---
router.post('/enrollments', authenticate, (req, res) => {
  const { student_id, semester_id } = req.body;
  if (!student_id || !semester_id) {
    return res.status(400).json({ error: 'student_id and semester_id required' });
  }

  const student = db.findById('students', student_id);
  if (!student || student.status !== 'active') {
    return res.status(400).json({ error: 'Student must have active status to enroll' });
  }

  const existing = db.findOne('enrollments', e => e.student_id === student_id && e.semester_id === semester_id);
  if (existing) {
    return res.status(409).json({ error: 'Student already enrolled in this semester', data: existing });
  }

  const enrollment = db.insert('enrollments', {
    student_id,
    semester_id,
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active',
    total_credits: 0,
    gpa: 0.00
  });

  eventBus.publish('StudentEnrolled', 'SIS.Enrollment', enrollment.id, {
    enrollment_id: enrollment.id,
    student_id,
    semester_id
  });

  res.status(201).json({ success: true, message: 'Semester enrollment created', data: enrollment });
});

router.post('/enrollments/:id/courses', authenticate, (req, res) => {
  const { course_offering_ids } = req.body;
  const enrollment = db.findById('enrollments', req.params.id);
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment record not found' });
  }

  if (!Array.isArray(course_offering_ids) || course_offering_ids.length === 0) {
    return res.status(400).json({ error: 'course_offering_ids array required' });
  }

  const registered = [];
  const failed = [];

  for (const offId of course_offering_ids) {
    const offering = db.findById('course_offerings', offId);
    if (!offering) {
      failed.push({ course_offering_id: offId, reason: 'Course offering not found' });
      continue;
    }

    const course = db.findById('courses', offering.course_id);
    const credits = course ? course.credit_hours : 3;

    // 1. Capacity Check
    if (offering.current_enrollment >= offering.max_enrollment) {
      failed.push({ course_offering_id: offId, reason: 'Course section is full' });
      continue;
    }

    // 2. Prerequisite Check (Grade C- or better)
    const prereqCheck = db.validatePrerequisites(enrollment.student_id, offering.course_id);
    if (!prereqCheck.valid) {
      failed.push({ course_offering_id: offId, reason: prereqCheck.message });
      continue;
    }

    // 3. Max Credit Limit Check (Max 21 credits default)
    if (enrollment.total_credits + credits > 21) {
      failed.push({ course_offering_id: offId, reason: 'Exceeds maximum limit of 21 credit hours per semester' });
      continue;
    }

    // Register
    const reg = db.insert('course_registrations', {
      enrollment_id: enrollment.id,
      course_offering_id: offId,
      registration_date: new Date().toISOString(),
      status: 'registered',
      grade: null,
      grade_points: null,
      credits
    });

    // Update offering count & enrollment total
    db.update('course_offerings', offering.id, {
      current_enrollment: offering.current_enrollment + 1
    });

    enrollment.total_credits += credits;
    db.update('enrollments', enrollment.id, { total_credits: enrollment.total_credits });

    registered.push(reg);

    eventBus.publish('CourseRegistered', 'SIS.Registration', reg.id, {
      registration_id: reg.id,
      student_id: enrollment.student_id,
      course_offering_id: offId,
      credits
    });
  }

  res.status(201).json({
    success: true,
    data: {
      enrollment_id: enrollment.id,
      registered_courses: registered,
      failed_registrations: failed,
      total_credits: enrollment.total_credits
    }
  });
});

module.exports = router;
