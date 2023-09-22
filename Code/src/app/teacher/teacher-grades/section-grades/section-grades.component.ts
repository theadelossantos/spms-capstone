import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/services/auth.service';
interface Student {
  id: number;
  fname: string;
  lname: string;
  ww_scores: number[]; 
  pt_scores: number[];
  totalWrittenWorkRS: number;
  totalWrittenWorkWS: number;
  totalPerfTaskRS:number;
  totalPerfTaskWS: number;
  totalQaWS: number;

  totalQuarterlyAssessmentWS: number;
  initialGrade?: number;
  quarterlyGrade?: number;
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
  pt_scores: number[][] = Array(10).fill([]).map(() => Array(this.students.length).fill(0));

  // ww_ws_percentage: number = 0;
  // pt_ws_percentage: number = 0
  // qa_ws_percentage: number = 0
  weightedScores: number[] = [];
  
  totalWrittenWorkHPS: number = 0;
  totalWrittenWorkRS: number = 0;
  totalWrittenWorkWS: number = 0;

  totalPerformanceTaskHPS: number = 0;
  totalPerfTaskRS: number = 0;
  totalPerfTaskWS: number = 0;

  quarterlyAssessmentHPS: number = 0;
  qa_scores: { [studentId: number]: number } = {};

  selectedSubject: {
    subjectName: string;
    wwPercentage: number;
    ptPercentage: number;
    qaPercentage: number;
  };

  showRawScoreAlert = false;



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
            qaPercentage: percentages.qaPercentage
          };
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
          ww_scores: Array(10).fill(0),
          pt_scores: Array(10).fill(0),
          qa_scores: 0,
        }));
  
        console.log(this.students);
        
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

updateWrittenWorkRS(studentId: number, column: number) {
  const ww_rsValue = this.ww_scores.map((ww_scoresRow) => {
    return ww_scoresRow[studentId]; 
  }).reduce((acc, score) => {
    const parsedScore = typeof score === 'string' && score !== '' ? parseInt(score, 10) : 0;
    return acc + parsedScore;
  }, 0);

  this.students.find(student => student.id === studentId).totalWrittenWorkRS = ww_rsValue;

  const writtenWorkHPSValue = this.writtenWorkHPS[column];

  const anyScoreHigher = this.students.some(student => {
    const rawScore = this.ww_scores[column][student.id];
    const parsedScore = typeof rawScore === 'string' && rawScore !== '' ? parseInt(rawScore, 10) : 0;
    return Number(parsedScore) > Number(writtenWorkHPSValue);
  });

  this.showRawScoreAlert = anyScoreHigher;

  this.students.forEach(student => {
    const rawScore = this.ww_scores[column][student.id];
    const parsedScore = typeof rawScore === 'string' && rawScore !== '' ? parseInt(rawScore, 10) : 0;
    const hpsValue = parseInt(writtenWorkHPSValue, 10); 
  
    if (!isNaN(parsedScore) && !isNaN(hpsValue) && parsedScore > hpsValue) {
      this.ww_scores[column][student.id] = 0; 
    }
  });
}


updatePerfTaskRS(studentId: number, column: number) {
  console.log('Selected Student ID:', studentId);

  const pt_rsValue = this.pt_scores.map((pt_scoresRow) => {
    return pt_scoresRow[studentId]; 
  }).reduce((acc, score) => {
    const parsedScore = typeof score === 'string' && score !== '' ? parseInt(score, 10) : 0;
    return acc + parsedScore;
  }, 0);

  this.students.find(student => student.id === studentId).totalPerfTaskRS = pt_rsValue;

  const perfTaskHPSValue = this.performanceTaskHPS[column];

  const anyScoreHigher = this.students.some(student => {
    const rawScore = this.pt_scores[column][student.id];
    const parsedScore = typeof rawScore === 'string' && rawScore !== '' ? parseInt(rawScore, 10) : 0;
    return Number(parsedScore) > Number(perfTaskHPSValue);
  });

  this.showRawScoreAlert = anyScoreHigher;

  this.students.forEach(student => {
    const rawScore = this.pt_scores[column][student.id];
    const parsedScore = typeof rawScore === 'string' && rawScore !== '' ? parseInt(rawScore, 10) : 0;
    const hpsValue = parseInt(perfTaskHPSValue, 10); 
  
    if (!isNaN(parsedScore) && !isNaN(hpsValue) && parsedScore > hpsValue) {
      this.pt_scores[column][student.id] = 0; 
    }
  });
}

calculateWWPercentageScore(studentId: number) {
  const totalWW = this.ww_scores.map((ww_scoresRow) => {
    const score = ww_scoresRow[studentId] ? Number(ww_scoresRow[studentId]) : 0;
    return isNaN(score) ? 0 : score;
  }).reduce((acc, score) => acc + score, 0);

  const totalHPS = this.writtenWorkHPS.reduce((acc, hps) => {
    const hpsValue = hps !== "" ? parseInt(hps, 10) : 0;
    return acc + hpsValue;
  }, 0);

  if (totalHPS === 0) {
    return 0; 
  }

  return (totalWW / totalHPS) * 100;
}

