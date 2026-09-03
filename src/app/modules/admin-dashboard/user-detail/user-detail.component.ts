import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService, User } from '../../../services/admin.service';
import { AccountsService, Account } from '../../../services/accounts.service';
import { TransactionsService, Transaction } from '../../../services/transactions.service';
import { DebtsService, Debt } from '../../../services/debts.service';
import { GoalsService, Goal } from '../../../services/goals.service';
import { BudgetsService, Budget } from '../../../services/budgets.service';
import { InvestmentsService, Investment } from '../../../services/investments.service';
import { TransfersService, Transfer } from '../../../services/transfers.service';
import { SubscriptionsAdminService, UserSubscription } from '../../../services/subscriptions-admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: 'user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  userId = signal<string | null>(null);
  user = signal<User | null>(null);
  accounts = signal<Account[]>([]);
  transactions = signal<Transaction[]>([]);
  debts = signal<Debt[]>([]);
  goals = signal<Goal[]>([]);
  budgets = signal<Budget[]>([]);
  investments = signal<Investment[]>([]);
  transfers = signal<Transfer[]>([]);
  subscriptions = signal<UserSubscription[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Usuario no encontrado.');
      this.isLoading.set(false);
      return;
    }
    this.userId.set(id);
    this.loadData(id);
  }

  private loadData(userId: string): void {
    this.adminService.getUsers().subscribe({
      next: res => {
        const found = res.data.find(u => u.id === userId);
        if (found) this.user.set(found);
        if (!found) this.error.set('Usuario no encontrado.');
      }
    });

    this.accountsService.getByUser(userId).subscribe(r => { if (r.success) this.accounts.set(r.data); });
    this.transactionsService.getByUser(userId).subscribe(r => { if (r.success) this.transactions.set(r.data); });
    this.debtsService.getByUser(userId).subscribe(r => { if (r.success) this.debts.set(r.data); });
    this.goalsService.getByUser(userId).subscribe(r => { if (r.success) this.goals.set(r.data); });
    this.budgetsService.getByUser(userId).subscribe(r => { if (r.success) this.budgets.set(r.data); });
    this.investmentsService.getByUser(userId).subscribe(r => { if (r.success) this.investments.set(r.data); });
    this.transfersService.getByUser(userId).subscribe(r => { if (r.success) this.transfers.set(r.data); });
    this.subscriptionsService.getByUser(userId).subscribe(r => { if (r.success) this.subscriptions.set(r.data); });

    setTimeout(() => this.isLoading.set(false), 700);
  }

  pendingDebts(): Debt[] {
    return this.debts().filter(d => d.status !== 'paid');
  }

  outstandingDebtTotal(): number {
    return this.pendingDebts().reduce((sum, d) => sum + (Number(d.amount) - Number(d.paid_amount || 0)), 0);
  }

  investedTotal(): number {
    return this.investments().reduce((sum, i) => sum + (Number(i.total_invested) || 0), 0);
  }

  balanceTotal(): number {
    return this.accounts().reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  }

  fmt(v: number): string {
    return (Number(v) || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  fmtDate(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }

  initial(): string {
    const u = this.user();
    return u && u.full_name ? u.full_name.charAt(0).toUpperCase() : '?';
  }

  debtRemaining(d: Debt): number {
    return (Number(d.amount) || 0) - (Number(d.paid_amount) || 0);
  }
}
