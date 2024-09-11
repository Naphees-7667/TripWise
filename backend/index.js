const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Endpoint to fetch user data from Clerk
app.get("/api/clerk-user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_BACKEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch user data" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});