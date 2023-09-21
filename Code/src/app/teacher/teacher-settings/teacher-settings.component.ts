import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.css']
})
export class TeacherSettingsComponent {
  user: any; 
  form: FormGroup;
  teacherInfo: any = {}
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
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
      console.log(userData.fname)

      this.teacherInfo = userData
      console.log('teacher info', this.teacherInfo)

      this.form.patchValue({
        studentName: this.teacherInfo.fname,
        studentMname: this.teacherInfo.mname,
        studentLname: this.teacherInfo.lname,
        address: this.teacherInfo.address,
        phone: this.teacherInfo.phone,
        birthdate: this.teacherInfo.birthdate,
        gender: this.teacherInfo.gender, 
        email: this.teacherInfo.user.email
      });
    });
  }
}
