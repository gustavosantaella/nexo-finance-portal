import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Account {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  balance: number;
  currency: string;
  icon?: number;
  color?: number;
}

export interface AccountStats {
  total_accounts: number;
  balance_by_currency: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class AccountsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Account[]>> {
    return this.get<ApiResponse<Account[]>>('/accounts/');
  }

  getStats(): Observable<ApiResponse<AccountStats>> {
    return this.get<ApiResponse<AccountStats>>('/accounts/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Account[]>> {
    return this.get<ApiResponse<Account[]>>(`/accounts/${userId}`);
  }
}
