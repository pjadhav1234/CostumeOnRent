import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/cartContex.jsx";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Vehicles from "./components/card.jsx";
import Cart from "./components/AddToCart.jsx";
import Checkout from "./components/checkout.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Footer from "./components/Footer.jsx";
import FloatingCircle from "./components/FloatingCircle.jsx";
import ProfileUpdate from "./components/ProfileUpdate.jsx";
import Orders from "./components/Orders.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const fullname = localStorage.getItem("fullname");
    const email = localStorage.getItem("email");

    if (token && userId && fullname && email) {
      setCurrentUser({
        id: userId,
        name: fullname,
        email: email,
        token: token
      });
    }
    setLoading(false);
  }, []);

  // Handle successful login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("cart");
    setCurrentUser(null);
  };

  if (loading) {
    return <FloatingCircle />;
  }

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar currentUser={currentUser} onLogout={handleLogout} />
          
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/checkout" element={<Checkout currentUser={currentUser} />} />
            <Route 
              path="/login" 
              element={<Login onLogin={handleLogin} />} 
            /> 
            <Route path="/register" element={<Register />} /> 
            <Route path="/cart" element={<Cart />} />
            <Route path="/loader" element={<FloatingCircle/>}/>
            <Route path="/ProfileUpdate" element={<ProfileUpdate />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
          <Footer/>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;