import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Checkout.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import type { Producto } from "../types";

export default function Checkout() {
  const navigate = useNavigate();
  const { carrito, totalItems } = useCart();
  const location = useLocation();
  const productosCheckout: Producto[] = location.state?.productosCheckout || carrito;
  const [loading, setLoading] = useState(false);
  const [sede, setSede] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("envio");

  const sedes = [
    { id: 1, nombre: "MedicMax Sabaneta", direccion: "Calle 65 sur # 42b-65" },
    { id: 2, nombre: "MedicMax Itagüí", direccion: "Calle 49 # 47-32" },
  ];

  const subtotal = productosCheckout.reduce(
    (total: number, p: { cantidad: number; precio: number}) => total + p.cantidad * p.precio,
    0
  );
  const envio = 2000;
  const impuestos = Math.round(subtotal * 0.19);
  const total =
    tipoEntrega === "retiro"
      ? subtotal + impuestos
      : subtotal + envio + impuestos;

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    municipio: "",
    correoUsuario: "",
    correoDominio: "@gmail.com",
    telefono: "",
    metodoPago: "tarjeta",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Aquí puedes guardar datos o enviar a backend

    if (!form.correoUsuario.trim()) {
      alert("Por favor ingresa la parte inicial de tu correo electrónico.");
      setLoading(false);
      return;
    }

    const correoCompleto = `${form.correoUsuario}${form.correoDominio}`;

    setTimeout(() => {
      navigate("/confirmation", {
        state: {
          cliente: { ...form, correo: correoCompleto },
          resumen: { subtotal, envio, impuestos, total, totalItems },
          productos: productosCheckout,
        },
      });
    }, 2500);
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Datos de Envío y Pago</h1>

        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Nombre completo
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
              />
            </label>

            <div className={styles.correoGroup}>
              <label>Correo electrónico</label>
              <div className={styles.correoInputGroup}>
                <input
                  type="text"
                  name="correoUsuario"
                  required
                  placeholder="Correo"
                  value={form.correoUsuario || ""}
                  onChange={(e) =>
                    setForm({ ...form, correoUsuario: e.target.value })
                  }
                />
                <select
                  name="correoDominio"
                  value={form.correoDominio || "@gmail.com"}
                  onChange={(e) =>
                    setForm({ ...form, correoDominio: e.target.value })
                  }
                >
                  <option value="@gmail.com">@gmail.com</option>
                  <option value="@outlook.com">@outlook.com</option>
                  <option value="@hotmail.com">@hotmail.com</option>
                  <option value="@yahoo.com">@yahoo.com</option>
                  <option value="@icloud.com">@icloud.com</option>
                </select>
              </div>
            </div>

            <label>
              Dirección
              <input
                type="text"
                name="direccion"
                required
                value={form.direccion}
                onChange={handleChange}
              />
            </label>

            <label>
              Municipio
              <select
                name="municipio"
                required
                value={form.municipio || ""}
                onChange={handleChange}
              >
                <option value="">Selecciona un municipio...</option>
                <option value="Itagüí">Itagüí</option>
                <option value="Sabaneta">Sabaneta</option>
                <option value="Envigado">Envigado</option>
                <option value="Caldas">Caldas</option>
                <option value="La Estrella">La Estrella</option>
              </select>
            </label>

            <label>
              País
              <input
                type="text"
                value="Colombia"
                disabled
                className={styles.inputDisabled}
              />
            </label>

            <label>
              Celular / Teléfono
              <input
                type="tel"
                name="telefono"
                required
                value={form.telefono}
                onChange={handleChange}
              />
            </label>

            <div className={styles.opcionesEntrega}>
              <h3>Método de entrega</h3>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="entrega"
                  value="envio"
                  checked={tipoEntrega === "envio"}
                  onChange={() => setTipoEntrega("envio")}
                  className={styles.radioCustom}
                />
                <span className={styles.radioTexto}>Envío a domicilio</span>
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="entrega"
                  value="retiro"
                  checked={tipoEntrega === "retiro"}
                  onChange={() => setTipoEntrega("retiro")}
                  className={styles.radioCustom}
                />
                <span className={styles.radioTexto}>Retiro en tienda</span>
              </label>

              {tipoEntrega === "retiro" && (
                <div className={styles.selectorSede}>
                  <label>Selecciona tu sede más cercana:</label>
                  <select
                    value={sede}
                    onChange={(e) => setSede(e.target.value)}
                    className={styles.selectSede}
                  >
                    <option value="">Selecciona una sede...</option>
                    {sedes.map((s) => (
                      <option key={s.id} value={s.nombre}>
                        {s.nombre} — {s.direccion}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 🔹 Nuevo bloque uniforme para método de pago */}
            <div className={styles.metodoPagoGroup}>
              <h3>Método de pago</h3>
              <select
                name="metodoPago"
                value={form.metodoPago}
                onChange={handleChange}
                className={styles.selectPago}
              >
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia</option>
                <option value="contraentrega">🚚 Contraentrega</option>
              </select>
            </div>

            <button type="submit" className={styles.btnConfirmar}>
              Confirmar pedido
            </button>
          </form>

          <div className={styles.resumen}>
            <h2>Resumen del pedido</h2>
            {productosCheckout.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              <>
                {productosCheckout.map((p: Producto) => (
                  <div key={p.id} className={styles.item}>
                    <span>
                      {p.nombre} x{p.cantidad}
                    </span>
                    <span>${(p.precio * p.cantidad).toLocaleString()}</span>
                  </div>
                ))}
                <hr />
                <div className={styles.item}>
                  <span>Subtotal</span>
                  <strong>${subtotal.toLocaleString()}</strong>
                </div>
                {/* Envío */}
                <div className={styles.producto}>
                  <span>Envío</span>
                  {tipoEntrega === "retiro" ? (
                    <strong className={styles.envioTachado}>
                      ${envio.toLocaleString()}
                    </strong>
                  ) : (
                    <strong>${envio.toLocaleString()}</strong>
                  )}
                </div>

                {/* Entrega */}
                {tipoEntrega === "retiro" && (
                  <div className={`${styles.producto} ${styles.entregaItem}`}>
                    <span>Entrega</span>
                    <strong className={styles.entregaTexto}>
                      Retiro en tienda: {sede || "Selecciona una sede"}
                    </strong>
                  </div>
                )}

                <div className={styles.item}>
                  <span>Impuestos</span>
                  <strong>${impuestos.toLocaleString()}</strong>
                </div>
                <hr />
                <div className={styles.total}>
                  <span>Total</span>
                  <strong>${total.toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
