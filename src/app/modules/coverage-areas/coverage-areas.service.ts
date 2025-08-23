import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZonesResponse } from './coverage-areas.types';
import { environment } from '../../../environments/environment';

export interface ShippingProvider {
  codproveedor: number;
  nombreproveedor: string;
  colorsombreado: string;
  colorborde: string;
}

export interface ZoneCoordinate {
  codProveedor: number;
  codzona: number;
  codzonacoordenadas: number;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoverageAreasService {

  constructor(private http: HttpClient) {}


  // Shipping Providers Methods
  getShippingProviders(): Observable<ShippingProvider[]> {
    return this.http.get<ShippingProvider[]>(`${environment.apiURL}/zoneCoverage/shippingProviders`);
  }

  getZoneCoverage(providerId: number, token: string): Observable<ZoneCoordinate[]> {
    const url = `${environment.apiURL}/zoneCoverage?moovinToken=${token}&provider=${providerId}`;
    return this.http.get<ZoneCoordinate[]>(url);
  }

  createZone(zoneData: {
    codproveedor: number;
    codzona: number;
    nombrezona: string;
    coordenadas: { lat: number; lng: number }[];
  }): Observable<any> {
    const url = `${environment.apiURL}/zoneCoverage/zones`;
    return this.http.post<any>(url, zoneData);
  }

  updateZone(zoneData: {
    codproveedor: number;
    codzona: number;
    nombrezona: string;
    coordenadas: { lat: number; lng: number }[];
  }): Observable<any> {
    const url = `${environment.apiURL}/zoneCoverage/zones/${zoneData.codzona}`;
    return this.http.put<any>(url, zoneData);
  }

  deleteZone(zoneId: number): Observable<any> {
    const url = `${environment.apiURL}/zoneCoverage/zones/${zoneId}`;
    return this.http.delete<any>(url);
  }

  getZoneDetails(zoneId: number): Observable<any> {
    const url = `${environment.apiURL}/zoneCoverage/zones/${zoneId}`;
    return this.http.get<any>(url);
  }

  editZoneVisual(zone: any): Observable<any> {
    // Simulación de edición visual
    console.log(`Zona ${zone.codzona} editada en el mapa.`);
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  deleteZoneVisual(zone: any): Observable<any> {
    // Simulación de eliminación visual
    console.log(`Zona ${zone.codzona} eliminada del mapa.`);
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }
}
