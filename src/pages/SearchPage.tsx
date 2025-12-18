import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import { useCart } from "../context/CartContext";
import type { Producto } from "../types/Producto";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  const goToProduct = (p: Producto) =>
    navigate(`/product/${p.id}`, { state: { producto: p } });

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
            <div className={styles.grid}>
              {resultados.map((p) => (
                <article key={p.id} className={styles.card}>
                  <div className={styles.imgWrap} onClick={() => goToProduct(p)}>
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
