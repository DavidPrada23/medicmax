import styles from "../styles/Home.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Producto } from "../types/Producto";

const FALLBACK_IMAGEN =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=60";

export default function ProductCard({ producto }: { producto: Producto }) {
  const { agregarAlCarrito, reemplazarCantidad } = useCart();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation();
    agregarAlCarrito({
      ...producto,
      cantidad,
    });
  };

  const handleComprarAhora = (e: React.MouseEvent) => {
    e.stopPropagation();
    reemplazarCantidad({
      ...producto,
      cantidad,
    });
    navigate("/checkout", {
      state: {
        productosCheckout: [{ ...producto, cantidad }],
        origen: "buy-now",
      },
    });
  };

  const handleVerDetalle = () => {
    navigate(`/product/${producto.id}`, { state: { producto } });
  };

  const imagenProducto = producto.imagen || FALLBACK_IMAGEN;
  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(producto.precio);

  return (
    <div className={styles.productCard}>
      <div className={styles.cardInfo} onClick={handleVerDetalle}>
        <img src={imagenProducto} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <span className={styles.precio}>{precioFormateado}</span>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cantidadContainer}>
          <label>Cant.</label>
          <div className={styles.controles}>
            <button
              className={styles.btnCantidad}
              onClick={() => setCantidad((c) => Math.max(c - 1, 1))}
            >
              -
            </button>
            <span>{cantidad}</span>
            <button
              className={styles.btnCantidad}
              onClick={() => setCantidad((c) => c + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.botones}>
          <button className={styles.btnAgregar} onClick={handleAgregar}>
            Agregar al carrito
          </button>
          <button className={styles.btnComprar} onClick={handleComprarAhora}>
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
