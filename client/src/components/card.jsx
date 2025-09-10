import React, { useState, useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import { CartContext } from "./cartContex.jsx";


import sareeImg from "../assets/saree.jpg";
import lehengaImg from "../assets/lehanga.webp";
import shadi_lehanga from "../assets/shadi_lehanga.jpg";
import anarkaliImg from "../assets/anarkari.jpg";
import kurta from "../assets/kurta.webp";
import skirt_top from "../assets/skirt_top.avif";


const Costumes = () => {
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle quantity increase
  const handleIncrease = (itemName) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
  };

  // Handle quantity decrease (prevent negative)
  const handleDecrease = (itemName) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: prev[itemName] > 0 ? prev[itemName] - 1 : 0,
    }));
  };

  const handleBookNow = (costume) => {
    const qty = quantities[costume.name] || 1;
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    addToCart({
      id: costume.name,
      name: costume.name,
      price: costume.price,
      image: costume.img,
      desc: costume.features.join(", "),
      qty: qty,
    });

    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 9999;">
        ✅ ${costume.name} (${qty} days) added to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);

    // Reset quantity for this item
    setQuantities(prev => ({
      ...prev,
      [costume.name]: 0
    }));

    // Navigate to cart
    navigate("/cart");
  };

  const costumes = [
    {
      name: "Traditional Silk Saree",
      price: 1,
      img: sareeImg,
      features: ["Fabric: Pure Silk", "Size: Free Size", "Color: Multiple Options", "Blouse: Included"],
    },
    {
      name: "Designer Lehenga",
      price: 1200,
      img: lehengaImg,
      features: ["Fabric: Net & Silk", "Work: Heavy Embroidery", "Dupatta: Included", "Size: S/M/L/XL"],
    },
    {
      name: "Party Wear Gown",
      price: 900,
      img: shadi_lehanga,
      features: ["Fabric: Georgette", "Style: Floor Length", "Occasion: Party/Wedding", "Size: All Sizes"],
    },
    {
      name: "Anarkali Suit",
      price: 700,
      img: anarkaliImg,
      features: ["Fabric: Cotton Silk", "Work: Block Print", "Dupatta: Yes", "Color: Various"],
    },
    {
      name: "Indo-Western Dress",
      price: 650,
      img: skirt_top,
      features: ["Fabric: Crepe", "Style: Modern", "Occasion: Casual/Party", "Size: S/M/L/XL"],
    },
    {
      name: "Traditional Sharara",
      price: 950,
      img: kurta,
      features: ["Fabric: Pure Cotton", "Work: Hand Embroidered", "Set: 3 Piece", "Size: Free Size"],
    },
  ];

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h2 className="display-4">Available Costumes</h2>
        <p className="lead text-muted">Rent beautiful costumes for any occasion</p>
      </div>
      
      <div className="row">
        {costumes.map((costume, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="card shadow-lg h-100 border-0">
              <img
                src={costume.img}
                className="card-img-top"
                alt={costume.name}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{costume.name}</h5>
                <div className="mb-3">
                  <span className="h4 text-success">₹{costume.price}</span>
                  <span className="text-muted"> / day</span>
                </div>
                
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Features:</h6>
                  <ul className="list-unstyled small">
                    {costume.features.map((feature, i) => (
                      <li key={i} className="mb-1">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  {/* Quantity Selector */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <label className="form-label me-2 mb-0">Rental Days:</label>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDecrease(costume.name)}
                          disabled={!quantities[costume.name] || quantities[costume.name] <= 0}
                        >
                          <FaMinus />
                        </button>
                        <span className="btn btn-outline-secondary btn-sm" style={{ minWidth: "50px" }}>
                          {quantities[costume.name] || 0}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleIncrease(costume.name)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Price Display */}
                  {quantities[costume.name] > 0 && (
                    <div className="mb-3 p-2 bg-light rounded">
                      <small className="text-muted">Total: </small>
                      <strong className="text-success">
                        ₹{costume.price * quantities[costume.name]}
                      </strong>
                      <small className="text-muted"> for {quantities[costume.name]} day(s)</small>
                    </div>
                  )}

                  {/* Book Now Button */}
                  <button
                    className={`btn w-100 ${quantities[costume.name] > 0 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleBookNow(costume)}
                    disabled={!quantities[costume.name] || quantities[costume.name] <= 0}
                  >
                    {quantities[costume.name] > 0 
                      ? `Add to Cart (${quantities[costume.name]} days)` 
                      : 'Select Rental Days'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">How It Works</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="mb-2" style={{ fontSize: "2rem" }}>🛍️</div>
                  <h6>Select & Add</h6>
                  <p className="small">Choose your favorite costume and rental duration</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="mb-2" style={{ fontSize: "2rem" }}>💳</div>
                  <h6>Secure Payment</h6>
                  <p className="small">Pay securely through our payment gateway</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="mb-2" style={{ fontSize: "2rem" }}>🚚</div>
                  <h6>Free Delivery</h6>
                  <p className="small">Get it delivered to your doorstep</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="mb-2" style={{ fontSize: "2rem" }}>✨</div>
                  <h6>Enjoy & Return</h6>
                  <p className="small">Enjoy your event and return when done</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costumes;