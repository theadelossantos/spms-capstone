import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from './services/public.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  msg:any;
  constructor(private router: Router, private pService: PublicService){

  }
  
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(){
    this.showMessage();
  }

  showMessage(){
    this.pService.getMessage().subscribe(data=>{
      this.msg = data, 
      console.log(this.msg);
    });
  }
 

}
