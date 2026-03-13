import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
    success?: boolean;
    message?: string;
    access_token?: string;
    user?: {
        id: string;
        email: string;
        is_admin: boolean;
    };
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/auth';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(res => {
                if (res.access_token) {
                    localStorage.setItem('nexo_token', res.access_token);
                    localStorage.setItem('nexo_is_admin', res.user?.is_admin ? 'true' : 'false');
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('nexo_token');
        localStorage.removeItem('nexo_is_admin');
        localStorage.removeItem('nexo_consent_given');
    }

    isAdmin(): boolean {
        return localStorage.getItem('nexo_is_admin') === 'true';
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('nexo_token');
    }
}
