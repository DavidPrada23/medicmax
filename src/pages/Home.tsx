import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getProductos } from "../services/api";
import type { Producto } from "../types/Producto";

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const categorias = [
    {
      id: 1,
      nombre: "Medicamentos",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4iuiWkUzddLOzJ50-9-brW9Vet3L0iOJBXA-Ox1weEkBN7ALHeqBm7TSCbORdoSZFfS6r1A4ksSEsmzH67GHGkeUABKt_9y-G5klBMA93UsWxsukmchgm55FzQmFcPNre9m4SIyK0PE-FjWrfVVW-NIV8zhB6Nn_uQpsi7iHoTio6KO639zxU7PvX30N1VbmFG0deNj8mRJ31bCFdYJ093uRJjDwrM5SI6jQFDvapD5XNvX0gpsl-DTHYw6P9o35HIV3w5U_R1A",
    },
    {
      id: 4,
      nombre: "Cuidado Personal",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB_OkRTMhZlUMkno9Nm42WqYeJQcrj1pksZ0bJLnXl4xJ8yCtndXdW5EOk3L9-GXWzpZZM6cH03T4oCtGztWn156UJa1fbHMfYfe8QMVh6o3nrylJ-yzLj-SjNcidslHivhSx6LUufpCVR8Eb6bezOmn3p-pKahMLPM3w9kQuUU9x51m8uVx7jpDdOHvUK6BNgtkE1xiu2IKDiL2VoFfJA_Zzwzrb__DsHrY0Q1ndYwmvriIimcsX27cMrwoz8Z0EMCRAN2IWU60w",
    },
    {
      id: 2,
      nombre: "Vitaminas y Suplementos",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9oircZC7uJpg9D2T1IW7EYerpoIhSN2RVEnJFnY1fu4CwKuGKjPYhxKQWc8kAPO41eFPIuKbZVaXwFVGtp6cvX7i_k9yRiYJvM6mCBd6k0etxA-jbSRTXAGQkJ0ZjvMbJ0V9dQek84c--OfZvlRCrAfZkA66lKXM1ERaiuR1iR2ME2zM6jP_m8jJRTMVXJ9WMYR5FJNsDEaI6MQLUNqAA8v4Gj_EYs1K1CUoS1i6TfNY93QRtzZNKB2dWiPODTFCVkDy7e0C2w",
    },
  ];

  useEffect(() => {
    async function loadProductos() {
      const data = await getProductos();
      setProductos(data.slice(0, 4)); // Mostrar solo los primeros 4 productos
      setLoading(false);
    }
    loadProductos();
  }, []);

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Productos Destacados</h2>

          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <>
              <div className={styles.grid}>
                {productos.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>

              <div className={styles.verMasContainer}>
                <button
                  className={styles.btnVerMas}
                  onClick={() => navigate("/catalogo")}
                >
                  Ver todos los productos →
                </button>
              </div>
            </>
          )}
        </section>

        <section className={styles.section}>
          <h2>Categorías</h2>
          <div className={styles.gridCategorias}>
            {categorias.map((c) => (
              <CategoryCard key={c.id} categoria={c} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
