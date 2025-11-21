import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/OrderConfirmation.module.css";
import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

// Definimos tipo del producto que recibimos
type ProductoConfirm = {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { carrito, eliminarDelCarrito } = useCart();

  // ✅ Para evitar limpiar el carrito varias veces
  const alreadyCleared = useRef(false);

  useEffect(() => {
    if (!state) {
      navigate("/");
    } else if (!alreadyCleared.current) {
      carrito.forEach((p) => eliminarDelCarrito(p.id));
      alreadyCleared.current = true;
    }
  }, [state, navigate, carrito, eliminarDelCarrito]);

  if (!state) return null;

  const { cliente, resumen, productos } = state as {
    cliente: { nombre: string; direccion: string; telefono: string; metodoPago: string };
    resumen: { subtotal: number; envio: number; impuestos: number; total: number };
    productos: ProductoConfirm[];
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.icono}>✅</div>
        <h1>¡Pedido Confirmado!</h1>
        <p className={styles.mensaje}>
          Gracias {cliente.nombre}, tu pedido fue recibido con éxito.  
          Lo enviaremos a la dirección indicada.
        </p>

        <div className={styles.resumen}>
          <h3>Resumen del Pedido</h3>

          {productos.map((p) => (
            <div key={p.id} className={styles.producto}>
              <span>
                {p.nombre} (x{p.cantidad})
              </span>
              <strong>${(p.precio * p.cantidad).toLocaleString()}</strong>
            </div>
          ))}

          <hr />
          <div className={styles.producto}>
            <span>Subtotal</span>
            <strong>${resumen.subtotal.toLocaleString()}</strong>
          </div>
          <div className={styles.producto}>
            <span>Envío</span>
            <strong>${resumen.envio.toLocaleString()}</strong>
          </div>
          <div className={styles.producto}>
            <span>Impuestos</span>
            <strong>${resumen.impuestos.toLocaleString()}</strong>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <strong>${resumen.total.toLocaleString()}</strong>
          </div>

          <div className={styles.envio}>
            <div>
              <h4>Dirección de envío</h4>
              <p>
                {cliente.direccion}
                <br />
                Tel: {cliente.telefono}
              </p>
            </div>
            <div>
              <h4>Método de pago</h4>
              <p>{cliente.metodoPago}</p>
            </div>
          </div>
        </div>

        <div className={styles.botones}>
          <button onClick={() => navigate("/")} className={styles.btnInicio}>
            Volver al inicio
          </button>
          <button onClick={() => navigate("/cart")} className={styles.btnHistorial}>
            Ver carrito
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
