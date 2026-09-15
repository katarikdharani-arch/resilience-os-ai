```javascript
// ============================================================
// RESILIENCE OS AI - FIREBASE CONFIGURATION
// ============================================================
// Firebase App
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// Firebase Authentication
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// ============================================================
// FIREBASE PROJECT CONFIGURATION
// ============================================================
// IMPORTANT:
// Replace the values below with the EXACT values from:
//
// Firebase Console
// → Project Settings
// → General
// → Your apps
// → Web app
// → SDK setup and configuration
// → Config
// ============================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// ============================================================
// INITIALIZE FIREBASE
// ============================================================
const app = initializeApp(firebaseConfig);
// ============================================================
// INITIALIZE FIREBASE AUTHENTICATION
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
    console.error(
      "Firebase persistence error:",
      error
    );
  });
// ============================================================
// EXPORT
// ============================================================
export {
  app,
  auth
};
```
