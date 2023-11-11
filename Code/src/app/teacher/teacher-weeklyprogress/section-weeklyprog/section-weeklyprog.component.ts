import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Student {
  id: number;
  fname: string;
  lname: string;
  pt_scores: number[];
  date_input_ww_score: number[]
  ww_scores: number[];
  date_input_pt_score: number[]
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
  status:string;
  tasks: Task[];
  nameWW: string; 
  namePT: string; 
  nameQA: string;
  scoreEntered: boolean
}
interface Task {
  id?: number;
  student_id: number;
  dept_id: number;
  gradelvl_id: number;
  section_id: number;
  subject_id: number;
  quarter_id: number;
  task_name: string;
  task_score: string;
  task_status: string;
  input_date: string;
}
@Component({
  selector: 'app-section-weeklyprog',
  templateUrl: './section-weeklyprog.component.html',
  styleUrls: ['./section-weeklyprog.component.css']
})
export class SectionWeeklyprogComponent {
  @ViewChild('hpsInput', { static: false }) hpsInput: ElementRef;

  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  assignmentId: number;
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

  isSortingAZ: boolean = true;
  studentExpansionMap: { [studentId: number]: boolean } = {};
  studentTasks: { [studentId: number]: Task[] } = {};
  selectedActivityStatus: string;
  selectedQuarter: number;
  selectedMonth: string = 'This Week'; 
  filteredTasks: Task[] = [];

  selectedQuarterName: string =''; 
  weightedScores: number[] = [];

