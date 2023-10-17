import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Chart, LinearScale, Title } from 'chart.js';

@Component({
  selector: 'app-quarterly-performance',
  templateUrl: './quarterly-performance.component.html',
  styleUrls: ['./quarterly-performance.component.css']
})
export class QuarterlyPerformanceComponent {
  studentId: number
  studentfname: string;
  studentlname: string;
  deptId:number;
  gradelvlId: number;
  sectionId: number;
  subjects: any[] = [];
  subjectId: number;
  quarters: any[]=[]
  selectedQuarter: number;
  initialGrade: number = 0;
  subjectGrades: { [key: string]: number } = {};
  quarterlyAverages: { [quarterId: number]: number } = {};

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.studentId = Number(params.get('studentId'));
      console.log('Student:', this.studentId);
    });
    
    this.authService.getStudentById(this.studentId).subscribe(
      (studentName: any) => {
        console.log(studentName)
       this.studentfname = studentName.student.fname;
       this.studentlname = studentName.student.lname;
       this.deptId = studentName.student.dept_id;
       this.gradelvlId = studentName.student.gradelvl_id;
       this.sectionId = studentName.student.section_id;


       this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe((response) => {
        this.subjects = response.subjects;
        if (this.subjects.length > 0) {
          this.subjectId = this.subjects[0].subject_id;
        }
        console.log('Subjects:', this.subjects);

        this.authService.getQuarters().subscribe((quartersData) => {
          this.quarters = quartersData;
    
            if (this.quarters && this.quarters.length > 0) {
            this.selectedQuarter = this.quarters[0].quarter_id;
            console.log('Selected Quarter ID:', this.selectedQuarter);
            }
            this.fetchStudentRawScoresForSubject();

            
          },
          (error) => {
            console.error('Error fetching students:', error);
          }
        )

      });
      },
      (error) => {
        console.error('Error fetching grade level name:', error);
      }
      
    );
  }

  fetchStudentRawScoresForSubject() {
    for (const quarter of this.quarters) {
      const subjectGradesForQuarter = [];
  
      for (const subject of this.subjects) {
        const filters = {
          gradelevel: this.gradelvlId,
          section: this.sectionId,
          subject: subject.subject_id,
          quarter: quarter.quarter_id,
          student: this.studentId,
        };
  
        this.authService.fetchIndivStudentGrades(filters).subscribe(
          (data) => {
            if (data.length > 0) {
              const initialGrade = parseFloat(data[0].initial_grade);
              const perspectiveGrade = this.convertToPerspectiveGrade(initialGrade);
  
              this.subjectGrades[`${quarter.quarter_id}_${subject.subject_id}`] = perspectiveGrade;
              subjectGradesForQuarter.push(perspectiveGrade);
            }
  
            if (subjectGradesForQuarter.length === this.subjects.length) {
              const sum = subjectGradesForQuarter.reduce((acc, grade) => acc + grade, 0);
              this.quarterlyAverages[quarter.quarter_id] = Math.round(sum / subjectGradesForQuarter.length);
  
              this.updateLineChart();
            }
          },
          (error) => {
            console.error('Error fetching student raw scores:', error);
          }
        );
      }
    }
  }

  computeQuarterlyAverage(quarterData: { [subject: string]: number }): number {
    const subjectAverages = Object.values(quarterData);
    const sum = subjectAverages.reduce((acc, average) => acc + average, 0);
    return subjectAverages.length > 0 ? Math.round(sum / subjectAverages.length) : 0;
}

  @ViewChild('lineChart') lineChart: ElementRef;

  updateLineChart() {
    const labels = Object.keys(this.quarterlyAverages).map((quarterId) => `Quarter ${quarterId}`);
    const data = Object.values(this.quarterlyAverages);

    if (data.length === 0) {
      return;
    }

    const canvas: any = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const existingChart = canvas.chart;

    if (existingChart) {
      existingChart.destroy();
    }

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Quarterly Average',
            data: data,
            borderColor: '#1B59F8',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: true,
            pointRadius: 4,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            suggestedMin:50,
            suggestedMax:100
          },
        },
      },
    });

    canvas.chart = newChart;
  }
  

  convertToPerspectiveGrade(initialGrade: number): number {
    // console.log(this.initialGrade)
    if (initialGrade >= 100) return 100;
    if (initialGrade >= 98.4) return 99;
    if (initialGrade >= 96.8) return 98;
    if (initialGrade >= 95.2) return 97;
    if (initialGrade >= 93.6) return 96;
    if (initialGrade >= 92) return 95;
    if (initialGrade >= 90.4) return 94;
    if (initialGrade >= 88.8) return 93;
    if (initialGrade >= 87.2) return 92;
    if (initialGrade >= 85.6) return 91;
    if (initialGrade >= 84) return 90;
    if (initialGrade >= 82.4) return 89;
    if (initialGrade >= 80.8) return 88;
    if (initialGrade >= 79.2) return 87;
    if (initialGrade >= 77.6) return 86;
    if (initialGrade >= 76) return 85;
    if (initialGrade >= 74.4) return 84;
    if (initialGrade >= 72.8) return 83;
    if (initialGrade >= 71.2) return 82;
    if (initialGrade >= 69.6) return 81;
    if (initialGrade >= 68) return 80;
    if (initialGrade >= 66.4) return 79;
    if (initialGrade >= 64.8) return 78;
    if (initialGrade >= 63.2) return 77;
    if (initialGrade >= 61.6) return 76;
    if (initialGrade >= 60) return 75;
    if (initialGrade >= 56) return 74;
    if (initialGrade >= 52) return 73;
    if (initialGrade >= 48) return 72;
    if (initialGrade >= 44) return 71;
    if (initialGrade >= 40) return 70;
    if (initialGrade >= 36) return 69;
    if (initialGrade >= 32) return 68;
    if (initialGrade >= 28) return 67;
    if (initialGrade >= 24) return 66;
    if (initialGrade >= 20) return 65;
    if (initialGrade >= 16) return 64;
    if (initialGrade >= 12) return 63;
    if (initialGrade >= 8) return 62;
    if (initialGrade >= 4) return 61;
    return 60;
  }
  getCircleColor(grade: number){
    return grade < 75 ? '#ff0e0e' : '#78C000' 
  }
  getInnerCircleColor(grade: number){
    return grade < 75 ? '#fcc0c0' : '#C7E596' 
  }
  getOverallAverage(): number {
    const totalGrades = Object.values(this.subjectGrades);
    const sum = totalGrades.reduce((acc, grade) => acc + grade, 0);
    return totalGrades.length > 0 ? Math.round(sum / totalGrades.length) : 0;
  }

  getHonorQualificationProgress(){
    const overallAverage = this.getOverallAverage();
    const honorRollThreshold = 90;

    if(overallAverage >= honorRollThreshold){
      return 0
    }
    else{
      return honorRollThreshold - overallAverage
    }
  }
}
