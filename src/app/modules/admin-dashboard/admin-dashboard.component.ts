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
    <div class="min-h-screen bg-slate-900 text-slate-100 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-6">
        <h1 class="text-2xl font-bold text-indigo-400">Nexo Admin</h1>
        <nav class="flex flex-col gap-2">
          <a routerLink="/admin" routerLinkActive="bg-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 rounded-lg hover:bg-slate-700 transition">Dashboard</a>
          <a routerLink="/admin/users" routerLinkActive="bg-indigo-600" class="px-4 py-2 rounded-lg hover:bg-slate-700 transition">Usuarios</a>
        </nav>
        
        <div class="mt-auto pt-6 border-t border-slate-700">
          <button (click)="logout()" class="w-full px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition flex items-center justify-center gap-2 font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto">
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
    <div class="flex flex-col gap-8">
      <header>
        <h2 class="text-3xl font-bold">Panel de Control</h2>
        <p class="text-slate-400">Resumen general del sistema</p>
      </header>

      <app-loading-spinner *ngIf="isLoading()" message="Cargando estadísticas..."></app-loading-spinner>

      <div *ngIf="!isLoading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors group">
          <p class="text-slate-400 text-sm font-medium uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Total Usuarios</p>
          <p class="text-4xl font-bold mt-2">{{ stats()?.total_users || 0 }}</p>
        </div>
        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors group">
          <p class="text-slate-400 text-sm font-medium uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Administradores</p>
          <p class="text-4xl font-bold mt-2 text-indigo-400">{{ stats()?.total_admins || 0 }}</p>
        </div>
      </div>
    </div>
  `
})
export class AdminHomeComponent implements OnInit {
  stats = signal<UserStats | null>(null);
  isLoading = signal<boolean>(true);

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.isLoading.set(true);
    this.adminService.getStats().subscribe({
      next: (res) => {
        if (res.success) this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
