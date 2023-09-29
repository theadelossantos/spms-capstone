import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs';
interface Student {
  id: number;
  fname: string;
  lname: string;
  pt_scores: number[];
  ww_scores: number[];
  totalWrittenWorkRS: number;
  totalWrittenWorkWS: number;
  totalPerfTaskRS: number;
  totalPerfTaskWS: number;
  totalQaWS: number;
  totalQuarterlyAssessmentWS: number;
  initialGrade?: number;
  quarterlyGrade?: number;
  totalPTPercentage?: number;
  totalWWPercentage?: number;
  qa_score?: number;
  totalQAPercentage?: number;
  ww_weighted_score: number;
  initialTotalWrittenWorkRS?:number;
  quarter: number;
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
  quarters: any[]=[]
  i: number;
  writtenWorkHPS: number[] = new Array(10).fill(0);
  performanceTaskHPS: string[] = Array(10).fill(0); 
  pt_scores: number[][] = Array(10).fill([]).map(() => Array(this.students.length).fill(0));
  ww_scores: number[][] = Array(10).fill([]).map(() => Array(this.students.length).fill(0));

  selectedQuarter: number;
  weightedScores: number[] = [];
  
  totalWrittenWorkHPS: number = 0;
  totalWrittenWorkRS: number = 0;
  totalWrittenWorkWS: number = 0;

  totalPerformanceTaskHPS: number = 0;
  totalPerfTaskRS: number = 0;
  totalPerfTaskWS: number = 0;

  qa_scores: { [studentId: number]: number } = {};
  isSortingAZ: boolean = true; 

  selectedSubject: {
    subjectName: string;
    wwPercentage: number;
    ptPercentage: number;
    qaPercentage: number;
  } = {
    subjectName: '',
    wwPercentage: 0,
    ptPercentage: 0,
    qaPercentage: 0
  };;
  calculationWWPercentage:number =0;
  calculationPTPercentage: number = 0;
  calculationQAPercentage: number = 0;
  showRawScoreAlert = false;
  saveAlert = false;
  formData: any = {
    writtenWorkHPS: [null, null, null, null, null, null, null, null, null, null],
    totalWrittenWorkHPS: 0, 
    performanceTaskHPS: [null, null, null, null, null, null, null, null, null, null],
    totalPerformanceTaskHPS: 0,
    quarterlyAssessmentHPS: 0,
    ww_scores: [],
    totalWrittenWorkRS:0,
    totalWrittenWorkWS: 0,
    totalWWPercentage: 0,
    
    pt_scores:[],
    totalPerfTaskRS: 0,
    totalPTPercentage:0,
    totalPerfTaskWS: 0,
    qa_score: null,
    totalQAPercentage: 0,
    totalQuarterlyAssessmentWS:0,
    quarterlyGrade: null,
    initialGrade:null,
    
  };
  hpsValues: number[] = [];
  studentRawScores: any[] = []; 
  trackByIndex(index: number, column: number): number {
    return index;
  }
  constructor(private route: ActivatedRoute, private authService: AuthService) {
    
  }

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
    const subjectPercentageMapping = {
      'Araling Panlipunan': {
        wwPercentage: 30,
        ptPercentage: 50,
        qaPercentage: 20
      },
      'Mathematics': {
        wwPercentage: 40,
        ptPercentage: 40,
        qaPercentage: 20
      },
      'Mother Tongue': {
        wwPercentage: 30,
        ptPercentage: 50,
        qaPercentage: 20
      },

    };
    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;

        const percentages = subjectPercentageMapping[this.subjectName];

