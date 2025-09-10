import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { CartContext } from "./cartContex.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const { cart } = useContext(CartContext);

  const cartItemsCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning fs-3" to="/">
          👗 CostumeRent
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={isActive('/')} to="/">
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/vehicles')} to="/vehicles">
                👗 Browse Costumes
              </Link>
            </li>
            
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className={isActive('/cart')} to="/cart">
                    🛒 Cart
                    {cartItemsCount > 0 && (
                      <span className="badge bg-warning text-dark ms-1 rounded-pill">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </li>
                
                <li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle d-flex align-items-center"
    href="#"
    id="userDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <div
      className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
      style={{ width: "32px", height: "32px", fontSize: "14px" }}
    >
      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
    </div>
    {currentUser?.name || "User"}
  </a>
  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
    <li>
      <span className="dropdown-item-text">
        <small className="text-muted">Signed in as</small>
        <br />
        <strong>{currentUser?.email || "guest@example.com"}</strong>
      </span>
    </li>
    <li><hr className="dropdown-divider" /></li>
    <li>
      <Link className="dropdown-item" to="/ProfileUpdate">
        👤 My Profile
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/orders">
        📦 My Orders
      </Link>
    </li>
    <li><hr className="dropdown-divider" /></li>
    <li>
      <button className="dropdown-item text-danger" onClick={handleLogout}>
        🚪 Logout
      </button>
    </li>
  </ul>
</li>

              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-warning me-2" to="/login">
                    🔑 Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning" to="/register">
                    📝 Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;