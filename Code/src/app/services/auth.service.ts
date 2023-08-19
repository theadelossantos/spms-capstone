import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url: string = 'http://localhost:8000/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient, private router: Router) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
  
  login(email: string, password: string, role: string): Observable<any> {
    const data = {
      email: email,
      password: password,
      role: role
    };
    return this.http.post(`${this.api_url}login/`, data, this.httpOptions).pipe(
      catchError(this.handleError)
    );
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

  // login(email: string, password: string, role: string) {
  //   const userData = { email, password, role };
  //   return this.http.post<any>(`${this.api_url}/api/auth/`, userData, httpOptions)
  //     .pipe(
  //       map(response => {
  //         localStorage.setItem('token', response.token);
  //         localStorage.setItem('userId', response.user_id);
  //         localStorage.setItem('role', response.role);
  //         return response;
  //       })
  //     );
  // }

  // logout() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('role');
  //   this.router.navigate(['/']); 
  // }

  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('token'); 
  // }
  
  // hasRole(expectedRole: string): boolean {
  //   const userRole = localStorage.getItem('role');
  //   return userRole === expectedRole; 
  // }

}
