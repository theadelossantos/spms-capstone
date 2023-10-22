import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-student-weeklyprog',
  templateUrl: './student-weeklyprog.component.html',
  styleUrls: ['./student-weeklyprog.component.css']
})
export class StudentWeeklyprogComponent {

  subjects: any[] = [];
  user: any;
  deptId: number;
  gradelvlId: number;
  sectionId:number;
  subjectId: number;
  studentId: number;
  expandedState: { [key: number]: boolean } = {};
  quarters: any[]=[]
  selectedQuarter: number;
  selectedMonth: string = 'This Week'; 
  failedActivitiesCount: { [key: number]: number } = {};


  constructor(private authService: AuthService, private router: Router){}

  ngOnInit():void{
    this.authService.getStudentProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
      this.studentId = userData.student_id
      this.deptId = userData.dept_id
      this.gradelvlId = userData.gradelvl_id
      this.sectionId = userData.section_id

      console.log(this.studentId)
      this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe(
        (response) =>{
          this.subjects = response.subjects
          console.log(this.subjects)
          if (this.subjects.length > 0) {
            this.subjectId = this.subjects[0].subject_id;
          }        
        }
      )
      this.authService.getQuarters().subscribe((quartersData) => {
        this.quarters = quartersData;
        console.log('quarters', this.quarters);
  
        if (this.quarters && this.quarters.length > 0) {
          this.selectedQuarter = this.quarters[0].quarter_id;
          console.log('Selected Quarter ID:', this.selectedQuarter);
        }
      },
      (error) => {
        console.error('Error fetching quarters:', error);
      }
      )

    });

  
  }

  toggleSubject(index: number): void {
    this.expandedState[index] = !this.expandedState[index];

    if (this.expandedState[index] && !this.subjects[index].activities) {
        const subjectId = this.subjects[index].subject_id;

        this.authService.getStudentWeeklyProgress(
            this.gradelvlId,
            this.sectionId,
            subjectId, 
            this.selectedQuarter,
            this.selectedMonth
        ).subscribe(
            (response: any) => {
                const subjectActivities = response.filter((activity: any) => activity.subject_id === subjectId);

                this.subjects[index].activities = subjectActivities;
                console.log(this.subjects[index].activities)
            },
            (error) => {
                console.error('Error fetching Weekly Progress:', error);
            }
        );
    }
}

filterByMonth() {
  for (let index = 0; index < this.subjects.length; index++) {
      if (this.expandedState[index]) {
          this.getWeeklyProgress(index);
      }
  }
}

  getWeeklyProgress(index: number) {
    const subject = this.subjects[index];
    const subjectId = subject.subject_id;

    this.authService
        .getStudentWeeklyProgress(
            this.gradelvlId,
            this.sectionId,
            subjectId,
            this.selectedQuarter,
            this.selectedMonth
        )
        .subscribe(
            (response: any) => {
                const subjectActivities = response.filter(
                    (activity: any) => activity.subject_id === subjectId
                );

                subject.activities = subjectActivities;
            },
            (error) => {
                console.error('Error fetching Weekly Progress:', error);
            }
        );
}


  countFailedActivities(activities: any[]): number{
    const failedActivities = activities.filter(activity => activity.task_status === 'Failed');
    return failedActivities.length;
  }
}
