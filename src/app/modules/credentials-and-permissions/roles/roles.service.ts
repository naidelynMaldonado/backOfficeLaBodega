import { Injectable } from '@angular/core';
import { rol } from './roles.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';
import { LoadingService } from '../../../core/services/loading.service';

interface ApiRole {
  rolid: number;
  rolnombre: string;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private http: HttpClient, private loadingService: LoadingService) {}

  /** Fetch roles from API and map to local shape */
  fetchRoles(): Observable<rol[]> {
    const url = `${environment.apiURL}/users/roles`;
    this.loadingService.onLoading();
    return this.http.get<ApiRole[]>(url).pipe(
      take(1),
      map((apiRoles: ApiRole[]) => apiRoles.map(apiRole => ({
        id: apiRole.rolid,
        nombre: apiRole.rolnombre,
        estado: apiRole.activo ? 'activo' : 'inactivo',
        permissions: {}
      }))),
      finalize(() => this.loadingService.offLoading())
    );
  }

  toggleRoleActive(id: number, newStatus: boolean) {
    const url = `${environment.apiURL}/users/roles/${id}/active`;
    this.loadingService.onLoading();
    return this.http.patch(url, { activo: newStatus }).pipe(
      take(1),
      finalize(() => this.loadingService.offLoading())
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
      this.loadingService.onLoading();
      return this.http.patch(url, roleData).pipe(finalize(() => this.loadingService.offLoading()));
    }
    const url = `${environment.apiURL}/users/roles`;
    this.loadingService.onLoading();
    return this.http.post(url, roleData).pipe(finalize(() => this.loadingService.offLoading()));
  }

}
