// payment.js - Backend payment routes
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js"; // Your order model
import User from "../models/User.js"; // Your user model

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order Route
router.post("/orders", async (req, res) => {
  try {
    const { amount, currency, userId, items, billingDetails } = req.body;

    // Validate required fields
    if (!amount || !currency || !userId) {
      return res.status(400).json({
        success: false,
        message: "Amount, currency, and userId are required"
      });
    }

    // Validate amount (should be in paise)
    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount should be at least ₹1 (100 paise)"
      });
    }

    // Create order with Razorpay
    const options = {
      amount,            // in paise
      currency,
      receipt: `rcpt_${Date.now()}`,  // ✅ short unique receipt
    };

    const order = await razorpay.orders.create(options);

   res.json(order);

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});

// Verify Payment Route
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      cart,
      billingDetails,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification fields"
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Payment is verified, now save order to database
    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Create order record in database
      const newOrder = new Order({
        user: userId,
        items: cart.map(item => ({
          productName: item.name,
          price: item.price,
          qty: item.qty
        })),
        totalAmount: totalAmount,
        status: "Processing",
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        },
        billingDetails: billingDetails,
        createdAt: new Date()
      });

      const savedOrder = await newOrder.save();

      res.json({
        success: true,
        message: "Payment verified and order created successfully",
        orderId: savedOrder._id,
        order: savedOrder
      });

    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({
        success: false,
        message: "Payment verified but failed to save order",
        error: dbError.message
      });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
});

// Get Order Details Route
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId).populate('user', 'fullname email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

// Get User Orders Route
router.get("/user-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'fullname email');
    
    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message
    });
  }
});

// Update Order Status Route (for admin)
router.put("/update-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

export default router;