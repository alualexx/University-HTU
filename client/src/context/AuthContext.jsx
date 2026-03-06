import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, app } from "../services/Firebase";
import { initializeApp } from "firebase/app";
import { getAuth, updatePassword } from "firebase/auth";

const AuthContext = createContext(null);

// Initialize a secondary Firebase app for admin-led user creation
const secondaryApp = initializeApp(app.options, "SecondaryAdminApp");
const secondaryAuth = getAuth(secondaryApp);

// User roles
export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  REGISTRAR: "registrar",
  ADMIN: "admin",
  TEACHER: "teacher",
};

// Role-based dashboard routes
export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.STUDENT]: "/student-dashboard",
  [ROLES.FACULTY]: "/department-dashboard", // Department Head
  [ROLES.TEACHER]: "/teacher-dashboard",    // Individual Teacher
  [ROLES.REGISTRAR]: "/registrar-dashboard",
  [ROLES.ADMIN]: "/admin-dashboard",
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Listen for Firebase auth state changes and fetch role from Firestore
  useEffect(() => {
    let unsubscribeUserDoc = () => { };

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Real-time listener for the current user's document
        unsubscribeUserDoc = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // If account is disabled by admin, force logout
            if (data.disabled) {
              signOut(auth);
              setUser(null);
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: data.name || firebaseUser.email,
                role: data.role || "student",
                requiresPasswordChange: data.requiresPasswordChange || false,
                ...data,
              });
            }
          } else {
            // Document doesn't exist yet
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: "student" });
          }
          setLoading(false);
        });
      } else {
        unsubscribeUserDoc();
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for global maintenance mode
    const unsubscribeConfig = onSnapshot(doc(db, "system_config", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        setMaintenanceMode(docSnap.data().maintenanceMode);
      }
    }, (err) => {
      console.warn("Maintenance config fetch failed:", err);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc();
      unsubscribeConfig();
    };
  }, []);

  // Login using Firebase Authentication
  const login = async (email, password) => {
    // ---- DEMO MODE BYPASS ----
    if (email === "teacher@university.edu" && password === "password123") {
      const demoTeacher = {
        uid: "demo-teacher-uid",
        email: "teacher@university.edu",
        name: "Dr. Sarah Mills",
        role: "teacher",
        employeeId: "EMP-2025-001",
        position: "Associate Professor",
      };
      setUser(demoTeacher);
      return { success: true, role: "teacher", redirectTo: "/teacher-dashboard" };
    }
    if (email === "student@university.edu" && password === "password123") {
      const demoStudent = {
        uid: "demo-student-uid",
        email: "student@university.edu",
        name: "Alex Johnson",
        role: "student",
        studentId: "STU-2024-0142",
      };
      setUser(demoStudent);
      return { success: true, role: "student", redirectTo: "/student-dashboard" };
    }
    if (email === "admin@university.edu" && password === "password123") {
      const demoAdmin = {
        uid: "demo-admin-uid",
        email: "admin@university.edu",
        name: "System Administrator",
        role: "admin",
      };
      setUser(demoAdmin);
      return { success: true, role: "admin", redirectTo: "/admin-dashboard" };
    }
    if (email === "registrar@university.edu" && password === "password123") {
      const demoRegistrar = {
        uid: "demo-registrar-uid",
        email: "registrar@university.edu",
        name: "Official Registrar",
        role: "registrar",
      };
      setUser(demoRegistrar);
      return { success: true, role: "registrar", redirectTo: "/registrar-dashboard" };
    }
    if (email === "head@university.edu" && password === "password123") {
      const demoHead = {
        uid: "demo-head-uid",
        email: "head@university.edu",
        name: "Dr. Alan Turing",
        role: "faculty",
      };
      setUser(demoHead);
      return { success: true, role: "faculty", redirectTo: "/department-dashboard" };
    }
    // ---------------------------

    try {
      setError(null);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user role (initial fetch, then onSnapshot handles updates)
      const userDocSnap = await getDoc(doc(db, "users", firebaseUser.uid));

      let role = "student";
      let name = firebaseUser.displayName || firebaseUser.email;
      let userData = { uid: firebaseUser.uid, email: firebaseUser.email, name, role };

      if (userDocSnap.exists()) {
        userData = { ...userData, ...userDocSnap.data() };
      }

      setUser(userData);
      return {
        success: true,
        role: userData.role,
        redirectTo: ROLE_DASHBOARD_ROUTES[userData.role] || "/dashboard",
      };
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please check your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Public registration function for initial account setup
  const register = async (userData) => {
    try {
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role || "student",
        createdAt: new Date().toISOString(),
      };

      if (userData.studentId) newUser.studentId = userData.studentId;
      if (userData.employeeId) newUser.employeeId = userData.employeeId;

      await setDoc(doc(db, "users", firebaseUser.uid), newUser);

      const completeUser = { uid: firebaseUser.uid, ...newUser };
      setUser(completeUser);

      return {
        success: true,
        role: completeUser.role,
        redirectTo: ROLE_DASHBOARD_ROUTES[completeUser.role] || "/dashboard",
      };
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Admin-only registration function
  const registerUserByAdmin = async (userData) => {
    try {
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, userData.email, userData.password);

      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        requiresPasswordChange: true,
        createdAt: new Date().toISOString(),
      };

      if (userData.studentId) newUser.studentId = userData.studentId;
      if (userData.employeeId) newUser.employeeId = userData.employeeId;

      await setDoc(doc(db, "users", userCredential.user.uid), newUser);
      await signOut(secondaryAuth);

      return { success: true };
    } catch (err) {
      console.error("Admin registration error:", err);
      let errorMessage = "Registration failed.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const changeUserPassword = async (newPassword) => {
    try {
      setError(null);
      if (!auth.currentUser) throw new Error("No user logged in to change password.");

      await updatePassword(auth.currentUser, newPassword);

      // Update Firestore to remove requirement
      await setDoc(doc(db, "users", auth.currentUser.uid), { requiresPasswordChange: false }, { merge: true });

      // Update local state
      setUser(prev => ({ ...prev, requiresPasswordChange: false }));

      return { success: true };
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Failed to change password. Please try again.");
      return { success: false, error: err.message };
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (Array.isArray(requiredRoles)) return requiredRoles.includes(user.role);
    return user.role === requiredRoles;
  };

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
    maintenanceMode,
    ROLE_DASHBOARD_ROUTES,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
