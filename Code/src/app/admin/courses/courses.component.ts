import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  departmentId: string;
  constructor(private route:ActivatedRoute){}

  ngOnInit():void{
    this.route.params.subscribe(params => {
      this.departmentId = params['departmentId'];
    })

  }

}
