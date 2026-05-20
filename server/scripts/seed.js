const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config({ path: __dirname + "/../.env" });

const connectDB = require("../config/db");
const User = require("../models/User");
const College = require("../models/College");
const Department = require("../models/Department");

const demoColleges = [
  {
    name: "Engineering & Technology",
    code: "ENG",
    description: "The College of Engineering and Technology offers cutting edge research and top-tier technical education.",
    deanName: "Dean James Moriarty",
    deanEmail: "dean@university.edu",
    color: "#1e40af",
  },
];

const demoDepartments = [
  {
    name: "Computer Science",
    code: "CS",
    description: "Study of hardware, software, and advanced computational algorithms.",
    collegeName: "Engineering & Technology",
    headName: "Dr. Alan Turing",
    headEmail: "head@university.edu",
    requirements: "High school background in Mathematics and Physics.",
    seats: 150,
  },
];

const demoAccounts = [
  {
    name: "System Administrator",
    email: "admin@university.edu",
    password: "password123",
    role: "admin",
  },
  {
    name: "Official Registrar",
    email: "registrar@university.edu",
    password: "password123",
    role: "registrar",
  },
  {
    name: "Dean James Moriarty",
    email: "dean@university.edu",
    password: "password123",
    role: "college_admin",
    college: "Engineering & Technology",
  },
  {
    name: "Dr. Alan Turing",
    email: "head@university.edu",
    password: "password123",
    role: "faculty",
    department: "Computer Science",
  },
  {
    name: "Dr. Sarah Mills",
    email: "teacher@university.edu",
    password: "password123",
    role: "teacher",
    employeeId: "EMP-2025-001",
    position: "Associate Professor",
    department: "Computer Science",
  },
  {
    name: "Alex Johnson",
    email: "student@university.edu",
    password: "password123",
    role: "student",
    studentId: "STU-2024-0142",
    year: "2nd Year",
  },
];

async function seed() {
  await connectDB();

  console.log("🌱 Seeding academic infrastructure...");

  // Seed Colleges
  for (const c of demoColleges) {
    try {
      const exists = await College.findOne({ code: c.code });
      if (!exists) {
        await College.create(c);
        console.log(`✅ College Created: ${c.name}`);
      } else {
        console.log(`ℹ️  College already exists: ${c.name}`);
      }
    } catch (err) {
      console.error(`❌ Error creating college ${c.name}:`, err.message);
    }
  }

  // Seed Departments
  for (const d of demoDepartments) {
    try {
      const college = await College.findOne({ name: d.collegeName });
      if (college) {
        const exists = await Department.findOne({ code: d.code });
        if (!exists) {
          const deptData = { ...d, collegeId: college._id };
          delete deptData.collegeName;
          await Department.create(deptData);
          console.log(`✅ Department Created: ${d.name}`);
        } else {
          console.log(`ℹ️  Department already exists: ${d.name}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error creating department ${d.name}:`, err.message);
    }
  }

  console.log("🌱 Seeding demo accounts...");

  for (const account of demoAccounts) {
    try {
      const exists = await User.findOne({ email: account.email });
      if (exists) {
        console.log(`⚠️  User already exists: ${account.email}`);
        continue;
      }
      await User.create(account);
      console.log(`✅ User Created: ${account.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${account.email}:`, error.message);
    }
  }

  console.log("\n✅ Seeding complete.");
  process.exit(0);
}

seed();
