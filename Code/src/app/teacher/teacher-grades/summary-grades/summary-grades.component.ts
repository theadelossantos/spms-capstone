import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-summary-grades',
  templateUrl: './summary-grades.component.html',
  styleUrls: ['./summary-grades.component.css']
})
export class SummaryGradesComponent {

  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  assignmentId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    
  }

  ngOnInit():void{
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
      console.log('Assignment ID:', this.assignmentId);

    });

    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;

        
      },
      (error) => {
        console.error('Error fetching subject name:', error);
      }
    );
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
  }
}
