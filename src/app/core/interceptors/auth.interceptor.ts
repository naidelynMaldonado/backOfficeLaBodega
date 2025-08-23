// auth.interceptor.ts
import { inject, NgZone } from '@angular/core';
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
  const ngZone = inject(NgZone);

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

  // Si la petición es hacia el endpoint de refresh token, no intentamos re-fresh ni interceptar 401s aquí
  const isRefreshEndpoint = req.url.includes('/auth/refreshToken');
  if (isRefreshEndpoint) {
    return next(modifiedReq);
  }

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
          catchError((refreshError: HttpErrorResponse) => {
            console.error('Falló la petición de refreshToken:', refreshError, 'status:', refreshError?.status);
            // Limpiar auth siempre
            authService.logout();
            // Ejecutar la navegación dentro de la NgZone para asegurar que Angular la procese
            try {
              ngZone.run(() => {
                // Si el endpoint de refresh devuelve 401 o no tenemos un status, redirigir a la raíz
                if (!refreshError || refreshError.status === 401) {
                  router.navigateByUrl('/');
                }
              });
            } catch (navErr) {
              console.error('Error al navegar tras refresh fallido:', navErr);
            }
            return throwError(() => refreshError);
          })
        );
      }

      // Si es 401 pero no tenemos token, redirigir al 
      if (error.status === 401 && !accessToken) {
        authService.logout();
        try {
          ngZone.run(() => router.navigateByUrl('/'));
        } catch (navErr) {
          console.error('Error al navegar tras 401 sin accessToken:', navErr);
        }
      }

      return throwError(() => error);
    })
  );
};
