import React from "react";
import {
  Box, Grid, Card, Typography, Button, useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Description, GetApp, Timeline, PieChart, Assessment
} from "@mui/icons-material";

const ReportsTab = ({
  handleDownloadReport,
  downloadLoading,
  gradients,
  glassStyle
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Grid container spacing={3}>
        {[
          { title: "Strategic Enrollment Overview", desc: "Full breakdown of college & department enrollment metrics.", icon: <Assessment />, color: "#3b82f6", type: "ENROLLMENT" },
          { title: "Financial Intelligence Dossier", desc: "Detailed revenue streams and financial allocation report.", icon: <PieChart />, color: "#8b5cf6", type: "FINANCIAL" },
          { title: "Operational Velocity Analysis", desc: "Systems performance and resource utilization telemetrics.", icon: <Timeline />, color: "#10b981", type: "OPERATIONAL" },
          { title: "Security Threat Intelligence", desc: "Global audit of security events and tactical breaches.", icon: <Description />, color: "#ef4444", type: "SECURITY" }
        ].map((report, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card sx={{ 
              ...glassStyle, borderRadius: 5, p: 4, 
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 3, alignItems: 'center'
            }}>
              <Box sx={{ 
                width: 64, height: 64, borderRadius: 3,
                bgcolor: alpha(report.color, 0.1), color: report.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {report.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={900}>{report.title}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 2 }}>{report.desc}</Typography>
                <Button
                  variant="contained" size="small" startIcon={<GetApp />}
                  disabled={downloadLoading === report.type}
                  onClick={() => handleDownloadReport(report.type)}
                  sx={{ 
                    borderRadius: 2, textTransform: "none", fontWeight: 1000,
                    bgcolor: report.color, '&:hover': { bgcolor: alpha(report.color, 0.8) }
                  }}
                >
                  {downloadLoading === report.type ? "Synthesizing..." : "Download intelligence"}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, borderRadius: 5, border: '1px dotted rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>Custom intelligence queries and deep-dive analytics available via Command Console.</Typography>
      </Box>
    </Box>
  );
};

export default ReportsTab;
