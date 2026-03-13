import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { PrivacyComponent } from './components/privacy/privacy';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { SupportComponent } from './components/support/support.component';
import { FaqComponent } from './components/faq/faq.component';
import { AdminDashboardComponent, AdminHomeComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './modules/admin-dashboard/user-management/user-management.component';

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
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'users', component: UserManagementComponent }
    ]
  },
  { path: '**', redirectTo: '/login' },
];
