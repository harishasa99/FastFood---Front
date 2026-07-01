import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <div class="ff-page">
      <app-header role="korisnik" [ime]="ime"></app-header>
      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/korisnik/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Moj profil</span>
        </div>

        <div class="ff-profil-card">
          <div class="ff-profil-top">
            <div class="ff-avatar-lg">{{ (ime[0] || '') + (prezime[0] || '') | uppercase }}</div>
            <div>
              <div style="font-size:16px;font-weight:500;color:var(--ff-text)">
                {{ ime }} {{ prezime }}
              </div>
              <div style="font-size:13px;color:#888">{{ email }}</div>
            </div>
          </div>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Ime</mat-label>
            <input matInput [(ngModel)]="ime" />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Prezime</mat-label>
            <input matInput [(ngModel)]="prezime" />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" />
          </mat-form-field>

          <div style="font-size:14px;font-weight:500;color:var(--ff-text);margin:8px 0 4px">
            Promjena lozinke (opciono)
          </div>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Stara lozinka</mat-label>
            <input matInput [(ngModel)]="staraLozinka" type="password" />
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Nova lozinka</mat-label>
            <input matInput [(ngModel)]="novaLozinka" type="password" />
          </mat-form-field>

          <button class="ff-btn-primary" (click)="sacuvaj()">Sačuvaj izmjene</button>
        </div>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [],
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
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.ime = this.auth.getIme() || 'Korisnik';
  }

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/profil`).subscribe({
      next: (data) => {
        this.ime = data.ime;
        this.prezime = data.prezime;
        this.email = data.email;
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Greška pri učitavanju profila', 'OK', { duration: 3000 }),
    });
  }

  sacuvaj() {
    const dto: any = { ime: this.ime, prezime: this.prezime, email: this.email };
    if (this.novaLozinka) {
      dto.staraLozinka = this.staraLozinka;
      dto.novaLozinka = this.novaLozinka;
    }
    this.http.put(`${this.apiUrl}/profil`, dto).subscribe({
      next: () => {
        localStorage.setItem('ime', this.ime);
        this.snackBar.open('Profil ažuriran!', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Greška pri ažuriranju profila', 'OK', { duration: 3000 }),
    });
  }
}
