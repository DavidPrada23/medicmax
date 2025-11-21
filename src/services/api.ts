const API_URL = "http://.com/api";

export async function getCategorias() {
  const resp = await fetch(`${API_URL}/categorias`);
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

export async function crearPedido(data: any, token: string) {
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
