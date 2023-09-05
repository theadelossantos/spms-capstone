import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  departmentId: string;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.departmentId = params['departmentId'];
    });
  }
}
