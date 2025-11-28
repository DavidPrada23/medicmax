import { useEffect, useState } from "react";
import { getProductos } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Catalogo.module.css";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const data = await getProductos();
      setProductos(data);
      setLoading(false);
    }
    cargar();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1>Catálogo de Productos</h1>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className={styles.grid}>
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
