import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-korisnik-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <div class="ff-page">
      <app-header role="korisnik" [ime]="ime"></app-header>

      <main class="ff-main-content">
        <div class="ff-welcome">
          <span style="font-size:22px">👋</span>
          <div>
            <div class="ff-welcome-title">Dobrodošao, {{ ime }}!</div>
            <div class="ff-welcome-sub">Šta danas naručuješ?</div>
          </div>
        </div>

        <div class="ff-dash-grid">
          <div class="ff-dash-card" routerLink="/korisnik/meni">
            <div class="ff-dash-icon">🍕</div>
            <div class="ff-dash-title">Meni</div>
            <div class="ff-dash-sub">Pogledaj naše proizvode</div>
          </div>
          <div class="ff-dash-card" routerLink="/korisnik/racuni">
            <div class="ff-dash-icon">🧾</div>
            <div class="ff-dash-title">Moji računi</div>
            <div class="ff-dash-sub">Pregled tvojih računa</div>
          </div>
          <div class="ff-dash-card" routerLink="/korisnik/profil">
            <div class="ff-dash-icon">👤</div>
            <div class="ff-dash-title">Profil</div>
            <div class="ff-dash-sub">Upravljaj profilom</div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  ime = '';

  constructor(private auth: AuthService) {
    this.ime = this.auth.getIme() || 'Korisnik';
  }
}
