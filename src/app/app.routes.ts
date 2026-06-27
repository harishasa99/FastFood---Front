import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent as KorisnikDashboard } from './components/korisnik/dashboard/dashboard';
import { MeniComponent } from './components/korisnik/meni/meni';
import { RacuniComponent } from './components/korisnik/racuni/racuni';
import { ProfilComponent } from './components/korisnik/profil/profil';
import { DashboardComponent as KonobarDashboard } from './components/konobar/dashboard/dashboard';
import { ProizvodiComponent } from './components/konobar/proizvodi/proizvodi';
import { KreirajRacunComponent } from './components/konobar/kreiraj-racun/kreiraj-racun';
import { SviRacuniComponent } from './components/konobar/svi-racuni/svi-racuni';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'korisnik',
    canActivate: [authGuard],
    data: { role: 'korisnik' },
    children: [
      { path: 'dashboard', component: KorisnikDashboard },
      { path: 'meni', component: MeniComponent },
      { path: 'racuni', component: RacuniComponent },
      { path: 'profil', component: ProfilComponent },
    ],
  },
  {
    path: 'konobar',
    canActivate: [authGuard],
    data: { role: 'konobar' },
    children: [
      { path: 'dashboard', component: KonobarDashboard },
      { path: 'proizvodi', component: ProizvodiComponent },
      { path: 'kreiraj-racun', component: KreirajRacunComponent },
      { path: 'svi-racuni', component: SviRacuniComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
