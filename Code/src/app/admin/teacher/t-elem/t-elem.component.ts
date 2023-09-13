import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-t-elem',
  templateUrl: './t-elem.component.html',
  styleUrls: ['./t-elem.component.css']
})
export class TElemComponent {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email:[this.selectedTeacher.email],
      password:[this.selectedTeacher.password],
      grlevel: [this.selectedTeacher.gradeLevel], 
      teacherName: [this.selectedTeacher.teacherName],
      teacherMname:[this.selectedTeacher.teacherMname],
      teacherLname:[this.selectedTeacher.teacherLname],
      address:[this.selectedTeacher.address],
      phone:[this.selectedTeacher.phone],
      gender:[this.selectedTeacher.gender],
      section: [this.selectedTeacher.section],
      subject: [this.selectedTeacher.subject],
      birthdate:[this.selectedTeacher.birthdate]
    });
  }
  form: FormGroup;
  gradelvl: any [] = [];
  selectedGradeLevel: any = null;
  filteredTeacher: any[] = [];
  selectedTeacher: any = {};
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


  successMessage: string = '';
  errorMessage: string = '';
  showAlert:boolean = false;

  ngOnInit():void{
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('GradeLevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl)
    });
    
    this.form = this.fb.group ({
      email:[this.selectedTeacher?.email],
      password:[this.selectedTeacher?.password],
      grlevel: [this.selectedTeacher?.gradeLevel], 
      teacherName: [this.selectedTeacher?.teacherName],
      teacherMname:[this.selectedTeacher?.teacherMname],
      teacherLname:[this.selectedTeacher?.teacherLname],
      address:[this.selectedTeacher?.address],
      phone:[this.selectedTeacher?.phone],
      gender:[this.selectedTeacher?.birthdate],
      section: [this.selectedTeacher?.section],
      subject: [this.selectedTeacher?.subject],
      birthdate:[this.selectedTeacher?.birthdate]
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
        console.log(this.selectedGradeLevel)
        this.filteredTeacher = data.teachers

        console.log("Filtered Teachers:", this.filteredTeacher)

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
            subject: this.filteredTeacher[0].subject_id,
            dept_id: this.selectedGradeLevel.dept_id
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
            subject: null,
            dept_id: null
          };
        }
      },
      (error) => {
        console.error("Error fetching subjects:", error);
      }
    )
  }

  editTeacher(teacher: any){
    console.log('Selected Section:', teacher);
  
    this.selectedTeacher = {
      teacher_id: teacher.id,
      grlevel: teacher.gradelvl_id,
      section: teacher.section_id,
      subject: teacher.subject_id,
      dept_id: teacher.dept_id,
      teacherName: teacher.fname,
      teacherMname: teacher.mname,
      teacherLname: teacher.lname,
      address: teacher.address,
      phone: teacher.phone,
      birthdate: teacher.birthdate,
    };
  
    this.form.patchValue({
      grlevel: this.selectedTeacher.grlevel,
      teacherName: this.selectedTeacher.teacherName,
      teacherMname: this.selectedTeacher.teacherMname,
      teacherLname: this.selectedTeacher.teacherLname,
      address: this.selectedTeacher.address,
      phone: this.selectedTeacher.phone,
      birthdate: this.selectedTeacher.birthdate,
      section: this.selectedTeacher.section,
      subject: this.selectedTeacher.subject

    });
  }

  saveEditedSubject(){
    if (this.selectedTeacher && this.selectedTeacher.teacher_id) {
      const teacherId = this.selectedTeacher.teacher_id;
      this.selectedTeacher.gradelvl_id = this.form.value.grlevel;

      const updatedTeacherData = {
        gradelvl_id: this.form.value.grlevel,
        section_id: this.form.value.section,
        subject_id: this.form.value.subject,
        fname: this.form.value.teacherName,
        mname: this.form.value.teacherMname,
        lname: this.form.value.teacherLname,
        address: this.form.value.address,
        phone: this.form.value.phone,
        gender: this.form.value.gender,
        birthdate: this.form.value.birthdate
      };
      this.selectedTeacher.gradelvl_id = updatedTeacherData.gradelvl_id;
      this.selectedTeacher.section_id = updatedTeacherData.section_id;
      this.selectedTeacher.subject_id = updatedTeacherData.subject_id;
      this.selectedTeacher.fname = updatedTeacherData.fname;
      this.selectedTeacher.mname = updatedTeacherData.mname;
      this.selectedTeacher.lname = updatedTeacherData.lname;
      this.selectedTeacher.address = updatedTeacherData.address;
      this.selectedTeacher.phone = updatedTeacherData.phone;
      this.selectedTeacher.gender = updatedTeacherData.gender;
      this.selectedTeacher.birthdate = updatedTeacherData.birthdate;

      this.authService.editTeacher(teacherId, updatedTeacherData).subscribe(
        (response) => {

          this.showAlert = true;

          setTimeout(() => {
            this.hideAlert();
          }, 3000);
        },
        (error) => {
          this.showAlert = true;
        }
      );
    } else {
      console.error('Invalid selected subject:', this.selectedTeacher);
    }
    
  }
  
  deleteTeacher(teacherId:any){
    console.log('Deleting subject with ID:', teacherId);
  
    const confirmDelete = window.confirm('Are you sure you want to delete this subject?');
  
    if (confirmDelete) {
      console.log('Before API call - subjectId:', teacherId);
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

  addSubject(){

  }

  removeAssignment(){

  }

  
}
