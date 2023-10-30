import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {
  currentDate: HTMLElement;
  prevNextIcon: NodeListOf<HTMLElement>;
  date: Date;
  currYear: number;
  currMonth: number;
  months: string[];
  daysArray: { value: number; isActive: boolean }[] = [];
  studentCount: any = {};
  teacherCount: any = {};
  announcementlist: any [] = []
  dept_id: any;
  subjects: any[] = [];
  user: any;
  deptId: number;
  gradelvlId: number;
  sectionId:number;
  subjectId: number;
  studentId: number;
  quarters: any[]=[]
  selectedQuarter: number;
  activitiesToDisplay: any[] = [];
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authService.getStudentCount().subscribe(
      count => {
        this.studentCount = count;
      }
    )
    this.authService.getTeacherCount().subscribe(
      count => {
        this.teacherCount = count;
      }
    )
    this.authService.getStudentProfile().subscribe((userData: any) => {
      this.dept_id = userData.dept_id
      this.gradelvlId = userData.gradelvl_id
      this.studentId = userData.student_id
      this.sectionId = userData.section_id
      this.getAnnouncement()

      this.authService.getSubjectsByDeptGL(this.dept_id, this.gradelvlId).subscribe(
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
        this.fetchActivitiesForToday()

      },
      (error) => {
        console.error('Error fetching quarters:', error);
      }
      )
    });
    
  }

  getAnnouncement(){
    console.log(this.dept_id)
    this.authService.getAnnouncementbyDept(this.dept_id).subscribe((data: any) => {
      console.log(data)
      this.announcementlist = data
    })
  }
  ngAfterViewInit() {
    this.currentDate = document.querySelector(".current-date") as HTMLElement;
    this.prevNextIcon = document.querySelectorAll(".icons span") as NodeListOf<HTMLElement>;

    this.date = new Date();
    this.currYear = this.date.getFullYear();
    this.currMonth = this.date.getMonth();

    this.months = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    this.renderCalendar();

    this.prevNextIcon.forEach(icon => {
      icon.addEventListener("click", () => {
        this.currMonth = icon.id === "prev" ? this.currMonth - 1 : this.currMonth + 1;
        if (this.currMonth < 0 || this.currMonth > 11) {
          this.date = new Date(this.currYear, this.currMonth, new Date().getDate());
          this.currYear = this.date.getFullYear();
          this.currMonth = this.date.getMonth();
        } else {
          this.date = new Date();
        }
        this.renderCalendar();
      });
    });
    this.cdr.detectChanges();

  }

  renderCalendar() {
    let firstDayofMonth = new Date(this.currYear, this.currMonth, 1).getDay();
    let lastDateofMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(this.currYear, this.currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(this.currYear, this.currMonth, 0).getDate();
    this.daysArray = [];

    for (let i = firstDayofMonth; i > 0; i--) {
      this.daysArray.push({ value: lastDateofLastMonth - i + 1, isActive: false });
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const isToday = i === this.date.getDate() && this.currMonth === new Date().getMonth() && this.currYear === new Date().getFullYear();
      this.daysArray.push({ value: i, isActive: isToday });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      this.daysArray.push({ value: i - lastDayofMonth + 1, isActive: false });
    }

    this.currentDate.innerText = `${this.months[this.currMonth]} ${this.currYear}`;
    this.cdr.detectChanges();


  }
  fetchActivitiesForToday() {
    const currentDate: Date = new Date();
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(currentDate);
    endOfToday.setHours(23, 59, 59, 999);
  
    this.activitiesToDisplay = [];
  
    this.subjects.forEach((subject) => {
      const subjectId = subject.subject_id;
      const filters = {
        gradelevel: this.gradelvlId,
        section: this.sectionId,
        subject: subjectId,
        quarter: this.selectedQuarter,
        student: this.studentId,
      };
  
      this.authService.fetchIndivStudentGrades(filters).subscribe(
        (response: any) => {
          const activitiesForToday = response.filter((activity: any) => {
            const activityFields = Object.keys(response[0]);
  
            const activitiesToDisplay = [];
  
            activityFields.forEach((field) => {
              if (
                (field.includes('date_input_ww_score_') ||
                field.includes('date_input_pt_score') ||
                field === 'date_input_qa_score') &&
                activity[field]
              ) {
                const activityDate = new Date(activity[field]);
  
                if (activityDate >= startOfToday && activityDate <= endOfToday) {
                  let index;
                  let activityName;
                  let activityScore;
  
                  if (field.includes('date_input_ww_score_')) {
                    index = parseInt(field.split('_').pop());
                    activityName = `ww_score_${index}_name`;
                    activityScore = `ww_score_${index}`;
                  } else if (field.includes('date_input_pt_score')) {
                    index = parseInt(field.split('_').pop());
                    activityName = `pt_score_${index}_name`;
                    activityScore = `pt_score_${index}`;
                  } else if (field === 'date_input_qa_score') {
                    activityName = 'qa_name';
                    activityScore = 'qa_score';
                  }
  
                  activitiesToDisplay.push({
                    date: activity[field],
                    subject: subject.subject_name,
                    activityName: activity[activityName],
                    activityScore: activity[activityScore],
                  });
                }
              }
            });
            activitiesToDisplay.forEach((activity) => {
              this.activitiesToDisplay.push(activity);
            });
    
            subject.activitiesForToday = activitiesForToday;
  
          });
  
          
          console.log(`Subject: ${subject.subject_name}`);
        },
        (error) => {
          console.error('Error fetching activities for today:', error);
        }
      );
    });
  }
  
  
  
  

}
