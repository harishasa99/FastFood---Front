import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProizvodService } from '../../../services/proizvod';
import { Proizvod } from '../../../models';

@Component({
  selector: 'app-proizvodi',
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
        <a routerLink="/konobar/dashboard">⬅ Nazad</a>
        <h2>🍕 Upravljanje Proizvodima</h2>
      </div>

      <mat-card class="forma">
        <mat-card-header>
          <mat-card-title>{{
            editMode ? 'Izmijeni proizvod' : 'Dodaj novi proizvod'
          }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Naziv</mat-label>
            <input matInput [(ngModel)]="naziv" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Opis</mat-label>
            <input matInput [(ngModel)]="opis" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Cijena (RSD)</mat-label>
            <input matInput [(ngModel)]="cena" type="number" />
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="sacuvaj()">
            {{ editMode ? 'Sačuvaj izmjene' : 'Dodaj proizvod' }}
          </button>
          <button mat-button *ngIf="editMode" (click)="otkaziEdit()">Otkaži</button>
        </mat-card-actions>
      </mat-card>

      <div class="grid">
        <mat-card *ngFor="let p of proizvodi" class="card">
          <mat-card-header>
            <mat-card-title>{{ p.naziv }}</mat-card-title>
            <mat-card-subtitle>{{
              p.cena | currency: 'RSD' : 'symbol' : '1.0-0'
            }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ p.opis }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="uredi(p)">✏️ Uredi</button>
            <button mat-button color="warn" (click)="obrisi(p.id)">🗑️ Obriši</button>
          </mat-card-actions>
        </mat-card>
      </div>
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
        margin-bottom: 30px;
        padding: 20px;
      }
      .full {
        width: 100%;
        margin-top: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }
    `,
  ],
})
export class ProizvodiComponent implements OnInit {
  proizvodi: Proizvod[] = [];
  naziv = '';
  opis = '';
  cena = 0;
  editMode = false;
  editId = '';

  constructor(
    private proizvodService: ProizvodService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.proizvodService.getSvi().subscribe({
      next: (data) => {
        this.proizvodi = data;
      },
      error: () => this.snackBar.open('Greška pri učitavanju', 'OK', { duration: 3000 }),
    });
  }

  sacuvaj() {
    if (!this.naziv || this.cena <= 0) {
      this.snackBar.open('Naziv i cijena su obavezni!', 'OK', { duration: 3000 });
      return;
    }

    const dto = { naziv: this.naziv, opis: this.opis, cena: this.cena };

    if (this.editMode) {
      this.proizvodService.azuriraj(this.editId, dto).subscribe({
        next: () => {
          this.snackBar.open('Proizvod ažuriran!', 'OK', { duration: 2000 });
          this.otkaziEdit();
          this.ucitaj();
        },
        error: () => this.snackBar.open('Greška pri ažuriranju', 'OK', { duration: 3000 }),
      });
    } else {
      this.proizvodService.kreiraj(dto).subscribe({
        next: () => {
          this.snackBar.open('Proizvod dodan!', 'OK', { duration: 2000 });
          setTimeout(() => {
            this.naziv = '';
            this.opis = '';
            this.cena = 0;
          });
          this.ucitaj();
        },
        error: () => this.snackBar.open('Greška pri dodavanju', 'OK', { duration: 3000 }),
      });
    }
  }

  uredi(p: Proizvod) {
    this.editMode = true;
    this.editId = p.id;
    this.naziv = p.naziv;
    this.opis = p.opis;
    this.cena = p.cena;
  }

  otkaziEdit() {
    setTimeout(() => {
      this.editMode = false;
      this.editId = '';
      this.naziv = '';
      this.opis = '';
      this.cena = 0;
    });
  }

  obrisi(id: string) {
    if (confirm('Da li ste sigurni da želite obrisati ovaj proizvod?')) {
      this.proizvodService.obrisi(id).subscribe({
        next: () => {
          this.snackBar.open('Proizvod obrisan!', 'OK', { duration: 2000 });
          this.ucitaj();
        },
        error: () => this.snackBar.open('Greška pri brisanju', 'OK', { duration: 3000 }),
      });
    }
  }
}