        if (percentages) {
          this.selectedSubject = {
            subjectName: this.subjectName,
            wwPercentage: percentages.wwPercentage,
            ptPercentage: percentages.ptPercentage,
            qaPercentage: percentages.qaPercentage,
          };
          this.calculationWWPercentage = percentages.wwPercentage;
          this.calculationPTPercentage = percentages.ptPercentage;
          this.calculationQAPercentage = percentages.qaPercentage;

        }
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
          this.students = studentsData.students.map((student: Student) => ({
            ...student,
            totalWrittenWorkRS: 0,
            totalWrittenWorkWS: 0,
            totalPerfTaskRS: 0,
            totalPerfTaskWS: 0,
            totalQuarterlyAssessmentWS: 0,
            initialGrade: 0,
            quarterlyGrade: 0,
            ww_scores: Array.from({ length: 10 }, () => null),
            pt_scores: Array.from({ length: 10 }, () => null),
            qa_scores: 0,
          }));
    
          console.log(this.students);
          
  
          this.students.forEach((student:any) => {
            const lastName = student.lname;
            const firstName = student.fname;
  
            console.log(`Last Name: ${lastName}, First Name: ${firstName}`);
        })
        this.authService.getQuarters().subscribe((quartersData) => {
          this.quarters = quartersData;
          console.log('quarters', this.quarters);
  
            if (this.quarters && this.quarters.length > 0) {
            this.selectedQuarter = this.quarters[0].quarter_id;
            console.log('Selected Quarter ID:', this.selectedQuarter);
            }
            this.fetchStudentRawScores();
            this.fetchHPS();
            });
            
          },
          (error) => {
            console.error('Error fetching students:', error);
          }
        )
      
    const numStudents = this.students.length;
    const numColumns = 10;

    this.formData.ww_scores = Array.from({ length: numColumns }, () => Array(numStudents).fill(null));
    this.formData.pt_scores = Array.from({ length: numColumns }, () => Array(numStudents).fill(null));
    this.formData.qa_score = new Array(numStudents).fill(0);

    for (let i = 0; i < numColumns; i++) {
      for (let j = 0; j < numStudents; j++) {
        if (this.students[j].ww_scores && this.students[j].ww_scores[i] !== undefined) {
          this.formData.ww_scores[i][j] = this.students[j].ww_scores[i];
        }
        if (this.students[j].pt_scores && this.students[j].pt_scores[i] !== undefined) {
          this.formData.pt_scores[i][j] = this.students[j].pt_scores[i];
        }
      }
    }


    
  }

  fetchHPS(){
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };
    
    this.authService.fetchHPSscores(filters).subscribe(
      (data) => {
        console.log('HPS:', data);
        if (data && Array.isArray(data) && data.length > 0) {
          const hpsData = data[0];
          if (hpsData) {
            this.formData.writtenWorkHPS = [];
            this.formData.performanceTaskHPS = [];
            for (let i = 1; i <= 10; i++) {
              const wwkey = `hps_ww_${i}`;
              const ptkey = `hps_pt_${i}`;
              if (hpsData.hasOwnProperty(wwkey)) {
                this.formData.writtenWorkHPS.push(parseFloat(hpsData[wwkey]) || 0);
              }
              if (hpsData.hasOwnProperty(ptkey)) {
                this.formData.performanceTaskHPS.push(parseFloat(hpsData[ptkey]) || 0); 
              }
              
            }
            this.formData.totalWrittenWorkHPS = parseFloat(hpsData.hps_ww_total_score) || 0;
            this.formData.totalPerformanceTaskHPS = parseFloat(hpsData.hps_pt_total_score) || 0; 
            this.formData.quarterlyAssessmentHPS = parseFloat(hpsData.hps_qa_total_score)

          }

        } else {
          console.error('Invalid API response:', data);
        }
    }
    )
  }

  fetchStudentRawScores() {
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };
    console.log('Students before updating scores:', this.students);
  
    this.authService.fetchStudentGrades(filters).subscribe(
      (data) => {
        console.log('Raw Scores Data:', data);

        for (const scoreData of data) {
          const studentId = scoreData.student;
          console.log('Processing scores for Student ID:', studentId);
  
          const studentToUpdate = this.students.find((student) => student.id === studentId);
          console.log('Student to Update:', studentToUpdate);
  
          if (studentToUpdate) {
            for (let i = 1; i <= 10; i++) {
              const wwScoreKey = `ww_score_${i}`;
              const ptScoreKey = `pt_score_${i}`;
              const qaScore = parseFloat(scoreData.qa_score)
              if (scoreData.hasOwnProperty(wwScoreKey)) {
                studentToUpdate.ww_scores[i - 1] = parseFloat(scoreData[wwScoreKey]);
              }

              if (scoreData.hasOwnProperty(ptScoreKey)) {
                studentToUpdate.pt_scores[i - 1] = parseFloat(scoreData[ptScoreKey]);
              }
              if(!isNaN(qaScore)){
                studentToUpdate.qa_score = qaScore;
              }else{
                studentToUpdate.qa_score = 0;
                studentToUpdate.ww_scores[i - 1] = 0;
                studentToUpdate.pt_scores[i - 1] = 0;
              }
            }
            studentToUpdate.totalWrittenWorkRS = parseFloat(scoreData.ww_total_score);
            studentToUpdate.totalPerfTaskRS = parseFloat(scoreData.pt_total_score);
            studentToUpdate.initialTotalWrittenWorkRS = studentToUpdate.totalWrittenWorkRS;
            studentToUpdate.quarter = parseFloat(scoreData.quarter);
            studentToUpdate.totalPerfTaskWS = parseFloat(scoreData.pt_weighted_score);
            studentToUpdate.totalWrittenWorkWS = parseFloat(scoreData.ww_weighted_score)
            studentToUpdate.totalQAPercentage = parseFloat(scoreData.qa_percentage_score)
            studentToUpdate.totalQuarterlyAssessmentWS = parseFloat(scoreData.qa_weighted_score)

          } else {
            console.error(`Student with ID ${studentId} not found in students array.`);
          }
        }
  
        console.log('Updated Students:', this.students);
      },
      (error) => {
        console.error('Error fetching student raw scores:', error);
      }
    );
  }
  
  




  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);

    if(this.selectedQuarter){
      this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
        (studentsData: any) => {
          this.students = studentsData.students.map((student: Student) => ({
            ...student,
            totalWrittenWorkRS: 0,
            totalWrittenWorkWS: 0,
            totalPerfTaskRS: 0,
            totalPerfTaskWS: 0,
            totalQuarterlyAssessmentWS: 0,
            initialGrade: 0,
            quarterlyGrade: 0,
            ww_scores: Array.from({ length: 10 }, () => null),
            pt_scores: Array.from({ length: 10 }, () => null),
            qa_scores: 0,
          }));
    
          console.log(this.students);
          
  
          this.students.forEach((student:any) => {
            const lastName = student.lname;
            const firstName = student.fname;
  
            console.log(`Last Name: ${lastName}, First Name: ${firstName}`);
          })
          this.fetchStudentRawScores()
          this.fetchHPS()

      })
    }
  }

