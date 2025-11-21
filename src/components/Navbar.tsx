import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/logo_medicmax.jpeg";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getCategorias } from "../services/api";
import type { Categoria } from "../types/Categoria";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);

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

        <div className={styles.actions}>
          <input
            type="search"
            placeholder="Buscar productos..."
            className={styles.search}
          />
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
