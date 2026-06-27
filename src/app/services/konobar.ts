import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik, Konobar } from '../models';

@Injectable({ providedIn: 'root' })
export class KonobarService {
  private apiUrl = 'https://localhost:7147/api';

  constructor(private http: HttpClient) {}

  getSviKorisnici(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(`${this.apiUrl}/korisnik/svi`);
  }

  getProfil(): Observable<Konobar> {
    return this.http.get<Konobar>(`${this.apiUrl}/konobar/profil`);
  }

  getSviKonobari(): Observable<Konobar[]> {
    return this.http.get<Konobar[]>(`${this.apiUrl}/konobar/svi`);
  }
}
