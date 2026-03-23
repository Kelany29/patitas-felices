import { ShieldCheck, Heart, Truck, Scissors } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Sección Hero de Nosotros */}
      <section className="bg-celeste-pastel/20 py-20 text-center px-6">
        <h1 className="text-5xl font-black text-texto-pet mb-6">Nuestra <span className="text-celeste-fuerte">Historia</span></h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          Patitas Felices nació de la pasión por los animales y la necesidad de ofrecer soluciones digitales 
          para los dueños modernos. Creemos que cada mascota merece lo mejor, y trabajamos para que tú 
          puedas dárselo con un solo clic.
        </p>
      </section>

      {/* Sección de Servicios */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-texto-pet">Servicios que <span className="text-celeste-fuerte">Ofrecemos</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 border rounded-3xl text-center hover:shadow-xl transition-shadow">
            <div className="bg-celeste-pastel/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scissors className="text-celeste-fuerte" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-texto-pet">Peluquería</h3>
            <p className="text-gray-500 text-sm">Cortes de raza, baños hidratantes y spa para que tu mascota luzca increíble.</p>
          </div>

          <div className="p-8 border rounded-3xl text-center hover:shadow-xl transition-shadow">
            <div className="bg-celeste-pastel/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-celeste-fuerte" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-texto-pet">Veterinaria</h3>
            <p className="text-gray-500 text-sm">Consultas generales y planes de vacunación con profesionales apasionados.</p>
          </div>

          <div className="p-8 border rounded-3xl text-center hover:shadow-xl transition-shadow">
            <div className="bg-celeste-pastel/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-celeste-fuerte" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-texto-pet">Nutrición</h3>
            <p className="text-gray-500 text-sm">Asesoramiento para elegir el alimento ideal según la edad y necesidades.</p>
          </div>

          <div className="p-8 border rounded-3xl text-center hover:shadow-xl transition-shadow">
            <div className="bg-celeste-pastel/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="text-celeste-fuerte" size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-texto-pet">Envío Express</h3>
            <p className="text-gray-500 text-sm">Llevamos tus productos a la puerta de tu casa en menos de 24 horas.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;