import { useEffect, useState } from "react";
import { getProductosPaginados } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Catalogo.module.css";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function cargar() {
      setLoading(true);
      const data = await getProductosPaginados(page, 12);

      setProductos(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    }
    cargar();
  }, [page]);

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <h1>Catálogo de Productos</h1>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <div className={styles.grid}>
              {productos.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className={styles.pagination}>
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                ← Anterior
              </button>

              <span>
                Página {page + 1} de {totalPages}
              </span>

              <button
                disabled={page + 1 === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
