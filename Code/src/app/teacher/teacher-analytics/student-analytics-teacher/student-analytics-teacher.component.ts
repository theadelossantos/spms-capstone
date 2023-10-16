import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-analytics-teacher',
  templateUrl: './student-analytics-teacher.component.html',
  styleUrls: ['./student-analytics-teacher.component.css']
})
export class StudentAnalyticsTeacherComponent {
  assignedSubjects: any[] = [];
  user: any;
  gradelvlId: number;
  sectionId: number;
  gradeLevelName: string;
  sectionName: string;
  deptId: number
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit():void{
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
      this.gradelvlId = userData.gradelvl_id
      this.sectionId = userData.section_id
      this.deptId = userData.dept_id

      const teacherId = userData.teacher_id
      console.log('id',teacherId)

      this.authService.getGradeLevelById(this.gradelvlId).subscribe(
        (gradeLevelData: any) => {
          this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
          console.log(this.gradeLevelName)
        },
        (error) => {
          console.error('Error fetching grade level name:', error);
        }
      );

      this.authService.getSectionById(this.sectionId).subscribe(
        (sectionData: any) => {
          this.sectionName = sectionData.sections[0].section_name;
        },
        (error) => {
          console.error('Error fetching section name:', error);
        }
      );

      
      });
  }
}
