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
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  patch: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
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
  getAll: () => api.get("/colleges"),
  create: (data) => api.post("/colleges", data),
  update: (id, data) => api.put(`/colleges/${id}`, data),
  delete: (id) => api.delete(`/colleges/${id}`),
};

// Departments API
export const departmentsAPI = {
  getAll: () => api.get("/departments"),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Applications API
export const applicationsAPI = {
  submit: (data) => api.post("/applications/submit", data),
  getAll: (params) => api.get("/applications", { params }),
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

export default api;
