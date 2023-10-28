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

  barChart: Chart;
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
          this.fetchAllAverage()
          
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      )


    });
  }
  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);
    this.withHonorsCount = 0;
    this.withHighHonorsCount = 0;
    this.withHighestHonorsCount = 0;
    this.fetchAllAverage()

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
  fetchAllAverage(){
    const filters = {
      gradelevel: this.gradelvlId,
      section: this.sectionId,
      quarter: this.selectedQuarter
    };

    this.authService.fetchAllAverage(filters).subscribe(
      (data)=>{
        console.log('student average', data)
        this.withHonorsCount = 0;
        this.withHighHonorsCount = 0;
        this.withHighestHonorsCount = 0;

        let totalStudentCount = 0;
        data.forEach((student: any) => {
          totalStudentCount++;

          const average = parseFloat(student.average);
          
  
          if (average >= 90 && average <= 94) {
            this.withHonorsCount++;
          } else if (average >= 95 && average <= 97) {
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
}


