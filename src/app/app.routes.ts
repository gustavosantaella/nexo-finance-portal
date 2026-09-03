import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { PrivacyComponent } from './components/privacy/privacy';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { SupportComponent } from './components/support/support.component';
import { FaqComponent } from './components/faq/faq.component';
import { AdminDashboardComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { PortalOverviewComponent } from './modules/admin-dashboard/overview/portal-overview.component';
import { UserManagementComponent } from './modules/admin-dashboard/user-management/user-management.component';
import { UserDetailComponent } from './modules/admin-dashboard/user-detail/user-detail.component';
import { TransactionsViewComponent } from './modules/admin-dashboard/transactions/transactions-view.component';
import { AccountsViewComponent } from './modules/admin-dashboard/accounts/accounts-view.component';
import { BudgetsViewComponent } from './modules/admin-dashboard/budgets/budgets-view.component';
import { DebtsViewComponent } from './modules/admin-dashboard/debts/debts-view.component';
import { GoalsViewComponent } from './modules/admin-dashboard/goals/goals-view.component';
import { InvestmentsViewComponent } from './modules/admin-dashboard/investments/investments-view.component';
import { TransfersViewComponent } from './modules/admin-dashboard/transfers/transfers-view.component';
import { SubscriptionsViewComponent } from './modules/admin-dashboard/subscriptions/subscriptions-view.component';
import { adminGuard } from './guards/admin.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'login', component: LoginComponent },
      { path: 'support', component: SupportComponent },
      { path: 'faq', component: FaqComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: PortalOverviewComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'users/:id', component: UserDetailComponent },
      { path: 'transactions', component: TransactionsViewComponent },
      { path: 'accounts', component: AccountsViewComponent },
      { path: 'budgets', component: BudgetsViewComponent },
      { path: 'debts', component: DebtsViewComponent },
      { path: 'goals', component: GoalsViewComponent },
      { path: 'investments', component: InvestmentsViewComponent },
      { path: 'transfers', component: TransfersViewComponent },
      { path: 'subscriptions', component: SubscriptionsViewComponent },
    ]
  },
  { path: '**', redirectTo: '/login' },
];

