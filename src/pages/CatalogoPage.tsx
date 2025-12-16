import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Catalogo.module.css";
import { getProductosFiltrados } from "../services/api";
import type { Producto } from "../types/Producto";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 0);

  // filtros desde la URL
  const filtros = useMemo(
    () => ({
      categoria: searchParams.get("categoria") || undefined,
      marca: searchParams.get("marca") || undefined,
      min: searchParams.get("min")
        ? Number(searchParams.get("min"))
        : undefined,
      max: searchParams.get("max")
        ? Number(searchParams.get("max"))
        : undefined,
      query: searchParams.get("query") || undefined,
    }),
    [searchParams]
  );

  // cargar datos
  useEffect(() => {
    async function cargar() {
      setLoading(true);

      const data = await getProductosFiltrados({
        page,
        size: 12,
        ...filtros,
      });

      setProductos(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    }

    cargar();
  }, [filtros, page]);

  // actualizar filtros
  const updateFilter = (key: string, value: string | number | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) newParams.delete(key);
    else newParams.set(key, String(value));
    newParams.set("page", "0"); // reiniciar paginación
    setSearchParams(newParams);
  };

  return (
    <>
      <Navbar />

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Filtrar por</h3>

          {/* Categorías */}
          <div className={styles.filtroGrupo}>
            <h4>Categoría</h4>
            <button onClick={() => updateFilter("categoria", "vitaminas")}>Vitaminas</button>
            <button onClick={() => updateFilter("categoria", "analgesicos")}>Analgésicos</button>
            <button onClick={() => updateFilter("categoria", "cuidado-personal")}>
              Cuidado Personal
            </button>
            <button onClick={() => updateFilter("categoria", undefined)}>Quitar</button>
          </div>

          {/* Marca */}
          <div className={styles.filtroGrupo}>
            <h4>Marca</h4>
            <button onClick={() => updateFilter("marca", "MK")}>MK</button>
            <button onClick={() => updateFilter("marca", "Genfar")}>Genfar</button>
            <button onClick={() => updateFilter("marca", undefined)}>Quitar</button>
          </div>

          {/* Precio */}
          <div className={styles.filtroGrupo}>
            <h4>Precio</h4>
            <input
              type="number"
              placeholder="Min"
              onBlur={(e) => updateFilter("min", e.target.value || undefined)}
            />
            <input
              type="number"
              placeholder="Max"
              onBlur={(e) => updateFilter("max", e.target.value || undefined)}
            />
          </div>

          <button
            className={styles.btnClear}
            onClick={() => setSearchParams({ page: "0" })}
          >
            Limpiar filtros
          </button>
        </aside>

        <section className={styles.content}>
          <h1>Catálogo</h1>

          {loading ? (
            <p>Cargando…</p>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <>
              <div className={styles.grid}>
                {productos.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>

              {/* PAGINACIÓN */}
              <div className={styles.pagination}>
                <button disabled={page === 0} onClick={() => updateFilter("page", page - 1)}>
                  ← Anterior
                </button>

                <span>
                  Página {page + 1} de {totalPages}
                </span>

                <button
                  disabled={page + 1 === totalPages}
                  onClick={() => updateFilter("page", page + 1)}
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
