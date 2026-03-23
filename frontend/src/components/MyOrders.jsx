import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, Calendar, ShoppingBag, CheckCircle2, Clock } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          // Opcional: navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#009EE3]/20 border-t-[#009EE3] rounded-full animate-spin"></div>
      <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Rastreando tus huellas... 🐾</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-4xl font-black text-gray-800 mb-8 flex items-center gap-4">
        <div className="bg-[#009EE3]/10 p-3 rounded-2xl">
          <Package className="text-[#009EE3]" size={32} />
        </div>
        Mis Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">¿Aún no compraste nada?</h3>
          <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8">
            ¡Tus mascotas te esperan! Date una vuelta por la tienda para ver las novedades. 🐶
          </p>
          <button 
            onClick={() => navigate("/products")} // Cambia la ruta a la de tu tienda
            className="bg-[#009EE3] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#007bb3] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#009EE3]/20"
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Header de la Card */}
              <div className="p-6 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Calendar className="text-[#009EE3]" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fecha</p>
                    <p className="font-bold text-gray-700">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Badge de Estado dinámico */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest ${
                  order.status === 'approved' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {order.status === 'approved' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                  {order.status === 'approved' ? 'Acreditado' : 'Pendiente'}
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Inversión en felicidad</p>
                  <p className="text-2xl font-black text-[#009EE3]">${Number(order.total).toLocaleString('es-AR')}</p>
                </div>
              </div>
              
              {/* Cuerpo de la Card (Items) */}
              <div className="p-8">
                <p className="text-xs font-black text-gray-300 mb-6 uppercase tracking-widest">Resumen del pedido</p>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-1 rounded-lg group-hover:bg-[#009EE3] group-hover:text-white transition-colors">
                          {item.quantity}x
                        </span>
                        <p className="text-gray-600 font-bold group-hover:text-gray-800 transition-colors">{item.name}</p>
                      </div>
                      <p className="font-bold text-gray-400 group-hover:text-[#009EE3] transition-colors">${Number(item.price).toLocaleString('es-AR')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;