// auth.guard.ts
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
console.log('AuthGuard: Checking authentication status...');
    console.log('Is Authenticated:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      console.log('AuthGuard: Access denied - Redirecting to login');
      this.router.navigate(['/']);
      return false;
    }

    const requiredRoles = next.data['roles'] || [];
    const userRoles = this.authService.getUserRoles();

        console.log('AuthGuard: Allowed Roles:', requiredRoles);
        console.log('AuthGuard: User Roles:', userRoles);

        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
        
        if (hasRequiredRole) {
          console.log('AuthGuard: Access granted');
          return true;
        } else {
          if (state.url === '/admin') {
            console.log('AuthGuard: Access granted for /admin route');
            return true;
          }
          console.log('AuthGuard: Access denied - Redirecting to login');
          this.router.navigate(['/admin']);
          return false;
        }
        }

}
