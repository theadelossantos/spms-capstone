import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
interface Student {
  id: number;
  fname: string;
  lname: string;
  ww_scores: number[]; // Add this line to define the property
  totalWrittenWorkRS: number;
}


@Component({
  selector: 'app-section-grades',
  templateUrl: './section-grades.component.html',
  styleUrls: ['./section-grades.component.css']
})

export class SectionGradesComponent {

  
  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;
  students: Student[] = [];
  i: number;
  writtenWorkHPS: string[] = Array(10).fill(""); 
  performanceTaskHPS: string[] = Array(10).fill(""); 
  ww_scores: number[][] = Array(10).fill([]).map(() => Array(this.students.length).fill(0));
  
  
  totalWrittenWorkHPS: number = 0;
  totalPerformanceTaskHPS: number = 0;
  totalWrittenWorkRS: number = 0;


  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      const assignmentId = params.get('assignmentId');
      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
      console.log('Assignment ID:', assignmentId);

    });
    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;
      },
      (error) => {
        console.error('Error fetching subject name:', error);
      }
    );
    this.authService.getGradeLevelById(this.gradeLevelId).subscribe(
      (gradeLevelData: any) => {
       this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
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
    this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
      (studentsData: any) => {
        this.students = studentsData.students;
        console.log(this.students)

        this.students.forEach((student:any) => {
          const lastName = student.lname;
          const firstName = student.fname;

          console.log(`Last Name: ${lastName}, First Name: ${firstName}`);

        })
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    )
  }
  calculateTotalWW(student:any){

    const wwScores = [...Array(10).keys()].map((i) => {
      const score = parseFloat(student[`ww_score_${i + 1}`]) || 0;
      return isNaN(score) ? 0 : score;
    });
  
    const totalWW = wwScores.reduce((acc, score) => acc + score, 0);
    student.total_ww_score = totalWW;
  }
  calculateTotalhps(student: any) {
    const totalHPS = student.hps_scores.reduce((acc, score) => acc + score, 0);
    student.total_hps_score = totalHPS;
  }
  
  getTotalHPS(hps: number[]) {
    return hps.reduce((total, score) => total + score, 0);
}

updateTotalWrittenWorkHPS() {
  this.totalWrittenWorkHPS = this.writtenWorkHPS.reduce((total, hps) => {
    const hpsValue = hps !== "" ? parseInt(hps, 10) : 0;
    return total + hpsValue;
  }, 0);
}

updateTotalPerformanceTaskHPS() {
  this.totalPerformanceTaskHPS = this.performanceTaskHPS.reduce((total, hps) => {
    const hpsValue = hps !== "" ? parseInt(hps, 10) : 0;
    return total + hpsValue;
  }, 0);
}
updateWrittenWorkRS(studentIndex: number) {
  const ww_rsValue = this.ww_scores.map((ww_scoresRow) => {
    return ww_scoresRow[studentIndex]; 
  }).reduce((acc, score) => {
    const parsedScore = typeof score === 'string' && score !== '' ? parseInt(score, 10) : 0;
    return acc + parsedScore;
  }, 0);

  this.students[studentIndex].totalWrittenWorkRS = ww_rsValue;
}






onSubmit(){
  
}
  
}
