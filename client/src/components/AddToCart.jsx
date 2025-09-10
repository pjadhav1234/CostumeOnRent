import React, { useContext } from "react";
import { CartContext } from "./cartContex.jsx";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 1000 ? 0 : 100;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const checkoutData = {
      cart: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image,
      })),
      subtotal,
      tax,
      deliveryFee,
      total,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/vehicles"); // redirect back to items page
  };

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body py-5">
                <div className="mb-4" style={{ fontSize: "5rem" }}>
                  🛒
                </div>
                <h3 className="mb-3">Your Cart is Empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven’t added any vehicles yet.
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleContinueShopping}
                >
                  🛍️ Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 d-flex align-items-center">
            🛒 Your Cart{" "}
            <span className="badge bg-primary ms-2">
              {cart.reduce((total, item) => total + item.qty, 0)} items
            </span>
          </h2>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8">
          {cart.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm border-0">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{
                        height: "120px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text text-muted small">{item.desc}</p>
                    <div className="text-success fw-bold">
                      ₹{item.price}/day
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small">Rental Days:</label>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQty(item.id, Math.max(1, item.qty - 1))
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="form-control text-center"
                        style={{ maxWidth: "70px" }}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQty(item.id, Math.min(30, item.qty + 1))
                        }
                      >
                        +
                      </button>
                    </div>
                    <small className="text-muted">Max 30 days</small>
                  </div>
                  <div className="col-md-2 text-end">
                    <div className="fw-bold mb-2">
                      ₹{item.price * item.qty}
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={handleContinueShopping}
            >
              ← Continue Shopping
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your cart?")) {
                  cart.forEach((item) => removeFromCart(item.id));
                }
              }}
            >
              🗑️ Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-md-4">
          <div
            className="card shadow-lg border-0 sticky-top"
            style={{ top: "20px" }}
          >
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">💳 Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Service Tax (5%):</span>
                <strong>₹{tax.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>
                  Delivery Fee:
                  {deliveryFee === 0 && (
                    <small className="text-success"> (FREE!)</small>
                  )}
                </span>
                <strong>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </strong>
              </div>

              {subtotal < 1000 && (
                <div className="alert alert-info py-2 px-3 small">
                  💡 Add ₹{(1000 - subtotal).toFixed(2)} more for free delivery!
                </div>
              )}

              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total:</h5>
                <h5 className="mb-0 text-success">₹{total.toFixed(2)}</h5>
              </div>

              <button
                className="btn btn-success w-100 btn-lg"
                onClick={handleCheckout}
              >
                🚀 Proceed to Checkout
              </button>

              <div className="mt-3 small text-muted text-center">
                <div className="mb-2">🔒 Secure Checkout</div>
                <div>📞 24/7 Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
