import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, ROLE_DASHBOARD_ROUTES } from "../context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // While Firebase is resolving auth state, show a loader
  // This prevents incorrect redirects to /login on page refresh
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Authenticating...
        </Typography>
      </Box>
    );
  }

  // Not logged in → redirect to login, preserving the intended location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Forced Password Change Interception
  if (user?.requiresPasswordChange && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  // Logged in but wrong role → redirect to their specific dashboard instead of just unauthorized
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dashboardPath = ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