// weighted score of written work
calculateWeightedScores() {

  const parsedPercentage = parseFloat(String(this.selectedSubject.wwPercentage));

  if (!isNaN(parsedPercentage)) {
    this.students.forEach((student) => {
      const totalWW = this.ww_scores.map((ww_scoresRow) => {
        const score = ww_scoresRow[student.id] ? Number(ww_scoresRow[student.id]) : 0;
        return isNaN(score) ? 0 : score;
      }).reduce((acc, score) => acc + score, 0);

      if (this.totalWrittenWorkHPS !== 0) {
        student.totalWrittenWorkWS = (totalWW / this.totalWrittenWorkHPS) * (parsedPercentage / 100) * 100;
        console.log(`totalWrittenWorkWS for Student ID ${student.id}:`, student.totalWrittenWorkWS);
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
// percentage score of performance task

calculatePTPercentageScore(studentId: number) {
  const totalPT= this.pt_scores.map((pt_scoresRow) => {
    const score = pt_scoresRow[studentId] ? Number(pt_scoresRow[studentId]) : 0;
    return isNaN(score) ? 0 : score;
  }).reduce((acc, score) => acc + score, 0);

  const totalHPS = this.performanceTaskHPS.reduce((acc, hps) => {
    const hpsValue = hps !== "" ? parseInt(hps, 10) : 0;
    return acc + hpsValue;
  }, 0);

  if (totalHPS === 0) {
    return 0; 
  }

  return (totalPT / totalHPS) * 100;
}



// weighted score of performance task
calculatePTWeightedScores() {
  
  const parsedPercentage = parseFloat(String(this.selectedSubject.ptPercentage));

  if (!isNaN(parsedPercentage)) {
    this.students.forEach((student) => {
      const totalPT = this.pt_scores.map((pt_scoresRow) => {
        const score = pt_scoresRow[student.id] ? Number(pt_scoresRow[student.id]) : 0;
        return isNaN(score) ? 0 : score;
      }).reduce((acc, score) => acc + score, 0);

      if (this.totalWrittenWorkHPS !== 0) {
        student.totalPerfTaskWS = (totalPT / this.totalWrittenWorkHPS) * (parsedPercentage / 100) * 100;
        console.log(`totalWrittenWorkWS for Student ID ${student.id}:`, student.totalWrittenWorkWS);
      } else {
        student.totalWrittenWorkWS = 0;
      }
    });
  } else {
    console.log('Invalid selectedSubject.ptPercentage', this.selectedSubject.ptPercentage);
    this.students.forEach((student) => {
      student.totalWrittenWorkWS = 0;
    });
  }
}

updateQARawScore(studentId: number) {

  const rawScore = this.qa_scores[studentId];
  const quarterlyAssessmentHPSNumber = typeof this.quarterlyAssessmentHPS === 'string'
    ? parseInt(this.quarterlyAssessmentHPS, 10)
    : this.quarterlyAssessmentHPS;

  if (rawScore > quarterlyAssessmentHPSNumber) {
    this.showRawScoreAlert = true; 
  } else {
    this.showRawScoreAlert = false;
  }
  
}

calculateQAWeightedScores() {
  this.students.forEach((student) => {
    const rawScore = this.qa_scores[student.id] || 0;

    const quarterlyAssessmentHPSNumber = typeof this.quarterlyAssessmentHPS === 'string'
      ? parseInt(this.quarterlyAssessmentHPS, 10)
      : this.quarterlyAssessmentHPS;

    const totalQA = !isNaN(quarterlyAssessmentHPSNumber)
      ? (rawScore / quarterlyAssessmentHPSNumber) * (this.selectedSubject.qaPercentage / 100) * 100
      : undefined; 

    student.totalQuarterlyAssessmentWS = totalQA;
  });
}


calculateQAPercentageScore(studentId: number) {
  const totalQA = this.qa_scores[studentId] ? Number(this.qa_scores[studentId]) : 0;

  const quarterlyAssessmentHPSNumber = typeof this.quarterlyAssessmentHPS === 'string' ? parseInt(this.quarterlyAssessmentHPS, 10) : this.quarterlyAssessmentHPS;
  const totalHPS = !isNaN(quarterlyAssessmentHPSNumber) ? quarterlyAssessmentHPSNumber : 0;
  
  if (totalHPS === 0 || isNaN(totalQA)) {
    return 0;
  }

  return (totalQA / totalHPS) * 100;
}

updateQuarterlyGrade(student: Student): void {
  const initialGrade = this.calculateInitialGrade(student);
  student.initialGrade = initialGrade;
  console.log('Initial grade', initialGrade);
  const quarterlyGrade = this.calculateQuarterlyGrade(initialGrade);
  student.quarterlyGrade = quarterlyGrade;
  console.log('Quarterly grade', quarterlyGrade);
}


calculateInitialGrade(student: Student): number {
  const totalWrittenWorkWS = student.totalWrittenWorkWS || 0;
  const totalPerfTaskWS = student.totalPerfTaskWS || 0;
  const totalQuarterlyAssessmentWS = student.totalQuarterlyAssessmentWS || 0;

  const initialGrade = totalWrittenWorkWS + totalPerfTaskWS + totalQuarterlyAssessmentWS;

  student.quarterlyGrade = totalQuarterlyAssessmentWS > 0 ? this.calculateQuarterlyGrade(initialGrade) : null;

  return initialGrade;
}


calculateQuarterlyGrade(initialGrade: number): number {
  console.log('Initial Grade:', initialGrade);

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


submitForm(){

  const studentGradesRS = {

  }
  
}
  
}
