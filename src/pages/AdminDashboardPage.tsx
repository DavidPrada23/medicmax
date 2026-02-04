import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { deleteAdminUser, getAdminUsers, getPaidOrders } from "../services/api";
import styles from "../styles/Auth.module.css";
import type { AdminUser, PaidOrder } from "../types/Auth";

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<PaidOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError("");

    Promise.all([getAdminUsers(token), getPaidOrders(token)])
      .then(([usersData, ordersData]) => {
        setUsers(usersData);
        setOrders(ordersData);
      })
      .catch(() => {
        setError("No se pudo cargar la informacion de administracion.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleDeleteUser = async (userId: number) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      "Esta accion eliminara el usuario. ¿Deseas continuar?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAdminUser(token, userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch {
      setError("No se pudo eliminar el usuario seleccionado.");
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Panel administrador</h1>
          <p className={styles.subtitle}>
            Gestiona usuarios y revisa los pedidos pagados del checkout.
          </p>

          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

          <div className={styles.grid}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Usuarios</h2>

              {loading ? (
                <p>Cargando usuarios...</p>
              ) : users.length === 0 ? (
                <p>No hay usuarios para mostrar.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.roles.join(", ")}</td>
                          <td>
                            <button
                              className={styles.btnDanger}
                              type="button"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Pedidos pagados</h2>

              {loading ? (
                <p>Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p>No hay pedidos pagados registrados.</p>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Pedido</th>
                        <th>Usuario</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customerEmail ?? `ID ${order.userId ?? "-"}`}</td>
                          <td>${order.total.toLocaleString()}</td>
                          <td>
                            <span className={styles.badge}>{order.status}</span>
                          </td>
                          <td>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
