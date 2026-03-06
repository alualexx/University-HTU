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
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import RegistrarDashboard from "./pages/registrar/RegistrarDashboard";
import DepartmentDashboard from "./pages/faculty/DepartmentDashboard";
import TeacherDashboard from "./pages/faculty/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateAccount from "./pages/admin/CreateAccount";
import MaintenancePage from "./pages/MaintenancePage";
import ChangePassword from "./pages/public/ChangePassword";
import { useAuth, ROLES } from "./context/AuthContext";
import "./App.css";

function App() {
  const { maintenanceMode, user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, mt: isHomePage ? 0 : { xs: 8, sm: 9, md: 10 }, mb: 4 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/news" element={<News />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/apply/:departmentId" element={<ApplicationForm />} />

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

          {/* Department Head Dashboard */}
          <Route
            path="/department-dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                {maintenanceMode && !isAdmin ? <Navigate to="/maintenance" /> : <DepartmentDashboard />}
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

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
