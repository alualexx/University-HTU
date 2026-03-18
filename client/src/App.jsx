import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth, ROLES, ROLE_DASHBOARD_ROUTES } from "./context/AuthContext";
import "./App.css";

// Lazy-loaded components for performance optimization
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Unauthorized = React.lazy(() => import("./pages/Unauthorized"));
const Courses = React.lazy(() => import("./pages/public/Courses"));
const Faculty = React.lazy(() => import("./pages/public/Faculty"));
const News = React.lazy(() => import("./pages/public/News"));
const Apply = React.lazy(() => import("./pages/public/Apply"));
const ApplicationForm = React.lazy(() => import("./pages/public/ApplicationForm"));
const TrackApplication = React.lazy(() => import("./pages/public/TrackApplication"));
const Departments = React.lazy(() => import("./pages/public/Departments"));
const AboutUs = React.lazy(() => import("./pages/public/AboutUs"));
const StudentDashboard = React.lazy(() => import("./pages/student/StudentDashboard"));
const RegistrarDashboard = React.lazy(() => import("./pages/registrar/RegistrarDashboard"));
const DepartmentDashboard = React.lazy(() => import("./pages/faculty/DepartmentDashboard"));
const TeacherDashboard = React.lazy(() => import("./pages/faculty/TeacherDashboard"));
const FacultyDashboard = React.lazy(() => import("./pages/faculty/FacultyDashboard"));
const CollegeAdminDashboard = React.lazy(() => import("./pages/faculty/CollegeAdminDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const CreateAccount = React.lazy(() => import("./pages/admin/CreateAccount"));
const MaintenancePage = React.lazy(() => import("./pages/MaintenancePage"));
const ChangePassword = React.lazy(() => import("./pages/public/ChangePassword"));
const ChatBot = React.lazy(() => import("./components/common/ChatBot"));

// Loading fallback component
const PageLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '60vh',
    gap: 2 
  }}>
    <div className="loader-ripple"><div></div><div></div></div>
    <div style={{ 
      fontFamily: 'Outfit, sans-serif', 
      color: '#4f46e5', 
      fontWeight: 600,
      letterSpacing: '1px'
    }}>LOADING UNIVERSITY PORTAL...</div>
  </Box>
);

function App() {
  const { maintenanceMode, user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDashboard = location.pathname.includes("dashboard");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isDashboard && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, mt: (isHomePage || isDashboard) ? 0 : { xs: 8, sm: 9, md: 10 }, mb: isDashboard ? 0 : 4 }}>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes - Affected by Maintenance Mode */}
          <Route path="/" element={
            maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : 
            (isAuthenticated ? <Navigate to={ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard"} replace /> : <Home />)
          } />
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard"} replace /> : <Login />
          } />

          <Route path="/register" element={
            maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> :
            (isAuthenticated ? <Navigate to={ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard"} replace /> : <Register />)
          } />

          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/courses" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <Courses />} />
          <Route path="/departments" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <Departments />} />
          <Route path="/about" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <AboutUs />} />
          <Route path="/faculty" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <Faculty />} />
          <Route path="/news" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <News />} />
          
          <Route path="/apply" element={
            maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> :
            (isAuthenticated ? <Navigate to={ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard"} replace /> : <Apply />)
          } />
          
          <Route path="/apply/:departmentId" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <ApplicationForm />} />

          {/* Map /admin shortcut to the admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-account/:applicationId"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CreateAccount />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Generic /dashboard — redirect to role-specific dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated
                ? <Navigate to={ROLE_DASHBOARD_ROUTES[user?.role] || "/"} replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <StudentDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Registrar Dashboard */}
          <Route
            path="/registrar-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.REGISTRAR]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <RegistrarDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Teacher Dashboard */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <TeacherDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Department Head Dashboard (Legacy) */}
          <Route
            path="/department-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <FacultyDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Faculty College Dashboard */}
          <Route
            path="/faculty-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <FacultyDashboard />}
              </ProtectedRoute>
            }
          />

          {/* College Administrator Dashboard (Dean) */}
          <Route
            path="/college-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COLLEGE_ADMIN]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <CollegeAdminDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Track Application - Public */}
          <Route path="/track" element={maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <TrackApplication />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </React.Suspense>
      </Box>
      {!isDashboard && <Footer />}
      {/* Global ChatBot — visible on every page and dashboard */}
      <ChatBot />
    </Box>
  );
}

export default App;
