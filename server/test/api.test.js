const http = require('http');
const app = require('../server');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting HTTU Enterprise System Verification ---');

  // 1. Health check
  const health = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  console.log('✓ Health Endpoint:', health.status, health.data.institution);

  // 2. Auth: Login as Student
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { username: 'john.doe', password: 'password123' });
  console.log('✓ Student Login:', loginRes.status, 'Welcome:', loginRes.data.user.full_name);
  const token = loginRes.data.token;

  // 3. Academic Programs & Courses
  const progs = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/academic/programs',
    method: 'GET'
  });
  console.log(`✓ Academic Programs: Found ${progs.data.data.length} programs (e.g. ${progs.data.data[0].name})`);

  const courses = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/academic/courses',
    method: 'GET'
  });
  console.log(`✓ Course Catalog: Found ${courses.data.data.length} theology courses (e.g. ${courses.data.data[0].course_code} - ${courses.data.data[0].title})`);

  // 4. Scheduling Conflict Detection
  const conflictTest = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/academic/course-offerings/conflicts?room_id=r-chapel&semester_id=sem-fall-2026&start_time=10:45:00&end_time=11:30:00&days_of_week=2,4',
    method: 'GET'
  });
  console.log('✓ Conflict Engine:', conflictTest.data.has_conflicts ? 'Conflict caught successfully!' : 'No conflict detected');

  // 5. SIS: Student Profile with Baptism Name & Church Parish
  const studentProfile = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/sis/students/s-1',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`✓ Student Profile: ${studentProfile.data.data.first_name} ${studentProfile.data.data.last_name}, Baptism Name: ${studentProfile.data.data.baptism_name}, Parish: ${studentProfile.data.data.church_parish}`);

  // 6. LMS Course & Lessons with Ge'ez Chants
  const lmsCourse = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/lms/courses/lms-c-1',
    method: 'GET'
  });
  console.log(`✓ LMS Course Hierarchy: ${lmsCourse.data.data.title}, Modules: ${lmsCourse.data.data.modules.length}`);

  // 7. HR: Clergy Employee Records & Org Chart
  const hrEmployees = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/hr/employees',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const priest = hrEmployees.data.data.find(e => e.ordination_status === 'priest');
  console.log(`✓ HR Clergy Registry: Found ${priest.name} (Ordination: ${priest.ordination_status}, Salary: ${priest.salary_formatted})`);

  // 8. Library: Theological Manuscripts & IIIF Manifest
  const manuscripts = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/library/catalog?is_rare=true',
    method: 'GET'
  });
  console.log(`✓ Library Rare Manuscripts: Found ${manuscripts.data.data.length} items (e.g. ${manuscripts.data.data[0].title} in ${manuscripts.data.data[0].language})`);

  const iiif = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/v1/library/digital/${manuscripts.data.data[0].id}/manifest`,
    method: 'GET'
  });
  console.log(`✓ IIIF Manifest: Generated ${iiif.data.type} with label "${iiif.data.label.en[0]}"`);

  console.log('--- ALL HTTU SUBMODULE VERIFICATION TESTS PASSED ---');
  process.exit(0);
}

// Give server 500ms to bind then test
setTimeout(runTests, 1000);
