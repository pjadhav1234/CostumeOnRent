import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((x) => x.id === item.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map((x) =>
          x.id === item.id 
            ? { ...x, qty: x.qty + (item.qty || 1) }
            : x
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, qty: item.qty || 1 }];
      }
    });
  };

  // Remove item completely from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((x) => x.id !== id));
  };

  // Update quantity of specific item
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((x) =>
        x.id === id ? { ...x, qty: Number(qty) } : x
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Get cart total items count
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // Check if item exists in cart
  const isInCart = (id) => {
    return cart.some(item => item.id === id);
  };

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};