import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConsentModalComponent } from './consent-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ConsentModalComponent],
  template: `
    <div class="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div class="absolute w-[600px] h-[600px] rounded-full border border-indigo-500/10 hero-ring hero-ring-2 hidden md:block"></div>
      
      <div class="relative z-10 w-full max-w-md bg-[#1A1F2E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <img src="logo.png" alt="Nexo Finance" class="w-16 h-16 mx-auto mb-4 object-contain">
          <h2 class="text-2xl font-bold text-white">Crear Cuenta</h2>
          <p class="text-gray-400 mt-2 text-sm">Únete a la revolución financiera</p>
        </div>

        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
            <input type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="Tu nombre">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input type="email" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="tucorreo@ejemplo.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input type="password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" placeholder="••••••••">
          </div>
          
          <div class="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mt-2 mb-2">
            <h4 class="text-indigo-300 text-xs font-bold mb-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Consentimiento de Datos e IA
            </h4>
            <div class="flex items-start gap-3 mt-3">
              <input type="checkbox" id="privacy-consent" class="mt-1 w-4 h-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 appearance-none checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer transition-all">
              <label for="privacy-consent" class="text-[11px] text-gray-400 leading-relaxed cursor-pointer select-none block">
                He leído y acepto la <a routerLink="/privacy" class="text-indigo-400 hover:text-indigo-300 underline" target="_blank">Política de Privacidad</a>.<br><br>
                Consiento que mis datos financieros anonimizados puedan ser compartidos con proveedores de IA de terceros (ej. Gemini) de forma segura. Entiendo que los datos de usuario son usados <strong class="text-gray-300">única y exclusivamente para el análisis y predicciones</strong> dentro de esta herramienta, <strong>sin intenciones de aconsejar decisiones financieras</strong>.
              </label>
            </div>
          </div>
          
          <button type="button" (click)="onRegister()" class="mt-4 w-full bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">
            Registrarse
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            ¿Ya tienes cuenta? <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300 font-medium">Inicia Sesión</a>
          </p>
        </div>
      </div>
      
      <app-consent-modal *ngIf="showConsentModal" (consentResponse)="handleConsent($event)"></app-consent-modal>
    </div>
  `
})
export class RegisterComponent {
  showConsentModal = false;

  onRegister() {
    const consent = localStorage.getItem('nexo_consent_given');
    if (consent === 'true') {
      this.executeRegister();
    } else {
      this.showConsentModal = true;
    }
  }

  handleConsent(accepted: boolean) {
    this.showConsentModal = false;
    if (accepted) {
      localStorage.setItem('nexo_consent_given', 'true');
      const checkbox = document.getElementById('privacy-consent') as HTMLInputElement;
      if (checkbox) checkbox.checked = true;
      this.executeRegister();
    } else {
      alert('Debes aceptar las políticas de privacidad y uso de IA para crear tu cuenta.');
    }
  }

  executeRegister() {
    const checkbox = document.getElementById('privacy-consent') as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      alert('Debes marcar la casilla de consentimiento en el formulario de registro.');
      return;
    }
    // Lógica real de registro
    console.log('Registro completado, consentimiento verificado.');
  }
}
