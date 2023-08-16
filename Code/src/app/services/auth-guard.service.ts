import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // If authenticated, check if the user's role matches the expected role from route data
      const expectedRole = next.data['expectedRole'];
      if (this.authService.hasRole(expectedRole)) {
        return true; // Allow access if roles match
      } else {
        this.router.navigate(['/']); // Redirect to login if roles don't match
        return false;
      }
    } else {
      this.router.navigate(['/']); 
      return false;
    }
  }

}
