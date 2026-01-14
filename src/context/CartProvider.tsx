import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import type { ReactNode } from "react";
import type { CartItem, Producto } from "../types/Producto";

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>(() => {
    const guardado = localStorage.getItem("carritoMedicMax");
    return guardado ? JSON.parse(guardado) as CartItem[] : [];
  });

  useEffect(() => {
    localStorage.setItem("carritoMedicMax", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (p: Producto) => {
    const cantidad = p.cantidad ?? 1;
    const stock = p.stock;
    if (typeof stock === "number" && stock <= 0) return;

    const existing = carrito.find((item) => item.id === p.id);
    if (existing) {
      const nuevaCantidadBase = existing.cantidad + cantidad;
      const nuevaCantidad =
        typeof stock === "number"
          ? Math.min(nuevaCantidadBase, stock)
          : nuevaCantidadBase;
      setCarrito(
        carrito.map((item) =>
          item.id === p.id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
      return;
    }

    const cantidadFinal =
      typeof stock === "number" ? Math.min(cantidad, stock) : cantidad;
    if (cantidadFinal <= 0) return;
    const nuevoItem: CartItem = { ...p, cantidad: cantidadFinal };
    setCarrito([...carrito, nuevoItem]);
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const actualizarCantidad = (id: number, delta: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id
          ? (() => {
              const stock = p.stock;
              if (typeof stock === "number" && stock <= 0) return p;
              const base = p.cantidad + delta;
              const maxed =
                typeof stock === "number" ? Math.min(base, stock) : base;
              return { ...p, cantidad: Math.max(maxed, 1) };
            })()
          : p
      )
    );
  };

  const reemplazarCantidad = (producto: Producto) => {
    const cantidad = producto.cantidad ?? 1;
    const nuevo: CartItem = { ...producto, cantidad };
    setCarrito([nuevo]);
  };

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        reemplazarCantidad,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
