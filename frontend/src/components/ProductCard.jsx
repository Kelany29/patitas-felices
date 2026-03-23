import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext"; // Importamos el almacén

const ProductCard = ({ id, name, price, image_url }) => {
  const { addToCart } = useCart(); // Obtenemos la función de agregar

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-pet shadow-md overflow-hidden border border-gray-100 group flex flex-col h-full"
    >
      {/* Contenedor de Imagen */}
      <div className="relative h-64 bg-celeste-pastel/10 flex items-center justify-center overflow-hidden">
        <img
          src={
            image_url ||
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop"
          }
          alt={name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />

        {/* Botón de Favoritos */}
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-400 transition-colors shadow-sm">
          <Heart size={20} />
        </button>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold text-texto-pet mb-2 line-clamp-2">
          {name}
        </h3>

        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
              Precio
            </span>
            <span className="text-xl font-extrabold text-celeste-fuerte">
              ${price}
            </span>
          </div>

          {/* Botón de Agregar (¡Ahora sí conectado!) */}
          <button
            onClick={() => {
              console.log("¡Añadiendo al carrito!", name);
              addToCart({ id, name, price, image_url });
            }}
            className="bg-celeste-pastel hover:bg-celeste-fuerte text-white p-3 rounded-xl transition-all shadow-sm flex items-center justify-center hover:shadow-md active:scale-95"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
