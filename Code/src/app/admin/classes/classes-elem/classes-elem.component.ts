import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-classes-elem',
  templateUrl: './classes-elem.component.html',
  styleUrls: ['./classes-elem.component.css']
})
export class ClassesElemComponent implements OnInit {
  constructor(private authService: AuthService) {}

  gradelvl: any[] = [];

  ngOnInit(): void {
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);
    });
  }
}
