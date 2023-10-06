import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-student-analytics',
  templateUrl: './student-analytics.component.html',
  styleUrls: ['./student-analytics.component.css']
})
export class StudentAnalyticsComponent {
  subjects: any[] = [];
  user: any;
  deptId: number;
  gradelvlId: number;
  sectionId: number;
  subjectId: number;
  studentId: number;
  subjectName: string;

  constructor(private authService: AuthService, private router: Router) {}

  
  ngOnInit():void{
    this.authService.getStudentProfile().subscribe((userData: any) => {
      this.user = userData;
      this.studentId = userData.student_id;
      this.deptId = userData.dept_id;
      this.gradelvlId = userData.gradelvl_id;
      this.sectionId = userData.section_id;

      this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe((response) => {
        this.subjects = response.subjects;
        console.log(this.subjects)
        if (this.subjects.length > 0) {
          this.subjectId = this.subjects[0].subject_id;
        }
      })
    });

      
  }
}
