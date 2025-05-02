// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDbCES3wk7fKO3lQw9B30nzOLmvLqS771U",
  authDomain: "sarawak-explorer-backend.firebaseapp.com",
  projectId: "sarawak-explorer-backend",
  storageBucket: "sarawak-explorer-backend.appspot.com",
  messagingSenderId: "861610731806",
  appId: "1:861610731806:web:51ca6504955928ba09010f"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use getAuth — NOT initializeAuth
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
