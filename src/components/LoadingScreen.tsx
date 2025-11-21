import styles from "../styles/LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <h2>Procesando pago...</h2>
      <p>Por favor, espera un momento ⏳</p>
    </div>
  );
}
