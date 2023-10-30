import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-teacher-analytics',
  templateUrl: './teacher-analytics.component.html',
  styleUrls: ['./teacher-analytics.component.css']
})
export class TeacherAnalyticsComponent {
  assignedSubjects: any[] = [];
  user: any;
  gradelvlId: number;
  sectionId: number;
  gradeLevelName: string;
  sectionName: string;
  deptId: number
  selectedQuarter: number;
  quarters: any[]=[]
  withHonorsCount: number = 0;
  withHighHonorsCount: number = 0;
  withHighestHonorsCount: number = 0;
  subjects: any[] = [];
  subjectId: number;
  barChart: Chart;
  studentGrades: any[] = [];
  chart: any;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit():void{
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      this.gradelvlId = userData.gradelvl_id
      this.sectionId = userData.section_id
      this.deptId = userData.dept_id

      const teacherId = userData.teacher_id

      this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe(
        (subjectData: any) => {
          this.subjects = subjectData.subjects;
          if (this.subjects.length > 0) {
            this.subjectId = this.subjects[0].subject_id;
          }
        },
        (error) => {
          console.error('Error fetching subject name:');
        }
      );

      this.authService.getGradeLevelById(this.gradelvlId).subscribe(
        (gradeLevelData: any) => {
          this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
        },
        (error) => {
          console.error('Error fetching grade level name:');
        }
      );

      this.authService.getSectionById(this.sectionId).subscribe(
        (sectionData: any) => {
          this.sectionName = sectionData.sections[0].section_name;
        },
        (error) => {
          console.error('Error fetching section name:');
        }
      );

      this.authService.getQuarters().subscribe((quartersData) => {
        this.quarters = quartersData;

        
          if (this.quarters && this.quarters.length > 0) {
          this.selectedQuarter = this.quarters[0].quarter_id;
          }
          this.fetchStudentGrades()
          this.fetchAllAverage()
          
        },
        (error) => {
          console.error('Error fetching students:');
        }
      )


    });
  }
  onQuarterChange(){
    this.withHonorsCount = 0;
    this.withHighHonorsCount = 0;
    this.withHighestHonorsCount = 0;
    this.fetchAllAverage()
    this.fetchStudentGrades()

  }

  fetchStudentGrades(){
    const filters = {
      gradelevel: this.gradelvlId,
      section: this.sectionId,
      quarter: this.selectedQuarter
    };

    this.authService.fetchAllStudentGrades(filters).subscribe(
      (data) => {
        this.studentGrades = data;

        const passCounts = {};
        const failCounts = {};

        for (const subject of this.subjects) {
          passCounts[subject.subject_id] = 0;
          failCounts[subject.subject_id] = 0;
        }

        for (const grade of this.studentGrades) {
          const subjectId = grade.subject;

          const gradeValue = parseFloat(grade.initial_grade);

          if (gradeValue >= 75) {
            passCounts[subjectId]++;
          } else {
            failCounts[subjectId]++;
          }
        }


        this.createDoubleBarGraph(passCounts, failCounts);


      }
    )
  }

  fetchAllAverage(){
    const filters = {
      gradelevel: this.gradelvlId,
      section: this.sectionId,
      quarter: this.selectedQuarter
    };

    this.authService.fetchAllAverage(filters).subscribe(
      (data)=>{
        this.withHonorsCount = 0;
        this.withHighHonorsCount = 0;
        this.withHighestHonorsCount = 0;

        let totalStudentCount = 0;
        data.forEach((student: any) => {
          totalStudentCount++;

          const average = parseFloat(student.average);
          
  
          if (average >= 90 && average <= 94.99) {
            this.withHonorsCount++;
          } else if (average >= 95 && average <= 97.99) {
            this.withHighHonorsCount++;
          } else if (average >= 98 && average <= 100) {
            this.withHighestHonorsCount++;
          }else if (average >= 98 && average <= 100) {
            this.withHighestHonorsCount++;
          }
        });
        this.createAverageBarChart(totalStudentCount)
      }
    )
  }

  createAverageBarChart(totalStudentCount: number){
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
          text: 'Academic Excellence',
          color: '#000'
        },
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
          max: totalStudentCount,
          ticks:{
            font: fontOptions1,
            color: '#000'
          }
        },
      },
    };
    
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['With Honors', 'With High Honors', 'With Highest Honors'],
        datasets: [
          {
            label: 'Student Counts',
            data: [this.withHonorsCount, this.withHighHonorsCount, this.withHighestHonorsCount],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)',],
          },
        ],
      },
      options: chartOptions,
    });
  }

  createDoubleBarGraph(passCounts, failCounts){
    const subjectNames = this.subjects.map((subject) => subject.subject_name);
    const passData = this.subjects.map((subject) => passCounts[subject.subject_id]);
    const failData = this.subjects.map((subject) => failCounts[subject.subject_id]);

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart ('studentGradesChart', {
      type: 'bar',
      data: {
        labels: subjectNames,
        datasets: [
          {
            label: 'Pass',
            data: passData,
            backgroundColor:'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Fail',
            data: failData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    } as any)
  }
}


