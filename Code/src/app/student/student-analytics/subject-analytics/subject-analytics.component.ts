import { Component, OnInit, } from '@angular/core';
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

  constructor(private route: ActivatedRoute, private authService: AuthService){}

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
        console.log('quarters', this.quarters);
  
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
    
    this.fetchStudentRawScores()
  }

  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);

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
  
      },
      (error) => {
        console.error('Error fetching student raw scores:', error);
      }
    );
  }

  
}
