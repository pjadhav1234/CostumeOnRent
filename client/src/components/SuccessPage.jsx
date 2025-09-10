import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const saveOrder = async () => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      const billing = JSON.parse(localStorage.getItem("billing")) || {};
      const userId = localStorage.getItem("userId");

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await axios.post("http://localhost:5000/api/payment/save-order", {
        userId,
        items,
        billingDetails: billing,
        totalAmount: total
      });
    };
    saveOrder();
  }, [searchParams]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl text-green-600">✅ Payment Successful!</h2>
      <p>Your order has been placed. Thank you for renting with us.</p>
    </div>
  );
}
