import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent {
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
      adminName: [this.fname],
      adminMname: [this.mname],
      adminLname: [this.lname],
      address: [this.address],
      phone: [this.phone],
      gender: [this.gender],
      birthdate: [this.birthdate],
      profile_picture: [null],
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
          adminName: this.adminInfo.fname,
          adminMname: this.adminInfo.mname,
          adminLname: this.adminInfo.lname,
          address: this.adminInfo.address,
          phone: this.adminInfo.phone,
          birthdate: this.adminInfo.birthdate,
          gender: this.adminInfo.gender, 
          email: this.adminInfo.user.email
        });
      });
    }

    onImageSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          // Read the selected file as a Data URL and set it as the src of the image element
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
      fname: this.form.get('adminName')?.value,
      mname: this.form.get('adminMname')?.value,
      lname: this.form.get('adminLname')?.value,
      address: this.form.get('address')?.value,
      phone: this.form.get('phone')?.value,
      gender: this.form.get('gender')?.value,
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
  
    this.authService.updateAdminProfile(profileData).subscribe(
      (response: any) => {
        console.log('Profile updated successfully!', response);
      },
      (error: any) => {
        console.error('Error updating profile:', error);
      }
    );
  }
  
}
