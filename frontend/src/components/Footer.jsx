import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-texto-pet text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Columna 1: Marca */}
        <div>
          <h3 className="text-2xl font-black mb-4 text-celeste-pastel">Patitas Felices 🐾</h3>
          <p className="text-gray-300 leading-relaxed">
            Dedicados a mejorar la vida de tus peluditos con productos premium y servicios llenos de amor.
          </p>
        </div>

        {/* Columna 2: Servicios y Enlaces */}
        <div>
          <h4 className="text-lg font-bold mb-4">Servicios</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Peluquería Canina</li>
            <li>Asesoría Nutricional</li>
            <li>Atención Veterinaria</li>
            <li>Envíos a Domicilio</li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contacto</h4>
          <div className="space-y-3">
            <p className="flex items-center gap-3 text-gray-300"><MapPin size={18} /> Alvear, Corrientes</p>
            <p className="flex items-center gap-3 text-gray-300"><Phone size={18} /> +54 123 456 789</p>
            <p className="flex items-center gap-3 text-gray-300"><Mail size={18} /> hola@patitasfelices.com</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Instagram className="hover:text-celeste-pastel cursor-pointer transition-colors" />
            <Facebook className="hover:text-celeste-pastel cursor-pointer transition-colors" />
            <Twitter className="hover:text-celeste-pastel cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        © 2026 Patitas Felices. Desarrollado por Kelany Blanco.
      </div>
    </footer>
  );
};

export default Footer;