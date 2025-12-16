import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Ofertas.module.css";
import { getProductos } from "../services/api";
import type { Producto } from "../types/Producto";

type ProductoOferta = Producto & {
  precioOriginal: number;
  descuento: number;
};

export default function OfertasPage() {
  const [productos, setProductos] = useState<ProductoOferta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarOfertas() {
      const data = await getProductos();
      const productosConDescuento: ProductoOferta[] = data
        .slice(0, 6)
        .map((p: Producto, index: number) => ({
          ...p,
          precioOriginal: p.precio,
          precio: Math.round(p.precio * (index % 2 === 0 ? 0.8 : 0.9)),
          descuento: index % 2 === 0 ? 20 : 10,
        }));
      setProductos(productosConDescuento);
      setLoading(false);
    }
    cargarOfertas();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.tag}>Solo por esta semana</p>
            <h1>Ofertas exclusivas en MedicMax</h1>
            <p>Descuentos especiales en medicamentos y productos de cuidado personal.</p>
          </div>
          <div className={styles.heroBadge}>Hasta 20% OFF</div>
        </section>

        <section className={styles.section}>
          <h2>Productos en promoción</h2>
          {loading ? (
            <p>Cargando ofertas...</p>
          ) : (
            <div className={styles.grid}>
              {productos.map((p) => (
                <div key={`${p.id}-${p.descuento}`} className={styles.cardWrapper}>
                  <span className={styles.badge}>-{p.descuento}%</span>
                  <ProductCard producto={p} />
                  <div className={styles.precioOferta}>
                    <span className={styles.precioNuevo}>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(p.precio)}
                    </span>
                    <span className={styles.precioAnterior}>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(p.precioOriginal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
