import React, { useState } from "react";
import {
  Box, Typography, Chip, Button, useTheme, Avatar, Stack, Fade,
  TextField, InputAdornment, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Tooltip, LinearProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AssignmentTurnedIn, Shield, VerifiedUser, School as SchoolIcon,
  Search, CheckCircle, Cancel, HourglassEmpty, ThumbUp, ThumbDown, Circle
} from "@mui/icons-material";

const STATUS_CONFIG = {
  registrar_approved: { label: "AWAITING AUTH", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  final_approved: { label: "PROVISIONED", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  rejected: { label: "REJECTED", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  pending_dept_review: { label: "DEPT REVIEW", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.25)" },
  pending: { label: "PENDING", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
};

const getStatus = (status) =>
  STATUS_CONFIG[status] || {
    label: status?.replace(/_/g, " ").toUpperCase() || "PENDING",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
  };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "registrar_approved", label: "Awaiting Auth" },
  { key: "final_approved", label: "Provisioned" },
  { key: "rejected", label: "Rejected" },
];

const ApplicationsTab = ({
  applications = [],
  handleReviewApplication,
  handleRejectApplication,
  clearanceStudents = [],
  handleDeactivateStudent,
  glassStyle,
  mode,
}) => {
  const theme = useTheme();
  const isDark = mode === "dark";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      app.name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.intendedMajor?.toLowerCase().includes(q) ||
      app.referenceId?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || app.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = applications.filter((a) => a.status === "registrar_approved").length;
  const approved = applications.filter((a) => a.status === "final_approved").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  const cellSx = {
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
    py: 2,
    px: 2.5,
  };

  const headCellSx = {
    ...cellSx,
    fontWeight: 1000,
    fontSize: "0.62rem",
    letterSpacing: 1.5,
    color: "text.secondary",
    textTransform: "uppercase",
    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.025)",
    whiteSpace: "nowrap",
  };

  return (
    <Fade in timeout={400}>
      <Box>

        {/* ─── Header ─── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1.5, fontFamily: "Outfit, sans-serif", lineHeight: 1 }}>
                Admissions Protocol
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5, fontSize: "0.62rem", opacity: 0.6 }}>
                STUDENT CANDIDATE VERIFICATION QUEUE
              </Typography>
            </Box>

            {/* Stat pills */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {[
                { icon: <HourglassEmpty sx={{ fontSize: 14 }} />, val: pending, label: "Awaiting", color: "#f59e0b" },
                { icon: <CheckCircle sx={{ fontSize: 14 }} />, val: approved, label: "Provisioned", color: "#10b981" },
                { icon: <Cancel sx={{ fontSize: 14 }} />, val: rejected, label: "Rejected", color: "#ef4444" },
              ].map((s) => (
                <Box key={s.label} sx={{
                  px: 2, py: 0.9, borderRadius: 2.5,
                  bgcolor: alpha(s.color, 0.08),
                  border: `1px solid ${alpha(s.color, 0.2)}`,
                  display: "flex", alignItems: "center", gap: 1,
                }}>
                  <Box sx={{ color: s.color }}>{s.icon}</Box>
                  <Typography variant="h6" fontWeight={1000} lineHeight={1} color={s.color}>{s.val}</Typography>
                  <Typography variant="caption" fontWeight={800} sx={{ opacity: 0.55, fontSize: "0.58rem" }}>{s.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Search + Filter */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search name, email, department, ref ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 17, opacity: 0.4 }} /></InputAdornment> }}
              sx={{
                flex: 1, minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
                  "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" },
                },
              }}
            />
            <Stack direction="row" spacing={0.8}>
              {FILTERS.map((f) => {
                const cnt = f.key === "all" ? applications.length : applications.filter((a) => a.status === f.key).length;
                const active = filter === f.key;
                return (
                  <Chip
                    key={f.key}
                    label={`${f.label} · ${cnt}`}
                    size="small"
                    onClick={() => setFilter(f.key)}
                    sx={{
                      fontWeight: 900, fontSize: "0.68rem", borderRadius: 2, cursor: "pointer",
                      transition: "all 0.18s",
                      bgcolor: active ? (isDark ? "rgba(255,255,255,0.92)" : "#0f172a") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                      color: active ? (isDark ? "#0f172a" : "#fff") : "text.secondary",
                      border: "none",
                      "&:hover": { opacity: 0.8 },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        </Box>

        {/* ─── Applications Table ─── */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 4,
            background: isDark ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(24px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.35)" : "0 8px 40px rgba(0,0,0,0.06)",
            mb: 7,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {["#", "Candidate", "Department / Role", "Reference ID", "Submitted", "Status", "Actions"].map((h, i) => (
                  <TableCell key={h} align={i === 6 ? "center" : "left"} sx={headCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 12, borderBottom: "none" }}>
                    <Box>
                      <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: alpha(theme.palette.primary.main, 0.06), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                        <AssignmentTurnedIn sx={{ fontSize: 34, color: "primary.main", opacity: 0.3 }} />
                      </Box>
                      <Typography variant="h6" fontWeight={1000} color="text.secondary">Queue Clear</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5, mt: 0.5 }}>
                        {search ? "No results for your search." : "No applications in this queue."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app, idx) => {
                  const appId = app._id || app.id;
                  const statusCfg = getStatus(app.status);
                  const isAwaiting = app.status === "registrar_approved";
                  const isProvisioned = app.status === "final_approved";
                  const isRejected = app.status === "rejected";

                  return (
                    <TableRow
                      key={appId}
                      sx={{
                        transition: "background 0.2s",
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.025)" : "rgba(99,102,241,0.03)" },
                        "& td": { borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` },
                        // Highlight pending rows subtly
                        ...(isAwaiting && { bgcolor: isDark ? "rgba(245,158,11,0.025)" : "rgba(245,158,11,0.02)" }),
                      }}
                    >
                      {/* # */}
                      <TableCell sx={{ ...cellSx, width: 40 }}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ opacity: 0.4 }}>
                          {idx + 1}
                        </Typography>
                      </TableCell>

                      {/* Candidate */}
                      <TableCell sx={cellSx}>
                        <Stack direction="row" spacing={1.8} alignItems="center">
                          <Box sx={{ position: "relative", flexShrink: 0 }}>
                            <Avatar sx={{
                              width: 42, height: 42, borderRadius: 2.5,
                              background: `linear-gradient(135deg, ${statusCfg.color}20, ${statusCfg.color}40)`,
                              color: statusCfg.color, fontWeight: 1000, fontSize: "1.1rem",
                              border: `1.5px solid ${statusCfg.color}33`,
                            }}>
                              {app.name?.[0]?.toUpperCase() || "?"}
                            </Avatar>
                            <Box sx={{
                              position: "absolute", bottom: -3, right: -3,
                              width: 14, height: 14, borderRadius: "50%",
                              bgcolor: isProvisioned ? "#10b981" : isRejected ? "#ef4444" : "#f59e0b",
                              border: `2px solid ${isDark ? "#0d1526" : "#fff"}`,
                            }} />
                          </Box>
                          <Box>
                            <Typography fontWeight={1000} variant="body2" sx={{ lineHeight: 1.3 }}>{app.name || "Unknown"}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ opacity: 0.65 }}>
                              {app.email || "—"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Dept / Role */}
                      <TableCell sx={cellSx}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 0.3 }}>
                          <SchoolIcon sx={{ fontSize: 13, color: "primary.main", opacity: 0.7 }} />
                          <Typography variant="body2" fontWeight={900} noWrap sx={{ maxWidth: 150 }}>
                            {app.intendedMajor || app.college || app.department || "—"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ fontSize: "0.58rem", letterSpacing: 0.5, opacity: 0.55 }}>
                          STUDENT CANDIDATE
                        </Typography>
                      </TableCell>

                      {/* Ref ID */}
                      <TableCell sx={cellSx}>
                        <Typography variant="body2" fontWeight={900} sx={{ fontFamily: "monospace", letterSpacing: 1.5, fontSize: "0.78rem" }}>
                          {app.referenceId?.slice(0, 12).toUpperCase() || "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Submitted */}
                      <TableCell sx={cellSx}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">
                          {new Date(app.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={cellSx}>
                        <Box sx={{
                          display: "inline-flex", alignItems: "center", gap: 0.7,
                          px: 1.4, py: 0.55, borderRadius: 1.5,
                          bgcolor: statusCfg.bg, border: `1px solid ${statusCfg.border}`,
                        }}>
                          <Box sx={{
                            width: 6, height: 6, borderRadius: "50%", bgcolor: statusCfg.color, flexShrink: 0,
                            ...(isAwaiting && { animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } })
                          }} />
                          <Typography sx={{ fontSize: "0.6rem", fontWeight: 900, color: statusCfg.color, letterSpacing: 0.6 }}>
                            {statusCfg.label}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                        {isAwaiting ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Authenticate & Provision Account">
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<ThumbUp sx={{ fontSize: 13 }} />}
                                onClick={() => handleReviewApplication(app)}
                                sx={{
                                  borderRadius: 2, textTransform: "none", fontWeight: 900,
                                  fontSize: "0.75rem", py: 0.7, px: 1.8,
                                  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                                  boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                                  "&:hover": { background: "linear-gradient(135deg,#4f46e5,#3730a3)", transform: "translateY(-1px)" },
                                  transition: "all 0.2s",
                                }}
                              >
                                Authenticate
                              </Button>
                            </Tooltip>
                            <Tooltip title="Reject Application">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ThumbDown sx={{ fontSize: 13 }} />}
                                onClick={() => handleRejectApplication(app)}
                                sx={{
                                  borderRadius: 2, textTransform: "none", fontWeight: 900,
                                  fontSize: "0.75rem", py: 0.7, px: 1.5,
                                  borderColor: alpha(theme.palette.error.main, 0.35),
                                  color: "error.main",
                                  "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.07), borderColor: "error.main", transform: "translateY(-1px)" },
                                  transition: "all 0.2s",
                                }}
                              >
                                Reject
                              </Button>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Box sx={{
                            display: "inline-flex", alignItems: "center", gap: 0.6,
                            px: 1.6, py: 0.6, borderRadius: 2,
                            bgcolor: isProvisioned ? alpha("#10b981", 0.08) : alpha("#ef4444", 0.08),
                            border: `1px solid ${isProvisioned ? alpha("#10b981", 0.2) : alpha("#ef4444", 0.2)}`,
                          }}>
                            {isProvisioned
                              ? <><VerifiedUser sx={{ fontSize: 13, color: "#10b981" }} /><Typography variant="caption" fontWeight={900} color="#10b981" sx={{ fontSize: "0.7rem" }}>Provisioned</Typography></>
                              : <><Cancel sx={{ fontSize: 13, color: "#ef4444" }} /><Typography variant="caption" fontWeight={900} color="#ef4444" sx={{ fontSize: "0.7rem" }}>Rejected</Typography></>
                            }
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ─── Student Clearance Section ─── */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, fontFamily: "Outfit, sans-serif" }}>
                Student Clearance Queue
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5, fontSize: "0.62rem", opacity: 0.6 }}>
                DEACTIVATION PROTOCOLS
              </Typography>
            </Box>
            <Chip
              label={`${clearanceStudents.length} PENDING`}
              size="small"
              sx={{ fontWeight: 900, borderRadius: 1.5, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 4,
              background: isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
              boxShadow: isDark ? "0 6px 30px rgba(0,0,0,0.3)" : "0 6px 30px rgba(0,0,0,0.05)",
              mb: 6,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {["Student", "Department", "Status", "Action"].map((h, i) => (
                    <TableCell key={h} align={i === 3 ? "center" : "left"} sx={headCellSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {clearanceStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8, borderBottom: "none" }}>
                      <VerifiedUser sx={{ fontSize: 34, color: "success.main", opacity: 0.25, mb: 1 }} />
                      <Typography fontWeight={1000} color="text.secondary" variant="body2">ALL CLEARANCE PROTOCOLS RESOLVED</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clearanceStudents.map((student, i) => (
                    <TableRow key={i} sx={{ "&:hover": { bgcolor: isDark ? "rgba(239,68,68,0.03)" : "rgba(239,68,68,0.02)" }, "& td": { borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` } }}>
                      <TableCell sx={cellSx}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", fontWeight: 900 }}>
                            {student.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={900} variant="body2">{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ opacity: 0.6 }}>{student.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Typography variant="body2" fontWeight={800}>{student.department || "N/A"}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: "0.58rem", opacity: 0.55 }}>STUDENT</Typography>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Chip label={student.status?.toUpperCase()} size="small" sx={{ fontWeight: 900, fontSize: "0.6rem", borderRadius: 1.5, color: "error.main", bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }} />
                      </TableCell>
                      <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                        <Button
                          variant="contained" color="error" size="small"
                          onClick={() => handleDeactivateStudent && handleDeactivateStudent(student)}
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 900, fontSize: "0.75rem", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
                        >
                          Deactivate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* ─── Security Notice ─── */}
        <Box sx={{
          p: 3, borderRadius: 4,
          bgcolor: alpha(theme.palette.warning.main, 0.04),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
          display: "flex", alignItems: "center", gap: 2.5,
        }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: alpha(theme.palette.warning.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield sx={{ color: "warning.main", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={1000} color="warning.main" sx={{ letterSpacing: 0.5 }}>
              SECURITY PROTOCOL NOTICE
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Authenticating a candidate opens the provisioning dialog to create their university account. A password rotation is enforced on first login.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default ApplicationsTab;
