import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  ValidationFormUser: FormGroup;
  emailExistsError: boolean = false;
  phoneError: boolean = false;
  subjects: string[] = [];
  gradeLevels: string[] = [];
  gradeLevelss: string[] = [];
  assignments: FormArray;
  sections: string[] = [];
  sectionId: string = '';
  sectionIds: number[] = [];
  selectedDate: Date = new Date();
  showDatePicker: boolean = false;

  fname : string = "";
  mname : string = "";
  lname : string = "";
  address : string = "";
  phone : string = "";
  gender : string = "";
  birthdate:string= "";
  department: string = "";
  gradelevel : string = "";
  gradelevel1 : string = "";
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
    gradelevel1:[{type:"required", message:"Choose Grade Level"}],
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
  // dateValue = format(new Date(),'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedString = '';

  

  constructor(private formbuilder:FormBuilder) {

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
      birthdate: new FormControl('',Validators.compose([])),
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      assignments: this.formbuilder.array([]),
    });
    this.assignments = this.ValidationFormUser.get('assignments') as FormArray;
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
  
  addSubject(){
    const assignment = this.formbuilder.group({
      gradelevel:['',Validators.required],
      subjects: new FormControl([], Validators.required),
    });
    this.assignments.push(assignment);
  }

  removeAssignment(index: number){
    this.assignments.removeAt(index);
  }

  ngOnInit(){
    this.addSubject();

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

}
