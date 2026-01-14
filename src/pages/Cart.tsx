import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Cart.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getProductos } from "../services/api";
import type { Producto } from "../types/Producto";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const { carrito, actualizarCantidad, eliminarDelCarrito } = useCart();
  const navigate = useNavigate();
  const [sugeridos, setSugeridos] = useState<Producto[]>([]);

  const subtotal = carrito.reduce(
    (total, p) => total + (p.cantidad ?? 1) * p.precio,
    0
  );
  const envio = 5000;
  const impuestos = Math.round(subtotal * 0.19);
  const total = subtotal + envio + impuestos;

  useEffect(() => {
    async function cargarSugeridos() {
      try {
        const data = await getProductos();
        setSugeridos(data.slice(0, 12));
      } catch (error) {
        console.error("Error al cargar sugeridos", error);
      }
    }

    cargarSugeridos();
  }, []);

  const [inicio, setInicio] = useState(0);
  const visibles = useMemo(
    () => sugeridos.slice(inicio, inicio + 4),
    [sugeridos, inicio]
  );

  const avanzar = () => {
    setInicio((prev) => {
      if (sugeridos.length <= 4) return 0;
      const next = prev + 4;
      return next >= sugeridos.length ? 0 : next;
    });
  };

  const retroceder = () => {
    setInicio((prev) => {
      if (sugeridos.length <= 4) return 0;
      const next = prev - 4;
      return next < 0 ? Math.max(sugeridos.length - 4, 0) : next;
    });
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Carrito de Compras</h1>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div className={styles.carrito}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((p) => {
                  const cantidad = p.cantidad ?? 1;
                  const stock = p.stock;
                  const limiteStock =
                    typeof stock === "number" && stock >= 0 ? stock : null;
                  const puedeIncrementar =
                    limiteStock === null ? true : cantidad < limiteStock;
                  const superaStock =
                    limiteStock !== null && cantidad > limiteStock;
                  return (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>
                        <div className={styles.controles}>
                          <button onClick={() => actualizarCantidad(p.id, -1)}>
                            -
                          </button>
                          <span>{cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(p.id, 1)}
                            disabled={!puedeIncrementar}
                            aria-disabled={!puedeIncrementar}
                          >
                            +
                          </button>
                        </div>
                        {limiteStock !== null && (
                          <span className={styles.stockInfo}>
                            Stock disponible: {limiteStock}
                          </span>
                        )}
                        {superaStock && (
                          <span className={styles.stockWarning}>
                            Cantidad supera el stock disponible. Ajusta antes de pagar.
                          </span>
                        )}
                      </td>
                      <td>${p.precio.toLocaleString()}</td>
                      <td>${(p.precio * cantidad).toLocaleString()}</td>
                      <td>
                        <button
                          className={styles.eliminar}
                          onClick={() => eliminarDelCarrito(p.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.resumen}>
              <h2>Resumen del Pedido</h2>
              <div className={styles.linea}>
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.linea}>
                <span>Envío</span>
                <span>${envio.toLocaleString()}</span>
              </div>
              <div className={styles.linea}>
                <span>Impuestos</span>
                <span>${impuestos.toLocaleString()}</span>
              </div>
              <hr />
              <div className={styles.total}>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <button className={styles.btnPagar} onClick={() => navigate("/checkout")}>Proceder al Pago</button>
            </div>
          </div>
        )}
      </main>
      <section className={styles.beneficios}>
        <div className={styles.beneficiosCard}>
          <span className={styles.beneficioEmoji}>🚚</span>
          <div>
            <h3>Envíos rápidos</h3>
            <p>Entregamos en Sabaneta, Itagüí, Envigado en menos de 55 minutos.</p>
          </div>
        </div>
        <div className={styles.beneficiosCard}>
          <span className={styles.beneficioEmoji}>🔒</span>
          <div>
            <h3>Compra segura</h3>
            <p>Pagos protegidos y seguimiento de tu pedido en tiempo real.</p>
          </div>
        </div>
        <div className={styles.beneficiosCard}>
          <span className={styles.beneficioEmoji}>💬</span>
          <div>
            <h3>Soporte personalizado</h3>
            <p>Asesores disponibles por WhatsApp y teléfono.</p>
          </div>
        </div>
      </section>
      {sugeridos.length > 0 && (
        <section className={styles.sugerencias}>
          <div className={styles.sugerenciasHeader}>
            <h2>Productos que también te pueden interesar</h2>
            <div className={styles.controlesCarousel}>
              <button onClick={retroceder} aria-label="Ver productos anteriores">
                ←
              </button>
              <button onClick={avanzar} aria-label="Ver productos siguientes">
                →
              </button>
            </div>
          </div>
          <div className={styles.slider}>
            {visibles.map((p) => (
              <div key={p.id} className={styles.sliderItem}>
                <ProductCard producto={p} />
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
