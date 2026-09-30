-- =============================================================================
-- ETHIOPIA HOLY TRINITY THEOLOGY UNIVERSITY (HTTU)
-- University Management System - Master PostgreSQL 14+ Relational Schema
-- Modules: Academic, SIS, LMS, HR, Library, Auth
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 0. AUTHENTICATION & USER MANAGEMENT
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    amharic_name VARCHAR(200),
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'admin', 'president', 'academic_dean', 'department_head',
        'faculty', 'student', 'registrar', 'finance_officer',
        'librarian', 'hr_director'
    )),
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 1. ACADEMIC MANAGEMENT SERVICE
-- =============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    code VARCHAR(10) UNIQUE NOT NULL,
    head_faculty_id UUID,
    description TEXT,
    established_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    code VARCHAR(20) UNIQUE NOT NULL,
    degree_level VARCHAR(50) NOT NULL CHECK (degree_level IN ('Bachelor', 'Master', 'Diploma', 'Certificate')),
    department_id UUID REFERENCES departments(id),
    total_credits_required INTEGER NOT NULL,
    duration_semesters INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'archived')),
    description TEXT,
    program_learning_outcomes JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_amharic VARCHAR(255),
    description TEXT,
    credit_hours DECIMAL(3,1) NOT NULL CHECK (credit_hours > 0 AND credit_hours <= 12),
    lecture_hours INTEGER DEFAULT 0,
    lab_hours INTEGER DEFAULT 0,
    course_type VARCHAR(30) NOT NULL,
    department_id UUID REFERENCES departments(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id UUID REFERENCES courses(id),
    minimum_grade VARCHAR(3) DEFAULT 'D',
    is_corequisite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (course_id, prerequisite_course_id)
);

CREATE TABLE IF NOT EXISTS program_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    semester_number INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    course_category VARCHAR(50) CHECK (course_category IN ('Core', 'Elective', 'Concentration', 'Capstone')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, course_id)
);

CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester_type VARCHAR(20) NOT NULL CHECK (semester_type IN ('Fall', 'Spring', 'Summer')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    add_drop_deadline DATE NOT NULL,
    withdrawal_deadline DATE NOT NULL,
    exam_start DATE,
    exam_end DATE,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_semester_dates CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    room_type VARCHAR(30) CHECK (room_type IN ('Classroom', 'Lab', 'Auditorium', 'Chapel', 'Music Room')),
    has_projector BOOLEAN DEFAULT FALSE,
    has_audio BOOLEAN DEFAULT FALSE,
    has_piano BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(building_name, room_number)
);

CREATE TABLE IF NOT EXISTS course_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE RESTRICT,
    semester_id UUID REFERENCES semesters(id) ON DELETE RESTRICT,
    section_number VARCHAR(10) NOT NULL,
    faculty_id UUID REFERENCES users(id),
    room_id UUID REFERENCES rooms(id),
    max_enrollment INTEGER DEFAULT 30,
    current_enrollment INTEGER DEFAULT 0,
    schedule_pattern VARCHAR(50),
    start_time TIME,
    end_time TIME,
    days_of_week JSONB,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'open', 'closed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, semester_id, section_number)
);

CREATE TABLE IF NOT EXISTS academic_calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('holiday', 'deadline', 'exam', 'ceremony')),
    title VARCHAR(255) NOT NULL,
    title_amharic VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_ethiopian_calendar BOOLEAN DEFAULT FALSE,
    ethiopian_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. STUDENT INFORMATION SYSTEM (SIS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    student_id_number VARCHAR(20) UNIQUE NOT NULL, -- Format: HTTU-YYYY-NNNN
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    amharic_name VARCHAR(200),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    nationality VARCHAR(100) NOT NULL DEFAULT 'Ethiopian',
    phone VARCHAR(30),
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    photo_url TEXT,
    baptism_name VARCHAR(100), -- Specific to Holy Trinity Theology
    church_parish VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'withdrawn', 'graduated', 'dismissed')),
    admission_date DATE NOT NULL,
    expected_graduation DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    program_id UUID NOT NULL REFERENCES programs(id),
    academic_year VARCHAR(9) NOT NULL,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'interview', 'accepted', 'rejected', 'waitlisted')),
    reviewer_id UUID REFERENCES users(id),
    review_date TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    documents_complete BOOLEAN DEFAULT FALSE,
    interview_score DECIMAL(5,2),
    entrance_exam_score DECIMAL(5,2),
    decision VARCHAR(20) CHECK (decision IN ('accepted', 'rejected', 'waitlisted')),
    decision_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (email, program_id, academic_year)
);

CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'transcript', 'recommendation_letter', 'id_document', 'baptism_certificate', 'other'
    )),
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id),
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'dropped', 'completed', 'withdrawn')),
    total_credits INTEGER DEFAULT 0,
    gpa DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, semester_id)
);

CREATE TABLE IF NOT EXISTS course_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    course_offering_id UUID NOT NULL REFERENCES course_offerings(id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'registered'
        CHECK (status IN ('registered', 'dropped', 'completed', 'failed', 'withdrawn')),
    grade VARCHAR(3),
    grade_points DECIMAL(3,2),
    credits INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (enrollment_id, course_offering_id)
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    course_offering_id UUID NOT NULL REFERENCES course_offerings(id),
    enrollment_id UUID REFERENCES enrollments(id),
    letter_grade VARCHAR(3) NOT NULL,
    grade_points DECIMAL(3,2) NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    submitted_by UUID NOT NULL REFERENCES users(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'finalized')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_offering_id)
);

CREATE TABLE IF NOT EXISTS grade_change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
    old_grade VARCHAR(3) NOT NULL,
    new_grade VARCHAR(3) NOT NULL,
    reason TEXT NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('official', 'unofficial', 'interim')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    generated_by UUID REFERENCES users(id),
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    file_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS student_academic_standing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    semester_gpa DECIMAL(3,2),
    cumulative_gpa DECIMAL(3,2),
    credits_attempted INTEGER,
    credits_earned INTEGER,
    standing VARCHAR(30) CHECK (standing IN ('good_standing', 'probation', 'suspension', 'dismissal')),
    is_deans_list BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. E-LEARNING / LMS MODULE
-- =============================================================================
CREATE TABLE IF NOT EXISTS lms_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_offering_id UUID NOT NULL REFERENCES course_offerings(id),
    title VARCHAR(255) NOT NULL,
    title_amharic VARCHAR(255),
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    enrollment_type VARCHAR(20) DEFAULT 'restricted' CHECK (enrollment_type IN ('open', 'restricted')),
    max_students INTEGER,
    passing_grade DECIMAL(5,2) DEFAULT 70.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS lms_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    unlock_date TIMESTAMP WITH TIME ZONE,
    completion_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lms_course_id, order_index)
);

CREATE TABLE IF NOT EXISTS lms_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES lms_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'video', 'audio', 'document', 'scorm')),
    content_url VARCHAR(500),
    content_text TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (module_id, order_index)
);

