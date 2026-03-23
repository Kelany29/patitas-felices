import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle, ShoppingBag, Heart } from 'lucide-react';

const Success = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Para capturar los datos de Mercado Pago
  const ejecutado = useRef(false);

  // Buscamos el usuario y el token
  const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const userName = user?.username || user?.name || 'amigo/a';

  useEffect(() => {
    const registrarVenta = async () => {
      // 1. SAFE GUARD
      if (!cartItems || cartItems.length === 0 || ejecutado.current) return;

      // Obtenemos el status que nos manda Mercado Pago por la URL
      const statusMP = searchParams.get('status'); 

      try {
        ejecutado.current = true; 
        
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // 2. Enviamos los datos al backend con el TOKEN de seguridad
        const response = await axios.post('http://localhost:3000/api/orders', 
          {
            total: total,
            items: cartItems,
            status: statusMP || 'approved' // Le pasamos el estado real del pago
          },
          {
            headers: { Authorization: `Bearer ${token}` } // ¡ESTO ES VITAL!
          }
        );

        if (response.status === 201) {
          lanzarAlertaExito();
          clearCart(); 
        }
      } catch (error) {
        console.error("Error al registrar la venta:", error);
        ejecutado.current = false; 
        Swal.fire('¡Ups!', 'El pago se procesó pero no pudimos registrar tu pedido. ¡No te preocupes! Contactanos con tu número de operación.', 'warning');
      }
    };

    const lanzarAlertaExito = () => {
      Swal.fire({
        title: `¡Todo listo, ${userName}! 🐾`,
        html: `
          <div class="space-y-4">
            <p class="text-gray-600">Tu pago en <b>Patitas Felices</b> se procesó correctamente.</p>
            <p class="text-sm text-[#009EE3] font-bold italic">¡Tus mascotas van a estar saltando de alegría! 🐶🐱</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Ver mis pedidos',
        confirmButtonColor: '#009EE3',
        background: '#ffffff',
        backdrop: `
          rgba(0,158,227,0.1)
          url("https://www.transparenttextures.com/patterns/paws.png")
          repeat
        `,
        customClass: {
          popup: 'rounded-[2.5rem] shadow-2xl',
          title: 'font-black text-2xl text-gray-800',
          confirmButton: 'rounded-2xl px-8 py-3 font-bold uppercase tracking-wide'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/mis-pedidos'); // Asegurate que esta ruta coincida con tu App.jsx
        }
      });
    };

    // Solo disparamos si el pago fue exitoso según la URL de Mercado Pago
    if (searchParams.get('status') === 'approved') {
        registrarVenta();
    }
  }, [cartItems, clearCart, navigate, userName, token, searchParams]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-white">
      <div className="relative mb-6">
        <CheckCircle size={100} className="text-green-500 animate-pulse" />
        <Heart size={30} className="text-red-400 absolute -top-2 -right-2 animate-bounce" />
      </div>
      
      <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">
        ¡Gracias por tu compra, {userName}!
      </h1>
      
      <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
        Ya estamos preparando todo con mucho amor. Revisá la sección de pedidos para ver el estado de tu envío. 🐾
      </p>

      <div className="mt-10 flex gap-4">
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <ShoppingBag size={20} /> Volver a la tienda
        </button>
      </div>
    </div>
  );
};

export default Success;