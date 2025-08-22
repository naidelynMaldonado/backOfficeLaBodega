// // -------- auth.guard.ts --------
// import { CanMatchFn, Route, UrlSegment, UrlTree, Router } from '@angular/router';
// import { isPlatformBrowser } from '@angular/common';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// export const authGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> => {
//   const router = inject(Router);
//   const auth = inject(AuthService);
//   const platformId = inject(PLATFORM_ID);
//   const url = '/' + segments.map((s) => s.path).join('/');

//   // 1) Comprobamos si estamos en navegador (no SSR)
//   if (!isPlatformBrowser(platformId)) {
//     return of(true);
//   }

//   // 2) Obtenemos el accessToken
//   const accessToken = auth.getAccessToken();
//   if (!accessToken) {
//     console.warn('  • No se encontró accessToken en localStorage.');
//     localStorage.setItem('redirectStartPage', url);
//     router.navigateByUrl('/login');
//     console.groupEnd();
//     return of(false);
//   }
//   console.log('  • AccessToken encontrado.');

//   // 3) Decodificamos el payload del accessToken
//   const payload = auth.decodePayload(accessToken);
//   if (!payload?.exp) {
//     console.warn('  • El accessToken está mal formado o sin campo exp.');
//     auth.logout();
//     localStorage.setItem('redirectStartPage', url);
//     router.navigateByUrl('/login');
//     console.groupEnd();
//     return of(false);
//   }

//   // 4) Comparamos fecha de expiración con el tiempo actual
//   const now = Math.floor(Date.now() / 1000);

//   if (payload.exp > now) {
//     const expectedRoles: string[] = route.data?.['roles'] ?? [];
//     if (expectedRoles.length > 0) {
//       const ok = auth.hasAnyRole(expectedRoles);
//       if (!ok) {
//         console.error('    • Rol insuficiente, redirigiendo a /unauthorized.');
//         return of(router.createUrlTree(['/unauthorized']));
//       }
//     }

//     // ⛔️ Validación adicional de permisos por módulo
//     // const permissions = inject(PermissionsService);
//     // const hasModuleAccess = permissions.hasModule(url);
//     // if (!hasModuleAccess) {
//     //   console.error(`    • No tiene permisos para acceder a la ruta: ${url}`);
//     //   return of(router.createUrlTree(['/unauthorized']));
//     // }

//     console.groupEnd();
//     return of(true);
//   }

//   // 5) Si llegamos aquí, el accessToken ha expirado
//   console.warn('  → El accessToken ha expirado (payload.exp ≤ now).');
//   const refreshToken = auth.getRefreshToken();
//   if (!refreshToken) {
//     console.warn('    • No existe refreshToken o ya expiró.');
//     auth.logout();
//     localStorage.setItem('redirectStartPage', url);
//     router.navigateByUrl('/login');
//     console.groupEnd();
//     return of(false);
//   }
//   console.log('    • RefreshToken encontrado.');

//   // 5.a) Decodificamos payload del refreshToken
//   const payloadRefresh = auth.decodePayload(refreshToken);
//   if (!payloadRefresh?.exp) {
//     console.warn('    • El refreshToken está mal formado o sin campo exp.');
//     auth.logout();
//     localStorage.setItem('redirectStartPage', url);
//     console.log('    • Limpiando sesión y redirigiendo a /login.');
//     router.navigateByUrl('/login');
//     console.groupEnd();
//     return of(false);
//   }
//   console.log(`    • Payload refreshToken decodificado: exp=${payloadRefresh.exp}`);
//   console.log(`    • Comparando exp(refreshToken)=${payloadRefresh.exp} con now=${now}`);

//   if (payloadRefresh.exp <= now) {
//     console.warn('    • El refreshToken también ha expirado (exp ≤ now).');
//     auth.logout();
//     localStorage.setItem('redirectStartPage', url);
//     console.log('    • Limpiando sesión y redirigiendo a /login.');
//     router.navigateByUrl('/login');
//     console.groupEnd();
//     return of(false);
//   }

//   // 6) El refreshToken sigue válido, intentamos refrescar
//   console.log('    → El refreshToken está vigente. Iniciando petición de refresco...');
//   return auth.refreshToken().pipe(
//     map(() => {
//       console.log('    🔄 Refresh exitoso: se obtuvo y almacenó nuevo accessToken.');

//       // 6.a) Una vez refrescado el token, validamos roles de nuevo (si aplica)
//       const expectedRoles2: string[] = route.data?.['roles'] ?? [];
//       if (expectedRoles2.length > 0) {
//         console.log('      • Roles esperados tras refresco:', expectedRoles2);
//         const ok2 = auth.hasAnyRole(expectedRoles2);
//         console.log(`      • Usuario cumple roles tras refresco?`, ok2);
//         if (!ok2) {
//           console.error('      • Rol insuficiente tras refrescar, redirigiendo a /unauthorized.');
//           console.groupEnd();
//           return router.createUrlTree(['/unauthorized']);
//         }
//       }

//       console.log('    ✔️ authGuard aprobado tras refrescar token.');
//       console.groupEnd();
//       return true as boolean;
//     }),
//     catchError((err) => {
//       console.error('    🔄 Falló la petición de refresh:', err);
//       auth.logout();
//       localStorage.setItem('redirectStartPage', url);
//       console.log('    • Limpiando sesión y redirigiendo a /login.');
//       router.navigateByUrl('/login');
//       console.groupEnd();
//       return of(false);
//     })
//   );
// };
