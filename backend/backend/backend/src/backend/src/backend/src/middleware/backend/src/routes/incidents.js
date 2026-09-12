const express = require("express");
const router = express.Router();

const { getDb } = require("../firebase");
const { authenticate } = require("../middleware/auth");
const { success, error } = require("../utils");

router.post("/", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const {
      type,
      title,
      description,
      location,
      latitude,
      longitude,
      risk,
      score,
      impact,
      actions,
      recoveryStatus
    } = req.body;

    if (!type || !title) {
      return error(res, "Incident type and title are required.", 400);
    }

    const incident = {
      userId: req.user.uid,
      userEmail: req.user.email || "",
      type,
      title,
      description: description || "",
      location: location || "",
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      risk: risk || "MEDIUM",
      score: Number(score || 0),
      impact: impact || {},
      actions: actions || [],
      recoveryStatus: recoveryStatus || "ASSESSMENT",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("incidents").add(incident);

    return success(
      res,
      {
        message: "Incident created successfully.",
        incident: {
          id: docRef.id,
          ...incident
        }
      },
      201
    );
  } catch (err) {
    console.error(err);
    return error(res, "Unable to create incident.");
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const snapshot = await db
      .collection("incidents")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const incidents = [];

    snapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return success(res, { incidents });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to retrieve incidents.");
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const doc = await db
      .collection("incidents")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return error(res, "Incident not found.", 404);
    }

    return success(res, {
      incident: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to retrieve incident.");
  }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const allowedFields = [
      "status",
      "risk",
      "score",
      "recoveryStatus",
      "impact",
      "actions"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updatedAt = new Date().toISOString();

    await db
      .collection("incidents")
      .doc(req.params.id)
      .update(updates);

    return success(res, {
      message: "Incident updated successfully."
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to update incident.");
  }
});

module.exports = router;
