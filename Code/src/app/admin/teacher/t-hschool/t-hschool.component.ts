import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


interface GradeLevelResponse {
  gradelevels: any[]; 
  sections:any[];
  
}
@Component({
  selector: 'app-t-hschool',
  templateUrl: './t-hschool.component.html',
  styleUrls: ['./t-hschool.component.css']
})
export class THschoolComponent {
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
      assignments: this.fb.array([
        this.createTeacherFormGroup()
      ]),
    });
    this.assignments = this.form.get('assignments') as FormArray;  

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
  assignments: FormArray;
  assignedTeacherId: number | null = null;
  selectedAssTeacher: any = {};
  subjects: any[] = [];
  assignmentData: {
    department: number | null;
    gradeLevel: number | null;
    gradeLevels: any[];
    section: number | null;
    sections: any[];
    subject: any [];
  }[] = [{ department: null, gradeLevel: null, gradeLevels: [], section: null, sections: [], subject:[] }];  
  successMessage: string = ''

  gradelvlAssigned: any [] = [];
  departmentsAssigned: any[] = [];
  gradeLevelsAssigned: any[] = [];
  subjectsAssigned: any[] = [];
  selectedAssignedDepartment: number | null = null;
  selectedAssignedSection: number | null = null;
  selectedAssignedSubject: number | null = null;
  selectedAssignedGradeLevel: number | null = null;
  assignedSubjects: any[] = [];
  sectionsAssigned: any[] = [];


  departments: any[] = [];
  gradeLevels: any[] = [];
  sections: any[] = [];
  selectedDepartment: number | null = null;
  selectedSection: number | null = null;
  selectedSubject: number | null = null;

  errorMessage: string = '';
  showAlert:boolean = false;
  
  createTeacherFormGroup() {
    return this.fb.group({
      department: ['', Validators.required], 
      grlevel: ['', Validators.required],
      section: ['', Validators.required],
      subject:['', Validators.required]
    });
  }

  ngOnInit():void{


    this.authService.getHsGradeLevels().subscribe((data) => {
      this.gradelvl = data;
    });
    
    this.authService.getDepartments().subscribe((response: any) => {
      this.departments = response.departments;
      console.log('Departments:', this.departments);
  
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

    this.authService.filterHsTeachers(gradelvlId).subscribe(
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

  onDeleteItem(index:number){
    const assignment = this.assignedSubjects[index];
    const assignIdToDelete = assignment.id;

    const confirmDelete = window.confirm('Are you sure you want to delete this item?');

    if(confirmDelete){
      console.log(assignIdToDelete)
      this.assignedSubjects.splice(index, 1);
  
      
      this.authService.delAssignments(assignIdToDelete).subscribe(
          () => {
              // Item deleted successfully from the backend
          },
          (error) => {
              console.error('Error deleting item:', error);
          }
      );

    }
  }

  fetchAssignedDataForTeacher(teacherId: number) {
    this.authService.getAssignments(teacherId).subscribe(
      (data: any[]) => {
        const assignmentsWithNames = [];
  
        data.forEach((assignment) => {
          const assignmentDetails = {
            id:assignment.id,
            subjectName: '',
            departmentName: '',
            gradeLevelName: '',
            sectionName: '',
          };
          this.authService.getSubjectById(assignment.subject_id).subscribe(
            (subjectData: any) => {
              assignmentDetails.subjectName = subjectData.subjects[0].subject_name;

            },
            (error) => {
              console.error('Error fetching subject name:', error);
            }
          );
  
          this.authService.getDepartmentById(assignment.dept_id).subscribe(
            (deptData: any) => {
              assignmentDetails.departmentName = deptData.departments[0].dept_name;
            },
            (error) => {
              console.error('Error fetching department name:', error);
            }
          );
  
          this.authService.getGradeLevelById(assignment.gradelvl_id).subscribe(
            (gradeLevelData: any) => {
              assignmentDetails.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
            },
            (error) => {
              console.error('Error fetching grade level name:', error);
            }
          );
  
          this.authService.getSectionById(assignment.section_id).subscribe(
            (sectionData: any) => {
              assignmentDetails.sectionName = sectionData.sections[0].section_name;
            },
            (error) => {
              console.error('Error fetching section name:', error);
            }
          );
  
          assignmentsWithNames.push(assignmentDetails);
        });
  
        this.assignedSubjects = assignmentsWithNames;
      },
      (error) => {
        console.error('Error fetching assigned data:', error);
      }
    );
  }

  assignTeacher(teacherId){
    this.selectedAssTeacher = {}; 

    this.authService.getTeacherById(teacherId).subscribe(
      (teacherDetails: any) => {
        console.log('Response Dataa:', teacherDetails);
        this.selectedAssTeacher = {
          lastName: teacherDetails.teacher.lname,
          firstName: teacherDetails.teacher.fname,
          teacherId: teacherDetails.teacher.teacher_id
        };
        console.log('Selected Teacher:', this.selectedAssTeacher);
        console.log('Teacher Id', this.selectedAssTeacher.teacherId)
      },
      (error) => {
        console.error('Error fetching teacher details:', error);
      }
    );
  }

  onAssDepartmentChange(index: number) {
    const selectedAssignedDepartment = this.assignments.at(index).get('department').value;
    if (selectedAssignedDepartment !== null) {
      console.log('Selected Department ID:', selectedAssignedDepartment);

      this.assignmentData[index].department = selectedAssignedDepartment;
  
      this.authService.getGradelevelsByDept(selectedAssignedDepartment).subscribe(
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
  
  onAssGradeLevelChange(index: number) {
    const selectedAssignedGradeLevel = this.assignments.at(index).get('grlevel').value;
    const selectedAssignedDepartment = this.assignments.at(index).get('department').value;

  
    if (selectedAssignedGradeLevel !== null && selectedAssignedDepartment !== null) {
      console.log('Selected Grade Level ID:', selectedAssignedGradeLevel);
      

      this.assignmentData[index].gradeLevel = selectedAssignedGradeLevel;

      this.authService.getSectionsByDeptGL(selectedAssignedDepartment, selectedAssignedGradeLevel).subscribe(
        (data: GradeLevelResponse) => {
          this.assignmentData[index].sections = data.sections;
          console.log('section', this.assignmentData[index].sections);

          this.authService.getSubjectsByDeptGL(selectedAssignedDepartment, selectedAssignedGradeLevel).subscribe(
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

  onSectionChange(event: Event, index: number) {
    const selectedAssignedSection = this.assignments.at(index).get('section').value;
    console.log('Selected Section ID:', selectedAssignedSection);

    this.assignmentData[index].section = selectedAssignedSection;

  }
  
  onSubjectChange(event: Event, index: number) {
    const selectedAssignedSubject = this.assignments.at(index).get('subject').value;
    console.log('Selected Subject ID:', selectedAssignedSubject);
  }

  assignSubject() {    
    const assignmentsData = this.form.value.assignments.map((assignment: any) => ({
      teacher: +this.selectedAssTeacher.teacherId,
      subject_id: +assignment.subject,
      gradelvl_id: +assignment.grlevel,
      section_id: +assignment.section,
      dept_id: +assignment.department
    }));
    
      
  console.log('assignmentData', assignmentsData);


    this.authService.createAssignment({ assignments: assignmentsData }).subscribe(
        (response) => {
            this.showAlert = true;
            setTimeout(() => {
              this.hideAlert();
            }, 3000);
            this.successMessage = 'Assignments created successfully.';
            this.form.reset();
        },
        (error) => {
            console.error('Error creating assignments:', error);
            this.showAlert = true;
            setTimeout(() => {
              this.hideAlert();
            }, 3000);
            this.errorMessage = 'Error creating assignments.';
        }
    );
}

  editTeacher(teacher: any) {
    const teacherId = teacher.id;
    console.log('teacherid:', teacher.id)
    this.authService.getTeacherById(teacherId).subscribe(
      (data) => {
        console.log('Fetched Teacher Data:', data);
        this.selectedTeacher = data.teacher;
        console.log('Teacher Data:', this.selectedTeacher);

        
        console.log('Selected Teacher Email:', this.selectedTeacher.user.email);
        console.log('Selected Teacher Gender:', this.selectedTeacher.gender);
        console.log('Selected Grade Level', this.selectedTeacher.gradelvl_id)
        console.log('Selected Department', this.selectedTeacher.dept_id)
        console.log('Selected Section', this.selectedTeacher.section_id)
        
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

        console.log('teacher id',this.selectedTeacher.user.id)

  
        this.cdr.detectChanges();
  
        this.authService.getSectionsByDeptGL(this.selectedTeacher.department, this.selectedTeacher.gradelvl_id).subscribe(
          (data: GradeLevelResponse) => {
            console.log('API Response', data);
            this.sections = data.sections;
            console.log('Sections:', this.sections);
  
            const section = this.sections.find((section) => section.section_id === this.selectedTeacher.section_id);
            if (section) {
              this.selectedSectionName = section.name; 
              console.log('Selected Section Name:', this.selectedSectionName);
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
        this.sectionAssignmentError = '';

        this.showAlert = true;
        
        setTimeout(() => {
          this.hideAlert();
        }, 3000);


      },
      (error) => {
        this.showAlert = true;
        setTimeout(() => {
          this.hideAlert();
        }, 3000);
        console.log('Error', error);
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

  onGradeLevelChange(): void {
    if (this.selectedTeacher.grlevel !== null && this.selectedTeacher.department !== null) {
      console.log('ongrlvlchange Selected Grade Level', this.selectedTeacher.gradelvl_id);
      console.log('ongrlvlchange Selected Department', this.selectedTeacher.department);

      this.authService.getSectionsByDeptGL(this.selectedTeacher.department, this.selectedTeacher.gradelvl_id).subscribe(
        (data: GradeLevelResponse) => {
          console.log('API Response', data);
          this.sections = data.sections;
          console.log('Sections:', this.sections);
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
      console.log('Selected Department', this.selectedTeacher.department)

      this.selectedDepartment = this.selectedTeacher.department;

      this.authService.getGradelevelsByDept(this.selectedTeacher.department).subscribe(
        (data: GradeLevelResponse) => { 
          this.gradeLevels = data.gradelevels;
          console.log('Grade Levels:', this.gradeLevels);
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
