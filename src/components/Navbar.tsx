import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/logo_medicmax.jpeg";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { getCategorias } from "../services/api";
import type { Categoria } from "../types/Categoria";
import SearchBox from "./SearchBox";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, hasRole, logout } = useAuth();

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
          <Link to="/" className={styles.navLink}>
            Inicio
          </Link>
          <div className={styles.dropdown}>
            <button type="button" className={styles.dropdownToggle}>
              Categorías
              <span className={styles.caret}>▾</span>
            </button>
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
          </div>

          <Link to="/ofertas" className={styles.navLink}>
            Ofertas
          </Link>
          <Link to="/contacto" className={styles.navLink}>
            Contacto
          </Link>
        </nav>
        <div className={styles.searchWrapper}>
          <SearchBox />
        </div>
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/perfil" className={styles.accountLink}>
                {user?.username || "Mi perfil"}
              </Link>
              {hasRole("admin") && (
                <Link to="/admin" className={styles.accountLink}>
                  Admin
                </Link>
              )}
              <button type="button" className={styles.logoutBtn} onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.accountLink}>
                Ingresar
              </Link>
              <Link to="/register" className={styles.accountLink}>
                Registrarme
              </Link>
            </>
          )}
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
