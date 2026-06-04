import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Investment {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  symbol?: string;
  quantity: number;
  purchase_price: number;
  current_price?: number;
  total_invested: number;
  total_current: number;
  currency?: string;
  investment_type?: string;
  date?: string;
}

export interface InvestmentStats {
  total_investments: number;
  total_invested: number;
  total_current_value: number;
  total_profit_loss: number;
}

@Injectable({ providedIn: 'root' })
export class InvestmentsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Investment[]>> {
    return this.get<ApiResponse<Investment[]>>('/investments/');
  }

  getStats(): Observable<ApiResponse<InvestmentStats>> {
    return this.get<ApiResponse<InvestmentStats>>('/investments/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Investment[]>> {
    return this.get<ApiResponse<Investment[]>>(`/investments/${userId}`);
  }
}
