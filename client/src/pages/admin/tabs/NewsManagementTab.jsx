import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Grid, Card, Typography, Stack, Button, IconButton, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Divider, TextField, MenuItem, useTheme, alpha,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Snackbar, Alert, Tooltip
} from "@mui/material";
import {
  Campaign, PostAdd, Schedule, Send, Delete, Edit, Group,
  School, AdminPanelSettings, Visibility, FilterList, Close, Save,
  DraftsOutlined, CheckCircleOutlined, ScheduleOutlined
} from "@mui/icons-material";
import { announcementsAPI } from "../../../services/api";

const STATUS_COLORS = {
  published: "#10b981",
  draft: "#94a3b8",
  scheduled: "#3b82f6",
};

export default function NewsManagementTab() {
  const theme = useTheme();
  const [subTab, setSubTab] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // Composer state
  const [form, setForm] = useState({ title: "", content: "", audience: "all", priority: "normal", status: "draft", scheduledDate: "" });
  const [editId, setEditId] = useState(null);

  // View Dialog
  const [viewDoc, setViewDoc] = useState(null);

  const glassStyle = {
    background: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(32px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.05)",
  };

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await announcementsAPI.getAll();
      setAnnouncements(res.data || []);
    } catch (err) {
      showSnack("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const handleDeploy = async () => {
    if (!form.title || !form.content) return showSnack("Title and content are required.", "warning");
    setSaving(true);
    const payload = {
      title: form.title,
      body: form.content,
      targetAudience: form.audience,
      priority: form.priority,
      status: form.status || "published", // Default to published when deployed
      scheduledDate: form.scheduledDate
    };

    try {
      if (editId) {
        await announcementsAPI.update(editId, payload);
        showSnack("Dispatch updated successfully.");
      } else {
        await announcementsAPI.create(payload);
        showSnack("Dispatch deployed successfully.");
      }
      setForm({ title: "", content: "", audience: "all", priority: "normal", status: "draft", scheduledDate: "" });
      setEditId(null);
      fetchAnnouncements();
      setSubTab(0);
    } catch (err) {
      showSnack(err.response?.data?.message || "Failed to deploy dispatch.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ann) => {
    setForm({
      title: ann.title || "",
      content: ann.content || ann.body || "",
      audience: ann.audience || ann.target || "all",
      priority: ann.priority || "normal",
      status: ann.status || "draft",
      scheduledDate: ann.scheduledDate || "",
    });
    setEditId(ann._id || ann.id);
    setSubTab(1);
  };

  const handleDelete = async (ann) => {
    if (!window.confirm(`Delete "${ann.title}"?`)) return;
    try {
      await announcementsAPI.delete(ann._id || ann.id);
      showSnack("Dispatch removed.");
      fetchAnnouncements();
    } catch {
      showSnack("Failed to delete dispatch.", "error");
    }
  };

  const handleSaveDraft = async () => {
    if (!form.title) return showSnack("Title is required to save a draft.", "warning");
    setSaving(true);
    const payload = {
      title: form.title,
      body: form.content,
      targetAudience: form.audience,
      priority: form.priority,
      status: "draft",
      scheduledDate: form.scheduledDate
    };

    try {
      await announcementsAPI.create(payload);
      showSnack("Saved to Vault as Draft.");
      setForm({ title: "", content: "", audience: "all", priority: "normal", status: "draft", scheduledDate: "" });
      fetchAnnouncements();
    } catch {
      showSnack("Failed to save draft.", "error");
    } finally {
      setSaving(false);
    }
  };

  const published = announcements.filter(a => (a.status || "").toLowerCase() === "published");
  const scheduled = announcements.filter(a => (a.status || "").toLowerCase() === "scheduled");
  const drafts = announcements.filter(a => (a.status || "").toLowerCase() === "draft");

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={1000}>Strategic Communication & News</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>ORCHESTRATE UNIVERSITY-WIDE DISPATCHES, TARGETED ALERTS, AND OFFICIAL ANNOUNCEMENTS</Typography>
      </Box>

      <Tabs value={subTab} onChange={(_, v) => setSubTab(v)} sx={{ mb: 4, "& .MuiTabs-indicator": { height: 3, borderRadius: 2 }, "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: "0.9rem" } }}>
        <Tab icon={<Campaign sx={{ fontSize: 20 }} />} iconPosition="start" label="News Feed" />
        <Tab icon={<PostAdd sx={{ fontSize: 20 }} />} iconPosition="start" label="Dispatch Composer" />
        <Tab icon={<Schedule sx={{ fontSize: 20 }} />} iconPosition="start" label="Publishing Pipeline" />
      </Tabs>

      {/* ── TAB 0: News Feed ── */}
      {subTab === 0 && (
        <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={900}>Active Announcements</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>{announcements.length} total dispatches in the system</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 2.5, fontWeight: 900 }}>Filter</Button>
              <Button variant="contained" startIcon={<PostAdd />} onClick={() => { setEditId(null); setForm({ title: "", content: "", audience: "all", priority: "normal", status: "draft", scheduledDate: "" }); setSubTab(1); }} sx={{ borderRadius: 2.5, fontWeight: 900 }}>New Dispatch</Button>
            </Stack>
          </Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
          ) : announcements.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8, opacity: 0.4 }}>
              <Campaign sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={900}>No Dispatches Found</Typography>
              <Typography variant="body2">Deploy your first official communication above.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Strategic Title", "Target Audience", "Time Vector", "Status", "Actions"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 1000, color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {announcements.map((ann, i) => {
                    const status = (ann.status || "draft").toLowerCase();
                    const audience = ann.audience || ann.target || "All";
                    const date = ann.scheduledDate || ann.date || ann.createdAt;
                    return (
                      <TableRow key={ann._id || i} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                        <TableCell sx={{ fontWeight: 800 }}>{ann.title}</TableCell>
                        <TableCell>
                          <Chip label={audience} size="small"
                            icon={audience === "all" || audience === "All" ? <Group sx={{ fontSize: 14 }} /> : audience === "students" || audience === "Students" ? <School sx={{ fontSize: 14 }} /> : <AdminPanelSettings sx={{ fontSize: 14 }} />}
                            sx={{ fontWeight: 900, fontSize: "0.65rem", textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "text.secondary", fontSize: "0.8rem" }}>
                          {date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                        </TableCell>
                        <TableCell>
                          <Chip label={status.toUpperCase()} size="small"
                            sx={{ fontWeight: 900, fontSize: "0.6rem", bgcolor: alpha(STATUS_COLORS[status] || "#94a3b8", 0.12), color: STATUS_COLORS[status] || "#94a3b8" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View"><IconButton size="small" onClick={() => setViewDoc(ann)}><Visibility fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(ann)}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(ann)}><Delete fontSize="small" /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* ── TAB 1: Dispatch Composer ── */}
      {subTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Typography variant="h6" fontWeight={900} gutterBottom>
                {editId ? "Edit Dispatch" : "Official Dispatch Composer"}
              </Typography>
              <Stack spacing={3} sx={{ mt: 3 }}>
                <TextField fullWidth label="Announcement Headline" placeholder="Enter tactical title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                <TextField fullWidth multiline rows={8} label="Strategic Content" placeholder="Draft the body of your official communication..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button fullWidth variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Send />} onClick={handleDeploy} disabled={saving} sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}>
                    {saving ? "Deploying…" : editId ? "Update Dispatch" : "Deploy Dispatch"}
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<Save />} onClick={handleSaveDraft} disabled={saving} sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}>
                    Save to Vault
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
              <Typography variant="subtitle1" fontWeight={1000} gutterBottom>Transmission Config</Typography>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField select fullWidth label="Primary Audience" size="small" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
                  <MenuItem value="all">University-Wide (Global)</MenuItem>
                  <MenuItem value="students">Students Only</MenuItem>
                  <MenuItem value="faculty">Faculty & Staff</MenuItem>
                  <MenuItem value="admins">Admin Tier Only</MenuItem>
                </TextField>
                <TextField select fullWidth label="Priority Vector" size="small" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <MenuItem value="normal">Standard Dispatch</MenuItem>
                  <MenuItem value="high">High Visibility Alert</MenuItem>
                  <MenuItem value="critical">Critical Intercept</MenuItem>
                </TextField>
                <TextField select fullWidth label="Publish Status" size="small" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Publish Now</MenuItem>
                  <MenuItem value="scheduled">Schedule</MenuItem>
                </TextField>
                {form.status === "scheduled" && (
                  <TextField fullWidth label="Schedule Date" type="datetime-local" size="small" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                )}
                <Divider sx={{ opacity: 0.1 }} />
                {editId && (
                  <Button fullWidth variant="text" color="error" onClick={() => { setEditId(null); setForm({ title: "", content: "", audience: "all", priority: "normal", status: "draft", scheduledDate: "" }); }} sx={{ borderRadius: 2, fontWeight: 900 }}>
                    Cancel Edit
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ── TAB 2: Publishing Pipeline ── */}
      {subTab === 2 && (
        <Grid container spacing={3}>
          {[{ label: "Published", icon: <CheckCircleOutlined />, color: "#10b981", items: published }, { label: "Scheduled", icon: <ScheduleOutlined />, color: "#3b82f6", items: scheduled }, { label: "Drafts", icon: <DraftsOutlined />, color: "#94a3b8", items: drafts }].map(lane => (
            <Grid item xs={12} md={4} key={lane.label}>
              <Card sx={{ ...glassStyle, p: 4, borderRadius: 5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                  <Box sx={{ color: lane.color }}>{lane.icon}</Box>
                  <Typography variant="subtitle1" fontWeight={1000}>{lane.label}</Typography>
                  <Chip label={lane.items.length} size="small" sx={{ fontWeight: 900, bgcolor: alpha(lane.color, 0.1), color: lane.color, ml: "auto" }} />
                </Stack>
                {loading ? <CircularProgress size={24} /> : lane.items.length === 0 ? (
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>No dispatches in this pipeline.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {lane.items.map((ann, i) => (
                      <Box key={ann._id || i} sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <Typography variant="body2" fontWeight={900} noWrap>{ann.title}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          {ann.audience || ann.target || "All"} • {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Dialog */}
      <Dialog open={Boolean(viewDoc)} onClose={() => setViewDoc(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { ...glassStyle, borderRadius: 4, backgroundImage: "none" } }}>
        <DialogTitle sx={{ fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {viewDoc?.title}
          <IconButton onClick={() => setViewDoc(null)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={(viewDoc?.audience || viewDoc?.target || "All").toUpperCase()} size="small" sx={{ fontWeight: 900 }} />
              <Chip label={(viewDoc?.status || "draft").toUpperCase()} size="small" sx={{ fontWeight: 900, bgcolor: alpha(STATUS_COLORS[(viewDoc?.status || "draft").toLowerCase()] || "#94a3b8", 0.15), color: STATUS_COLORS[(viewDoc?.status || "draft").toLowerCase()] || "#94a3b8" }} />
              <Chip label={(viewDoc?.priority || "normal").toUpperCase()} size="small" sx={{ fontWeight: 900 }} />
            </Box>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>{viewDoc?.content || viewDoc?.body || "No content."}</Typography>
            {viewDoc?.createdAt && <Typography variant="caption" color="text.secondary">Created: {new Date(viewDoc.createdAt).toLocaleString()}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { handleEdit(viewDoc); setViewDoc(null); }} variant="outlined" startIcon={<Edit />} sx={{ borderRadius: 2, fontWeight: 900 }}>Edit</Button>
          <Button onClick={() => { handleDelete(viewDoc); setViewDoc(null); }} variant="contained" color="error" startIcon={<Delete />} sx={{ borderRadius: 2, fontWeight: 900 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
