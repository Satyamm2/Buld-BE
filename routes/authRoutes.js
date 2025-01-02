const express = require("express");
const { registerUser, authenticateUser } = require("../services/authService");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { payload } = req.body;

  if (
    !payload.firstName ||
    !payload.lastName ||
    !payload.username ||
    !payload.email ||
    !payload.companyName ||
    !payload.mobileNumber ||
    !payload.comp_reg_no ||
    !payload.password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await registerUser(payload);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({ message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, sessionData } = await authenticateUser(email, password);
    res.status(200).json({ message: "Login successful", token, sessionData });
  } catch (error) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({ message });
  }
});

module.exports = router;
