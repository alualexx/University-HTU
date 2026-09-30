import React, { useState } from "react";
import {
  Box, Grid, Card, Typography, Button, useTheme, Stack, TextField, MenuItem,
  Chip, Divider, IconButton, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  GetApp as Download, Timeline, PieChart, Assessment,
  Security, People, TrendingUp, Paid,
  School, Business, Share, Print
} from "@mui/icons-material";

const ReportsTab = ({
  handleDownloadReport,
  downloadLoading,
  gradients,
  glassStyle
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState({ start: "2026-01-01", end: "2026-12-31" });
  const [format, setFormat] = useState("pdf");

  const reports = [
    { title: "Strategic Enrollment Overview", desc: "College & department enrollment metrics.", icon: <Assessment />, color: "#3b82f6", type: "ENROLLMENT" },
    { title: "Financial Intelligence Dossier", desc: "Revenue streams and budget allocation.", icon: <Paid />, color: "#8b5cf6", type: "FINANCIAL" },
    { title: "Operational Velocity Analysis", desc: "Systems performance and resource metrics.", icon: <Timeline />, color: "#10b981", type: "OPERATIONAL" },
    { title: "Security Threat Intelligence", desc: "Security events and tactical breaches.", icon: <Security />, color: "#ef4444", type: "SECURITY" },
    { title: "Faculty Productivity Report", desc: "Workload and teaching effectiveness.", icon: <Business />, color: "#f59e0b", type: "FACULTY" },
    { title: "Student Performance Analytics", desc: "GPA trends and risk assessment.", icon: <TrendingUp />, color: "#06b6d4", type: "STUDENT_PERFORMANCE" },
    { title: "Attendance Velocity Report", desc: "University-wide attendance statistics.", icon: <People />, color: "#ec4899", type: "ATTENDANCE" },
    { title: "Graduation Rate Dynamics", desc: "Retention and graduation rate trends.", icon: <School />, color: "#6366f1", type: "GRADUATION" }
  ];

  return (
    <Box>
      {/* Intelligence Controls */}
      <Card sx={{ ...glassStyle, p: 3, mb: 4, borderRadius: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={1000}>Custom Report Builder</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>CONFIGURE PARAMETERS FOR STRATEGIC SYNTHESIS</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              type="date"
              label="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              size="small"
              type="date"
              label="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              select
              size="small"
              label="Format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              sx={{ width: 100, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </Card>

      <Grid container spacing={3}>
        {reports.map((report, i) => (
          <Grid item xs={12} sm={6} lg={4} key={i}>
            <Card sx={{
              ...glassStyle, borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.05)',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-5px)', bgcolor: alpha(report.color, 0.05) }
            }}>
              <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{
                    width: 50, height: 50, borderRadius: 3,
                    bgcolor: alpha(report.color, 0.1), color: report.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {report.icon}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Print">
                      <IconButton size="small"><Print fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton size="small"><Share fontSize="small" /></IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                <Typography variant="subtitle1" fontWeight={1000} gutterBottom>{report.title}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', mb: 3, height: 32, overflow: 'hidden' }}>
                  {report.desc}
                </Typography>

                <Divider sx={{ mb: 2, opacity: 0.1 }} />

                <Button
                  fullWidth
                  variant="contained" size="small" startIcon={<Download />}
                  disabled={downloadLoading === report.type}
                  onClick={() => handleDownloadReport(report.type, format, dateRange)}
                  sx={{
                    borderRadius: 2.5, textTransform: "none", fontWeight: 1000,
                    bgcolor: report.color, '&:hover': { bgcolor: alpha(report.color, 0.8) },
                    boxShadow: `0 4px 14px ${alpha(report.color, 0.3)}`
                  }}
                >
                  {downloadLoading === report.type ? "Synthesizing..." : `Download ${format.toUpperCase()}`}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, borderRadius: 5, border: '1px dotted rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          Strategic Intelligence Nodes are updated every 24 hours.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportsTab;
