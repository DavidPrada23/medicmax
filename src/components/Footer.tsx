import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h4>Comprar</h4>
          <ul>
            <li>
              <Link className={styles.link} to="/categoria/analgesicos">
                Analgésicos
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/categoria/cuidado-personal">
                Cuidado Personal
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/categoria/vitaminas">
                Vitaminas
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Soporte</h4>
          <ul>
            <li>
              <Link className={styles.link} to="/contacto">
                Contacto
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/contacto">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/contacto">
                Envíos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Compañía</h4>
          <ul>
            <li>
              <Link className={styles.link} to="/contacto">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/contacto">
                Carreras
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li>
              <Link className={styles.link} to="/contacto">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link className={styles.link} to="/contacto">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className={styles.copy}>
        © 2025 Droguería MedicMax. Todos los derechos reservados.
      </p>
    </footer>
  );
}
