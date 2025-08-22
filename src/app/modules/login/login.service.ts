import { LoginColaborador, RefreshTokenResponse } from './login.types';
import { BehaviorSubject, Observable, retry, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Permisos } from '../users/users.types';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    const storedColaborador = localStorage.getItem('colaborador');
    if (storedColaborador) {
      try {
        const colaborador = JSON.parse(storedColaborador);
        this.colaboradorSubject.next(colaborador);
      } catch (error) {
        console.error('Error parsing stored colaborador data:', error);
        localStorage.removeItem('colaborador');
      }
    }
  }

  // Observables
  private colaboradorSubject = new BehaviorSubject<LoginColaborador | null>(
    null
  );
  colaborador$ = this.colaboradorSubject.asObservable();

  private permisosSubject = new BehaviorSubject<Permisos[]>([]);
  permisos$ = this.permisosSubject.asObservable();

  login(correo: string, codigo: string | null): Observable<LoginColaborador> {
    // Devuelve un observable con la respuesta de login
    const body = {
      correo: correo,
      codigo: codigo
    };
    
    // Add header to skip auth interceptor for login request
    const headers = new HttpHeaders().set('Skip-Auth-Interceptor', 'true');
    
    return this.http
      .post<LoginColaborador>(
        `${environment.apiURL}/auth/login`,
        body,
      )
      .pipe(
        tap((response: LoginColaborador) => {
          // Guardar tokens y datos del colaborador en localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('colaborador', JSON.stringify(response));

          // Actualizar el sujeto colaborador
          this.colaboradorSubject.next(response);
        }),
        retry(2) // Intentar nuevamente hasta 2 veces en caso de error
      );
  }

  permisos(id: string): Observable<Permisos[]> {
    return this.http
      .get<Permisos[]>(`${environment.apiURL}/auth/rolesColaborador/${id}`)
      .pipe(
        tap((value) => {
          this.permisosSubject.next(value);
        })
      );
  }

  getAccessToken(): string | null {
    const colaborador = this.colaboradorSubject.value;
    return colaborador?.accessToken || null;
  }

  getRefreshToken(): string | null {
    const colaborador = this.colaboradorSubject.value;
    return colaborador?.refreshToken || null;
  }

  logout(): void {
    this.colaboradorSubject.next(null);
    this.permisosSubject.next([]);
    localStorage.removeItem('colaborador');
  }

  isAuthenticated(): boolean {
    return this.colaboradorSubject.value !== null;
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const body = {
      refreshToken: refreshToken
    };

    // Add header to skip auth interceptor for refresh token request
    const headers = new HttpHeaders().set('Skip-Auth-Interceptor', 'true');

    return this.http
      .post<RefreshTokenResponse>(
        `${environment.apiURL}/auth/refreshToken`,
        body,
        { headers }
      )
      .pipe(
        tap((response: RefreshTokenResponse) => {
          // Update the current colaborador with the new access token
          const currentColaborador = this.colaboradorSubject.value;
          if (currentColaborador) {
            const updatedColaborador = {
              ...currentColaborador,
              accessToken: response.accessToken
            };
            this.colaboradorSubject.next(updatedColaborador);
            localStorage.setItem('colaborador', JSON.stringify(updatedColaborador));
          }
        })
      );
  }
}
