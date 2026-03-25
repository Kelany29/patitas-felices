import { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  LayoutDashboard,
  ArrowLeft,
  Trash2,
  Edit3,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null); // Nuevo: rastrea qué producto editamos

  const [producto, setProducto] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });

  const obtenerProductos = async () => {
    try {
      const respuesta = await axios.get("'https://patitas-felices-l87x.onrender.com'/api/products");
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al traer productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // 1. CARGAR DATOS EN EL FORMULARIO
  const prepararEdicion = (p) => {
    setEditandoId(p.id);
    setProducto({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category_id: p.category_id,
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2. CANCELAR EDICIÓN
  const cancelarEdicion = () => {
    setEditandoId(null);
    setProducto({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image_url: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productoParaEnviar = {
      ...producto,
      price: parseFloat(producto.price),
      stock: parseInt(producto.stock),
      category_id: parseInt(producto.category_id),
    };

    try {
      if (editandoId) {
        // MODO EDICIÓN (PUT)
        await axios.put(
          `'https://patitas-felices-l87x.onrender.com'/api/products/${editandoId}`,
          productoParaEnviar,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert("¡Producto actualizado exitosamente! 🐾");
      } else {
        // MODO CREACIÓN (POST)
        await axios.post(
          "'https://patitas-felices-l87x.onrender.com'/api/products",
          productoParaEnviar,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert("¡Producto guardado exitosamente! 🐾");
      }

      cancelarEdicion();
      obtenerProductos(); // Refrescamos la lista desde la DB
    } catch (error) {
      console.error("Error en la operación:", error);
      alert("Hubo un error. Revisa la consola.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`'https://patitas-felices-l87x.onrender.com'/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(productos.filter((p) => p.id !== id));
        alert("Producto eliminado correctamente 🐾");
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link
        to="/"
        className="flex items-center gap-2 text-celeste-fuerte hover:underline mb-6 font-bold"
      >
        <ArrowLeft size={20} /> Volver a la Tienda
      </Link>

      <div className="flex items-center gap-3 mb-8 border-b pb-4 border-celeste-pastel/30">
        <LayoutDashboard className="text-celeste-fuerte" size={32} />
        <h2 className="text-3xl font-black text-texto-pet">
          {editandoId ? "Editando" : "Panel de"}{" "}
          <span className="text-celeste-fuerte">
            {editandoId ? "Producto" : "Control"}
          </span>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-pet shadow-xl border grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 transition-all ${editandoId ? "bg-celeste-pastel/5 border-celeste-fuerte" : "bg-white border-gray-100"}`}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            Nombre
          </label>
          <input
            name="name"
            value={producto.name}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            Precio
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={producto.price}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            value={producto.stock}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            ID Categoría (1: Alimento, 2: Accesorios)
          </label>
          <input
            name="category_id"
            type="number"
            value={producto.category_id}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            required
          />
        </div>

        <div className="col-span-full flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            Descripción
          </label>
          <textarea
            name="description"
            value={producto.description}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            rows="3"
            required
          />
        </div>

        <div className="col-span-full flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-500 italic">
            URL Imagen
          </label>
          <input
            name="image_url"
            value={producto.image_url}
            onChange={handleChange}
            className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-celeste-pastel"
            placeholder="https://..."
          />
        </div>

        <div className="col-span-full flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-celeste-fuerte text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-texto-pet transition-all flex items-center justify-center gap-3"
          >
            <Save size={24} />{" "}
            {editandoId ? "Actualizar Cambios" : "Guardar Producto"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-gray-400 text-white px-6 rounded-2xl hover:bg-gray-500 transition-all flex items-center gap-2"
            >
              <XCircle size={20} /> Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-pet shadow-lg overflow-hidden border border-gray-100">
        <h3 className="p-6 font-black text-xl text-texto-pet border-b bg-gray-50">
          Gestionar Inventario
        </h3>
        <div className="divide-y divide-gray-100">
          {productos.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-texto-pet">{p.name}</p>
                  <p className="text-sm text-celeste-fuerte font-bold">
                    ${p.price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => prepararEdicion(p)}
                  className="text-celeste-fuerte hover:text-white p-2 hover:bg-celeste-fuerte rounded-full transition-all border border-celeste-fuerte"
                  title="Editar producto"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:text-white p-2 hover:bg-red-400 rounded-full transition-all border border-red-400"
                  title="Eliminar producto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