updateTotalWrittenWorkHPS(index:number) {
  const hps = this.formData.writtenWorkHPS[index];
  const hpsValue = hps !== null && hps !== "" ? parseInt(hps, 10): 0;
  this.formData.writtenWorkHPS[index] = hpsValue;

  this.formData.totalWrittenWorkHPS = this.formData.writtenWorkHPS.reduce((total, value) => {
    return total + value;
  }, 0);
}

updateTotalPerformanceTaskHPS(index:number) {
  const hps = this.formData.performanceTaskHPS[index];
  const hpsValue = hps !== null && hps !== "" ? parseInt(hps, 10): 0;
  this.formData.performanceTaskHPS[index] = hpsValue;

  this.formData.totalPerformanceTaskHPS = this.formData.performanceTaskHPS.reduce((total, value) => {
    return total + value;
  }, 0);
}

updateWrittenWorkRS(studentId: number, column: number) {
  const studentToUpdate = this.students.find((student) => student.id === studentId);

  if (studentToUpdate) {
    const newWWScore = Number(studentToUpdate.ww_scores[column] || 0);
    studentToUpdate.ww_scores[column] = newWWScore;

    studentToUpdate.totalWrittenWorkRS = studentToUpdate.ww_scores.reduce((acc, score) => {
      const parsedScore = typeof score === 'number' ? score : 0; 
      return acc + parseFloat(parsedScore.toString()); 
    }, 0);

    const writtenWorkHPSValue = this.formData.writtenWorkHPS[column];
    const anyScoreHigher = this.students.some(student => {
      const otherScore = student.ww_scores[column] || 0;
      return Number(otherScore) > Number(writtenWorkHPSValue);
    });

    this.showRawScoreAlert = anyScoreHigher;
    this.calculateTotalWrittenWorkRS();

    this.calculateWeightedScores();


  } else {
    console.error(`Student with ID ${studentId} not found in students array.`);
  }
}

