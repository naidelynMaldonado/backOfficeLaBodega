import { Injectable } from '@angular/core';
import { rol } from './roles.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

interface ApiRole {
  rolid: number;
  rolnombre: string;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private http: HttpClient) {}

  /** Fetch roles from API and map to local shape */
  fetchRoles(): Observable<rol[]> {
    const url = `${environment.apiURL}/users/roles`;
    return this.http.get<ApiRole[]>(url).pipe(
      take(1),
      map((apiRoles: ApiRole[]) => apiRoles.map(apiRole => ({
        id: apiRole.rolid,
        nombre: apiRole.rolnombre,
        estado: apiRole.activo ? 'activo' : 'inactivo',
        permissions: {}
      })))
    );
  }

  toggleRoleActive(id: number, newStatus: boolean) {
    const url = `${environment.apiURL}/users/roles/${id}/active`;
    return this.http.patch(url, { activo: newStatus }).pipe(
      take(1)
    );
  }

  getPermisos(): Observable<any> {
    return this.http.get(`${environment.apiURL}/users/permisos`);
  }

  /** Load a single role including its assigned modules/actions (used to prefill form) */
  loadRolePermissions(id: number): Observable<any> {
    const url = `${environment.apiURL}/users/roles/${id}`;
  // Do not toggle global loading when called from the drawer to avoid blocking UI.
  return this.http.get<any>(url).pipe(take(1));
  }

  saveRole(roleData: any, roleId?: number) {
    if (roleId) {
      const url = `${environment.apiURL}/users/roles/${roleId}`;
      return this.http.patch(url, roleData).pipe(take(1));
    }
    const url = `${environment.apiURL}/users/roles`;
    return this.http.post(url, roleData).pipe(take(1));
  }

}
