import React from "react";

function Checkout() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Proceed to Checkout</h2>
      <div className="row">
        {/* Billing Details */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4 mb-4">
            <h4 className="mb-3">Billing Details</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="Enter your name" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="Enter your email" />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" placeholder="Enter phone number" />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="3" placeholder="Enter your address"></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Zip Code</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Order Summary</h4>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>Car A (2 days)</span>
                <strong>₹2000</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Car B (1 day)</span>
                <strong>₹1200</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Service Charges</span>
                <strong>₹200</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span><strong>Total</strong></span>
                <strong>₹3400</strong>
              </li>
            </ul>

            <button className="btn btn-primary w-100">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
