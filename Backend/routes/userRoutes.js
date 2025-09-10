import express from "express";
import User from "../models/User.js";  // your User model
import { verifyToken } from "../middleware/authMiddleware.js"; // JWT middleware

const router = express.Router();

// Update Profile
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, contact, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // user id from JWT middleware
      { name, email, contact, location },
      { new: true }
    ).select("-password"); // never send password back

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
