import { Component, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  msg:any;
  name: string;
  email: string;
  message: string;
  validationUserMessage:any;
  validationFormUser !:FormGroup;

  constructor(private router: Router, 
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private modalService:NgbModal, 
    private renderer: Renderer2, 
    private cookieService: CookieService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event triggered');
        this.modalService.dismissAll();
    
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          this.renderer.removeChild(document.body, modalBackdrop);
        }
      }
    });
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

  sendMessage(){
    console.log(this.name)
    const data = {
      name: this.name,
      email: this.email,
      message: this.message
    }
    this.authService.addQueries(data).subscribe(
      (data)=> {
        console.log('success', data)
        this.name = ''
        this.email = ''
        this.message = ''
      }
    )
  }

  onSubmit() {
    const { email, password, role } = this.validationFormUser.value;
  
    this.authService.login(email, password, role).subscribe(
      (response: any) => {
        this.msg = '';
        console.log('onSubmit function triggered');
        console.log('ID:', response.user_id);
        this.validationFormUser.reset();
        this.modalService.dismissAll();

  
        if (response.role === 'student') {
          console.log('Navigating to student homepage...');
          this.router.navigate(['/student']);
          
        } else if (response.role === 'teacher') {
          this.router.navigate(['/teacher']);
        } else if (response.role === 'admin') {
          this.router.navigate(['/admin/admin-homepage']);
        } else {
          console.log('Role not recognized:', response.role);
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
          this.msg = 'An error occurred. Please try again later.';
        }
      }
    );
  }
  
  

}
