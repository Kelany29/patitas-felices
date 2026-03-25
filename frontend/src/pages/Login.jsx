import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, LogIn, PawPrint } from 'lucide-react'; 
import Swal from 'sweetalert2';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Petición al backend
      const { data } = await axios.post('https://patitas-felices-l87x.onrender.com/api/auth/login', credentials);
      
      // 2. CAMBIO CLAVE: Usamos sessionStorage en lugar de localStorage
      // Esto hace que la sesión se borre automáticamente al cerrar la pestaña
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      // Mantenemos tu saludo cariñoso
      Swal.fire({
        title: `¡Hola de nuevo, ${data.user.username}! 🐾`,
        text: "Tus peluditos te estaban extrañando. ¡Qué lindo verte por acá!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ffffff",
        color: "#1f2937",
        iconColor: "#009EE3",
        customClass: {
          popup: 'rounded-[2rem] shadow-2xl border-none',
          title: 'font-black text-2xl text-gray-800'
        }
      });
      
      // 3. Redirección inteligente
      if (data.user.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/'); 
      }
      
    } catch (error) {
      Swal.fire({
        title: "¡Ups! Algo falló 🐶",
        text: "Credenciales incorrectas. Revisa tu email o contraseña e intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#009EE3",
        customClass: {
          popup: 'rounded-3xl'
        }
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-celeste-pastel/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-celeste-pastel w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <PawPrint className="text-white" size={30} />
          </div>
          <h2 className="text-2xl font-black text-texto-pet">Acceso <span className="text-celeste-fuerte">Sistema</span></h2>
          <p className="text-gray-400 font-medium mt-1 text-sm">¡Qué bueno tenerte de vuelta! 🐾</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              name="email" 
              type="email" 
              onChange={handleChange} 
              placeholder="Email" 
              className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel border-gray-100 transition-all" 
              required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              name="password" 
              type="password" 
              onChange={handleChange} 
              placeholder="Contraseña" 
              className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel border-gray-100 transition-all" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 bg-celeste-fuerte text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-texto-pet transition-all active:scale-95 shadow-lg shadow-celeste-fuerte/20"
        >
          <LogIn size={20} /> Ingresar a la Familia
        </button>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿No tienes cuenta? <Link to="/register" className="text-celeste-fuerte font-bold hover:underline">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;