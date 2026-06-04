import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService, UserStats } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
      <!-- Sidebar -->
      <aside class="w-72 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 p-8 flex flex-col gap-10 shadow-2xl relative z-10 overflow-hidden">
        <!-- Glow effect in background -->
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[100px]"></div>
        
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-white italic">NEXO <span class="text-indigo-500 not-italic">ADM</span></h1>
        </div>

        <nav class="flex flex-col gap-1 overflow-y-auto">
          <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mb-1">Principal</p>
          <a routerLink="/admin" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="font-semibold text-sm">Dashboard</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <span class="font-semibold text-sm">Usuarios</span>
          </a>
          <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mt-3 mb-1">Finanzas</p>
          <a routerLink="/admin/transactions" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <span class="font-semibold text-sm">Transacciones</span>
          </a>
          <a routerLink="/admin/accounts" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <span class="font-semibold text-sm">Cuentas</span>
          </a>
          <a routerLink="/admin/transfers" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            <span class="font-semibold text-sm">Transferencias</span>
          </a>
          <a routerLink="/admin/budgets" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            <span class="font-semibold text-sm">Presupuestos</span>
          </a>
          <a routerLink="/admin/debts" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="font-semibold text-sm">Deudas</span>
          </a>
          <a routerLink="/admin/goals" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span class="font-semibold text-sm">Metas</span>
          </a>
          <a routerLink="/admin/investments" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
            <span class="font-semibold text-sm">Inversiones</span>
          </a>
          <a routerLink="/admin/subscriptions" routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/50"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-700/40 transition-all border border-transparent group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
            <span class="font-semibold text-sm">Suscripciones</span>
          </a>
        </nav>
        
        <div class="mt-auto px-2">
          <div class="p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50 mb-6 flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">A</div>
             <div class="flex flex-col overflow-hidden">
               <span class="text-xs font-bold text-white truncate">Administrator</span>
               <span class="text-[10px] text-slate-500 truncate italic">admin@nexo.finance</span>
             </div>
          </div>
          <button (click)="logout()" class="w-full px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 font-bold text-sm border border-rose-500/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="flex flex-col gap-10 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Panel de Control</h2>
          <p class="text-slate-400 font-medium">Resumen general y métricas del sistema</p>
        </div>
        <div class="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 text-xs font-bold uppercase tracking-widest">
          Actualizado ahora
        </div>
      </header>

      <app-loading-spinner *ngIf="isLoading()" message="Cargando estadísticas..."></app-loading-spinner>

      <div *ngIf="!isLoading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Users Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <span class="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20 uppercase tracking-tighter cursor-default">+12% Mes</span>
            </div>
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Usuarios</p>
            <p class="text-5xl font-black mt-2 text-white">{{ stats()?.total_users || 0 }}</p>
          </div>
        </div>

        <!-- Admins Card -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-400/5 rounded-full blur-2xl"></div>
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
            </div>
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest">Administradores</p>
            <p class="text-5xl font-black mt-2 text-indigo-400">{{ stats()?.total_admins || 0 }}</p>
          </div>
        </div>

        <!-- System Health (Mock) -->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span class="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20 uppercase tracking-tighter uppercase">Estable</span>
            </div>
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest">Sistema</p>
            <p class="text-4xl font-black mt-2 text-white">Online</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity Teaser -->
      <section *ngIf="!isLoading()" class="bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/10 p-10 mt-4 relative overflow-hidden group">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-all"></div>
        <div class="relative">
          <h3 class="text-xl font-black text-white mb-6">Actividad Reciente</h3>
          <div class="flex flex-col gap-4">
             <div class="flex items-center gap-4 group/item cursor-pointer">
               <div class="w-2 h-2 rounded-full bg-indigo-500 group-hover/item:scale-150 transition-transform"></div>
               <p class="text-slate-300 text-sm"><span class="font-bold text-white italic">Ligmar Castro</span> se ha registrado en el sistema.</p>
               <span class="ml-auto text-[10px] font-bold text-slate-500 uppercase">Hace 2m</span>
             </div>
             <div class="flex items-center gap-4 group/item cursor-pointer">
               <div class="w-2 h-2 rounded-full bg-emerald-500 group-hover/item:scale-150 transition-transform"></div>
               <p class="text-slate-300 text-sm"><span class="font-bold text-white italic">Administrator</span> verificó a <span class="text-emerald-400">test@user.com</span>.</p>
               <span class="ml-auto text-[10px] font-bold text-slate-500 uppercase">Hace 1h</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AdminHomeComponent implements OnInit {
  stats = signal<UserStats | null>(null);
  isLoading = signal<boolean>(true);

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    console.log('AdminHome: Iniciando carga de estadísticas...');
    this.isLoading.set(true);
    this.adminService.getStats().subscribe({
      next: (res) => {
        console.log('AdminHome: Estadísticas recibidas:', res);
        if (res.success) {
          this.stats.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('AdminHome: Error cargando estadísticas:', err);
        this.isLoading.set(false);
      }
    });
  }
}
