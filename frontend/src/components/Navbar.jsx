import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, PawPrint, LogOut, User, LayoutDashboard, LogIn, Package } from 'lucide-react'; 
import { CartContext } from '../context/CartContext';

const Navbar = ({ onOpenCart }) => {
  const navigate = useNavigate();
  // Traemos 'clearCart' del contexto para vaciarlo al salir
  const { cart, clearCart } = useContext(CartContext); 
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cambiamos localStorage por sessionStorage para que la sesión expire al cerrar la pestaña
  const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  const handleLogout = () => {
    // 1. Limpiamos TODA la sesión (token, user, etc)
    sessionStorage.clear();
    localStorage.removeItem('token'); // Por si quedó algo en el anterior
    localStorage.removeItem('user');
    
    // 2. Limpiamos el carrito del almacenamiento para que no lo vea el siguiente usuario
    localStorage.removeItem('cart');
    sessionStorage.removeItem('cart');
    
    // 3. Vaciamos el estado global del carrito en React
    clearCart(); 

    // 4. Redirigimos
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <PawPrint className="text-[#009EE3] group-hover:rotate-12 transition-transform" size={32} />
          <h1 className="text-2xl font-black text-gray-800">
            Patitas <span className="text-[#009EE3]">Felices</span>
          </h1>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-bold text-gray-700 hover:text-[#009EE3] transition-colors">
            Tienda
          </Link>
          <Link to="/nosotros" className="font-bold text-gray-700 hover:text-[#009EE3] transition-colors">
            Nosotros
          </Link>

          {token ? (
            <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
              
              {/* LINK A MIS PEDIDOS */}
              <Link 
                to="/mis-pedidos" 
                className="flex items-center gap-2 font-bold text-gray-700 hover:text-[#009EE3] transition-colors text-sm"
              >
                <Package size={18} /> Mis Pedidos
              </Link>

              {/* BOTÓN DASHBOARD: Solo para Admin */}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-md"
                >
                  <LayoutDashboard size={18} /> Gestión
                </Link>
              )}

              {/* USUARIO */}
              <div className="flex items-center gap-2 text-gray-700 font-bold bg-blue-50 px-3 py-2 rounded-lg text-sm border border-blue-100">
                <User size={16} className="text-[#009EE3]" />
                <span>{user?.username}</span>
              </div>

              {/* LOGOUT */}
              <button 
                onClick={handleLogout} 
                className="p-2 text-gray-400 hover:text-red-500 transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
              <Link to="/login" className="font-bold text-gray-700 hover:text-[#009EE3] flex items-center gap-1 text-sm">
                <LogIn size={18} /> Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-[#009EE3] text-white px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition-all text-sm shadow-lg shadow-blue-200">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* CARRITO */}
        <button onClick={onOpenCart} className="relative p-3 bg-blue-50 rounded-full group hover:bg-blue-100 transition-colors">
          <ShoppingCart className="text-gray-800 group-hover:scale-110 transition-transform" size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;