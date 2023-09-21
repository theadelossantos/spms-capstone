import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-student-settings',
  templateUrl: './student-settings.component.html',
  styleUrls: ['./student-settings.component.css']
})
export class StudentSettingsComponent {
  user: any; 
  form: FormGroup;
  studentInfo: any = {}
  fname: string = ''
  mname: string = ''
  lname:string = ''
  email:string=''
  address: string = ''
  phone: string = ''
  gender: string = ''
  birthdate: string = ''

  constructor(private authService: AuthService, private fb: FormBuilder,) {
    this.form = this.fb.group({
      email: [this.email],
      studentName: [this.fname],
      studentMname: [this.mname],
      studentLname: [this.lname],
      address: [this.address],
      phone: [this.phone],
      gender: [this.gender],
      birthdate: [this.birthdate],
    });
  }
    ngOnInit(): void {
      this.authService.getStudentProfile().subscribe((userData: any) => {
        this.user = userData; 
        console.log(userData)
        console.log(userData.fname)
  
        this.studentInfo = userData
        console.log('studentInfo', this.studentInfo)
  
        this.form.patchValue({
          studentName: this.studentInfo.fname,
          studentMname: this.studentInfo.mname,
          studentLname: this.studentInfo.lname,
          address: this.studentInfo.address,
          phone: this.studentInfo.phone,
          birthdate: this.studentInfo.birthdate,
          gender: this.studentInfo.gender, 
          email: this.studentInfo.user.email
        });
      });
    }
}
