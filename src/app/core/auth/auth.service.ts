import { PLATFORM_ID, Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Login {
  id: number;
  nombre: string;
  correo: string;
  rolnombre: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PermissionsResponse {
  PermissionsModules: any[];
  PermissionsActions: any[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiURL;

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Login principal que guarda en localStorage
  login(email: string, code?: string): Observable<Login> {
    if (!this.isBrowser()) return of() as Observable<Login>;
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<Login>(url, { correo: email, codigo: code || null }).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('username', res.nombre);
        localStorage.setItem('rolename', res.rolnombre);
        localStorage.setItem('userId', res.id.toString());
      })
    );
  }

  // Enviar código de acceso
  sendCodeLogin(email: string): Observable<any> {
    const url = `${this.apiUrl}/auth/sendCodeLogin`;
    return this.http.post(url, { correo: email });
  }

  setAccessToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('accessToken', token);
    }
  }

  setRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('refreshToken', token);
    }
  }

  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('refreshToken');
  }

  logout(): void {
  // Solo limpiar almacenamiento; la navegación la maneja el componente UI
  localStorage.clear();
  sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;

    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    // Verificar si el token no ha expirado
    const payload = this.decodePayload(accessToken);
    if (!payload?.exp) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUserName(): string | null {
    return this.isBrowser() ? localStorage.getItem('username') : null;
  }

  getUserRoles(): string[] {
  const role = this.isBrowser() ? localStorage.getItem('rolename') : null;
    return role ? [role] : [];
  }

  hasAnyRole(expected: string[]): boolean {
    const roles = this.getUserRoles();
    return expected.some((r) => roles.includes(r));
  }

  decodePayload(token: string): { exp?: number; [key: string]: any } | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    const url = `${this.apiUrl}/auth/refreshToken`;
    return this.http.post<RefreshResponse>(url, { refreshToken }).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        if (response.refreshToken) {
          this.setRefreshToken(response.refreshToken);
        }
      }),
      catchError((err) => {
        // En caso de error (refresh token inválido o expirado), limpiamos todo
        this.logout();
        return throwError(() => err);
      })
    );
  }

  getPermissions(): Observable<PermissionsResponse> {
    const url = `${this.apiUrl}/auth/permissions`;
    return this.http.get<PermissionsResponse>(url);
  }
}
