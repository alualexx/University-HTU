const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const eventBus = require('./events/eventBus');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[HTTU-EMS] ${req.method} ${req.url}`);
  next();
});

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Ethiopia Holy Trinity Theology University (HTTU)',
    system: 'Enterprise Management System (HTTU-EMS)',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// System Event Audit Trail
app.get('/api/v1/events/audit', (req, res) => {
  res.json({
    success: true,
    count: eventBus.history.length,
    events: eventBus.getAuditTrail(100)
  });
});

// Mount Domain Subsystem Routes with versioned and unversioned paths
const authRoutes = require('./routes/authRoutes');
const academicRoutes = require('./routes/academicRoutes');
const sisRoutes = require('./routes/sisRoutes');
const lmsRoutes = require('./routes/lmsRoutes');
const hrRoutes = require('./routes/hrRoutes');
const libraryRoutes = require('./routes/libraryRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/v1/academic', academicRoutes);
app.use('/api/academic', academicRoutes);

app.use('/api/v1/sis', sisRoutes);
app.use('/api/sis', sisRoutes);

app.use('/api/v1/lms', lmsRoutes);
app.use('/api/lms', lmsRoutes);

app.use('/api/v1/hr', hrRoutes);
app.use('/api/hr', hrRoutes);

app.use('/api/v1/library', libraryRoutes);
app.use('/api/library', libraryRoutes);

// Direct shortcuts for core collections
app.use('/api/departments', (req, res, next) => { req.url = '/departments'; academicRoutes(req, res, next); });
app.use('/api/programs', (req, res, next) => { req.url = '/programs'; academicRoutes(req, res, next); });
app.use('/api/courses', (req, res, next) => { req.url = '/courses'; academicRoutes(req, res, next); });
app.use('/api/students', (req, res, next) => { req.url = '/students'; sisRoutes(req, res, next); });
app.use('/api/applications', (req, res, next) => { req.url = '/admissions/applications'; sisRoutes(req, res, next); });


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requested_url: req.url,
    institution: 'Ethiopia Holy Trinity Theology University'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[HTTU-EMS Error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` Ethiopia Holy Trinity Theology University (HTTU)`);
    console.log(` Enterprise Management System - API Gateway running on port ${PORT}`);
    console.log(` Academic, SIS, LMS, HR, and Library Subsystems ACTIVE`);
    console.log(`================================================================`);
  });
}

module.exports = app;
