// -------- auth.guard.ts --------
import { CanMatchFn, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const url = '/' + segments.map((s) => s.path).join('/');

  // 1) Comprobamos si estamos en navegador (no SSR)
  if (!isPlatformBrowser(platformId)) {
    return of(true);
  }

  // 2) Obtenemos el accessToken
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.warn('No access token found. Redirecting to login.');
    auth.logout();
    return of(router.createUrlTree(['/login']));
  }

  // 3) Decodificamos el payload del accessToken
  const payload = auth.decodePayload(accessToken);
  if (!payload?.exp) {
    console.warn('Access token is malformed or missing exp field. Redirecting to login.');
    auth.logout();
    return of(router.createUrlTree(['/login']));
  }

  // 4) Comparamos fecha de expiración con el tiempo actual
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp > now) {
    return of(true);
  }

  // 5) Si llegamos aquí, el accessToken ha expirado
  console.warn('Access token has expired. Redirecting to login.');
  auth.logout();
  return of(router.createUrlTree(['/login']));
};
