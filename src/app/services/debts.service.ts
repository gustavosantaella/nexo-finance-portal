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

  create(payload: Partial<Debt> & { user_id: string }): Observable<ApiResponse<Debt>> {
    return this.post<ApiResponse<Debt>>('/debts/', payload);
  }

  addPayment(debtId: string, payload: { amount: number; note?: string; account_name?: string; user_id: string }): Observable<ApiResponse<{ fully_paid: boolean; remaining: number; status: string }>> {
    return this.post<ApiResponse<{ fully_paid: boolean; remaining: number; status: string }>>(`/debts/${debtId}/payments`, payload);
  }

  applyInterest(debtId: string): Observable<ApiResponse<{ penalty: number }>> {
    return this.post<ApiResponse<{ penalty: number }>>(`/debts/${debtId}/interest`, {});
  }

  getPayments(debtId: string): Observable<ApiResponse<any[]>> {
    return this.get<ApiResponse<any[]>>(`/debts/${debtId}/payments`);
  }

  remove(debtId: string): Observable<ApiResponse<{ deleted: string }>> {
    return this.delete<ApiResponse<{ deleted: string }>>(`/debts/${debtId}`);
  }
}
