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
  dept_id: string = ''
  gradelvl_id: string = ''
  section_id: string = ''
  currentPassword: string = ''
  newPassword: string = ''
  showAlert:boolean = false
  showPasswordAlert: boolean = false
  passwordAlertMessage = '';

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
      dept_id: [this.dept_id],
      gradelvl_id: [this.gradelvl_id],
      section_id: [this.section_id]
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
          email: this.studentInfo.user.email,
          dept_id: this.studentInfo.dept_id,
          gradelvl_id: this.studentInfo.gradelvl_id,
          section_id: this.studentInfo.section_id
        });
      });
    }
    onImageSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const profileImageElement = document.getElementById('profileImage') as HTMLImageElement;
              if (profileImageElement) {
                  profileImageElement.src = e.target.result;
              }
          };
          reader.readAsDataURL(file);
          this.form.get('profile_picture').setValue(file);
      }
  }
  
  
  
  saveChanges() {
    const userChanges = {
      email: this.form.get('email')?.value,
    };
    const hasUserChanges = Object.values(userChanges).some(value => value !== undefined);
  
    const profileData = {
      user: hasUserChanges ? { ...userChanges } : undefined,
      fname: this.form.get('studentName')?.value,
      mname: this.form.get('studentMname')?.value,
      lname: this.form.get('studentLname')?.value,
      address: this.form.get('address')?.value,
      phone: this.form.get('phone')?.value,
      gender: this.form.get('gender')?.value,
      dept_id: this.form.get('dept_id')?.value,
      gradelvl_id: this.form.get('gradelvl_id')?.value,
      section_id: this.form.get('section_id')?.value,
    };
  
    const profilePictureInput = this.form.get('profile_picture');
  
    if (profilePictureInput && profilePictureInput.value) {
      if (profilePictureInput.value instanceof File) {
        profileData['profile_picture'] = profilePictureInput.value;
      } else {
        delete profileData['profile_picture'];
      }
    } else {
      delete profileData['profile_picture'];
    }
    console.log('Is profile_picture a File?', this.form.get('profile_picture')?.value instanceof File);
  
  
    console.log(profileData);
  
    this.authService.updateStudentProfile(profileData).subscribe(
      (response: any) => {
        this.showAlert = true
        setTimeout(() => {
          this.hideAlert();
        }, 3000)
  
      },
      (error: any) => {
        console.error('Error updating profile:', error);
      }
    );
  }
  
  changePassword() {
    const password = {
      current_password: this.currentPassword,
      new_password: this.newPassword
    };
  
    this.authService.changePassword(password).subscribe(
      response => {
        this.showAlert = false; 
        this.showPasswordAlert = true; 
        setTimeout(() => {
          this.hidePasswordAlert();
        }, 3000);
      },
      error => {
        if (error.error && error.error.current_password) {
          this.passwordAlertMessage = error.error.current_password[0];
          this.showAlert = false;
          this.showPasswordAlert = true; 
          setTimeout(() => {
            this.hidePasswordAlert();
          }, 3000);
        } else {
          console.error('Error changing password', error);
        }
      }
    );
  }
  
  hidePasswordAlert() {
    this.showPasswordAlert = false;
  }
  
  hideAlert() {
    this.showAlert = false;
  }
  
}
