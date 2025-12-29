import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import { useCart } from "../context/CartContext";
import type { Producto } from "../types/Producto";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getRelacionados } from "../services/api";
import { useEffect, useRef, useState } from "react";

interface SearchState {
  resultados: Producto[];
  query: string;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SearchState | null;

  const resultados = state?.resultados ?? [];
  const query = state?.query ?? "";

  const { agregarAlCarrito } = useCart();
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const relacionadosRef = useRef<HTMLDivElement | null>(null);

  const goToProduct = (p: Producto) =>
    navigate(`/product/${p.id}`, { state: { producto: p } });

  useEffect(() => {
    let isActive = true;

    async function fetchRelacionados() {
      if (resultados.length === 0) {
        setRelacionados([]);
        return;
      }

      try {
        const data = await getRelacionados(resultados[0].id);
        if (!isActive) return;
        const ids = new Set(resultados.map((p) => p.id));
        setRelacionados(data.filter((p: Producto) => !ids.has(p.id)));
      } catch (error) {
        console.error(error);
        if (isActive) setRelacionados([]);
      }
    }

    fetchRelacionados();

    return () => {
      isActive = false;
    };
  }, [resultados]);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p>Búsqueda</p>
            <h1>
              Resultados para: <span>"{query}"</span>
            </h1>
            <span className={styles.subtext}>
              {resultados.length > 0
                ? `${resultados.length} producto${
                    resultados.length !== 1 ? "s" : ""
                  } encontrados`
                : "No tenemos coincidencias, inténtalo con otra palabra clave."}
            </span>
          </header>

          {resultados.length === 0 ? (
            <div className={styles.noResults}>
              <p>No se encontraron productos.</p>
              <button
                className={styles.btnPrimary}
                onClick={() => navigate("/catalogo")}
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {resultados.map((p) => (
                  <article key={p.id} className={styles.card}>
                    <div
                      className={styles.imgWrap}
                      onClick={() => goToProduct(p)}
                    >
                      <img
                        src={p.imagen || "/placeholder-product.png"}
                        alt={p.nombre}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.name}>{p.nombre}</h3>
                      <p className={styles.cat}>
                        {p.categoriaNombre || p.categoriaSlug || ""}
                      </p>

                      <div className={styles.row}>
                        <div className={styles.price}>
                          ${Number(p.precio).toLocaleString()}
                        </div>
                        <div className={styles.actions}>
                          <button
                            className={styles.btnPrimary}
                            onClick={() => goToProduct(p)}
                          >
                            Ver
                          </button>
                          <button
                            className={styles.btnGhost}
                            onClick={() =>
                              agregarAlCarrito({ ...p, cantidad: 1 })
                            }
                          >
                            Agregar al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

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
                        const card =
                          relacionadosRef.current.querySelector(
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
                    <div
                      className={styles.gridRelacionados}
                      ref={relacionadosRef}
                    >
                      {relacionados.map((p) => (
                        <div
                          key={p.id}
                          className={styles.cardRelacionado}
                          onClick={() => goToProduct(p)}
                        >
                          <img
                            src={p.imagen || "/placeholder-product.png"}
                            alt={p.nombre}
                          />
                          <h4>{p.nombre}</h4>
                          <p>${Number(p.precio).toLocaleString()}</p>
                          <div className={styles.cardActions}>
                            <button
                              className={styles.btnPrimary}
                              onClick={(e) => {
                                e.stopPropagation();
                                goToProduct(p);
                              }}
                            >
                              Ver
                            </button>
                            <button
                              className={styles.btnGhost}
                              onClick={(e) => {
                                e.stopPropagation();
                                agregarAlCarrito({ ...p, cantidad: 1 });
                              }}
                            >
                              Agregar al carrito
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.carouselArrowRight}
                      aria-label="Ver más productos"
                      onClick={() => {
                        if (!relacionadosRef.current) return;
                        const card =
                          relacionadosRef.current.querySelector(
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
