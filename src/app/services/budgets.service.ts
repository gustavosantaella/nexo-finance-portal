import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Budget {
  id: string;
  user_id: string;
  user_email?: string;
  title: string;
  amount: number;
  executed_amount: number;
  category?: string;
  status: string;
  concurrency?: string;
  currency_symbol?: string;
}

export interface BudgetStats {
  total_budgets: number;
  active_budgets: number;
  completed_budgets: number;
  total_budgeted: number;
  total_executed: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Budget[]>> {
    return this.get<ApiResponse<Budget[]>>('/budgets/');
  }

  getStats(): Observable<ApiResponse<BudgetStats>> {
    return this.get<ApiResponse<BudgetStats>>('/budgets/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Budget[]>> {
    return this.get<ApiResponse<Budget[]>>(`/budgets/${userId}`);
  }
}
