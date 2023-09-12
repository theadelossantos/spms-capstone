import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-courses-elem',
  templateUrl: './courses-elem.component.html',
  styleUrls: ['./courses-elem.component.css']
})
export class CoursesElemComponent {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      grlevel: [this.selectedSubject.gradeLevel], 
      courseName: [this.selectedSubject.courseName]
    });
  }
  gradelvl: any[] = [];
  selectedGradeLevel: any = null;
  filteredCourses: any[] = [];
  selectedSubject: any = {};
  departmentId: string;
  form: FormGroup;
  gradeLevel: string = ''; 
  courseName: string = '';

  successMessage: string = '';
  errorMessage:string = '';
  showAlert: boolean = false;
  

  ngOnInit(): void {
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);

    });

    this.form = this.fb.group({
      grlevel: [this.selectedSubject?.gradeLevel],
      courseName: [this.selectedSubject?.courseName]
  });
    
  }
  
  
  
  

  manageClasses(departmentId: number, gradelvlId: number) {
    if (!gradelvlId) {
      console.error("Invalid gradelvlId:", gradelvlId);
      return;
    }
  
    this.authService.filterElemCourses(gradelvlId).subscribe(
      (data) => {
        this.selectedGradeLevel = this.gradelvl.find((level) => level.gradelvl_id === gradelvlId);
        this.filteredCourses = data.subjects;

        console.log("filtered courses:", this.filteredCourses)
  
        if (this.filteredCourses.length > 0) {
          this.selectedSubject = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            courseName: this.filteredCourses[0].subject_name,
            subject_id: this.filteredCourses[0].id,
            dept_id: this.selectedGradeLevel.dept_id,
          };
        } else {
          this.selectedSubject = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            courseName: '', 
            subject_id: null, 
            dept_id: this.selectedGradeLevel.dept_id,
          };
        }
      },
      (error) => {
        console.error("Error fetching subjects:", error);
      }
    );
  }
  

  saveEditedSection() {
    if (this.selectedSubject && this.selectedSubject.subject_id) {
      const subjectId = this.selectedSubject.subject_id;
      this.selectedSubject.gradelvl_id = this.form.value.grlevel;

      const updatedSubjectData = {
        gradelvl_id: this.form.value.grlevel,
        subject_name: this.form.value.courseName
      };
      this.selectedSubject.gradelvl_id = updatedSubjectData.gradelvl_id;
      this.selectedSubject.courseName = updatedSubjectData.subject_name;

      this.authService.editSubject(subjectId, updatedSubjectData).subscribe(
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
      console.error('Invalid selected subject:', this.selectedSubject);
    }
    
  }
  hideAlert() {
    this.showAlert = false;
  }

  logSelectedSection(){
    console.log('Selected Subject:', this.selectedSubject);

  }
  editSection(subject: any) {
    console.log('Selected Section:', subject);
  
    this.selectedSubject = {
      subject_id: subject.id,
      grlevel: subject.gradelvl_id,
      courseName: subject.subject_name,
    };
  
    this.form.patchValue({
      grlevel: this.selectedSubject.grlevel,
      courseName: this.selectedSubject.courseName,
    });
  }

  deleteSubject(subjectId: number) {
    console.log('Deleting subject with ID:', subjectId);
  
    const confirmDelete = window.confirm('Are you sure you want to delete this subject?');
  
    if (confirmDelete) {
      console.log('Before API call - subjectId:', subjectId);
      this.authService.deleteSubject(subjectId).subscribe(
        (response) => {
          this.filteredCourses = this.filteredCourses.filter((s) => s.id !== subjectId);
        },
        (error) => {
          console.error('Error deleting subject: ', error);
        }
      );
    }
  }
    
  
    
}
