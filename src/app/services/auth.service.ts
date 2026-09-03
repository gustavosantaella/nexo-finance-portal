import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(res => {
                if (res.access_token) {
                    localStorage.setItem('nexo_token', res.access_token);
                    localStorage.setItem('nexo_is_admin', res.user?.is_admin ? 'true' : 'false');
                    if (res.user?.id) {
                        localStorage.setItem('nexo_user_id', res.user.id);
                    }
                    if (res.user?.email) {
                        localStorage.setItem('nexo_user_email', res.user.email);
                    }
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('nexo_token');
        localStorage.removeItem('nexo_is_admin');
        localStorage.removeItem('nexo_user_id');
        localStorage.removeItem('nexo_user_email');
        localStorage.removeItem('nexo_consent_given');
    }

    /** Identificador del usuario logueado (la "mi cuenta" que verán los módulos). */
    userId(): string | null {
        return localStorage.getItem('nexo_user_id');
    }

    userEmail(): string | null {
        return localStorage.getItem('nexo_user_email');
    }

    isAdmin(): boolean {
        return localStorage.getItem('nexo_is_admin') === 'true';
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('nexo_token');
    }
}
