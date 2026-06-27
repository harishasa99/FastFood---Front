import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container">
      <mat-card class="card">
        <div class="logo">🍔</div>
        <h1 class="naslov">FastFood</h1>
        <p class="podnaslov">Kreirajte novi nalog</p>

        <div class="forma">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Ime</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input
              matInput
              [(ngModel)]="ime"
              placeholder="Vaše ime"
              (ngModelChange)="greska = ''"
              (keydown.enter)="registracija()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Prezime</mat-label>
            <mat-icon matPrefix>person_outline</mat-icon>
            <input
              matInput
              [(ngModel)]="prezime"
              placeholder="Vaše prezime"
              (ngModelChange)="greska = ''"
              (keydown.enter)="registracija()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              [(ngModel)]="email"
              type="email"
              placeholder="vas@email.com"
              (ngModelChange)="greska = ''"
              (keydown.enter)="registracija()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Lozinka</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              [(ngModel)]="lozinka"
              [type]="pokaziLozinku ? 'text' : 'password'"
              placeholder="••••••••"
              (ngModelChange)="greska = ''"
              (keydown.enter)="registracija()"
            />
            <button mat-icon-button matSuffix (click)="pokaziLozinku = !pokaziLozinku">
              <mat-icon>{{ pokaziLozinku ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="greska-box" *ngIf="greska">⚠️ {{ greska }}</div>

        <div class="uspjeh-box" *ngIf="uspjeh">✅ {{ uspjeh }}</div>

        <button
          mat-raised-button
          class="btn-register"
          [disabled]="ucitavanje || !jeFormPopunjena()"
          (click)="registracija()"
        >
          {{ ucitavanje ? 'Registrovanje...' : 'Registruj se' }}
        </button>

        <div class="link">Već imaš nalog? <a routerLink="/login">Prijavi se</a></div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      }
      .card {
        width: 420px;
        padding: 40px;
        border-radius: 16px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .logo {
        font-size: 64px;
        margin-bottom: 8px;
        line-height: 1;
      }
      .naslov {
        font-size: 30px;
        font-weight: 700;
        color: #333;
        margin: 0 0 4px 0;
      }
      .podnaslov {
        color: #999;
        margin: 0 0 28px 0;
        font-size: 14px;
      }
      .forma {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }
      .full {
        width: 100%;
      }
      .greska-box {
        background: #ffebee;
        color: #c62828;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #c62828;
        width: 100%;
        box-sizing: border-box;
      }
      .uspjeh-box {
        background: #e8f5e9;
        color: #2e7d32;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
        border-left: 4px solid #2e7d32;
        width: 100%;
        box-sizing: border-box;
      }
      .btn-register {
        width: 100%;
        padding: 14px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        border-radius: 10px !important;
        background: linear-gradient(135deg, #ff6b35, #f7931e) !important;
        color: white !important;
        margin-bottom: 24px;
        letter-spacing: 0.5px;
      }
      .btn-register:disabled {
        opacity: 0.6;
      }
      .link {
        font-size: 14px;
        color: #666;
      }
      .link a {
        color: #ff6b35;
        font-weight: 600;
        text-decoration: none;
      }
      .link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  ime = '';
  prezime = '';
  email = '';
  lozinka = '';
  greska = '';
  uspjeh = '';
  ucitavanje = false;
  pokaziLozinku = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  jeFormPopunjena(): boolean {
    return !!this.ime && !!this.prezime && !!this.email && !!this.lozinka;
  }

  registracija() {
    if (!this.jeFormPopunjena()) {
      this.greska = 'Sva polja su obavezna!';
      return;
    }

    this.greska = '';
    this.uspjeh = '';
    this.ucitavanje = true;

    this.auth
      .registracija({
        ime: this.ime,
        prezime: this.prezime,
        email: this.email,
        lozinka: this.lozinka,
      })
      .subscribe({
        next: () => {
          this.ucitavanje = false;
          this.uspjeh = 'Registracija uspešna! Preusmjeravanje...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.ucitavanje = false;
          this.greska = 'Greška pri registraciji. Email možda već postoji.';
        },
      });
  }
}
