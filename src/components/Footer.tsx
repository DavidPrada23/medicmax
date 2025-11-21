import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h4>Comprar</h4>
          <ul>
            <li>Medicamentos</li>
            <li>Cuidado Personal</li>
            <li>Vitaminas</li>
          </ul>
        </div>
        <div>
          <h4>Soporte</h4>
          <ul>
            <li>Contacto</li>
            <li>Preguntas frecuentes</li>
            <li>Envíos</li>
          </ul>
        </div>
        <div>
          <h4>Compañía</h4>
          <ul>
            <li>Sobre nosotros</li>
            <li>Carreras</li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
          </ul>
        </div>
      </div>

      <p className={styles.copy}>
        © 2025 Droguería MedicMax. Todos los derechos reservados.
      </p>
    </footer>
  );
}
