import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth, ROLE_DASHBOARD_ROUTES } from "../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect is handled by the effect
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    const route = ROLE_DASHBOARD_ROUTES[user.role];
    if (route) {
      return <Navigate to={route} replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

export default Dashboard;
