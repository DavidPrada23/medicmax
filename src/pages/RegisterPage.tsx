import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import styles from "../styles/Auth.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({
        username: form.username,
        address: form.address,
        email: form.email,
        password: form.password,
      });

      await login({ email: form.email, password: form.password });
      navigate("/perfil", { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error al registrarte";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={`${styles.card} ${styles.loginCard}`}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>
            Registra tu usuario para comprar y gestionar tu perfil.
          </p>

          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Username
              <input
                className={styles.input}
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Direccion
              <input
                className={styles.input}
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Correo electronico
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Contraseña
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Confirmar contraseña
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>

            <button className={styles.btnPrimary} type="submit" disabled={loading}>
              {loading ? "Creando..." : "Registrarme"}
            </button>
          </form>

          <p style={{ marginTop: "0.9rem", fontSize: "0.92rem" }}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
