export type Role = "user" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  address?: string;
  roles: Role[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  username?: string;
  address?: string;
  password?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  address?: string;
  roles: Role[];
}

export interface PaidOrder {
  id: number;
  userId?: number;
  customerEmail?: string;
  total: number;
  status: string;
  createdAt?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
