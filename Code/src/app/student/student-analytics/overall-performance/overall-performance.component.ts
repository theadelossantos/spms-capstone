import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Chart } from 'chart.js';
import { filter } from 'rxjs';
@Component({
  selector: 'app-overall-performance',
  templateUrl: './overall-performance.component.html',
  styleUrls: ['./overall-performance.component.css']
})
export class OverallPerformanceComponent {
  lineChart: Chart;
  user:any;
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
  weeklyProgress: any[] = [];
  subjectGrades: { [key: string]: number } = {};
  subjectName: string
  private honorPieChart: Chart | undefined;


  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.studentId = Number(params.get('studentId'));
      console.log('Student:', this.studentId);
    });
    
    this.authService.getStudentProfile().subscribe(
      (userData: any) => {
        console.log(userData)
        this.user = userData

        this.studentId = userData.student_id
        this.deptId = userData.dept_id
        this.gradelvlId = userData.gradelvl_id
        this.sectionId = userData.section_id
        this.gradelvlId = userData.gradelvl_id

        this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe(
          (subjectData: any) => {
            this.subjects = subjectData.subjects;
            if (this.subjects.length > 0) {
              this.subjectId = this.subjects[0].subject_id;
            }
            console.log('Subjects:', this.subjects);
          },
          (error) => {
            console.error('Error fetching subject name:', error);
          }
        );
        this.authService.getQuarters().subscribe((quartersData) => {
          this.quarters = quartersData;
    
            if (this.quarters && this.quarters.length > 0) {
            this.selectedQuarter = this.quarters[0].quarter_id;
            console.log('Selected Quarter ID:', this.selectedQuarter);
            }
            for (const subject of this.subjects) {
              this.fetchStudentRawScoresForSubject(subject);
            }   
          },
          (error) => {
            console.error('Error fetching students:', error);
          }
        )
       

    },
    (error) => {
      console.error('Error fetching grade level name:', error);
    }
      
    );

    
  }
  onQuarterChange(){
    if(this.selectedQuarter){
      for (const subject of this.subjects) {
        this.fetchStudentRawScoresForSubject(subject);
      }    
    }
  }
  fetchStudentRawScoresForSubject(subject: any) {
    const filters = {
      gradelevel: this.gradelvlId,
      section: this.sectionId,
      subject: subject.subject_id,
      quarter: this.selectedQuarter,
      student: this.studentId
    };

    this.authService.fetchIndivStudentGrades(filters).subscribe(
      (data) => {
        console.log('Raw Scores Data:', data);
        if (data.length > 0){
          const initialGrade = parseFloat(data[0].initial_grade);
          console.log('grade',initialGrade);
  
          this.subjectGrades[subject.subject_id] = this.convertToPerspectiveGrade(initialGrade);
        }else{
          this.subjectGrades[subject.subject_id] = 0
        }
        const overallAverage = this.getOverallAverage();
        console.log('Overall Average:', overallAverage);

        this.generateHonorPieChart();
        this.createLineChart()
      },
      (error) => {
        console.error('Error fetching student raw scores:', error);
      }
    );
  }

  convertToPerspectiveGrade(initialGrade: number): number {
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
  
  generateHonorPieChart() {
    const overallAverage = this.getOverallAverage();
    console.log('ovaverage', overallAverage);
    
    const withHonorMin = 90;
    const withHighHonorMin = 95;
    const withHighestHonorMin = 98;
    
    const labels = [];
    const dataValues = [];
    let currentAverageColor = 'lightgray';
    
    if (overallAverage >= withHonorMin && overallAverage < withHighHonorMin) {
      labels.push('Current Average', 'With High Honor', 'With Highest Honor');
      dataValues.push(overallAverage, withHighHonorMin - overallAverage, 100 - withHighHonorMin);
      currentAverageColor = 'yellowgreen';
    } else if (overallAverage >= withHighHonorMin && overallAverage < withHighestHonorMin) {
      labels.push('Current Average', 'With Highest Honor');
      dataValues.push(overallAverage, 100 - overallAverage);
      currentAverageColor = 'green';
    } else if (overallAverage >= withHighestHonorMin) {
      labels.push('Current Average', 'With Highest Honor');
      dataValues.push(overallAverage, 100 - overallAverage);
      currentAverageColor = 'green';
    } else {
      labels.push('Current Average', 'With Honor', 'With High Honor', 'With Highest Honor');
      dataValues.push(overallAverage, withHonorMin - overallAverage, withHighHonorMin - withHonorMin, withHighestHonorMin - withHighHonorMin);
      currentAverageColor = 'orange';
    }
    
    const backgroundColors = [currentAverageColor, 'yellow', 'yellowgreen', 'green'];
    
    const data = {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
      }],
    };
    
    const ctx = document.getElementById('honorPieChart') as HTMLCanvasElement;
    
    if (this.honorPieChart) {
      this.honorPieChart.destroy();
    }
    
    this.honorPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        legend: {
          display: true,
        },
        plugins:{
          title: {
            font: {
              family:'Poppins',
              size: 17
            },
            display: true,
            text: 'Average Status',
            color: '#000'
          },
        }

      },
      
    } as any);
  }

  createLineChart() {
    if (this.subjects.length > 0) {
      const subjectNames = this.subjects.map((subject) => subject.subject_name);
      const initialGrades = this.subjects.map((subject) => {
        return this.subjectGrades[subject.subject_id];
      });
  
      console.log('Subject Names:', subjectNames);
      console.log('Initial Grades:', initialGrades);
  
      if (this.lineChart) {
        this.lineChart.destroy();
      }
  
      const ctx = document.getElementById('subjectLineChart') as HTMLCanvasElement;
      const fontOptions1 = {
        family: 'Poppins',
        size: 12,
      };
      const fontOptions2 = {
        family: 'Poppins',
        size: 17,
      };
      const chartOptions = {
        plugins: {
          legend: {
            labels: {
              font: fontOptions1,
            },
          },
          title: {
            font: fontOptions2,
            display: true,
            text: 'Subject Grades',
            color: '#000'
          },
          responsive: true,
        },
        scales: {
          x: {
            ticks: {
              font: fontOptions1,
              color: '#000'
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks:{
              font: fontOptions1,
              color: '#000'
            }
          },
        },
      };
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: subjectNames,
          datasets: [
            {
              label: 'Subject Grades',
              data: initialGrades,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              fill: true,
              pointBackgroundColor:'rgba(54, 162, 235)',
              tension: 0.4,
            },
          ],
        },
        options: chartOptions
      });
    } else {
      console.log('No subjects data available.');
    }
  }
  
}



