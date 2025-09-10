import express from "express";
import Order from "../models/order.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(400).json({ message: "Error creating order", error: err.message });
  }
});


// Get order history for logged-in user
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (admin/for testing)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Get all orders for a user
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// 📌 Update order status & tracking
router.put("/update-tracking/:orderId", async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, trackingNumber },
      { new: true }
    );
    res.json({ message: "Order updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
});


export default router;
