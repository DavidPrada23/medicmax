import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/logo_medicmax.jpeg";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getCategorias, buscarProductos } from "../services/api";
import type { Categoria } from "../types/Categoria";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState<String | null>(null);

  const handleBuscar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setQuery(valor);

    if (valor.length < 2) {
      setResultados([]);
      setMensaje(null);
      return;
    }

    try {
      const data = await buscarProductos(valor);

      if (!Array.isArray(data)) {
        setResultados([]);
        setMensaje("Error al procesar la búsqueda");
        return;
      }

      if (data.length === 0) {
        setResultados([]);
        setMensaje("No se encontraron resultados");
        return;
      }

      setMensaje(null);
      setResultados(data);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResultados([]);
      setMensaje("Error al buscar productos");
    }
  };

  const irAlProducto = (p: any) => {
    navigate(`/producto/${p.id}`, { state: { producto: p } });
    setQuery("");
    setResultados([]);
  };

  useEffect(() => {
    async function fetchCategorias() {
      const cats = await getCategorias();
      setCategorias(cats);
    }
    fetchCategorias();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Droguería MedicMax" />
          <span>Droguerías MedicMax</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/">Inicio</Link>
          <li className={styles.dropdown}>
            Categorías
            <ul className={styles.dropdownMenu}>
              {categorias.map((c) => (
                <li
                  key={c.id}
                  onClick={() => navigate(`/categoria/${c.slug}`)}
                  className={styles.dropdownItem}
                >
                  {c.nombre}
                </li>
              ))}
            </ul>
          </li>

          <Link to="#">Ofertas</Link>
          <Link to="#">Contacto</Link>
        </nav>
        <div className={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Buscar productos..."
            value={query}
            onChange={handleBuscar}
            className={styles.search}
          />
          
          {mensaje && query.length >= 2 && (
            <div className={styles.noResults}>{mensaje}</div>
          )}

          {resultados.length > 0 && (
            <ul className={styles.searchResults}>
              {resultados.map((r) => (
                <li
                  key={r.id}
                  onClick={() => irAlProducto(r)}
                  className={styles.searchItem}
                >
                  {r.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          <Link to="/cart" className={styles.cart}>
            🛒
            {totalItems > 0 && (
              <span className={styles.cartCount}>{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
