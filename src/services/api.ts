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

export async function getProductos() {
  const resp = await fetch(`${API_URL}/productos`);
  if (!resp.ok) {
    console.error("Error al cargar productos");
    return [];
  }
  return resp.json();
}

export async function buscarProductos(query: string) {
  try {
    const resp = await fetch(
      `${API_URL}/productos/buscar?query=${encodeURIComponent(query)}`
    );

    if (!resp.ok) {
      const backendError = await resp.json().catch(() => ({}));
      console.error("Error backend:", backendError);

      return []; // devolver vacío para no romper el frontend
    }

    return resp.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    return [];
  }
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

export async function getProductosPaginados(page = 0, size = 12) {
  const resp = await fetch(`${API_URL}/productos/paginado?page=${page}&size=${size}`);
  return resp.json();
}

export async function getProducto(id: string | number) {
  const resp = await fetch(`${API_URL}/productos/${id}`);
  if (!resp.ok) throw new Error("Producto no encontrado");
  return resp.json();
}

export async function getRelacionados(id: string | number) {
  const resp = await fetch(`${API_URL}/productos/${id}/relacionados`);
  if (!resp.ok) return [];
  return resp.json();
}

