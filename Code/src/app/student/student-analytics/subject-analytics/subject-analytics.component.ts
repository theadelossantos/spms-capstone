import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-subject-analytics',
  templateUrl: './subject-analytics.component.html',
  styleUrls: ['./subject-analytics.component.css']
})
export class SubjectAnalyticsComponent implements OnInit{
  @ViewChild('rawScoreChart') rawScoreChart: ElementRef;

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
  rawScores: any[] = [];
  hps: any = {};
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
  fetchHPS(){
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };
    
    this.authService.fetchHPSscores(filters).subscribe((data)=>{
      console.log('hps',data)
      this.hps = data[0];

    })
  }

  fetchStudentRawScores() {
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter,
      student: this.studentId,
    };
  
    this.authService.fetchIndivStudentGrades(filters).subscribe(
      (rawScoreData) => {
        const hpsFilters = {
          gradelevel: this.gradeLevelId,
          section: this.sectionId,
          subject: this.subjectId,
          quarter: this.selectedQuarter,
        };
        console.log(rawScoreData)
        this.initialGrade = rawScoreData[0].initial_grade
        console.log('initial grade', this.initialGrade)
        this.convertToPerspectiveGrade(this.initialGrade)
  
        this.authService.fetchHPSscores(hpsFilters).subscribe(
          (hpsData) => {
            if (rawScoreData.length > 0 && hpsData.length > 0) {
              const rawScoreNames = [];
              const rawScorePercentages = [];
  
              for (let i = 1; i <= 10; i++) {
                const wwScoreKey = `ww_score_${i}`;
                const ptScoreKey = `pt_score_${i}`;
                const hpsWWKey = `hps_ww_${i}`;
                const hpsPTKey = `hps_pt_${i}`;
                const wwName = `ww_score_${i}_name`
                const ptName = `pt_score_${i}_name`
                console.log(`WW Score Key: ${wwScoreKey}, HPS WW Key: ${hpsWWKey}`);
                console.log(`PT Score Key: ${ptScoreKey}, HPS PT Key: ${hpsPTKey}`);
  
                if (rawScoreData[0][wwScoreKey] !== null && hpsData[0][hpsWWKey] !== null) {
                  const rawScore = parseFloat(rawScoreData[0][wwScoreKey]);
                  const hpsScore = parseFloat(hpsData[0][hpsWWKey]);
                  const percentage = (rawScore / hpsScore) * 100;
                  rawScoreNames.push(rawScoreData[0][wwName]);
                  rawScorePercentages.push(percentage);
                }
  
                if (rawScoreData[0][ptScoreKey] !== null && hpsData[0][hpsPTKey] !== null) {
                  const rawScore = parseFloat(rawScoreData[0][ptScoreKey]);
                  const hpsScore = parseFloat(hpsData[0][hpsPTKey]);
                  const percentage = (rawScore / hpsScore) * 100;
                  rawScoreNames.push(rawScoreData[0][ptName]);
                  rawScorePercentages.push(percentage);
                }
              }
  
              const qaScoreKey = 'qa_score';
              const hpsQAKey = 'hps_qa_total_score';
              const qaName = `qa_score_name`

              console.log(`QA Score Key: ${qaScoreKey}, HPS QA Key: ${hpsQAKey}`);
              if (rawScoreData[0][qaScoreKey] !== null && hpsData[0][hpsQAKey] !== null) {
                const rawScore = parseFloat(rawScoreData[0][qaScoreKey]);
                const hpsScore = parseFloat(hpsData[0][hpsQAKey]);
                const percentage = (rawScore / hpsScore) * 100;
                rawScoreNames.push(rawScoreData[0][qaName]);
                rawScorePercentages.push(percentage);
              }
  
              console.log('Raw Score Names:', rawScoreNames);
              console.log('Raw Score Percentages:', rawScorePercentages);
  
              this.createRawScoreChart(rawScoreNames, rawScorePercentages);
            } else {
              console.log('No data available.');
            }
          },
          (hpsError) => {
            console.error('Error fetching HPS scores:', hpsError);
          }
        );
      },
      (rawScoreError) => {
        console.error('Error fetching student raw scores:', rawScoreError);
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
  
  
  createRawScoreChart(rawScoreNames, rawScorePercentages) {
    const ctx = this.rawScoreChart.nativeElement;
  
    if (this.rawScoreChart && this.rawScoreChart.nativeElement) {
      const canvasElement = this.rawScoreChart.nativeElement;
      const chart = Chart.getChart(canvasElement);
      if (chart) {
        chart.destroy();
      }
    }
    const fontOptions1 = {
      family: 'Poppins',
      size: 12,
    };
    const fontOptions2 = {
      family: 'Poppins',
      size: 17,
    };
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: rawScoreNames,
        datasets: [
          {
            label: 'Percentage Scores',
            data: rawScorePercentages, 
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
            borderColor: '#1B59F8',
            pointRadius: 4,
            pointBackgroundColor:'rgba(54, 162, 235)',
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: fontOptions1,
            },
          },
          title: {
            font: fontOptions2,
            display: true,
            text: 'Student Performance',
            color: '#000'
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max:100,
            ticks: {
              color: '#000',
              font: {
                family: 'Poppins',
                size: 14,
                
              },
            },
          },
          x: {
            ticks: {
              font: {
                family: 'Poppins',
                size: 14,
              },
            },
          },
        },
        
      },
    });
  }
  

  
  
  getCircleColor(grade: number){
    return grade < 75 ? '#ff0e0e' : '#78C000' 
  }
  getInnerCircleColor(grade: number){
    return grade < 75 ? '#fcc0c0' : '#C7E596' 
  }
  
}