import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Swal from "sweetalert2";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, totalAmount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
const handleCheckout = async () => {
  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    
    if (!token) {
      Swal.fire({
        title: "¡Inicia sesión! 🐾",
        text: "Debes estar logueado para cuidar a tus peluditos.",
        icon: "warning",
        confirmButtonColor: "#009EE3",
      });
      return;
    }

    setIsProcessing(true);

    // ✅ PASO ÚNICO: Pedir la preferencia de pago directamente
    // Eliminamos el axios.post a /api/orders que estaba aquí.
    
    const responseMP = await axios.post(
      "http://localhost:3000/api/payments/create-preference",
      { items: cart },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { id } = responseMP.data;

    if (id) {
      // Redirigimos a Mercado Pago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${id}`;
    }

  } catch (error) {
    console.error("Error en el checkout:", error);
    Swal.fire({
      title: "¡Ups! Algo falló 🐶",
      text: "No pudimos conectar con Mercado Pago. Intenta de nuevo.",
      icon: "error",
      confirmButtonColor: "#009EE3",
    });
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100" // Corregido z-index
          />

          {/* PANEL LATERAL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-110 shadow-2xl flex flex-col" // Corregido z-index
          >
            {/* CABECERA */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#009EE3]" size={24} />
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Tu Carrito</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="grow overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag size={80} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-gray-400 font-bold">Tu carrito está vacío 🐾</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-4xl border border-gray-100 shadow-sm">
                    <img
                      src={item.image_url || item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl"
                    />
                    <div className="grow">
                      <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-[#009EE3] font-black">${item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-200"><Minus size={14}/></button>
                          <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-200"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total a pagar</span>
                  <span className="text-3xl font-black text-gray-800">${totalAmount.toFixed(2)}</span>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={handleCheckout}
                  className={`w-full py-5 rounded-4xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    isProcessing ? "bg-gray-300 cursor-not-allowed" : "bg-[#009EE3] hover:bg-[#0086C3] text-white"
                  }`}
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={22} />
                      <span>Pagar Pedido 🐾</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
                  Pago 100% seguro vía Mercado Pago
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
