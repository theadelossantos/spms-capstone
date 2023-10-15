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
      teacherName: [this.fname],
      teacherMname: [this.mname],
      teacherLname: [this.lname],
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
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
      console.log(userData.fname)

      this.teacherInfo = userData
      console.log('teacher info', this.teacherInfo)

      this.form.patchValue({
        teacherName: this.teacherInfo.fname,
        teacherMname: this.teacherInfo.mname,
        teacherLname: this.teacherInfo.lname,
        address: this.teacherInfo.address,
        phone: this.teacherInfo.phone,
        birthdate: this.teacherInfo.birthdate,
        gender: this.teacherInfo.gender, 
        email: this.teacherInfo.user.email,
        dept_id: this.teacherInfo.dept_id,
        gradelvl_id: this.teacherInfo.gradelvl_id,
        section_id: this.teacherInfo.section_id
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
    fname: this.form.get('teacherName')?.value,
    mname: this.form.get('teacherMname')?.value,
    lname: this.form.get('teacherLname')?.value,
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

  this.authService.updateTeacherProfile(profileData).subscribe(
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
