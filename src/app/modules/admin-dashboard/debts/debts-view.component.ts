import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DebtsService, Debt, DebtStats } from '../../../services/debts.service';
import { AccountsService, Account } from '../../../services/accounts.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-debts-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex flex-col gap-8 animate-in fade-in duration-700">
      <header class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Deudas</h2>
          <p class="text-slate-400 font-medium">Tus deudas activas y pagadas</p>
        </div>
        <button (click)="openNew()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">
          + Nueva deuda
        </button>
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

      <!-- Filter Toolbar -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <button *ngFor="let tab of filterTabs" (click)="setTab(tab.value)"
                  class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border"
                  [class]="filterTab() === tab.value
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-white hover:border-indigo-500/40'">
            {{ tab.label }}
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button *ngFor="let tp of typeFilters" (click)="setType(tp.value)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                  [class]="filterType() === tp.value
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-white'">
            {{ tp.label }}
          </button>
          <input type="text" placeholder="Buscar por título o deudor..." (input)="onSearch($event)"
                 class="flex-1 min-w-[200px] bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
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
                <th class="px-6 py-4">Título</th>
                <th class="px-6 py-4">Deudor</th>
                <th class="px-6 py-4">Tipo</th>
                <th class="px-6 py-4">Total</th>
                <th class="px-6 py-4">Pagado</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of visibleDebts()" class="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                <td class="px-6 py-4 text-sm font-bold text-white">{{ d.title }}</td>
                <td class="px-6 py-4 text-sm text-slate-300">{{ d.debtor_name }}</td>
                <td class="px-6 py-4 text-xs font-bold" [class]="d.type === 'I_OWE' ? 'text-rose-400' : 'text-emerald-400'">
                  {{ d.type === 'I_OWE' ? 'Yo Debo' : 'Me Deben' }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-white">{{ d.amount | number:'1.2-2' }} {{ d.currency }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-emerald-400 whitespace-nowrap">{{ d.paid_amount | number:'1.2-2' }}</span>
                    <div class="flex-1 min-w-[80px] h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
                      <div class="h-full rounded-full bg-emerald-500 transition-all"
                           [style.width.%]="d.amount > 0 ? ((d.paid_amount || 0) / d.amount) * 100 : 0"></div>
                    </div>
                    <span class="text-xs font-black text-amber-400 whitespace-nowrap">{{ (d.amount - (d.paid_amount || 0)) | currency:'USD':'symbol':'1.2-2' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold px-2 py-1 rounded-lg"
                    [class]="d.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'">
                    {{ d.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2 justify-end">
                    <button *ngIf="d.status !== 'paid'" (click)="openPay(d)" class="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold hover:bg-emerald-500/20 transition-all">Abonar</button>
                    <button *ngIf="hasInterest(d)" (click)="applyInterest(d)" title="Aplicar interés" class="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold hover:bg-amber-500/20 transition-all">Interés</button>
                    <button (click)="openHistory(d)" class="px-2 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-bold hover:bg-sky-500/20 transition-all">Historial</button>
                    <button (click)="deleteDebt(d)" class="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold hover:bg-rose-500/20 transition-all">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Nueva deuda -->
      <div *ngIf="showNew()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" (click)="showNew() && closeNew()">
        <div class="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-black text-white mb-4">Nueva deuda</h3>
          <div class="flex flex-col gap-3">
            <select [(ngModel)]="nType" name="nType" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
              <option value="I_OWE">Yo debo (recibí)</option>
              <option value="OWED_TO_ME">Me deben (presté)</option>
            </select>
            <input [(ngModel)]="nTitle" name="nTitle" placeholder="Título *" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <input [(ngModel)]="nAmount" name="nAmount" placeholder="Monto *" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <input [(ngModel)]="nDebtor" name="nDebtor" placeholder="Persona" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <input [(ngModel)]="nDueDate" name="nDueDate" type="date" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
            <select [(ngModel)]="nCurrency" name="nCurrency" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
              <option value="USD">USD</option><option value="VES">VES</option><option value="EUR">EUR</option>
            </select>
            <input [(ngModel)]="nInterest" name="nInterest" placeholder="Interés % (opcional)" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <select [(ngModel)]="nAccountId" name="nAccountId" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
              <option value="">Sin cuenta (no genera movimiento)</option>
              <option *ngFor="let a of accounts()" [value]="a.id">{{ a.name }} ({{ a.currency }})</option>
            </select>
            <p *ngIf="message()" class="text-rose-400 text-xs italic">{{ message() }}</p>
            <div class="flex gap-2 justify-end pt-2">
              <button (click)="closeNew()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 transition-all">Cancelar</button>
              <button (click)="saveNew()" [disabled]="busy()" class="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-all">{{ busy() ? 'Guardando...' : 'Guardar' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Abonar -->
      <div *ngIf="showPay()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" (click)="closePay()">
        <div class="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-black text-white mb-1">Registrar abono</h3>
          <p class="text-sm text-slate-400 mb-4">{{ activeDebt()?.title }}</p>
          <div class="flex flex-col gap-3">
            <input [(ngModel)]="pAmount" name="pAmount" placeholder="Monto *" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <input [(ngModel)]="pNote" name="pNote" placeholder="Nota (opcional)" class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500">
            <p *ngIf="message()" class="text-rose-400 text-xs italic">{{ message() }}</p>
            <div class="flex gap-2 justify-end pt-2">
              <button (click)="closePay()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 transition-all">Cancelar</button>
              <button (click)="savePay()" [disabled]="busy()" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">{{ busy() ? 'Guardando...' : 'Abonar' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Historial -->
      <div *ngIf="showHistory()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" (click)="closeHistory()">
        <div class="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-black text-white mb-4">Historial · {{ activeDebt()?.title }}</h3>
          <div *ngIf="history().length === 0" class="text-sm text-slate-500 italic">Sin abonos registrados.</div>
          <div *ngFor="let p of history()" class="flex items-center justify-between py-2 border-b border-slate-700/40 last:border-0">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-white">{{ p.amount | number:'1.2-2' }}</span>
              <span class="text-[10px] text-slate-500">Capital: {{ p.capital_amount | number:'1.2-2' }} · Interés: {{ p.interest_amount | number:'1.2-2' }}</span>
            </div>
            <span class="text-xs text-slate-500">{{ p.date | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="flex justify-end pt-4">
            <button (click)="closeHistory()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 transition-all">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DebtsViewComponent implements OnInit {
  debts = signal<Debt[]>([]);
  stats = signal<DebtStats | null>(null);
  isLoading = signal(true);
  filterTab = signal<'all' | 'pending' | 'paid' | 'overdue'>('all');
  filterType = signal<'all' | 'I_OWE' | 'OWED_TO_ME'>('all');
  searchQuery = '';
  filterTabs: { label: string; value: 'all' | 'pending' | 'paid' | 'overdue' }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Pagadas', value: 'paid' },
    { label: 'Vencidas', value: 'overdue' }
  ];
  typeFilters: { label: string; value: 'all' | 'I_OWE' | 'OWED_TO_ME' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Yo debo', value: 'I_OWE' },
    { label: 'Me deben', value: 'OWED_TO_ME' }
  ];

  // ── CRUD UI state ──
  accounts = signal<Account[]>([]);
  showNew = signal(false);
  showPay = signal(false);
  showHistory = signal(false);
  activeDebt = signal<Debt | null>(null);
  history = signal<any[]>([]);
  busy = signal(false);
  message = signal<string | null>(null);
  // form fields
  nType = 'I_OWE';
  nTitle = '';
  nAmount = '';
  nDebtor = '';
  nDueDate = '';
  nCurrency = 'USD';
  nInterest = '';
  nAccountId = '';
  pAmount = '';
  pNote = '';

  setTab(value: 'all' | 'pending' | 'paid' | 'overdue'): void { this.filterTab.set(value); }
  setType(value: 'all' | 'I_OWE' | 'OWED_TO_ME'): void { this.filterType.set(value); }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  isOverdue(d: Debt): boolean {
    return d.status !== 'paid' && !!d.due_date && new Date(d.due_date).getTime() < Date.now();
  }

  hasInterest(d: Debt): boolean {
    return (Number(d.interest_rate) || 0) > 0 && d.status !== 'paid';
  }

  visibleDebts(): Debt[] {
    const type = this.filterType();
    const tab = this.filterTab();
    const q = this.searchQuery;
    return this.debts().filter(d => {
      if (type !== 'all' && d.type !== type) return false;
      if (q && !(d.title || '').toLowerCase().includes(q) && !(d.debtor_name || '').toLowerCase().includes(q)) return false;
      switch (tab) {
        case 'pending': return d.status !== 'paid';
        case 'paid': return d.status === 'paid';
        case 'overdue': return this.isOverdue(d);
        default: return true;
      }
    });
  }

  constructor(private svc: DebtsService, private accountsService: AccountsService, private auth: AuthService) {}

  ngOnInit() {
    const uid = this.auth.userId();
    if (!uid) { this.isLoading.set(false); return; }
    this.accountsService.getByUser(uid).subscribe(r => { if (r.success) this.accounts.set(r.data); });
    this.svc.getByUser(uid).subscribe({
      next: (r) => {
        if (!r.success) { this.isLoading.set(false); return; }
        let iOwe = 0, owed = 0, pending = 0;
        for (const d of r.data) {
          const rem = (Number(d.amount) || 0) - (Number(d.paid_amount) || 0);
          if (d.status !== 'paid') {
            pending++;
            if (d.type === 'I_OWE') iOwe += rem; else owed += rem;
          }
        }
        this.stats.set({ total_debts: r.data.length, i_owe_pending: iOwe, owed_to_me_pending: owed, pending_count: pending });
        this.debts.set(r.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // ── CRUD: Nueva deuda ──
  openNew(): void {
    this.nType = 'I_OWE'; this.nTitle = ''; this.nAmount = ''; this.nDebtor = '';
    this.nDueDate = ''; this.nCurrency = 'USD'; this.nInterest = ''; this.nAccountId = '';
    this.message.set(null);
    this.showNew.set(true);
  }

  closeNew(): void { this.showNew.set(false); this.message.set(null); }

  saveNew(): void {
    const uid = this.auth.userId();
    if (!uid) { return; }
    const amount = parseFloat(this.nAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) { this.message.set('Ingresa un monto válido.'); return; }
    this.busy.set(true);
    this.message.set(null);
    const payload: any = {
      user_id: uid,
      title: this.nTitle.trim() || 'Deuda',
      amount: amount,
      type: this.nType,
      debtor_name: this.nDebtor.trim(),
      currency: this.nCurrency,
      due_date: this.nDueDate ? new Date(this.nDueDate).toISOString() : null,
      interest_rate: parseFloat(this.nInterest.replace(',', '.')) || 0,
      account_id: this.nAccountId || null
    };
    this.svc.create(payload).subscribe({
      next: (r) => { this.busy.set(false); if (r.success) { this.closeNew(); this.reload(); } else { this.message.set(r.error || 'Error al guardar.'); } },
      error: () => { this.busy.set(false); this.message.set('Error de conexión con el servidor.'); }
    });
  }

  // ── CRUD: Abonar ──
  openPay(d: Debt): void { this.activeDebt.set(d); this.pAmount = ''; this.pNote = ''; this.message.set(null); this.showPay.set(true); }
  closePay(): void { this.showPay.set(false); this.message.set(null); }

  savePay(): void {
    const uid = this.auth.userId();
    const d = this.activeDebt();
    if (!uid || !d) { return; }
    const amount = parseFloat(this.pAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) { this.message.set('Ingresa un monto válido.'); return; }
    const remaining = (Number(d.amount) || 0) - (Number(d.paid_amount) || 0);
    if (amount > remaining + 0.000001) { this.message.set('El abono supera el saldo pendiente (' + remaining.toFixed(2) + ').'); return; }
    this.busy.set(true);
    this.message.set(null);
    this.svc.addPayment(d.id, { user_id: uid, amount: amount, note: this.pNote.trim() || undefined }).subscribe({
      next: (r) => { this.busy.set(false); if (r.success) { this.closePay(); this.reload(); } else { this.message.set(r.error || 'Error al abonar.'); } },
      error: () => { this.busy.set(false); this.message.set('Error de conexión con el servidor.'); }
    });
  }

  // ── CRUD: Historial ──
  openHistory(d: Debt): void {
    this.activeDebt.set(d);
    this.history.set([]);
    this.showHistory.set(true);
    this.svc.getPayments(d.id).subscribe(r => { if (r.success) this.history.set(r.data); });
  }
  closeHistory(): void { this.showHistory.set(false); }

  // ── CRUD: Interés / Eliminar ──
  applyInterest(d: Debt): void {
    if (!window.confirm('Aplicar el interés periódico a "' + d.title + '"?')) return;
    this.svc.applyInterest(d.id).subscribe({
      next: (r) => { window.alert('Interés aplicado: ' + ((r.data?.penalty ?? 0).toFixed(2))); this.reload(); },
      error: () => window.alert('No se pudo aplicar el interés.')
    });
  }

  deleteDebt(d: Debt): void {
    if (!window.confirm('Eliminar la deuda "' + d.title + '" y su historial?')) return;
    this.svc.remove(d.id).subscribe({ next: () => this.reload(), error: () => window.alert('No se pudo eliminar.') });
  }

  private reload(): void {
    const uid = this.auth.userId();
    if (!uid) return;
    this.svc.getByUser(uid).subscribe({
      next: (r) => {
        if (!r.success) return;
        let iOwe = 0, owed = 0, pending = 0;
        for (const d of r.data) {
          const rem = (Number(d.amount) || 0) - (Number(d.paid_amount) || 0);
          if (d.status !== 'paid') {
            pending++;
            if (d.type === 'I_OWE') iOwe += rem; else owed += rem;
          }
        }
        this.stats.set({ total_debts: r.data.length, i_owe_pending: iOwe, owed_to_me_pending: owed, pending_count: pending });
        this.debts.set(r.data);
      }
    });
  }
}