  qa_scores: { [studentId: number]: number } = {};

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
  };

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
  calculationWWPercentage:number =0;
  calculationPTPercentage: number = 0;
  calculationQAPercentage: number = 0;
  hpsValues: number[] = [];
  studentRawScores: any[] = []; 
  saveAlert = false;
  selectedAssessmentType: string = '';
  studentScores: Map<string, number[]> = new Map();
  taskName: string;
  hpsData: { [key: string]: number } = {};
  assessmentDate: Date;

  selectedDateWW1: string;
  selectedDateWW2: string;
  selectedDateWW3: string;
  selectedDateWW4: string;
  selectedDateWW5: string;
  selectedDateWW6: string;
  selectedDateWW7: string;
  selectedDateWW8: string;
  selectedDateWW9: string;
  selectedDateWW10: string;

  selectedDatePT1: string;
  selectedDatePT2: string;
  selectedDatePT3: string;
  selectedDatePT4: string;
  selectedDatePT5: string;
  selectedDatePT6: string;
  selectedDatePT7: string;
  selectedDatePT8: string;
  selectedDatePT9: string;
  selectedDatePT10: string;

  selectedDateQA: string;
  nameWW: string;
  namePT: string;
  nameWW1: string;
  nameWW2: string;
  nameWW3: string;
  nameWW4: string;
  nameWW5: string;
  nameWW6: string;
  nameWW7: string;
  nameWW8: string;
  nameWW9: string;
  nameWW10: string;

  namePT1: string;
  namePT2: string;
  namePT3: string;
  namePT4: string;
  namePT5: string;
  namePT6: string;
  namePT7: string;
  namePT8: string;
  namePT9: string;
  namePT10: string;

  nameQA: string;

  hpsWW1: string;
  hpsWW2: string;
  hpsWW3: string;
  hpsWW4: string;
  hpsWW5: string;
  hpsWW6: string;
  hpsWW7: string;
  hpsWW8: string;
  hpsWW9: string;
  hpsWW10: string;

  hpsPT1: string;
  hpsPT2: string;
  hpsPT3: string;
  hpsPT4: string;
  hpsPT5: string;
  hpsPT6: string;
  hpsPT7: string;
  hpsPT8: string;
  hpsPT9: string;
  hpsPT10: string;

  hpsQA:string;
  showRawScoreAlert = false;

  data: any[];
  myForm: FormGroup;
  scoreEntered: boolean = false;
  hpsDataByQuarter: { [quarter: string]: any } = {};

  assessmentTypes = [
    'Written Work 1', 'Written Work 2', 'Written Work 3', 'Written Work 4', 'Written Work 5',
    'Written Work 6', 'Written Work 7', 'Written Work 8', 'Written Work 9', 'Written Work 10',
    'Performance Task 1', 'Performance Task 2', 'Performance Task 3', 'Performance Task 4', 'Performance Task 5',
    'Performance Task 6', 'Performance Task 7', 'Performance Task 8', 'Performance Task 9', 'Performance Task 10',
    'Quarterly Assessment'
  ];

  trackByIndex(index: number, column: number): number {
    return index;
  }

  constructor(private route: ActivatedRoute, private authService: AuthService, private datePipe: DatePipe, private fb: FormBuilder) {
    this.students.forEach((student) => {
      this.studentExpansionMap[student.id] = false;
    });
    this.students.forEach((student) => {
      this.studentTasks[student.id] = [];
    });
    this.selectedAssessmentType = 'Written Work 1';
    this.students = [];
    this.myForm = this.fb.group({
      highestPossibleScore: ['', Validators.required],

    });
    this.students.forEach(student => {
      student.status = 'Missing';
      student.scoreEntered = false;
    });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      

    });
    this.students.forEach(student => {
      this.updateStatus(student, this.selectedAssessmentType);
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
      'Music':{
        wwPercentage: 20,
        ptPercentage: 60,
        qaPercentage: 20
      },
      'Arts':{
        wwPercentage: 20,
        ptPercentage: 60,
        qaPercentage: 20
      },
      'Physical Education':{
        wwPercentage: 20,
        ptPercentage: 60,
        qaPercentage: 20
      },
      'Health':{
        wwPercentage: 20,
        ptPercentage: 60,
        qaPercentage: 20
      },
      'Edukasyon sa Pagpapakatao':{
        wwPercentage: 30,
        ptPercentage: 50,
        qaPercentage: 20
      },

    };
    
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
          this.authService.getQuarters().subscribe((quartersData) => {
            this.quarters = quartersData;
            console.log('quarters', this.quarters);
      
              if (this.quarters && this.quarters.length > 0) {
              this.selectedQuarter = this.quarters[0].quarter_id;
              console.log('Selected Quarter ID:', this.selectedQuarter);
              }
              this.fetchStudentRawScores();
              this.fetchHPS();
              this.getWeeklyProgress(student)
              this.fetchAssesssmentNames()
              this.sortStudents()
          });

    });
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
    
    })
  
      
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
          this.students.forEach((student) => {
            this.studentTasks[student.id] = [];
            this.fetchStudentRawScores();
            this.fetchHPS();
            this.getWeeklyProgress(student)
            this.fetchAssesssmentNames()
            this.sortStudents()
          });
          console.log(this.students);
      })
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
  private sortStudents() {
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
  toggleStudentExpansion(studentId: number) {
    this.studentExpansionMap[studentId] = !this.studentExpansionMap[studentId];
  }

  

  filterByMonth() {
    this.students.forEach((student) => {
      this.studentTasks[student.id] = [];
      this.getWeeklyProgress(student.id);
    });
  }
  
  getWeeklyProgress(studentId) {
    this.authService.getStudentWeeklyProgress(this.gradeLevelId, this.sectionId, this.subjectId, this.selectedQuarter, this.selectedMonth).subscribe(
      (response: any) => {
        const tasks: Task[] = response.map((item: any) => ({
          id: item.id,
          task_name: item.task_name,
          task_score: item.task_score,
          task_status: item.task_status,
          input_date: item.input_date
        }));

        console.log('tasks in get', tasks)

        this.studentTasks[studentId] = tasks;
        console.log('tasks',this.studentTasks[studentId])

        this.students.forEach((student, index) => {
          if (tasks[index] && tasks[index].task_status) {
            student.status = tasks[index].task_status;
          } else {
            console.error(`No task status found for student ${student.id}`);
          }
        });
      },
      (error) => {
        console.error('Error fetching Weekly Progress:', error);
      }
    );
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
                this.hpsData[`Written Work ${i}`] = parseFloat(hpsData[wwkey]) || null;
              }
              if (hpsData.hasOwnProperty(ptkey)) {
                this.hpsData[`Performance Task ${i}`] = parseFloat(hpsData[ptkey]) || null;
              }
            }
            this.formData.totalWrittenWorkHPS = parseFloat(hpsData.hps_ww_total_score) || 0;
            this.formData.totalPerformanceTaskHPS = parseFloat(hpsData.hps_pt_total_score) || 0; 
            this.hpsData['Quarterly Assessment'] = parseFloat(hpsData['hps_qa_total_score']) || null;
            
          }
        } else {
          console.error('Invalid API response:', data);
        }
    }
    )
  }
  
  fetchAssesssmentNames(){
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };
    
  
    this.authService.fetchStudentGrades(filters).subscribe(
      (data) => {
        console.log('Data:', data);
        if (Array.isArray(data) && data.length > 0) {
          const firstDataItem = data[0];
          
          if (firstDataItem) {
            this.nameWW1 = firstDataItem.ww_score_1_name;
            this.nameWW2 = firstDataItem.ww_score_2_name;
            this.nameWW3 = firstDataItem.ww_score_3_name;
            this.nameWW4 = firstDataItem.ww_score_4_name;
            this.nameWW5 = firstDataItem.ww_score_5_name;
            this.nameWW6 = firstDataItem.ww_score_6_name;
            this.nameWW7 = firstDataItem.ww_score_7_name;
            this.nameWW8 = firstDataItem.ww_score_8_name;
            this.nameWW9 = firstDataItem.ww_score_9_name;
            this.nameWW10 = firstDataItem.ww_score_10_name;
            
            this.namePT1 = firstDataItem.pt_score_1_name;
            this.namePT2 = firstDataItem.pt_score_2_name;
            this.namePT3 = firstDataItem.pt_score_3_name;
            this.namePT4 = firstDataItem.pt_score_4_name;
            this.namePT5 = firstDataItem.pt_score_5_name;
            this.namePT6 = firstDataItem.pt_score_6_name;
            this.namePT7 = firstDataItem.pt_score_7_name;
            this.namePT8 = firstDataItem.pt_score_8_name;
            this.namePT9 = firstDataItem.pt_score_9_name;
            this.namePT10 = firstDataItem.pt_score_10_name;

            this.nameQA = firstDataItem.qa_score_name

            this.selectedDateWW1 = firstDataItem.date_input_ww_score_1
            this.selectedDateWW2 = firstDataItem.date_input_ww_score_2
            this.selectedDateWW3 = firstDataItem.date_input_ww_score_3
            this.selectedDateWW4 = firstDataItem.date_input_ww_score_4
            this.selectedDateWW5 = firstDataItem.date_input_ww_score_5
            this.selectedDateWW6 = firstDataItem.date_input_ww_score_6
            this.selectedDateWW7 = firstDataItem.date_input_ww_score_7
            this.selectedDateWW8 = firstDataItem.date_input_ww_score_8
            this.selectedDateWW9 = firstDataItem.date_input_ww_score_9
            this.selectedDateWW10 = firstDataItem.date_input_ww_score_10

            this.selectedDatePT1 = firstDataItem.date_input_pt_score_1
            this.selectedDatePT2 = firstDataItem.date_input_pt_score_2
            this.selectedDatePT3 = firstDataItem.date_input_pt_score_3
            this.selectedDatePT4 = firstDataItem.date_input_pt_score_4
            this.selectedDatePT5 = firstDataItem.date_input_pt_score_5
            this.selectedDatePT6 = firstDataItem.date_input_pt_score_6
            this.selectedDatePT7 = firstDataItem.date_input_pt_score_7
            this.selectedDatePT8 = firstDataItem.date_input_pt_score_8
            this.selectedDatePT9 = firstDataItem.date_input_pt_score_9
            this.selectedDatePT10 = firstDataItem.date_input_pt_score_10

            this.selectedDateQA = firstDataItem.date_input_qa_score


          } else {
            this.nameWW1 = ''; 
          }
        } else {
          this.nameWW1 = '';
        }
       
      },
      (error) => {
        console.error('Error fetching student raw scores:', error);
      }
    );
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
              const qaScore = parseFloat(scoreData.qa_score);
  
              if (scoreData.hasOwnProperty(wwScoreKey)) {
                const wwScore = parseFloat(scoreData[wwScoreKey]);
                studentToUpdate.ww_scores[i - 1] = isNaN(wwScore) ? null : wwScore;
              } else {
                studentToUpdate.ww_scores[i - 1] = null;
              }
  
              if (scoreData.hasOwnProperty(ptScoreKey)) {
                const ptScore = parseFloat(scoreData[ptScoreKey]);
                studentToUpdate.pt_scores[i - 1] = isNaN(ptScore) ? null : ptScore;
              } else {
                studentToUpdate.pt_scores[i - 1] = null;
              }
  
              if (!isNaN(qaScore)) {
                studentToUpdate.qa_score = qaScore;
              } else {
                studentToUpdate.qa_score = null;
              }

              if (this.selectedAssessmentType.startsWith('Written Work')) {
                const assessmentNumber = parseInt(this.selectedAssessmentType.split(' ')[2]);
                const wwScoreNameKey = `ww_score_${assessmentNumber}_name`;
                studentToUpdate.nameWW = scoreData[wwScoreNameKey] || ''; 
              } else if (this.selectedAssessmentType.startsWith('Performance Task')) {
                const assessmentNumber = parseInt(this.selectedAssessmentType.split(' ')[2]);
                const ptScoreNameKey = `pt_score_${assessmentNumber}_name`;
                studentToUpdate.namePT = scoreData[ptScoreNameKey] || ''; 
              } else if (this.selectedAssessmentType === 'Quarterly Assessment') {
                studentToUpdate.nameQA = scoreData.qa_score_name || ''; 
              }
            }
            this.updateStatus(studentToUpdate, this.selectedAssessmentType);

            studentToUpdate.status = 'Missing';

            studentToUpdate.totalWrittenWorkRS = parseFloat(scoreData.ww_total_score);
            studentToUpdate.totalPerfTaskRS = parseFloat(scoreData.pt_total_score);
            studentToUpdate.initialTotalWrittenWorkRS = studentToUpdate.totalWrittenWorkRS;
            studentToUpdate.quarter = parseFloat(scoreData.quarter);
            studentToUpdate.totalPerfTaskWS = parseFloat(scoreData.pt_weighted_score);
            studentToUpdate.totalWrittenWorkWS = parseFloat(scoreData.ww_weighted_score);
            studentToUpdate.totalQAPercentage = parseFloat(scoreData.qa_percentage_score);
            studentToUpdate.totalQuarterlyAssessmentWS = parseFloat(scoreData.qa_weighted_score);
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
  
  

  submitForm() {
    console.log('gradelevel', this.gradeLevelId);
    console.log('section', this.sectionId);
    console.log('subject', this.subjectId);
    console.log('quarter id', this.selectedQuarter);
    this.students.forEach((student) => {
        const studentGrades = {
            student: student.id,
            gradelevel: this.gradeLevelId,
            section: this.sectionId,
            subject: this.subjectId,
            quarter: this.selectedQuarter,
            ww_score_1: student.ww_scores[0],
            date_input_ww_score_1:  this.selectedDateWW1,
            ww_score_1_name: this.nameWW1,

            ww_score_2: student.ww_scores[1],
            date_input_ww_score_2: this.selectedDateWW2 ,
            ww_score_2_name: this.nameWW2,

            ww_score_3: student.ww_scores[2],
            date_input_ww_score_3: this.selectedDateWW3,
            ww_score_3_name: this.nameWW3,

            ww_score_4: student.ww_scores[3],
            date_input_ww_score_4: this.selectedDateWW4,
            ww_score_4_name: this.nameWW4,

            ww_score_5: student.ww_scores[4],
            date_input_ww_score_5: this.selectedDateWW5,
            ww_score_5_name: this.nameWW5,

            ww_score_6: student.ww_scores[5],
            date_input_ww_score_6: this.selectedDateWW6,
            ww_score_6_name: this.nameWW6,

            ww_score_7: student.ww_scores[6],
            date_input_ww_score_7: this.selectedDateWW7,
            ww_score_7_name: this.nameWW7,

            ww_score_8: student.ww_scores[7],
            date_input_ww_score_8: this.selectedDateWW8,
            ww_score_8_name: this.nameWW8,

            ww_score_9: student.ww_scores[8],
            date_input_ww_score_9: this.selectedDateWW9,
            ww_score_9_name: this.nameWW9,

            ww_score_10: student.ww_scores[9],
            date_input_ww_score_10: this.selectedDateWW10,
            ww_score_10_name: this.nameWW10,

            pt_score_1: student.pt_scores[0],
            date_input_pt_score_1: this.selectedDatePT1,
            pt_score_1_name: this.namePT1,

            pt_score_2: student.pt_scores[1],
            date_input_pt_score_2: this.selectedDatePT2,
            pt_score_2_name: this.namePT2,

            pt_score_3: student.pt_scores[2],
            date_input_pt_score_3: this.selectedDatePT3,
            pt_score_3_name: this.namePT3,

            pt_score_4: student.pt_scores[3],
            date_input_pt_score_4: this.selectedDatePT4,
            pt_score_4_name: this.namePT4,

            pt_score_5: student.pt_scores[4],
            date_input_pt_score_5: this.selectedDatePT5,
            pt_score_5_name: this.namePT5,

            pt_score_6: student.pt_scores[5],
            date_input_pt_score_6: this.selectedDatePT6,
            pt_score_6_name: this.namePT6,

            pt_score_7: student.pt_scores[6],
            date_input_pt_score_7: this.selectedDatePT7,
            pt_score_7_name: this.namePT7,

            pt_score_8: student.pt_scores[7],
            date_input_pt_score_8: this.selectedDatePT8,
            pt_score_8_name: this.namePT8,

            pt_score_9: student.pt_scores[8],
            date_input_pt_score_9: this.selectedDatePT9,
            pt_score_9_name: this.namePT9,

            pt_score_10: student.pt_scores[9],
            date_input_pt_score_10: this.selectedDatePT10,
            pt_score_10_name: this.namePT10,

            qa_score: student.qa_score,
            date_input_qa_score: this.selectedDateQA,
            qa_score_name: this.nameQA,
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
        const hpsData = {
            gradelevel: this.gradeLevelId,
            section: this.sectionId,
            subject: this.subjectId,
            quarter: this.selectedQuarter,
            hps_qa_total_score: this.hpsData[`Quarterly Assessment`],
            hps_pt_1: this.hpsData[`Performance Task 1`],
            hps_pt_2: this.hpsData[`Performance Task 2`],
            hps_pt_3: this.hpsData[`Performance Task 3`],
            hps_pt_4: this.hpsData[`Performance Task 4`],
            hps_pt_5: this.hpsData[`Performance Task 5`],
            hps_pt_6: this.hpsData[`Performance Task 6`],
            hps_pt_7: this.hpsData[`Performance Task 7`],
            hps_pt_8: this.hpsData[`Performance Task 8`],
            hps_pt_9: this.hpsData[`Performance Task 9`],
            hps_pt_10: this.hpsData[`Performance Task 10`],
            hps_ww_1: this.hpsData[`Written Work 1`],
            hps_ww_2: this.hpsData[`Written Work 2`],
            hps_ww_3: this.hpsData[`Written Work 3`],
            hps_ww_4: this.hpsData[`Written Work 4`],
            hps_ww_5: this.hpsData[`Written Work 5`],
            hps_ww_6: this.hpsData[`Written Work 6`],
            hps_ww_7: this.hpsData[`Written Work 7`],
            hps_ww_8: this.hpsData[`Written Work 8`],
            hps_ww_9: this.hpsData[`Written Work 9`],
            hps_ww_10: this.hpsData[`Written Work 10`],
        };

        console.log('hps', hpsData);

        this.authService.fetchHPSscores(hpsData).subscribe(
            (existingHPSData) => {
                if (existingHPSData && Array.isArray(existingHPSData) && existingHPSData.length > 0) {
                    const existingHPSRecord = existingHPSData[0];
                    const hpsId = existingHPSRecord.id;

                    this.authService.updateHPS(hpsId, hpsData).subscribe(
                        (response) => {
                            console.log('HPS data updated:', response);
                            this.saveAlert = true;
                        },
                        (error) => {
                            console.error('Error updating HPS data:', error);
                        }
                    );
                } else {
                    this.authService.addHPS(hpsData).subscribe(
                        (response) => {
                            console.log('HPS data added:', response);
                            this.saveAlert = true;
                        },
                        (error) => {
                            console.error('Error adding HPS data:', error);
                        }
                    );
                }
            },
            (error) => {
                console.error('Error checking HPS data:', error);
            }
        );
        
        const selectedQuarterHPS = this.hpsDataByQuarter[this.selectedQuarter] || {};

        const updatedStudentGrades = this.students.map((student) => {
            const studentGrades = {
                student: student.id,
                gradelevel: this.gradeLevelId,
                section: this.sectionId,
                subject: this.subjectId,
                quarter: this.selectedQuarter,
                ww_score_1: student.ww_scores[0],
                date_input_ww_score_1:  this.selectedDateWW1,
                ww_score_1_name: this.nameWW1,

                ww_score_2: student.ww_scores[1],
                date_input_ww_score_2:  this.selectedDateWW2,
                ww_score_2_name: this.nameWW2,

                ww_score_3: student.ww_scores[2],
                date_input_ww_score_3: this.selectedDateWW3,
                ww_score_3_name: this.nameWW3,

                ww_score_4: student.ww_scores[3],
                date_input_ww_score_4: this.selectedDateWW4,
                ww_score_4_name: this.nameWW4,
    
                ww_score_5: student.ww_scores[4],
                date_input_ww_score_5: this.selectedDateWW5,
                ww_score_5_name: this.nameWW5,

                ww_score_6: student.ww_scores[5],
                date_input_ww_score_6: this.selectedDateWW6,
                ww_score_6_name: this.nameWW6,

                ww_score_7: student.ww_scores[6],
                date_input_ww_score_7: this.selectedDateWW7,
                ww_score_7_name: this.nameWW7,

                ww_score_8: student.ww_scores[7],
                date_input_ww_score_8: this.selectedDateWW8,
                ww_score_8_name: this.nameWW8,

                ww_score_9: student.ww_scores[8],
                date_input_ww_score_9: this.selectedDateWW9,
                ww_score_9_name: this.nameWW9,

                ww_score_10: student.ww_scores[9],
                date_input_ww_score_10: this.selectedDateWW10,
                ww_score_10_name: this.nameWW10,

                ww_total_score: student.totalWrittenWorkRS,
                ww_percentage_score: student.totalWWPercentage,
                ww_weighted_score: student.totalWrittenWorkWS,

                pt_score_1: student.pt_scores[0],
                date_input_pt_score_1: this.selectedDatePT1,
                pt_score_1_name: this.namePT1,

                pt_score_2: student.pt_scores[1],
                date_input_pt_score_2: this.selectedDatePT2,
                pt_score_2_name: this.namePT2,

                pt_score_3: student.pt_scores[2],
                date_input_pt_score_3: this.selectedDatePT3,
                pt_score_3_name: this.namePT3,

                pt_score_4: student.pt_scores[3],
                date_input_pt_score_4: this.selectedDatePT4,
                pt_score_4_name: this.namePT4,

                pt_score_5: student.pt_scores[4],
                date_input_pt_score_5: this.selectedDatePT5,
                pt_score_5_name: this.namePT5,

                pt_score_6: student.pt_scores[5],
                date_input_pt_score_6: this.selectedDatePT6,
                pt_score_6_name: this.namePT6,

                pt_score_7: student.pt_scores[6],
                date_input_pt_score_7: this.selectedDatePT7,
                pt_score_7_name: this.namePT7,

                pt_score_8: student.pt_scores[7],
                date_input_pt_score_8: this.selectedDatePT8,
                pt_score_8_name: this.namePT8,

                pt_score_9: student.pt_scores[8],
                date_input_pt_score_9: this.selectedDatePT9,
                pt_score_9_name: this.namePT9,

                pt_score_10: student.pt_scores[9],
                date_input_pt_score_10: this.selectedDatePT10,
                pt_score_10_name: this.namePT10,

                pt_total_score: student.totalPerfTaskRS,
                pt_percentage_score: student.totalPTPercentage,
                pt_weighted_score: student.totalPerfTaskWS,

                qa_score: student.qa_score,
                date_input_qa_score: this.selectedDateQA,
                qa_score_name: this.nameQA,
                
                qa_percentage_score: student.totalQAPercentage,
                qa_weighted_score: student.totalQuarterlyAssessmentWS,
                initial_grade: student.initialGrade,
                quarterly_grade: student.quarterlyGrade
            };
            return studentGrades;
        });

        this.authService.batchUpdateStudentGrades(updatedStudentGrades).subscribe(
            (response) => {
                console.log('Batch Update Successful', response);
                this.saveAlert = true;
                setTimeout(() => {
                    this.hideAlert();
                }, 3000);
            },
            (error) => {
                console.error('Error batch updating student grades:', error);
            }
        );        
   });
      
  }


  hideAlert() {
    this.saveAlert = false;
  }

  onAssessmentTypeChange(): void {
    if(this.selectedAssessmentType){
      this.studentScores = new Map()
      
      for (const student of this.students){
        this.studentScores.set(student.id + this.selectedAssessmentType, null)
      }
    }
  }
  getStudentScore(student: any, assessmentType: string): number{
    switch (assessmentType){
      case 'Written Work 1':
        return student.ww_scores[0];
      case 'Written Work 2':
        return student.ww_scores[1];        
      case 'Written Work 3':
        return student.ww_scores[2];
      case 'Written Work 4':
        return student.ww_scores[3];
      case 'Written Work 5':
        return student.ww_scores[4];
      case 'Written Work 6':
        return student.ww_scores[5];
      case 'Written Work 7':
        return student.ww_scores[6];
      case 'Written Work 8':
        return student.ww_scores[7];
      case 'Written Work 9':
        return student.ww_scores[8];
      case 'Written Work 10':
        return student.ww_scores[9];

      case 'Performance Task 1':
        return student.pt_scores[0];
      case 'Performance Task 2':
        return student.pt_scores[1];        
      case 'Performance Task 3':
        return student.pt_scores[2];
      case 'Performance Task 4':
        return student.pt_scores[3];
      case 'Performance Task 5':
        return student.pt_scores[4];
      case 'Performance Task 6':
        return student.pt_scores[5];
      case 'Performance Task 7':
        return student.pt_scores[6];
      case 'Performance Task 8':
        return student.pt_scores[7];
      case 'Performance Task 9':
        return student.pt_scores[8];
      case 'Performance Task 10':
        return student.pt_scores[9];
      
      case 'Quarterly Assessment':
        return student.qa_score;
      
      default:
        return 0;
    }
  }

  setStudentScore(student: any, assessmentType: string, event:any){
    const score = event.target.value
    switch (assessmentType){
      case 'Written Work 1':
        return student.ww_scores[0] = score;
      case 'Written Work 2':
        return student.ww_scores[1]  = score;        
      case 'Written Work 3':
        return student.ww_scores[2]  = score;
      case 'Written Work 4':
        return student.ww_scores[3]  = score;
      case 'Written Work 5':
        return student.ww_scores[4] = score;
      case 'Written Work 6':
        return student.ww_scores[5] = score;
      case 'Written Work 7':
        return student.ww_scores[6] = score;
      case 'Written Work 8':
        return student.ww_scores[7] = score;
      case 'Written Work 9':
        return student.ww_scores[8] = score;
      case 'Written Work 10':
        return student.ww_scores[9] = score;

      case 'Performance Task 1':
        return student.pt_scores[0] = score;
      case 'Performance Task 2':
        return student.pt_scores[1] = score;        
      case 'Performance Task 3':
        return student.pt_scores[2] = score;
      case 'Performance Task 4':
        return student.pt_scores[3] = score;
      case 'Performance Task 5':
        return student.pt_scores[4] = score;
      case 'Performance Task 6':
        return student.pt_scores[5] = score;
      case 'Performance Task 7':
        return student.pt_scores[6] = score;
      case 'Performance Task 8':
        return student.pt_scores[7] = score;
      case 'Performance Task 9':
        return student.pt_scores[8] = score;
      case 'Performance Task 10':
        return student.pt_scores[9] = score;
      
      case 'Quarterly Assessment':
        return student.qa_score  = score;
      
      default:
        return 0;
      
    }

  }
  getDateModel(assessmentType: string): string {
    switch (assessmentType) {
      case 'Written Work 1':
        return this.selectedDateWW1;
      case 'Written Work 2':
        return this.selectedDateWW2;
      case 'Written Work 3':
        return this.selectedDateWW3;
      default:
        return '';
    }
  }

  setDateModel(assessmentType: string, date: string): void {
    if (assessmentType === 'Written Work 1') {
      this.selectedDateWW1 = date;
    } else if (assessmentType === 'Written Work 2') {
      this.selectedDateWW2 = date;
    }else if (assessmentType === 'Written Work 3') {
      this.selectedDateWW3 = date;
    }
  }
  updateStatus(student, assessmentType) {
    const score = this.getStudentScore(student, assessmentType);
  
    if (score === null || score === undefined || score.toString().trim() === '') {
      student.status = 'Missing';
    } else {
      student.status = 'Completed';
    }
  }
  
  
}