import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
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
  COLLEGE_ADMIN: "college_admin",
};

// Role-based dashboard routes
export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.STUDENT]: "/student-dashboard",
  [ROLES.FACULTY]: "/department-dashboard", // Department Head
  [ROLES.TEACHER]: "/teacher-dashboard",    // Individual Teacher
  [ROLES.REGISTRAR]: "/registrar-dashboard",
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.COLLEGE_ADMIN]: "/college-dashboard",
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
  const [globalAdmissionOpen, setGlobalAdmissionOpen] = useState(true);
  const [userIp, setUserIp] = useState("Unknown");

  // Fetch user IP
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIp(data.ip);
      } catch (err) {
        console.warn("Failed to fetch IP address:", err);
      }
    };
    fetchIp();
  }, []);

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
        const data = docSnap.data();
        setMaintenanceMode(data.maintenanceMode);
        setGlobalAdmissionOpen(data.globalAdmissionOpen !== false); // Default to true if not set
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
        department: "Computer Science",
      };
      setUser(demoHead);
      return { success: true, role: "faculty", redirectTo: "/department-dashboard" };
    }
    if (email === "dean@university.edu" && password === "password123") {
      const demoDean = {
        uid: "demo-dean-uid",
        email: "dean@university.edu",
        name: "Dean James Moriarty",
        role: "college_admin",
        college: "Engineering & Technology",
      };
      setUser(demoDean);
      return { success: true, role: "college_admin", redirectTo: "/college-dashboard" };
    }
    // ---------------------------

    // Enforce University Email Login (except for demo accounts)
    if (!email.endsWith("@university.edu") && !email.includes("demo") && email !== "admin@university.edu") {
      logSecurityEvent("Unauthorized Access", `Blocked login attempt with non-university email: ${email}`, "error");
      return { success: false, error: "ACCESS DENIED: Only official university emails (@university.edu) are authorized for portal access." };
    }

    try {
      setError(null);

      // ---- MANUAL CREDENTIAL / BYPASS CHECK ----
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const qSnap = await getDocs(q);
      
      if (!qSnap.empty) {
        const docSnap = qSnap.docs[0];
        const data = docSnap.data();
        
        if (data.tempPassword && data.tempPassword === password) {
          console.log("Login bypass successful using tempPassword");
          const bypassUser = {
            uid: docSnap.id,
            email: data.email,
            name: data.name || data.email,
            role: data.role || "student",
            requiresPasswordChange: true, // Always force change for bypass
            isBypass: true,
            ...data
          };
          
          setUser(bypassUser);
          
          // Log security event
          if (typeof logSecurityEvent === 'function') {
            await logSecurityEvent("Emergency Access", `User accessed account via manual credentials bypass. IP: ${userIp}`, "warning");
          }
          
          return {
            success: true,
            role: bypassUser.role,
            redirectTo: ROLE_DASHBOARD_ROUTES[bypassUser.role] || "/dashboard",
          };
        }
      }
      // ------------------------------------------

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
      if (userData.requiresPasswordChange) {
        return {
          success: true,
          role: userData.role,
          redirectTo: "/change-password",
        };
      }

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
      if (userData.year) newUser.year = userData.year;
      if (userData.employeeId) newUser.employeeId = userData.employeeId;
      if (userData.department) newUser.department = userData.department;

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

  // Submit a password reset request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check if user exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No account found with this email address.");
      }

      const userData = querySnapshot.docs[0].data();
      const userName = userData.name || "User";
      const userRole = userData.role || "student";

      // 2. Create reset request
      await addDoc(collection(db, "password_resets"), {
        email,
        name: userName,
        role: userRole,
        status: "pending",
        requestedAt: serverTimestamp(),
        processedAt: null,
        processedBy: null
      });

      return { success: true };
    } catch (err) {
      console.error("Reset request error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
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
      
      if (user?.isBypass) {
        // For bypass users, they might not be in Firebase Auth yet or we are resetting them.
        // We update Firestore to remove the tempPassword and requiresPasswordChange.
        await setDoc(doc(db, "users", user.uid), { 
          tempPassword: null, 
          requiresPasswordChange: false,
          lastPasswordUpdate: serverTimestamp()
        }, { merge: true });
        
        setUser(prev => ({ ...prev, requiresPasswordChange: false, tempPassword: null, isBypass: false }));
        return { success: true, message: "Manual password updated. Please sync with your institution for further access if Firebase Auth fails." };
      }

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

  const logSecurityEvent = async (classification, details, color = "info") => {
    try {
      await addDoc(collection(db, "security_logs"), {
        source: user?.name || "Auth System",
        classification,
        resolution: details,
        ipAddress: userIp || "Unknown",
        color,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Security log failed:", err);
    }
  };

  const logAuditActivity = async (action, details, customUser = null) => {
    const activeUser = customUser || user;
    try {
      await addDoc(collection(db, "audit_logs"), {
        action,
        details,
        adminName: activeUser?.name || "System / Guest",
        adminEmail: activeUser?.email || "Anonymous",
        ipAddress: userIp || "Unknown",
        timestamp: serverTimestamp(),
        color: action.includes("Delete") || action.includes("Failed") ? "#ff003c" : "#00f0ff"
      });
    } catch (err) {
      console.error("Audit log failed:", err);
    }
  };
  
  const verifyOTP = async (otpCode, type) => {
    try {
      const otpsRef = collection(db, "otps");
      const q = query(otpsRef, where("code", "==", otpCode), where("type", "==", type), where("isUsed", "==", false));
      const qSnap = await getDocs(q);
      
      if (qSnap.empty) return { success: false, message: "Invalid or expired OTP." };
      
      return { success: true, otpId: qSnap.docs[0].id, data: qSnap.docs[0].data() };
    } catch (err) {
      console.error("OTP Verification failed:", err);
      return { success: false, message: "Error verifying OTP." };
    }
  };

  const markOTPUsed = async (otpId) => {
    try {
      await setDoc(doc(db, "otps", otpId), { isUsed: true, usedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch (err) {
      console.error("Failed to mark OTP as used:", err);
      return false;
    }
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
    requestPasswordReset,
    sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),
    maintenanceMode,
    userIp,
    logSecurityEvent,
    logAuditActivity,
    verifyOTP,
    markOTPUsed,
    ROLE_DASHBOARD_ROUTES,
    globalAdmissionOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
