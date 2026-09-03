import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Transaction {
  id: string;
  user_id: string;
  user_email?: string;
  title: string;
  amount: number;
  category: string;
  account: string;
  is_expense: boolean;
  date: string;
  note?: string;
  conversion_rate?: number;
}

export interface TransactionStats {
  total_transactions: number;
  current_income: number;
  current_expense: number;
  prev_income: number;
  prev_expense: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Transaction[]>> {
    return this.get<ApiResponse<Transaction[]>>('/transactions/');
  }

  getStats(): Observable<ApiResponse<TransactionStats>> {
    return this.get<ApiResponse<TransactionStats>>('/transactions/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Transaction[]>> {
    return this.get<ApiResponse<Transaction[]>>(`/transactions/${userId}`);
  }

  create(payload: Partial<Transaction> & { user_id: string }): Observable<ApiResponse<Transaction>> {
    return this.post<ApiResponse<Transaction>>('/transactions/', payload);
  }

  update(id: string, payload: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.patch<ApiResponse<Transaction>>(`/transactions/${id}`, payload);
  }

  remove(id: string): Observable<ApiResponse<{ deleted: string }>> {
    return this.delete<ApiResponse<{ deleted: string }>>(`/transactions/${id}`);
  }
}