CREATE TABLE IF NOT EXISTS lms_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id),
    student_id UUID NOT NULL REFERENCES students(id),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    final_grade DECIMAL(5,2),
    UNIQUE (lms_course_id, student_id)
);

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id),
    module_id UUID REFERENCES lms_modules(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_score BIGINT NOT NULL, -- Stored as integer, 100 = 100 points
    due_date TIMESTAMP WITH TIME ZONE,
    late_submission_allowed BOOLEAN DEFAULT FALSE,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 10.00,
    submission_type VARCHAR(20) DEFAULT 'file' CHECK (submission_type IN ('file', 'text', 'both')),
    rubric_json JSONB,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    grade_weight DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(500),
    text_content TEXT,
    score BIGINT,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned', 'late')),
    plagiarism_score DECIMAL(5,2),
    is_late BOOLEAN DEFAULT FALSE,
    version_number INTEGER DEFAULT 1,
    UNIQUE (assignment_id, student_id, version_number)
);

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id),
    module_id UUID REFERENCES lms_modules(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_answers_after VARCHAR(20) DEFAULT 'submission' CHECK (show_answers_after IN ('never', 'submission', 'due_date', 'manual')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    grade_weight DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    course_id UUID REFERENCES courses(id),
    topic VARCHAR(100),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_bank_id UUID REFERENCES question_banks(id),
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short_answer', 'essay', 'matching', 'fill_blank')),
    question_text TEXT NOT NULL,
    options_json JSONB,
    correct_answer_json JSONB,
    points BIGINT DEFAULT 100,
    explanation TEXT,
    order_index INTEGER NOT NULL,
    UNIQUE (quiz_id, order_index)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id),
    student_id UUID NOT NULL REFERENCES students(id),
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    score BIGINT,
    max_score BIGINT,
    percentage DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    time_spent_seconds INTEGER,
    UNIQUE(quiz_id, student_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_announcement BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    post_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    parent_post_id UUID REFERENCES forum_posts(id),
    content TEXT NOT NULL,
    attachments_json JSONB,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    lesson_id UUID NOT NULL REFERENCES lms_lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER,
    UNIQUE(student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    lms_course_id UUID NOT NULL REFERENCES lms_courses(id),
    certificate_number VARCHAR(30) UNIQUE NOT NULL, -- Format: CERT-LMS-YYYY-NNNNNN
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_code UUID DEFAULT gen_random_uuid(),
    file_url VARCHAR(500) NOT NULL,
    final_grade DECIMAL(5,2),
    UNIQUE(student_id, lms_course_id)
);

-- =============================================================================
-- 4. HUMAN RESOURCES (HR) MODULE
-- =============================================================================
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_amharic VARCHAR(255),
    department_id UUID REFERENCES departments(id),
    grade_level INTEGER,
    min_salary BIGINT NOT NULL, -- Stored in Santim (1 ETB = 100 santim)
    max_salary BIGINT NOT NULL, -- Stored in Santim
    description TEXT,
    is_faculty BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (max_salary >= min_salary)
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    employee_id_number VARCHAR(20) UNIQUE NOT NULL, -- Format: EMP-YYYY-NNNNNN
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    amharic_name VARCHAR(200),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(50) DEFAULT 'Ethiopian',
    phone VARCHAR(30),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    photo_url VARCHAR(500),
    marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    ordination_status VARCHAR(30) CHECK (ordination_status IN ('not_ordained', 'deacon', 'priest', 'bishop')),
    ordination_date DATE,
    hire_date DATE NOT NULL,
    employment_type VARCHAR(30) NOT NULL CHECK (employment_type IN ('permanent', 'contract', 'part_time', 'visiting_lecturer')),
    department_id UUID REFERENCES departments(id),
    position_id UUID REFERENCES positions(id),
    reports_to UUID REFERENCES employees(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'suspended', 'terminated', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    contract_type VARCHAR(30) NOT NULL CHECK (contract_type IN ('permanent', 'contract', 'part_time', 'visiting_lecturer')),
    start_date DATE NOT NULL,
    end_date DATE,
    base_salary BIGINT NOT NULL, -- Stored in Santim
    terms TEXT,
    signed_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expiring', 'expired', 'renewed', 'terminated')),
    document_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date IS NULL OR end_date > start_date)
);

CREATE TABLE IF NOT EXISTS qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    graduation_year INTEGER NOT NULL,
    document_url VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position_id UUID REFERENCES positions(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    department_id UUID REFERENCES departments(id),
    posted_date DATE DEFAULT CURRENT_DATE,
    closing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'filled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (closing_date > posted_date)
);

CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    name_amharic VARCHAR(100),
    max_days_per_year INTEGER NOT NULL,
    is_paid BOOLEAN DEFAULT TRUE,
    requires_documentation BOOLEAN DEFAULT FALSE,
    applicable_to VARCHAR(50) DEFAULT 'all' CHECK (applicable_to IN ('all', 'faculty', 'administrative', 'clergy_faculty')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (max_days_per_year > 0)
);

CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    fiscal_year VARCHAR(10) NOT NULL,
    total_days INTEGER NOT NULL,
    used_days INTEGER DEFAULT 0,
    remaining_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, leave_type_id, fiscal_year)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL CHECK (total_days > 0),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by UUID REFERENCES employees(id),
    approved_at TIMESTAMP,
    substitute_employee_id UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
    source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'biometric')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS faculty_workload (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    semester_id UUID NOT NULL REFERENCES semesters(id),
    teaching_hours DECIMAL(4,1) NOT NULL DEFAULT 0,
    research_hours DECIMAL(4,1) DEFAULT 0,
    committee_hours DECIMAL(4,1) DEFAULT 0,
    advising_students_count INTEGER DEFAULT 0,
    total_load DECIMAL(5,1),
    overload_hours DECIMAL(4,1),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, semester_id)
);

