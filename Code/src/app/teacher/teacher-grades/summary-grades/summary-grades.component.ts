import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-summary-grades',
  templateUrl: './summary-grades.component.html',
  styleUrls: ['./summary-grades.component.css']
})
export class SummaryGradesComponent {

  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  assignmentId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;
  subjects: any[] = [];
  students: any[] = [];
  quarters: any[]=[]
  selectedQuarter: number;
  studentAverages: string[] = []
  isSortingAZ: boolean = true; 

  constructor(private route: ActivatedRoute, private authService: AuthService, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit():void{
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      


    });

    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;

        
      },
      (error) => {
        console.error('Error fetching subject name:');
      }
    );
    this.authService.getGradeLevelById(this.gradeLevelId).subscribe(
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
    this.authService.getSubjectsByDeptGL(this.deptId, this.gradeLevelId).subscribe(
      (subjectsData: any) => {
        this.subjects = subjectsData.subjects; 
        console.log('subjects',this.subjects)
      },
      (error) => {
        console.error('Error fetching subjects:');
      }
    );
    
    this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
      (studentsData: any) => {
        this.students = studentsData.students;
        

        this.authService.getQuarters().subscribe((quartersData) => {
          this.quarters = quartersData;
          if (this.quarters && this.quarters.length > 0) {
            this.selectedQuarter = this.quarters[0].quarter_id;

            this.students.forEach(student => {

              this.subjects.forEach(subject => {
                this.authService.getStudentGradesByParams(this.gradeLevelId,this.sectionId,subject.subject_id,this.selectedQuarter).subscribe(
                  (gradesData: any) => {
                    const quarterlyGrade = gradesData.find(grade => grade.student === student.id);
                    if (quarterlyGrade) {
                      student[subject.subject_id] = quarterlyGrade.quarterly_grade;                      
                    } else {
                      student[subject.subject_id] = '-';
                    }

                    if (subject === this.subjects[this.subjects.length - 1]) {
                      this.calculateAverage(student);
                    }

                  },
                  (error) => {
                    console.error(`Error fetching grades for student ${student.student_id} in subject ${subject.subject_id}:`);
                  }
                );
              });
            });
          }
        }, (error) => {
          console.error('Error fetching quarters:');
        })
        
      },
      (error) => {
        console.error('Error fetching students:');
      }
    );
  }
  calculateAverage(student: any): void {
    if (!student) {
      return;
    }
  
    let total = 0;
    let count = 0;
  
    this.subjects.forEach(subject => {
      const grade = student[subject.subject_id];
      if (grade !== '-' && !isNaN(parseFloat(grade))) {
        total += parseFloat(grade);
        count++;
      }
    });
  
    if (count > 0) {
      const average = total / count;
      student.average = average.toFixed(2);
      // student.average = Math.round(average);
      const backgroundColor = this.getRank(parseFloat(student.average));
      student.backgroundColor = backgroundColor;
      
      const studentAverage = {
        student: student.id,
        gradelevel: this.gradeLevelId,
        section: this.sectionId,
        subject: this.subjectId,
        quarter: this.selectedQuarter,
        average: student.average
      };
      
      this.authService.fetchAverage(studentAverage).subscribe((existingAverageData) => {

        if (existingAverageData && existingAverageData.length > 0) {
          const aveId = existingAverageData[0].id;
          student.aveId = aveId;
            this.authService.updateAverage(aveId, studentAverage).subscribe((data) => {

            });
        } else {
          this.authService.addStudentAverage(studentAverage).subscribe((data) => {
            student.aveId = data.id;

          });
        }
      });
    } else {
      student.average = '-';
    }
  }
  
  
  
  getRank(average: number): string {
    if (average >= 90 && average <= 94.99) {
      return 'lightyellow';
    } else if (average >= 95 && average <= 97.99) {
      return 'greenyellow';
    } else if (average >= 98 && average <= 100) {
      return 'Yellow';
    } else {
      return 'transparent';
    }
  }
  
  
  
  onQuarterChange(){
    if(this.selectedQuarter){
      this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
        (studentsData: any) => {
          this.students = studentsData.students;
          this.students.forEach(student => {
  
            this.subjects.forEach(subject => {
              this.authService.getStudentGradesByParams(this.gradeLevelId,this.sectionId,subject.subject_id,this.selectedQuarter).subscribe(
                (gradesData: any) => {
                  const quarterlyGrade = gradesData.find(grade => grade.student === student.id);
                  if (quarterlyGrade) {
                    student[subject.subject_id] = quarterlyGrade.quarterly_grade;                      
                  } else {
                    student[subject.subject_id] = '-';
                  }

                  this.calculateAverage(student);

                },
                (error) => {
                  console.error(`Error fetching grades for student ${student.student_id} in subject ${subject.subject_id}:`, error);
                }
              );
            });
          });
  
          
          
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      );
    }
  }
  toggleSortOrder() {
    this.isSortingAZ = !this.isSortingAZ; 
  
    if (this.isSortingAZ) {
      this.students.sort((a, b) => {
        return a.lname.localeCompare(b.lname); 
      });
    } else {
      this.students.sort((a, b) => {
        return b.lname.localeCompare(a.lname); 
      });
    }
  }
}

