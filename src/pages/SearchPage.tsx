import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";
import { useCart } from "../context/CartContext";
import type { Producto } from "../types/Producto";

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
    navigate(`/producto/${p.id}`, { state: { producto: p } });

  if (resultados.length === 0) {
    return (
      <div className={styles.container}>
        <h2>
          Resultados para: <span>"{query}"</span>
        </h2>
        <p className={styles.noResults}>No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>
        Resultados para: <span>"{query}"</span>
      </h2>

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
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
