
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "uniweb-d02ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoAccounts = [
  {
    uid: "demo-student-uid",
    name: "Alex Johnson",
    email: "student@university.edu",
    role: "student",
    studentId: "STU-2024-0142",
  },
  {
    uid: "demo-teacher-uid",
    name: "Dr. Sarah Mills",
    email: "teacher@university.edu",
    role: "teacher",
    employeeId: "EMP-2025-001",
    position: "Associate Professor",
  },
  {
    uid: "demo-admin-uid",
    name: "System Administrator",
    email: "admin@university.edu",
    role: "admin",
  },
  {
    uid: "demo-registrar-uid",
    name: "Official Registrar",
    email: "registrar@university.edu",
    role: "registrar",
  },
  {
    uid: "demo-head-uid",
    name: "Dr. Alan Turing",
    email: "head@university.edu",
    role: "faculty",
    department: "Computer Science",
  }
];

async function seed() {
  console.log("Seeding demo accounts to Firestore...");
  for (const account of demoAccounts) {
    const { uid, ...data } = account;
    try {
      await setDoc(doc(db, "users", uid), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      console.log(`Successfully added ${account.email}`);
    } catch (error) {
      console.error(`Error adding ${account.email}:`, error);
    }
  }
  console.log("Seeding complete.");
  process.exit(0);
}

seed();