calculateTotalWrittenWorkRS() {
  this.totalWrittenWorkRS = this.students.reduce((total, student) => {
    const parsedScore = typeof student.totalWrittenWorkRS === 'number' ? student.totalWrittenWorkRS : 0; 
    return total + parseFloat(parsedScore.toString()); 
  }, 0);
}



updatePerfTaskRS(studentId: number, column: number) {
  const studentToUpdate = this.students.find((student) => student.id === studentId);

  if (studentToUpdate) {
    const newPtScore = Number(studentToUpdate.pt_scores[column] || 0);
    studentToUpdate.pt_scores[column] = newPtScore;

    studentToUpdate.totalPerfTaskRS = studentToUpdate.pt_scores.reduce((acc, score) => {
      const parsedScore = typeof score === 'number' ? score : 0; 
      return acc + parseFloat(parsedScore.toString()); 
    }, 0);

    const perfTaskHPSValue = this.formData.performanceTaskHPS[column];
    const anyScoreHigher = this.students.some(student => {
      const otherScore = student.pt_scores[column] || 0;
      return Number(otherScore) > Number(perfTaskHPSValue);
    });

    this.showRawScoreAlert = anyScoreHigher;
    this.calculateTotalPerfTaskRS();

    this.calculatePTWeightedScores();


  } else {
    console.error(`Student with ID ${studentId} not found in students array.`);
  }
}

calculateTotalPerfTaskRS() {
  this.totalPerfTaskRS = this.students.reduce((total, student) => {
    const parsedScore = typeof student.totalPerfTaskRS === 'number' ? student.totalPerfTaskRS : 0; 
    return total + parseFloat(parsedScore.toString()); 
  }, 0);
}

calculateWWPercentageScore(studentId: number) {
  const student = this.students.find((s) => s.id === studentId);

  if (!student) {
    return 0;
  }

  const totalWW= student.ww_scores.reduce((acc, score) => {
    const parsedScore = parseFloat(String(score)) || 0;
    return acc + parsedScore;
  }, 0)

  const totalHPS = this.formData.totalWrittenWorkHPS
  if (totalHPS === 0) {
    return 0; 
  }


  const wwPercentageScore = (totalWW / totalHPS) * 100;
  student.totalWWPercentage = Math.round(wwPercentageScore * 100)/100;
  this.formData.totalWWPercentage = student.totalWWPercentage;

  return student.totalWWPercentage;
}



// weighted score of written work
calculateWeightedScores() {
  if (this.selectedSubject) {
    const parsedPercentage = parseFloat(String(this.selectedSubject.wwPercentage));

    if (!isNaN(parsedPercentage)) {
      this.students.forEach((student) => {
        const totalWW = student.ww_scores.reduce((acc, score) => {
          const parsedScore = parseFloat(String(score)) || 0;
          return acc + parsedScore;
        }, 0);

        const totalHPS = this.formData.totalWrittenWorkHPS || 0;
        if (totalHPS !== 0) {
          student.totalWrittenWorkWS = parseFloat(((totalWW / totalHPS) * (parsedPercentage / 100) * 100).toFixed(2));
        } else {
          student.totalWrittenWorkWS = 0;
        }
      });
    } else {
      console.log('Invalid selectedSubject.wwPercentage:', this.selectedSubject.wwPercentage);
      this.students.forEach((student) => {
        student.totalWrittenWorkWS = 0;
      });
    }
  }
}




