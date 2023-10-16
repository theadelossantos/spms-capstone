import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent {
  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;
  totalStudents: number
  studentsList: any[] = [];

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));

      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);


    });
    
    this.authService.getGradeLevelById(this.gradeLevelId).subscribe(
      (gradeLevelData: any) => {
       this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
      },
      (error) => {
        console.error('Error fetching grade level name:', error);
      }
    );
    this.authService.getSectionById(this.sectionId).subscribe(
      (sectionData: any) => {
        this.sectionName = sectionData.sections[0].section_name;
      },
      (error) => {
        console.error('Error fetching section name:', error);
      }
    );
    

    this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
      (studentsData: any) => {
        this.studentsList = studentsData.students;
        console.log('students data', this.studentsList)

      }
    )
  }
}
