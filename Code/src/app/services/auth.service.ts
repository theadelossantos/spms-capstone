import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse,  HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { tap, map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private csrfToken: string;
  private api_url: string = 'http://localhost:8000/api/auth/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.getAccessToken()}`,
    }),
    withCredentials: true
  };
  
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
   }

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

  private getAccessToken(): string {
    return this.cookieService.get('access') || '';

  }
  
  login(email: string, password: string, role: string): Observable<any> {
    const data = {
      email,
      password,
      role
    };
    return this.http.post(`${this.api_url}login/`, data, this.httpOptions)
  }


  adminlogin(email:string, password:string):Observable<any>{
    const data = {
      email, password
    };

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

  editStudent(studentId:number,  updatedStudentData: any): Observable<any>{
    return this.http.put(`${this.api_url}edit-student/${studentId}/`,  updatedStudentData, this.httpOptions)
  }

  getStudentById(studentId: number): Observable<any> {
    return this.http.get(`${this.api_url}edit-student/${studentId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteStudent(studentId:number): Observable<any>{
    return this.http.delete(`${this.api_url}del-student/${studentId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  filterStudents(departmentId:number, gradeLevelId:number, sectionId:number){
    return this.http.get(`${this.api_url}filter-students/${departmentId}/${gradeLevelId}/${sectionId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  addTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.api_url}add-teacher/`, teacherData, this.httpOptions).pipe(
      catchError((error) => {
        return throwError(error); 
      })
    )
      
  }

  filterTeachers(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-teachers/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  filterHsTeachers(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-hs-teachers/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  filtersHsTeachers(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-shs-teachers/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }


  editTeacher(teacherId:number,  updatedTeacherData: any): Observable<any>{
    return this.http.put(`${this.api_url}edit-teacher/${teacherId}/`,  updatedTeacherData, this.httpOptions)
  }

  getTeacherById(teacherId: number): Observable<any> {
    return this.http.get(`${this.api_url}edit-teacher/${teacherId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteTeacher(teacherId:number): Observable<any>{
    return this.http.delete(`${this.api_url}del-teacher/${teacherId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
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

  deleteSection(sectionId:number): Observable<any>{
    return this.http.delete(`${this.api_url}del-sections/${sectionId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  filterHsSections(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-hs-sections/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  getHsGradeLevels(): Observable<any> {
    return this.http.get(`${this.api_url}hs-gradelevels/`, this.httpOptions)
      .pipe(
        map((response: any) => response.gradelevels), 
        catchError((error) => {
          console.error('Error fetching grade levels:', error);
          throw error; 
        })
      );
  }

  addHsSection(sectionData:any): Observable<any>{
    return this.http.post(`${this.api_url}add-hssection/`, sectionData, this.httpOptions)
  }

  filtersHsSections(gradeLevelId: number): Observable<any>{
    return this.http.get(`${this.api_url}filter-shs-sections/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering sections:', error);
        throw error;
      })
    );
  }

  getsHsGradeLevels(): Observable<any> {
    return this.http.get(`${this.api_url}shs-gradelevels/`, this.httpOptions)
      .pipe(
        map((response: any) => response.gradelevels), 
        catchError((error) => {
          console.error('Error fetching grade levels:', error);
          throw error; 
        })
      );
  }

  addsHsSection(sectionData:any): Observable<any>{
    return this.http.post(`${this.api_url}add-shssection/`, sectionData, this.httpOptions)
  }

  filterElemCourses(gradeLevelId:number): Observable<any>{
    return this.http.get(`${this.api_url}filter-elem-courses/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering courses');
        throw error;
      })
    )
  }

  editSubject(subjectId:number,  updatedSubject: any): Observable<any>{
    return this.http.put(`${this.api_url}edit-subjects/${subjectId}/`,  updatedSubject, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  deleteSubject(subjectId:number): Observable<any>{
    return this.http.delete(`${this.api_url}del-subjects/${subjectId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  addElemSubject(subjectData: any):  Observable<any>{
    return this.http.post(`${this.api_url}add-elem-subject/`, subjectData, this.httpOptions)
  }

  filterHsCourses(gradeLevelId:number): Observable<any>{
    return this.http.get(`${this.api_url}filter-hs-courses/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering courses');
        throw error;
      })
    )
  }

  addHsSubject(subjectData: any):  Observable<any>{
    return this.http.post(`${this.api_url}add-hs-subject/`, subjectData, this.httpOptions)
  }

  filtersHsCourses(gradeLevelId:number): Observable<any>{
    return this.http.get(`${this.api_url}filter-shs-courses/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError((error) => {
        console.error('Error filtering courses');
        throw error;
      })
    )
  }

  addsHsSubject(subjectData: any):  Observable<any>{
    return this.http.post(`${this.api_url}add-shs-subject/`, subjectData, this.httpOptions)
  }

  getGradelevelsByDept(departmentId:number): Observable<any>{
    return this.http.get(`${this.api_url}get-gradelvldept/${departmentId}/`, this.httpOptions)
  }

  getSectionsByDeptGL(departmentId:number, gradeLevelId:number):Observable<any>{
    return this.http.get(`${this.api_url}get-sectiondept/${departmentId}/${gradeLevelId}/`, this.httpOptions)
  }
  
  createAssignment(assignmentData: any): Observable<any> {
    return this.http.post(`${this.api_url}assignments/`, assignmentData, this.httpOptions);
  }

  getAssignments(teacherId:number): Observable<any> {
    return this.http.get(`${this.api_url}assignments/${teacherId}/`);
  }
  delAssignments(assignmentId:number): Observable<any> {
    return this.http.delete(`${this.api_url}del-assignments/${assignmentId}/`);
  }
  getSubjectsByDeptGL(departmentId:number, gradeLevelId:number):Observable<any>{
    return this.http.get(`${this.api_url}get-subjects/${departmentId}/${gradeLevelId}/`, this.httpOptions)
  }

  getDepartmentById(deptId: number): Observable<any> {
    return this.http.get(`${this.api_url}get-deptbyid/${deptId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getGradeLevelById(gradeLevelId: number): Observable<any> {
    return this.http.get(`${this.api_url}get-grlvlbyid/${gradeLevelId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getSectionById(sectionId: number): Observable<any> {
    return this.http.get(`${this.api_url}get-sectionbyid/${sectionId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getSubjectById(subjectId: number): Observable<any> {
    return this.http.get(`${this.api_url}get-subjbyid/${subjectId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private setAuthHeader(): HttpHeaders {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
  // private getCSRFToken(): string {
  //   const csrfToken = document.cookie
  //     .split('; ')
  //     .find((cookie) => cookie.startsWith('csrftoken='));
  //   if (csrfToken) {
  //     return csrfToken.split('=')[1];
  //   }
  //   return '';
  // }
  // private setAuthHeader(): HttpHeaders {
  //   const accessToken = this.getAccessToken();
  //   const csrfToken = this.getCSRFToken(); 
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   if (accessToken) {
  //     headers = headers.set('Authorization', `Bearer ${accessToken}`);
  //   }

  //   if (csrfToken) {
  //     headers = headers.set('X-CSRFToken', csrfToken);
  //   }

  //   return headers;
  // }

  getStudentProfile(): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.get(`${this.api_url}student-profile/`, { headers: authHeader });

  }

  getTeacherProfile(): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.get(`${this.api_url}teacher-profile/`, { headers: authHeader });
  }
  getAdminProfile(): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.get(`${this.api_url}admin-profile/`, { headers: authHeader });
  }
  updateAdminProfile(profileData: any): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.put(`${this.api_url}admin/profile/`, profileData, { headers: authHeader });
}
  updateTeacherProfile(profileData: any): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.put(`${this.api_url}teacher/profile/`, profileData, { headers: authHeader });
  }
  updateStudentProfile(profileData: any): Observable<any> {
    const authHeader = this.setAuthHeader();
    return this.http.put(`${this.api_url}student/profile/`, profileData, { headers: authHeader });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.api_url}logout/`, null);
  }

  addStudentGrades(studentGrades:any): Observable<any> {
    return this.http.post(`${this.api_url}student-grade/`, studentGrades, this.httpOptions);
  }

  addHPS(HPSData:any): Observable<any> {
    return this.http.post(`${this.api_url}hps/`, HPSData, this.httpOptions);
  }

  getQuarters(): Observable<any> {
    return this.http.get(`${this.api_url}quarters/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateHPS(hpsId: number, hpsData: any): Observable<any> {
    return this.http.put(`${this.api_url}hps/${hpsId}/`,hpsData,this.httpOptions);
  }

  fetchStudentGrades(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}student-grade/filter/`, filters, this.httpOptions);
  }
  fetchAllStudentGrades(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}all-subj-student-grade/filter/`, filters, this.httpOptions);
  }

  fetchHPSscores(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}hps/filter/`, filters, this.httpOptions);
  }

  batchUpdateStudentGrades(studentGrades: any[]): Observable<any> {
    return this.http.put(`${this.api_url}student-grade/batch-update/`, studentGrades, this.httpOptions);
  }

  getStudentGradesByQuarter(quarterId: number): Observable<any> {
    return this.http.get(`${this.api_url}student-grades/by-quarter/${quarterId}/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getHPSByQuarter(): Observable<any> {
    return this.http.get(`${this.api_url}hps/by-quarter/<int:quarter_id>/`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getStudentGradesByParams(gradeLevelId: number,sectionId: number,subjectId: number,quarterId: number): Observable<any> {
    return this.http.get<any>(`${this.api_url}get-subjgrades/${gradeLevelId}/${sectionId}/${subjectId}/${quarterId}/`,this.httpOptions);
  }

  getStudentCount(): Observable<number> {
    return this.http.get<number>(`${this.api_url}student-count/`, this.httpOptions);
  }
  getTeacherCount(): Observable<number> {
    return this.http.get<number>(`${this.api_url}teacher-count/`, this.httpOptions);
  }
  addWeeklyProgress(studentWeeklyProg:any): Observable<any> {
    return this.http.post(`${this.api_url}add-weeklyprogress/`, studentWeeklyProg, this.httpOptions);
  }
  getStudentWeeklyProgress(gradeLevelId: number,sectionId: number,subjectId: number,quarterId: number,  month?: string): Observable<any> {
    let url = `${this.api_url}get-weeklyprog/${gradeLevelId}/${sectionId}/${subjectId}/${quarterId}/`;
    if (month) {
      url += `?month=${month}`;
    }
  
    return this.http.get<any>(url, this.httpOptions);
  }
  updateWeeklyProgress(updatedTasks:any): Observable<any> {
    return this.http.put<any>(`${this.api_url}weekly-prog/batch-update/`, updatedTasks, this.httpOptions);
  }
  
  removeTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.api_url}remove-task/${taskId}/`, this.httpOptions);
  }

  filterWeeklyProgressByDate(selectedRange: string): Observable<any> {
    const params = new HttpParams().set('selected_range', selectedRange);

    return this.http.get<any>(
      `${this.api_url}filter-weekly-progress/`,
      { params, headers: this.httpOptions.headers }
    );
  }

  getStudentGrades(studentId: number, subjectId: number, quarterId:number): Observable<any> {
    return this.http.get<any>(`${this.api_url}fetch-grades/${studentId}/${subjectId}/${quarterId}/`, this.httpOptions);
  }
  
  addItemAnalysis(itemAnalysisData: any): Observable<any> {
    return this.http.post(`${this.api_url}add-itemanalysis/`, itemAnalysisData, this.httpOptions);
  }

  getItemAnalysisWithItemNumbers(gradelvlId: number, sectionId: number, subjectId: number, quarterId:number): Observable<any> {
    return this.http.get(`${this.api_url}item-analysis/${gradelvlId}/${sectionId}/${subjectId}/${quarterId}/`, this.httpOptions);
  }

  updateItemAnalysis(updatedItemAnalysis:any): Observable<any> {
    return this.http.put<any>(`${this.api_url}item-analysis/batch-update/`, updatedItemAnalysis, this.httpOptions);
  }

  fetchIndivStudentGrades(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}indiv-student-grade/filter/`, filters, this.httpOptions);
  }

  addAnnouncement(announcementData:any): Observable<any> {
    return this.http.post(`${this.api_url}add-announcement/`, announcementData, this.httpOptions);
  }

  getAnnouncement(): Observable<any> {
    return this.http.get(`${this.api_url}add-announcement/`, this.httpOptions);
  }
  editAnnouncement(announcementId:number, updatedAnnouncement: any): Observable<any> {
    return this.http.put(`${this.api_url}announcements/${announcementId}/`, updatedAnnouncement, this.httpOptions);
  }
  deleteAnnouncement(announcementId:number): Observable<any> {
    return this.http.delete(`${this.api_url}announcements/${announcementId}/`, this.httpOptions);
  }
  changePassword(password:any) {
    const authHeader = this.setAuthHeader();
    return this.http.post(`${this.api_url}change-password/`, password, { headers: authHeader });
  }
  getAnnouncementbyDept(deptId:any){
    return this.http.get(`${this.api_url}get-announcements/${deptId}/`, this.httpOptions);
  }

  requestPasswordReset(email: any): Observable<any> {
    return this.http.post(`${this.api_url}password-reset/`, email, this.httpOptions);
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = { token, password: newPassword };
  
    return this.http.post(`${this.api_url}password-reset-confirm/`, body);
  }
  addStudentAverage(studentGrades:any): Observable<any> {
    return this.http.post(`${this.api_url}student-average/`, studentGrades, this.httpOptions);
  }
  // batchUpdateStudentAverage(studentGrades: any): Observable<any> {
  //   return this.http.put(`${this.api_url}student-average/batch-update/`, studentGrades, this.httpOptions);
  // }
  updateAverage(aveId: number, averageData: any): Observable<any> {
    return this.http.put(`${this.api_url}average/${aveId}/`,averageData,this.httpOptions);
  }
  fetchAverage(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}average/filter/`, filters, this.httpOptions);
  }
  fetchAllAverage(filters:any):Observable<any>{
    return this.http.post(`${this.api_url}all-average/filter/`, filters, this.httpOptions);
  }
}
