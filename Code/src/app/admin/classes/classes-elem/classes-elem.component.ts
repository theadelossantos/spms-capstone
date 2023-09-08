import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-classes-elem',
  templateUrl: './classes-elem.component.html',
  styleUrls: ['./classes-elem.component.css']
})
export class ClassesElemComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  gradelvl: any[] = [];
  selectedGradeLevel:any = null;
  filteredSections: any[] = []

  departmentId: string;

  ngOnInit(): void {
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);
      
      const deptIds = this.gradelvl.map((grade) => grade.dept_id);
      console.log('deptIds:', deptIds)
    });
    
    
  }
  

  manageClasses(departmentId: number, gradelvlId: number) {
    this.authService.filterSections(gradelvlId).subscribe((data) => {
      this.selectedGradeLevel = this.gradelvl.find((level) => level.gradelvl_id === gradelvlId);
      this.filteredSections = data.sections;
    });
  }
  
}
