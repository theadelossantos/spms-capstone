import { Component } from '@angular/core';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-student-homepage',
  templateUrl: './student-homepage.component.html',
  styleUrls: ['./student-homepage.component.css']
})
export class StudentHomepageComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data:SideNavToggle):void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    
  }
}
