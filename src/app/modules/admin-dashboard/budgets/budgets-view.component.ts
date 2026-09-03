import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BudgetsService, Budget, BudgetStats } from '../../../services/budgets.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-budgets-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Presupuestos</h2>
          <p class="text-slate-400 font-medium">Presupuestos activos y completados</p>
        </div>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_budgets }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Activos</p>
          <p class="text-3xl font-black text-emerald-400 mt-1">{{ stats()!.active_budgets }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Presupuestado</p>
          <p class="text-3xl font-black text-indigo-400 mt-1">{{ stats()!.total_budgeted | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Ejecutado</p>
          <p class="text-3xl font-black text-amber-400 mt-1">{{ stats()!.total_executed | number:'1.2-2' }}</p>
        </div>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50"><h3 class="font-bold text-white">Listado</h3></div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Título</th>
                <th class="px-6 py-4">Categoría</th>
                <th class="px-6 py-4">Monto</th>
                <th class="px-6 py-4">Ejecutado</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4">Progreso</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of budgets()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm font-bold text-white">{{ b.title }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ b.category || '—' }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ b.currency_symbol }}{{ b.amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm text-amber-400">{{ b.executed_amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold px-2 py-1 rounded-lg"
                    [class]="b.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'">
                    {{ b.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="w-full bg-slate-700/50 rounded-full h-1.5 w-24">
                    <div class="bg-indigo-500 h-1.5 rounded-full" [style.width.%]="getProgress(b)"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BudgetsViewComponent implements OnInit {
  budgets = signal<Budget[]>([]);
  stats = signal<BudgetStats | null>(null);
  isLoading = signal(true);

  getProgress(b: Budget): number {
    if (!b.amount) return 0;
    return Math.min(100, (b.executed_amount / b.amount) * 100);
  }

  constructor(private svc: BudgetsService, private auth: AuthService) {}

  ngOnInit() {
    const uid = this.auth.userId();
    if (!uid) { this.isLoading.set(false); return; }
    this.svc.getByUser(uid).subscribe({
      next: (r) => {
        if (!r.success) { this.isLoading.set(false); return; }
        let active = 0, completed = 0, budgeted = 0, executed = 0;
        for (const b of r.data) {
          if (b.status === 'active') active++;
          if (b.status === 'completed') completed++;
          budgeted += Number(b.amount) || 0;
          executed += Number(b.executed_amount) || 0;
        }
        this.stats.set({
          total_budgets: r.data.length, active_budgets: active, completed_budgets: completed,
          total_budgeted: budgeted, total_executed: executed
        });
        this.budgets.set(r.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
