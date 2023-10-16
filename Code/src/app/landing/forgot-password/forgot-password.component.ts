import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  passwordResetForm: FormGroup
  
  constructor(private fb:FormBuilder, private authService: AuthService){}

  ngOnInit(){
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit(){
    if(this.passwordResetForm.valid){
      const email = this.passwordResetForm.get('email').value;
      this.authService.requestPasswordReset(email).subscribe(
        (response) => {
          console.log('success')
        }
      )
    }
  }
}
