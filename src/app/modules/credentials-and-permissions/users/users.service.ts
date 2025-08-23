import {
  Colaboradores,
  DetalleColaborador,
  newColaborador,
  NuevoColaborador,
  removeColaborador,
  Roles,
  updateColaborador,
  updatePassword,
} from './users.types';
import { BehaviorSubject, Observable, retry, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const accessToken = sessionStorage.getItem('accessToken');
const rouletteToken = sessionStorage.getItem('rouletteToken');

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  //Observables
  private colaboradoresSubject = new BehaviorSubject<Colaboradores[]>([]);
  colaboradores$ = this.colaboradoresSubject.asObservable();

  private colaboradorDetailsSubject = new BehaviorSubject<Colaboradores[]>([]);
  colaborador$ = this.colaboradorDetailsSubject.asObservable();

  private rolesSubject = new BehaviorSubject<Roles[]>([]);
  roles$ = this.rolesSubject.asObservable();

  getRoles() {
    return this.http
      .get<Roles[]>(`${environment.apiURL}/users/roles`)
      .pipe(
        tap((value) => {
          this.rolesSubject.next(value);
        })
      );
  }

  getColaboradores() {
    return this.http
      .get<Colaboradores[]>(`${environment.apiURL}/users`)
      .pipe(
        tap((value) => {
          this.colaboradoresSubject.next(value);
        })
      );
  }

  getColaboradorDetail(id: number) {
    return this.http.get<DetalleColaborador>(
      `${environment.apiURL}/users/${id}`,
    );
  }

  removeColaboradores(formData: removeColaborador) { 
    return this.http
      .delete<Colaboradores[]>(
        `${environment.apiURL}/users/${formData.id}`,
        {}
      )
      .pipe(
        tap((value) => {
          this.colaboradoresSubject.next(value);
        })
      );
  }

  newColaborador(formData: newColaborador) {
    return this.http.post<[]>(
      `${environment.apiURL}/users`,
      formData,
    );
  }

  updateColaborador(formData: updateColaborador) {
    return this.http.patch<[]>(
      `${environment.apiURL}/users/${formData.data.id}`,
      formData,
    );
  }

  newPassword(formData: updatePassword) {
    return this.http.post<[]>(
      `${environment.apiURL}/auth/sendPassword`,
      formData
    );
  }

  updatePassword(formData: updatePassword) {
    return this.http.patch<[]>(
      `${environment.apiURL}/users/password`,
      formData,
    );
  }
}
