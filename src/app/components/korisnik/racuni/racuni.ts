import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-racuni',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, HeaderComponent, FooterComponent],
  template: `
    <div class="ff-page">
      <app-header role="korisnik" [ime]="ime"></app-header>
      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/korisnik/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Moji računi</span>
        </div>

        <p *ngIf="ucitavanje" class="ff-empty">Učitavanje računa...</p>
        <p *ngIf="!ucitavanje && racuni.length === 0" class="ff-empty">Nemate još računa.</p>

        <div class="ff-racun-item" *ngFor="let r of racuni">
          <div class="ff-racun-header">
            <span class="ff-racun-date">📅 {{ r.datum }} u {{ r.vreme }}</span>
            <span class="ff-racun-amount">{{
              r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0'
            }}</span>
          </div>
          <div class="ff-racun-row" *ngFor="let s of r.stavke">
            <span>{{ s.naziv }} × {{ s.kolicina }}</span>
            <span>{{ s.cena * s.kolicina | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
          </div>
          <div
            style="display:flex;justify-content:flex-end;padding-top:8px;font-size:14px;font-weight:500;color:var(--ff-orange)"
          >
            Ukupno: {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}
          </div>
        </div>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [],
})
export class RacuniComponent implements OnInit {
  racuni: any[] = [];
  ucitavanje = true;
  ime = '';

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
  ) {
    this.ime = this.auth.getIme() || 'Korisnik';
  }

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/racun/moji`).subscribe({
      next: (data) => {
        this.racuni = data;
        this.ucitavanje = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Greska:', err);
        this.ucitavanje = false;
        this.cdr.detectChanges();
        this.snackBar.open('Greška pri učitavanju računa', 'OK', { duration: 3000 });
      },
    });
  }
}
