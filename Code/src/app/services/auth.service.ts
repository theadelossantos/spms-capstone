import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url: string = 'http://localhost:8000/';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string, role: string) {
    const userData = { email, password, role };
    return this.http.post<any>(`${this.api_url}/api/auth/`, userData, httpOptions)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.user_id);
          localStorage.setItem('role', response.role);
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/']); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); 
  }
  
  hasRole(expectedRole: string): boolean {
    const userRole = localStorage.getItem('role');
    return userRole === expectedRole; 
  }

}
