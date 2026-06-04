import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Debt {
  id: string;
  user_id: string;
  user_email?: string;
  title: string;
  amount: number;
  paid_amount: number;
  debtor_name: string;
  type: string;
  status: string;
  currency?: string;
  due_date?: string;
  interest_rate?: number;
}

export interface DebtStats {
  total_debts: number;
  i_owe_pending: number;
  owed_to_me_pending: number;
  pending_count: number;
}

@Injectable({ providedIn: 'root' })
export class DebtsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Debt[]>> {
    return this.get<ApiResponse<Debt[]>>('/debts/');
  }

  getStats(): Observable<ApiResponse<DebtStats>> {
    return this.get<ApiResponse<DebtStats>>('/debts/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Debt[]>> {
    return this.get<ApiResponse<Debt[]>>(`/debts/${userId}`);
  }
}
