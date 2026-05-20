import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { PacientesComponent } from './pages/pacientes/pacientes';
import { CitasComponent } from './pages/citas/citas';
import { FisioterapeutasComponent } from './pages/fisioterapeutas/fisioterapeutas';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'pacientes',
    component: PacientesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'citas',
    component: CitasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'fisioterapeutas',
    component: FisioterapeutasComponent,
    canActivate: [authGuard]
  },
];
