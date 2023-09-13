import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-t-elem',
  templateUrl: './t-elem.component.html',
  styleUrls: ['./t-elem.component.css']
})
export class TElemComponent {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      grlevel: [this.selectedTeacher.gradeLevel], 
      teacherName: [this.selectedTeacher.teacherName]
    });
  }
  form: FormGroup;
  gradelvl: any [] = [];
  selectedGradeLevel: any = null;
  filteredTeacher: any[] = [];
  selectedTeacher: any = {};
  departmentId: string;
  gradeLevel: string = '';
  teacherName: string = '';

  successMessage: string = '';
  errorMessage: string = '';
  showAlert:boolean = false;

  ngOnInit():void{
    
  }



  
}
