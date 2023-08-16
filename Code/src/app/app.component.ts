import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from './services/public.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  msg:any;
  myForm: FormGroup;
  emailValue:string;
  passwordValue:string;
  roleValue: string;

  constructor(private router: Router, private pService: PublicService, private authService: AuthService){

  }
  
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(){
    this.showMessage();
    this.myForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      role: new FormControl('')
    });
  }

  showMessage(){
    this.pService.getMessage().subscribe(data=>{
      this.msg = data, 
      console.log(this.msg);
    });
  }

  get f(){
    return this.myForm.controls;
  }

  onSubmit(email:string, password:string,role:string) {
    this.authService.login(email,password,role).subscribe(
      (response:any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('role', response.role);

        if(response.role === 'student'){
          this.router.navigate(['/student-homepage']);
        }
        else if(response.role === 'teacher'){
          this.router.navigate(['/teacher-homepage']);
        }
        else if(response.role === 'admin'){
          this.router.navigate(['/admin-homepage']);
        }
      },
      (error: any) => {
        console.log('error');
      }
    )
  }
 

}
