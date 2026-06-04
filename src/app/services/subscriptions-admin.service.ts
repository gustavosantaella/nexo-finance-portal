import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface PlanSubscription {
  id: string;
  user_id: string;
  user_email?: string;
  plan_id: string;
  plan_label?: string;
  active: boolean;
  end_date: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date?: string;
  currency?: string;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionsAdminService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAllUserSubscriptions(): Observable<ApiResponse<UserSubscription[]>> {
    return this.get<ApiResponse<UserSubscription[]>>('/subscriptions/');
  }

  getPlanSubscriptions(): Observable<ApiResponse<PlanSubscription[]>> {
    return this.get<ApiResponse<PlanSubscription[]>>('/subscriptions/plans');
  }

  getByUser(userId: string): Observable<ApiResponse<UserSubscription[]>> {
    return this.get<ApiResponse<UserSubscription[]>>(`/subscriptions/${userId}`);
  }
}
