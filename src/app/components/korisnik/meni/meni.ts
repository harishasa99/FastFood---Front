import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ProizvodService } from '../../../services/proizvod';
import { Proizvod } from '../../../models';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-meni',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, HeaderComponent, FooterComponent],
  template: `
    <div class="ff-page">
      <app-header role="korisnik" [ime]="'Korisnik'"></app-header>

      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/korisnik/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Naš meni</span>
        </div>

        <p *ngIf="ucitavanje" class="ff-empty">Učitavanje proizvoda...</p>

        <div class="ff-menu-grid">
          <div class="ff-menu-card" *ngFor="let p of proizvodi">
            <div class="ff-menu-name">{{ p.naziv }}</div>
            <div class="ff-menu-desc">{{ p.opis }}</div>
            <div class="ff-menu-bottom">
              <span class="ff-menu-price">{{ p.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
              <button class="ff-btn-add" (click)="dodajUKorpu(p)">+ Dodaj</button>
            </div>
          </div>
        </div>

        <div class="ff-korpa" *ngIf="korpa.length > 0">
          <div class="ff-korpa-title">🛒 Korpa</div>
          <div class="ff-korpa-row" *ngFor="let k of korpa">
            <span>{{ k.naziv }} × {{ k.kolicina }}</span>
            <div style="display:flex;align-items:center;gap:12px">
              <span>{{ k.cena * k.kolicina | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
              <button
                style="background:none;border:none;color:#a32d2d;cursor:pointer;font-size:16px;padding:0"
                (click)="ukloni(k.id)"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="ff-korpa-total">
            <span>Ukupno</span>
            <span>{{ ukupno() | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
          </div>
          <button class="ff-btn-primary" (click)="posaljiNarudzbu()">
            📨 Pošalji narudžbu konobaru
          </button>
          <button
            style="width:100%;margin-top:6px;padding:8px;background:none;border:1px solid #ddd;border-radius:6px;cursor:pointer;color:#888;font-size:13px"
            (click)="ocistiKorpu()"
          >
            🗑️ Očisti korpu
          </button>
        </div>

        <div class="ff-success-banner" *ngIf="poslato">
          ✅ Narudžba je poslata konobaru! Sačekajte račun.
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [],
})
export class MeniComponent implements OnInit {
  proizvodi: Proizvod[] = [];
  korpa: Array<Proizvod & { kolicina: number }> = [];
  ucitavanje = true;
  poslato = false;

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api';

  constructor(
    private proizvodService: ProizvodService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.proizvodService.getSvi().subscribe({
      next: (data) => {
        this.proizvodi = [...data];
        this.ucitavanje = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Greska:', err);
        this.ucitavanje = false;
        this.cdr.detectChanges();
        this.snackBar.open('Greška pri učitavanju menija', 'OK', { duration: 3000 });
      },
    });
  }

  dodajUKorpu(p: Proizvod) {
    const existing = this.korpa.find((k) => k.id === p.id);
    if (existing) {
      existing.kolicina++;
    } else {
      this.korpa.push({ ...p, kolicina: 1 });
    }
    this.cdr.detectChanges();
    this.snackBar.open(`${p.naziv} dodan u korpu`, 'OK', { duration: 1500 });
  }

  ukloni(id: string) {
    this.korpa = this.korpa.filter((k) => k.id !== id);
    this.cdr.detectChanges();
  }

  ocistiKorpu() {
    this.korpa = [];
    this.poslato = false;
    this.cdr.detectChanges();
  }

  ukupno(): number {
    return this.korpa.reduce((sum, k) => sum + k.cena * k.kolicina, 0);
  }

  posaljiNarudzbu() {
    const stavke = this.korpa.map((k) => ({
      idProizvoda: k.id,
      naziv: k.naziv,
      cena: k.cena,
      kolicina: k.kolicina,
    }));

    this.http.post(`${this.apiUrl}/korpa`, stavke).subscribe({
      next: () => {
        this.poslato = true;
        this.korpa = [];
        this.cdr.detectChanges();
        this.snackBar.open('Narudžba poslata konobaru!', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Greška pri slanju narudžbe', 'OK', { duration: 3000 });
      },
    });
  }
}
