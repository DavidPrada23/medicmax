import { useEffect, useState } from "react";
import { getProductosFiltrados } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Catalogo.module.css";
import type { Producto } from "../types/Producto";
import { useSearchParams } from "react-router-dom";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  // Leer filtros desde la URL
  const categoria = searchParams.get("categoria") || "";
  const marca = searchParams.get("marca") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const page = parseInt(searchParams.get("page") || "0");

  useEffect(() => {
    async function cargar() {
      setLoading(true);

      const data = await getProductosFiltrados({
        categoria,
        marca,
        min,
        max,
        page,
        size: 12,
      });

      setProductos(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    }

    cargar();
  }, [categoria, marca, min, max, page]);

  // Helper para actualizar filtros
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = Object.fromEntries(searchParams);
    const merged = { ...params, ...newFilters, page: "0" }; // reset page
    setSearchParams(merged);
  };

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <h1>Catálogo de Productos</h1>

        <div className={styles.layout}>
          {/* === PANEL DE FILTROS === */}
          <aside className={styles.filtros}>
            <h3>Categorías</h3>
            <button onClick={() => updateFilters({ categoria: "vitaminas" })}>
              Vitaminas
            </button>
            <button
              onClick={() => updateFilters({ categoria: "analgesicos" })}
            >
              Analgésicos
            </button>

            <h3>Marca</h3>
            <button onClick={() => updateFilters({ marca: "MK" })}>MK</button>
            <button onClick={() => updateFilters({ marca: "Genfar" })}>
              Genfar
            </button>

            <h3>Precio</h3>
            <input
              type="number"
              placeholder="mín"
              value={min}
              onChange={(e) =>
                updateFilters({ min: e.target.value || "" })
              }
            />
            <input
              type="number"
              placeholder="máx"
              value={max}
              onChange={(e) =>
                updateFilters({ max: e.target.value || "" })
              }
            />

            <button onClick={() => setSearchParams({ page: "0" })}>
              Limpiar filtros
            </button>
          </aside>

          {/* === LISTADO DE PRODUCTOS === */}
          <section className={styles.products}>
            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <>
                <div className={styles.grid}>
                  {productos.length > 0 ? (
                    productos.map((p) => (
                      <ProductCard key={p.id} producto={p} />
                    ))
                  ) : (
                    <p>No se encontraron productos.</p>
                  )}
                </div>

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      disabled={page === 0}
                      onClick={() =>
                        setSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: String(page - 1),
                        })
                      }
                    >
                      ← Anterior
                    </button>

                    <span>
                      Página {page + 1} de {totalPages}
                    </span>

                    <button
                      disabled={page + 1 === totalPages}
                      onClick={() =>
                        setSearchParams({
                          ...Object.fromEntries(searchParams),
                          page: String(page + 1),
                        })
                      }
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
