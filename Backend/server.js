import express from "express";
import dotenv from "dotenv";
import http from 'http';
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.RZP_WEBHOOK_SECRET; // set in Razorpay Dashboard
  const payload = req.body; // Buffer (raw)
  const actualSignature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (expectedSignature === actualSignature) {
    // process the webhook (e.g., payment.captured, order.paid)
    res.status(200).send('ok');
  } else {
    res.status(400).send('invalid signature');
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
