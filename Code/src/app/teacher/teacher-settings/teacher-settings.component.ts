import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-teacher-settings',
  templateUrl: './teacher-settings.component.html',
  styleUrls: ['./teacher-settings.component.css']
})
export class TeacherSettingsComponent {
  user: any; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
    });
  }
}
