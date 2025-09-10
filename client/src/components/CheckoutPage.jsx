import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState([
    { productId: "c1", name: "Red Costume", price: 50, quantity: 2 },
    { productId: "c2", name: "Blue Costume", price: 70, quantity: 1 }
  ]);

  const [billing, setBilling] = useState({
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // ✅ Create order on backend
      const { data } = await axios.post("http://localhost:5000/api/payment/orders", {
        amount: total * 100, // in paise
        currency: "INR",
        items: cart,
        userId: user?._id,
        billingDetails: billing
      });

      const options = {
        key: "rzp_test_xxxxxxx", // ✅ Your Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "RentDrive",
        description: "Order Payment",
        order_id: data.id, // ✅ order id from backend
        handler: async function (response) {
          // ✅ Verify payment on backend
          await axios.post("http://localhost:5000/api/payment/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId: user?._id,
            cart,
            billingDetails: billing
          });

          alert("Payment successful! 🎉");
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.contact || ""
        },
        theme: {
          color: "#3399cc"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Checkout</h2>

      {/* Billing Info */}
      <input
        type="text"
        placeholder="Address"
        className="border p-2 mb-2 block w-1/2"
        onChange={(e) => setBilling({ ...billing, address: e.target.value })}
      />
      <input
        type="text"
        placeholder="City"
        className="border p-2 mb-2 block w-1/2"
        onChange={(e) => setBilling({ ...billing, city: e.target.value })}
      />
      <input
        type="text"
        placeholder="State"
        className="border p-2 mb-2 block w-1/2"
        onChange={(e) => setBilling({ ...billing, state: e.target.value })}
      />
      <input
        type="text"
        placeholder="ZIP"
        className="border p-2 mb-4 block w-1/2"
        onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
      />

      {/* Cart */}
      <div className="mb-4">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between mb-2">
            <p>
              {item.name} (x{item.quantity})
            </p>
            <p>₹{item.price * item.quantity}</p>
          </div>
        ))}
        <h3 className="font-bold">Total: ₹{total}</h3>
      </div>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
}
