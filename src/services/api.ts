import type { PedidoRequest } from "../types/Pedido";

const API_URL = "http://localhost:8081";

export async function getCategorias() {
  const resp = await fetch(`${API_URL}/categorias`);
  return resp.json();
}

export async function getCategoriasPorSlug(slug: string) {
  const resp = await fetch(`${API_URL}/categorias/slug/${slug}`);
  return resp.json();
}

export async function getProductosPorCategoria(slug: string) {
  const resp = await fetch(`${API_URL}/categorias/${slug}/productos`);
  return resp.json();
}

export async function getProducto(id: number) {
  const resp = await fetch(`${API_URL}/productos/${id}`);
  return resp.json();
}

export async function buscarProductos(query: string) {
    const resp = await fetch(`${API_URL}/productos/buscar?query=${encodeURIComponent(query)}`);
    return resp.json();
    }

export async function crearPedido(data: PedidoRequest, token: string) {
  const resp = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return resp.json();
}
