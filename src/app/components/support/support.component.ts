import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-support',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen pt-32 pb-20 px-6">
      <div class="max-w-3xl mx-auto bg-[#1A1F2E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
        <h1 class="text-3xl font-bold text-white mb-6">Soporte Técnico</h1>
        <p class="text-gray-400 mb-8 leading-relaxed">
          ¿Necesitas ayuda con Nexo Finance? Estamos aquí para ayudarte. Si tienes alguna pregunta, problema o sugerencia, no dudes en contactarnos.
        </p>

        <div class="space-y-6">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 class="text-xl font-semibold text-white mb-2">Correo Electrónico</h3>
            <p class="text-gray-400 mb-4">Envíanos un correo y te responderemos lo antes posible.</p>
            <a href="mailto:softlink.ve@gmail.com" class="text-indigo-400 hover:text-indigo-300 font-medium">softlink.ve&#64;gmail.com</a>
          </div>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 class="text-xl font-semibold text-white mb-4">Preguntas Frecuentes</h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="text-white font-medium mb-1">¿Cómo borro mi cuenta?</h4>
                <p class="text-sm text-gray-400">Puedes borrar tu cuenta y todos tus datos asociados desde la sección de Preferencias dentro de la aplicación.</p>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">¿Qué pasa con mis datos si uso las funciones de Inteligencia Artificial?</h4>
                <p class="text-sm text-gray-400">Tus datos financieros son anonimizados y compartidos de forma segura con proveedores como Gemini para análisis. No se usan para entrenar modelos públicos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SupportComponent { }
