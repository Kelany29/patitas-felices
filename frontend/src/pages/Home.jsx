import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- NUEVO: Estado para el filtro ---
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await axios.get(
          "https://patitas-felices-backend-wkn9.onrender.com/api/products",
        );
        setProductos(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al traer productos:", error);
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  // --- NUEVO: Lógica de filtrado ---
  const productosFiltrados =
    categoriaSeleccionada === "todas"
      ? productos
      : productos.filter(
          (p) => p.category_id === parseInt(categoriaSeleccionada),
        );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-10">
        <h2 className="text-4xl font-bold text-texto-pet">
          Nuestros <span className="text-celeste-fuerte">Productos</span>
        </h2>
        <p className="text-gray-500 mt-2">
          Calidad y amor para tus peluditos 🐾
        </p>
      </header>

      {/* --- NUEVO: Botones de Filtro --- */}
      <div className="flex justify-center gap-4 mb-12">
        {["todas", "1", "2"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              categoriaSeleccionada === cat
                ? "bg-celeste-fuerte text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-celeste-pastel/30"
            }`}
          >
            {cat === "todas"
              ? "Todos"
              : cat === "1"
                ? "Alimentos"
                : "Accesorios"}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-celeste-fuerte mb-4"></div>
          <p className="text-celeste-fuerte font-medium italic">
            Cargando tu Pet Shop...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* USAMOS LA LISTA FILTRADA AQUÍ */}
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              id={producto.id}
              name={producto.name}
              price={producto.price}
              image_url={producto.image_url}
              description={producto.description}
            />
          ))}
        </div>
      )}

      {/* Mensaje si no hay productos en esa categoría */}
      {productosFiltrados.length === 0 && !cargando && (
        <p className="text-center text-gray-400 italic">
          No hay productos en esta categoría por ahora. 🐾
        </p>
      )}
    </main>
  );
};
export default Home;
