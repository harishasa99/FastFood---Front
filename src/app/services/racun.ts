import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Racun, KreirajRacunDto } from '../models';

@Injectable({ providedIn: 'root' })
export class RacunService {
  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api/racun';

  constructor(private http: HttpClient) {}

  kreirajRacun(data: KreirajRacunDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  mojiRacuni(): Observable<Racun[]> {
    return this.http.get<Racun[]>(`${this.apiUrl}/moji`);
  }

  getById(id: string): Observable<Racun> {
    return this.http.get<Racun>(`${this.apiUrl}/${id}`);
  }

  sviRacuni(): Observable<Racun[]> {
    return this.http.get<Racun[]>(`${this.apiUrl}/svi`);
  }

  racuniZaKorisnika(korisnikId: string): Observable<Racun[]> {
    return this.http.get<Racun[]>(`${this.apiUrl}/korisnik/${korisnikId}`);
  }
}
