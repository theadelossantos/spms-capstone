import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { tap, map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url: string = 'http://localhost:8000/api/auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
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
    
    return this.http.post(`${this.api_url}login/`, data, this.httpOptions)
  }

  adminlogin(email:string, password:string):Observable<any>{
    const data = {
      email, password
    };
    console.log('Request Body:', data)

    return this.http.post(`${this.api_url}admin-login/`, data, this.httpOptions)
  }

  getUserData(): Observable<any> {
    const accessToken = this.cookieService.get('access');
    console.log('Access Token:', accessToken);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
  
    return this.http.get(`${this.api_url}user-data/`, { headers })
      .pipe(
        catchError(error => {
          console.log('Error fetching user data:', error);
          throw error;
        })
      );
  }

  isAuthenticated(): boolean {
    const accessToken = this.cookieService.get('access'); 

    if (accessToken) {
      try {
        const tokenPayload = accessToken.split('.')[1];

        const decodedPayload = JSON.parse(atob(tokenPayload));

        const expirationTimestamp = decodedPayload.exp * 1000;


        const isExpired = Date.now() >= expirationTimestamp;

        return !isExpired;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
  
  getUserRoles(): string[] {
    const accessToken = this.cookieService.get('access');

    if (accessToken) {
        try {
            const tokenPayload = accessToken.split('.')[1];

            const decodedPayload = JSON.parse(atob(tokenPayload));
            
            if (decodedPayload && decodedPayload.roles) {
                return decodedPayload.roles;
            } else {
                console.error('Token payload does not contain roles:', decodedPayload);
                return [];
            }
        } catch (error) {
            console.error('Error decoding token payload', error);
            return [];
        }
    }
    return [];
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

  getDepartments():Observable<any>{
    return this.http.get<any[]>(`${this.api_url}departments/`, this.httpOptions);
  }

  getGradeLevels(): Observable<any> {
    return this.http.get(`${this.api_url}gradelevels/`, this.httpOptions)
      .pipe(
        map((response: any) => response.gradelevels), 
        catchError((error) => {
          console.error('Error fetching grade levels:', error);
          throw error; 
        })
      );
  }

  filterSections(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-sections/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  addElemSection(sectionData:any): Observable<any>{
    return this.http.post(`${this.api_url}add-elemsection/`, sectionData, this.httpOptions)
  }


  editSection(sectionId:number,  updatedSection: any): Observable<any>{
    return this.http.put(`${this.api_url}edit-sections/${sectionId}/`,  updatedSection, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  

}
