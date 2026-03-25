import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://patitas-felices-l87x.onrender.com/api/auth/register', formData);
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión 🐾");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || "Error al registrarse. El usuario o email podrían estar en uso.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-pet shadow-2xl border border-celeste-pastel/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-celeste-pastel w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" size={30} />
          </div>
          <h2 className="text-2xl font-black text-texto-pet">Crear <span className="text-celeste-fuerte">Cuenta</span></h2>
          <p className="text-gray-400 text-sm mt-2">Únete a nuestra comunidad pet-friendly</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input name="username" type="text" onChange={handleChange} placeholder="Nombre de usuario" className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input name="email" type="email" onChange={handleChange} placeholder="Email" className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input name="password" type="password" onChange={handleChange} placeholder="Contraseña" className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel" required />
          </div>
        </div>

        <button type="submit" className="w-full mt-8 bg-celeste-fuerte text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-texto-pet transition-all active:scale-95">
          Registrarse 🐾
        </button>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-celeste-fuerte font-bold hover:underline">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;