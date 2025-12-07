import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import OrderConfirmation from "../pages/OrderConfirmation";
import Checkout from "../pages/Checkout";
import Categoria from "../pages/CategoriaPage";
import Search from "../pages/SearchPage";
import Catalogo from "../pages/CatalogoPage";

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
    </Routes>
  );
};
