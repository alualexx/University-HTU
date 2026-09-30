const express = require('express');
const router = express.Router();
const db = require('../database/db');
const eventBus = require('../events/eventBus');
const { authenticate, authorize } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// --- Courses ---
router.get('/courses', (req, res) => {
  const { instructor_id, status } = req.query;
  const courses = db.find('lms_courses', c => {
    if (instructor_id && c.instructor_id !== instructor_id) return false;
    if (status && c.status !== status) return false;
    return true;
  });

  const enriched = courses.map(c => {
    const modules = db.find('lms_modules', m => m.lms_course_id === c.id);
    const instructor = db.findById('users', c.instructor_id);
    return {
      ...c,
      instructor_name: instructor ? instructor.full_name : null,
      module_count: modules.length
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

router.get('/courses/:id', (req, res) => {
  const course = db.findById('lms_courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'LMS Course not found' });
  }

  const modules = db.find('lms_modules', m => m.lms_course_id === course.id).map(mod => {
    const lessons = db.find('lms_lessons', l => l.module_id === mod.id);
    return {
      ...mod,
      lessons
    };
  });

  const assignments = db.find('assignments', a => a.lms_course_id === course.id);
  const quizzes = db.find('quizzes', q => q.lms_course_id === course.id);
  const instructor = db.findById('users', course.instructor_id);

  res.json({
    success: true,
    data: {
      ...course,
      instructor: instructor ? { id: instructor.id, name: instructor.full_name, email: instructor.email } : null,
      modules,
      assignments_count: assignments.length,
      quizzes_count: quizzes.length
    }
  });
});

// --- Modules & Lessons ---
router.post('/courses/:id/modules', authenticate, authorize(['faculty', 'department_head', 'admin']), (req, res) => {
  const { title, description, order_index, unlock_date } = req.body;
  const course = db.findById('lms_courses', req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const currentModules = db.find('lms_modules', m => m.lms_course_id === course.id);
  const moduleRecord = db.insert('lms_modules', {
    lms_course_id: course.id,
    title,
    description,
    order_index: order_index || currentModules.length + 1,
    is_published: true,
    unlock_date: unlock_date || null,
    completion_required: true
  });

  res.status(201).json({ success: true, data: moduleRecord });
});

router.post('/modules/:id/lessons', authenticate, authorize(['faculty', 'department_head', 'admin']), (req, res) => {
  const { title, content_type, content_url, content_text, duration_minutes, is_mandatory } = req.body;
  const mod = db.findById('lms_modules', req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found' });

  const currentLessons = db.find('lms_lessons', l => l.module_id === mod.id);
  const lesson = db.insert('lms_lessons', {
    module_id: mod.id,
    title,
    content_type: content_type || 'text',
    content_url: content_url || null,
    content_text: content_text || null,
    order_index: currentLessons.length + 1,
    duration_minutes: duration_minutes || 45,
    is_published: true,
    is_mandatory: is_mandatory !== false
  });

  res.status(201).json({ success: true, data: lesson });
});

// Track student playback & progress
router.put('/lessons/:id/progress', authenticate, (req, res) => {
  const { student_id, status, time_spent_seconds, last_position_seconds } = req.body;
  const sId = student_id || req.user.id;
  const lesson = db.findById('lms_lessons', req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  let progress = db.findOne('lesson_progress', p => p.student_id === sId && p.lesson_id === lesson.id);
  if (progress) {
    progress = db.update('lesson_progress', progress.id, {
      status: status || progress.status,
      time_spent_seconds: (progress.time_spent_seconds || 0) + (time_spent_seconds || 0),
      last_position_seconds: last_position_seconds || progress.last_position_seconds,
      completed_at: status === 'completed' ? new Date().toISOString() : progress.completed_at
    });
  } else {
    progress = db.insert('lesson_progress', {
      student_id: sId,
      lesson_id: lesson.id,
      status: status || 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      time_spent_seconds: time_spent_seconds || 0,
      last_position_seconds: last_position_seconds || 0
    });
  }

  if (status === 'completed') {
    eventBus.publish('LessonCompleted', 'LMS.Lesson', lesson.id, {
      lesson_id: lesson.id,
      student_id: sId,
      completed_at: progress.completed_at
    });
  }

  res.json({ success: true, data: progress });
});

// --- Assignments ---
router.get('/assignments', (req, res) => {
  const { lms_course_id } = req.query;
  const assignments = db.find('assignments', a => {
    if (lms_course_id && a.lms_course_id !== lms_course_id) return false;
    return true;
  });
  res.json({ success: true, data: assignments });
});

router.post('/assignments/:id/submissions', authenticate, (req, res) => {
  const assignment = db.findById('assignments', req.params.id);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

  const { student_id, file_url, text_content } = req.body;
  const sId = student_id || req.user.id;

  const now = new Date();
  const dueDate = new Date(assignment.due_date);
  const is_late = dueDate && now > dueDate;

  const sub = db.insert('submissions', {
    assignment_id: assignment.id,
    student_id: sId,
    submitted_at: now.toISOString(),
    file_url: file_url || null,
    text_content: text_content || null,
    score: null,
    status: is_late ? 'late' : 'submitted',
    is_late,
    version_number: 1
  });

  eventBus.publish('AssignmentSubmitted', 'LMS.Assignment', assignment.id, {
    submission_id: sub.id,
    assignment_id: assignment.id,
    student_id: sId,
    is_late
  });

  res.status(201).json({ success: true, data: sub });
});

// --- Quizzes ---
router.get('/quizzes', (req, res) => {
  const { lms_course_id } = req.query;
  const quizzes = db.find('quizzes', q => {
    if (lms_course_id && q.lms_course_id !== lms_course_id) return false;
    return true;
  });
  res.json({ success: true, data: quizzes });
});

router.get('/quizzes/:id', (req, res) => {
  const quiz = db.findById('quizzes', req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = db.find('quiz_questions', q => q.quiz_id === quiz.id).map(q => ({
    id: q.id,
    question_type: q.question_type,
    question_text: q.question_text,
    options_json: q.options_json,
    points: q.points,
    order_index: q.order_index
  }));

  res.json({
    success: true,
    data: {
      ...quiz,
      questions
    }
  });
});

router.post('/quizzes/:id/submit', authenticate, (req, res) => {
  const quiz = db.findById('quizzes', req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { answers, student_id } = req.body; // array of { question_id, answer }
  const sId = student_id || req.user.id;

  const questions = db.find('quiz_questions', q => q.quiz_id === quiz.id);
  let totalScore = 0;
  let maxPossible = 0;

  for (const q of questions) {
    maxPossible += q.points;
    const studentAns = (answers || []).find(a => a.question_id === q.id);
    if (studentAns && q.correct_answer_json && q.correct_answer_json.answer === studentAns.answer) {
      totalScore += q.points;
    }
  }

  const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
  const attempt = db.insert('quiz_attempts', {
    quiz_id: quiz.id,
    student_id: sId,
    attempt_number: 1,
    score: totalScore,
    max_score: maxPossible,
    percentage: Number(percentage.toFixed(2)),
    status: 'graded',
    submitted_at: new Date().toISOString()
  });

  res.json({
    success: true,
    data: {
      attempt_id: attempt.id,
      score: totalScore,
      max_score: maxPossible,
      percentage: attempt.percentage,
      passed: percentage >= quiz.passing_score
    }
  });
});

// --- Discussion Forums ---
router.get('/courses/:id/forums', (req, res) => {
  const topics = db.find('forum_topics', t => t.lms_course_id === req.params.id).map(top => {
    const creator = db.findById('users', top.created_by);
    return {
      ...top,
      creator_name: creator ? creator.full_name : 'Staff'
    };
  });
  res.json({ success: true, data: topics });
});

router.get('/forum-topics/:id/posts', (req, res) => {
  const posts = db.find('forum_posts', p => p.topic_id === req.params.id && !p.is_deleted).map(post => {
    const author = db.findById('users', post.author_id);
    return {
      ...post,
      author_name: author ? author.full_name : 'Anonymous',
      author_role: author ? author.role : 'member'
    };
  });
  res.json({ success: true, data: posts });
});

router.post('/forum-topics/:id/posts', authenticate, (req, res) => {
  const { content, parent_post_id } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const post = db.insert('forum_posts', {
    topic_id: req.params.id,
    author_id: req.user.id,
    parent_post_id: parent_post_id || null,
    content,
    is_deleted: false
  });

  const topic = db.findById('forum_topics', req.params.id);
  if (topic) {
    db.update('forum_topics', topic.id, {
      post_count: (topic.post_count || 0) + 1,
      last_post_at: new Date().toISOString()
    });
  }

  res.status(201).json({ success: true, data: post });
});

// --- Certificate Verification ---
router.get('/certificates/verify/:code', (req, res) => {
  const cert = db.findOne('certificates', c => c.certificate_number === req.params.code || c.verification_code === req.params.code);
  if (!cert) {
    return res.status(404).json({ success: false, valid: false, message: 'Certificate not found' });
  }

  const student = db.findById('students', cert.student_id);
  const course = db.findById('lms_courses', cert.lms_course_id);

  res.json({
    success: true,
    valid: true,
    data: {
      certificate_number: cert.certificate_number,
      student_name: student ? `${student.first_name} ${student.last_name}` : 'Student',
      course_title: course ? course.title : 'Theology Course',
      issued_at: cert.issued_at,
      institution: "Ethiopia Holy Trinity Theology University"
    }
  });
});

module.exports = router;
