import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
  
    if (this.authService.isAuthenticated()) {
      const requiredRoles = next.data['roles'] || [];
      const userRoles = this.authService.getUserRoles();
  
      console.log('AuthGuard: Allowed Roles:', requiredRoles);
      console.log('AuthGuard: User Role:', userRoles);
  
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      if (hasRequiredRole) {
        console.log('AuthGuard: Access granted');
        return true;
      } else {
        console.log('AuthGuard: Access denied - Redirecting to login');
        return this.router.navigate(['/']);
      }
    } else {
      console.log('AuthGuard: User not logged in - Redirecting to login');
      this.router.navigate(['/']);
      return false;
    }
  }
}
