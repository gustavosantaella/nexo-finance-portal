import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransfersService, Transfer, TransferStats } from '../../../services/transfers.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-transfers-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header>
        <h2 class="text-4xl font-black text-white tracking-tight">Transferencias</h2>
        <p class="text-slate-400 font-medium">Tus transferencias entre cuentas</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Transferencias</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_transfers }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Volumen Total</p>
          <p class="text-3xl font-black text-indigo-400 mt-1">{{ stats()!.total_volume | number:'1.2-2' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Comisiones</p>
          <p class="text-3xl font-black text-amber-400 mt-1">{{ stats()!.total_commissions | number:'1.2-2' }}</p>
        </div>
      </div>

      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50"><h3 class="font-bold text-white">Historial</h3></div>
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
        <div class="overflow-x-auto" *ngIf="!isLoading()">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                <th class="px-6 py-4">Monto</th>
                <th class="px-6 py-4">Comisión</th>
                <th class="px-6 py-4">Nota</th>
                <th class="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of transfers()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm font-bold text-white">{{ t.amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm text-amber-400">{{ t.commission_amount || 0 | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ t.note || '—' }}</td>
                <td class="px-6 py-4 text-xs text-slate-500">{{ t.date | date:'dd/MM/yy' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TransfersViewComponent implements OnInit {
  transfers = signal<Transfer[]>([]);
  stats = signal<TransferStats | null>(null);
  isLoading = signal(true);

  constructor(private svc: TransfersService, private auth: AuthService) {}

  ngOnInit() {
    const uid = this.auth.userId();
    if (!uid) { this.isLoading.set(false); return; }
    this.svc.getByUser(uid).subscribe({
      next: (r) => {
        if (!r.success) { this.isLoading.set(false); return; }
        let volume = 0, commissions = 0;
        for (const t of r.data) {
          volume += Number(t.amount) || 0;
          commissions += Number(t.commission_amount) || 0;
        }
        this.stats.set({ total_transfers: r.data.length, total_volume: volume, total_commissions: commissions });
        this.transfers.set(r.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
