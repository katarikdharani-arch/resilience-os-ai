const express = require("express");
const router = express.Router();

const { getDb } = require("../firebase");
const { authenticate } = require("../middleware/auth");
const { success, error } = require("../utils");

router.get("/status", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const doc = await db
      .collection("business")
      .doc("current")
      .get();

    if (!doc.exists) {
      return success(res, {
        business: {
          company: "ABC Manufacturing",
          weather: "NORMAL",
          floodRisk: 0,
          roadAccess: "OPEN",
          workforce: {
            count: 500,
            status: "NORMAL",
            impact: 0
          },
          production: {
            status: "NORMAL",
            impact: 0
          },
          inventory: {
            status: "NORMAL",
            impact: 0
          },
          logistics: {
            status: "NORMAL",
            impact: 0
          },
          suppliers: {
            status: "NORMAL",
            impact: 0
          },
          infrastructure: {
            status: "NORMAL",
            impact: 0
          },
          readiness: 92
        }
      });
    }

    return success(res, {
      business: doc.data()
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to retrieve business status.");
  }
});

router.post("/scenario", authenticate, async (req, res) => {
  try {
    const db = getDb();

    if (!db) {
      return error(res, "Firebase database is not configured.", 503);
    }

    const level = req.body.level || "normal";

    const scenarios = {
      normal: {
        company: "ABC Manufacturing",
        weather: "NORMAL",
        rainfall: 0,
        floodRisk: 5,
        roadAccess: "OPEN",
        readiness: 92
      },

      heavy_rain: {
        company: "ABC Manufacturing",
        weather: "HEAVY RAIN",
        rainfall: 72,
        floodRisk: 48,
        roadAccess: "RESTRICTED",
        readiness: 76
      },

      flood: {
        company: "ABC Manufacturing",
        weather: "FLOOD WARNING",
        rainfall: 118,
        floodRisk: 91,
        roadAccess: "BLOCKED",
        readiness: 38
      }
    };

    const scenario = scenarios[level];

    if (!scenario) {
      return error(res, "Invalid scenario.", 400);
    }

    const business = {
      ...scenario,
      workforce: {
        count: 500,
        status: level === "flood" ? "HIGH IMPACT" : "MONITOR",
        impact: level === "flood" ? 82 : level === "heavy_rain" ? 35 : 0
      },
      production: {
        status: level === "flood" ? "AT RISK" : "NORMAL",
        impact: level === "flood" ? 86 : level === "heavy_rain" ? 28 : 0
      },
      inventory: {
        status: level === "flood" ? "PROTECT" : "NORMAL",
        impact: level === "flood" ? 64 : level === "heavy_rain" ? 20 : 0
      },
      logistics: {
        status: level === "flood" ? "BLOCKED" : level === "heavy_rain" ? "RESTRICTED" : "OPEN",
        impact: level === "flood" ? 94 : level === "heavy_rain" ? 42 : 0
      },
      suppliers: {
        status: level === "flood" ? "DELAY RISK" : "NORMAL",
        impact: level === "flood" ? 51 : level === "heavy_rain" ? 18 : 0
      },
      infrastructure: {
        status: level === "flood" ? "AFFECTED" : "NORMAL",
        impact: level === "flood" ? 73 : level === "heavy_rain" ? 24 : 0
      },
      updatedAt: new Date().toISOString()
    };

    await db.collection("business").doc("current").set(business);

    return success(res, {
      message: "Business scenario updated.",
      business
    });
  } catch (err) {
    console.error(err);
    return error(res, "Unable to update business scenario.");
  }
});

module.exports = router;
