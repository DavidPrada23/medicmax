import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetail.module.css";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import type { Producto } from "../types/Producto";
import { getProducto, getRelacionados } from "../services/api";
import FloatingWhatsApp, { WHATSAPP_URL } from "../components/FloatingWhatsApp";

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
  const relacionadosRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchProducto() {
      const hasFullState =
        productoState &&
        typeof productoState.descripcion === "string" &&
        typeof productoState.stock === "number";

      if (hasFullState) {
        setProducto(productoState);
        setLoading(false);
        return; // Ya lo tenemos desde el estado de la navegación
      }

      if (!id) return;

      setProducto(null);
      setLoading(true);

      try {
        const data = await getProducto(id);
        if (isActive) setProducto(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchProducto();

    return () => {
      isActive = false;
    };
  }, [id, productoState]);

  useEffect(() => {
    setCantidad(1);
  }, [id]);

  useEffect(() => {
    async function fetchRelacionados() {
      if (!id) return;
      const data = await getRelacionados(id);
      setRelacionados(data);
    }

    fetchRelacionados();
  }, [id]);

  if (loading || !producto) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <p>Cargando producto...</p>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </>
    );
  }

  const agotado = producto.stock === 0;

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

            {agotado ? (
              <>
                <div className={styles.agotadoBox}>
                  <span className={styles.agotadoLabel}>
                    Agotado, escríbenos al WhatsApp para consultar disponibilidad en el punto.
                  </span>
                </div>
                <div className={styles.botones}>
                  <a
                    className={styles.whatsappBtn}
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Consultar por WhatsApp
                  </a>
                  <button className={styles.btnVolver} onClick={() => navigate(-1)}>
                    ← Volver
                  </button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* 🔹 RELACIONADOS */}
        {relacionados.length > 0 && (
          <section className={styles.relacionados}>
            <div className={styles.relacionadosHeader}>
              <h2>Productos relacionados</h2>
            </div>
            <div className={styles.carousel}>
              <button
                type="button"
                className={styles.carouselArrowLeft}
                aria-label="Ver productos anteriores"
                onClick={() => {
                  if (!relacionadosRef.current) return;
                  const card = relacionadosRef.current.querySelector(
                    `.${styles.cardRelacionado}`
                  ) as HTMLElement | null;
                  const step = (card?.offsetWidth || 240) + 24;
                  relacionadosRef.current.scrollBy({
                    left: -step,
                    behavior: "smooth",
                  });
                }}
              >
                ‹
              </button>
              <div className={styles.gridRelacionados} ref={relacionadosRef}>
                {relacionados.map((p) => {
                  const relatedAgotado = p.stock === 0;
                  return (
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

                      {relatedAgotado ? (
                        <>
                          <span className={styles.agotadoLabelSmall}>
                            Agotado, consulta por WhatsApp.
                          </span>
                          <a
                            className={styles.whatsappBtnSmall}
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Consultar por WhatsApp
                          </a>
                        </>
                      ) : (
                        <>
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

                          <button
                            className={styles.btnAgregar}
                            onClick={(e) => {
                              e.stopPropagation();
                              agregarAlCarrito({ ...p, cantidad: 1 });
                            }}
                          >
                            Agregar al carrito
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className={styles.carouselArrowRight}
                aria-label="Ver más productos"
                onClick={() => {
                  if (!relacionadosRef.current) return;
                  const card = relacionadosRef.current.querySelector(
                    `.${styles.cardRelacionado}`
                  ) as HTMLElement | null;
                  const step = (card?.offsetWidth || 240) + 24;
                  relacionadosRef.current.scrollBy({
                    left: step,
                    behavior: "smooth",
                  });
                }}
              >
                ›
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
