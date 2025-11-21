import { getProductosPorCategoria, getCategorias } from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CategoriaPage() {
  const { id } = useParams(); // este es el slug
  const [categoria, setCategoria] = useState<any>(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function cargar() {
      const cats = await getCategorias();
      const cat = cats.find((c: any) => c.slug === id);
      setCategoria(cat);

      const prods = await getProductosPorCategoria(id!);
      setProductos(prods);
    }
    cargar();
  }, [id]);
