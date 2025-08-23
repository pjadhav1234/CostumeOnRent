import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Vehicles from "./components/card.jsx";
import Cart from "./components/AddToCart.jsx";
import Checkout from "./components/checkout.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Footer from "./components/Footer.jsx";
import FloatingCircle from "./components/FloatingCircle.jsx";
// import Home from "./pages/Home";
// import Vehicles from "./pages/Vehicles";
// import About from "./pages/About";
// import Login from "./pages/Login";

function App() {
  return (
    <Router>
      
      <div className="App">
        <Navbar />
        
        
        <Routes>
          <Route path="/" element={<Vehicles />} />
          <Route path="/checkout" element={<Checkout />} />
           <Route path="/login" element={<Login />} /> 
            <Route path="/Register" element={<Register />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/loader" element={<FloatingCircle/>}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
