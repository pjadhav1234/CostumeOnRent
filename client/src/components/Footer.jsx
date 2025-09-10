// src/components/Footer.jsx
import React from "react";
function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">RentDrive</h4>
            <p>
              Your trusted vehicle rental partner. Book cars, bikes & SUVs
              easily with transparent pricing and quick checkout.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/vehicles" className="text-light text-decoration-none">Vehicles</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-md-3 mb-4">
            <h5>Customer Support</h5>
            <ul className="list-unstyled">
              <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
              <li><a href="/terms" className="text-light text-decoration-none">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div>
              <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>

        <hr className="border-light" />
        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} RentDrive. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
