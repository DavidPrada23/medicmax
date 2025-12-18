import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getProductos } from "../services/api";
import type { Producto } from "../types/Producto";

const IMAGENES_DESTACADAS = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1580281658629-47d4105f2155?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1584982751631-5e85c66bd72d?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=60",
];

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const categorias = [
    {
      id: 1,
      nombre: "Analgesicos y Antiinflamatorios",
      slug: "analgesicos-y-antiinflamatorios",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4iuiWkUzddLOzJ50-9-brW9Vet3L0iOJBXA-Ox1weEkBN7ALHeqBm7TSCbORdoSZFfS6r1A4ksSEsmzH67GHGkeUABKt_9y-G5klBMA93UsWxsukmchgm55FzQmFcPNre9m4SIyK0PE-FjWrfVVW-NIV8zhB6Nn_uQpsi7iHoTio6KO639zxU7PvX30N1VbmFG0deNj8mRJ31bCFdYJ093uRJjDwrM5SI6jQFDvapD5XNvX0gpsl-DTHYw6P9o35HIV3w5U_R1A",
    },
    {
      id: 4,
      nombre: "Cuidado Personal",
      slug: "cuidado-personal",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB_OkRTMhZlUMkno9Nm42WqYeJQcrj1pksZ0bJLnXl4xJ8yCtndXdW5EOk3L9-GXWzpZZM6cH03T4oCtGztWn156UJa1fbHMfYfe8QMVh6o3nrylJ-yzLj-SjNcidslHivhSx6LUufpCVR8Eb6bezOmn3p-pKahMLPM3w9kQuUU9x51m8uVx7jpDdOHvUK6BNgtkE1xiu2IKDiL2VoFfJA_Zzwzrb__DsHrY0Q1ndYwmvriIimcsX27cMrwoz8Z0EMCRAN2IWU60w",
    },
    {
      id: 2,
      nombre: "Vitaminas y Suplementos",
      slug: "vitaminas-y-suplementos",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9oircZC7uJpg9D2T1IW7EYerpoIhSN2RVEnJFnY1fu4CwKuGKjPYhxKQWc8kAPO41eFPIuKbZVaXwFVGtp6cvX7i_k9yRiYJvM6mCBd6k0etxA-jbSRTXAGQkJ0ZjvMbJ0V9dQek84c--OfZvlRCrAfZkA66lKXM1ERaiuR1iR2ME2zM6jP_m8jJRTMVXJ9WMYR5FJNsDEaI6MQLUNqAA8v4Gj_EYs1K1CUoS1i6TfNY93QRtzZNKB2dWiPODTFCVkDy7e0C2w",
    },
  ];

  useEffect(() => {
    async function loadProductos() {
      const data = await getProductos();
      const destacados = data.slice(0, 8).map((producto: Producto, index: number) => ({
        ...producto,
        imagen:
          producto.imagen ||
          IMAGENES_DESTACADAS[index % IMAGENES_DESTACADAS.length],
      }));
      setProductos(destacados);
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
              <CategoryCard
                key={c.id}
                categoria={c}
                onClick={() => navigate(`/categoria/${c.slug}`)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
