import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RouletteAwards, RouletteConfig } from './prize-wheel.types';

@Injectable({ providedIn: 'root' })
export class PrizeWheelService {

  constructor(private http: HttpClient) {}
    private api: string = environment.apiURL;

    getRouletteAwards(): Observable<RouletteAwards> {
      return this.http.get<RouletteAwards>(`${this.api}/roulette/awards`);
    }
  
    getRouletteConfig(): Observable<RouletteConfig[]> {
      return this.http.get<RouletteConfig[]>(`${this.api}/roulette/config`);
    }

    putRouletteAwards(formData: any): Observable<any> {
      return this.http.post<any>(`${this.api}/roulette/awards`, formData);
    }

    putRouletteConfig(formData: any): Observable<any> {
      return this.http.put<any>(`${this.api}/roulette/config`, formData);
    }
}
