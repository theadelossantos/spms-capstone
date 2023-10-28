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

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
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

    if (this.expandedState[index]) {
        const subjectId = this.subjects[index].subject_id;
        const filters = {
            gradelevel: this.gradelvlId,
            section: this.sectionId,
            subject: subjectId,
            quarter: this.selectedQuarter,
            student: this.studentId,
        };

        const currentDate: Date = new Date();
        this.authService.fetchIndivStudentGrades(filters).subscribe(
            (response: any) => {
                console.log('activities', response);
                const selectedMonthIndex = this.getMonthIndex(this.selectedMonth);

                const selectedMonthActivities = response.filter((activity: any) => {
                    const activityFields = Object.keys(activity);
                    const activitiesToDisplay = [];

                    activityFields.forEach((field) => {
                        if (
                            field.includes('date_input_ww_score_') ||
                            field.includes('date_input_pt_score') ||
                            field === 'date_input_qa_score'
                        ) {
                            const index = field.includes('date_input_ww_score_')
                                ? parseInt(field.split('_').pop())
                                : 1;

                            if (activity[field]) {
                                const activityDate = new Date(activity[field]);

                                // Check if the activity is within the selected month or within the last 7 days (This Week)
                                if (
                                    activityDate.getMonth() === selectedMonthIndex ||
                                    (this.selectedMonth === 'This Week' &&
                                        currentDate.getTime() - activityDate.getTime() <= 7 * 24 * 60 * 60 * 1000)
                                ) {
                                    let activityName;
                                    let activityScore;

                                    if (field.includes('date_input_ww_score_')) {
                                        activityName = `ww_score_${index}_name`;
                                        activityScore = `ww_score_${index}`;
                                    } else if (field.includes('date_input_pt_score')) {
                                        activityName = `pt_score_${index}_name`;
                                        activityScore = `pt_score_${index}`;
                                    } else if (field === 'date_input_qa_score') {
                                        activityName = 'qa_name';
                                        activityScore = 'qa_score';
                                    }

                                    activitiesToDisplay.push({
                                        date: activity[field],
                                        activityScore:
                                            activity[activityScore] === null || isNaN(activity[activityScore])
                                                ? '-'
                                                : parseInt(activity[activityScore]),
                                        activityName: activity[activityName],
                                        status:
                                            activity[activityScore] === null || isNaN(activity[activityScore])
                                                ? 'Missing'
                                                : activity[activityScore] === ''
                                                ? 'Missing'
                                                : 'Completed',
                                    });
                                }
                            }
                        }
                    });

                    console.log('activitiesToDisplay', activitiesToDisplay);

                    this.subjects[index].activities = activitiesToDisplay;
                });
            },
            (error) => {
                console.error('Error fetching Weekly Progress:', error);
            }
        );
    }
}


  
filterByMonth(): void {
  console.log('filterByMonth function called');

  if (!this.subjects || !this.subjects.length) {
    return;
  }

  const selectedMonthIndex = this.months.indexOf(this.selectedMonth);

  if (selectedMonthIndex === -1) {
    return; 
  }

  this.subjects.forEach((subject, index) => {
    if (!subject.activities) {
      return;
    }

    console.log('Selected Month:', this.selectedMonth);

    subject.activities = subject.activities.filter((activity: any) => {
      const activityDate = new Date(activity.date);
      const activityMonth = activityDate.getMonth();

      return activityMonth === selectedMonthIndex;
    });
  });
}


  getMonthIndex(monthName: string): number {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    return months.indexOf(monthName);
  }
  

  getWeeklyProgress(index: number) {
    const subject = this.subjects[index];
    const subjectId = subject.subject_id;

    this.authService.getStudentGrades(subjectId, this.selectedQuarter, this.studentId).subscribe(
      (response: any) => {
        console.log('activities', response);
      },
      (error) => {
        console.error('Error fetching Weekly Progress:', error);
      }
    );
  }

}
