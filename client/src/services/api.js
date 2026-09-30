import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error — backend not reachable
      console.error("Network Error: Backend server is not reachable at", API_URL);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  me: () => api.get("/auth/me"),
  changePassword: (data) => api.put("/auth/change-password", data),
  requestReset: (email) => api.post("/auth/request-reset", { email }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  patch: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  apply: (data) => api.post("/users/apply", data),
  initiateClearance: (id) => api.patch(`/users/${id}/clearance/initiate`),
  patchClearance: (id, department, status) => api.patch(`/users/${id}/clearance/${department}`, { status }),
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id, studentId) => api.post(`/courses/${id}/enroll`, { studentId }),
  drop: (id, studentId) => api.post(`/courses/${id}/drop`, { studentId }),
  getMyCourses: () => api.get("/courses/my-courses"),
};

// Colleges API
export const collegesAPI = {
  getAll: (params) => api.get("/colleges", { params }),
  create: (data) => api.post("/colleges", data),
  update: (id, data) => api.put(`/colleges/${id}`, data),
  delete: (id) => api.delete(`/colleges/${id}`),
  getMetrics: (id) => api.get(`/colleges/${id}/metrics`),
  getDashboardMetrics: (id) => api.get(`/colleges/${id}/dashboard`),
};

// Departments API
export const departmentsAPI = {
  getAll: (params) => api.get("/departments", { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Applications API
export const applicationsAPI = {
  submit: (data) => api.post("/applications/submit", data),
  getAll: (params) => api.get("/applications", { params }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status, notes) => api.put(`/applications/${id}/status`, { status, notes }),
  patch: (id, data) => api.patch(`/applications/${id}`, data),
  track: (referenceId) => api.get(`/applications/track/${referenceId}`),
};

// Announcements API
export const announcementsAPI = {
  getAll: (params) => api.get("/announcements", { params }),
  create: (data) => api.post("/announcements", data),
  update: (id, data) => api.patch(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// Activity Logs API
export const activityLogsAPI = {
  getAll: () => api.get('/activity-logs'),
  create: (data) => api.post('/activity-logs', data),
};

// Security Logs API
export const securityLogsAPI = {
  getAll: () => api.get('/security-logs'),
  create: (data) => api.post('/security-logs', data),
};

// Research API
export const researchAPI = {
  getAll: (params) => api.get("/research", { params }),
  create: (data) => api.post("/research", data),
  update: (id, data) => api.put(`/research/${id}`, data),
  delete: (id) => api.delete(`/research/${id}`),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: (params) => api.get("/enrollments", { params }),
  create: (data) => api.post("/enrollments", data),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
};

// Tuition API
export const tuitionAPI = {
  getAll: (params) => api.get("/tuition", { params }),
  create: (data) => api.post("/tuition", data),
};


// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get("/notifications", { params }),
  create: (data) => api.post("/notifications", data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Transcript API
export const transcriptAPI = {
  getMe: () => api.get("/transcripts/me"),
  getById: (studentId) => api.get(`/transcripts/${studentId}`),
  update: (data) => api.post("/transcripts", data),
};

// Schedules API
export const schedulesAPI = {
  getAll: () => api.get("/schedules"),
  create: (data) => api.post("/schedules", data),
};

// System API
export const systemAPI = {
  getSettings: (key) => api.get(`/system/${key}`),
  updateSettings: (key, data) => api.post(`/system/${key}`, data),
  getHealth: () => api.get('/system/health'),
};

// Password Resets API
export const passwordResetsAPI = {
  getAll: () => api.get('/password-resets'),
  request: (email) => api.post('/password-resets', { email }),
  update: (id, data) => api.patch(`/password-resets/${id}`, data),
};

// System Broadcasts API
export const systemBroadcastsAPI = {
  getAll: () => api.get('/system-broadcasts'),
  create: (data) => api.post('/system-broadcasts', data),
};

// OTPs API
export const otpsAPI = {
  getAll: () => api.get('/otps'),
  create: (data) => api.post('/otps', data),
  update: (id, data) => api.patch(`/otps/${id}`, data),
  delete: (id) => api.delete(`/otps/${id}`),
};

// Academic Events API
export const academicEventsAPI = {
  getAll: (params) => api.get("/academic-events", { params }),
  create: (data) => api.post("/academic-events", data),
  update: (id, data) => api.put(`/academic-events/${id}`, data),
  delete: (id) => api.delete(`/academic-events/${id}`),
};

// Budgets API
export const budgetsAPI = {
  get: (collegeId) => api.get("/budgets", { params: { collegeId } }),
  update: (data) => api.post("/budgets", data),
};

// Attendance API
export const attendanceAPI = {
  get: (params) => api.get("/attendance", { params }),
  create: (data) => api.post("/attendance", data),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
};

// Assignments API
export const assignmentsAPI = {
  getAll: (params) => api.get("/assignments", { params }),
  create: (data) => api.post("/assignments", data),
  grade: (id, data) => api.post(`/assignments/${id}/grade`, data),
};

// Library API
export const libraryAPI = {
  getBooks: (params) => api.get("/library/books", { params }),
  createBook: (data) => api.post("/library/books", data),
  updateBook: (id, data) => api.put(`/library/books/${id}`, data),
  deleteBook: (id) => api.delete(`/library/books/${id}`),
  getBorrowings: () => api.get("/library/borrowings"),
  issueBook: (data) => api.post("/library/borrowings/issue", data),
  returnBook: (data) => api.post("/library/borrowings/return", data),
  reserveBook: (data) => api.post("/library/reservations", data),
  getReservations: () => api.get("/library/reservations"),
  // Fines
  getFines: () => api.get("/library/fines"),
  processFine: (recordId, data) => api.post(`/library/fines/${recordId}/pay`, data),
  // Thesis
  submitThesis: (data) => api.post("/library/thesis", data),
  approveThesis: (id) => api.post(`/library/thesis/${id}/approve`),
  // Members
  getLibraryMembers: () => api.get("/library/members"),
  updateMemberPrivilege: (id, data) => api.post(`/library/members/${id}/privilege`, data),

  // ==================== FINANCE PORTAL ====================
  // Invoices
  getInvoices: () => api.get("/finance/invoices"),
  createInvoice: (data) => api.post("/finance/invoices", data),
  payInvoice: (id, data) => api.put(`/finance/invoices/${id}/pay`, data),

  // Ledger Transactions
  getTransactions: () => api.get("/finance/transactions"),

  // Scholarships
  getScholarships: () => api.get("/finance/scholarships"),
  createScholarship: (data) => api.post("/finance/scholarships", data),

  // Payroll
  getPayroll: () => api.get("/finance/payroll"),
  processPayroll: (data) => api.post("/finance/payroll/process", data),
};

// ==================== HTTU DOMAIN SUBSYSTEMS ====================
export const academicAPI = {
  getPrograms: (params) => api.get("/academic/programs", { params }),
  createProgram: (data) => api.post("/academic/programs", data),
  getDepartments: () => api.get("/academic/departments"),
  getCourses: (params) => api.get("/academic/courses", { params }),
  createCourse: (data) => api.post("/academic/courses", data),
  getCourseOfferings: (params) => api.get("/academic/course-offerings", { params }),
  createCourseOffering: (data) => api.post("/academic/course-offerings", data),
  checkConflicts: (params) => api.get("/academic/course-offerings/conflicts", { params }),
  submitGradesBulk: (data) => api.post("/academic/grades/bulk", data),
  approveGrade: (id, data) => api.post(`/academic/grades/${id}/approve`, data),
  generateTranscript: (data) => api.post("/academic/transcripts/generate", data),
  verifyTranscript: (code) => api.get(`/academic/transcripts/verify/${code}`),
  getCalendarEvents: () => api.get("/academic/academic-calendar/events"),
  getSemesters: () => api.get("/academic/semesters"),
};

export const sisAPI = {
  getStudents: (params) => api.get("/sis/students", { params }),
  getStudentById: (id) => api.get(`/sis/students/${id}`),
  createStudent: (data) => api.post("/sis/students", data),
  getApplications: (params) => api.get("/sis/admissions/applications", { params }),
  submitApplication: (data) => api.post("/sis/admissions/applications", data),
  updateApplicationStatus: (id, data) => api.put(`/sis/admissions/applications/${id}/status`, data),
  enrollSemester: (data) => api.post("/sis/enrollments", data),
  registerCourses: (enrollmentId, data) => api.post(`/sis/enrollments/${enrollmentId}/courses`, data),
};

export const lmsAPI = {
  getCourses: (params) => api.get("/lms/courses", { params }),
  getCourseById: (id) => api.get(`/lms/courses/${id}`),
  addModule: (courseId, data) => api.post(`/lms/courses/${courseId}/modules`, data),
  addLesson: (moduleId, data) => api.post(`/lms/modules/${moduleId}/lessons`, data),
  updateProgress: (lessonId, data) => api.put(`/lms/lessons/${lessonId}/progress`, data),
  getAssignments: (params) => api.get("/lms/assignments", { params }),
  submitAssignment: (assignmentId, data) => api.post(`/lms/assignments/${assignmentId}/submissions`, data),
  getQuizzes: (params) => api.get("/lms/quizzes", { params }),
  getQuizById: (id) => api.get(`/lms/quizzes/${id}`),
  submitQuiz: (quizId, data) => api.post(`/lms/quizzes/${quizId}/submit`, data),
  getForums: (courseId) => api.get(`/lms/courses/${courseId}/forums`),
  getPosts: (topicId) => api.get(`/lms/forum-topics/${topicId}/posts`),
  postReply: (topicId, data) => api.post(`/lms/forum-topics/${topicId}/posts`, data),
  verifyCertificate: (code) => api.get(`/lms/certificates/verify/${code}`),
};

export const hrAPI = {
  getEmployees: (params) => api.get("/hr/employees", { params }),
  createEmployee: (data) => api.post("/hr/employees", data),
  getOrgChart: () => api.get("/hr/org-chart"),
  getLeaveTypes: () => api.get("/hr/leave-types"),
  getLeaveRequests: (params) => api.get("/hr/leave-requests", { params }),
  submitLeaveRequest: (data) => api.post("/hr/leave-requests", data),
  approveLeaveRequest: (id, data) => api.put(`/hr/leave-requests/${id}/approve`, data),
  getFacultyWorkload: (params) => api.get("/hr/faculty-workload", { params }),
};

export const theologyLibraryAPI = {
  getCatalog: (params) => api.get("/library/catalog", { params }),
  getCatalogItem: (id) => api.get(`/library/catalog/${id}`),
  createCatalogItem: (data) => api.post("/library/catalog", data),
  checkoutLoan: (data) => api.post("/library/loans/checkout", data),
  returnLoan: (data) => api.post("/library/loans/return", data),
  getManifest: (id) => api.get(`/library/digital/${id}/manifest`),
  getFines: (params) => api.get("/library/fines", { params }),
  waiveFine: (id, data) => api.post(`/library/fines/${id}/waive`, data),
};

// Health check
export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;

