import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
    ){}

  msg:any;
  validationUserMessage:any;
  validationFormUser !:FormGroup;

  ngOnInit(){

    this.validationUserMessage = {
      email: [
        { type: 'required', message: 'Please enter your email' },
        { type: 'pattern', message: 'Incorrect Email. Try again.' }
      ],
      password: [
        { type: 'required', message: 'Please enter your password' },
        { type: 'minlength', message: 'The password must be at least 5 characters or more' }
      ],
      role: new FormControl('', Validators.required)
    };

    this.validationFormUser = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      role: new FormControl('', Validators.required)
    });
  }

  navigate(){
    this.router.navigate(['/'])
  }


  login(){
    const {email, password} = this.validationFormUser.value;

    this.authService.adminlogin(email,password).subscribe(
      (response: any) => {
        this.msg = '';
        console.log('Login function triggered'); 
        console.log('ID:', response.user_id);
        this.validationFormUser.reset();

        this.router.navigate(['/admin-home'])
      },
      (error:any) => {
        console.log('Error Response:', error);

        if (error && error.error) {
          if (error.error.non_field_errors) {
            this.msg = error.error.non_field_errors[0];
          } else if (error.error.email) {
            this.msg = error.error.email[0];
          } else if (error.error.password) {
            this.msg = error.error.password[0];
          } else if (error.error.role) {
            this.msg = error.error.role[0];
          } else {
            this.msg = 'An error occurred. Please try again later.';
          }
        } else {
          this.msg = 'An error occurred. Please try again later.';
        }
      }
    )
  }

}
