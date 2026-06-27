import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-racuni',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <a routerLink="/korisnik/dashboard">⬅ Nazad</a>
        <h2>🧾 Moji Računi</h2>
      </div>

      <p *ngIf="ucitavanje">Učitavanje računa...</p>
      <p *ngIf="!ucitavanje && racuni.length === 0" class="prazno">Nemate još računa.</p>

      <mat-accordion>
        <mat-expansion-panel *ngFor="let r of racuni">
          <mat-expansion-panel-header>
            <mat-panel-title> Račun od {{ r.datum }} u {{ r.vreme }} </mat-panel-title>
            <mat-panel-description>
              Ukupno: {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="stavke">
            <div class="stavka" *ngFor="let s of r.stavke">
              <span>{{ s.naziv }}</span>
              <span>{{ s.kolicina }} × {{ s.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
              <span>= {{ s.cena * s.kolicina | currency: 'RSD' : 'symbol' : '1.0-0' }}</span>
            </div>
          </div>

          <div class="ukupno">
            <strong>Ukupno: {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}</strong>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
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
      .prazno {
        color: #888;
        text-align: center;
        margin-top: 40px;
      }
      .stavke {
        padding: 10px 0;
      }
      .stavka {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #eee;
      }
      .ukupno {
        text-align: right;
        margin-top: 10px;
        font-size: 16px;
      }
    `,
  ],
})
export class RacuniComponent implements OnInit {
  racuni: any[] = [];
  ucitavanje = true;

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/racun/moji`).subscribe({
      next: (data) => {
        console.log('Racuni:', data);
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
