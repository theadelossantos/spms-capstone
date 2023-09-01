import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private formBuilder: FormBuilder, 
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


  login(){}

}
