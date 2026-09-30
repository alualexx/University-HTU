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
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./common/LanguageSwitcher";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleColorMode } = useColorMode();
  const { t } = useLanguage();

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
      limit(10) // Fetch a few to sort in memory if needed, though limit(1) without order is random-ish
    );

    const unsubscribe = onSnapshot(broadcastQuery, (snapshot) => {
      if (!snapshot.empty) {
        // Sort by createdAt desc in memory to avoid index requirement
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setActiveBroadcast(docs[0]);
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
    { label: "Admissions", path: "/apply" },
    { label: "Departments", path: "/departments" },
    { label: "Courses", path: "/courses" },
    { label: "Faculty", path: "/faculty" },
    { label: "News & Notices", path: "/news" },
    { label: "About HTTU", path: "/about" },
  ];

  const portalMenuItems = [
    { label: "Dashboard", path: ROLE_DASHBOARD_ROUTES[user?.role] || "/dashboard" },
  ];

  const menuItems = isAuthenticated ? portalMenuItems : publicMenuItems;

  const isActive = (path) => location.pathname === path || (path === "/apply" && location.pathname.startsWith("/apply"));

  const isHomePage = location.pathname === "/";
  const shouldShowGlass = !isHomePage || scrolled;
  const isDark = theme.palette.mode === "dark";

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
          width: 40, height: 40, overflow: "hidden", borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          bgcolor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <Box component="img" src="/logo.png" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1 }}>
            {t("universityName")}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 1 }}>
            Portal System
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 3, mb: 3 }}>
        <LanguageSwitcher />
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
              {t("signOut")}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              fullWidth variant="outlined" component={RouterLink} to="/login"
              sx={{ borderRadius: "12px", textTransform: "none", py: 1.2, fontWeight: 700 }}
              onClick={() => setMobileOpen(false)}
            >
              {t("portalLogin")}
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
              {t("applyNow")}
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
            ? (isDark ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.8)")
            : "transparent",
          backdropFilter: shouldShowGlass ? "blur(30px) saturate(200%)" : "none",
          borderBottom: shouldShowGlass
            ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`
            : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          color: isDark ? "#ffffff" : "text.primary",
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
                width: 40, height: 40, overflow: "hidden", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                bgcolor: "white", boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.05)",
                mr: 1.5, transition: "all 0.3s ease"
              }}>
                <Box component="img" src="/logo.png" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="h6" sx={{
                  fontWeight: 900, letterSpacing: "-1px", lineHeight: 1,
                  background: shouldShowGlass
                    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : (isDark ? "white" : theme.palette.primary.main),
                  WebkitBackgroundClip: shouldShowGlass ? "text" : "none",
                  WebkitTextFillColor: shouldShowGlass ? "transparent" : (isDark ? "white" : theme.palette.primary.main),
                }}>
                  {t("universityName")}
                </Typography>
                <Typography variant="caption" sx={{
                  letterSpacing: 2, fontWeight: 900, fontSize: "0.6rem",
                  color: isDark ? "rgba(255,255,255,0.6)" : "text.secondary",
                  display: "block",
                }}>
                  PORTAL SYSTEM
                </Typography>
              </Box>
            </Box>

            {/* Desktop nav links */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex", gap: 1, ml: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    endIcon={item.label === "Admissions" ? (
                      <Chip label="Open" size="small" sx={{ bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#fff7ed", color: isDark ? "white" : "#ea580c", fontWeight: 700, fontSize: "0.6rem", height: 18, cursor: "pointer" }} />
                    ) : undefined}
                    sx={{
                      color: isActive(item.path)
                        ? (isDark ? "white" : "text.primary")
                        : (isDark ? "rgba(255,255,255,0.7)" : "text.secondary"),
                      fontWeight: isActive(item.path) ? 900 : 600,
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
                          ? (isDark ? "#ea580c" : "#ea580c")
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
              {!isMobile && <LanguageSwitcher variant="icon" />}

              {/* Dark Mode Toggle */}
              <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={toggleColorMode}
                  color="inherit" size="small"
                  sx={{
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : alpha(theme.palette.primary.main, 0.08),
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.15)" : alpha(theme.palette.primary.main, 0.18) },
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
                        border: `2px solid ${isDark ? "rgba(255,255,255,0.15)" : alpha(theme.palette.primary.main, 0.25)}`,
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
                        <ListItemText primary={t("dashboard")} primaryTypographyProps={{ fontWeight: 700 }} />
                      </MenuItem>
                      <MenuItem onClick={handleLogout} sx={{ borderRadius: "12px", py: 1.6, color: "error.main" }}>
                        <ListItemIcon><Logout fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
                        <ListItemText primary={t("signOut")} primaryTypographyProps={{ fontWeight: 700 }} />
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
                        color: isDark ? "white" : "#0E2033",
                        textTransform: "none", fontWeight: 800, px: 2.5, borderRadius: "8px",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "#CBD5E1"}`,
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9" },
                        transition: "all 0.2s ease"
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink} to="/apply"
                      variant="contained"
                      sx={{
                        borderRadius: "8px", px: 2.5, py: 0.8,
                        textTransform: "none", fontWeight: 900,
                        bgcolor: "#D9A621",
                        color: "#0E2033",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#C59318",
                          boxShadow: "0 4px 12px rgba(217,166,33,0.3)"
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Apply now
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
