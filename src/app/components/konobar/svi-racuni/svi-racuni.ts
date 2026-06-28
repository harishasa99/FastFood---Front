import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-svi-racuni',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, HeaderComponent, FooterComponent],
  template: `
    <div class="ff-page">
      <app-header role="konobar" [ime]="'Konobar'"></app-header>

      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/konobar/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Svi računi</span>
        </div>

        <p *ngIf="ucitavanje" class="ff-empty">Učitavanje računa...</p>
        <p *ngIf="!ucitavanje && racuni.length === 0" class="ff-empty">Nema računa.</p>

        <div class="ff-racun-item" *ngFor="let r of racuni">
          <div class="ff-racun-header">
            <span class="ff-racun-date"> 📅 {{ r.datum }} u {{ r.vreme }} </span>
            <span class="ff-racun-amount">
              {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}
            </span>
          </div>
          <div class="ff-racun-row">
            <span style="color:#aaa">Račun ID</span>
            <span>{{ r.id | slice: 0 : 8 }}...</span>
          </div>
          <div class="ff-racun-row">
            <span style="color:#aaa">Korisnik ID</span>
            <span>{{ r.korisnikId | slice: 0 : 8 }}...</span>
          </div>
          <div class="ff-racun-row">
            <span style="color:#aaa">Konobar ID</span>
            <span>{{ r.konobarId | slice: 0 : 8 }}...</span>
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
export class SviRacuniComponent implements OnInit {
  racuni: any[] = [];
  ucitavanje = true;

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/racun/svi`).subscribe({
      next: (data) => {
        console.log('Svi racuni:', data);
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
