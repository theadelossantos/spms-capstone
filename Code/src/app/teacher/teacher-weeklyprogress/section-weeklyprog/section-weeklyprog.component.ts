import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

interface Student {
  id: number;
  fname: string;
  lname: string;
}
interface Task {
  id: number;
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
  isSortingAZ: boolean = true;
  studentExpansionMap: { [studentId: number]: boolean } = {};
  studentTasks: { [studentId: number]: Task[] } = {};
  selectedActivityStatus: string;
  quarters: any[]=[]
  selectedQuarter: number;
  selectedMonth: string = 'This Week'; 
  filteredTasks: Task[] = [];
  constructor(private route: ActivatedRoute, private authService: AuthService, private datePipe: DatePipe) {
    this.students.forEach((student) => {
      this.studentExpansionMap[student.id] = false;
    });
    this.students.forEach((student) => {
      this.studentTasks[student.id] = [];
    });
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
        this.students = studentsData.students.map((student: Student) => ({
          ...student,
          
        }));
        this.students.forEach((student) => {
          this.studentExpansionMap[student.id] = false;
          this.studentTasks[student.id] = [];

        });
        console.log(this.students);
        this.sortStudents();

        this.authService.getQuarters().subscribe((quartersData) => {
          this.quarters = quartersData;
          console.log('quarters', this.quarters);
  
            if (this.quarters && this.quarters.length > 0) {
            this.selectedQuarter = this.quarters[0].quarter_id;
            console.log('Selected Quarter ID:', this.selectedQuarter);

            this.students.forEach((student) => {
              this.studentExpansionMap[student.id] = false;
              this.studentTasks[student.id] = [];
    
              this.getWeeklyProgress(student.id);
    
            });
            }
            
          },
          (error) => {
            console.error('Error fetching students:', error);
          }
        )
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
  addTask(studentId: number) {
    this.studentTasks[studentId].push({id: null, student_id: studentId, dept_id: this.deptId, gradelvl_id: this.gradeLevelId, section_id: this.sectionId, subject_id: this.subjectId, quarter_id: this.selectedQuarter, task_name: '', task_score: '', task_status: '', input_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd') });
    this.studentExpansionMap[studentId] = true;
  }
  removeTask(studentId: number, taskIndex: number) {
    const taskToRemove = this.studentTasks[studentId][taskIndex];
    this.studentTasks[studentId].splice(taskIndex, 1);
    this.studentExpansionMap[studentId] = true;

    this.authService.removeTask(taskToRemove.id).subscribe(
      (response: any) => {
        this.getWeeklyProgress(studentId);
      },
      (error) => {
        console.error('Error removing task from the database', error);

      }
    )
  }
  
  saveTask(studentId: number) {
    const tasks = this.studentTasks[studentId];
    const updatedTasks: Task[] = [];
  
    for (const task of tasks) {
      const taskData: Task = {
        id: task.id,
        student_id: studentId,
        dept_id: this.deptId,
        gradelvl_id: this.gradeLevelId,
        section_id: this.sectionId,
        subject_id: this.subjectId,
        quarter_id: this.selectedQuarter,
        task_name: task.task_name,
        task_score: task.task_score,
        task_status: task.task_status,
        input_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      };
  
      if (task.id) {
        updatedTasks.push(taskData);
      } else {
        this.authService.addWeeklyProgress(taskData).subscribe(
          (response: any) => {
            console.log('Task added successfully:', response);
            this.getWeeklyProgress(studentId);
          },
          (error) => {
            console.error('Error adding task', error);
          }
        );
      }
    }
  
    if (updatedTasks.length > 0) {
      this.authService.updateWeeklyProgress(updatedTasks).subscribe(
        (response: any) => {
          console.log('Tasks updated successfully:', response);
  
          this.students.forEach((student) => {
            this.studentExpansionMap[student.id] = false;
            this.studentTasks[student.id] = [];
  
            this.getWeeklyProgress(student.id);
          });
        },
        (error) => {
          console.error('Error updating tasks', error);
        }
      );
    }
  }

  filterByMonth() {
    this.students.forEach((student) => {
      this.studentTasks[student.id] = [];
      this.getWeeklyProgress(student.id);
    });
  }
  
  getWeeklyProgress(studentId: number) {
    this.authService.getStudentWeeklyProgress(studentId, this.gradeLevelId, this.sectionId, this.subjectId, this.selectedQuarter, this.selectedMonth).subscribe(
      (response: any) => {
        const tasks: Task[] = response.map((item: any) => ({
          id: item.id,
          task_name: item.task_name,
          task_score: item.task_score,
          task_status: item.task_status,
          input_date: item.input_date
        }));
        this.studentTasks[studentId] = tasks;
        console.log(this.studentTasks[studentId])

      },
      (error) => {
        console.error('Error fetching Weekly Progress:', error);
      }
    );
  }
  
  
  
  

}