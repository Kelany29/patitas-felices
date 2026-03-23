import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import MyOrders from "./components/MyOrders";
import Success from "./pages/Success";

// --- GUARDIA DE SEGURIDAD PARA ADMIN ---
const AdminRoute = ({ children }) => {
  // CORRECCIÓN: Buscamos en ambos almacenamientos
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const user = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user"),
  );

  if (!token) return <Navigate to="/login" />;
  // Solo permitimos entrar si el rol es exactamente admin
  if (user?.role !== "admin") return <Navigate to="/" />;

  return children;
};

// --- GUARDIA PARA USUARIOS REGISTRADOS ---
const PrivateRoute = ({ children }) => {
  // CORRECCIÓN: Buscamos en ambos almacenamientos
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  // Si no hay token en ningún lado, el usuario va al Login
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const hideLayoutPaths = ["/login", "/register"];
  const shouldShowLayout = !hideLayoutPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {shouldShowLayout && <Navbar onOpenCart={() => setIsCartOpen(true)} />}

      <div className="grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/nosotros"
            element={
              <PrivateRoute>
                <AboutUs />
              </PrivateRoute>
            }
          />

          <Route
            path="/success"
            element={
              <PrivateRoute>
                <Success />
              </PrivateRoute>
            }
          />

          <Route
            path="/mis-pedidos"
            element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {shouldShowLayout && <Footer />}

      {shouldShowLayout && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
}

export default App;
