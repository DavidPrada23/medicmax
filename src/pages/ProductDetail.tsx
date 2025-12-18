import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetail.module.css";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Producto } from "../types/Producto";
import { getProducto, getRelacionados } from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const location = useLocation();

  const productoState = location.state?.producto as Producto | undefined;

  const [producto, setProducto] = useState<Producto | null>(
    productoState || null
  );
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(!productoState);

  useEffect(() => {
    async function fetchProducto() {
      if (productoState) return; // Ya lo tenemos desde el estado de la navegación

      if (!id) return;

      try {
        const data = await getProducto(id);
        setProducto(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id, productoState]);

  useEffect(() => {
    async function fetchRelacionados() {
      if (!id) return;
      const data = await getRelacionados(id);
      setRelacionados(data);
    }

    fetchRelacionados();
  }, [id]);

  if (loading || !producto) return <p>Cargando producto...</p>;

  const handleAgregar = () => {
    agregarAlCarrito({ ...producto, cantidad });
  };

  const handleComprarAhora = () => {
    agregarAlCarrito({ ...producto, cantidad });
    navigate("/checkout", {
      state: {
        productosCheckout: [{ ...producto, cantidad }],
        origen: "buy-now",
      },
    });
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <img
            src={producto.imagen || "/placeholder-product.png"}
            alt={producto.nombre}
            className={styles.imagen}
          />

          <div className={styles.info}>
            <h1>{producto.nombre}</h1>
            <p className={styles.descripcion}>{producto.descripcion}</p>
            <p className={styles.precio}>${producto.precio.toLocaleString()}</p>

            <div className={styles.cantidadContainer}>
              <label>Cantidad:</label>
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

        {/* 🔹 RELACIONADOS */}
        {relacionados.length > 0 && (
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
                  <img
                    src={p.imagen || "/placeholder-product.png"}
                    alt={p.nombre}
                  />
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
        )}
      </main>
      <Footer />
    </>
  );
}
