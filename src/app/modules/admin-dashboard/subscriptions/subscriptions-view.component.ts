import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsAdminService, PlanSubscription, UserSubscription } from '../../../services/subscriptions-admin.service';

@Component({
  selector: 'app-subscriptions-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header>
        <h2 class="text-4xl font-black text-white tracking-tight">Suscripciones</h2>
        <p class="text-slate-400 font-medium">Planes de usuario y suscripciones a servicios</p>
      </header>

      <!-- Plan Subscriptions (Premium vs Free) -->
      <section>
        <h3 class="text-lg font-bold text-white mb-4">Planes de la App</h3>
        <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div *ngIf="isLoadingPlans()" class="p-12 text-center text-slate-400">Cargando...</div>
          <div class="overflow-x-auto" *ngIf="!isLoadingPlans()">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                  <th class="px-6 py-4">Usuario</th>
                  <th class="px-6 py-4">Plan</th>
                  <th class="px-6 py-4">Estado</th>
                  <th class="px-6 py-4">Vence</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of planSubs()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td class="px-6 py-4 text-sm text-slate-400">{{ p.user_email }}</td>
                  <td class="px-6 py-4">
                    <span class="text-xs font-bold px-2 py-1 rounded-lg"
                      [class]="p.plan_label?.toLowerCase() === 'premium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'">
                      {{ p.plan_label || 'Free' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs font-bold px-2 py-1 rounded-lg"
                      [class]="p.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'">
                      {{ p.active ? 'Activo' : 'Cancelado' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-xs text-slate-500">{{ p.end_date | date:'dd/MM/yyyy' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- User App Subscriptions (Netflix, Spotify, etc.) -->
      <section>
        <h3 class="text-lg font-bold text-white mb-4">Suscripciones de Usuarios (Servicios)</h3>
        <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
          <div class="overflow-x-auto" *ngIf="!isLoading()">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-700/50">
                  <th class="px-6 py-4">Usuario</th>
                  <th class="px-6 py-4">Servicio</th>
                  <th class="px-6 py-4">Ciclo</th>
                  <th class="px-6 py-4">Monto</th>
                  <th class="px-6 py-4">Próxima Factura</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of userSubs()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td class="px-6 py-4 text-sm text-slate-400">{{ s.user_email }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-white">{{ s.name }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">{{ s.billing_cycle }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-indigo-400">{{ s.currency }} {{ s.amount | number:'1.2-2' }}</td>
                  <td class="px-6 py-4 text-xs text-slate-500">{{ s.next_billing_date | date:'dd/MM/yyyy' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `
})
export class SubscriptionsViewComponent implements OnInit {
  userSubs = signal<UserSubscription[]>([]);
  planSubs = signal<PlanSubscription[]>([]);
  isLoading = signal(true);
  isLoadingPlans = signal(true);

  constructor(private svc: SubscriptionsAdminService) {}

  ngOnInit() {
    this.svc.getAllUserSubscriptions().subscribe({
      next: (r) => { if (r.success) this.userSubs.set(r.data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
    this.svc.getPlanSubscriptions().subscribe({
      next: (r) => { if (r.success) this.planSubs.set(r.data); this.isLoadingPlans.set(false); },
      error: () => this.isLoadingPlans.set(false)
    });
  }
}
