import { Component, OnInit,ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-subject-analytics',
  templateUrl: './subject-analytics.component.html',
  styleUrls: ['./subject-analytics.component.css']
})
export class SubjectAnalyticsComponent implements OnInit{
  
  deptId: number;
  user: any;
  studentId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  subjectName: string
  selectedQuarter: number;
  quarters: any[]=[]
  initialGrade: number = 0;
  weeklyProgress: any[] = [];
  constructor(private route: ActivatedRoute, private authService: AuthService, private el: ElementRef, private renderer: Renderer2){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));

      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
  
    });
    
    
    this.authService.getStudentProfile().subscribe((userData: any) => {
      this.user = userData;
      this.studentId = userData.student_id;
      
      this.authService.getSubjectById(this.subjectId).subscribe(
        (subjectData: any) => {
          this.subjectName = subjectData.subjects[0].subject_name;
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
          this.fetchStudentRawScores();
          this.getWeeklyProgress()
          this.createWeeklyProgressChart();
          
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      )

    });
      }

  onQuarterChange(){

    if(this.selectedQuarter){
          this.fetchStudentRawScores()
    }
  }

  fetchStudentRawScores() {


    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter,
      student: this.studentId
    };
  
    this.authService.fetchIndivStudentGrades(filters).subscribe(
      (data) => {
        console.log('Raw Scores Data:', data);
        this.initialGrade = parseFloat(data[0].initial_grade);
        console.log(this.initialGrade)
        this.convertToPerspectiveGrade(this.initialGrade)

  
      },
      (error) => {
        console.error('Error fetching student raw scores:', error);
      }
    );
  }

  convertToPerspectiveGrade(initialGrade: number): number {
    console.log(this.initialGrade)
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
  

  getWeeklyProgress() {

    this.authService.getStudentWeeklyProgress(this.gradeLevelId,this.sectionId,this.subjectId,this.selectedQuarter).subscribe(
      (response: any) => {
        console.log('weekly progress',response)
        this.weeklyProgress = response
        this.createWeeklyProgressChart()
      },
      (error) => {
          console.error('Error fetching Weekly Progress:', error);
      }
    );
  }

  createWeeklyProgressChart(): void {
    if (!this.weeklyProgress || this.weeklyProgress.length === 0) {
      return;
    }
  
    const ctx = this.el.nativeElement.querySelector('#weeklyProgressChart');
    
    const taskNames = this.weeklyProgress.map(item => item.task_name);
    const taskScores = this.weeklyProgress.map(item => {
      const score = item.task_score.split('/');
      return parseFloat(score[0]);
    });
  
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: taskNames,
        datasets: [{
          label: 'Task Scores',
          data: taskScores,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1,
          borderColor: '#1B59F8',
          pointRadius: 4,
          tension: 0.4,
          
        }]
      },
      options: {

        scales: {
          y: {
            beginAtZero: true,
            max: 10,

            ticks: {
              font: {
                family: 'Poppins', 
                size: 14, 
              }
            }
          },
          x: {

            ticks: {
              font: {
                family: 'Poppins', 
                size: 14, 
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            title: {
              text: 'Task Scores',
              font: {
                family: 'Poppins', 
                size: 14, 
              }
            },
            labels: {
              font: {
                family: 'Poppins', 
                size: 14,
               
              }
            }
          }
        }
      }
    });
  }
  getCircleColor(grade: number){
    return grade < 75 ? '#ff0e0e' : '#78C000' 
  }
  getInnerCircleColor(grade: number){
    return grade < 75 ? '#fcc0c0' : '#C7E596' 
  }
  
}