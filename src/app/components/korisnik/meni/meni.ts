import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ProizvodService } from '../../../services/proizvod';
import { Proizvod } from '../../../models';

@Component({
  selector: 'app-meni',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="container">
      <div class="header">
        <a routerLink="/korisnik/dashboard">⬅ Nazad</a>
        <h2>🍕 Naš Meni</h2>
      </div>

      <p *ngIf="ucitavanje">Učitavanje proizvoda...</p>

      <div class="grid">
        <mat-card *ngFor="let p of proizvodi" class="card">
          <mat-card-header>
            <mat-card-title>{{ p.naziv }}</mat-card-title>
            <mat-card-subtitle>
              {{ p.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ p.opis }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="dodajUKorpu(p)">
              Dodaj u korpu
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="korpa" *ngIf="korpa.length > 0">
        <h3>🛒 Korpa</h3>
        <div class="stavka" *ngFor="let k of korpa">
          <span>{{ k.naziv }} × {{ k.kolicina }}</span>
          <span>{{ k.cena * k.kolicina | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
          <button mat-button color="warn" (click)="ukloni(k.id)">✕</button>
        </div>
        <div class="ukupno">
          <strong>Ukupno: {{ ukupno() | currency: 'RSD' : 'symbol' : '1.0-0' }}</strong>
        </div>
        <div class="akcije">
          <button mat-raised-button color="accent" (click)="posaljiNarudzbu()">
            📨 Pošalji narudžbu konobaru
          </button>
          <button mat-button color="warn" (click)="ocistiKorpu()">🗑️ Očisti korpu</button>
        </div>
      </div>

      <div class="poslato" *ngIf="poslato">✅ Narudžba je poslata konobaru! Sačekajte račun.</div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }
      .card {
        height: 100%;
      }
      .korpa {
        margin-top: 30px;
        padding: 20px;
        background: #fff8e1;
        border-radius: 8px;
      }
      .stavka {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .ukupno {
        margin-top: 10px;
        font-size: 18px;
        text-align: right;
      }
      .akcije {
        margin-top: 16px;
        display: flex;
        gap: 10px;
      }
      .poslato {
        margin-top: 20px;
        padding: 16px;
        background: #e8f5e9;
        border-radius: 8px;
        font-size: 16px;
        color: green;
      }
    `,
  ],
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
