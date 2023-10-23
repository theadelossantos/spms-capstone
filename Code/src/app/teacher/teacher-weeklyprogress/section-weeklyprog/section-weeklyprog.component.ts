import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

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

  nameWW1: string;
  nameWW2: string;


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

  constructor(private route: ActivatedRoute, private authService: AuthService, private datePipe: DatePipe) {
    this.students.forEach((student) => {
      this.studentExpansionMap[student.id] = false;
    });
    this.students.forEach((student) => {
      this.studentTasks[student.id] = [];
    });
    this.selectedAssessmentType = 'Written Work 1';
    this.students = [];

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
      console.log('Assignment ID:', this.assignmentId);

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

    this.students.forEach((student) => {
      this.studentExpansionMap[student.id] = false;
      this.studentTasks[student.id] = [];

      this.getWeeklyProgress(student.id);

    });

    if(this.selectedQuarter){
      this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
        (studentsData: any) => {
          this.students = studentsData.students.map((student: Student) => ({
            ...student,
            
          }));
          this.students.forEach((student) => {
            this.studentExpansionMap[student.id] = false;
            this.studentTasks[student.id] = [];
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
                this.hpsData[`Written Work ${i}`] = parseFloat(hpsData[wwkey]);
              }
              if (hpsData.hasOwnProperty(ptkey)) {
                this.hpsData[`Performance Task ${i}`] = parseFloat(hpsData[ptkey]);
              }
              
            }
            this.formData.totalWrittenWorkHPS = parseFloat(hpsData.hps_ww_total_score) || 0;
            this.formData.totalPerformanceTaskHPS = parseFloat(hpsData.hps_pt_total_score) || 0; 
            this.hpsData['Quarterly Assessment'] = parseFloat(hpsData['hps_qa_total_score']);

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
            }
  
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
            ww_score_4: student.ww_scores[3],
            ww_score_5: student.ww_scores[4],
            ww_score_6: student.ww_scores[5],
            ww_score_7: student.ww_scores[6],
            ww_score_8: student.ww_scores[7],
            ww_score_9: student.ww_scores[8],
            ww_score_10: student.ww_scores[9],
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
            qa_score: student.qa_score,
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

        
        const updatedTasks: Task[] = [];
        if (!student) {
            console.error('Student not found');
            return;
        }

        const existingTasks = this.studentTasks[student.id] || [];
        console.log(`Student ID: ${student.id}`);
        console.log('Existing Tasks:', existingTasks);
        console.log('tasks in submit frm', this.studentTasks[student.id])
                
        for (let i = 0; i < student.ww_scores.length; i++) {
          const taskName = `${this.selectedAssessmentType}: ${this.taskName}`;
          const taskScore = student.ww_scores[i];
          const ptScore = student.pt_scores[i];
          const taskStatus = 'Completed';
          const taskId = student.tasks && student.tasks[i] ? student.tasks[i].id : null;
      
          if (taskScore !== null && taskScore !== undefined) {
              const taskScoreAsString = taskScore.toString();
              const existingTask = existingTasks.find((task) => task.id === taskId);
              console.log('task id', taskId)

      
              console.log('Task Name:', taskName);
              console.log('Existing Task:', existingTask);
      
              if (existingTask) {
                  existingTask.id = taskId;
                  console.log('Updating existing task...');
                  existingTask.task_score = taskScoreAsString;
                  updatedTasks.push(existingTask);
              } else {
                  const taskData: Task = {
                      id: taskId,
                      student_id: student.id,
                      dept_id: this.deptId,
                      gradelvl_id: this.gradeLevelId,
                      section_id: this.sectionId,
                      subject_id: this.subjectId,
                      quarter_id: this.selectedQuarter,
                      task_name: taskName,
                      task_score: taskScoreAsString,
                      task_status: taskStatus,
                      input_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                    };
                  updatedTasks.push(taskData);
      
                  this.authService.addWeeklyProgress(taskData).subscribe(
                      (response) => {
                          console.log('Task added successfully:', response);
                          this.getWeeklyProgress(student.id);
                      },
                      (error) => {
                          console.error('Error adding task', error);
                      }
                  );
                  if (updatedTasks.length > 0) {
                      this.authService.updateWeeklyProgress(updatedTasks).subscribe(
                          (response) => {
                              console.log('Tasks updated successfully:', response);
                          },
                          (error) => {
                              console.error('Error updating tasks', error);
                          }
                      );
                  }
              }
          } else {
              console.error('Invalid task score for task:', taskName);
          }

          if (ptScore !== null && ptScore !== undefined) {
            const taskName = `Performance Task: ${this.taskName}`; 
            const taskScoreAsString = ptScore.toString();
            const existingTask = existingTasks.find((task) => task.id === taskId);
    
            console.log('Task Name (PT):', taskName);
            console.log('Existing Task (PT):', existingTask);
    
            if (existingTask) {
                existingTask.id = taskId;
                console.log('Updating existing task (PT)...');
                existingTask.task_score = taskScoreAsString;
                updatedTasks.push(existingTask);
            } else {
                const taskData: Task = {
                    id: taskId,
                    student_id: student.id,
                    dept_id: this.deptId,
                    gradelvl_id: this.gradeLevelId,
                    section_id: this.sectionId,
                    subject_id: this.subjectId,
                    quarter_id: this.selectedQuarter,
                    task_name: taskName,
                    task_score: taskScoreAsString,
                    task_status: taskStatus,
                    input_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                };
                updatedTasks.push(taskData);
    
                this.authService.addWeeklyProgress(taskData).subscribe(
                    (response) => {
                        console.log('Task added successfully (PT):', response);
                        this.getWeeklyProgress(student.id);
                    },
                    (error) => {
                        console.error('Error adding task (PT)', error);
                    }
                );
            }
        }
    
      }
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
        return student.pt_scores[9];
      
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

  
  
}