import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

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

// User roles
export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  REGISTRAR: "registrar",
  ADMIN: "admin",
  TEACHER: "teacher",
  COLLEGE_ADMIN: "college_admin",
};

// Role-based dashboard routes
export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.STUDENT]: "/student-dashboard",
  [ROLES.FACULTY]: "/department-dashboard",
  [ROLES.TEACHER]: "/teacher-dashboard",
  [ROLES.REGISTRAR]: "/registrar-dashboard",
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.COLLEGE_ADMIN]: "/college-dashboard",
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
    try {
      const { data } = await api.post("/auth/login", { email, password });
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
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
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
  const logSecurityEvent = useCallback(async (_classification, _details, _color) => {}, []);
  const logAuditActivity = useCallback(async (_action, _details) => {}, []);

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
  // maintenanceMode defaults to false; wire to a backend /api/settings route if needed
  const maintenanceMode = false;
  const globalAdmissionOpen = true;

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
