export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;  // opcional
  marca?: string;   // opcional
}
