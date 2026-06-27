import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <a routerLink="/korisnik/dashboard">⬅ Nazad</a>
        <h2>👤 Moj Profil</h2>
      </div>

      <mat-card class="card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Ime</mat-label>
            <input matInput [(ngModel)]="ime" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Prezime</mat-label>
            <input matInput [(ngModel)]="prezime" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" />
          </mat-form-field>

          <h3>Promjena lozinke (opciono)</h3>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Stara lozinka</mat-label>
            <input matInput [(ngModel)]="staraLozinka" type="password" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Nova lozinka</mat-label>
            <input matInput [(ngModel)]="novaLozinka" type="password" />
          </mat-form-field>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="sacuvaj()">Sačuvaj izmene</button>
        </mat-card-actions>
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
      .card {
        max-width: 500px;
        padding: 20px;
      }
      .full {
        width: 100%;
        margin-top: 12px;
      }
    `,
  ],
})
export class ProfilComponent implements OnInit {
  ime = '';
  prezime = '';
  email = '';
  staraLozinka = '';
  novaLozinka = '';

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api/korisnik';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/profil`).subscribe({
      next: (data) => {
        this.ime = data.ime;
        this.prezime = data.prezime;
        this.email = data.email;
      },
      error: () => this.snackBar.open('Greška pri učitavanju profila', 'OK', { duration: 3000 }),
    });
  }

  sacuvaj() {
    const dto: any = {
      ime: this.ime,
      prezime: this.prezime,
      email: this.email,
    };

    if (this.novaLozinka) {
      dto.staraLozinka = this.staraLozinka;
      dto.novaLozinka = this.novaLozinka;
    }

    this.http.put(`${this.apiUrl}/profil`, dto).subscribe({
      next: () => this.snackBar.open('Profil uspešno ažuriran!', 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Greška pri ažuriranju profila', 'OK', { duration: 3000 }),
    });
  }
}
