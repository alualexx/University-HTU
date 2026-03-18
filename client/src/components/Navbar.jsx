import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../services/Firebase";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Container,
  Avatar,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School,
  Person,
  Dashboard,
  Logout,
  Login,
  AppRegistration,
  Info,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  Close as CloseIcon,
  AssignmentInd,
  ArrowForward,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Alert, Collapse, alpha } from "@mui/material";
import { useAuth, ROLE_DASHBOARD_ROUTES } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeContext";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleColorMode } = useColorMode();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const broadcastQuery = query(
      collection(db, "system_broadcasts"),
      where("active", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(broadcastQuery, (snapshot) => {
      if (!snapshot.empty) {
        setActiveBroadcast({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setActiveBroadcast(null);
      }
    }, (error) => {
      console.error("Broadcast fetch failed:", error);
      setActiveBroadcast(null);
    });

    return () => unsubscribe();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleDashboardClick = () => {
    handleClose();
    const route = ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard";
    navigate(route);
  };

  const publicMenuItems = [
    { label: "Home", path: "/" },
    { label: "Departments", path: "/departments" },
    { label: "About Us", path: "/about" },
    { label: "Admissions", path: "/apply" },
    { label: "Track Application", path: "/track" },
  ];

  const portalMenuItems = [
    { label: "Dashboard", path: ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard" },
  ];

  const menuItems = isAuthenticated ? portalMenuItems : publicMenuItems;

  const isActive = (path) => location.pathname === path || (path === "/apply" && location.pathname.startsWith("/apply"));

  const isHomePage = location.pathname === "/";
  const shouldShowGlass = !isHomePage || scrolled;

  /* ── Mobile Drawer ── */
  const drawer = (
    <Box sx={{
      width: 290,
      height: "100%",
      background: theme.palette.mode === "dark"
        ? "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)"
        : "linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%)",
      pt: 3,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          p: 1, borderRadius: "12px",
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          display: "flex", boxShadow: "0 4px 12px rgba(25,118,210,0.35)"
        }}>
          <School sx={{ color: "white", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1 }}>
            UNIVERSITY
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 1 }}>
            Portal System
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            component={RouterLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: "12px",
              mb: 0.5,
              color: isActive(item.path) ? "primary.main" : "text.secondary",
              backgroundColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : "transparent",
              "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.06), color: "primary.main" },
              fontWeight: isActive(item.path) ? 700 : 500,
              transition: "all 0.2s ease",
              px: 2,
            }}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: "inherit", fontSize: "0.95rem" }} />
            {item.label === "Admissions" && (
              <Chip label="Open" size="small" sx={{ bgcolor: "#fff7ed", color: "#ea580c", fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
            )}
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3 }}>
        <Divider sx={{ mb: 2 }} />
        {isAuthenticated ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth variant="contained" startIcon={<Dashboard />}
              onClick={() => { handleDashboardClick(); setMobileOpen(false); }}
              sx={{ borderRadius: "12px", textTransform: "none", py: 1.2, fontWeight: 700 }}
            >
              Dashboard
            </Button>
            <Button
              fullWidth variant="outlined" color="error" startIcon={<Logout />}
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              sx={{ borderRadius: "12px", textTransform: "none", py: 1.2, fontWeight: 700 }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth variant="outlined" component={RouterLink} to="/login"
              sx={{ borderRadius: "12px", textTransform: "none", py: 1.2, fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Button>
            <Button
              fullWidth variant="contained" component={RouterLink} to="/apply"
              onClick={() => setMobileOpen(false)}
              startIcon={<AssignmentInd />}
              sx={{
                borderRadius: "12px", textTransform: "none", py: 1.2, fontWeight: 800,
                background: "linear-gradient(135deg, #ea580c, #f97316)",
                boxShadow: "0 4px 16px rgba(234,88,12,0.35)",
                "&:hover": { background: "linear-gradient(135deg, #c2410c, #ea580c)" }
              }}
            >
              Apply Now
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: shouldShowGlass
            ? theme.palette.mode === "dark"
              ? alpha("#0f172a", 0.96)
              : alpha("#ffffff", 0.92)
            : "transparent",
          backdropFilter: shouldShowGlass ? "blur(24px) saturate(180%)" : "none",
          borderBottom: shouldShowGlass
            ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
            : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          color: shouldShowGlass
            ? (theme.palette.mode === "dark" ? "#f8fafc" : "#1e293b")
            : "white",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: shouldShowGlass ? 64 : 88, transition: "height 0.4s ease" }}>

            {/* Mobile: hamburger */}
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={RouterLink} to="/"
              sx={{
                display: "flex", alignItems: "center", textDecoration: "none",
                color: "inherit", flexGrow: isMobile ? 1 : 0, mr: 4,
                transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.02)" }
              }}
            >
              <Box sx={{
                p: 0.8, borderRadius: "12px",
                background: shouldShowGlass
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                  : "white",
                display: "flex", mr: 1.5,
                boxShadow: shouldShowGlass
                  ? "0 4px 12px rgba(25,118,210,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <School sx={{ color: shouldShowGlass ? "white" : "primary.main", fontSize: 24 }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="h6" sx={{
                  fontWeight: 900, letterSpacing: "-1px", lineHeight: 1,
                  background: shouldShowGlass
                    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : "white",
                  WebkitBackgroundClip: shouldShowGlass ? "text" : "none",
                  WebkitTextFillColor: shouldShowGlass ? "transparent" : "white",
                }}>
                  UNIVERSITY
                </Typography>
                <Typography variant="caption" sx={{
                  letterSpacing: 1.5, fontWeight: 600, fontSize: "0.6rem",
                  color: shouldShowGlass ? "text.secondary" : "rgba(255,255,255,0.7)",
                  display: "block",
                }}>
                  PORTAL SYSTEM
                </Typography>
              </Box>
            </Box>

            {/* Desktop nav links */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex", gap: 0.5 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    endIcon={item.label === "Admissions" ? (
                      <Chip label="Open" size="small" sx={{ bgcolor: shouldShowGlass ? "#fff7ed" : "rgba(255,255,255,0.15)", color: shouldShowGlass ? "#ea580c" : "white", fontWeight: 700, fontSize: "0.6rem", height: 18, cursor: "pointer" }} />
                    ) : undefined}
                    sx={{
                      color: isActive(item.path)
                        ? (shouldShowGlass ? "primary.main" : "white")
                        : (shouldShowGlass ? "text.secondary" : "rgba(255,255,255,0.82)"),
                      fontWeight: isActive(item.path) ? 800 : 500,
                      px: 2.5,
                      textTransform: "none",
                      fontSize: "0.94rem",
                      borderRadius: "10px",
                      position: "relative",
                      transition: "all 0.25s ease",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        bottom: 6,
                        left: "50%",
                        width: isActive(item.path) ? "20px" : "0",
                        height: "3px",
                        borderRadius: "2px",
                        bgcolor: item.label === "Admissions" ? "#ea580c" : "primary.main",
                        transform: "translateX(-50%)",
                        transition: "all 0.3s ease",
                      },
                      "&:hover": {
                        backgroundColor: alpha(
                          item.label === "Admissions" ? "#ea580c" : theme.palette.primary.main,
                          0.08
                        ),
                        color: item.label === "Admissions"
                          ? (shouldShowGlass ? "#ea580c" : "white")
                          : "primary.main",
                        "&:after": { width: "20px" }
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right side: notifications + auth */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Dark Mode Toggle */}
              <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={toggleColorMode}
                  color="inherit" size="small"
                  sx={{
                    bgcolor: shouldShowGlass ? alpha(theme.palette.primary.main, 0.08) : "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                    transition: "all 0.2s ease",
                  }}
                >
                  {theme.palette.mode === "dark" ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  <Tooltip title={user?.name}>
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        p: 0.3,
                        border: `2px solid ${shouldShowGlass ? alpha(theme.palette.primary.main, 0.25) : "rgba(255,255,255,0.25)"}`,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: theme.palette.primary.main }
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.85rem", fontWeight: 800 }}>
                        {user?.name?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    elevation={16}
                    PaperProps={{
                      sx: {
                        mt: 2, borderRadius: "20px", minWidth: 260,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        bgcolor: alpha(theme.palette.background.paper, 0.98),
                        backdropFilter: "blur(20px)",
                        overflow: "visible",
                        "&:before": {
                          content: '""', display: "block", position: "absolute",
                          top: 0, right: 18, width: 12, height: 12,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
                          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        },
                      }
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 3, py: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" sx={{
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
                        color: "primary.main", display: "block", mt: 0.5
                      }}>
                        {user?.role} Portal
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1.5 }}>
                      <MenuItem onClick={handleDashboardClick} sx={{ borderRadius: "12px", py: 1.6, mb: 0.5 }}>
                        <ListItemIcon><Dashboard fontSize="small" sx={{ color: "primary.main" }} /></ListItemIcon>
                        <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 700 }} />
                      </MenuItem>
                      <MenuItem onClick={handleLogout} sx={{ borderRadius: "12px", py: 1.6, color: "error.main" }}>
                        <ListItemIcon><Logout fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 700 }} />
                      </MenuItem>
                    </Box>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Button
                      component={RouterLink} to="/login"
                      sx={{
                        color: shouldShowGlass ? "text.primary" : "white",
                        textTransform: "none", fontWeight: 700, px: 2.5, borderRadius: "10px",
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.06) }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink} to="/apply"
                      variant="contained"
                      startIcon={<AssignmentInd />}
                      sx={{
                        borderRadius: "12px", px: 3, py: 1,
                        textTransform: "none", fontWeight: 800,
                        background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                        color: "white",
                        boxShadow: "0 6px 20px rgba(234,88,12,0.35)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #c2410c 0%, #ea580c 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 28px rgba(234,88,12,0.45)"
                        },
                        transition: "all 0.25s ease",
                      }}
                    >
                      Apply Now
                    </Button>
                  </Box>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { borderRadius: "0 24px 24px 0", border: "none", boxShadow: "20px 0 60px rgba(0,0,0,0.12)" }
        }}
      >
        {drawer}
      </Drawer>

      {/* Broadcast Banner */}
      <Box sx={{
        position: "fixed",
        top: shouldShowGlass ? 64 : 88,
        left: 0, right: 0,
        zIndex: theme.zIndex.appBar - 1,
        transition: "top 0.4s ease"
      }}>
        <Collapse in={Boolean(activeBroadcast)}>
          {activeBroadcast && (
            <Alert
              severity={activeBroadcast.type || "info"}
              icon={
                activeBroadcast.type === "warning" ? <Warning /> :
                  activeBroadcast.type === "error" ? <ErrorIcon /> :
                    activeBroadcast.type === "success" ? <CheckCircle /> : <Info />
              }
              sx={{
                borderRadius: 0, fontWeight: 700,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                "& .MuiAlert-message": { width: "100%", textAlign: "center", fontSize: "0.95rem" },
                bgcolor: "background.paper", color: "text.primary",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}
              action={
                <IconButton size="small" onClick={() => setActiveBroadcast(null)}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {activeBroadcast.message}
            </Alert>
          )}
        </Collapse>
      </Box>
    </>
  );
};

export default Navbar;
