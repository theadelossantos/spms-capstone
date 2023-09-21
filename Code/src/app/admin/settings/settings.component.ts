import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  user: any; 
  form: FormGroup;
  adminInfo: any = {}
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
      this.authService.getAdminProfile().subscribe((userData: any) => {
        this.user = userData; 
        console.log(userData)
        console.log(userData.fname)
  
        this.adminInfo = userData
        console.log('adminInfo', this.adminInfo)
  
        this.form.patchValue({
          studentName: this.adminInfo.fname,
          studentMname: this.adminInfo.mname,
          studentLname: this.adminInfo.lname,
          address: this.adminInfo.address,
          phone: this.adminInfo.phone,
          birthdate: this.adminInfo.birthdate,
          gender: this.adminInfo.gender, 
          email: this.adminInfo.user.email
        });
      });
    }
}
