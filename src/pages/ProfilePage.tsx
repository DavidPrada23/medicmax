import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({
        username,
        address,
        ...(password.trim() ? { password } : {}),
      });
      setPassword("");
      setMessage("Perfil actualizado correctamente.");
    } catch {
      setError("No fue posible actualizar tu perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.card}>
            <h1 className={styles.title}>Mi perfil</h1>
            <p className={styles.subtitle}>
              Puedes editar tu nombre de usuario, direccion y contraseña.
            </p>

            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            {message && (
              <p className={`${styles.message} ${styles.success}`}>{message}</p>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Correo electronico
                <input
                  className={styles.input}
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                />
              </label>

              <label>
                Username
                <input
                  className={styles.input}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label>
                Direccion
                <input
                  className={styles.input}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>

              <label>
                Nueva contraseña (opcional)
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Solo si deseas cambiarla"
                />
              </label>

              <button className={styles.btnPrimary} type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
