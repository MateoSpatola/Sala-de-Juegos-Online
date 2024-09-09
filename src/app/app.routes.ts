import { Routes } from '@angular/router';
import { HomeComponent } from './pages/main/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent) },
    { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent) },
    { path: 'signup', loadComponent: () => import('./pages/auth/sign-up/sign-up.component').then((m) => m.SignUpComponent) },
    { path: 'quiensoy', loadComponent: () => import('./pages/main/quien-soy/quien-soy.component').then((m) => m.QuienSoyComponent) },
    { path: '**', loadComponent: () => import('./pages/main/error/error.component').then((m) => m.ErrorComponent) }
];
