import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetail.module.css";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Producto } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const location = useLocation();
  const productoState = location.state?.producto as Producto | undefined;

  const [producto, setProducto] = useState<Producto | null>(
    productoState || null
  );
  const [cantidad, setCantidad] = useState(1);

  // 🔹 Productos simulados
  const productosMock: Producto[] = [
    {
      id: 1,
      nombre: "Paracetamol 500mg",
      descripcion: "Alivio eficaz del dolor y la fiebre",
      precio: 8000,
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCpngwsq4p-fE_ABvIfcglGahHaydFP5xlwIKxzv3_WcgFGa743_8wgDj-mFzyE5xDxZ-sHK3_uCrtvTQ7UbsDIfSShJSpKxq10CZR7tzwmU5LuzulvfjrihtTYtdf6NHYoHMwBsLN0RhafAbtrlbH_3qSNaFuRSwik9z9vuMuSSmP7H26eZuwFPFTvSNa8z9htfSYxoIbWdsr2dqTqyCeJmRUFSPmqKGSZHvitoQV4TiGBHrwswZ2pow1ysw_HSiwgSwGLyF-rjg",
      cantidad: 1,
    },
    {
      id: 2,
      nombre: "Multivitamínico Diario",
      descripcion: "Refuerza tu energía y bienestar",
      precio: 12500,
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDk7vt5N2KtaWSzE_MDGxKviFG4OlRXTHzIxlJMYXKkYFw5oQgv9TL9MoVqAcv_8Ee1Ohwp7xNLmPAW3tDlVEneOMficAaw3D5oWVeZ0ph27HAupMTc0EQnA1V7FGVhE4fZqYWwwqojEFfXzX4WFtcaY_zmYuagxEsznEnvbTlKrvBfuS4yA9Eb3A8Hea_0i_NbvXrsEIM805CU0URtChl722HQTmQ3nPfnQ9Va4nHDRfnvqaJwXEqcQchMSKfI2ScH6BW3p5nNpA",
      cantidad: 1,
    },
    {
      id: 3,
      nombre: "Jarabe Antialérgico",
      descripcion: "Rápido alivio para alergias",
      precio: 15900,
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDb1_yBLqTDLFD1PWFIBJ9JYwJCm_9JyGStwdpEyB2h7yZnUSeuIG4kmGskyspd6blUZ3-K2rcPWMW0Fnin3mZoz939Om2HvTcYt4VJEblk69fM_N0DxuYPmDb4eSz5J4JVyU-15MF6LB9IBzU5uoxneMwQTkMEDdQkhG-nHlzQJ2iYmmPDheB5lRldAtOHPUzHr4ieDMRzeFmcVqdJvAsUt3fX_aq0OxnO-zU0_i4I72onslxHaHLVFpKuWr7xC1GK30FvtuGb9A",
      cantidad: 1,
    },
  ];

  useEffect(() => {
    if (!productoState && id) {
      const found = productosMock.find((p) => p.id === Number(id));
      setProducto(found || null);
    }
  }, [id, productoState]);

  if (!producto) return null;

  // ✅ Agregar con cantidad real
  const handleAgregar = () => {
    agregarAlCarrito({ ...producto, cantidad });
  };

  // ✅ Comprar ahora: agrega y navega al carrito
  const handleComprarAhora = () => {
    agregarAlCarrito({ ...producto, cantidad });
    navigate("/checkout", {
      state: {
        productosCheckout: [{ ...producto, cantidad }],
        origen: "buy-now",
      },
    });
  };

  const relacionados = productosMock.filter((p) => p.id !== producto.id);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.imagen}
          />

          <div className={styles.info}>
            <h1>{producto.nombre}</h1>
            <p className={styles.descripcion}>{producto.descripcion}</p>
            <p className={styles.precio}>${producto.precio.toLocaleString()}</p>

            <div className={styles.cantidadContainer}>
              <label htmlFor="cantidad">Cantidad:</label>
              <div className={styles.controles}>
                <button
                  onClick={() => setCantidad((c) => Math.max(c - 1, 1))}
                  className={styles.btnCantidad}
                >
                  -
                </button>
                <span>{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className={styles.btnCantidad}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.botones}>
              <button className={styles.btnAgregar} onClick={handleAgregar}>
                Agregar al carrito
              </button>
              <button
                className={styles.btnComprar}
                onClick={handleComprarAhora}
              >
                Comprar ahora
              </button>
              <button className={styles.btnVolver} onClick={() => navigate(-1)}>
                ← Volver
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Productos relacionados */}
        <section className={styles.relacionados}>
          <h2>Productos relacionados</h2>
          <div className={styles.gridRelacionados}>
            {relacionados.map((p) => (
              <div
                key={p.id}
                className={styles.cardRelacionado}
                onClick={() =>
                  navigate(`/product/${p.id}`, { state: { producto: p } })
                }
              >
                <img src={p.imagen} alt={p.nombre} />
                <h4>{p.nombre}</h4>
                <p>${p.precio.toLocaleString()}</p>
                <button
                  className={styles.btnAgregar}
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito({ ...p, cantidad: 1 });
                  }}
                >
                  Agregar al carrito
                </button>
                <button
                  className={styles.btnComprar}
                  onClick={handleComprarAhora}
                >
                  Comprar ahora
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
