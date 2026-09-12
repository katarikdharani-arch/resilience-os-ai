const express = require("express");
const router = express.Router();
const { getDb } = require("../firebase");
const { authenticate, requireRole } = require("../middleware/auth");
const { success, error } = require("../utils");
router.get("/me", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return success(res, {
        user: {
          uid: req.user.uid,
          email: req.user.email,
          role: "BUSINESS_MANAGER"
        }
      });
    }
    return success(res, {
      user: {
        uid: req.user.uid,
        ...userDoc.data()
      }
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to retrieve user profile.");
  }
});
router.post("/profile", authenticate, async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }
    const {
      name,
      role = "BUSINESS_MANAGER",
      company = "ABC Manufacturing"
    } = req.body;
    const allowedRoles = [
      "ADMIN",
      "BUSINESS_MANAGER",
      "FIELD_OFFICER"
    ];

    if (!allowedRoles.includes(role)) {
      return error(res, "Invalid user role.", 400);
    }
    await db.collection("users").doc(req.user.uid).set(
      {
        uid: req.user.uid,
        email: req.user.email || "",
        name: name || "",
        role,
        company,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return success(res, {
      message: "User profile saved."
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to save user profile.");
  }
});
router.get(
  "/",
  authenticate,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
        return error(res, "Firebase database is not configured.", 503);
      }
      const snapshot = await db
        .collection("users")
        .orderBy("updatedAt", "desc")
        .limit(100)
        .get();
      const users = [];
      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return success(res, { users });
    } catch (err) {
      console.error(err);
      return error(res, "Unable to retrieve users.");
    }
  }
);
module.exports = router;
