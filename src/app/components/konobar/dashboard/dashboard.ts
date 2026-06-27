import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-konobar-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>👨‍🍳 Dobrodošao, {{ ime }}!</h1>
        <button mat-raised-button color="warn" (click)="odjava()">Odjava</button>
      </div>

      <div class="grid">
        <mat-card class="menu-card" routerLink="/konobar/proizvodi">
          <mat-card-content>
            <div class="ikona">🍕</div>
            <h2>Proizvodi</h2>
            <p>Dodaj, menjaj, briši proizvode</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="menu-card" routerLink="/konobar/kreiraj-racun">
          <mat-card-content>
            <div class="ikona">🧾</div>
            <h2>Kreiraj Račun</h2>
            <p>Izdaj račun korisniku</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="menu-card" routerLink="/konobar/svi-racuni">
          <mat-card-content>
            <div class="ikona">📋</div>
            <h2>Svi Računi</h2>
            <p>Pregled svih izdatih računa</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 30px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
      }
      .menu-card {
        cursor: pointer;
        text-align: center;
        transition: transform 0.2s;
      }
      .menu-card:hover {
        transform: translateY(-5px);
      }
      .ikona {
        font-size: 48px;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class DashboardComponent {
  ime = '';

  constructor(private auth: AuthService) {
    this.ime = this.auth.getIme() || 'Konobar';
  }

  odjava() {
    this.auth.odjava();
  }
}
