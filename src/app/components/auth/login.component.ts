import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConsentModalComponent } from './consent-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ConsentModalComponent],
  template: `
    <div class="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div class="absolute w-[500px] h-[500px] rounded-full border border-indigo-500/10 hero-ring hero-ring-1 hidden md:block"></div>
      
      <div class="relative z-10 w-full max-w-md bg-[#1A1F2E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <img src="logo.png" alt="Nexo Finance" class="w-16 h-16 mx-auto mb-4 object-contain">
          <h2 class="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p class="text-gray-400 mt-2 text-sm">Bienvenido de nuevo a Nexo Finance</p>
        </div>

        <form class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input type="email" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="tucorreo@ejemplo.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input type="password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="••••••••">
          </div>
          
          <button type="button" (click)="onLogin()" class="w-full bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">
            Ingresar
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            ¿No tienes cuenta? <a routerLink="/register" class="text-indigo-400 hover:text-indigo-300 font-medium">Regístrate</a>
          </p>
        </div>

        <div class="mt-8 pt-6 border-t border-white/10">
          <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <h4 class="text-indigo-300 text-xs font-bold mb-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Privacidad y Uso de IA
            </h4>
            <p class="text-[11px] text-gray-400 leading-relaxed space-y-2">
              Al iniciar sesión, aceptas nuestra <a routerLink="/privacy" class="text-indigo-400 hover:text-indigo-300 underline">Política de Privacidad</a>.<br><br>
              <strong>Aviso Importante:</strong> Tus datos se comparten de forma segura, y son procesados por nosotros y proveedores de IA (ej. Gemini) de forma segura. Utilizamos tus datos única y exclusivamente para brindar análisis y predicciones de gastos. <strong>Esta aplicación no proporciona consejos ni recomendaciones de decisiones financieras.</strong>
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
    // Aquí iría la lógica de autenticación real
    console.log('Login completado, consentimiento verificado.');
  }
}