// percentage score of performance task

calculatePTPercentageScore(studentId: number) {
  const student = this.students.find((s) => s.id === studentId);

  if (!student) {
    return 0;
  }

  const totalPT= student.pt_scores.reduce((acc, score) => {
    const parsedScore = parseFloat(String(score)) || 0;
    return acc + parsedScore;
    return isNaN(score) ? 0 : score;
  }, 0)


  const totalHPS = this.formData.totalPerformanceTaskHPS

  if (totalHPS === 0) {
    return 0; 
  }


  const ptPercentageScore = (totalPT / totalHPS) * 100;
  student.totalPTPercentage = Math.round(ptPercentageScore * 100)/100;
  this.formData.totalPTPercentage = student.totalPTPercentage;

  return student.totalPTPercentage;
}


// weighted score of performance task
calculatePTWeightedScores() {
  if (this.selectedSubject) {
    const parsedPercentage = parseFloat(String(this.selectedSubject.ptPercentage));

    if (!isNaN(parsedPercentage)) {
      this.students.forEach((student) => {
        const totalPT = student.pt_scores.reduce((acc, score) => {
          const parsedScore = parseFloat(String(score)) || 0;
          return acc + parsedScore;
        },0);
        const totalHPS = this.formData.totalPerformanceTaskHPS || 0;
        
        if (totalHPS !== 0) {
          student.totalPerfTaskWS = parseFloat(((totalPT / totalHPS) * (parsedPercentage / 100) * 100).toFixed(2));
        } else {
          student.totalPerfTaskWS = 0;
        }
      });
    } else {
      console.log('Invalid selectedSubject.ptPercentage:', this.selectedSubject.ptPercentage);
      this.students.forEach((student) => {
        student.totalPerfTaskWS = 0;
      });
    }
  }
}


updateQARawScore(studentId: number) {
  const student = this.students.find((s) => s.id === studentId);

  if (student) {
    const rawScore = student.qa_score;
    const quarterlyAssessmentHPSNumber = +this.formData.quarterlyAssessmentHPS;

    this.showRawScoreAlert = !isNaN(rawScore) && rawScore > quarterlyAssessmentHPSNumber

   
  } else {    
    console.error(`Student with ID ${studentId} not found in students array.`);
  }
}


calculateQAWeightedScores() {
  this.students.forEach((student) => {
    const rawScore = student.qa_score || 0;

    const quarterlyAssessmentHPSNumber = typeof this.formData.quarterlyAssessmentHPS === 'string'
      ? parseInt(this.formData.quarterlyAssessmentHPS, 10)
      : this.formData.quarterlyAssessmentHPS;

    const totalQA = !isNaN(quarterlyAssessmentHPSNumber)
      ? ((rawScore / quarterlyAssessmentHPSNumber) * (this.selectedSubject.qaPercentage / 100) * 100)
      : undefined;

    student.totalQuarterlyAssessmentWS = totalQA;
  });
}



calculateQAPercentageScore(studentId: number) {
  const student = this.students.find((s) => s.id === studentId);

  if (student) {
    const qaScore = student.qa_score;
    const quarterlyAssessmentHPS = +this.formData.quarterlyAssessmentHPS;

    if(!isNaN(qaScore) && quarterlyAssessmentHPS !== 0){
      const qaPercentageScore = (qaScore / quarterlyAssessmentHPS) * 100;

      student.totalQAPercentage = Math.round(qaPercentageScore * 100) / 100;

      this.formData.totalQAPercentage = student.totalQAPercentage;
      return student.totalQAPercentage;
    }
  }

  return 0;

}

