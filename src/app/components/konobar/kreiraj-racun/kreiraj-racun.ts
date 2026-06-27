import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ProizvodService } from '../../../services/proizvod';
import { KonobarService } from '../../../services/konobar';
import { RacunService } from '../../../services/racun';
import { Proizvod, Korisnik } from '../../../models';

@Component({
  selector: 'app-kreiraj-racun',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <a routerLink="/konobar/dashboard">⬅ Nazad</a>
        <h2>🧾 Kreiraj Račun</h2>
      </div>

      <mat-card class="forma">
        <mat-card-content>
          <!-- Odabir korisnika -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>Odaberi korisnika</mat-label>
            <mat-select
              [(ngModel)]="odabraniKorisnikId"
              (ngModelChange)="ucitajKorpuKorisnika($event)"
            >
              <mat-option *ngFor="let k of korisnici" [value]="k.id">
                {{ k.ime }} {{ k.prezime }} ({{ k.email }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Poruka o korpi -->
          <div class="korpa-info" *ngIf="odabraniKorisnikId && !ucitavanjeKorpe">
            <p *ngIf="imaKorpu" class="ima-korpu">
              ✅ Korisnik ima aktivnu narudžbu od {{ datumKorpe }}
            </p>
            <p *ngIf="!imaKorpu" class="nema-korpu">
              ℹ️ Korisnik nema aktivnu narudžbu — dodaj proizvode ručno
            </p>
          </div>

          <!-- Proizvodi -->
          <h3>Proizvodi:</h3>
          <div class="proizvod-red" *ngFor="let p of proizvodi">
            <span class="naziv"
              >{{ p.naziv }} — {{ p.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}</span
            >
            <div class="kontrole">
              <button mat-icon-button (click)="smanjiKolicinu(p.id)">−</button>
              <span class="kolicina">{{ getKolicina(p.id) }}</span>
              <button mat-icon-button (click)="povecajKolicinu(p.id)">+</button>
            </div>
          </div>

          <!-- Pregled odabranih -->
          <div class="korpa" *ngIf="stavke.length > 0">
            <h3>Odabrani proizvodi:</h3>
            <div class="stavka" *ngFor="let s of stavke">
              <span>{{ getNaziv(s.idProizvoda) }} × {{ s.kolicina }}</span>
              <span>{{
                getCena(s.idProizvoda) * s.kolicina | currency: 'RSD' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="ukupno">
              <strong>Ukupno: {{ ukupno() | currency: 'RSD' : 'symbol' : '1.0-0' }}</strong>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            [disabled]="!odabraniKorisnikId || stavke.length === 0"
            (click)="kreirajRacun()"
          >
            Izdaj Račun
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Kreiran racun -->
      <mat-card class="rezultat" *ngIf="kreiranRacun">
        <mat-card-header>
          <mat-card-title>✅ Račun uspešno kreiran!</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Datum: {{ kreiranRacun.datum }}</p>
          <p>Vreme: {{ kreiranRacun.vreme }}</p>
          <p>
            <strong
              >Ukupno: {{ kreiranRacun.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}</strong
            >
          </p>
        </mat-card-content>
      </mat-card>
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
      .forma {
        padding: 20px;
      }
      .full {
        width: 100%;
        margin-top: 12px;
      }
      .korpa-info {
        margin: 10px 0;
      }
      .ima-korpu {
        color: green;
        font-weight: bold;
      }
      .nema-korpu {
        color: #888;
      }
      .proizvod-red {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .naziv {
        font-size: 15px;
      }
      .kontrole {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .kolicina {
        min-width: 24px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
      .korpa {
        margin-top: 20px;
        padding: 16px;
        background: #f1f8e9;
        border-radius: 8px;
      }
      .stavka {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #ddd;
      }
      .ukupno {
        text-align: right;
        margin-top: 10px;
        font-size: 18px;
      }
      .rezultat {
        margin-top: 20px;
        padding: 20px;
        background: #e8f5e9;
      }
    `,
  ],
})
export class KreirajRacunComponent implements OnInit {
  proizvodi: Proizvod[] = [];
  korisnici: Korisnik[] = [];
  odabraniKorisnikId = '';
  stavke: { idProizvoda: string; kolicina: number }[] = [];
  kreiranRacun: any = null;
  imaKorpu = false;
  datumKorpe = '';
  ucitavanjeKorpe = false;

  private apiUrl = 'https://localhost:7147/api';

  constructor(
    private proizvodService: ProizvodService,
    private konobarService: KonobarService,
    private racunService: RacunService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.proizvodService.getSvi().subscribe((data) => {
      this.proizvodi = data;
      this.cdr.detectChanges();
    });
    this.konobarService.getSviKorisnici().subscribe((data) => {
      this.korisnici = data;
      this.cdr.detectChanges();
    });
  }

  ucitajKorpuKorisnika(korisnikId: string) {
    if (!korisnikId) return;
    this.ucitavanjeKorpe = true;
    this.stavke = [];
    this.imaKorpu = false;

    this.http.get<any>(`${this.apiUrl}/korpa/korisnik/${korisnikId}`).subscribe({
      next: (res) => {
        this.ucitavanjeKorpe = false;
        if (res.imaKorpu && res.stavke.length > 0) {
          this.imaKorpu = true;
          this.datumKorpe = res.datum;
          // Automatski popuni stavke iz korpe korisnika
          this.stavke = res.stavke.map((s: any) => ({
            idProizvoda: s.idProizvoda,
            kolicina: s.kolicina,
          }));
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.ucitavanjeKorpe = false;
        this.cdr.detectChanges();
      },
    });
  }

  getKolicina(idProizvoda: string): number {
    const s = this.stavke.find((s) => s.idProizvoda === idProizvoda);
    return s ? s.kolicina : 0;
  }

  povecajKolicinu(idProizvoda: string) {
    const s = this.stavke.find((s) => s.idProizvoda === idProizvoda);
    if (s) {
      s.kolicina++;
    } else {
      this.stavke.push({ idProizvoda, kolicina: 1 });
    }
    this.cdr.detectChanges();
  }

  smanjiKolicinu(idProizvoda: string) {
    const index = this.stavke.findIndex((s) => s.idProizvoda === idProizvoda);
    if (index !== -1) {
      if (this.stavke[index].kolicina > 1) {
        this.stavke[index].kolicina--;
      } else {
        this.stavke.splice(index, 1);
      }
    }
    this.cdr.detectChanges();
  }

  getNaziv(idProizvoda: string): string {
    return this.proizvodi.find((p) => p.id === idProizvoda)?.naziv || '';
  }

  getCena(idProizvoda: string): number {
    return this.proizvodi.find((p) => p.id === idProizvoda)?.cena || 0;
  }

  ukupno(): number {
    return this.stavke.reduce((sum, s) => sum + this.getCena(s.idProizvoda) * s.kolicina, 0);
  }

  kreirajRacun() {
    const dto = {
      korisnikId: this.odabraniKorisnikId,
      stavke: this.stavke,
    };

    this.racunService.kreirajRacun(dto).subscribe({
      next: (res) => {
        this.kreiranRacun = res;
        // Obrisi korpu korisnika nakon izdavanja racuna
        this.http.delete(`${this.apiUrl}/korpa/korisnik/${this.odabraniKorisnikId}`).subscribe();
        this.stavke = [];
        this.odabraniKorisnikId = '';
        this.imaKorpu = false;
        this.cdr.detectChanges();
        this.snackBar.open('Račun uspješno kreiran!', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Greška pri kreiranju računa', 'OK', { duration: 3000 }),
    });
  }
}
