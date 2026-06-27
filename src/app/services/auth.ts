import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7147/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  registracija(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registracija`, data);
  }

  prijavaKorisnik(email: string, lozinka: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/prijava/korisnik`, { email, lozinka })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('uloga', res.uloga);
          localStorage.setItem('ime', res.ime);
          localStorage.setItem('id', res.id);
        }),
      );
  }

  prijavaKonobar(ime: string, lozinka: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/prijava/konobar`, { ime, lozinka })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('uloga', res.uloga);
          localStorage.setItem('ime', res.ime);
          localStorage.setItem('id', res.id);
        }),
      );
  }

  odjava() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUloga(): string | null {
    return localStorage.getItem('uloga');
  }

  getIme(): string | null {
    return localStorage.getItem('ime');
  }

  getId(): string | null {
    return localStorage.getItem('id');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
