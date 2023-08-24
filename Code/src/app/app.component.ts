import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  msg:any;
  validationUserMessage:any;
  validationFormUser !:FormGroup;

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder){

  }
  
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

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


  onSubmit() {
    const { email, password, role } = this.validationFormUser.value;
  
    this.authService.login(email, password, role).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('role', response.role);
        
        this.msg = '';
        console.log('onSubmit function triggered');
        this.validationFormUser.reset();

        if (response.role === 'student') {
          this.router.navigate(['/student/student-homepage']);
        } else if (response.role === 'teacher') {
          this.router.navigate(['/teacher/teacher-homepage']);
        } else if (response.role === 'admin') {
          this.router.navigate(['/admin/admin-homepage']);
        }
      },
      (error: any) => {
        console.log('Error response:', error);
  
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
          this.msg = 'An error occurred. Please try again laterr.';
        }
      }
    );
  }
  
  
  
 

}
