import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="ff-header">
      <a
        class="ff-logo"
        [routerLink]="role === 'konobar' ? '/konobar/dashboard' : '/korisnik/dashboard'"
      >
        <div class="ff-logo-icon">🍔</div>
        <span class="ff-logo-text">FastFood</span>
      </a>

      <nav class="ff-nav" *ngIf="role === 'korisnik'">
        <a routerLink="/korisnik/dashboard" routerLinkActive="active">🏠 Početna</a>
        <a routerLink="/korisnik/meni" routerLinkActive="active">🍕 Meni</a>
        <a routerLink="/korisnik/racuni" routerLinkActive="active">🧾 Računi</a>
        <a routerLink="/korisnik/profil" routerLinkActive="active">👤 Profil</a>
      </nav>

      <nav class="ff-nav" *ngIf="role === 'konobar'">
        <a routerLink="/konobar/dashboard" routerLinkActive="active">🏠 Početna</a>
        <a routerLink="/konobar/proizvodi" routerLinkActive="active">🍕 Proizvodi</a>
        <a routerLink="/konobar/kreiraj-racun" routerLinkActive="active">🧾 Kreiraj račun</a>
        <a routerLink="/konobar/svi-racuni" routerLinkActive="active">📋 Svi računi</a>
      </nav>

      <div class="ff-header-right">
        <div class="ff-user-chip">
          <div class="ff-avatar">{{ initijali }}</div>
          <span class="ff-user-name">{{ ime }}</span>
        </div>
        <button class="ff-btn-logout" (click)="odjava()">⬅ Odjava</button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() role: 'korisnik' | 'konobar' = 'korisnik';
  @Input() ime: string = '';

  get initijali(): string {
    return this.ime?.substring(0, 2).toUpperCase() || '??';
  }

  constructor(private auth: AuthService) {}

  odjava() {
    this.auth.odjava();
  }
}
