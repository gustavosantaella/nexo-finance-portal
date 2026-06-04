import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService, TransactionStats, Transaction } from '../../../services/transactions.service';

@Component({
  selector: 'app-transactions-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Transacciones</h2>
          <p class="text-slate-400 font-medium">Historial global de transacciones de todos los usuarios</p>
        </div>
        <div class="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
          {{ transactions().length }} registros
        </div>
      </header>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Transacciones</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_transactions }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Ingresos (Mes)</p>
          <p class="text-3xl font-black text-emerald-400 mt-1">{{ stats()!.current_income | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Gastos (Mes)</p>
          <p class="text-3xl font-black text-rose-400 mt-1">{{ stats()!.current_expense | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Balance Mes</p>
          <p class="text-3xl font-black mt-1" [class]="(stats()!.current_income - stats()!.current_expense) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
            {{ (stats()!.current_income - stats()!.current_expense) | number:'1.2-2' }}
          </p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50">
          <h3 class="font-bold text-white">Todas las Transacciones</h3>
        </div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Usuario</th>
                <th class="px-6 py-4">Título</th>
                <th class="px-6 py-4">Categoría</th>
                <th class="px-6 py-4">Cuenta</th>
                <th class="px-6 py-4">Monto</th>
                <th class="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of transactions()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-400">{{ tx.user_email }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-white">{{ tx.title }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ tx.category }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ tx.account }}</td>
                <td class="px-6 py-4 text-sm font-bold" [class]="tx.is_expense ? 'text-rose-400' : 'text-emerald-400'">
                  {{ tx.is_expense ? '-' : '+' }}{{ tx.amount | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">{{ tx.date | date:'dd/MM/yy' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TransactionsViewComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  stats = signal<TransactionStats | null>(null);
  isLoading = signal(true);

  constructor(private svc: TransactionsService) {}

  ngOnInit() {
    this.svc.getStats().subscribe({ next: (r) => { if (r.success) this.stats.set(r.data); } });
    this.svc.getAll().subscribe({
      next: (r) => { if (r.success) this.transactions.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }
}