-- =============================================================================
-- 5. LIBRARY MANAGEMENT SYSTEM
-- =============================================================================
CREATE TABLE IF NOT EXISTS catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_amharic VARCHAR(500),
    title_geez VARCHAR(500),
    isbn VARCHAR(20),
    issn VARCHAR(20),
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('book', 'journal', 'thesis', 'manuscript', 'audio', 'digital')),
    authors_json JSONB,
    publisher VARCHAR(255),
    publication_year INTEGER,
    edition VARCHAR(50),
    language VARCHAR(50),
    subject_classifications_json JSONB,
    description TEXT,
    cover_image_url VARCHAR(500),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    location_code VARCHAR(50),
    call_number VARCHAR(100),
    is_digital BOOLEAN DEFAULT FALSE,
    digital_url VARCHAR(500),
    is_rare BOOLEAN DEFAULT FALSE,
    preservation_status VARCHAR(50),
    acquisition_date DATE,
    acquisition_method VARCHAR(50) CHECK (acquisition_method IN ('purchase', 'donation', 'transfer')),
    donor_name VARCHAR(255),
    price BIGINT, -- Santim
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'lost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog_copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
    copy_number INTEGER NOT NULL,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    condition VARCHAR(20) CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged')),
    location VARCHAR(50) CHECK (location IN ('main_library', 'reading_room', 'reserve', 'special_collections', 'digital')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'checked_out', 'on_hold', 'in_repair', 'lost', 'withdrawn')),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_amharic VARCHAR(200),
    bio TEXT,
    nationality VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_amharic VARCHAR(200),
    parent_subject_id UUID REFERENCES subjects(id),
    classification_system VARCHAR(30) CHECK (classification_system IN ('loc', 'custom_theology'))
);

CREATE TABLE IF NOT EXISTS library_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    member_type VARCHAR(20) CHECK (member_type IN ('student', 'faculty', 'staff', 'external')),
    student_id UUID REFERENCES students(id),
    employee_id UUID REFERENCES employees(id),
    max_books_allowed INTEGER NOT NULL,
    max_loan_days INTEGER NOT NULL,
    membership_start DATE NOT NULL DEFAULT CURRENT_DATE,
    membership_end DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired'))
);

CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    copy_id UUID NOT NULL REFERENCES catalog_copies(id),
    member_id UUID NOT NULL REFERENCES library_members(id),
    checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    renewed_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
    checked_out_by UUID REFERENCES users(id),
    returned_to UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_item_id UUID NOT NULL REFERENCES catalog_items(id),
    member_id UUID NOT NULL REFERENCES library_members(id),
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled', 'expired')),
    notification_sent BOOLEAN DEFAULT FALSE,
    expiry_date DATE,
    queue_position INTEGER
);

CREATE TABLE IF NOT EXISTS fines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES loans(id),
    member_id UUID NOT NULL REFERENCES library_members(id),
    fine_type VARCHAR(20) CHECK (fine_type IN ('overdue', 'lost', 'damaged')),
    amount BIGINT NOT NULL, -- Stored in Santim
    paid_amount BIGINT DEFAULT 0,
    balance BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived', 'partial')),
    waived_by UUID REFERENCES users(id),
    waived_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS digital_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) CHECK (file_type IN ('pdf', 'epub', 'iiif_manifest', 'audio', 'video')),
    file_size BIGINT,
    access_type VARCHAR(20) CHECK (access_type IN ('open', 'restricted', 'licensed')),
    license_start DATE,
    license_end DATE,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
);
