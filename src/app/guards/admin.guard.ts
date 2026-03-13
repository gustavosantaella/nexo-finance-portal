import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }

    // Redirect to login if not authenticated or not an admin
    console.warn('AdminGuard: Acceso denegado. Redirigiendo a login...');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
