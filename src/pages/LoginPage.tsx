import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as LocationState | null)?.from ?? "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      setError("No se pudo iniciar sesion. Verifica correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={`${styles.card} ${styles.loginCard}`}>
          <h1 className={styles.title}>Iniciar sesion</h1>
          <p className={styles.subtitle}>
            Accede para gestionar tu cuenta o el panel de administracion.
          </p>

          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Correo electronico
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Contraseña
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <p style={{ marginTop: "0.9rem", fontSize: "0.92rem" }}>
            ¿No tienes cuenta? <Link to="/register">Registrate</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
