import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AccountsService, AccountStats } from '../../../services/accounts.service';
import { TransactionsService, TransactionStats } from '../../../services/transactions.service';
import { DebtsService, DebtStats } from '../../../services/debts.service';
import { GoalsService, GoalStats } from '../../../services/goals.service';
import { BudgetsService, BudgetStats } from '../../../services/budgets.service';
import { InvestmentsService, InvestmentStats } from '../../../services/investments.service';
import { TransfersService, TransferStats } from '../../../services/transfers.service';
import { SubscriptionsAdminService, UserSubscription } from '../../../services/subscriptions-admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

export interface CurrencyBar { currency: string; balance: number; }

@Component({
  selector: 'app-portal-overview',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: 'portal-overview.component.html'
})
export class PortalOverviewComponent implements OnInit {
  accounts = signal<AccountStats | null>(null);
  transactions = signal<TransactionStats | null>(null);
  debts = signal<DebtStats | null>(null);
  goals = signal<GoalStats | null>(null);
  budgets = signal<BudgetStats | null>(null);
  investments = signal<InvestmentStats | null>(null);
  transfers = signal<TransferStats | null>(null);
  subscriptions = signal<UserSubscription[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private accountsService: AccountsService,
    private transactionsService: TransactionsService,
    private debtsService: DebtsService,
    private goalsService: GoalsService,
    private budgetsService: BudgetsService,
    private investmentsService: InvestmentsService,
    private transfersService: TransfersService,
    private subscriptionsService: SubscriptionsAdminService
  ) { }

  ngOnInit(): void {
    const id = this.auth.userId();
    if (!id) {
      this.error.set('No se pudo identificar tu cuenta. Cierra sesión e inicia de nuevo.');
      this.isLoading.set(false);
      return;
    }
    this.loadOwnData(id);
    setTimeout(() => this.isLoading.set(false), 1000);
  }

  /** Carga SOLO los datos del usuario logueado (getByUser). */
  private loadOwnData(userId: string): void {
    this.accountsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      const by: Record<string, number> = {};
      for (const a of r.data) {
        const c = a.currency || 'USD';
        by[c] = (by[c] || 0) + (Number(a.balance) || 0);
      }
      this.accounts.set({ total_accounts: r.data.length, balance_by_currency: by });
    });

    this.transactionsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      const now = new Date();
      let income = 0, expense = 0, pIncome = 0, pExpense = 0;
      for (const t of r.data) {
        const amt = Number(t.amount) || 0;
        const d = t.date ? new Date(t.date) : null;
        if (!d) continue;
        const isCur = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const isPrev = d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth();
        if (isCur) { if (t.is_expense) expense += amt; else income += amt; }
        else if (isPrev) { if (t.is_expense) pExpense += amt; else pIncome += amt; }
      }
      this.transactions.set({
        total_transactions: r.data.length, current_income: income,
        current_expense: expense, prev_income: pIncome, prev_expense: pExpense
      });
    });

    this.debtsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      let iOwe = 0, owed = 0, pending = 0;
      for (const d of r.data) {
        const rem = (Number(d.amount) || 0) - (Number(d.paid_amount) || 0);
        if (d.status !== 'paid') {
          pending++;
          if (d.type === 'I_OWE') iOwe += rem; else owed += rem;
        }
      }
      this.debts.set({ total_debts: r.data.length, i_owe_pending: iOwe, owed_to_me_pending: owed, pending_count: pending });
    });

    this.goalsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      let target = 0, saved = 0, completed = 0;
      for (const g of r.data) {
        target += Number(g.target_amount) || 0;
        saved += Number(g.current_amount) || 0;
        if ((Number(g.current_amount) || 0) >= (Number(g.target_amount) || 1)) completed++;
      }
      this.goals.set({
        total_goals: r.data.length, completed_goals: completed,
        in_progress_goals: r.data.length - completed, total_target: target, total_saved: saved
      });
    });

    this.budgetsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      let active = 0, completed = 0, budgeted = 0, executed = 0;
      for (const b of r.data) {
        if (b.status === 'active') active++;
        if (b.status === 'completed') completed++;
        budgeted += Number(b.amount) || 0;
        executed += Number(b.executed_amount) || 0;
      }
      this.budgets.set({
        total_budgets: r.data.length, active_budgets: active, completed_budgets: completed,
        total_budgeted: budgeted, total_executed: executed
      });
    });

    this.investmentsService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      let invested = 0, current = 0;
      for (const i of r.data) {
        invested += Number(i.total_invested) || 0;
        current += Number(i.total_current) || 0;
      }
      this.investments.set({
        total_investments: r.data.length, total_invested: invested,
        total_current_value: current, total_profit_loss: current - invested
      });
    });

    this.transfersService.getByUser(userId).subscribe(r => {
      if (!r.success) return;
      let volume = 0, commissions = 0;
      for (const t of r.data) {
        volume += Number(t.amount) || 0;
        commissions += Number(t.commission_amount) || 0;
      }
      this.transfers.set({ total_transfers: r.data.length, total_volume: volume, total_commissions: commissions });
    });

    this.subscriptionsService.getByUser(userId).subscribe(r => {
      if (r.success) this.subscriptions.set(r.data);
    });
  }


  currencyBars(): CurrencyBar[] {
    const map = this.accounts()?.balance_by_currency ?? {};
    const bars: CurrencyBar[] = Object.keys(map).map(k => ({ currency: k, balance: map[k] }));
    bars.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
    return bars;
  }

  currenciesCount(): number {
    return Object.keys(this.accounts()?.balance_by_currency ?? {}).length;
  }

  subscriptionMonthly(): number {
    return this.subscriptions().reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  }

  myEmail(): string | null {
    return this.auth.userEmail();
  }

  fmt(v: number): string {
    return (Number(v) || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  incomePct(): number {
    const inc = this.transactions()?.current_income ?? 0;
    const exp = this.transactions()?.current_expense ?? 0;
    const total = inc + exp;
    return total > 0 ? (inc / total) * 100 : 50;
  }

  expensePct(): number {
    return Math.max(0, 100 - this.incomePct());
  }

  prevIncomePct(): number {
    const inc = this.transactions()?.prev_income ?? 0;
    const exp = this.transactions()?.prev_expense ?? 0;
    const total = inc + exp;
    return total > 0 ? (inc / total) * 100 : 50;
  }

  prevExpensePct(): number {
    return Math.max(0, 100 - this.prevIncomePct());
  }

  barWidth(balance: number): number {
    const bars = this.currencyBars();
    const max = Math.max(...bars.map(b => Math.abs(b.balance)), 1);
    return (Math.abs(balance) / max) * 100;
  }
}

