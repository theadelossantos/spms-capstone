import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
interface GradeLevelResponse {
  gradelevels: any[]; 
  sections:any[];
  
}

@Component({
  selector: 'app-assign-teacher',
  templateUrl: './assign-teacher.component.html',
  styleUrls: ['./assign-teacher.component.css']
})
export class AssignTeacherComponent {
  @Input() teacherId: number | null = null;
  @Input() teacherData: any = {};

  showAlert:boolean = false;
  sectionAssignmentError: string = '';
  assignments: FormArray;
  gradelvl: any [] = [];
  departments: any[] = [];
  form: FormGroup;
  errorMessage: string = '';
  gradeLevels: any[] = [];
  sections: any[] = [];
  subjects: any[] = [];
  teacherLastName: string = '';
  teacherFirstName: string = ''
  assignmentData: {
    department: number | null;
    gradeLevel: number | null;
    gradeLevels: any[];
    section: number | null;
    sections: any[];
    subject: any [];
  }[] = [{ department: null, gradeLevel: null, gradeLevels: [], section: null, sections: [], subject:[] }];  successMessage: string = ''
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      assignments: this.fb.array([
        this.createTeacherFormGroup()
      ]),
    });

    this.assignments = this.form.get('assignments') as FormArray;  
  }

  createTeacherFormGroup() {
    return this.fb.group({
      department: ['', Validators.required], 
      grlevel: [''],
      section: [''],
      subject:['']
    });
  }

  ngOnInit(): void {
    this.authService.getGradeLevels().subscribe((data) => {
      this.gradelvl = data;
    });
    
    this.authService.getDepartments().subscribe((response: any) => {
      this.departments = response.departments;
  
    
    });
        console.log('Teacher Data:', this.teacherData);

  }

  addSubject() {
    this.assignments.push(this.createTeacherFormGroup());
  
    this.assignmentData.push({
      department: null,
      gradeLevel: null,
      gradeLevels: [],
      section: null,
      sections: [],
      subject: []
    });
  }

  removeAssignment(index: number) {
    this.assignments.removeAt(index);
    
    this.assignmentData.splice(index, 1);
  }

  hideAlert() {
    this.showAlert = false;
  }

  clearSectionError() {
    this.sectionAssignmentError = '';
  }

  onDepartmentChange(index: number) {
    const selectedDepartment = this.assignments.at(index).get('department').value;
    if (selectedDepartment !== null) {
      console.log('Selected Department ID:', selectedDepartment);
  
      this.authService.getGradelevelsByDept(selectedDepartment).subscribe(
        (data: GradeLevelResponse) => {
          this.assignmentData[index].gradeLevels = data.gradelevels;
          console.log(this.assignmentData[index].gradeLevels);
        },
        (error) => {
          console.error('Error fetching grade levels', error);
        }
      );
    }
  }
  
  onGradeLevelChange(index: number) {
    const selectedGradeLevel = this.assignments.at(index).get('grlevel').value;
    const selectedDepartment = this.assignments.at(index).get('department').value;
  
    if (selectedGradeLevel !== null && selectedDepartment !== null) {
      console.log('Selected Grade Level ID:', selectedGradeLevel);
  
      this.authService.getSectionsByDeptGL(selectedDepartment, selectedGradeLevel).subscribe(
        (data: GradeLevelResponse) => {
          this.assignmentData[index].sections = data.sections;
          console.log('section', this.assignmentData[index].sections);

          this.authService.getSubjectsByDeptGL(selectedDepartment, selectedGradeLevel).subscribe(
            (subjectData: any) => {
              this.assignmentData[index].subject = subjectData.subjects;
              console.log('Subjects:', this.assignmentData[index].subject);
            },
            (subjectError) => {
              console.error('Error fetching subjects', subjectError);
            }
          );
        },
        (error) => {
          console.error('Error fetching sections', error);
        }
      );
    } else {
      this.assignmentData[index].sections = [];
    }
  }
  
  assignSubject() {
    console.log('Teacher ID in child component:', this.teacherData.teacher_id);
    if (!this.teacherData || !this.teacherData.teacher || !this.teacherData.teacher.teacher_id) {
        console.error('Teacher data is missing or incomplete.');
        return;
    }

    const assignmentsData = this.form.value.assignments.map((assignment: any) => {
        return {
            teacher: this.teacherData.teacher.teacher_id,
            subject_id: assignment.subject,
            dept_id: assignment.department,
            gradelvl_id: assignment.grlevel,
            section_id: assignment.section
        };
    });

    if (assignmentsData.length === 0) {
        console.error('No assignments to create.');
        return;
    }

    this.showAlert = false;

    this.authService.createAssignment(assignmentsData).subscribe(
        (response) => {
          setTimeout(() => {
            this.hideAlert();
          }, 3000);
            console.log('Assignments created successfully:', response);
            this.showAlert = true;
            this.successMessage = 'Assignments created successfully.';
        },
        (error) => {
          setTimeout(() => {
            this.hideAlert();
          }, 3000);
            console.error('Error creating assignments:', error);
            this.showAlert = true;
            this.errorMessage = 'Subject is already assigned.';
        }
    );
}

}
