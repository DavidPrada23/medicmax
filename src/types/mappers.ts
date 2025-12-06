import type { ProductoDTO } from "./ProductoDTO";
import type { Producto } from "./Producto";

export function mapProductoDTOaProducto(dto: ProductoDTO): Producto {
  return {
    id: dto.id,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    imagen: dto.imagen || "placeholder-product.png",
    precio: dto.precio,
    stock: dto.stock,
    marca: dto.marca,
    categoriaNombre: dto.categoria.nombre,
    categoriaSlug: dto.categoria.slug,
  };
}