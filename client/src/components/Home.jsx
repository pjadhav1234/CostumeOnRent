import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./cartContex.jsx";

const Home = ({ currentUser }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const categories = [
    {
      id: 1,
      name: "Traditional Wear",
      icon: "👗",
      description: "Beautiful traditional costumes for special occasions",
      items: [
        { id: "traditional_1", name: "Silk Saree", price: 800, image: "https://via.placeholder.com/300x200?text=Silk+Saree" },
        { id: "traditional_2", name: "Lehenga Choli", price: 1200, image: "https://via.placeholder.com/300x200?text=Lehenga" },
        { id: "traditional_3", name: "Anarkali Suit", price: 900, image: "https://via.placeholder.com/300x200?text=Anarkali" },
      ]
    },
    {
      id: 2,
      name: "Party Wear",
      icon: "🎉",
      description: "Stunning party outfits for any celebration",
      items: [
        { id: "party_1", name: "Cocktail Dress", price: 600, image: "https://via.placeholder.com/300x200?text=Cocktail+Dress" },
        { id: "party_2", name: "Evening Gown", price: 1500, image: "https://via.placeholder.com/300x200?text=Evening+Gown" },
        { id: "party_3", name: "Party Jumpsuit", price: 700, image: "https://via.placeholder.com/300x200?text=Jumpsuit" },
      ]
    },
    {
      id: 3,
      name: "Casual Wear",
      icon: "👕",
      description: "Comfortable and stylish casual outfits",
      items: [
        { id: "casual_1", name: "Designer Top", price: 300, image: "https://via.placeholder.com/300x200?text=Designer+Top" },
        { id: "casual_2", name: "Casual Dress", price: 400, image: "https://via.placeholder.com/300x200?text=Casual+Dress" },
        { id: "casual_3", name: "Denim Jacket", price: 500, image: "https://via.placeholder.com/300x200?text=Denim+Jacket" },
      ]
    },
    {
      id: 4,
      name: "Kids Wear",
      icon: "👶",
      description: "Adorable costumes for little ones",
      items: [
        { id: "kids_1", name: "Princess Dress", price: 400, image: "https://via.placeholder.com/300x200?text=Princess+Dress" },
        { id: "kids_2", name: "Superhero Costume", price: 350, image: "https://via.placeholder.com/300x200?text=Superhero" },
        { id: "kids_3", name: "Traditional Outfit", price: 450, image: "https://via.placeholder.com/300x200?text=Kids+Traditional" },
      ]
    }
  ];

  const handleQuickAdd = (item, categoryIcon) => {
    if (!currentUser) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      desc: `${categoryIcon} ${item.name} - Perfect for any occasion`,
      qty: 1,
    });

    // Show success message
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 9999;">
        ✅ ${item.name} added to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '400px'
      }}>
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Welcome to CostumeRent 👗</h1>
          <p className="lead mb-4">Rent stunning costumes for every occasion at affordable prices</p>
          {currentUser ? (
            <div>
              <h3 className="mb-4">Hello, {currentUser.name}! 👋</h3>
              <button 
                className="btn btn-warning btn-lg me-3"
                onClick={() => navigate("/vehicles")}
              >
                Browse All Costumes
              </button>
              <button 
                className="btn btn-outline-light btn-lg"
                onClick={() => navigate("/cart")}
              >
                View Cart 🛒
              </button>
            </div>
          ) : (
            <div>
              <button 
                className="btn btn-warning btn-lg me-3"
                onClick={() => navigate("/login")}
              >
                Login to Start Renting
              </button>
              <button 
                className="btn btn-outline-light btn-lg"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container my-5">
        <h2 className="text-center mb-5">Shop by Category</h2>
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-6 mb-4">
              <div className="card shadow-lg h-100 border-0">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div style={{ fontSize: '4rem' }}>{category.icon}</div>
                    <h4 className="card-title mt-3">{category.name}</h4>
                    <p className="card-text text-muted">{category.description}</p>
                  </div>
                  
                  {/* Quick Add Items */}
                  <div className="row">
                    {category.items.map((item) => (
                      <div key={item.id} className="col-4 mb-3">
                        <div className="text-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="img-fluid rounded mb-2"
                            style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                          />
                          <p className="small mb-1">{item.name}</p>
                          <p className="small text-success fw-bold">₹{item.price}/day</p>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleQuickAdd(item, category.icon)}
                            disabled={!currentUser}
                          >
                            {currentUser ? '+ Add' : '🔒'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate("/vehicles")}
                    >
                      View All {category.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose CostumeRent?</h2>
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3" style={{ fontSize: '3rem' }}>💰</div>
              <h5>Affordable Prices</h5>
              <p>Get premium costumes at fraction of retail cost</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3" style={{ fontSize: '3rem' }}>🚚</div>
              <h5>Free Delivery</h5>
              <p>Doorstep delivery and pickup at no extra cost</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="mb-3" style={{ fontSize: '3rem' }}>✨</div>
              <h5>Quality Assured</h5>
              <p>Professional cleaning and quality check for every item</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;