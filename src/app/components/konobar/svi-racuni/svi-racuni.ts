import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-svi-racuni',
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
        <a routerLink="/konobar/dashboard">⬅ Nazad</a>
        <h2>📋 Svi Računi</h2>
      </div>

      <p *ngIf="ucitavanje">Učitavanje računa...</p>
      <p *ngIf="!ucitavanje && racuni.length === 0" class="prazno">Nema računa.</p>

      <mat-accordion>
        <mat-expansion-panel *ngFor="let r of racuni">
          <mat-expansion-panel-header>
            <mat-panel-title> Račun {{ r.id | slice: 0 : 8 }}... </mat-panel-title>
            <mat-panel-description>
              {{ r.datum }} — {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}
            </mat-panel-description>
          </mat-expansion-panel-header>

          <div class="detalji">
            <p><strong>Datum:</strong> {{ r.datum }}</p>
            <p><strong>Vreme:</strong> {{ r.vreme }}</p>
            <p><strong>Korisnik ID:</strong> {{ r.korisnikId }}</p>
            <p><strong>Konobar ID:</strong> {{ r.konobarId }}</p>
            <p>
              <strong>Ukupno:</strong> {{ r.ukupnaCena | currency: 'RSD' : 'symbol' : '1.0-0' }}
            </p>
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
      .detalji {
        padding: 10px 0;
      }
      .detalji p {
        margin: 6px 0;
      }
    `,
  ],
})
export class SviRacuniComponent implements OnInit {
  racuni: any[] = [];
  ucitavanje = true;

  private apiUrl = 'https://localhost:7147/api';

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
