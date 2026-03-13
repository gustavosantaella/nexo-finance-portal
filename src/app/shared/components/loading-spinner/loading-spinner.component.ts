import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="fullScreen" class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition-all animate-in fade-in duration-300">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-slate-700/50 border-t-indigo-500 rounded-full animate-spin"></div>
        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-indigo-400/30 rounded-full animate-spin-slow"></div>
      </div>
      <p *ngIf="message" class="mt-4 text-slate-300 font-medium animate-pulse">{{ message }}</p>
    </div>

    <div *ngIf="!fullScreen" class="flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div class="relative">
        <div class="w-10 h-10 border-3 border-slate-700/50 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
      <p *ngIf="message" class="mt-3 text-xs text-slate-400 font-medium italic">{{ message }}</p>
    </div>
  `,
    styles: [`
    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }
  `]
})
export class LoadingSpinnerComponent {
    @Input() fullScreen = false;
    @Input() message = 'Cargando...';
}
