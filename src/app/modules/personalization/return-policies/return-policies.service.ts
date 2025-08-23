import { BehaviorSubject, Observable, retry, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Content, updateContent } from './return-policies.types';

const accessToken = sessionStorage.getItem('accessToken');

@Injectable({ providedIn: 'root' })
export class ReturnPoliciesService {
  constructor(private http: HttpClient) {}

  //Observables
  private contentSubject = new BehaviorSubject<Content[]>([]);
  content$ = this.contentSubject.asObservable();

  getContent() {
    return this.http
      .get<Content>(`${environment.apiURL}/returnPolicies/returnEdit`)
  }

  putContent(formData: updateContent): Observable<any> {
    return this.http.put<updateContent>(
      `${environment.apiURL}/returnPolicies/updateReturn`,
      formData
    );
  }

  publishContent(formData: updateContent): Observable<any> {
    return this.http.put<updateContent>(
      `${environment.apiURL}/returnPolicies/publishReturn`,
      formData
    );
  }

}