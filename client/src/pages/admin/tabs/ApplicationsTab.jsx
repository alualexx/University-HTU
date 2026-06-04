import React, { useState } from "react";
import {
  Box, Card, Typography, Chip, Button, useTheme, Avatar, Stack, Grid,
  TextField, InputAdornment, Divider, IconButton, Tooltip, Badge, Fade
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AssignmentTurnedIn, Shield, VerifiedUser, School as SchoolIcon,
  Search, FilterList, CheckCircle, Cancel, Visibility, AccessTime,
  Person, Email as EmailIcon, Domain, HourglassEmpty, ThumbUp,
  ThumbDown, MoreHoriz, Circle
} from "@mui/icons-material";

const STATUS_CONFIG = {
  registrar_approved: { label: "APPROVED BY REGISTRAR", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  final_approved: { label: "FINAL APPROVED", color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" },
  rejected: { label: "REJECTED", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  pending_dept_review: { label: "DEPT REVIEW", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  pending: { label: "PENDING", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" },
};

const getStatus = (status) =>
  STATUS_CONFIG[status] || { label: status?.replace(/_/g, " ").toUpperCase() || "PENDING", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" };

const ApplicationsTab = ({
  applications = [],
  handleReviewApplication,
  handleRejectApplication,
  clearanceStudents = [],
  handleDeactivateStudent,
  glassStyle,
  mode
}) => {
  const theme = useTheme();
  const isDark = mode === "dark";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = applications.filter(app => {
    const matchSearch =
      !search ||
      app.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.intendedMajor?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || app.status === filter;
    return matchSearch && matchFilter;
  });

  const filters = [
    { key: "all", label: "All", count: applications.length },
    { key: "registrar_approved", label: "Awaiting Auth", count: applications.filter(a => a.status === "registrar_approved").length },
    { key: "final_approved", label: "Approved", count: applications.filter(a => a.status === "final_approved").length },
    { key: "rejected", label: "Rejected", count: applications.filter(a => a.status === "rejected").length },
  ];

  return (
    <Fade in timeout={400}>
      <Box>
        {/* ── Header ── */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -1.5, fontFamily: "Outfit, sans-serif", lineHeight: 1 }}>
                Admissions Protocol
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mt: 0.5, letterSpacing: 1, fontSize: "0.7rem", opacity: 0.7 }}>
                STUDENT CANDIDATE VERIFICATION QUEUE
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {[
                { icon: <HourglassEmpty sx={{ fontSize: 16 }} />, val: applications.filter(a => a.status === "registrar_approved").length, label: "Pending Auth", color: "#f59e0b" },
                { icon: <CheckCircle sx={{ fontSize: 16 }} />, val: applications.filter(a => a.status === "final_approved").length, label: "Approved", color: "#10b981" },
                { icon: <Cancel sx={{ fontSize: 16 }} />, val: applications.filter(a => a.status === "rejected").length, label: "Rejected", color: "#ef4444" },
              ].map((s) => (
                <Box key={s.label} sx={{
                  px: 2, py: 1, borderRadius: 3,
                  bgcolor: alpha(s.color, 0.08),
                  border: `1px solid ${alpha(s.color, 0.2)}`,
                  display: "flex", alignItems: "center", gap: 1
                }}>
                  <Box sx={{ color: s.color }}>{s.icon}</Box>
                  <Box>
                    <Typography variant="h6" fontWeight={1000} lineHeight={1} color={s.color}>{s.val}</Typography>
                    <Typography variant="caption" fontWeight={800} sx={{ opacity: 0.6, fontSize: "0.58rem", letterSpacing: 0.5 }}>{s.label}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* ── Search + Filter Bar ── */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search by name, email, or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, opacity: 0.5 }} /></InputAdornment>,
              }}
              sx={{
                flex: 1, minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                  "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }
                }
              }}
            />
            <Stack direction="row" spacing={1}>
              {filters.map(f => (
                <Chip
                  key={f.key}
                  label={`${f.label} (${f.count})`}
                  size="small"
                  onClick={() => setFilter(f.key)}
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    bgcolor: filter === f.key
                      ? (isDark ? "white" : "#0f172a")
                      : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                    color: filter === f.key
                      ? (isDark ? "#0f172a" : "white")
                      : "text.secondary",
                    border: "none",
                    "&:hover": { opacity: 0.85 }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* ── Application Cards ── */}
        {filtered.length > 0 ? (
          <Stack spacing={2} sx={{ mb: 8 }}>
            {filtered.map((app) => {
              const appId = app._id || app.id;
              const statusCfg = getStatus(app.status);
              const isAwaitingAuth = app.status === "registrar_approved";
              const isApproved = app.status === "final_approved";
              const isRejected = app.status === "rejected";

              return (
                <Card
                  key={appId}
                  sx={{
                    borderRadius: 4,
                    background: isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: isDark
                      ? "0 4px 24px rgba(0,0,0,0.3)"
                      : "0 4px 24px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: isDark
                        ? `0 12px 40px rgba(0,0,0,0.4)`
                        : `0 12px 40px rgba(0,0,0,0.1)`,
                    }
                  }}
                >
                  {/* Status stripe */}
                  <Box sx={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                    bgcolor: statusCfg.color,
                    opacity: 0.8
                  }} />

                  <Box sx={{ p: { xs: 2.5, md: 3 }, pl: { xs: 3.5, md: 4 } }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* ── Avatar + Name ── */}
                      <Grid item xs={12} md={3.5}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ position: "relative", flexShrink: 0 }}>
                            <Avatar sx={{
                              width: 52, height: 52, borderRadius: 3,
                              background: `linear-gradient(135deg, ${statusCfg.color}22, ${statusCfg.color}44)`,
                              color: statusCfg.color,
                              fontWeight: 1000, fontSize: "1.3rem",
                              border: `1.5px solid ${statusCfg.color}44`
                            }}>
                              {app.name?.[0]?.toUpperCase() || "?"}
                            </Avatar>
                            <Box sx={{
                              position: "absolute", bottom: -3, right: -3,
                              width: 16, height: 16, borderRadius: "50%",
                              bgcolor: isApproved ? "#10b981" : isRejected ? "#ef4444" : "#f59e0b",
                              border: `2px solid ${isDark ? "#0f172a" : "#fff"}`,
                              display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                              {isApproved
                                ? <CheckCircle sx={{ fontSize: 9, color: "white" }} />
                                : isRejected
                                  ? <Cancel sx={{ fontSize: 9, color: "white" }} />
                                  : <Circle sx={{ fontSize: 7, color: "white" }} />
                              }
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={1000} sx={{ lineHeight: 1.2 }}>
                              {app.name || "Unknown"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                              <EmailIcon sx={{ fontSize: 11 }} />
                              {app.email || "—"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* ── Department ── */}
                      <Grid item xs={12} md={2.5}>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <SchoolIcon sx={{ fontSize: 14, color: "primary.main", opacity: 0.7 }} />
                            <Typography variant="body2" fontWeight={900} noWrap>
                              {app.intendedMajor || app.college || app.department || "—"}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ pl: 2.8, fontSize: "0.65rem" }}>
                            STUDENT CANDIDATE
                          </Typography>
                        </Stack>
                      </Grid>

                      {/* ── Reference ── */}
                      <Grid item xs={6} md={2}>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5, fontSize: "0.6rem", display: "block" }}>
                          REF ID
                        </Typography>
                        <Typography variant="body2" fontWeight={900} sx={{ fontFamily: "monospace", letterSpacing: 1, fontSize: "0.8rem" }}>
                          {app.referenceId?.slice(-8).toUpperCase() || "N/A"}
                        </Typography>
                      </Grid>

                      {/* ── Status ── */}
                      <Grid item xs={6} md={1.5}>
                        <Box sx={{
                          display: "inline-flex", alignItems: "center", gap: 0.6,
                          px: 1.5, py: 0.6, borderRadius: 2,
                          bgcolor: statusCfg.bg,
                          border: `1px solid ${statusCfg.border}`
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: statusCfg.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: "0.6rem", fontWeight: 900, color: statusCfg.color, letterSpacing: 0.5 }}>
                            {statusCfg.label}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "block", mt: 0.5, fontSize: "0.6rem", opacity: 0.6 }}>
                          {new Date(app.updatedAt || app.createdAt || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Grid>

                      {/* ── Actions ── */}
                      <Grid item xs={12} md={2.5}>
                        {isAwaitingAuth ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              startIcon={<ThumbUp sx={{ fontSize: 15 }} />}
                              onClick={() => handleReviewApplication(app)}
                              sx={{
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 900,
                                py: 1,
                                fontSize: "0.78rem",
                                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                                "&:hover": { background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)", transform: "scale(1.02)" }
                              }}
                            >
                              Authenticate
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ThumbDown sx={{ fontSize: 15 }} />}
                              onClick={() => handleRejectApplication(app)}
                              sx={{
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 900,
                                py: 1,
                                fontSize: "0.78rem",
                                minWidth: 0,
                                px: 1.5,
                                borderColor: alpha(theme.palette.error.main, 0.4),
                                color: "error.main",
                                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.07), borderColor: "error.main" }
                              }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : (
                          <Box sx={{
                            display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 1, borderRadius: 2.5,
                            bgcolor: isApproved ? alpha("#10b981", 0.07) : alpha("#ef4444", 0.07),
                            border: `1px solid ${isApproved ? alpha("#10b981", 0.2) : alpha("#ef4444", 0.2)}`
                          }}>
                            {isApproved
                              ? <><VerifiedUser sx={{ fontSize: 16, color: "#10b981" }} /><Typography variant="caption" fontWeight={900} color="#10b981">Provisioned</Typography></>
                              : <><Cancel sx={{ fontSize: 16, color: "#ef4444" }} /><Typography variant="caption" fontWeight={900} color="#ef4444">Rejected</Typography></>
                            }
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Box sx={{
            py: 14, textAlign: "center",
            bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.015)",
            borderRadius: 6,
            border: `1px dashed ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
            mb: 8
          }}>
            <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: alpha(theme.palette.primary.main, 0.06), display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
              <AssignmentTurnedIn sx={{ fontSize: 38, color: "primary.main", opacity: 0.3 }} />
            </Box>
            <Typography variant="h6" fontWeight={1000} color="text.secondary">Queue Clear</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.5 }}>
              {search ? "No applications match your search." : "No applications in this queue."}
            </Typography>
          </Box>
        )}

        {/* ── Student Clearance Section ── */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight={1000} sx={{ letterSpacing: -0.5, fontFamily: "Outfit, sans-serif" }}>
                Student Clearance Queue
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1, fontSize: "0.65rem", opacity: 0.7 }}>
                DEACTIVATION PROTOCOLS
              </Typography>
            </Box>
            <Chip
              label={`${clearanceStudents.length} PENDING`}
              size="small"
              sx={{ fontWeight: 900, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, borderRadius: 1.5 }}
            />
          </Box>

          {clearanceStudents.length > 0 ? (
            <Stack spacing={1.5}>
              {clearanceStudents.map((student, i) => (
                <Card key={i} sx={{
                  borderRadius: 3,
                  background: isDark ? "rgba(239,68,68,0.04)" : "rgba(239,68,68,0.02)",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  backdropFilter: "blur(10px)",
                }}>
                  <Box sx={{ p: 2.5 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", fontWeight: 900 }}>
                            {student.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={900}>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{student.email}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" fontWeight={800}>{student.department || "N/A"}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>STUDENT</Typography>
                      </Grid>
                      <Grid item xs={6} md={2.5}>
                        <Chip
                          label={student.status?.toUpperCase()}
                          size="small"
                          sx={{ fontWeight: 900, fontSize: "0.6rem", borderRadius: 1.5, color: "error.main", bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.5}>
                        <Button
                          variant="contained" fullWidth size="small" color="error"
                          onClick={() => handleDeactivateStudent && handleDeactivateStudent(student)}
                          sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 900, boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
                        >
                          Deactivate Account
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box sx={{ py: 8, textAlign: "center", bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.015)", borderRadius: 4, border: `1px dashed ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}` }}>
              <VerifiedUser sx={{ fontSize: 36, color: "success.main", opacity: 0.3, mb: 1 }} />
              <Typography fontWeight={1000} color="text.secondary" variant="body2">ALL CLEARANCE PROTOCOLS RESOLVED</Typography>
            </Box>
          )}
        </Box>

        {/* ── Security Disclaimer ── */}
        <Box sx={{
          mt: 6, p: 3, borderRadius: 4,
          bgcolor: alpha(theme.palette.warning.main, 0.04),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          display: "flex", alignItems: "center", gap: 2.5
        }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: alpha(theme.palette.warning.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield sx={{ color: "warning.main", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={1000} color="warning.main" sx={{ letterSpacing: 0.5 }}>
              SECURITY PROTOCOL NOTICE
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              Authenticating a candidate will open the provisioning dialog to create their university account. Provisioning forces a password rotation on first login.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default ApplicationsTab;
