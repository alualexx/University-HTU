import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { db } from "../services/Firebase";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext(null);

// API base URL – proxied through Vite or set directly
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance for authenticated requests
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty", // Instructor
  DEAN: "dean", // Academic Administrator
  PRESIDENT: "president", // Executive oversight
  REGISTRAR: "registrar",
  ADMIN: "admin", // System Admin
  FINANCE: "finance",
  LIBRARIAN: "librarian",
  HR: "hr"
};

// Role-based dashboard routes
export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.STUDENT]: "/student-dashboard",
  [ROLES.FACULTY]: "/faculty-dashboard",
  [ROLES.DEAN]: "/dean-dashboard",
  [ROLES.PRESIDENT]: "/president-dashboard",
  [ROLES.REGISTRAR]: "/registrar-dashboard",
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.FINANCE]: "/finance-dashboard",
  [ROLES.LIBRARIAN]: "/library-dashboard",
  [ROLES.HR]: "/hr-dashboard"
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New global system settings
  const [globalAdmissionOpen, setGlobalAdmissionOpen] = useState(true);
  const [registrationLock, setRegistrationLock] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // ------------------------------------------------------------------
  // System Settings Listener
  // ------------------------------------------------------------------
  useEffect(() => {
    // Listen to registrar settings for admission and registration lock
    const unsubRegistrar = onSnapshot(doc(db, "system_settings", "registrar"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalAdmissionOpen(data.admissionWindow ?? true);
        setRegistrationLock(data.registrationLock ?? false);
      }
    });

    // Listen to global config for maintenance mode
    const unsubConfig = onSnapshot(doc(db, "system_config", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMaintenanceMode(data.maintenanceMode ?? false);
      }
    });

    return () => {
      unsubRegistrar();
      unsubConfig();
    };
  }, []);

  // ------------------------------------------------------------------
  // Restore session from localStorage token on app load
  // ------------------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------
  const login = async (email, password) => {
    setError(null); // always clear stale errors before a fresh login attempt

    // Map HTTU mock accounts if offline or quick-login
    const cleanUser = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const httuAccounts = {
      "daniel.g": { id: "u-stu-2", full_name: "Daniel Gebremariam", name: "Daniel Gebremariam", email: "daniel.g@httu.edu.et", role: ROLES.STUDENT, department: "Biblical Studies", amharic_name: "ዳንኤል ገብረማርያም", student_id: "HTTU-2024-01148" },
      "daniel.g@httu.edu.et": { id: "u-stu-2", full_name: "Daniel Gebremariam", name: "Daniel Gebremariam", email: "daniel.g@httu.edu.et", role: ROLES.STUDENT, department: "Biblical Studies", amharic_name: "ዳንኤል ገብረማርያም", student_id: "HTTU-2024-01148" },
      "john.doe": { id: "u-stu-1", full_name: "Daniel Gebremariam", name: "Daniel Gebremariam", email: "john.doe@httu.edu.et", role: ROLES.STUDENT, department: "Biblical Studies", amharic_name: "ዳንኤል ገብረማርያም", student_id: "HTTU-2024-01148" },
      "dr.alemeyahu": { id: "u-fac-2", full_name: "Dr. Alemeyahu Worku", name: "Dr. Alemeyahu Worku", email: "dr.alemeyahu@httu.edu.et", role: ROLES.FACULTY, department: "Biblical Studies", amharic_name: "ዶ/ር ዓለማየሁ ወርቁ", employee_id: "EMP-2022-000104" },
      "dr.alemeyahu@httu.edu.et": { id: "u-fac-2", full_name: "Dr. Alemeyahu Worku", name: "Dr. Alemeyahu Worku", email: "dr.alemeyahu@httu.edu.et", role: ROLES.FACULTY, department: "Biblical Studies", amharic_name: "ዶ/ር ዓለማየሁ ወርቁ", employee_id: "EMP-2022-000104" },
      "dr.abebe": { id: "u-fac-1", full_name: "Dr. Alemeyahu Worku", name: "Dr. Alemeyahu Worku", email: "dr.abebe@httu.edu.et", role: ROLES.FACULTY, department: "Biblical Studies", amharic_name: "ዶ/ር ዓለማየሁ ወርቁ", employee_id: "EMP-2022-000104" },
      "fr.yohannes": { id: "u-fac-1", full_name: "Dr. Sofia Assefa", name: "Dr. Sofia Assefa", email: "fr.yohannes@httu.edu.et", role: ROLES.DEAN, department: "Systematic Theology", amharic_name: "ዶ/ር ሶፊያ አሰፋ", employee_id: "EMP-2021-000098" },
      "fr.yohannes@httu.edu.et": { id: "u-fac-1", full_name: "Dr. Sofia Assefa", name: "Dr. Sofia Assefa", email: "fr.yohannes@httu.edu.et", role: ROLES.DEAN, department: "Systematic Theology", amharic_name: "ዶ/ር ሶፊያ አሰፋ", employee_id: "EMP-2021-000098" },
      "dean": { id: "u-dean-1", full_name: "Rev. Dr. Abeba Zerihun", name: "Rev. Dr. Abeba Zerihun", email: "dean@httu.edu.et", role: ROLES.DEAN, department: "Church History", amharic_name: "መልአከ ብርሃን ዶ/ር አበበ ዘሪሁን", employee_id: "EMP-2018-000045" },
      "dean@httu.edu.et": { id: "u-dean-1", full_name: "Rev. Dr. Abeba Zerihun", name: "Rev. Dr. Abeba Zerihun", email: "dean@httu.edu.et", role: ROLES.DEAN, department: "Church History", amharic_name: "መልአከ ብርሃን ዶ/ር አበበ ዘሪሁን", employee_id: "EMP-2018-000045" },
      "president": { id: "u-pres-1", full_name: "Archbishop Merkorios Tilahun", name: "Archbishop Merkorios Tilahun", email: "president@httu.edu.et", role: ROLES.PRESIDENT, department: "Pastoral Theology", amharic_name: "ብፁዕ አቡነ መርቆሬዎስ ጥላሁን", employee_id: "EMP-2010-000001" },
      "president@httu.edu.et": { id: "u-pres-1", full_name: "Archbishop Merkorios Tilahun", name: "Archbishop Merkorios Tilahun", email: "president@httu.edu.et", role: ROLES.PRESIDENT, department: "Pastoral Theology", amharic_name: "ብፁዕ አቡነ መርቆሬዎስ ጥላሁን", employee_id: "EMP-2010-000001" },
      "registrar": { id: "u-reg-1", full_name: "Meskerem Abebe", name: "Meskerem Abebe", email: "registrar@httu.edu.et", role: ROLES.REGISTRAR, department: "Registrar Office", amharic_name: "መስከረም አበበ", employee_id: "EMP-2020-000120" },
      "registrar@httu.edu.et": { id: "u-reg-1", full_name: "Meskerem Abebe", name: "Meskerem Abebe", email: "registrar@httu.edu.et", role: ROLES.REGISTRAR, department: "Registrar Office", amharic_name: "መስከረም አበበ", employee_id: "EMP-2020-000120" },
      "finance": { id: "u-fin-1", full_name: "Mahlet Yohannes", name: "Mahlet Yohannes", email: "finance@httu.edu.et", role: ROLES.FINANCE, department: "Finance Office", amharic_name: "ማኅሌት ዮሐንስ", employee_id: "EMP-2021-000155" },
      "finance@httu.edu.et": { id: "u-fin-1", full_name: "Mahlet Yohannes", name: "Mahlet Yohannes", email: "finance@httu.edu.et", role: ROLES.FINANCE, department: "Finance Office", amharic_name: "ማኅሌት ዮሐንስ", employee_id: "EMP-2021-000155" },
      "hr": { id: "u-hr-1", full_name: "Hanna Bekele", name: "Hanna Bekele", email: "hr@httu.edu.et", role: ROLES.HR, department: "Human Resources", amharic_name: "ሐና በቀለ", employee_id: "EMP-2023-000210" },
      "hr@httu.edu.et": { id: "u-hr-1", full_name: "Hanna Bekele", name: "Hanna Bekele", email: "hr@httu.edu.et", role: ROLES.HR, department: "Human Resources", amharic_name: "ሐና በቀለ", employee_id: "EMP-2023-000210" },
      "librarian": { id: "u-lib-1", full_name: "Tsehay Girma", name: "Tsehay Girma", email: "librarian@httu.edu.et", role: ROLES.LIBRARIAN, department: "University Library", amharic_name: "ፀሐይ ግርማ", employee_id: "EMP-2019-000088" },
      "librarian@httu.edu.et": { id: "u-lib-1", full_name: "Tsehay Girma", name: "Tsehay Girma", email: "librarian@httu.edu.et", role: ROLES.LIBRARIAN, department: "University Library", amharic_name: "ፀሐይ ግርማ", employee_id: "EMP-2019-000088" },
      "admin": { id: "u-adm-1", full_name: "System Administrator", name: "System Administrator", email: "admin@httu.edu.et", role: ROLES.ADMIN, department: "IT & Systems", amharic_name: "የሲስተም አስተዳዳሪ", employee_id: "EMP-2018-000002" },
      "admin@httu.edu.et": { id: "u-adm-1", full_name: "System Administrator", name: "System Administrator", email: "admin@httu.edu.et", role: ROLES.ADMIN, department: "IT & Systems", amharic_name: "የሲስተም አስተዳዳሪ", employee_id: "EMP-2018-000002" },
    };

    try {
      const { data } = await api.post("/auth/login", { 
        username: email, 
        email, 
        password: cleanPass === "••••••••••" ? "password123" : cleanPass 
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user.requiresPasswordChange) {
        return { success: true, role: data.user.role, redirectTo: "/change-password" };
      }

      return {
        success: true,
        role: data.user.role,
        redirectTo: ROLE_DASHBOARD_ROUTES[data.user.role] || "/dashboard",
      };
    } catch (err) {
      // Offline fallback for demo accounts
      if (httuAccounts[cleanUser]) {
        const mockUser = httuAccounts[cleanUser];
        localStorage.setItem("token", "httu-offline-jwt-token");
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        return {
          success: true,
          role: mockUser.role,
          redirectTo: ROLE_DASHBOARD_ROUTES[mockUser.role] || "/dashboard",
        };
      }
      const msg = err.response?.data?.error || err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------------------------
  // Register (public sign-up)
  // ------------------------------------------------------------------
  const register = async (userData) => {
    setError(null);
    try {
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
        role: data.user.role,
        redirectTo: ROLE_DASHBOARD_ROUTES[data.user.role] || "/dashboard",
      };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------------------------
  // Register by Admin (creates another user without affecting current session)
  // ------------------------------------------------------------------
  const registerUserByAdmin = async (userData) => {
    setError(null); // clear any stale errors so they don't bleed into other pages
    try {
      await api.post("/users", userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      // Do NOT call setError here — this is an admin operation, not a user-facing login error
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ------------------------------------------------------------------
  // Change current user's password
  // ------------------------------------------------------------------
  const changeUserPassword = async (newPassword) => {
    setError(null);
    try {
      await api.put("/auth/change-password", { newPassword });
      const updatedUser = { ...user, requiresPasswordChange: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ------------------------------------------------------------------
  // Request password reset (stores a request – admin handles it)
  // ------------------------------------------------------------------
  const requestPasswordReset = async (email) => {
    try {
      // POST to a simple endpoint; backend can log this or email admin
      await api.post("/auth/request-reset", { email });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Reset request failed." };
    }
  };

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (Array.isArray(requiredRoles)) return requiredRoles.includes(user.role);
    return user.role === requiredRoles;
  };

  // Stub audit/security loggers — can wire to a backend route if needed
  const logSecurityEvent = useCallback(async (_classification, _details, _color) => { }, []);
  const logAuditActivity = useCallback(async (_action, _details) => { }, []);

  // OTP verification — checks MongoDB via /api/otps
  const verifyOTP = useCallback(async (code, type) => {
    try {
      const res = await api.get('/otps');
      const otps = res.data;
      const match = otps.find(
        o => o.code === code.trim().toUpperCase() && o.type === type && !o.isUsed
      );
      if (!match) {
        return { success: false, message: "Invalid or already-used OTP. Please contact the System Administrator." };
      }
      return { success: true, data: match, otpId: match._id || match.id };
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || "OTP verification failed. Server error." };
    }
  }, []);

  const markOTPUsed = useCallback(async (otpId) => {
    try {
      await api.patch(`/otps/${otpId}`, { isUsed: true });
      return true;
    } catch (err) {
      console.error("Failed to mark OTP as used:", err);
      return false;
    }
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAuthenticated,
    register,
    registerUserByAdmin,
    changeUserPassword,
    requestPasswordReset,
    sendPasswordReset: requestPasswordReset,
    maintenanceMode,
    globalAdmissionOpen,
    registrationLock,
    userIp: null,
    logSecurityEvent,
    logAuditActivity,
    verifyOTP,
    markOTPUsed,
    ROLE_DASHBOARD_ROUTES,
    // Expose api instance so pages can make authenticated requests
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
