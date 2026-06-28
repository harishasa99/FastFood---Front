import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-konobar-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <div class="ff-page">
      <app-header role="konobar" [ime]="ime"></app-header>

      <main class="ff-main-content">
        <div class="ff-welcome">
          <span style="font-size:22px">👨‍🍳</span>
          <div>
            <div class="ff-welcome-title">Dobrodošao, {{ ime }}!</div>
            <div class="ff-welcome-sub">Šta danas radimo?</div>
          </div>
        </div>

        <div class="ff-dash-grid">
          <div class="ff-dash-card" routerLink="/konobar/proizvodi">
            <div class="ff-dash-icon">🍕</div>
            <div class="ff-dash-title">Proizvodi</div>
            <div class="ff-dash-sub">Dodaj, menjaj, briši proizvode</div>
          </div>
          <div class="ff-dash-card" routerLink="/konobar/kreiraj-racun">
            <div class="ff-dash-icon">🧾</div>
            <div class="ff-dash-title">Kreiraj račun</div>
            <div class="ff-dash-sub">Izdaj račun korisniku</div>
          </div>
          <div class="ff-dash-card" routerLink="/konobar/svi-racuni">
            <div class="ff-dash-icon">📋</div>
            <div class="ff-dash-title">Svi računi</div>
            <div class="ff-dash-sub">Pregled svih izdatih računa</div>
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
    this.ime = this.auth.getIme() || 'Konobar';
  }
}
