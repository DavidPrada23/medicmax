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

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetail/>} />
      <Route path="/confirmation" element={<OrderConfirmation/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/categoria/:slug" element={<Categoria/>} />
      <Route path="/searh" element={<Search/>} />
      <Route path="/catalogo" element={<Catalogo/>} />
      <Route path="/ofertas" element={<Ofertas/>} />
      <Route path="/contacto" element={<Contacto/>} />
    </Routes>
  );
};
