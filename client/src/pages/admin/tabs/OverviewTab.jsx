import React, { useState } from 'react';
import {
  Box, Grid, Card, Typography, Button, Chip, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert
} from '@mui/material';
import {
  People, CheckCircle, Speed, Warning, FileDownload, Storage,
  Article, PersonAdd, Security, Lock, Refresh, ArrowForward,
  Hub, CloudQueue, Lan
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SERVICES = [
  { name: 'auth-service', version: 'v2.4.1 · 3 pods', latency: 'p95 96ms', status: 'Healthy', statusColor: '#059669', statusBg: '#ECFDF5' },
  { name: 'student-service', version: 'v2.4.0 · 3 pods', latency: 'p95 141ms', status: 'Healthy', statusColor: '#059669', statusBg: '#ECFDF5' },
  { name: 'academic-service', version: 'v2.3.8 · 4 pods', latency: 'p95 205ms', status: 'Healthy', statusColor: '#059669', statusBg: '#ECFDF5' },
  { name: 'finance-service', version: 'v2.4.1 · 3 pods', latency: 'p95 168ms', status: 'Healthy', statusColor: '#059669', statusBg: '#ECFDF5' },
  { name: 'elearning-service', version: 'v2.2.5 · 5 pods', latency: 'p95 412ms', status: 'Degraded', statusColor: '#D97706', statusBg: '#FEF3C7' },
  { name: 'library-service', version: 'v2.1.9 · 2 pods', latency: 'p95 122ms', status: 'Healthy', statusColor: '#059669', statusBg: '#ECFDF5' },
];

const AUDIT_EVENTS = [
  { time: '09:38:12', actor: 'registrar.m', action: 'certify.document', resource: 'transcript/HTTU24158', result: 'Success', resultColor: '#059669', resultBg: '#ECFDF5' },
  { time: '09:31:47', actor: 'finance.mahlet', action: 'payment.record', resource: 'RCP-2025-00618', result: 'Success', resultColor: '#059669', resultBg: '#ECFDF5' },
  { time: '09:24:03', actor: 'hr.hanna', action: 'employee.update', resource: 'EMP-2026-000123', result: 'Success', resultColor: '#059669', resultBg: '#ECFDF5' },
  { time: '09:12:55', actor: 'unknown', action: 'auth.login', resource: 'dean.abeba · 3 failures', result: 'Locked', resultColor: '#DC2626', resultBg: '#FEF2F2' },
  { time: '08:57:20', actor: 'system', action: 'backup.completed', resource: 'postgres/daily · 42.1 GB', result: 'Success', resultColor: '#059669', resultBg: '#ECFDF5' },
];

const ROLE_DATA = [
  { name: 'Students', value: 3248, color: '#0F766E' },
  { name: 'Faculty', value: 128, color: '#D9A621' },
  { name: 'Staff & admin', value: 17, color: '#7C3AED' },
  { name: 'Librarians / other', value: 9, color: '#38BDF8' },
];

export default function OverviewTab({ onNavigateTab }) {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [backupRunning, setBackupRunning] = useState(false);

  const handleRunBackup = () => {
    setBackupRunning(true);
    setTimeout(() => {
      setBackupRunning(false);
      alert("Snapshot backup completed successfully: postgres/daily-manual-0941.tar.gz (42.3 GB)");
    }, 1200);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0E2033', letterSpacing: '-0.5px' }}>
            Platform Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            University Management System · microservices health, usage and security · Wed Mar 5, 2025 09:41 EAT
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            onClick={handleRunBackup}
            disabled={backupRunning}
            startIcon={<Storage />}
            sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff', borderRadius: '8px' }}
          >
            {backupRunning ? 'Running...' : 'Run backup'}
          </Button>

          <Button
            variant="outlined"
            onClick={() => onNavigateTab ? onNavigateTab('logs') : null}
            startIcon={<Article />}
            sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, textTransform: 'none', bgcolor: '#fff', borderRadius: '8px' }}
          >
            View logs
          </Button>

          <Button
            variant="contained"
            onClick={() => setCreateUserOpen(true)}
            startIcon={<PersonAdd />}
            sx={{ bgcolor: '#D9A621', color: '#0E2033', fontWeight: 800, textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#C59318' } }}
          >
            Create user
          </Button>
        </Stack>
      </Box>

      {/* 4 Top KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Active Users (30d)
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <People fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              4,812
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              3,248 students · 145 staff · 1,419 alumni
            </Typography>
            <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ +6.1% vs last month
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Services Healthy
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hub fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              14 / 14
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              All microservices passing health checks
            </Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ 99.98% uptime (30d)
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                API Requests Today
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Speed fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              284,310
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              p95 latency 182 ms
            </Typography>
            <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ +11.4% vs yesterday
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                Open Incidents
              </Typography>
              <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Warning fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0E2033', mb: 0.5 }}>
              2
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              1 degraded · 1 scheduled maintenance
            </Typography>
            <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700, mt: 0.5, display: 'block' }}>
              ↑ +1 this week
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Service Health (4 cols), Users by Role (4 cols), Security & Access (4 cols) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Column 1: Service Health */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Service Health
              </Typography>
              <Typography variant="caption" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer' }}>
                All 14 →
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              {SERVICES.map((s) => (
                <Box key={s.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {s.version}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                      {s.latency}
                    </Typography>
                    <Chip
                      label={`• ${s.status}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: s.statusBg,
                        color: s.statusColor
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography variant="caption" sx={{ color: '#D97706', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem', lineHeight: 1.3 }}>
              elearning-service: elevated latency on video streaming endpoint · investigating (INC-2041)
            </Typography>
          </Card>
        </Grid>

        {/* Column 2: Users by Role */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Users by Role
              </Typography>
              <Select
                size="small"
                defaultValue="30"
                sx={{ borderRadius: '6px', fontSize: '0.75rem', '& .MuiSelect-select': { py: 0.3, px: 1 } }}
              >
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
              </Select>
            </Box>

            {/* Donut Chart with Total In Center */}
            <Box sx={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ROLE_DATA}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ROLE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0E2033', lineHeight: 1 }}>
                  4,812
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem' }}>
                  Users
                </Typography>
              </Box>
            </Box>

            {/* Legend Breakdown */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2 }}>
              {ROLE_DATA.map((r) => (
                <Box key={r.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color }} />
                    <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>{r.name}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0E2033' }}>{r.value.toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>

            {/* MFA Coverage Bars */}
            <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>MFA coverage (privileged)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', fontSize: '0.72rem' }}>100%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>MFA coverage (all users)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#D97706', fontSize: '0.72rem' }}>71%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={71} sx={{ height: 5, borderRadius: 2, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#D9A621' } }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Column 3: Security & Access */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Security & Access
              </Typography>
              <Chip label="• No breaches" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                    Failed sign-ins (24h)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    38 attempts · 6 accounts locked
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ borderColor: '#FDE68A', color: '#B45309', bgcolor: '#FFFBEB', fontSize: '0.72rem', py: 0.3, px: 1, textTransform: 'none' }}>
                  Monitor
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                    Rate-limit blocks (24h)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Token bucket · gateway edge
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>
                  112
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                    Expired sessions revoked
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Refresh tokens &gt; 7 days
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>
                  204
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0E2033', fontSize: '0.84rem' }}>
                    Permission changes (7d)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    RBAC role assignments
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0E2033' }}>
                  14
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', fontSize: '0.72rem', lineHeight: 1.3 }}>
              Next penetration test: Apr 2025 · OWASP Top 10 scan passed Feb 12, 2025
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Audit Trail (8 cols) & Infrastructure (4 cols) */}
      <Grid container spacing={3}>
        {/* Left: Audit Trail */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033' }}>
                Audit Trail — Recent Events
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ borderColor: '#CBD5E1', color: '#0E2033', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none' }}
              >
                Export CSV
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '1px solid #E2E8F0', py: 1, color: '#64748B', fontWeight: 800, fontSize: '0.68rem' } }}>
                    <TableCell>TIMESTAMP</TableCell>
                    <TableCell>ACTOR</TableCell>
                    <TableCell>ACTION</TableCell>
                    <TableCell>RESOURCE</TableCell>
                    <TableCell align="right">RESULT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {AUDIT_EVENTS.map((event, idx) => (
                    <TableRow key={idx} sx={{ '& td': { py: 1.2, borderBottom: '1px solid #F1F5F9', fontSize: '0.82rem' } }}>
                      <TableCell sx={{ color: '#64748B', fontFamily: 'monospace' }}>{event.time}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0E2033' }}>{event.actor}</TableCell>
                      <TableCell sx={{ color: '#334155', fontFamily: 'monospace' }}>{event.action}</TableCell>
                      <TableCell sx={{ color: '#64748B' }}>{event.resource}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={event.result}
                          size="small"
                          sx={{
                            height: 20,
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: event.resultBg,
                            color: event.resultColor
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography variant="body2" sx={{ color: '#12808C', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                View full audit trail →
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Right: Infrastructure */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0E2033', mb: 2 }}>
              Infrastructure
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Cluster</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>K8s prod · 6 nodes</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>CPU / Memory</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>41% / 58%</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Storage (MinIO)</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>2.4 TB of 8 TB</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Queue depth</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>RabbitMQ · 12 msgs</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Last backup</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669' }}>Today 03:00 · verified</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>Certificates</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0E2033' }}>TLS 1.3 · renews May 2025</Typography>
              </Box>
            </Box>

            <Typography
              variant="caption"
              onClick={() => alert("Redirecting to Prometheus & Grafana cluster dashboard...")}
              sx={{ color: '#12808C', fontWeight: 800, cursor: 'pointer', display: 'block', mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9' }}
            >
              Open monitoring (Grafana) →
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Create User Dialog */}
      <Dialog open={createUserOpen} onClose={() => setCreateUserOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0E2033', color: '#fff', fontWeight: 800 }}>Create Platform User</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full Name" placeholder="e.g. Dr. Yohannes Gebre" size="small" fullWidth />
            <TextField label="Institutional Email" placeholder="name@httu.edu.et" size="small" fullWidth />
            <Select size="small" defaultValue="faculty" fullWidth>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
              <MenuItem value="depthead">Department Head</MenuItem>
              <MenuItem value="dean">Dean</MenuItem>
              <MenuItem value="registrar">Registrar</MenuItem>
              <MenuItem value="finance">Finance Officer</MenuItem>
              <MenuItem value="hr">HR Manager</MenuItem>
              <MenuItem value="librarian">Librarian</MenuItem>
              <MenuItem value="admin">System Administrator</MenuItem>
            </Select>
            <Alert severity="info" sx={{ fontSize: '0.74rem' }}>
              Credentials and OTP provisioning key will be dispatched via institutional email and SMS.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateUserOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { alert("User provisioned with RBAC credentials."); setCreateUserOpen(false); }} sx={{ bgcolor: '#12808C', color: '#fff' }}>Provision Account</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
