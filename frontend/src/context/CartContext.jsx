import { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. INICIALIZACIÓN: Intentamos cargar el carrito desde el localStorage al arrancar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("patitas_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. PERSISTENCIA: Cada vez que el carrito cambie, lo guardamos en el localStorage
  useEffect(() => {
    localStorage.setItem("patitas_cart", JSON.stringify(cart));
  }, [cart]);

  // Agregar al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Actualizar cantidad (+ y -) con validación de integridad
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      // Si la cantidad llega a 0, eliminamos el producto (Integridad)
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Vaciar carrito (Se usa tras una compra exitosa o logout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("patitas_cart");
  };

  // Eliminar un producto específico
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // CÁLCULOS (Asegurando que siempre sean números para evitar el NaN)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const totalAmount = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      clearCart, 
      removeFromCart, 
      totalItems, 
      totalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
