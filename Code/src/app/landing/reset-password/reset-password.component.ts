import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    },
    {
      validators: this.passwordConfirmationValidator
    }
    );

    this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }
  passwordConfirmationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const password = this.resetForm.get('password').value;
      this.authService.resetPassword(this.token, password).subscribe(
        (response) => {
          this.successMessage = 'Password reset successfully. You can now log in with your new password.';
          this.errorMessage = '';
          this.resetForm.reset();
        },
        (error) => {
          this.errorMessage = 'An error occurred while resetting your password. Please try again later.';
          this.successMessage = '';
        }
      );
    }
  }
  hideAlert(){
    this.successMessage = ''
  }
  navigate(){
    this.router.navigate(['/'])
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordControl = this.resetForm.get('password');
    if (this.showPassword) {
      passwordControl.patchValue(passwordControl.value);
    } else {
      passwordControl.patchValue(passwordControl.value);
    }
  }
}
