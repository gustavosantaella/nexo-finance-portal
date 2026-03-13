import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
    question: string;
    answer: string;
    isOpen: boolean;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-[#0C111C] pt-28 pb-20 relative overflow-hidden font-inter">
      <!-- Background Elements -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      
      <div class="container mx-auto px-4 relative z-10 max-w-4xl">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Centro de Ayuda
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Preguntas <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Frecuentes</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Encuentre respuestas rápidas a las consultas más comunes sobre el funcionamiento de Nexo Finance, privacidad y seguridad de sus datos.
          </p>
          <a href="mailto:softlink.ve@gmail.com" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
             <i class="fas fa-envelope"></i> ¿Tiene más dudas? Escríbanos a softlink.ve@gmail.com
          </a>
        </div>

        <div class="space-y-4">
          @for (faq of faqs(); track faq.question; let i = $index) {
            <div class="glass-card rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-indigo-500/30 bg-[#151B2B]">
              <button 
                (click)="toggleFaq(i)"
                class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                [attr.aria-expanded]="faq.isOpen"
              >
                <span class="text-lg font-medium text-white">{{ faq.question }}</span>
                <span 
                  class="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center transition-transform duration-300 text-indigo-400"
                  [class.rotate-180]="faq.isOpen"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                class="overflow-hidden transition-all duration-300 ease-in-out"
                [style.maxHeight]="faq.isOpen ? '500px' : '0'"
                [style.opacity]="faq.isOpen ? '1' : '0'"
              >
                <div class="px-6 pb-6 text-gray-400 leading-relaxed">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          }
        </div>
        
        <div class="mt-16 text-center text-gray-500 text-sm">
          <p>Trataremos de responderle lo antes posible a nuestro correo de soporte técnico.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .glass-card {
      background: rgba(21, 27, 43, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {

    faqs = signal<FaqItem[]>([
        {
            question: '¿Mis datos bancarios están seguros?',
            answer: 'Nexo Finance no se conecta directamente a sus cuentas bancarias ni procesa transacciones reales de su banco. Todos los registros y balances son los que usted introduce manualmente. Sus datos ingresados están cifrados y se sincronizan de forma segura mediante Supabase.',
            isOpen: false
        },
        {
            question: '¿Qué pasa con las fotos y facturas que subo a la aplicación?',
            answer: 'Cualquier imagen, recibo o audio que cargue en la aplicación NO es almacenado permanentemente. Estos archivos multimedia se procesan de forma efímera y rápida por nuestros proveedores de Inteligencia Artificial para extraer el texto y leer el gasto, y posteriormente son destruidos inmediatamente para proteger su privacidad.',
            isOpen: false
        },
        {
            question: '¿Nexo Finance es 100% offline?',
            answer: 'No. Nexo Finance utiliza una sincronización en la nube (Cloud Sync) a través de Supabase para asegurar que sus registros estructurados, balances y presupuestos estén respaldados y disponibles de manera continua si usted cambia de dispositivo o lo extravía.',
            isOpen: false
        },
        {
            question: '¿Los proveedores de IA utilizan mis datos para entrenarse?',
            answer: 'Absolutamente no. Garantizamos que los proveedores externos de IA con los que colaboramos (como Gemini) están bajo acuerdos en los que no utilizan sus datos anonimizados para entrenar sus modelos generales.',
            isOpen: false
        },
        {
            question: '¿Cómo calculan las tasas de cambio de monedas (como el BCV)?',
            answer: 'Nexo Finance consulta de forma automática y solo de forma referencial diversas APIs públicas u oficiales de terceros como las del Banco Central de Venezuela, CryptoYa, entre otras. Las tasas son estimaciones y no nos hacemos responsables por las variaciones ni de la disponibilidad continua de dichas APIs de terceros.',
            isOpen: false
        }
    ]);

    toggleFaq(index: number): void {
        this.faqs.update(items => {
            const newItems = [...items];
            // Close all others
            newItems.forEach((item, i) => {
                if (i !== index) {
                    item.isOpen = false;
                }
            });
            // Toggle the clicked one
            newItems[index] = { ...newItems[index], isOpen: !newItems[index].isOpen };
            return newItems;
        });
    }
}
