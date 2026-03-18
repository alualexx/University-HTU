// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmoBelhLmIumS7LN97LE6wRtozsuEZ9hM",
  authDomain: "uniweb-d02ca.firebaseapp.com",
  projectId: "uniweb-d02ca",
  storageBucket: "uniweb-d02ca.firebasestorage.app",
  messagingSenderId: "451715834438",
  appId: "1:451715834438:web:c6598c2b187e893f6c2047",
  measurementId: "G-6FRTFLZK1N"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create dummy exports to prevent app crash
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { app, auth, db, storage };