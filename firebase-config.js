// ============================================================
// RESILIENCE OS AI - FIREBASE CONFIGURATION
// ============================================================

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// ============================================================
// FIREBASE PROJECT CONFIGURATION
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyC0LjcBj175G5GdADPoZreiyx-zHJIXDqA",
  authDomain: "resilience-os-ai.firebaseapp.com",
  projectId: "resilience-os-ai",
  storageBucket: "resilience-os-ai.firebasestorage.app",
  messagingSenderId: "1089911052030",
  appId: "1:1089911052030:web:ec7e2f738928904937b7af",
  measurementId: "G-G9S0YK7WGT"
};

// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

// ============================================================
// INITIALIZE AUTHENTICATION
// ============================================================

const auth = getAuth(app);

// ============================================================
// KEEP USER LOGGED IN
// ============================================================

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase authentication persistence enabled.");
  })
  .catch((error) => {
    console.error("Firebase persistence error:", error);
  });

// ============================================================
// EXPORT
// ============================================================

export { app, auth };
