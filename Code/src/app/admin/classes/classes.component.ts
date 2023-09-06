import { ActivatedRoute } from '@angular/router';
import { Component} from '@angular/core';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent {
  departmentId: string;
  gradelvlId: string;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['departmentId'];
      this.gradelvlId = params['gradelvlId']
    });
  }

}
