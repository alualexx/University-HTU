import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmoBelhLmIumS7LN97LE6wRtozsuEZ9hM",
  authDomain: "uniweb-d02ca.firebaseapp.com",
  projectId: "uniweb-d02ca",
  storageBucket: "uniweb-d02ca.firebasestorage.app",
  messagingSenderId: "451715834438",
  appId: "1:451715834438:web:c6598c2b187e893f6c2047",
  measurementId: "G-6FRTFLZK1N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testAdd() {
  try {
    console.log("Adding doc...");
    await addDoc(collection(db, "grading_system"), {
      test: true,
      createdAt: serverTimestamp()
    });
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testAdd();
