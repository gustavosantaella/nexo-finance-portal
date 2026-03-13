import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-consent-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-[#1A1F2E] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in-up">
        <div class="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 font-bold text-indigo-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        
        <h2 class="text-2xl font-bold text-white mb-2">Consentimiento Requerido</h2>
        <p class="text-gray-400 text-sm mb-6 leading-relaxed">
          Para continuar utilizando Nexo Finance, requerimos tu consentimiento explícito sobre nuestra Política de Privacidad y el uso de datos.
        </p>
        
        <div class="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6">
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-indigo-400 mt-1">•</span>
              <span>He leído y acepto la Política de Privacidad de Nexo Finance.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-indigo-400 mt-1">•</span>
              <span>Consiento que mis datos financieros anonimizados sean compartidos de forma segura con proveedores de IA (ej. Gemini) para análisis avanzados.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-indigo-400 mt-1">•</span>
              <span>Comprendo que los datos generados son <strong>exclusivamente para predicciones dentro de la app</strong> y <strong>no constituyen recomendaciones financieras</strong>.</span>
            </li>
          </ul>
        </div>
        
        <div class="flex gap-3 mt-8">
          <button (click)="onDecline()" class="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all font-medium">
            Rechazar
          </button>
          <button (click)="onAccept()" class="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-indigo-600/30">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
  `]
})
export class ConsentModalComponent {
    @Output() consentResponse = new EventEmitter<boolean>();

    onAccept() {
        this.consentResponse.emit(true);
    }

    onDecline() {
        this.consentResponse.emit(false);
    }
}
