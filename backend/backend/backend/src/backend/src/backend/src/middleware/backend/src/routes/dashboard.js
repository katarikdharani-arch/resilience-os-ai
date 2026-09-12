const express = require("express");
const router = express.Router();

const { getDb } = require("../firebase");
const { authenticate } = require("../middleware/auth");
const { success, error } = require("../utils");

router.get("/", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const incidentsSnapshot = await db
      .collection("incidents")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const sosSnapshot = await db
      .collection("sosAlerts")
      .where("status", "==", "ACTIVE")
      .get();

    const incidents = [];

    incidentsSnapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const activeIncidents = incidents.filter(
      (incident) => incident.status === "ACTIVE"
    );

    const criticalIncidents = incidents.filter(
      (incident) =>
        incident.risk === "CRITICAL" ||
        Number(incident.score) >= 90
    );

    return success(res, {
      dashboard: {
        systemStatus: "ONLINE",
        risk: criticalIncidents.length > 0 ? "CRITICAL" : "LOW",
        alerts: sosSnapshot.size + activeIncidents.length,
        activeIncidents: activeIncidents.length,
        criticalIncidents: criticalIncidents.length,
        activeSOS: sosSnapshot.size,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to load dashboard.");
  }
});

module.exports = router;
