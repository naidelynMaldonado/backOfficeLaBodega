// auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.headers.has('Skip-Auth-Interceptor')) {
    const modifiedReq = req.clone({
      headers: req.headers.delete('Skip-Auth-Interceptor')
    });
    return next(modifiedReq);
  }

  const accessToken = localStorage.getItem('accessToken');

  // Configurar Content-Type si es necesario
  const shouldSetContentType =
    ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase()) &&
    !req.headers.has('Content-Type');

  let headers = req.headers;
  if (shouldSetContentType) {
    headers = headers.set('Content-Type', 'application/json');
  }

  // Agregar Authorization header si tenemos token
  if (accessToken) {
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
  } 

  // Clonamos la petición con los headers finales
  const modifiedReq = req.clone({ headers });

  // Enviamos la petición y manejamos errores 401
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`Estado HTTP: ${error.status} | Mensaje: ${error.message}`);

      if (error.status === 401 && accessToken) {
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newToken = response.accessToken;

            // Clonamos de nuevo la petición original con el nuevo token
            let retryHeaders = headers.set('Authorization', `Bearer ${newToken}`);

            const retryReq = req.clone({ headers: retryHeaders });

            return next(retryReq);
          }),
          catchError(refreshError => {
            console.error('Falló la petición de refreshToken:', refreshError);
            authService.logout();
            router.navigate(['']);
            return throwError(() => refreshError);
          })
        );
      }

      // Si es 401 pero no tenemos token, redirigir al 
      if (error.status === 401 && !accessToken) {
        authService.logout();
        router.navigate(['']);
      }

      return throwError(() => error);
    })
  );
};
