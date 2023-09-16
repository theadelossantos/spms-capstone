import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

interface GradeLevelResponse {
  gradelevels: any[]; 
  sections:any[];
}
interface StudentResponse {
  students: any[]; 
} 

@Component({
  selector: 'app-st-hs',
  templateUrl: './st-hs.component.html',
  styleUrls: ['./st-hs.component.css']
})
export class StHsComponent {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      email: [''],
      password: [this.selectedStudent.password],
      grlevel: [this.selectedStudent.gradelvl_id],
      studentName: [this.selectedStudent.fname],
      studentMname: [this.selectedStudent.mname],
      studentLname: [this.selectedStudent.lname],
      address: [this.selectedStudent.address],
      phone: [this.selectedStudent.phone],
      gender: [this.selectedStudent.gender],
      birthdate: [this.selectedStudent.birthdate],
      section: [this.selectedStudent.section_id],
      department: [this.selectedStudent.dept_id],
    });
  }
  form: FormGroup;
  gradelvl: any [] = [];
  selectedGradeLevel: any = null;
  filteredStudent: any[] = [];
 
  selectedStudent: any = {
    department:null,
    originalGradelvl_id: null,
    section_id: null,
  };
  departmentId: string;
  gradeLevel: string = '';
  studentName: string = '';
  email: string = '';
  password: string = '';
  studentMname: string = '';
  studentLname: string = '';
  address: string = '';
  phone: string = '';
  gender: string = '';
  section: string = '';
  subject: string = '';
  birthdate: string = '';
  originalGradelvl_id: number | null = null;
  selectedGradeLevelArray: number | null = null;
  selectedSectionName: string = '';
  teacher: any; 
  sectionAssignmentError: string = '';
  isSortingAZ: boolean = true; 
  searchText: string = '';
  students: any[] = [];

  departments: any[] = [];
  gradeLevels: any[] = [];
  sections: any[] = [];
  selectedDepartment: number | null = null;
  selectedSection: { dept_id: number; gradelvl_id: number; section_id: number } | null = null;

  successMessage: string = '';
  errorMessage: string = '';
  showAlert:boolean = false;

  ngOnInit():void{


    this.authService.getHsGradeLevels().subscribe((data) => {
      this.gradelvl = data;

      console.log('gradelvl', data)
    });
    
    this.authService.getDepartments().subscribe((response: any) => {
      this.departments = response.departments;
  
      this.selectedDepartment = this.selectedStudent.dept_id;
  
      this.form.patchValue({
        studentName: this.selectedStudent.fname,
        studentMname: this.selectedStudent.mname,
        studentLname: this.selectedStudent.lname,
        address: this.selectedStudent.address,
        phone: this.selectedStudent.phone,
        gender: this.selectedStudent.gender,
        birthdate: this.selectedStudent.birthdate,
        email: this.selectedStudent.email,
        department: this.selectedStudent.dept_id,
        grlevel: this.selectedStudent.gradelvl_id,
        section: this.selectedStudent.section_id, 
      });

      this.originalGradelvl_id = this.selectedStudent.gradelvl_id;
      
    });
  }
  

  
  

  toggleSortOrder() {
    this.isSortingAZ = !this.isSortingAZ; 
  
    if (this.isSortingAZ) {
      this.filteredStudent.sort((a, b) => {
        return a.lname.localeCompare(b.lname); 
      });
    } else {
      this.filteredStudent.sort((a, b) => {
        return b.lname.localeCompare(a.lname); 
      });
    }
  }

  getSections(): void {
    if (this.selectedGradeLevel && this.selectedGradeLevel.dept_id !== null && this.selectedGradeLevel.gradelvl_id !== null) {
        this.authService.getSectionsByDeptGL(this.selectedGradeLevel.dept_id, this.selectedGradeLevel.gradelvl_id).subscribe(
            (data) => {
                this.sections = data.sections;
                console.log(this.sections);
            },
            (error) => {
                console.error('Error fetching sections', error);
            }
        );
    } else {
        this.sections = [];
    }
}

  manageStudents(departmentId:number, gradelvlId: number, sectionId:number){
    console.log(this.selectedSection)

    this.authService.filterStudents(departmentId, gradelvlId, sectionId).subscribe(
      (data: StudentResponse) => {
        this.selectedSection = this.sections.find((level) => level.dept_id === departmentId);
        this.selectedSection = this.sections.find((level) => level.gradelvl_id === gradelvlId);
        this.selectedSection = this.sections.find((level) => level.section_id === sectionId);

        this.filteredStudent = data.students;

        console.log('students:', this.filteredStudent)

        if (this.filteredStudent.length > 0){
          this.selectedStudent = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            section: this.filteredStudent[0].section_id,
            studentName: this.filteredStudent[0].fname,
            studentMname:this.filteredStudent[0].mname,
            studentLname:this.filteredStudent[0].lname,
            address:this.filteredStudent[0].address,
            phone: this.filteredStudent[0].phone,
            gender: this.filteredStudent[0].gender,
            birthdate: this.filteredStudent[0].birthdate,
            dept_id: this.selectedGradeLevel.dept_id,
          };
        }else{
          this.selectedStudent = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            section: null,
            studentName: '',
            studentMname:'',
            studentLname:'',
            address:'',
            phone: '',
            gender: '',
            birthdate: '',
            dept_id: null
          };
        }

      }
    )

  }

  editStudent(student: any) {
      const studentId = student.id;
      this.authService.getStudentById(studentId).subscribe(
        (data) => {

          this.selectedStudent = data.student;
          console.log('selected student', this.selectedStudent)
          
          this.form.patchValue({
            grlevel: this.selectedStudent.gradelvl_id,
            studentName: this.selectedStudent.fname,
            studentMname: this.selectedStudent.mname,
            studentLname: this.selectedStudent.lname,
            address: this.selectedStudent.address,
            phone: this.selectedStudent.phone,
            birthdate: this.selectedStudent.birthdate,
            section: this.selectedStudent.section_id,
            gender: this.selectedStudent.gender, 
            department: this.selectedStudent.dept_id,
            email: this.selectedStudent.user.email
          });
          
        
          this.authService.getSectionsByDeptGL(this.selectedStudent.department, this.selectedStudent.gradelvl_id).subscribe(
            (data: GradeLevelResponse) => {
              this.sections = data.sections;
    
              const section = this.sections.find((section) => section.section_id === this.selectedStudent.section_id);
              if (section) {
                this.selectedSectionName = section.name; 
              }
    
              this.form.patchValue({
                section: this.selectedStudent.section_id,
              });
            },
            (error) => {
              console.error('Error fetching sections', error);
            }
          );
    
          this.onDepartmentChange();
        },
        (error) => {
          console.error('Error fetching student data:', error);
        }
      );
    
  }


  saveEditedSubject() {
    if (!this.selectedStudent || !this.selectedStudent.student_id) {
      console.error('Invalid selected subject:', this.selectedStudent);
      return;
    }
    
    const studentId = this.selectedStudent.student_id;
    this.selectedStudent.gradelvl_id = this.form.value.grlevel;
  
    const updatedStudentData = {
      student:{
        dept_id: this.form.value.department,
        section_id: this.form.value.section,
        fname: this.form.value.studentName,
        mname: this.form.value.studentMname,
        lname: this.form.value.studentLname,
        address: this.form.value.address,
        phone: this.form.value.phone,
        gender: this.form.value.gender,
        birthdate: this.form.value.birthdate,
        gradelvl_id: this.form.value.grlevel
      }
      
    };
    Object.assign(this.selectedStudent, updatedStudentData);
  
    this.authService.editStudent(studentId, this.selectedStudent).subscribe(
      () => {
        this.showAlert = true;
  
        setTimeout(() => {
          this.hideAlert();
        }, 3000);
      },
      (error) => {
        this.showAlert = false;
        console.log(error)
      }
    );
  }

  clearSectionError() {
    this.sectionAssignmentError = '';
  }
  
  
  
  deleteStudent(studentId:any){
  
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
  
    if (confirmDelete) {
      this.authService.deleteStudent(studentId).subscribe(
        (response) => {
          this.filteredStudent = this.filteredStudent.filter((s) => s.id !== studentId);
        },
        (error) => {
          console.error('Error deleting subject: ', error);
        }
      );
    }
  }

  hideAlert(){
    this.showAlert = false;
  }

  onGradeLevelChange(): void {
    if (this.selectedStudent.grlevel !== null && this.selectedStudent.department !== null) {

      this.authService.getSectionsByDeptGL(this.selectedStudent.department, this.selectedStudent.gradelvl_id).subscribe(
        (data: GradeLevelResponse) => {
          this.sections = data.sections;
        },
        (error) => {
          console.error('Error fetching sections', error);
        }
      );
    } else {
      this.sections = [];
    }
  }
  

  onDepartmentChange(){
    if (this.selectedStudent.dept_id !== null) {

      this.selectedDepartment = this.selectedStudent.department;

      this.authService.getGradelevelsByDept(this.selectedStudent.department).subscribe(
        (data: GradeLevelResponse) => { 
          this.gradeLevels = data.gradelevels;
        },
        (error) => {
          console.error('Error fetching grade levels', error);
        }
      );
    } else {
      this.gradeLevels = [];
    }
  }
}
