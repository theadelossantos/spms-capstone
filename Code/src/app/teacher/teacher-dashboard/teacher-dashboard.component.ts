import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
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
  gradelvl_id: any;
  section_id: any;
  user: any;
  assignedSubjectsCount: number;
  studentsCounts:number;

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
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.dept_id = userData.dept_id
      this.gradelvl_id = userData.gradelvl_id
      this.section_id = userData.section_id
      this.getAnnouncement()

      this.authService.filterStudents(this.dept_id, this.gradelvl_id, this.section_id).subscribe((data:any) => {
        this.studentsCounts = data.students.length
        console.log('count', this.studentsCounts)
      })

    });
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 

      const teacherId = userData.teacher_id

      this.authService.getAssignments(teacherId).subscribe(
        (data : any []) => {
          this.assignedSubjectsCount = data.length;

        },
        (error) => {
          console.error('Error fetching assigned data:', error);
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
}