updateQuarterlyGrade(student: Student): void {
  const initialGrade = this.calculateInitialGrade(student);
  student.initialGrade = initialGrade;
  const quarterlyGrade = this.calculateQuarterlyGrade(initialGrade);
  student.quarterlyGrade = quarterlyGrade;
  
}


calculateInitialGrade(student: Student): number {
  const totalWrittenWorkWS = student.totalWrittenWorkWS || 0;
  const totalPerfTaskWS = student.totalPerfTaskWS || 0;
  const totalQuarterlyAssessmentWS = student.totalQuarterlyAssessmentWS || 0;

  const initialGrade = totalWrittenWorkWS + totalPerfTaskWS + totalQuarterlyAssessmentWS;
  student.initialGrade = Math.round(initialGrade * 100) / 100;

  student.quarterlyGrade = totalQuarterlyAssessmentWS > 0 ? this.calculateQuarterlyGrade(initialGrade) : null;
  return initialGrade;
}


calculateQuarterlyGrade(initialGrade: number): number {

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

getRank(quarterlyGrade: number): string {
  if (quarterlyGrade >= 90 && quarterlyGrade <= 94) {
    return 'lightyellow';
  } else if (quarterlyGrade >= 95 && quarterlyGrade <= 97) {
    return 'greenyellow';
  } else if (quarterlyGrade >= 98 && quarterlyGrade <= 100) {
    return 'Yellow';
  } else {
    return 'transparent';
  }
}


showStudentId(studentId: number){
  console.log(studentId)
}


submitForm() {
  console.log('gradelevel', this.gradeLevelId)
  console.log('section', this.sectionId)
  console.log('subject', this.subjectId)
  console.log('quarter id', this.selectedQuarter)

  this.students.forEach((student) => {
    
    const studentGrades = {
      student: student.id, 
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter,
      ww_score_1:student.ww_scores[0],
      ww_score_2:student.ww_scores[1],
      ww_score_3:student.ww_scores[2],
      ww_score_4:student.ww_scores[3],
      ww_score_5:student.ww_scores[4],
      ww_score_6:student.ww_scores[5],
      ww_score_7:student.ww_scores[6],
      ww_score_8:student.ww_scores[7],
      ww_score_9:student.ww_scores[8],
      ww_score_10:student.ww_scores[9],
      ww_total_score: student.totalWrittenWorkRS,
      ww_percentage_score: student.totalWWPercentage,
      ww_weighted_score: student.totalWrittenWorkWS,
      pt_score_1: student.pt_scores[0],
      pt_score_2: student.pt_scores[1],
      pt_score_3: student.pt_scores[2],
      pt_score_4: student.pt_scores[3],
      pt_score_5: student.pt_scores[4],
      pt_score_6: student.pt_scores[5],
      pt_score_7: student.pt_scores[6],
      pt_score_8: student.pt_scores[7],
      pt_score_9: student.pt_scores[8],
      pt_score_10: student.pt_scores[9],
      pt_total_score:student.totalPerfTaskRS,
      pt_percentage_score: student.totalPTPercentage,
      pt_weighted_score: student.totalPerfTaskWS,
      qa_score: student.qa_score,
      qa_percentage_score: student.totalQAPercentage,
      qa_weighted_score: student.totalQuarterlyAssessmentWS,
      initial_grade: student.initialGrade,
      quarterly_grade: student.quarterlyGrade

    };

    console.log('student grades', studentGrades);

    this.authService.addStudentGrades(studentGrades).subscribe(
      (response) => {
        console.log('Student grades added:', response);
        this.saveAlert = true;

      },
      (error) => {
        console.error('Error adding student grades:', error);
      }
    );
  });
  
  const hpsData = {
    gradelevel: this.gradeLevelId,
    section: this.sectionId,
    subject: this.subjectId,
    quarter: this.selectedQuarter,
    hps_ww_total_score: this.formData.totalWrittenWorkHPS,
    hps_pt_total_score: this.formData.totalPerformanceTaskHPS,
    hps_qa_total_score: this.formData.quarterlyAssessmentHPS,
    hps_pt_1: this.formData.performanceTaskHPS[0],
    hps_pt_2: this.formData.performanceTaskHPS[1],
    hps_pt_3: this.formData.performanceTaskHPS[2],
    hps_pt_4: this.formData.performanceTaskHPS[3],
    hps_pt_5: this.formData.performanceTaskHPS[4],
    hps_pt_6: this.formData.performanceTaskHPS[5],
    hps_pt_7: this.formData.performanceTaskHPS[6],
    hps_pt_8: this.formData.performanceTaskHPS[7],
    hps_pt_9: this.formData.performanceTaskHPS[8],
    hps_pt_10: this.formData.performanceTaskHPS[9],
    hps_ww_1: this.formData.writtenWorkHPS[0],
    hps_ww_2: this.formData.writtenWorkHPS[1],
    hps_ww_3: this.formData.writtenWorkHPS[2],
    hps_ww_4: this.formData.writtenWorkHPS[3],
    hps_ww_5: this.formData.writtenWorkHPS[4],
    hps_ww_6: this.formData.writtenWorkHPS[5],
    hps_ww_7: this.formData.writtenWorkHPS[6],
    hps_ww_8: this.formData.writtenWorkHPS[7],
    hps_ww_9: this.formData.writtenWorkHPS[8],
    hps_ww_10: this.formData.writtenWorkHPS[9],
  };
  console.log('hps', hpsData)



  this.authService.addHPS(hpsData).subscribe(
    (response) => {
      console.log('HPS data added:', response);
      this.saveAlert = true;

    },
    (error) => {
      console.error('Error adding HPS data:', error);
    }
  );

  const updatedStudentGrades = this.students.map((student) => {
    const studentGrades = {
      student: student.id,
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter,
      ww_score_1: student.ww_scores[0],
      ww_score_2: student.ww_scores[1],
      ww_score_3: student.ww_scores[2],
      ww_score_4: student.ww_scores[3],
      ww_score_5: student.ww_scores[4],
      ww_score_6: student.ww_scores[5],
      ww_score_7: student.ww_scores[6],
      ww_score_8: student.ww_scores[7],
      ww_score_9: student.ww_scores[8],
      ww_score_10: student.ww_scores[9],
      ww_total_score: student.totalWrittenWorkRS,
      ww_percentage_score: student.totalWWPercentage,
      ww_weighted_score: student.totalWrittenWorkWS,
      pt_score_1: student.pt_scores[0],
      pt_score_2: student.pt_scores[1],
      pt_score_3: student.pt_scores[2],
      pt_score_4: student.pt_scores[3],
      pt_score_5: student.pt_scores[4],
      pt_score_6: student.pt_scores[5],
      pt_score_7: student.pt_scores[6],
      pt_score_8: student.pt_scores[7],
      pt_score_9: student.pt_scores[8],
      pt_score_10: student.pt_scores[9],
      pt_total_score: student.totalPerfTaskRS,
      pt_percentage_score: student.totalPTPercentage,
      pt_weighted_score: student.totalPerfTaskWS,
      qa_score: student.qa_score,
      qa_percentage_score: student.totalQAPercentage,
      qa_weighted_score: student.totalQuarterlyAssessmentWS,
      initial_grade: student.initialGrade,
      quarterly_grade: student.quarterlyGrade
    };
    return studentGrades;
  });

  this.authService.batchUpdateStudentGrades(updatedStudentGrades).subscribe(
    (response) => {
      console.log('Batch Update Successful', response)
      this.saveAlert = true;
      setTimeout(() => {
        this.hideAlert();
      }, 3000);
    },
    (error) => {
      console.error('Error batch updating student grades:', error)
    }
  )

}
hideAlert() {
  this.saveAlert = false;
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
