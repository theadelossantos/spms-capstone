import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url: string = 'http://localhost:8000/api/auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else if (error.status === 400 && error.error) {
      return throwError(error.error);
    } else {
      console.error('An error occurred:', error);
    }
    
    if (typeof error.error === 'string') {
      return throwError(error.error);
    }
    
    return throwError('Something went wrong; please try again later.');
  }
  
  
  login(email: string, password: string, role: string): Observable<any> {
    const data = {
      email,
      password,
      role
    };
    console.log('Request Body:', data);
    
    return this.http.post(`${this.api_url}login/`, data).pipe(
      tap(response => {
        console.log('Login Response:', response);
      })
    );
  }
  

  

  isAuthenticated(): boolean {
    const accessToken = this.cookieService.get('access');
    const refreshToken = this.cookieService.get('refresh');
    
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    return !!accessToken && !!refreshToken;
  }

  getUserRoles(): string[] {
    const accessToken = this.getCookie('access');
    if (accessToken) {
      const tokenPayload = accessToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      console.log('Decoded Token Payload:', decodedPayload);
      return decodedPayload.roles || [];
    }
    return [];
  }

  private getCookie(name: string): string | null {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }



  addStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.api_url}add-student/`, studentData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.api_url}add-teacher/`, teacherData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.api_url}add-admin/`, adminData, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

}
