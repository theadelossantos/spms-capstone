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

  role: string;

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

  onSubmit() {
    this.authService.login(this.f['email'].value, this.f['password'].value, this.f['role'].value).pipe(first()).subscribe(
      data => {
        console.log(data);
      }
    );
  }
 

}
