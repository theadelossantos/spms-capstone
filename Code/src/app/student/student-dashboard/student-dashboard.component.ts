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
