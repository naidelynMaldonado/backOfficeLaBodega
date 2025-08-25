import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class HomeService {
  constructor(private http: HttpClient) {}
  
  getHomeEditData(): Observable<any> {
    return this.http.get(`${environment.apiURL}/home/homeEdit`);
  }
}