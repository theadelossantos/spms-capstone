import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-elem-courses',
  templateUrl: './add-elem-courses.component.html',
  styleUrls: ['./add-elem-courses.component.css']
})
export class AddElemCoursesComponent {
  ValidationFormUser: FormGroup; 
  subjects: string[] = [];
  gradelvl: any[] = [];
  selectedGradeLevel:any = null;
  selectedDepartment: string = '';

  
  departmentId: string;
  departmentName: string;
  grlevel : string = "";
  subject : string = "";

  successMessage: string = '';
  errorMessage:string = '';
  showAlert: boolean = false;
 
  validationMessages = {
    grlevel: [{type: "required", message: "Choose Grade Level"}],
    subject: [{type: "required", message: "Enter Subject Name"}],
  }

  

  constructor(private formbuilder:FormBuilder, private authService: AuthService) {

    this.ValidationFormUser = this.formbuilder.group({
      grlevel: new FormControl ('null', Validators.compose([
        Validators.required
      ])),
      subject: new FormControl('',Validators.compose([
        Validators.required
      ])),
    });
  }

  capitalizeFirstLetter(event: any, controlName: string): void {
    const input = event.target;
    const value = input.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    this.ValidationFormUser.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
  }


  addSubject(){
    if(this.ValidationFormUser.valid){
      const subjectData = {
        dept_id: 1,
        gradelvl_id: this.ValidationFormUser.get('grlevel').value.gradelvl_id,
        subject_name: this.ValidationFormUser.get('subject').value
      };

      this.authService.addElemSubject(subjectData).subscribe(
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
    }
  }

  hideAlert() {
    this.showAlert = false;
  }


  ngOnInit() {
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);
      
    });
  }

}
