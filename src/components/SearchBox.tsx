import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SearchBox.module.css";
import { buscarProductos, getCategorias, getProductosFiltrados } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

type ProductoLite = {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoriaSlug?: string;
  categoriaNombre?: string;
  stock?: number;
};

type CategoriaLite = {
  id: number;
  nombre: string;
  slug: string;
};

type ProductoApiResponse = {
  id?: number;
  nombre?: string;
  precio?: number | string;
  price?: number | string;
  imagen?: string;
  image?: string;
  urlImagen?: string;
  stock?: number | string;
  categoria?: {
    slug?: string;
    nombre?: string;
  };
  categoriaSlug?: string;
  categoriaNombre?: string;
};

const normalizeProducto = (raw: unknown): ProductoLite | null => {
  if (!raw || typeof raw !== "object") return null;
  const producto = raw as ProductoApiResponse;
  if (typeof producto.id !== "number" || typeof producto.nombre !== "string") {
    return null;
  }

  const priceSource = producto.precio ?? producto.price ?? 0;
  const parsedPrice =
    typeof priceSource === "string" ? Number(priceSource) : Number(priceSource ?? 0);
  const precio = Number.isFinite(parsedPrice) ? parsedPrice : 0;
  const rawStock = producto.stock;
  const parsedStock =
    typeof rawStock === "string" ? Number(rawStock) : Number(rawStock);
  const stock =
    rawStock === undefined || rawStock === null
      ? undefined
      : Number.isFinite(parsedStock)
        ? parsedStock
        : undefined;

  return {
    id: producto.id,
    nombre: producto.nombre,
    precio,
    imagen: producto.imagen || producto.image || producto.urlImagen || undefined,
    categoriaSlug: producto.categoria?.slug || producto.categoriaSlug || undefined,
    categoriaNombre: producto.categoria?.nombre || producto.categoriaNombre || undefined,
      stock,
  };
};

export default function SearchBox() {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<ProductoLite[]>([]);
  const [categorias, setCategorias] = useState<CategoriaLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("search_history_medicmax") || "[]");
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cerrar si clic fuera
    function onClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    // sugerencias por categorías (rápido)
    async function loadCats() {
      try {
        const catsResponse: unknown = await getCategorias();
        if (!Array.isArray(catsResponse)) return;

        const cats = catsResponse
          .filter((cat): cat is CategoriaLite => {
            if (!cat || typeof cat !== "object") return false;
            const maybeCat = cat as { id?: unknown; nombre?: unknown; slug?: unknown };
            return (
              typeof maybeCat.id === "number" &&
              typeof maybeCat.nombre === "string" &&
              typeof maybeCat.slug === "string"
            );
          })
          .map((cat) => ({
            id: cat.id,
            nombre: cat.nombre,
            slug: cat.slug,
          }));
        setCategorias(cats);
      } catch {
        // ignore
      }
    }
    loadCats();
  }, []);

  // Debounce + búsqueda
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const normalizedQuery = query.trim().toLowerCase();
        const matchedCategory = categorias.find(
          (cat) => cat.nombre.toLowerCase() === normalizedQuery
        );

        if (matchedCategory) {
          const data: unknown = await getProductosFiltrados({
            categoria: matchedCategory.slug,
            page: 0,
            size: 8,
          });
          const items = Array.isArray((data as { content?: unknown }).content)
            ? (data as { content: unknown[] }).content
            : Array.isArray(data)
              ? data
              : [];
          const mapped = items
            .map((item) => normalizeProducto(item))
            .filter((item): item is ProductoLite => item !== null)
            .slice(0, 8);
          setResults(mapped);
          setError(null);
        } else {
          const data: unknown = await buscarProductos(query);
          if (!Array.isArray(data)) {
            setResults([]);
            setError("No se pudieron obtener resultados.");
          } else {
            const mapped = data
              .map((item) => normalizeProducto(item))
              .filter((item): item is ProductoLite => item !== null)
              .slice(0, 8);
            setResults(mapped);
            setError(null);
          }
        }
      } catch (err) {
        console.error(err);
        setResults([]);
        setError("No se pudo completar la búsqueda.");
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, categorias]);

  // keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && results[highlightIndex]) {
        goToProduct(results[highlightIndex]);
      } else if (results.length === 1) {
        goToProduct(results[0]);
      } else {
        // navegar a página de búsqueda completa
        doFullSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const saveHistory = (q: string) => {
    if (!q) return;
    const h = [q, ...history.filter((x) => x !== q)].slice(0, 8);
    setHistory(h);
    localStorage.setItem("search_history_medicmax", JSON.stringify(h));
  };

  const applyQuery = (q: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setQuery(q);
    setOpen(true);
    setHighlightIndex(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const goToProduct = (p: ProductoLite) => {
    saveHistory(query);
    setOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/product/${p.id}`, { state: { producto: p } });
  };

  const doFullSearch = () => {
    saveHistory(query);
    navigate("/search", { state: { resultados: results, query } });
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const addQuick = (p: ProductoLite, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (p.stock === 0) return;
    agregarAlCarrito({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.nombre,
      imagen: p.imagen || "",
      precio: p.precio,
      cantidad: 1,
      stock: p.stock ?? 1,
      marca: p.categoriaNombre || "MedicMax",
    });
  };

  const highlight = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.hl}>{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.inputWrap}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Buscar productos, marcas o síntomas..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlightIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="buscar productos"
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => { setQuery(""); setResults([]); setOpen(false); }}>
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className={styles.panel}>
          {/* HISTORIAL Y SUGERENCIAS */}
          {(!query || query.length < 2) && (
            <>
              {history.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Historial</div>
                  <div className={styles.tags}>
                    {history.map((h) => (
                      <button key={h} className={styles.tag} onClick={(e) => applyQuery(h, e)}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Sugerencias</div>
                <div className={styles.tags}>
                  {categorias.slice(0, 6).map((s) => (
                    <button key={s.id} className={styles.tag} onClick={(e) => applyQuery(s.nombre, e)}>
                      {s.nombre}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* RESULTADOS */}
          {query.length >= 2 && (
            <>
              <div className={styles.resultsTitle}>
                {loading ? "Buscando..." : `${results.length} resultados`}
                {error && <span className={styles.err}>{error}</span>}
              </div>

              <ul className={styles.resultsList}>
                {results.length === 0 && !loading && !error && (
                  <li className={styles.noFound}>No se encontraron productos para “{query}”</li>
                )}

                {results.map((p, idx) => (
                  <li
                    key={p.id}
                    className={styles.resultItem + (idx === highlightIndex ? ` ${styles.active}` : "")}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => goToProduct(p)}
                  >
                    <img src={p.imagen || "/placeholder-product.png"} alt={p.nombre} />
                    <div className={styles.meta}>
                      <div className={styles.name}>{highlight(p.nombre, query)}</div>
                      <div className={styles.cat}>{p.categoriaNombre || p.categoriaSlug || ""}</div>
                    </div>

                    <div className={styles.actions}>
                      <div className={styles.price}>${Number(p.precio).toLocaleString()}</div>
                      {p.stock === 0 ? (
                        <>
                          <a
                            className={styles.whatsappBtn}
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            WhatsApp
                          </a>
                          <span className={styles.agotadoLabel}>Agotado</span>
                        </>
                      ) : (
                        <button className={styles.quickAdd} onClick={(e) => addQuick(p, e)}>+</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.footer}>
                <button className={styles.viewAll} onClick={doFullSearch}>Ver todos los resultados</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
