import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './admin.service';

export interface Goal {
  id: string;
  user_id: string;
  user_email?: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  currency?: string;
}

export interface GoalStats {
  total_goals: number;
  completed_goals: number;
  in_progress_goals: number;
  total_target: number;
  total_saved: number;
}

@Injectable({ providedIn: 'root' })
export class GoalsService extends DataService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<ApiResponse<Goal[]>> {
    return this.get<ApiResponse<Goal[]>>('/goals/');
  }

  getStats(): Observable<ApiResponse<GoalStats>> {
    return this.get<ApiResponse<GoalStats>>('/goals/stats');
  }

  getByUser(userId: string): Observable<ApiResponse<Goal[]>> {
    return this.get<ApiResponse<Goal[]>>(`/goals/${userId}`);
  }
}
