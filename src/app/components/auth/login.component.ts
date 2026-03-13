import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConsentModalComponent } from './consent-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ConsentModalComponent, FormsModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden px-6 text-slate-100">
      <div class="absolute w-[500px] h-[500px] rounded-full border border-indigo-500/10 hero-ring hero-ring-1 hidden md:block"></div>
      
      <div class="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <img src="logo.png" alt="Nexo Finance" class="w-16 h-16 mx-auto mb-4 object-contain grayscale brightness-200">
          <h2 class="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p class="text-slate-400 mt-2 text-sm">Bienvenido de nuevo a Nexo Finance</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
            <input type="email" name="email" [(ngModel)]="email" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium" placeholder="tucorreo@ejemplo.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input type="password" name="password" [(ngModel)]="password" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium" placeholder="••••••••">
          </div>
          
          <button type="submit" [disabled]="loading || !loginForm.form.valid" class="w-full bg-indigo-600 disabled:opacity-50 text-white rounded-xl px-4 py-3 font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">
            <span *ngIf="!loading">Ingresar</span>
            <span *ngIf="loading">Procesando...</span>
          </button>
        </form>
...
        <div class="mt-8 pt-6 border-t border-slate-800">
          <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
...
            <p class="text-[11px] text-slate-400 leading-relaxed space-y-2">
              Al iniciar sesión, aceptas nuestra <a routerLink="/privacy" class="text-indigo-400 hover:text-indigo-300 underline font-medium">Política de Privacidad</a>.<br><br>
...
            </p>
          </div>
        </div>
      </div>
      
      <app-consent-modal *ngIf="showConsentModal" (consentResponse)="handleConsent($event)"></app-consent-modal>
    </div>
  `
})
export class LoginComponent {
  showConsentModal = false;
  email = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    const consent = localStorage.getItem('nexo_consent_given');
    if (consent === 'true') {
      this.executeLogin();
    } else {
      this.showConsentModal = true;
    }
  }

  handleConsent(accepted: boolean) {
    this.showConsentModal = false;
    if (accepted) {
      localStorage.setItem('nexo_consent_given', 'true');
      this.executeLogin();
    } else {
      alert('Debes aceptar las políticas de privacidad y uso de IA para continuar.');
    }
  }

  executeLogin() {
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.error) {
          alert('Error: ' + res.error);
        } else {
          console.log('Login exitoso:', res);
          if (res.user?.is_admin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']); // Redirigir al home o dashboard de usuario
          }
        }
      },
      error: (err) => {
        this.loading = false;
        alert('Error de conexión con el servidor.');
        console.error(err);
      }
    });
  }
}
