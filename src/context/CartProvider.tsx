// src/context/CartProvider.tsx
import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import type { ReactNode } from "react";
import type { Producto } from "../types";

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Producto[]>(() => {
    const guardado = localStorage.getItem("carritoMedicMax");
    return guardado ? JSON.parse(guardado) as Producto[] : [];
  });

  useEffect(() => {
    localStorage.setItem("carritoMedicMax", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.id === producto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      }
      return [...prev, producto];
    });
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const actualizarCantidad = (id: number, delta: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(p.cantidad + delta, 1) } : p
      )
    );
  };

  const reemplazarCantidad = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: producto.cantidad } : p
        );
      }
      return [...prev, producto];
    });
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
