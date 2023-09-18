import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

interface GradeLevelResponse {
  gradelevels: any[]; 
  sections:any[];
}


@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {

  ValidationFormUser: FormGroup;
  emailExistsError: string = '';
  phoneError: boolean = false;
  subjects: string[] = [];
  gradeLevels: any[] = [];
  gradeLevelss: string[] = [];
  sections: any[] = [];
  sectionId: string = '';
  sectionIds: number[] = [];
  selectedDate: Date = new Date();
  showDatePicker: boolean = false;
  departments: any[] = [];
  filteredSections: any[] = [];
  selectedDepartment: number | null = null;
  selectedGradeLevel: number | null = null;
  selectedSection: number | null = null;
  birthdateControl = new FormControl(this.selectedDate, Validators.compose([]));
  sectionAssignmentError: string = '';
  errorMessage:string = '';
  showAlert: boolean = false;

  fname : string = "";
  mname : string = "";
  lname : string = "";
  address : string = "";
  phone : string = "";
  gender : string = "";
  birthdate:string= "";
  department: string ="";
  gradelevel : string = "";
  section : string = "";
  email : string = "";
  password : string = "";
  validationMessages = {
    fname: [{type: "required", message: "Enter First Name"}],
    lname: [{type: "required", message: "Enter Last Name"}],
    address: [{type: "required", message: "Enter Address"}],
    phone:[
      {type: "required", message:"Enter Phone Number"},
      {type: 'pattern', message: 'Incorrect Phone Number'},
      {type: 'minlength', message: 'Phone Number must be 11 digits'}],
    gender:[{type: "required", message: "Select Gender"}],
    department:[{type: "required", message: "Choose Department"}],
    gradelevel:[{type:"required", message:"Choose Grade Level"}],
    section:[{type:"required", message:"Choose section"}],
    email:[
      {type:"required", message:"Enter Email Address"},
      {type:"pattern", message:"Incorrect Email Address"}
    ],  
    password: [
      {type: "required", message:"Password required"},
      {type: "minLength", message:"Password must be atleast 5 characters"}
    ],
    
    
    
  }
  selectedMode = 'date';
  showPicker = false;
  formattedString = '';

  

  constructor(private formbuilder:FormBuilder, private authService: AuthService) {

    // this.setToday();

    this.ValidationFormUser = this.formbuilder.group({
      fname: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      mname: new FormControl(''),
      lname: new FormControl('',Validators.compose([
        Validators.required
      ])),
      address: new FormControl('',Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ])),
      gender: new FormControl('',Validators.compose([
        Validators.required
      ])),
      department: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gradelevel: new FormControl('',Validators.compose([
        Validators.required
      ])),
      section: new FormControl('',Validators.compose([
        Validators.required
      ])),
      birthdate: this.birthdateControl,
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      
    });
  }

  capitalizeFirstLetter(event: any, controlName: string): void {
    const input = event.target;
    const value = input.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    this.ValidationFormUser.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
  }

  restrictNonNumeric(event: any) {
    const input = event.target;
    const numericValue = input.value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 11) {
      input.value = numericValue.slice(0, 11);
    } else {
      input.value = numericValue;
    }
    
    this.ValidationFormUser.patchValue({ phone: input.value });
    this.phoneError = false;
  }
  

  ngOnInit(gradelvlId:number){

    this.authService.getDepartments().subscribe(
      (response:any) => {
      this.departments = response.departments;
      console.log('Departments:', this.departments);
    })

    

    this.gradeLevels = [];

  }

  onDepartmentChange(selectedDepartment: number | null): void {
    if (selectedDepartment !== null) {
      this.authService.getGradelevelsByDept(selectedDepartment).subscribe(
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

  onGradeLevelChange(selectedGradeLevel: number | null, selectedDepartment: number | null): void {
    if (selectedGradeLevel !== null && selectedDepartment !== null) {
      console.log('Selected Grade Level', selectedGradeLevel)
      
      this.authService.getSectionsByDeptGL(selectedDepartment, selectedGradeLevel).subscribe(
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
      this.gradeLevels = [];
    }
  }
  
  
  onDateChange(event: any): void {
    const selectedDate: Date = event.target.valueAsDate; 
    if (selectedDate){
      this.selectedDate = selectedDate;
      this.showDatePicker = false;
    }
  }

  
toggleDatePicker() {
  this.showDatePicker = !this.showDatePicker;
}

onSubmit() {
  if (this.ValidationFormUser.valid) {
      const formattedBirthdate = this.formatDate(this.selectedDate);
    
      const teacherData = {
        ...this.ValidationFormUser.value,
        user: {
          email: this.ValidationFormUser.value.email,
          password: this.ValidationFormUser.value.password
        },
        dept_id: this.selectedDepartment,
        gradelvl_id: this.selectedGradeLevel,
        section_id: this.selectedSection,
        fname: this.ValidationFormUser.value.fname,
        mname: this.ValidationFormUser.value.mname,
        lname: this.ValidationFormUser.value.lname,
        address: this.ValidationFormUser.value.address,
        phone: this.ValidationFormUser.value.phone,
        gender: this.ValidationFormUser.value.gender,
        birthdate: formattedBirthdate
      };

      this.authService.addTeacher(teacherData).subscribe(
        (response) => {
          this.showAlert = true;

          setTimeout(() => {
            this.hideAlert();
          }, 3000);
          this.ValidationFormUser.get('gender').setValue('Gender');
          this.ValidationFormUser.reset();
          this.selectedDate = new Date();
          this.birthdateControl.setValue(this.selectedDate);

          this.sectionAssignmentError = '';
          this.emailExistsError = '';

        },
        (error) => {
          console.log('Error', error)
          this.showAlert = false;
          if (error.error && error.error.user_errors && error.error.user_errors.email) {
            this.emailExistsError = error.error.user_errors.email[0];
          } else if (error.error && error.error.error === 'Section already assigned to another teacher.') {
            this.sectionAssignmentError = error.error.error;
          } else {
            this.emailExistsError = 'An unknown error occurred.';
          }
        }
      );
  }
}
hideAlert() {
  this.showAlert = false;
}


formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

clearEmailError() {
  this.emailExistsError = '';
}

clearSectionError() {
  this.sectionAssignmentError = '';
}




}

