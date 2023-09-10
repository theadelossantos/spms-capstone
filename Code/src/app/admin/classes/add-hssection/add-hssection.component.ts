import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, Form} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-hssection',
  templateUrl: './add-hssection.component.html',
  styleUrls: ['./add-hssection.component.css']
})
export class AddHssectionComponent {
  ValidationFormUser: FormGroup; 
  sections: string[] = [];
  gradelvl: any[] = [];
  selectedGradeLevel:any = null;
  selectedDepartment: string = '';

  
  departmentId: string;
  departmentName: string;
  grlevel : string = "";
  section : string = "";

  successMessage: string = '';
  errorMessage:string = '';
 
  validationMessages = {
    grlevel: [{type: "required", message: "Choose Grade Level"}],
    section: [{type: "required", message: "Enter Section Name"}],
  }

  

  constructor(private formbuilder:FormBuilder, private authService: AuthService) {

    this.ValidationFormUser = this.formbuilder.group({
      grlevel: new FormControl ('null', Validators.compose([
        Validators.required
      ])),
      section: new FormControl('',Validators.compose([
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


  addSection(){
    if(this.ValidationFormUser.valid){
      const sectionData = {
        dept_id: 2,
        gradelvl_id: this.ValidationFormUser.get('grlevel').value.gradelvl_id,
        section_name: this.ValidationFormUser.get('section').value
      };

      this.authService.addHsSection(sectionData).subscribe(
        (response) => {
          this.successMessage = 'Section Added Successfully';
          this.errorMessage = ''
          this.ValidationFormUser.reset();
        },
        (error) => {
          this.errorMessage = 'Error adding Section';
          this.successMessage = '';
          
        }
      );
    }
  }


  ngOnInit() {
    this.authService.getHsGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);
      
    });
  }


}
