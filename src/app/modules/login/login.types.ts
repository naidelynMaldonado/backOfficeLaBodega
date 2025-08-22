export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  correo: string;
  rolnombre: string;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rolnombre: string;
}
