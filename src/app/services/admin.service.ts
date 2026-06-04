import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserStats {
    total_users: number;
    total_admins: number;
}

export interface User {
    id: string;
    email: string;
    is_admin: boolean;
    is_verified: boolean;
    full_name: string;
    last_sign_in: string | null;
    created_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<ApiResponse<UserStats>> {
        return this.http.get<ApiResponse<UserStats>>(`${this.apiUrl}/stats`);
    }

    getUsers(): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`);
    }

    updateUser(userId: string, data: Partial<User>): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/users/${userId}`, data);
    }

    deleteUser(userId: string): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/users/${userId}`);
    }
}
