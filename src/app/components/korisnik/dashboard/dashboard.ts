import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-korisnik-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>🍔 Dobrodošao, {{ ime }}!</h1>
        <button mat-raised-button color="warn" (click)="odjava()">Odjava</button>
      </div>

      <div class="grid">
        <mat-card class="menu-card" routerLink="/korisnik/meni">
          <mat-card-content>
            <div class="ikona">🍕</div>
            <h2>Meni</h2>
            <p>Pogledaj naše proizvode</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="menu-card" routerLink="/korisnik/racuni">
          <mat-card-content>
            <div class="ikona">🧾</div>
            <h2>Moji Računi</h2>
            <p>Pregled tvojih računa</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="menu-card" routerLink="/korisnik/profil">
          <mat-card-content>
            <div class="ikona">👤</div>
            <h2>Profil</h2>
            <p>Upravljaj svojim profilom</p>
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
    this.ime = this.auth.getIme() || 'Korisnik';
  }

  odjava() {
    this.auth.odjava();
  }
}
