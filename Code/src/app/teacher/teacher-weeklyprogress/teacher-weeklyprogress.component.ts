import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-teacher-weeklyprogress',
  templateUrl: './teacher-weeklyprogress.component.html',
  styleUrls: ['./teacher-weeklyprogress.component.css']
})
export class TeacherWeeklyprogressComponent {
  assignedSubjects: any[] = [];
  user: any;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit():void{
    this.authService.getTeacherProfile().subscribe((userData: any) => {
      this.user = userData; 
      console.log(userData)

      const teacherId = userData.teacher_id
      console.log('id',teacherId)

      this.authService.getAssignments(teacherId).subscribe(
        (data : any []) => {
          const assignmentsInfo = [];

          data.forEach((assignment) => {
            const assignmentDetails = {
              id: assignment.id,
              deptId:assignment.dept_id,
              gradelvlId:assignment.gradelvl_id,
              sectionId:assignment.section_id,
              subjectId:assignment.subject_id,
              subjectName: '',
              departmentName: '',
              gradeLevelName: '',
              sectionName: ''
            };
            console.log(assignment)

            this.authService.getSubjectById(assignment.subject_id).subscribe(
              (subjectData: any) => {
                assignmentDetails.subjectName = subjectData.subjects[0].subject_name;
              },
              (error) => {
                console.error('Error fetching subject name:', error);
              }
            );
            this.authService.getDepartmentById(assignment.dept_id).subscribe(
              (deptData: any) => {
                assignmentDetails.departmentName = deptData.departments[0].dept_name;
              },
              (error) => {
                console.error('Error fetching department name:', error);
              }
            );
    
            this.authService.getGradeLevelById(assignment.gradelvl_id).subscribe(
              (gradeLevelData: any) => {
                assignmentDetails.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
              },
              (error) => {
                console.error('Error fetching grade level name:', error);
              }
            );
    
            this.authService.getSectionById(assignment.section_id).subscribe(
              (sectionData: any) => {
                assignmentDetails.sectionName = sectionData.sections[0].section_name;
              },
              (error) => {
                console.error('Error fetching section name:', error);
              }
            );
            assignmentsInfo.push(assignmentDetails)
          })
          this.assignedSubjects = assignmentsInfo;
        },
        (error) => {
          console.error('Error fetching assigned data:', error);
        }
      )
      });
  }

}
