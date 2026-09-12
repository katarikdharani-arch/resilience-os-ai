const express = require("express");
const router = express.Router();

const { getDb } = require("../firebase");
const { authenticate } = require("../middleware/auth");
const { success, error } = require("../utils");

router.post("/activate", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const {
      type = "Emergency",
      title = "Emergency SOS Alert",
      description = "Emergency assistance requested.",
      location = "Current GPS location",
      latitude,
      longitude
    } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return error(
        res,
        "Latitude and longitude are required for SOS.",
        400
      );
    }

    const sosId = `SOS-${Date.now()}`;

    const sos = {
      id: sosId,
      userId: req.user.uid,
      userEmail: req.user.email || "",
      type,
      title,
      description,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    await db.collection("sosAlerts").doc(sosId).set(sos);

    return success(
      res,
      {
        message: "SOS alert created.",
        sos
      },
      201
    );
  } catch (err) {
    console.error(err);
    return error(res, "Unable to activate SOS.");
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const snapshot = await db
      .collection("sosAlerts")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const alerts = [];

    snapshot.forEach((doc) => {
      alerts.push(doc.data());
    });

    return success(res, { alerts });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to retrieve SOS alerts.");
  }
});

router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    await db.collection("sosAlerts").doc(req.params.id).update({
      status: "CANCELLED",
      cancelledAt: new Date().toISOString()
    });

    return success(res, {
      message: "SOS alert cancelled."
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to cancel SOS.");
  }
});

module.exports = router;
