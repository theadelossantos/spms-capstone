import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-student-grades',
  templateUrl: './student-grades.component.html',
  styleUrls: ['./student-grades.component.css']
})
export class StudentGradesComponent implements OnInit {
  subjects: any[] = [];
  user: any;
  deptId: number;
  gradelvlId: number;
  sectionId: number;
  subjectId: number;
  studentId: number;
  quarters: any[] = [];
  studentGrades: any[][] = [];
  generalAverage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getStudentProfile().subscribe((userData: any) => {
      this.user = userData;
      this.studentId = userData.student_id;
      this.deptId = userData.dept_id;
      this.gradelvlId = userData.gradelvl_id;
      this.sectionId = userData.section_id;

      this.authService.getSubjectsByDeptGL(this.deptId, this.gradelvlId).subscribe((response) => {
        this.subjects = response.subjects;
        if (this.subjects.length > 0) {
          this.subjectId = this.subjects[0].subject_id;
        }
      });

      this.authService.getQuarters().subscribe((quartersData) => {
        this.quarters = quartersData;

        const fetchGradeObservables = [];

        for (const subject of this.subjects) {
          const subjectId = subject.subject_id;
          const gradesRow = [];

          for (const quarter of this.quarters) {
            fetchGradeObservables.push(
              this.authService.getStudentGrades(this.studentId, subjectId, quarter.quarter_id).pipe(
                map((gradeData) => {
                  return {
                    subjectId,
                    quarterId: quarter.quarter_id,
                    gradeData
                  };
                })
              )
            );
          }
        }

        forkJoin(fetchGradeObservables).subscribe(
          (results) => {
            for (const result of results) {
              const subjectIndex = this.subjects.findIndex((subject) => subject.subject_id === result.subjectId);
              const quarterIndex = this.quarters.findIndex((quarter) => quarter.quarter_id === result.quarterId);
              if (subjectIndex !== -1 && quarterIndex !== -1) {
                if (!this.studentGrades[subjectIndex]) {
                  this.studentGrades[subjectIndex] = [];
                }
                this.studentGrades[subjectIndex][quarterIndex] = result.gradeData;
                this.calculateGeneralAverage();
              }
            }
          },
          (error) => {
            console.error('Error fetching grades:', error);
          },
          () => {
            console.log('Student Grades:', this.studentGrades);
          }
        );
      });
    });
  }

  getSubjectAverage(subjectGrades: any[]): string {
    if (!subjectGrades || !subjectGrades.length) {
      return 'N/A';
    }
  
    const allQuartersHaveGrades = subjectGrades.every((grade) => {
      return grade && grade[0]?.quarterly_grade !== undefined;
    });
  
    if (!allQuartersHaveGrades) {
      return '';
    }
  
    const quarterlyGrades = subjectGrades.map((grade) => parseFloat(grade[0]?.quarterly_grade) || 0);
    const sum = quarterlyGrades.reduce((acc, grade) => acc + grade, 0);
    const average = sum / quarterlyGrades.length;
    const roundedAverage = Math.round(average);
    
    console.log(roundedAverage.toString())
    return roundedAverage.toString();
  }
  
  calculateGeneralAverage() {
    let totalSubjectAverages = 0;
    let totalSubjectsWithGrades = 0;
  
    for (const subjectGrades of this.studentGrades) {
      const subjectAverage = parseFloat(this.getSubjectAverage(subjectGrades));
      if (!isNaN(subjectAverage)) {
        totalSubjectAverages += subjectAverage;
        totalSubjectsWithGrades++;
      }
    }
  
    const totalSubjects = this.studentGrades.length;
  
    if (totalSubjectsWithGrades === totalSubjects && totalSubjects > 0) {
      const generalAverage: number = totalSubjectAverages / totalSubjects;
      this.generalAverage = Math.round(generalAverage).toString();
      

    } else {
      this.generalAverage = '';
    }
  }
  
  getRemarks(grade: string): string {
    if (grade !== '') {
      const numericGrade = parseFloat(grade);
      if (!isNaN(numericGrade) && numericGrade >= 75) {
        return 'PASSED';
      } else {
        return 'FAILED';
      }
    }
    return '';
  }
  getQuarterAverages(): string[] {
    const quarterAverages: string[] = [];

    for (let i = 0; i < this.quarters.length; i++) {
        let totalQuarterAverage = 0;
        let totalSubjectsWithGrades = 0;

        for (const subjectGrades of this.studentGrades) {
            if (subjectGrades[i]) {
                const subjectAverage = parseFloat(subjectGrades[i][0]?.quarterly_grade);
                if (!isNaN(subjectAverage)) {
                    totalQuarterAverage += subjectAverage;
                    totalSubjectsWithGrades++;
                }
            }
        }

        if (totalSubjectsWithGrades > 0) {
            const average = totalQuarterAverage / totalSubjectsWithGrades;
            quarterAverages.push(Math.round(average).toString());
        } else {
            quarterAverages.push('');
        }
    }

    return quarterAverages;
}


  
  
}

  

