import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { PrivacyComponent } from './components/privacy/privacy';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: '' }
];
