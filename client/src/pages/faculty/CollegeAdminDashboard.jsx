import React from 'react';
import CollegeDashboard from '../college/CollegeDashboard';

// This file acts as a compatibility wrapper for the existing routing
// It delegates directly to the new modular CollegeDashboard
export default function CollegeAdminDashboard() {
  return <CollegeDashboard />;
}
