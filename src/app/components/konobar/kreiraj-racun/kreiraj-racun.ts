import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ProizvodService } from '../../../services/proizvod';
import { KonobarService } from '../../../services/konobar';
import { RacunService } from '../../../services/racun';
import { Proizvod, Korisnik } from '../../../models';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-kreiraj-racun',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <div class="ff-page">
      <app-header role="konobar" [ime]="'Konobar'"></app-header>

      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/konobar/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Kreiraj račun</span>
        </div>

        <div class="ff-form-card">
          <mat-form-field appearance="outline" style="width:100%">
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

          <div class="ff-success-banner" *ngIf="odabraniKorisnikId && !ucitavanjeKorpe && imaKorpu">
            ✅ Korisnik ima aktivnu narudžbu od {{ datumKorpe }}
          </div>
          <div
            style="background:#f5f5f5;border-radius:8px;padding:10px 14px;font-size:13px;color:#888;margin:8px 0"
            *ngIf="odabraniKorisnikId && !ucitavanjeKorpe && !imaKorpu"
          >
            ℹ️ Korisnik nema aktivnu narudžbu — dodaj proizvode ručno
          </div>

          <div style="font-size:14px;font-weight:500;color:var(--ff-text);margin:16px 0 8px">
            Proizvodi
          </div>

          <div class="ff-proizvod-row" *ngFor="let p of proizvodi">
            <div>
              <div style="font-size:14px;font-weight:500;color:var(--ff-text)">{{ p.naziv }}</div>
              <div style="font-size:12px;color:#888">
                {{ p.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}
              </div>
            </div>
            <div class="ff-qty">
              <button class="ff-qty-btn" (click)="smanjiKolicinu(p.id)">−</button>
              <span class="ff-qty-num">{{ getKolicina(p.id) }}</span>
              <button class="ff-qty-btn" (click)="povecajKolicinu(p.id)">+</button>
            </div>
          </div>

          <div class="ff-korpa" *ngIf="stavke.length > 0">
            <div class="ff-korpa-title">🧾 Odabrani proizvodi</div>
            <div class="ff-korpa-row" *ngFor="let s of stavke">
              <span>{{ getNaziv(s.idProizvoda) }} × {{ s.kolicina }}</span>
              <span>{{
                getCena(s.idProizvoda) * s.kolicina | currency: 'RSD' : 'symbol' : '1.0-0'
              }}</span>
            </div>
            <div class="ff-korpa-total">
              <span>Ukupno</span>
              <span>{{ ukupno() | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
            </div>
            <button
              class="ff-btn-primary"
              [disabled]="!odabraniKorisnikId || stavke.length === 0"
              (click)="kreirajRacun()"
            >
              Izdaj račun
            </button>
          </div>

          <div class="ff-success-banner" *ngIf="kreiranRacun" style="margin-top:14px">
            ✅ Račun kreiran! {{ kreiranRacun.datum }} u {{ kreiranRacun.vreme }} —
            <strong>{{ kreiranRacun.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}</strong>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [],
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

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api';

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
