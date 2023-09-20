import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  user: any; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAdminProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)
    });
  }
}
