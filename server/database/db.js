const seedData = require('./seedData');
const { v4: uuidv4 } = require('uuid');

class HTTUDatabase {
  constructor() {
    this.data = JSON.parse(JSON.stringify(seedData));
  }

  // Generic Query Helpers
  find(collection, predicate = () => true) {
    if (!this.data[collection]) return [];
    return this.data[collection].filter(predicate);
  }

  findOne(collection, predicate) {
    if (!this.data[collection]) return null;
    return this.data[collection].find(predicate) || null;
  }

  findById(collection, id) {
    return this.findOne(collection, item => item.id === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const record = {
      id: item.id || uuidv4(),
      ...item,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data[collection].push(record);
    return record;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const initialLen = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    return this.data[collection].length < initialLen;
  }

  // --- Theological & Domain-Specific Business Logic ---

  /**
   * Check scheduling conflict for course offerings
   */
  checkOfferingConflicts({ faculty_id, room_id, semester_id, start_time, end_time, days_of_week }) {
    const offerings = this.find('course_offerings', off => 
      off.semester_id === semester_id && off.status !== 'cancelled'
    );

    const conflicts = [];
    for (const off of offerings) {
      // Check days intersection
      const sharedDays = (off.days_of_week || []).some(d => (days_of_week || []).includes(d));
      if (!sharedDays) continue;

      // Time overlap check: startA < endB && endA > startB
      const timeOverlap = off.start_time < end_time && off.end_time > start_time;
      if (!timeOverlap) continue;

      if (faculty_id && off.faculty_id === faculty_id) {
        conflicts.push({
          type: 'faculty',
          message: `Faculty member is already scheduled in offering ${off.id} at this time`,
          conflicting_offering_id: off.id
        });
      }

      if (room_id && off.room_id === room_id) {
        conflicts.push({
          type: 'room',
          message: `Room is already occupied by offering ${off.id} at this time`,
          conflicting_offering_id: off.id
        });
      }
    }

    return {
      has_conflicts: conflicts.length > 0,
      conflicts
    };
  }

  /**
   * Prerequisite Validation: requires prerequisite course passed with C- or better
   */
  validatePrerequisites(student_id, course_id) {
    const prereqs = this.find('course_prerequisites', p => p.course_id === course_id);
    if (prereqs.length === 0) return { valid: true };

    const studentEnrollments = this.find('enrollments', e => e.student_id === student_id).map(e => e.id);
    const registrations = this.find('course_registrations', r => 
      studentEnrollments.includes(r.enrollment_id) && r.status === 'completed'
    );

    const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
    for (const pr of prereqs) {
      const passed = registrations.some(reg => {
        const off = this.findById('course_offerings', reg.course_offering_id);
        return off && off.course_id === pr.prerequisite_course_id && validGrades.includes(reg.grade);
      });

      if (!passed) {
        const prereqCourse = this.findById('courses', pr.prerequisite_course_id);
        return {
          valid: false,
          missingCourse: prereqCourse ? prereqCourse.course_code : pr.prerequisite_course_id,
          message: `Prerequisites not met: ${prereqCourse ? prereqCourse.course_code : 'Required course'} completed with grade C- or better required.`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Calculate GPA and determine Academic Standing
   */
  calculateGPA(student_id) {
    const gradePointMap = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };

    const studentEnrollments = this.find('enrollments', e => e.student_id === student_id);
    let totalPoints = 0;
    let totalCredits = 0;

    for (const enr of studentEnrollments) {
      const regs = this.find('course_registrations', r => r.enrollment_id === enr.id && r.grade);
      for (const reg of regs) {
        if (gradePointMap[reg.grade] !== undefined) {
          totalPoints += gradePointMap[reg.grade] * reg.credits;
          totalCredits += reg.credits;
        }
      }
    }

    const cumulativeGpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0.0;
    
    // Standing determination
    let standing = 'good_standing';
    if (cumulativeGpa < 2.0) {
      standing = 'probation';
    }

    return {
      cumulative_gpa: cumulativeGpa,
      total_credits: totalCredits,
      standing,
      is_deans_list: cumulativeGpa >= 3.5 && totalCredits >= 12
    };
  }

  /**
   * Library Circulation: Borrowing Limits & Overdue Fines
   */
  getBorrowingPrivilege(member_type) {
    const privileges = {
      student: { max_books: 5, loan_days: 14, max_renewals: 2, overdue_rate: 200, reserve_rate: 500 }, // in santim (2 ETB / 5 ETB)
      faculty: { max_books: 10, loan_days: 30, max_renewals: 2, overdue_rate: 200, reserve_rate: 500 },
      staff: { max_books: 5, loan_days: 21, max_renewals: 2, overdue_rate: 200, reserve_rate: 500 },
      external: { max_books: 3, loan_days: 7, max_renewals: 2, overdue_rate: 200, reserve_rate: 500 }
    };
    return privileges[member_type] || privileges.student;
  }
}

const db = new HTTUDatabase();
module.exports = db;
