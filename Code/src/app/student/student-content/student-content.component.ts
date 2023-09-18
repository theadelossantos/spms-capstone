import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-student-content',
  templateUrl: './student-content.component.html',
  styleUrls: ['./student-content.component.css']
})
export class StudentContentComponent {
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
