import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Transfer {
  id: string;
  user_id: string;
  user_email?: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  date: string;
  note?: string;
  commission_amount?: number;
}

export interface TransferStats {
  total_transfers: number;
  total_volume: number;
  total_commissions: number;
}

@Injectable({ providedIn: 'root' })
export class TransfersService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Transfer[]>> {
    return this.get<ApiResponse<Transfer[]>>('/transfers/');
  }

  getStats(): Observable<ApiResponse<TransferStats>> {
    return this.get<ApiResponse<TransferStats>>('/transfers/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Transfer[]>> {
    return this.get<ApiResponse<Transfer[]>>(`/transfers/${userId}`);
  }
}
