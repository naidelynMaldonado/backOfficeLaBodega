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

  console.log('Interceptor ejecutado para la URL:', req.url);

  // Verificar si debemos omitir la autenticación para esta request
  if (req.headers.has('Skip-Auth-Interceptor')) {
    const modifiedReq = req.clone({
      headers: req.headers.delete('Skip-Auth-Interceptor')
    });
    return next(modifiedReq);
  }

  const accessToken = localStorage.getItem('accessToken');
  console.log('Access Token:', accessToken); // Debugging log

  // Determinar tipo de endpoint
  const isAuthEndpoint = req.url.includes('/auth/');
  const isYaloEndpoint = req.url.includes('yalocobro.com');

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
    console.log('Authorization header added:', headers.get('Authorization')); // Debugging log
  } else {
    console.warn('No access token found in localStorage.');
  }

  // TODO: El servidor no está configurado para aceptar yc-key en CORS
  // Solo agregar API Key para URLs específicas (comentado hasta que se configure CORS)
  // if (!isAuthEndpoint && environment.apiKey) {
  //   headers = headers.set('yc-key', environment.apiKey);
  // }
  
  // Para endpoints de Yalo, usar keyYalo (solo si es necesario)
  if (isYaloEndpoint && environment.keyYalo) {
    headers = headers.set('yalo-key', environment.keyYalo);
  }

  console.log('Encabezados configurados:', headers);

  // Clonamos la petición con los headers finales
  const modifiedReq = req.clone({ headers });

  // Enviamos la petición y manejamos errores 401
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`Estado HTTP: ${error.status} | Mensaje: ${error.message}`);

      if (error.status === 401 && accessToken) {
        console.warn('Recibido 401. Intentando refreshToken antes de reintentar.');

        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newToken = response.accessToken;
            console.log('Refresh exitoso. Nuevo accessToken:', newToken);

            // Clonamos de nuevo la petición original con el nuevo token
            let retryHeaders = headers.set('Authorization', `Bearer ${newToken}`);
            
            // TODO: No agregar yc-key hasta que se configure CORS en el servidor
            // Solo agregar yc-key si no es un endpoint de auth
            // if (!isAuthEndpoint && environment.apiKey) {
            //   retryHeaders = retryHeaders.set('yc-key', environment.apiKey);
            // }

            const retryReq = req.clone({ headers: retryHeaders });

            return next(retryReq);
          }),
          catchError(refreshError => {
            console.error('Falló la petición de refreshToken:', refreshError);
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Si es 401 pero no tenemos token, redirigir al login
      if (error.status === 401 && !accessToken) {
  authService.logout();
  router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
