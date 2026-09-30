import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Container,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Receipt,
  Payments,
  TrendingUp,
  AccountBalance,
  LocalAtm,
  Sync,
  Lock,
  FormatListBulleted,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  Church,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import {
  DashboardTab,
  InvoicingTab,
  PaymentProcessingTab,
  ReportsAnalyticsTab,
  ScholarshipTab,
  PayrollProcessingTab,
  FeeManagementTab,
  SettingsSetupTab,
} from "./tabs";

const HTTU_COLORS = {
  navy: "#0E2033",
  gold: "#D9A621",
  teal: "#12808C",
  canvas: "#F4F6F8",
  border: "#E2E8F0",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
};

const FINANCE_NAV = [
  { label: "Dashboard", icon: <DashboardIcon />, tab: 0 },
  { label: "Invoices", icon: <Receipt />, tab: 1 },
  { label: "Payments", icon: <Payments />, tab: 2 },
  { label: "Revenue & Reports", icon: <TrendingUp />, tab: 3 },
  { label: "Scholarships & Waivers", icon: <AccountBalance />, tab: 4 },
  { label: "Payroll & Disbursements", icon: <LocalAtm />, tab: 5 },
  { label: "Reconciliation", icon: <Sync />, tab: 6 },
  { label: "Finance Holds", icon: <Lock />, tab: 7 },
  { label: "Fee Structure", icon: <FormatListBulleted />, tab: 8 },
];

export default function FinanceDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayName = user?.name || user?.full_name || "Mahlet Yohannes";
  const displayRole = "Finance Officer";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: HTTU_COLORS.canvas }}>
      {/* ── HTTU Master Navy Sidebar ── */}
      <Box
        sx={{
          width: sidebarOpen ? 260 : 78,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bgcolor: HTTU_COLORS.navy,
          color: "white",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          zIndex: 1200,
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {sidebarOpen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  border: `2px solid ${HTTU_COLORS.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(217, 166, 33, 0.12)",
                }}
              >
                <Church sx={{ color: HTTU_COLORS.gold, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: HTTU_COLORS.gold, letterSpacing: 0.5, display: "block", lineHeight: 1.1 }}>
                  HOLY TRINITY
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.68rem" }}>
                  THEOLOGY UNIVERSITY
                </Typography>
                <Typography variant="caption" sx={{ color: HTTU_COLORS.gold, fontWeight: 700, fontSize: "0.62rem", display: "block" }}>
                  FINANCE OFFICE
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: "rgba(255,255,255,0.7)" }}>
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflowY: "auto" }}>
          {FINANCE_NAV.map((item) => {
            const isSelected = activeTab === item.tab;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!sidebarOpen ? item.label : ""} placement="right">
                  <Button
                    fullWidth
                    onClick={() => setActiveTab(item.tab)}
                    startIcon={<Box sx={{ color: isSelected ? HTTU_COLORS.navy : "rgba(255,255,255,0.7)", display: "flex" }}>{item.icon}</Box>}
                    sx={{
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      px: sidebarOpen ? 2 : 0,
                      py: 1.2,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: "0.85rem",
                      bgcolor: isSelected ? HTTU_COLORS.gold : "transparent",
                      color: isSelected ? HTTU_COLORS.navy : "rgba(255,255,255,0.8)",
                      "&:hover": {
                        bgcolor: isSelected ? HTTU_COLORS.gold : "rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    {sidebarOpen && item.label}
                  </Button>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          {sidebarOpen ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800, fontSize: "0.85rem" }}>
                MY
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ color: "white", fontSize: "0.82rem" }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", display: "block" }}>
                  {displayRole}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Avatar sx={{ width: 34, height: 34, bgcolor: HTTU_COLORS.gold, color: HTTU_COLORS.navy, fontWeight: 800 }}>
              MY
            </Avatar>
          )}
          {sidebarOpen && (
            <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
              <Logout fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ── Main Content Area ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarOpen ? 260 : 78}px`,
          p: { xs: 2.5, md: 4 },
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {activeTab === 0 && <DashboardTab />}
          {activeTab === 1 && <InvoicingTab />}
          {activeTab === 2 && <PaymentProcessingTab />}
          {activeTab === 3 && <ReportsAnalyticsTab />}
          {activeTab === 4 && <ScholarshipTab />}
          {activeTab === 5 && <PayrollProcessingTab />}
          {activeTab === 6 && <DashboardTab />}
          {activeTab === 7 && <DashboardTab />}
          {activeTab === 8 && <FeeManagementTab />}
        </Container>
      </Box>
    </Box>
  );
}
