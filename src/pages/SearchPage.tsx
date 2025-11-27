import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/SearchPage.module.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultados = [], query = "" } = location.state || {};

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Resultados para: <span>"{query}"</span>
      </h2>

      {/* Si no hay resultados */}
      {resultados.length === 0 && (
        <p className={styles.noResults}>No se encontraron productos.</p>
      )}

      <div className={styles.grid}>
        {resultados.map((p: any) => (
          <div
            key={p.id}
            className={styles.card}
            onClick={() =>
              navigate(`/producto/${p.id}`, { state: { producto: p } })
            }
          >
            <div className={styles.imageContainer}>
              <img
                src={p.imagen || "https://via.placeholder.com/200"}
                alt={p.nombre}
              />
            </div>

            <div className={styles.info}>
              <h3>{p.nombre}</h3>
              <p className={styles.price}>${p.precio.toLocaleString()}</p>
              <button className={styles.button}>Ver producto</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
