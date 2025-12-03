import { createContext, useContext } from "react";
import type { Producto } from "../types/Producto";

export interface CartContextType {
  carrito: Producto[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (id: number) => void;
  actualizarCantidad: (id: number, delta: number) => void;
  reemplazarCantidad: (producto: Producto) => void;
  totalItems: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);
