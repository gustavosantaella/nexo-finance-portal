import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop with blur -->
      <div (click)="onCancel()" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8 shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <!-- Icon Header -->
        <div [class]="iconBgClass" class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-6">
          <ng-container [ngSwitch]="type">
            <svg *ngSwitchCase="'danger'" class="h-8 w-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg *ngSwitchCase="'success'" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg *ngSwitchDefault class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ng-container>
        </div>

        <div class="text-center">
          <h3 class="text-xl font-bold text-slate-100 mb-2">{{ title }}</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-8">
            {{ message }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button (click)="onCancel()" class="flex-1 px-6 py-3 rounded-2xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors font-semibold">
            Cancelar
          </button>
          <button (click)="onConfirm()" [class]="confirmBtnClass" class="flex-1 px-6 py-3 rounded-2xl transition-all font-semibold shadow-lg shadow-black/20">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
    @Input() isOpen = false;
    @Input() title = 'Confirmar acción';
    @Input() message = '¿Estás seguro de que deseas realizar esta acción?';
    @Input() confirmText = 'Confirmar';
    @Input() type: 'info' | 'success' | 'danger' = 'info';

    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    get iconBgClass(): string {
        switch (this.type) {
            case 'danger': return 'bg-rose-500/10';
            case 'success': return 'bg-emerald-500/10';
            default: return 'bg-indigo-500/10';
        }
    }

    get confirmBtnClass(): string {
        switch (this.type) {
            case 'danger': return 'bg-rose-500 text-white hover:bg-rose-600';
            case 'success': return 'bg-emerald-500 text-white hover:bg-emerald-600';
            default: return 'bg-indigo-600 text-white hover:bg-indigo-500';
        }
    }

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}
