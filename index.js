// index.js
const express = require("express");
const app = express();
app.use(express.json());

// Analytics object
const analytics = {
  totalClaims: 0,
  autoProcessed: 0,
  manualReview: 0,
};

// Function to route claims
const routeClaim = (claim) => {
  return claim.amount > 1000 ? "MANUAL_REVIEW" : "AUTO_PROCESS";
};

// Simulate external system (CRM / payer API)
const sendToExternalSystem = async (claim) => {
  // Simulate delay
  await new Promise((res) => setTimeout(res, 100));
  return {
    externalId: `EXT-${claim.claimId}`,
    syncedAt: new Date().toISOString(),
  };
};

// Retry wrapper
const withRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
};

// Webhook endpoint
app.post("/webhook/claim", async (req, res) => {
  try {
    const claim = req.body;

    if (!claim.claimId || !claim.patient || !claim.amount) {
      return res.status(400).json({ error: "Invalid claim payload" });
    }

    // Normalize claim
    const normalizedClaim = {
      claimId: claim.claimId,
      patient: claim.patient.trim(),
      amount: Number(claim.amount),
      payer: claim.payer || "unknown",
      status: "RECEIVED",
      receivedAt: new Date().toISOString(),
    };

    // Route claim
    const route = routeClaim(normalizedClaim);
    normalizedClaim.status = route;

    // Send to external system with retry
    const externalResponse = await withRetry(() =>
      sendToExternalSystem(normalizedClaim)
    );

    // Update analytics
    analytics.totalClaims++;
    if (route === "AUTO_PROCESS") analytics.autoProcessed++;
    if (route === "MANUAL_REVIEW") analytics.manualReview++;

    console.log("Analytics:", analytics);

    // Response
    res.status(200).json({
      message: "Claim processed successfully",
      normalizedClaim,
      externalResponse,
      analytics,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Medbill workflow automation server running on port 3000");
});
app.get('/', (req, res) => {
  res.json({
    service: "Medbill Workflow Automation API",
    status: "Running",
    endpoints: {
      webhook: "POST /webhook/claim"
    }
  });
});
