import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtsService, Debt, DebtStats } from '../../../services/debts.service';

@Component({
  selector: 'app-debts-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Deudas</h2>
          <p class="text-slate-400 font-medium">Deudas activas y pagadas de todos los usuarios</p>
        </div>
      </header>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Deudas</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_debts }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Pendientes</p>
          <p class="text-3xl font-black text-amber-400 mt-1">{{ stats()!.pending_count }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Yo Debo</p>
          <p class="text-3xl font-black text-rose-400 mt-1">{{ stats()!.i_owe_pending | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Me Deben</p>
          <p class="text-3xl font-black text-emerald-400 mt-1">{{ stats()!.owed_to_me_pending | number:'1.2-2' }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50">
          <h3 class="font-bold text-white">Listado de Deudas</h3>
        </div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Usuario</th>
                <th class="px-6 py-4">Título</th>
                <th class="px-6 py-4">Deudor</th>
                <th class="px-6 py-4">Tipo</th>
                <th class="px-6 py-4">Total</th>
                <th class="px-6 py-4">Pagado</th>
                <th class="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of debts()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-400">{{ d.user_email }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ d.title }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ d.debtor_name }}</td>
                <td class="px-6 py-4 text-xs font-bold" [class]="d.type === 'I_OWE' ? 'text-rose-400' : 'text-emerald-400'">
                  {{ d.type === 'I_OWE' ? 'Yo Debo' : 'Me Deben' }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ d.amount | number:'1.2-2' }} {{ d.currency }}</td>
                <td class="px-6 py-4 text-sm text-emerald-400">{{ d.paid_amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold px-2 py-1 rounded-lg"
                    [class]="d.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'">
                    {{ d.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DebtsViewComponent implements OnInit {
  debts = signal<Debt[]>([]);
  stats = signal<DebtStats | null>(null);
  isLoading = signal(true);

  constructor(private svc: DebtsService) {}

  ngOnInit() {
    this.svc.getStats().subscribe({ next: (r) => { if (r.success) this.stats.set(r.data); } });
    this.svc.getAll().subscribe({
      next: (r) => { if (r.success) this.debts.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }
}
