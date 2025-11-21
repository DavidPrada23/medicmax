import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Cart.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { carrito, actualizarCantidad, eliminarDelCarrito } = useCart();
  const navigate = useNavigate();

  const subtotal = carrito.reduce(
    (total, p) => total + p.cantidad * p.precio,
    0
  );
  const envio = 5000;
  const impuestos = Math.round(subtotal * 0.19);
  const total = subtotal + envio + impuestos;

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
                {carrito.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>
                      <div className={styles.controles}>
                        <button onClick={() => actualizarCantidad(p.id, -1)}>
                          -
                        </button>
                        <span>{p.cantidad}</span>
                        <button onClick={() => actualizarCantidad(p.id, 1)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td>${p.precio.toLocaleString()}</td>
                    <td>${(p.precio * p.cantidad).toLocaleString()}</td>
                    <td>
                      <button
                        className={styles.eliminar}
                        onClick={() => eliminarDelCarrito(p.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
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
      <Footer />
    </>
  );
}
