import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  passwordResetForm: FormGroup
  successMessage: string | null = null;

  constructor(private fb:FormBuilder, private authService: AuthService, private router: Router){}

  ngOnInit(){
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit(){
    if(this.passwordResetForm.valid){
      const email = this.passwordResetForm.get('email').value;
      const payload = { email: email };
      this.authService.requestPasswordReset(payload).subscribe(
        (response) => {
          this.successMessage = 'Email successfully sent';        
        }
      )
    }
  }
  hideAlert(){
    this.successMessage = ''
  }
  navigate(){
    this.router.navigate(['/'])
  }
}
