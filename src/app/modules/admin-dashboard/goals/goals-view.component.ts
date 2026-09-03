import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoalsService, Goal, GoalStats } from '../../../services/goals.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-goals-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Metas Financieras</h2>
          <p class="text-slate-400 font-medium">Tus objetivos de ahorro</p>
        </div>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="stats()">
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Metas</p>
          <p class="text-3xl font-black text-white mt-1">{{ stats()!.total_goals }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Completadas</p>
          <p class="text-3xl font-black text-emerald-400 mt-1">{{ stats()!.completed_goals }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Obj. Total</p>
          <p class="text-3xl font-black text-indigo-400 mt-1">{{ stats()!.total_target | number:'1.0-0' }}</p>
        </div>
        <div class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Ahorrado</p>
          <p class="text-3xl font-black text-amber-400 mt-1">{{ stats()!.total_saved | number:'1.0-0' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" *ngIf="!isLoading()">
        <div *ngFor="let g of goals()" class="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/40 transition-all">
          <div class="flex justify-between items-start mb-4">
            <p class="font-bold text-white">{{ g.title }}</p>
            <span class="text-xs font-bold text-slate-500">{{ g.currency }}</span>
          </div>
          <div class="mb-3">
            <div class="flex justify-between text-xs text-slate-400 mb-1">
              <span>{{ g.current_amount | number:'1.2-2' }}</span>
              <span>{{ g.target_amount | number:'1.2-2' }}</span>
            </div>
            <div class="w-full bg-slate-700/50 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full transition-all"
                [style.width.%]="getProgress(g)"></div>
            </div>
          </div>
          <p class="text-xs text-slate-500 mt-1" *ngIf="g.deadline">Vence: {{ g.deadline | date:'dd/MM/yyyy' }}</p>
        </div>
      </div>
      <div *ngIf="isLoading()" class="p-12 text-center text-slate-400">Cargando...</div>
    </div>
  `
})
export class GoalsViewComponent implements OnInit {
  goals = signal<Goal[]>([]);
  stats = signal<GoalStats | null>(null);
  isLoading = signal(true);

  getProgress(g: Goal): number {
    if (!g.target_amount) return 0;
    return Math.min(100, (g.current_amount / g.target_amount) * 100);
  }

  constructor(private svc: GoalsService, private auth: AuthService) {}

  ngOnInit() {
    const uid = this.auth.userId();
    if (!uid) { this.isLoading.set(false); return; }
    this.svc.getByUser(uid).subscribe({
      next: (r) => {
        if (!r.success) { this.isLoading.set(false); return; }
        let target = 0, saved = 0, completed = 0;
        for (const g of r.data) {
          target += Number(g.target_amount) || 0;
          saved += Number(g.current_amount) || 0;
          if ((Number(g.current_amount) || 0) >= (Number(g.target_amount) || 1)) completed++;
        }
        this.stats.set({
          total_goals: r.data.length, completed_goals: completed,
          in_progress_goals: r.data.length - completed, total_target: target, total_saved: saved
        });
        this.goals.set(r.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
