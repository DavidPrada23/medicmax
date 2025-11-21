export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  precio: number;
  cantidad: number;
}

// Alias: para que en el código puedas usar tanto CartItem como Producto
export type CartItem = Producto;
