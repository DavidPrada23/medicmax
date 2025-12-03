export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  precio: number;
  stock: number;
  marca: string;

  categoriaNombre?: string;
  categoriaSlug?: string;

  // usado cuando el producto está en el carrito
  cantidad?: number;
}

export interface CartItem extends Producto {
  cantidad: number;
}
