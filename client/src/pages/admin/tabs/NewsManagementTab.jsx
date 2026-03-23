import React from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent, Chip, Stack, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Campaign, Add, Edit, Delete, AccessTime, Public, School, Group, Newspaper
} from "@mui/icons-material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../services/Firebase";

const NewsManagementTab = ({
  newsList,
  openNewsDialog,
  setOpenNewsDialog,
  newsForm,
  setNewsForm,
  newsLoading,
  handleSaveNews,
  gradients,
  glassStyle
}) => {
  const theme = useTheme();
  const [editingId, setEditingId] = React.useState(null);

  const handleOpenCreate = () => {
    setEditingId(null);
    setNewsForm({
      title: "", content: "", category: "announcement",
      author: "Admin",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
      readTime: "3 min read"
    });
    setOpenNewsDialog(true);
  };

  const handleOpenEdit = (news) => {
    setEditingId(news.id);
    setNewsForm({
      title: news.title || "",
      content: news.content || "",
      category: news.category || "announcement",
      author: news.author || "Admin",
      image: news.image || "",
      readTime: news.readTime || "3 min read"
    });
    setOpenNewsDialog(true);
  };

  const handleDelete = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this dispatch?")) {
      try {
        await deleteDoc(doc(db, "news", newsId));
      } catch (err) {
        console.error("News delete error:", err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={1000}>Global Dispatch Center</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
            MANAGING {newsList.length} SYSTEM-WIDE BROADCASTS
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 3, fontWeight: 900, px: 3, background: gradients[2] }}
        >
          New Dispatch
        </Button>
      </Box>

      <Grid container spacing={3}>
        {newsList.map((news) => (
          <Grid item xs={12} md={6} lg={4} key={news.id}>
            <Card sx={{ ...glassStyle, borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { borderColor: 'primary.main' } }}>
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={!news.target || news.target === 'all' ? <Public sx={{ fontSize: '14px !important' }} /> : news.target === 'students' ? <School sx={{ fontSize: '14px !important' }} /> : <Group sx={{ fontSize: '14px !important' }} />}
                    label={(news.category || news.target || 'general').toUpperCase()}
                    size="small"
                    sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.05)' }}
                  />
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit Dispatch">
                    <IconButton size="small" onClick={() => handleOpenEdit(news)} sx={{ color: 'primary.main' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Dispatch">
                    <IconButton size="small" onClick={() => handleDelete(news.id)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={900} gutterBottom sx={{ lineHeight: 1.2 }}>{news.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                  WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', fontSize: '0.85rem'
                }}>
                  {news.content}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    {news.date?.toDate
                      ? news.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Just now'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {newsList.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ ...glassStyle, borderRadius: 5, p: 10, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Campaign sx={{ fontSize: 64, opacity: 0.1, mb: 2 }} />
              <Typography variant="h6" fontWeight={800} color="text.secondary">No active dispatches found.</Typography>
              <Typography variant="body2" color="text.secondary">Create a new broadcast to notify users across the system.</Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Create / Edit Dialog */}
      <Dialog open={openNewsDialog} onClose={() => setOpenNewsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Newspaper /> {editingId ? "Edit Dispatch" : "New Global Dispatch"}
        </DialogTitle>
        <form onSubmit={handleSaveNews}>
          <DialogContent>
            <TextField fullWidth label="Title" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} margin="normal" required />
            <TextField fullWidth multiline rows={4} label="Content" value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} margin="normal" required />
            <TextField fullWidth select label="Category" value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} margin="normal">
              <MenuItem value="announcement">Announcement</MenuItem>
              <MenuItem value="update">System Update</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="event">Event</MenuItem>
            </TextField>
            <TextField fullWidth label="Author" value={newsForm.author} onChange={e => setNewsForm({ ...newsForm, author: e.target.value })} margin="normal" />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenNewsDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={newsLoading} sx={{ fontWeight: 900 }}>
              {editingId ? "Update" : "Dispatch"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default NewsManagementTab;
