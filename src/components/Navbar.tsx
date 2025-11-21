import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import logo from "../assets/logo_medicmax.jpeg";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

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
                  onClick={() => navigate(`/categoria/${c.id}`)}
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
