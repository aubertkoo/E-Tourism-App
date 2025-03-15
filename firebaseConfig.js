import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Firebase Storage for profile images

// 🔥 Firebase Configuration (Keep This Private)
const firebaseConfig = {
  apiKey: "AIzaSyDbCES3wk7fKO3lQw9B30nzOLmvLqS771U",
  authDomain: "sarawak-explorer-backend.firebaseapp.com",
  projectId: "sarawak-explorer-backend",
  storageBucket: "sarawak-explorer-backend.appspot.com",  // 🔹 Fixed storage bucket URL
  messagingSenderId: "861610731806",
  appId: "1:861610731806:web:51ca6504955928ba09010f"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Enable Auth Persistence (Keeps users logged in)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Initialize Firestore (Database)
const db = getFirestore(app);

// ✅ Initialize Firebase Storage (For profile pictures & uploads)
const storage = getStorage(app);

export { auth, db, storage };
