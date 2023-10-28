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
  selectedQuarter: number;
  quarters: any[]=[]

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

      this.authService.getQuarters().subscribe((quartersData) => {
        this.quarters = quartersData;
        console.log('quarters', this.quarters);

          if (this.quarters && this.quarters.length > 0) {
          this.selectedQuarter = this.quarters[0].quarter_id;
          console.log('Selected Quarter ID:', this.selectedQuarter);
          }
          this.fetchStudentGrades()

          
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      )


    });
  }
  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);

  }
  fetchStudentGrades(){
    const filters = {
      gradelevel: this.gradelvlId,
      section: this.sectionId,
      quarter: this.selectedQuarter
    };

    this.authService.fetchAllStudentGrades(filters).subscribe(
      (data) => {
        console.log('student grades', data)
      }
    )
  }
}
