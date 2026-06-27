import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proizvod } from '../models';

@Injectable({ providedIn: 'root' })
export class ProizvodService {
  private apiUrl = 'https://localhost:7147/api/proizvod';

  constructor(private http: HttpClient) {}

  getSvi(): Observable<Proizvod[]> {
    return this.http.get<Proizvod[]>(this.apiUrl);
  }

  getById(id: string): Observable<Proizvod> {
    return this.http.get<Proizvod>(`${this.apiUrl}/${id}`);
  }

  kreiraj(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  azuriraj(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  obrisi(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
