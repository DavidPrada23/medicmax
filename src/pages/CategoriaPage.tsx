import { getProductosPorCategoria, getCategoriasPorSlug } from "../services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Categoria } from "../types/Categoria";
import type { Producto } from "../types/Producto";

export default function CategoriaPage() {
  const { id } = useParams(); // slug recibido por URL
  const [categoria, setCategoria] = useState<Categoria  | null >(null);
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    async function cargar() {
        if (!id) return;
        const cat = await getCategoriasPorSlug(id);
        setCategoria(cat);

        const prods = await getProductosPorCategoria(id);
        setProductos(prods);
    }
    cargar();
  }, [id]);

  return (
    <div>
      <h1>Categoría: {categoria ? categoria.nombre : "Cargando..."}</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre}</li>
        ))}
      </ul>
    </div>
  );
}