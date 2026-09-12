const admin = require("firebase-admin");
let firebaseApp;
function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "Firebase credentials are not configured. Firebase features will be unavailable."
    );
    return null;
  }
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n")
    })
  });
  console.log("Firebase Admin connected.");
  return firebaseApp;
}
function getDb() {
  initializeFirebase();
  if (!firebaseApp) {
    return null;
  }
  return admin.firestore();
}
function getAuth() {
  initializeFirebase();
  if (!firebaseApp) {
    return null;
  }
  return admin.auth();
}
module.exports = {
  admin,
  initializeFirebase,
  getDb,
  getAuth
};
