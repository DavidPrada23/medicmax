export interface PedidoItem {
  productoId: number;
  cantidad: number;
  precio: number;
}

export interface PedidoRequest {
  nombre: string;
  direccion: string;
  municipio: string;
  telefono: string;
  correo: string;
  metodoPago: string;
  tipoEntrega: "envio" | "retiro";
  sede?: string;
  subtotal: number;
  impuestos: number;
  envio: number;
  total: number;
  productos: PedidoItem[];
}
