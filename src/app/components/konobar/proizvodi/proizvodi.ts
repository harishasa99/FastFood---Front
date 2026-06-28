import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProizvodService } from '../../../services/proizvod';
import { Proizvod } from '../../../models';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-proizvodi',
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
      <app-header role="konobar" [ime]="'Konobar'"></app-header>

      <main class="ff-main-content">
        <div class="ff-page-title">
          <a class="ff-back-btn" routerLink="/konobar/dashboard">⬅ Nazad</a>
          <span class="ff-page-h">Upravljanje proizvodima</span>
        </div>

        <div class="ff-form-card">
          <div class="ff-form-title">
            {{ editMode ? 'Izmijeni proizvod' : 'Dodaj novi proizvod' }}
          </div>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Naziv</mat-label>
            <input matInput [(ngModel)]="naziv" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Opis</mat-label>
            <input matInput [(ngModel)]="opis" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Cijena (RSD)</mat-label>
            <input matInput [(ngModel)]="cena" type="number" />
          </mat-form-field>

          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="ff-btn-primary" style="flex:1" (click)="sacuvaj()">
              {{ editMode ? 'Sačuvaj izmjene' : 'Dodaj proizvod' }}
            </button>
            <button
              *ngIf="editMode"
              style="flex:1;padding:10px;background:none;border:1px solid #ddd;border-radius:6px;cursor:pointer;font-size:14px;color:#888"
              (click)="otkaziEdit()"
            >
              Otkaži
            </button>
          </div>
        </div>

        <p *ngIf="proizvodi.length === 0" class="ff-empty">Nema proizvoda.</p>

        <div class="ff-prod-grid">
          <div class="ff-prod-card" *ngFor="let p of proizvodi">
            <div class="ff-prod-name">{{ p.naziv }}</div>
            <div class="ff-prod-price">{{ p.cena | currency: 'RSD' : 'symbol' : '1.0-0' }}</div>
            <div class="ff-prod-desc">{{ p.opis }}</div>
            <div class="ff-prod-actions">
              <button class="ff-btn-edit" (click)="uredi(p)">✏️ Uredi</button>
              <button class="ff-btn-del" (click)="obrisi(p.id)">🗑️ Obriši</button>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [],
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
