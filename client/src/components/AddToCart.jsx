import React from "react";

function Cart() {
  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>

      {/* Cart Items */}
      <div className="row mb-3 border rounded p-3 shadow-sm align-items-center">
        <div className="col-md-2">
          <img
            src="https://via.placeholder.com/120x80"
            alt="Car"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-4">
          <h5>BMW X5</h5>
          <p className="text-muted">Luxury SUV</p>
        </div>
        <div className="col-md-2">
          <span className="fw-bold">₹5000/day</span>
        </div>
        <div className="col-md-2">
          <input type="number" min="1" defaultValue="1" className="form-control" />
        </div>
        <div className="col-md-2 text-end">
          <button className="btn btn-danger btn-sm">Remove</button>
        </div>
      </div>

      <div className="row mb-3 border rounded p-3 shadow-sm align-items-center">
        <div className="col-md-2">
          <img
            src="https://via.placeholder.com/120x80"
            alt="Car"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-4">
          <h5>Audi A6</h5>
          <p className="text-muted">Premium Sedan</p>
        </div>
        <div className="col-md-2">
          <span className="fw-bold">₹4000/day</span>
        </div>
        <div className="col-md-2">
          <input type="number" min="1" defaultValue="2" className="form-control" />
        </div>
        <div className="col-md-2 text-end">
          <button className="btn btn-danger btn-sm">Remove</button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="card shadow p-4 mt-4">
        <h4 className="mb-3">Order Summary</h4>
        <p>Subtotal: <strong>₹13,000</strong></p>
        <p>Taxes (5%): <strong>₹650</strong></p>
        <hr />
        <h5>Total: <strong>₹13,650</strong></h5>
        <button className="btn btn-primary btn-lg w-100 mt-3">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
