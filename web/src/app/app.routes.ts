import { Routes } from '@angular/router';
import { title } from '../environments/environment';

export const routes: Routes = [
  { path: '', redirectTo: 'login/login-form', pathMatch: 'full' },
  {
    path: 'shell',
    title: title,
    canActivateChild: [],
    loadChildren: () => import('./shell/shell-routing'),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login-routing'),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home-routing'),
  },
  { path: '**', redirectTo: 'login/login-form' },
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
];
