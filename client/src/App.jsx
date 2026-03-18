import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Courses from "./pages/public/Courses";
import Faculty from "./pages/public/Faculty";
import News from "./pages/public/News";
import Apply from "./pages/public/Apply";
import ApplicationForm from "./pages/public/ApplicationForm";
import TrackApplication from "./pages/public/TrackApplication";
import Departments from "./pages/public/Departments";
import AboutUs from "./pages/public/AboutUs";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import RegistrarDashboard from "./pages/registrar/RegistrarDashboard";
import DepartmentDashboard from "./pages/faculty/DepartmentDashboard";
import TeacherDashboard from "./pages/faculty/TeacherDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import CollegeAdminDashboard from "./pages/faculty/CollegeAdminDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateAccount from "./pages/admin/CreateAccount";
import MaintenancePage from "./pages/MaintenancePage";
import ChangePassword from "./pages/public/ChangePassword";
import { useAuth, ROLES, ROLE_DASHBOARD_ROUTES } from "./context/AuthContext";
import ChatBot from "./components/common/ChatBot";
import "./App.css";

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

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
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
      </Box>
      {!isDashboard && <Footer />}
      {/* Global ChatBot — visible on every page and dashboard */}
      <ChatBot />
    </Box>
  );
}

export default App;
