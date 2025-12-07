import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosFiltrados } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Catalogo.module.css";
import type { Producto } from "../types/Producto";

export default function CategoriaPage() {
  const { slug } = useParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      setLoading(true);

      const data = await getProductosFiltrados({
        categoria: slug,
        page: 0,
        size: 20,
      });

      setProductos(data.content || []);
      setLoading(false);
    }

    cargar();
  }, [slug]);

  return (
    <>
      <Navbar />

      <main className={styles.main}>
        <h1>Categoría: {slug}</h1>

        {loading ? (
          <p>Cargando...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos en esta categoría.</p>
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