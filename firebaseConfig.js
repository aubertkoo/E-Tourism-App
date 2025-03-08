// Import Firebase SDK
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbCES3wk7fKO3lQw9B30nzOLmvLqS771U",
  authDomain: "sarawak-explorer-backend.firebaseapp.com",
  projectId: "sarawak-explorer-backend",
  storageBucket: "sarawak-explorer-backend.firebasestorage.app",
  messagingSenderId: "861610731806",
  appId: "1:861610731806:web:51ca6504955928ba09010f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export using CommonJS syntax
module.exports = { auth, db };
