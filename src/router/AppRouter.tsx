import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import OrderConfirmation from "../pages/OrderConfirmation";
import Checkout from "../pages/Checkout";
import Categoria from "../pages/CategoriaPage";
import Search from "../pages/SearchPage";
import Catalogo from "../pages/CatalogoPage";
import Ofertas from "../pages/OfertasPage";
import Contacto from "../pages/ContactoPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail/>} />
      <Route path="/confirmation" element={<OrderConfirmation/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/categoria/:slug" element={<Categoria/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/catalogo" element={<Catalogo/>} />
      <Route path="/ofertas" element={<Ofertas/>} />
      <Route path="/contacto" element={<Contacto/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
};
