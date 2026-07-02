import { Component, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-login',
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
        <p class="podnaslov">Prijavite se na vaš nalog</p>

        <div class="uloga-toggle">
          <button [class.aktivan]="uloga === 'korisnik'" (click)="uloga = 'korisnik'; greska = ''">
            👤 Korisnik
          </button>
          <button [class.aktivan]="uloga === 'konobar'" (click)="uloga = 'konobar'; greska = ''">
            👨‍🍳 Konobar
          </button>
        </div>

        <div class="forma">
          <mat-form-field appearance="outline" class="full" *ngIf="uloga === 'korisnik'">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              [(ngModel)]="email"
              type="email"
              placeholder="vas@email.com"
              (ngModelChange)="greska = ''"
              (keydown.enter)="prijava()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full" *ngIf="uloga === 'konobar'">
            <mat-label>Ime</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input
              matInput
              [(ngModel)]="ime"
              placeholder="Vaše ime"
              (ngModelChange)="greska = ''"
              (keydown.enter)="prijava()"
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
              (keydown.enter)="prijava()"
            />
            <button mat-icon-button matSuffix (click)="pokaziLozinku = !pokaziLozinku">
              <mat-icon>{{ pokaziLozinku ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="greska-box" *ngIf="greska">⚠️ {{ greska }}</div>

        <button
          mat-raised-button
          class="btn-prijava"
          [disabled]="ucitavanje || !jeFormPopunjena()"
          (click)="prijava()"
        >
          {{ ucitavanje ? 'Prijavljivanje...' : 'Prijava' }}
        </button>

        <div class="link" *ngIf="uloga === 'korisnik'">
          Nemaš nalog? <a routerLink="/register">Registruj se</a>
        </div>
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
      .uloga-toggle {
        display: flex;
        background: #f0f0f0;
        border-radius: 10px;
        padding: 4px;
        margin-bottom: 28px;
        width: 100%;
      }
      .uloga-toggle button {
        flex: 1;
        padding: 10px;
        border: none;
        background: transparent;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        transition: all 0.2s;
      }
      .uloga-toggle button.aktivan {
        background: white;
        color: #ff6b35;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-weight: 700;
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
      .btn-prijava {
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
      .btn-prijava:disabled {
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
export class LoginComponent {
  uloga = 'korisnik';
  email = '';
  ime = '';
  lozinka = '';
  greska = '';
  ucitavanje = false;
  pokaziLozinku = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  jeFormPopunjena(): boolean {
    if (this.uloga === 'korisnik') {
      return !!this.email && !!this.lozinka;
    }
    return !!this.ime && !!this.lozinka;
  }

  prijava() {
    if (!this.jeFormPopunjena()) return;

    this.greska = '';
    this.ucitavanje = true;

    if (this.uloga === 'korisnik') {
      this.auth.prijavaKorisnik(this.email, this.lozinka).subscribe({
        next: () => {
          this.ucitavanje = false;
          this.router.navigate(['/korisnik/dashboard']);
        },
        error: () => {
          this.ucitavanje = false;
          this.greska = 'Pogrešan email ili lozinka!';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.auth.prijavaKonobar(this.ime, this.lozinka).subscribe({
        next: () => {
          this.ucitavanje = false;
          this.router.navigate(['/konobar/dashboard']);
        },
        error: () => {
          this.ucitavanje = false;
          this.greska = 'Pogrešno ime ili lozinka!';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
