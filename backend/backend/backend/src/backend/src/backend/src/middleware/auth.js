const { getAuth } = require("../firebase");
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required."
      });
    }
    const token = header.split("Bearer ")[1];
    const auth = getAuth();
    if (!auth) {
      return res.status(503).json({
        success: false,
        message: "Firebase authentication is not configured."
      });
    }
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
}
function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const { getDb } = require("../firebase");
      const db = getDb();
      if (!db) {
        return res.status(503).json({
          success: false,
          message: "Firebase database is not configured."
        });
      }
      const userDoc = await db.collection("users").doc(req.user.uid).get();

      if (!userDoc.exists) {
        return res.status(403).json({
          success: false,
          message: "User profile not found."
        });
      }
      const userData = userDoc.data();
      if (!allowedRoles.includes(userData.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action."
        });
      }
      req.userProfile = userData;
      next();
    } catch (error) {
      console.error("Role verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to verify user role."
      });
    }
  };
}
module.exports = {
  authenticate,
  requireRole
};
