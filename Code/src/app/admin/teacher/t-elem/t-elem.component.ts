import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

interface GradeLevelResponse {
  gradelevels: any[]; 
  sections:any[];
  
}

@Component({
  selector: 'app-t-elem',
  templateUrl: './t-elem.component.html',
  styleUrls: ['./t-elem.component.css']
})
export class TElemComponent {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      email: [''],
      password: [this.selectedTeacher.password],
      grlevel: [this.selectedTeacher.gradelvl_id],
      teacherName: [this.selectedTeacher.fname],
      teacherMname: [this.selectedTeacher.mname],
      teacherLname: [this.selectedTeacher.lname],
      address: [this.selectedTeacher.address],
      phone: [this.selectedTeacher.phone],
      gender: [this.selectedTeacher.gender],
      birthdate: [this.selectedTeacher.birthdate],
      section: [this.selectedTeacher.section_id],
      department: [this.selectedTeacher.dept_id],
    });
  }
  form: FormGroup;
  gradelvl: any [] = [];
  selectedGradeLevel: any = null;
  filteredTeacher: any[] = [];
  selectedTeacher: any = {
    department:null,
    originalGradelvl_id: null,
    section_id: null,
  };
  departmentId: string;
  gradeLevel: string = '';
  teacherName: string = '';
  email: string = '';
  password: string = '';
  teacherMname: string = '';
  teacherLname: string = '';
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

  departments: any[] = [];
  gradeLevels: any[] = [];
  sections: any[] = [];
  selectedDepartment: number | null = null;
  selectedSection: number | null = null;

  successMessage: string = '';
  errorMessage: string = '';
  showAlert:boolean = false;

  ngOnInit():void{


    this.authService.getGradeLevels().subscribe((data) => {
      this.gradelvl = data;
    });
    
    this.authService.getDepartments().subscribe((response: any) => {
      this.departments = response.departments;
  
      this.selectedDepartment = this.selectedTeacher.dept_id;
  
      this.form.patchValue({
        teacherName: this.selectedTeacher.fname,
        teacherMname: this.selectedTeacher.mname,
        teacherLname: this.selectedTeacher.lname,
        address: this.selectedTeacher.address,
        phone: this.selectedTeacher.phone,
        gender: this.selectedTeacher.gender,
        birthdate: this.selectedTeacher.birthdate,
        email: this.selectedTeacher.email,
        department: this.selectedTeacher.dept_id,
        grlevel: this.selectedTeacher.gradelvl_id,
        section: this.selectedTeacher.section_id, 
      });

      this.originalGradelvl_id = this.selectedTeacher.gradelvl_id;
      
    });
    
    

  }




  manageTeachers(departmentId:number, gradelvlId: number){
    if (!gradelvlId) {
      console.error("Invalid gradelvlId:", gradelvlId);
      return;
    }

    this.authService.filterTeachers(gradelvlId).subscribe(
      (data) => {
        this.selectedGradeLevel = this.gradelvl.find((level) => level.gradelvl_id === gradelvlId);
        this.filteredTeacher = data.teachers


        if (this.filteredTeacher.length > 0){
          this.selectedTeacher = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            section: this.filteredTeacher[0].section_id,
            teacherName: this.filteredTeacher[0].fname,
            teacherMname:this.filteredTeacher[0].mname,
            teacherLname:this.filteredTeacher[0].lname,
            address:this.filteredTeacher[0].address,
            phone: this.filteredTeacher[0].phone,
            gender: this.filteredTeacher[0].gender,
            birthdate: this.filteredTeacher[0].birthdate,
            dept_id: this.selectedGradeLevel.dept_id,
          };
        }else{
          this.selectedTeacher = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            section: null,
            teacherName: '',
            teacherMname:'',
            teacherLname:'',
            address:'',
            phone: '',
            gender: '',
            birthdate: '',
            dept_id: null
          };
        }
      },
      (error) => {
        console.error("Error fetching teacher:", error);
      }
    )
  }

  editTeacher(teacher: any) {
    const teacherId = teacher.id;
    this.authService.getTeacherById(teacherId).subscribe(
      (data) => {
        this.selectedTeacher = data.teacher;

        
        this.form.patchValue({
          grlevel: this.selectedTeacher.gradelvl_id,
          teacherName: this.selectedTeacher.fname,
          teacherMname: this.selectedTeacher.mname,
          teacherLname: this.selectedTeacher.lname,
          address: this.selectedTeacher.address,
          phone: this.selectedTeacher.phone,
          birthdate: this.selectedTeacher.birthdate,
          section: this.selectedTeacher.section_id,
          gender: this.selectedTeacher.gender, 
          department: this.selectedTeacher.dept_id,
          email: this.selectedTeacher.user.email
        });

  
        this.cdr.detectChanges();
  
        this.authService.getSectionsByDeptGL(this.selectedTeacher.department, this.selectedTeacher.gradelvl_id).subscribe(
          (data: GradeLevelResponse) => {
            this.sections = data.sections;
  
            const section = this.sections.find((section) => section.section_id === this.selectedTeacher.section_id);
            if (section) {
              this.selectedSectionName = section.name; 
            }
  
            this.form.patchValue({
              section: this.selectedTeacher.section_id,
            });
          },
          (error) => {
            console.error('Error fetching sections', error);
          }
        );
  
        this.onDepartmentChange();
      },
      (error) => {
        console.error('Error fetching teacher data:', error);
      }
    );
  }

  updateSelectedTeacher(teacher: any) {
    this.selectedTeacher = {
      teacher_id: teacher.id,
      grlevel: teacher.gradelvl_id,
      dept_id: teacher.dept_id,
      teacherName: teacher.fname,
      teacherMname: teacher.mname,
      teacherLname: teacher.lname,
      address: teacher.address,
      phone: teacher.phone,
      gender: teacher.gender,
      birthdate: teacher.birthdate,
      section_id: teacher.section_id,
      user: {
        email: teacher.email
      }
    };
  
    if (teacher.user && teacher.user.email) {
      this.selectedTeacher.email = teacher.user.email;
    }
  }

  saveEditedSubject() {
    if (!this.selectedTeacher || !this.selectedTeacher.teacher_id) {
      console.error('Invalid selected subject:', this.selectedTeacher);
      return;
    }
    
    const teacherId = this.selectedTeacher.teacher_id;
    this.selectedTeacher.gradelvl_id = this.form.value.grlevel;
  
    const updatedTeacherData = {
      teacher:{
        dept_id: this.form.value.department,
        section_id: this.form.value.section,
        fname: this.form.value.teacherName,
        mname: this.form.value.teacherMname,
        lname: this.form.value.teacherLname,
        address: this.form.value.address,
        phone: this.form.value.phone,
        gender: this.form.value.gender,
        birthdate: this.form.value.birthdate,
        gradelvl_id: this.form.value.grlevel
      }
      
    };
    Object.assign(this.selectedTeacher, updatedTeacherData);
  
    this.authService.editTeacher(teacherId, this.selectedTeacher).subscribe(
      () => {
        this.showAlert = true;
  
        setTimeout(() => {
          this.hideAlert();
        }, 3000);
      },
      (error) => {
        this.showAlert = false;
        console.log(error)

        if (error.error && error.error.error === 'Section already assigned to another teacher.') {
          this.sectionAssignmentError = error.error.error;
          console.log('error', this.sectionAssignmentError); 
        }
      }
    );
  }

  clearSectionError() {
    this.sectionAssignmentError = '';
  }
  
  
  
  deleteTeacher(teacherId:any){
  
    const confirmDelete = window.confirm('Are you sure you want to delete this subject?');
  
    if (confirmDelete) {
      this.authService.deleteTeacher(teacherId).subscribe(
        (response) => {
          this.filteredTeacher = this.filteredTeacher.filter((s) => s.id !== teacherId);
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
    if (this.selectedTeacher.grlevel !== null && this.selectedTeacher.department !== null) {

      this.authService.getSectionsByDeptGL(this.selectedTeacher.department, this.selectedTeacher.gradelvl_id).subscribe(
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
    if (this.selectedTeacher.dept_id !== null) {

      this.selectedDepartment = this.selectedTeacher.department;

      this.authService.getGradelevelsByDept(this.selectedTeacher.department).subscribe(
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
