import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-teacher-content',
  templateUrl: './teacher-content.component.html',
  styleUrls: ['./teacher-content.component.css']
})
export class TeacherContentComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(){
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';
    }else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
