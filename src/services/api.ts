import type { PedidoRequest } from "../types/Pedido";
import type {
  AdminUser,
  AuthSession,
  AuthUser,
  LoginCredentials,
  PaidOrder,
  Role,
  UpdateProfilePayload,
} from "../types/Auth";

const API_URL = "http://localhost:8081";

// Tipado para filtros
export interface ProductosFiltradosParams {
  categoria?: string;
  marca?: string;
  min?: string | number;
  max?: string | number;
  page?: number;
  size?: number;
  query?: string;
}

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
  if (!resp.ok) {
    console.error("Error backend:", await resp.text());
    throw new Error("Error al cargar productos paginados");
  }
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

export async function getProductosFiltrados(filtros: ProductosFiltradosParams) {
  const params = new URLSearchParams();

  if (filtros.categoria) params.append("categoria", String(filtros.categoria));
  if (filtros.marca) params.append("marca", String(filtros.marca));
  if (filtros.min !== undefined && filtros.min !== "") params.append("min", String(filtros.min));
  if (filtros.max !== undefined && filtros.max !== "") params.append("max", String(filtros.max));
  params.append("page", String(filtros.page ?? 0));
  params.append("size", String(filtros.size ?? 12));

  // opcional: query de búsqueda
  if (filtros.query) params.append("query", String(filtros.query));

  const url = `${API_URL}/productos/filtro?${params.toString()}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    // registra y lanza el error con mensaje legible
    try {
      const err = await resp.json();
      console.error("Error backend filtros:", err);
    } catch {
      console.error("Error desconocido al cargar productos filtrados");
    }
    throw new Error("Error al cargar productos filtrados");
  }

  return resp.json();
}

interface ApiRoleObject {
  nombre?: string;
  name?: string;
}

interface ApiUserLike {
  id?: number | string;
  email?: string;
  username?: string;
  nombreUsuario?: string;
  address?: string;
  direccion?: string;
  roles?: Array<string | ApiRoleObject>;
}

interface LoginResponseLike {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: ApiUserLike;
  email?: string;
  username?: string;
  address?: string;
  roles?: Array<string | ApiRoleObject>;
  id?: number | string;
}

function normalizeRole(value: string): Role | null {
  const cleaned = value.replace("ROLE_", "").toLowerCase();
  if (cleaned === "admin") return "admin";
  if (cleaned === "user") return "user";
  return null;
}

function extractRoles(
  roles: Array<string | ApiRoleObject> | undefined,
  token?: string
): Role[] {
  const fromBody = (roles ?? [])
    .map((role) => (typeof role === "string" ? role : role.nombre ?? role.name))
    .filter((role): role is string => Boolean(role))
    .map(normalizeRole)
    .filter((role): role is Role => Boolean(role));

  if (fromBody.length > 0) {
    return Array.from(new Set(fromBody));
  }

  if (!token) return ["user"];

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as {
      roles?: string[];
      authorities?: string[];
    };
    const fromToken = [...(payload.roles ?? []), ...(payload.authorities ?? [])]
      .map(normalizeRole)
      .filter((role): role is Role => Boolean(role));
    return fromToken.length > 0 ? Array.from(new Set(fromToken)) : ["user"];
  } catch {
    return ["user"];
  }
}

function normalizeUser(data: ApiUserLike, token?: string): AuthUser {
  const idNumber = Number(data.id ?? 0);
  return {
    id: Number.isNaN(idNumber) ? 0 : idNumber,
    email: data.email ?? "",
    username: data.username ?? data.nombreUsuario ?? "",
    address: data.address ?? data.direccion ?? "",
    roles: extractRoles(data.roles, token),
  };
}

async function parseJsonSafe(response: Response) {
  return response.json().catch(() => ({}));
}

async function fetchFirst(
  paths: string[],
  init?: RequestInit
): Promise<Response> {
  let lastError: Response | null = null;

  for (const path of paths) {
    const response = await fetch(`${API_URL}${path}`, init);
    if (response.ok) return response;
    lastError = response;
  }

  if (lastError) return lastError;
  throw new Error("No se pudo conectar al backend");
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthSession> {
  const response = await fetchFirst(
    ["/auth/login", "/login", "/usuarios/login"],
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    throw new Error("Credenciales invalidas");
  }

  const data = (await parseJsonSafe(response)) as LoginResponseLike;
  const token = data.token ?? data.accessToken ?? data.jwt;

  if (!token) {
    throw new Error("El backend no devolvio token de sesion");
  }

  const user = normalizeUser(
    data.user ?? {
      id: data.id,
      email: data.email,
      username: data.username,
      address: data.address,
      roles: data.roles,
    },
    token
  );

  return { token, user };
}

export async function getMyProfile(token: string): Promise<AuthUser> {
  const response = await fetchFirst(["/users/me", "/usuarios/me", "/auth/me"], {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el perfil");
  }

  const data = (await parseJsonSafe(response)) as ApiUserLike;
  return normalizeUser(data, token);
}

export async function updateMyProfile(
  token: string,
  payload: UpdateProfilePayload
): Promise<AuthUser> {
  const response = await fetchFirst(["/users/me", "/usuarios/me"], {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el perfil");
  }

  const data = (await parseJsonSafe(response)) as ApiUserLike;
  return normalizeUser(data, token);
}

export async function getAdminUsers(token: string): Promise<AdminUser[]> {
  const response = await fetchFirst(
    ["/admin/users", "/usuarios", "/users"],
    { headers: authHeaders(token) }
  );

  if (!response.ok) {
    throw new Error("No se pudieron listar usuarios");
  }

  const data = (await parseJsonSafe(response)) as ApiUserLike[];
  return data.map((item) => normalizeUser(item, token));
}

export async function deleteAdminUser(token: string, userId: number) {
  const response = await fetchFirst(
    [`/admin/users/${userId}`, `/usuarios/${userId}`, `/users/${userId}`],
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar el usuario");
  }
}

interface ApiPaidOrder {
  id?: number | string;
  usuarioId?: number;
  userId?: number;
  correo?: string;
  customerEmail?: string;
  total?: number;
  montoTotal?: number;
  estado?: string;
  status?: string;
  createdAt?: string;
  fechaCreacion?: string;
}

export async function getPaidOrders(token: string): Promise<PaidOrder[]> {
  const response = await fetchFirst(
    ["/admin/orders/paid", "/pedidos/pagados", "/pedidos?status=paid"],
    {
      headers: authHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los pedidos pagados");
  }

  const data = (await parseJsonSafe(response)) as ApiPaidOrder[];
  return data.map((item) => {
    const idNumber = Number(item.id ?? 0);
    return {
      id: Number.isNaN(idNumber) ? 0 : idNumber,
      userId: item.userId ?? item.usuarioId,
      customerEmail: item.customerEmail ?? item.correo,
      total: item.total ?? item.montoTotal ?? 0,
      status: item.status ?? item.estado ?? "PAGADO",
      createdAt: item.createdAt ?? item.fechaCreacion,
    };
  });
}

