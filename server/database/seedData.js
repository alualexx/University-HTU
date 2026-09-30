const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync('password123', salt);
const adminPasswordHash = bcrypt.hashSync('admin123', salt);

const seedData = {
  users: [
    {
      id: "u-admin-1",
      username: "admin",
      email: "admin@httu.edu.et",
      password_hash: adminPasswordHash,
      full_name: "System Administrator",
      amharic_name: "የሲስተም አስተዳዳሪ",
      role: "admin",
      phone: "+251911000001",
      is_active: true
    },
    {
      id: "u-pres-1",
      username: "president",
      email: "president@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Archbishop Merkorios Tilahun",
      amharic_name: "ብፁዕ አቡነ መርቆሬዎስ ጥላሁን",
      role: "president",
      phone: "+251911000002",
      is_active: true
    },
    {
      id: "u-dean-1",
      username: "dean",
      email: "dean@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Rev. Dr. Abeba Zerihun",
      amharic_name: "መልአከ ብርሃን ዶ/ር አበበ ዘሪሁን",
      role: "dean",
      phone: "+251911000003",
      is_active: true
    },
    {
      id: "u-fac-1",
      username: "fr.yohannes",
      email: "fr.yohannes@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Dr. Sofia Assefa",
      amharic_name: "ዶ/ር ሶፊያ አሰፋ",
      role: "dean",
      phone: "+251911000004",
      is_active: true
    },
    {
      id: "u-fac-2",
      username: "dr.abebe",
      email: "dr.abebe@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Dr. Alemeyahu Worku",
      amharic_name: "ዶ/ር ዓለማየሁ ወርቁ",
      role: "faculty",
      phone: "+251911000005",
      is_active: true
    },
    {
      id: "u-fac-3",
      username: "dr.alemeyahu",
      email: "dr.alemeyahu@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Dr. Alemeyahu Worku",
      amharic_name: "ዶ/ር ዓለማየሁ ወርቁ",
      role: "faculty",
      phone: "+251911000005",
      is_active: true
    },
    {
      id: "u-stu-1",
      username: "john.doe",
      email: "john.doe@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Daniel Gebremariam",
      amharic_name: "ዳንኤል ገብረማርያም",
      role: "student",
      phone: "+251914552118",
      is_active: true
    },
    {
      id: "u-stu-2",
      username: "daniel.g",
      email: "daniel.g@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Daniel Gebremariam",
      amharic_name: "ዳንኤል ገብረማርያም",
      role: "student",
      phone: "+251914552118",
      is_active: true
    },
    {
      id: "u-reg-1",
      username: "registrar",
      email: "registrar@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Meskerem Abebe",
      amharic_name: "መስከረም አበበ",
      role: "registrar",
      phone: "+251115510142",
      is_active: true
    },
    {
      id: "u-lib-1",
      username: "librarian",
      email: "librarian@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Tsehay Girma",
      amharic_name: "ፀሐይ ግርማ",
      role: "librarian",
      phone: "+251911000007",
      is_active: true
    },
    {
      id: "u-hr-1",
      username: "hr",
      email: "hr@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Hanna Bekele",
      amharic_name: "ሐና በቀለ",
      role: "hr",
      phone: "+251911234567",
      is_active: true
    },
    {
      id: "u-fin-1",
      username: "finance",
      email: "finance@httu.edu.et",
      password_hash: passwordHash,
      full_name: "Mahlet Yohannes",
      amharic_name: "ማኅሌት ዮሐንስ",
      role: "finance",
      phone: "+251911000009",
      is_active: true
    }
  ],

  departments: [
    {
      id: "dept-bib",
      code: "BIB",
      name: "Biblical Studies",
      name_amharic: "የመጽሐፍ ቅዱስ ጥናት",
      description: "Department specializing in Old & New Testament exegesis, hermeneutics, and Septuagintal traditions.",
      head_faculty_id: "u-fac-2",
      status: "active"
    },
    {
      id: "dept-theo",
      code: "THEO",
      name: "Systematic Theology",
      name_amharic: "ስልታዊ ቴዎሎጂ",
      description: "Explores Orthodox Christian dogma, Christology, Pneumatology, and Trinitarian theology.",
      head_faculty_id: "u-fac-1",
      status: "active"
    },
    {
      id: "dept-chis",
      code: "CHIS",
      name: "Church History",
      name_amharic: "የቤተክርስቲያን ታሪክ",
      description: "History of the Universal Church, Ecumenical Councils, and Ethiopian Orthodox Church patrimony.",
      head_faculty_id: "u-dean-1",
      status: "active"
    },
    {
      id: "dept-past",
      code: "PAST",
      name: "Pastoral Theology",
      name_amharic: "የአርብቶ አደርነት ቴዎሎጂ",
      description: "Pastoral counseling, spiritual leadership, and parish ministry administration.",
      head_faculty_id: "u-pres-1",
      status: "active"
    },
    {
      id: "dept-lit",
      code: "LIT",
      name: "Liturgical Studies",
      name_amharic: "የሥርዓተ አምልኮ ጥናት",
      description: "Historical theology of Christian worship, Eucharistic Anaphoras, and sacramentology.",
      head_faculty_id: "u-fac-1",
      status: "active"
    },
    {
      id: "dept-chm",
      code: "CHM",
      name: "Church Music",
      name_amharic: "የቤተክርስቲያን ዜማና ሙዚቃ",
      description: "St. Yared sacred hymnody (Ge'ez, Ezel, Araray), Diggua, Tsome Diggua, and liturgical instruments.",
      head_faculty_id: "u-lib-1",
      status: "active"
    },
    {
      id: "dept-gez",
      code: "GEZ",
      name: "Ge'ez & Classical Languages",
      name_amharic: "ግዕዝና ጥንታዊ ቋንቋዎች",
      description: "Grammar, syntax, paleography, and translation of Classical Ethiopic, Greek, and Syriac texts.",
      head_faculty_id: "u-fac-2",
      status: "active"
    }
  ],

  programs: [
    {
      id: "prog-bth",
      name: "Bachelor of Theology",
      name_amharic: "የቴዎሎጂ ባችለር ዲግሪ",
      code: "BTH",
      degree_level: "Bachelor",
      department_id: "dept-theo",
      total_credits_required: 126,
      duration_semesters: 8,
      status: "active",
      description: "Comprehensive 4-year undergraduate theological degree grounding students in Scripture, Patristics, and Ministry."
    },
    {
      id: "prog-mdiv",
      name: "Master of Divinity",
      name_amharic: "የዲቪኒቲ ማስተርስ ዲግሪ",
      code: "MDIV",
      degree_level: "Master",
      department_id: "dept-theo",
      total_credits_required: 72,
      duration_semesters: 4,
      status: "active",
      description: "Advanced theological education for ordained clergy, scholars, and institutional church leaders."
    },
    {
      id: "prog-dcm",
      name: "Diploma in Church Music",
      name_amharic: "የቤተክርስቲያን ዜማ ዲፕሎማ",
      code: "DCM",
      degree_level: "Diploma",
      department_id: "dept-chm",
      total_credits_required: 64,
      duration_semesters: 4,
      status: "active",
      description: "2-year professional diploma mastering the complete hymns, chants, and notation of St. Yared."
    }
  ],

  courses: [
    {
      id: "c-gez-101",
      course_code: "GEZ-101",
      title: "Introduction to Ge'ez Language",
      title_amharic: "የግዕዝ ቋንቋ መግቢያ",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-gez",
      status: "active",
      description: "Phonology, Fidel syllabary, morphology, and basic vocabulary of Classical Ethiopic."
    },
    {
      id: "c-gez-201",
      course_code: "GEZ-201",
      title: "Intermediate Ge'ez & Manuscript Reading",
      title_amharic: "ከፍተኛ የግዕዝ ቋንቋና የብራና ንባብ",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-gez",
      status: "active",
      description: "Syntax, verbal systems, and direct paleographic reading of ancient parchment codices."
    },
    {
      id: "c-theo-101",
      course_code: "THEO-101",
      title: "Introduction to Orthodox Theology",
      title_amharic: "የኦርቶዶክስ ቴዎሎጂ መግቢያ",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-theo",
      status: "active",
      description: "Fundamentals of Christian doctrine, divine revelation, Holy Tradition, and the Nicene-Constantinopolitan Creed."
    },
    {
      id: "c-bib-101",
      course_code: "BIB-101",
      title: "Old Testament Studies & Septuagint",
      title_amharic: "የብሉይ ኪዳን ጥናትና የሰብአሊቃናት ትርጉም",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-bib",
      status: "active",
      description: "Historical, literary, and theological analysis of the 81-book Ethiopian Orthodox Biblical canon."
    },
    {
      id: "c-chis-101",
      course_code: "CHIS-101",
      title: "Ethiopian Orthodox Church History",
      title_amharic: "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታሪክ",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-chis",
      status: "active",
      description: "From biblical times through King Ezana, St. Frumentius, the Nine Saints, and medieval theological renaissance."
    },
    {
      id: "c-lit-201",
      course_code: "LIT-201",
      title: "Liturgical Studies & Eucharistic Anaphoras",
      title_amharic: "የሥርዓተ ቅዳሴ ጥናትና ዐሥራ አራቱ አናፎራዎች",
      credit_hours: 3.0,
      lecture_hours: 3,
      lab_hours: 0,
      course_type: "Lecture",
      department_id: "dept-lit",
      status: "active",
      description: "Theological structure, biblical foundations, and mystical significance of the 14 Ethiopian Anaphoras."
    },
    {
      id: "c-chm-101",
      course_code: "CHM-101",
      title: "St. Yared Hymnology I",
      title_amharic: "የቅዱስ ያሬድ ዜማ ጥናት ፩",
      credit_hours: 3.0,
      lecture_hours: 2,
      lab_hours: 2,
      course_type: "Practicum",
      department_id: "dept-chm",
      status: "active",
      description: "Practice and theory of the three melodic modalities (Ge'ez, Ezel, Araray) and Me'eraf liturgical chant."
    }
  ],

  course_prerequisites: [
    {
      id: "prereq-1",
      course_id: "c-gez-201",
      prerequisite_course_id: "c-gez-101",
      minimum_grade: "C-",
      is_corequisite: false
    }
  ],

  semesters: [
    {
      id: "sem-fall-2026",
      name: "Fall 2026",
      academic_year: "2026-2027",
      semester_type: "Fall",
      start_date: "2026-09-01",
      end_date: "2026-12-25",
      registration_start: "2026-08-15",
      registration_end: "2026-09-10",
      add_drop_deadline: "2026-09-25",
      withdrawal_deadline: "2026-11-15",
      exam_start: "2026-12-15",
      exam_end: "2026-12-23",
      status: "active"
    },
    {
      id: "sem-spring-2027",
      name: "Spring 2027",
      academic_year: "2026-2027",
      semester_type: "Spring",
      start_date: "2027-02-01",
      end_date: "2027-06-15",
      registration_start: "2027-01-10",
      registration_end: "2027-01-30",
      add_drop_deadline: "2027-02-15",
      withdrawal_deadline: "2027-04-15",
      exam_start: "2027-06-01",
      exam_end: "2027-06-10",
      status: "planning"
    }
  ],

  rooms: [
    {
      id: "r-chapel",
      building_name: "Holy Trinity Main Complex",
      room_number: "Chapel Hall",
      capacity: 150,
      room_type: "Chapel",
      has_projector: true,
      has_audio: true,
      has_piano: true,
      status: "active"
    },
    {
      id: "r-yared",
      building_name: "Sacred Music Conservatory",
      room_number: "Yared-101",
      capacity: 40,
      room_type: "Music Room",
      has_projector: false,
      has_audio: true,
      has_piano: true,
      status: "active"
    },
    {
      id: "r-hall-1",
      building_name: "Academic Center",
      room_number: "Hall 201",
      capacity: 60,
      room_type: "Classroom",
      has_projector: true,
      has_audio: true,
      has_piano: false,
      status: "active"
    }
  ],

  course_offerings: [
    {
      id: "off-gez-101",
      course_id: "c-gez-101",
      semester_id: "sem-fall-2026",
      section_number: "A",
      faculty_id: "u-fac-2",
      room_id: "r-hall-1",
      max_enrollment: 40,
      current_enrollment: 25,
      schedule_pattern: "MWF",
      start_time: "09:00:00",
      end_time: "10:15:00",
      days_of_week: [1, 3, 5],
      status: "open"
    },
    {
      id: "off-theo-101",
      course_id: "c-theo-101",
      semester_id: "sem-fall-2026",
      section_number: "A",
      faculty_id: "u-fac-1",
      room_id: "r-chapel",
      max_enrollment: 50,
      current_enrollment: 42,
      schedule_pattern: "TTh",
      start_time: "10:30:00",
      end_time: "12:00:00",
      days_of_week: [2, 4],
      status: "open"
    },
    {
      id: "off-chm-101",
      course_id: "c-chm-101",
      semester_id: "sem-fall-2026",
      section_number: "01",
      faculty_id: "u-lib-1",
      room_id: "r-yared",
      max_enrollment: 30,
      current_enrollment: 18,
      schedule_pattern: "MW",
      start_time: "14:00:00",
      end_time: "15:30:00",
      days_of_week: [1, 3],
      status: "open"
    }
  ],

  academic_calendar_events: [
    {
      id: "cal-1",
      semester_id: "sem-fall-2026",
      event_type: "holiday",
      title: "Enkutatash (Ethiopian New Year)",
      title_amharic: "እንቁጣጣሽ",
      start_date: "2026-09-11",
      end_date: "2026-09-11",
      description: "First day of the Ethiopian year (Meskerem 1, 2019 E.C.)",
      is_ethiopian_calendar: true,
      ethiopian_date: "Meskerem 1, 2019"
    },
    {
      id: "cal-2",
      semester_id: "sem-fall-2026",
      event_type: "holiday",
      title: "Meskel (Finding of the True Cross)",
      title_amharic: "መስቀል",
      start_date: "2026-09-27",
      end_date: "2026-09-27",
      description: "Commemoration of Empress Helena's discovery of the Cross (Meskerem 17, 2019 E.C.)",
      is_ethiopian_calendar: true,
      ethiopian_date: "Meskerem 17, 2019"
    },
    {
      id: "cal-3",
      semester_id: "sem-fall-2026",
      event_type: "holiday",
      title: "Gena (Ethiopian Christmas)",
      title_amharic: "ገና (ልደት)",
      start_date: "2027-01-07",
      end_date: "2027-01-07",
      description: "Celebration of the Nativity of Jesus Christ (Tahsas 29, 2019 E.C.)",
      is_ethiopian_calendar: true,
      ethiopian_date: "Tahsas 29, 2019"
    },
    {
      id: "cal-4",
      semester_id: "sem-fall-2026",
      event_type: "deadline",
      title: "Add/Drop Deadline",
      title_amharic: "የትምህርት ምዝገባ ማስተካከያ የመጨረሻ ቀን",
      start_date: "2026-09-25",
      end_date: "2026-09-25",
      description: "Final deadline for adding or dropping Fall 2026 courses without academic penalty.",
      is_ethiopian_calendar: false,
      ethiopian_date: "Meskerem 15, 2019"
    }
  ],

  students: [
    {
      id: "s-1",
      user_id: "u-stu-1",
      student_id_number: "HTTU-2026-0001",
      first_name: "John",
      last_name: "Doe",
      amharic_name: "ዮሐንስ ተስፋ",
      date_of_birth: "2005-03-15",
      gender: "Male",
      nationality: "Ethiopian",
      phone: "+251911234567",
      email: "john.doe@httu.edu.et",
      address: "Bole Subcity, House No. 123",
      city: "Addis Ababa",
      region: "Addis Ababa",
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      baptism_name: "Habte Maryam",
      church_parish: "Holy Trinity Cathedral",
      status: "active",
      admission_date: "2026-09-01",
      expected_graduation: "2030-07-15",
      program_id: "prog-bth"
    },
    {
      id: "s-2",
      user_id: "u-stu-2",
      student_id_number: "HTTU-2026-0002",
      first_name: "Marta",
      last_name: "Hailu",
      amharic_name: "ማርታ ኃይሉ",
      date_of_birth: "2004-11-20",
      gender: "Female",
      nationality: "Ethiopian",
      phone: "+251911234568",
      email: "marta.hailu@httu.edu.et",
      address: "Arada Subcity, House 45",
      city: "Addis Ababa",
      region: "Addis Ababa",
      photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      baptism_name: "Walatta Petros",
      church_parish: "Bole Medhanealem",
      status: "active",
      admission_date: "2026-09-01",
      expected_graduation: "2030-07-15",
      program_id: "prog-bth"
    }
  ],

  applications: [
    {
      id: "app-1",
      applicant_name: "Tewodros Kassahun",
      email: "tewodros.k@example.com",
      phone: "+251912445566",
      program_id: "prog-bth",
      academic_year: "2026-2027",
      application_date: "2026-08-10T10:00:00Z",
      status: "under_review",
      reviewer_id: "u-dean-1",
      documents_complete: true,
      interview_score: 88.5,
      entrance_exam_score: 82.0,
      decision: null,
      decision_date: null
    }
  ],

  enrollments: [
    {
      id: "enr-1",
      student_id: "s-1",
      semester_id: "sem-fall-2026",
      enrollment_date: "2026-08-25",
      status: "active",
      total_credits: 9,
      gpa: 3.67
    },
    {
      id: "enr-2",
      student_id: "s-2",
      semester_id: "sem-fall-2026",
      enrollment_date: "2026-08-25",
      status: "active",
      total_credits: 9,
      gpa: 3.85
    }
  ],

  course_registrations: [
    {
      id: "reg-1",
      enrollment_id: "enr-1",
      course_offering_id: "off-gez-101",
      registration_date: "2026-08-26T09:00:00Z",
      status: "registered",
      grade: null,
      grade_points: null,
      credits: 3
    },
    {
      id: "reg-2",
      enrollment_id: "enr-1",
      course_offering_id: "off-theo-101",
      registration_date: "2026-08-26T09:05:00Z",
      status: "registered",
      grade: null,
      grade_points: null,
      credits: 3
    },
    {
      id: "reg-3",
      enrollment_id: "enr-1",
      course_offering_id: "off-chm-101",
      registration_date: "2026-08-26T09:10:00Z",
      status: "registered",
      grade: null,
      grade_points: null,
      credits: 3
    }
  ],

  positions: [
    {
      id: "pos-prof",
      title: "Assistant Professor",
      title_amharic: "ረዳት ፕሮፌሰር",
      department_id: "dept-theo",
      grade_level: 5,
      min_salary: 3500000, // 35,000 ETB in Santim
      max_salary: 4500000, // 45,000 ETB in Santim
      is_faculty: true,
      status: "active"
    },
    {
      id: "pos-lect",
      title: "Lecturer of Ge'ez & Liturgy",
      title_amharic: "የግዕዝና ሥርዓተ አምልኮ ሌክቸረር",
      department_id: "dept-gez",
      grade_level: 4,
      min_salary: 2800000, // 28,000 ETB
      max_salary: 3600000, // 36,000 ETB
      is_faculty: true,
      status: "active"
    }
  ],

  employees: [
    {
      id: "emp-1",
      user_id: "u-fac-1",
      employee_id_number: "EMP-2024-000045",
      first_name: "Yohannes",
      last_name: "Tekle",
      amharic_name: "መልአከ ሰላም ቀሲስ ዮሐንስ ተክሌ",
      date_of_birth: "1978-04-12",
      gender: "male",
      nationality: "Ethiopian",
      phone: "+251911000004",
      email: "fr.yohannes@httu.edu.et",
      address: "Yeka Subcity, Addis Ababa",
      city: "Addis Ababa",
      region: "Addis Ababa",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      marital_status: "married",
      ordination_status: "priest",
      ordination_date: "2008-06-15",
      hire_date: "2024-09-01",
      employment_type: "permanent",
      department_id: "dept-theo",
      position_id: "pos-prof",
      reports_to: null,
      status: "active"
    },
    {
      id: "emp-2",
      user_id: "u-fac-2",
      employee_id_number: "EMP-2026-000123",
      first_name: "Abebe",
      last_name: "Kebede",
      amharic_name: "ዶ/ር አበበ ከበደ",
      date_of_birth: "1985-03-15",
      gender: "male",
      nationality: "Ethiopian",
      phone: "+251911234567",
      email: "dr.abebe@httu.edu.et",
      address: "Bole Subcity, Addis Ababa",
      city: "Addis Ababa",
      region: "Addis Ababa",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      marital_status: "married",
      ordination_status: "priest",
      ordination_date: "2010-06-15",
      hire_date: "2026-09-01",
      employment_type: "permanent",
      department_id: "dept-bib",
      position_id: "pos-prof",
      reports_to: "emp-1",
      status: "active"
    }
  ],

  contracts: [
    {
      id: "cont-1",
      employee_id: "emp-2",
      contract_type: "permanent",
      start_date: "2026-09-01",
      end_date: null,
      base_salary: 3500000, // 35,000 ETB
      terms: "Standard permanent academic faculty contract. Subject to 45-day probation.",
      signed_date: "2026-08-25",
      status: "active"
    }
  ],

  leave_types: [
    {
      id: "lt-annual",
      name: "Annual Leave",
      name_amharic: "ዓመታዊ ፈቃድ",
      max_days_per_year: 20,
      is_paid: true,
      requires_documentation: false,
      applicable_to: "all"
    },
    {
      id: "lt-sick",
      name: "Sick Leave",
      name_amharic: "የሕመም ፈቃድ",
      max_days_per_year: 30,
      is_paid: true,
      requires_documentation: true,
      applicable_to: "all"
    },
    {
      id: "lt-mat",
      name: "Maternity Leave",
      name_amharic: "የወሊድ ፈቃድ",
      max_days_per_year: 120,
      is_paid: true,
      requires_documentation: true,
      applicable_to: "all"
    },
    {
      id: "lt-church",
      name: "Church Service Leave",
      name_amharic: "የቤተክርስቲያን አገልግሎት ፈቃድ",
      max_days_per_year: 30,
      is_paid: true,
      requires_documentation: false,
      applicable_to: "clergy_faculty"
    }
  ],

  leave_balances: [
    {
      id: "lb-1",
      employee_id: "emp-2",
      leave_type_id: "lt-annual",
      fiscal_year: "2026-2027",
      total_days: 20,
      used_days: 5,
      remaining_days: 15
    },
    {
      id: "lb-2",
      employee_id: "emp-2",
      leave_type_id: "lt-church",
      fiscal_year: "2026-2027",
      total_days: 30,
      used_days: 2,
      remaining_days: 28
    }
  ],

  leave_requests: [],

  catalog_items: [
    {
      id: "cat-1",
      title: "The Book of Enoch (Metsehafe Henok)",
      title_amharic: "መጽሐፈ ሄኖክ",
      title_geez: "መጽሐፈ ሄኖክ ነቢይ",
      isbn: "978-0199263400",
      issn: null,
      item_type: "manuscript",
      authors_json: [{ name: "Enoch the Patriarch", role: "author" }],
      publisher: "Parchment Manuscript Collection",
      publication_year: 1485,
      edition: "15th Century Ge'ez Codex",
      language: "Ge'ez",
      subject_classifications_json: ["Theology", "Apocrypha", "Ge'ez Literature"],
      description: "Rare theological manuscript preserved in classical Ge'ez script containing prophetic visions, calendar treatises, and angelic hierarchies.",
      cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=350",
      total_copies: 1,
      available_copies: 1,
      location_code: "SPEC-MS-001",
      call_number: "MS-ETH-001",
      is_digital: true,
      digital_url: "https://storage.httu.edu.et/manuscripts/enoch-15c.pdf",
      is_rare: true,
      preservation_status: "Excellent (Conserved under nitrogen archive)",
      acquisition_method: "donation",
      donor_name: "His Holiness Patriarchate Library",
      price: 50000000, // Priceless / In Santim
      status: "active"
    },
    {
      id: "cat-2",
      title: "Diggua of Saint Yared (The Hymnary of Sacred Chant)",
      title_amharic: "ድጓ ዘቅዱስ ያሬድ",
      title_geez: "መጽሐፈ ድጓ",
      isbn: "978-9994401234",
      issn: null,
      item_type: "book",
      authors_json: [{ name: "Saint Yared", role: "composer" }],
      publisher: "Berhanena Selam Printing Press",
      publication_year: 2018,
      edition: "Standard Ecclesiastical Edition",
      language: "Ge'ez and Amharic",
      subject_classifications_json: ["Liturgics", "Hymnology", "Church Music"],
      description: "Complete liturgical hymns of the Ethiopian Church categorized into the seasons of Yohannes, Astemhero, Fasika, and Kiremt.",
      cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=350",
      total_copies: 8,
      available_copies: 6,
      location_code: "MAIN-LIT-04",
      call_number: "LIT-YAR-002",
      is_digital: false,
      digital_url: null,
      is_rare: false,
      preservation_status: "Good",
      acquisition_method: "purchase",
      donor_name: null,
      price: 120000, // 1,200 ETB
      status: "active"
    }
  ],

  catalog_copies: [
    {
      id: "copy-1",
      catalog_item_id: "cat-1",
      copy_number: 1,
      barcode: "HTTU-MS-0001",
      condition: "fair",
      location: "special_collections",
      status: "available",
      notes: "Strictly non-circulating. Requires supervised reading room access."
    },
    {
      id: "copy-2",
      catalog_item_id: "cat-2",
      copy_number: 1,
      barcode: "HTTU-BK-2001",
      condition: "new",
      location: "main_library",
      status: "available",
      notes: "Standard circulating loan copy."
    }
  ],

  library_members: [
    {
      id: "lib-mem-1",
      user_id: "u-stu-1",
      member_type: "student",
      student_id: "s-1",
      employee_id: null,
      max_books_allowed: 5,
      max_loan_days: 14,
      membership_start: "2026-09-01",
      membership_end: "2030-07-15",
      status: "active"
    },
    {
      id: "lib-mem-2",
      user_id: "u-fac-2",
      member_type: "faculty",
      student_id: null,
      employee_id: "emp-2",
      max_books_allowed: 10,
      max_loan_days: 30,
      membership_start: "2026-09-01",
      membership_end: null,
      status: "active"
    }
  ],

  loans: [],
  reservations: [],
  fines: [],

  lms_courses: [
    {
      id: "lms-c-1",
      course_offering_id: "off-theo-101",
      title: "Introduction to Orthodox Theology",
      title_amharic: "የኦርቶዶክስ ቴዎሎጂ መግቢያ",
      description: "Comprehensive foundational study of Ethiopian Orthodox theology, Christology, and Sacraments.",
      instructor_id: "u-fac-1",
      status: "published",
      enrollment_type: "restricted",
      max_students: 50,
      passing_grade: 70.00
    },
    {
      id: "lms-c-2",
      course_offering_id: "off-gez-101",
      title: "Introduction to Ge'ez Language",
      title_amharic: "የግዕዝ ቋንቋ መግቢያ",
      description: "Interactive online grammar and vocalization of Classical Ethiopic texts.",
      instructor_id: "u-fac-2",
      status: "published",
      enrollment_type: "restricted",
      max_students: 40,
      passing_grade: 70.00
    }
  ],

  lms_modules: [
    {
      id: "mod-1",
      lms_course_id: "lms-c-1",
      title: "Module 1: Foundations of Tewahedo Faith",
      description: "Overview of Apostolic traditions and Nicene orthodoxy.",
      order_index: 1,
      is_published: true,
      unlock_date: "2026-09-01T00:00:00Z",
      completion_required: true
    },
    {
      id: "mod-2",
      lms_course_id: "lms-c-1",
      title: "Module 2: The Mystery of the Incarnation (Negere Sellassie)",
      description: "Theological treatise on the Unity of the Nature of the Word Incarnate.",
      order_index: 2,
      is_published: true,
      unlock_date: "2026-09-15T00:00:00Z",
      completion_required: true
    }
  ],

  lms_lessons: [
    {
      id: "les-1",
      module_id: "mod-1",
      title: "Lesson 1: Introduction to Divine Revelation & Tradition",
      content_type: "text",
      content_url: null,
      content_text: "<p>The Holy Church recognizes Holy Scripture and Holy Tradition as the authentic twin expressions of divine revelation...</p>",
      order_index: 1,
      duration_minutes: 45,
      is_published: true,
      is_mandatory: true
    },
    {
      id: "les-2",
      module_id: "mod-1",
      title: "Lesson 2: Ge'ez Liturgical Chant Stream - Yaredic Hymn",
      content_type: "audio",
      content_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      content_text: "<p>Listen closely to the Ge'ez vocalization and modal transitions between Ge'ez and Araray chant structures.</p>",
      order_index: 2,
      duration_minutes: 30,
      is_published: true,
      is_mandatory: true
    }
  ],

  assignments: [
    {
      id: "asg-1",
      lms_course_id: "lms-c-1",
      module_id: "mod-1",
      title: "Analysis of Patristic Exegesis",
      description: "Write a 1500-word analysis examining Saint Athanasius's defense of the Divinity of Christ.",
      max_score: 100,
      due_date: "2026-10-15T23:59:59Z",
      late_submission_allowed: true,
      late_penalty_percentage: 10.00,
      submission_type: "both",
      status: "published",
      grade_weight: 15.00
    }
  ],

  submissions: [],

  quizzes: [
    {
      id: "qz-1",
      lms_course_id: "lms-c-1",
      module_id: "mod-1",
      title: "Orthodox Dogmatics Chapter 1 Quiz",
      description: "Testing understanding of divine attributes and the Nicene Creed.",
      time_limit_minutes: 45,
      max_attempts: 3,
      passing_score: 70.00,
      shuffle_questions: true,
      show_answers_after: "submission",
      status: "published",
      grade_weight: 10.00
    }
  ],

  quiz_questions: [
    {
      id: "qq-1",
      quiz_id: "qz-1",
      question_type: "mcq",
      question_text: "In which century was Christianity formally adopted as the state religion in Aksumite Ethiopia?",
      options_json: [
        { id: "a", text: "1st Century CE" },
        { id: "b", text: "4th Century CE (King Ezana)" },
        { id: "c", text: "7th Century CE" },
        { id: "d", text: "10th Century CE" }
      ],
      correct_answer_json: { answer: "b" },
      points: 50,
      explanation: "Under King Ezana and the missionary work of Abba Selama (St. Frumentius) in the 4th century.",
      order_index: 1
    },
    {
      id: "qq-2",
      quiz_id: "qz-1",
      question_type: "true_false",
      question_text: "The Ethiopian Orthodox Tewahedo Church canon recognizes 81 books of Holy Scripture.",
      options_json: [
        { id: "t", text: "True" },
        { id: "f", text: "False" }
      ],
      correct_answer_json: { answer: "t" },
      points: 50,
      explanation: "The Ethiopian canon uniquely preserves 81 books including Enoch, Jubilees, and Meqabyan.",
      order_index: 2
    }
  ],

  quiz_attempts: [],
  forum_topics: [
    {
      id: "ft-1",
      lms_course_id: "lms-c-1",
      title: "Welcome & Theological Introductions",
      created_by: "u-fac-1",
      is_pinned: true,
      is_announcement: true,
      status: "open",
      post_count: 1,
      last_post_at: "2026-09-01T10:00:00Z"
    }
  ],
  forum_posts: [
    {
      id: "fp-1",
      topic_id: "ft-1",
      author_id: "u-fac-1",
      parent_post_id: null,
      content: "Welcome to the semester. Please introduce yourself with your parish community and your academic goals.",
      is_deleted: false,
      created_at: "2026-09-01T10:00:00Z"
    }
  ],

  certificates: []
};

module.exports = seedData;
