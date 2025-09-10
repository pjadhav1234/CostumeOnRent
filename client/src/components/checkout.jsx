import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./cartContex.jsx";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });

  // Get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fullname = localStorage.getItem("fullname");
    const email = localStorage.getItem("email");

    if (token && userId) {
      setUser({
        _id: userId,
        name: fullname,
        email: email
      });
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 1000 ? 0 : 100;
  const total = subtotal + tax + deliveryFee;

  const handleBillingChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validateBilling = () => {
    if (!billingDetails.address.trim()) {
      alert("Please enter your address");
      return false;
    }
    if (!billingDetails.city.trim()) {
      alert("Please enter your city");
      return false;
    }
    if (!billingDetails.state.trim()) {
      alert("Please enter your state");
      return false;
    }
    if (!billingDetails.zipCode.trim()) {
      alert("Please enter your ZIP code");
      return false;
    }
    if (!billingDetails.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateBilling()) return;
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create order on backend
      const orderResponse = await axios.post("http://localhost:5000/api/payment/orders", {
        amount: Math.round(total * 100), // Convert to paise
        currency: "INR",
        userId: user._id,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty
        })),
        billingDetails
      });

      const { id: order_id, amount, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID || "rzp_test_RAU5cmXmpaGLFH", // Replace with your actual key
        amount: amount,
        currency: currency,
        name: "CostumeRent",
        description: "Costume Rental Payment",
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id,
              cart: cart,
              billingDetails: billingDetails,
              totalAmount: total
            });

            if (verifyResponse.data.success) {
              // Clear cart and redirect to success page
              clearCart();
              alert("Payment successful! Your order has been placed.");
              navigate("/");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: billingDetails.phone
        },
        notes: {
          address: billingDetails.address,
          city: billingDetails.city
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Your cart is empty!</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate("/vehicles")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Checkout</h2>
        </div>
      </div>

      <div className="row">
        {/* Billing Details */}
        <div className="col-md-7">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Billing Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.name}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Enter your complete address"
                  value={billingDetails.address}
                  onChange={handleBillingChange}
                  required
                />
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="City"
                    value={billingDetails.city}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="State"
                    value={billingDetails.state}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    className="form-control"
                    placeholder="ZIP Code"
                    value={billingDetails.zipCode}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={billingDetails.phone}
                  onChange={handleBillingChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Cart Items */}
              <div className="mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.qty} days</small>
                    </div>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Price Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Service Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>

              {subtotal < 1000 && (
                <div className="alert alert-info py-2 px-3 small">
                  Add ₹{(1000 - subtotal).toFixed(2)} more for free delivery!
                </div>
              )}

              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5 className="text-success">₹{total.toFixed(2)}</h5>
              </div>

              <button
                className="btn btn-success w-100 btn-lg"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </button>

              <div className="mt-3 text-center small text-muted">
                <div>Secure checkout powered by Razorpay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}