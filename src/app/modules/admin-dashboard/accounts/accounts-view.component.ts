import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsService, Account, AccountStats } from '../../../services/accounts.service';

@Component({
  selector: 'app-accounts-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Cuentas</h2>
          <p class="text-slate-400 font-medium">Todas las cuentas financieras de los usuarios</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 text-xs font-bold uppercase tracking-widest">
          {{ accounts().length }} cuentas
        </div>
      </header>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Cuentas</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_accounts }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Balance por Moneda</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span *ngFor="let entry of balanceEntries()" class="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/20">
              {{ entry.key }}: {{ entry.value | number:'1.2-2' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50">
          <h3 class="font-bold text-white">Listado de Cuentas</h3>
        </div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Usuario</th>
                <th class="px-6 py-4">Nombre</th>
                <th class="px-6 py-4">Moneda</th>
                <th class="px-6 py-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let acc of accounts()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-400">{{ acc.user_email }}</td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ acc.name }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ acc.currency }}</td>
                <td class="px-6 py-4 text-sm font-bold" [class]="acc.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ acc.balance | number:'1.2-2' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AccountsViewComponent implements OnInit {
  accounts = signal<Account[]>([]);
  stats = signal<AccountStats | null>(null);
  isLoading = signal(true);

  balanceEntries(): { key: string; value: number }[] {
    const s = this.stats();
    if (!s) return [];
    return Object.entries(s.balance_by_currency).map(([key, value]) => ({ key, value }));
  }

  constructor(private svc: AccountsService) {}

  ngOnInit() {
    this.svc.getStats().subscribe({ next: (r) => { if (r.success) this.stats.set(r.data); } });
    this.svc.getAll().subscribe({
      next: (r) => { if (r.success) this.accounts.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }
}
