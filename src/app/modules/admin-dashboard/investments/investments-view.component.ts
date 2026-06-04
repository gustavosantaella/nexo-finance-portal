import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentsService, Investment, InvestmentStats } from '../../../services/investments.service';

@Component({
  selector: 'app-investments-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Inversiones</h2>
          <p class="text-slate-400 font-medium">Portfolio global de inversiones</p>
        </div>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_investments }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Invertido</p>
          <p class="text-3xl font-black text-indigo-400 mt-1">{{ stats()!.total_invested | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Valor Actual</p>
          <p class="text-3xl font-black text-amber-400 mt-1">{{ stats()!.total_current_value | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">P&L Global</p>
          <p class="text-3xl font-black mt-1" [class]="stats()!.total_profit_loss >= 0 ? 'text-emerald-400' : 'text-rose-400'">
            {{ stats()!.total_profit_loss >= 0 ? '+' : '' }}{{ stats()!.total_profit_loss | number:'1.2-2' }}
          </p>
        </div>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50"><h3 class="font-bold text-white">Portfolio</h3></div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Usuario</th>
                <th class="px-6 py-4">Nombre</th>
                <th class="px-6 py-4">Símbolo</th>
                <th class="px-6 py-4">Tipo</th>
                <th class="px-6 py-4">Invertido</th>
                <th class="px-6 py-4">Actual</th>
                <th class="px-6 py-4">P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let inv of investments()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-400">{{ inv.user_email }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ inv.name }}</td>
                <td class="px-6 py-4 text-xs text-indigo-400 font-bold">{{ inv.symbol || '—' }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ inv.investment_type || '—' }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ inv.total_invested | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm text-amber-400">{{ inv.total_current | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm font-bold" [class]="(inv.total_current - inv.total_invested) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ (inv.total_current - inv.total_invested) | number:'1.2-2' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InvestmentsViewComponent implements OnInit {
  investments = signal<Investment[]>([]);
  stats = signal<InvestmentStats | null>(null);
  isLoading = signal(true);

  constructor(private svc: InvestmentsService) {}

  ngOnInit() {
    this.svc.getStats().subscribe({ next: (r) => { if (r.success) this.stats.set(r.data); } });
    this.svc.getAll().subscribe({
      next: (r) => { if (r.success) this.investments.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }
}
