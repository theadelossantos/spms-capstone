import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-classes-elem',
  templateUrl: './classes-elem.component.html',
  styleUrls: ['./classes-elem.component.css']
})
export class ClassesElemComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      grlevel: [this.selectedSection.gradeLevel], 
      sectionName: [this.selectedSection.sectionName]
    });
  }
  gradelvl: any[] = [];
  selectedGradeLevel: any = null;
  filteredSections: any[] = [];
  selectedSection: any = {};
  departmentId: string;
  form: FormGroup;
  gradeLevel: string = ''; 
  sectionName: string = '';

  ngOnInit(): void {
    this.authService.getGradeLevels().subscribe((data) => {
      console.log('Gradelevels:', data);
      this.gradelvl = data;
      console.log('this.gradelvl:', this.gradelvl);
      
      const deptIds = this.gradelvl.map((grade) => grade.dept_id);
      console.log('deptIds:', deptIds)
    });

    this.form = this.fb.group({
      grlevel: [this.selectedSection?.gradeLevel],
      sectionName: [this.selectedSection?.sectionName]
  });
    
  }
  
  
  
  

  manageClasses(departmentId: number, gradelvlId: number) {
    if (!gradelvlId) {
      console.error("Invalid gradelvlId:", gradelvlId);
      return;
    }
  
    this.authService.filterSections(gradelvlId).subscribe(
      (data) => {
        this.selectedGradeLevel = this.gradelvl.find((level) => level.gradelvl_id === gradelvlId);
        this.filteredSections = data.sections;

        console.log("filtered sections:", this.filteredSections)
  
        if (this.filteredSections.length > 0) {
          this.selectedSection = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            sectionName: this.filteredSections[0].section_name,
            section_id: this.filteredSections[0].id,
            dept_id: this.selectedGradeLevel.dept_id,
          };
        } else {
          this.selectedSection = {
            gradeLevel: this.selectedGradeLevel.gradelvl_id,
            sectionName: '', 
            section_id: null, 
            dept_id: this.selectedGradeLevel.dept_id,
          };
        }
      },
      (error) => {
        console.error("Error fetching sections:", error);
      }
    );
  }
  

  saveEditedSection() {
    if (this.selectedSection && this.selectedSection.section_id) {
      const sectionId = this.selectedSection.section_id;
      this.selectedSection.gradelvl_id = this.form.value.grlevel;

      const updatedSectionData = {
        gradelvl_id: this.form.value.grlevel,
        section_name: this.form.value.sectionName
      };
      this.selectedSection.gradelvl_id = updatedSectionData.gradelvl_id;
      this.selectedSection.sectionName = updatedSectionData.section_name;

      this.authService.editSection(sectionId, updatedSectionData).subscribe(
        (response) => {
          console.log('Section updated successfully:', response);
          console.log("updates:", this.selectedSection)
        },
        (error) => {
          console.error('Error updating section:', error);
        }
      );
    } else {
      console.error('Invalid selected section:', this.selectedSection);
    }
  }
  

    logSelectedSection(){
      console.log('Selected Section:', this.selectedSection);
  
    }
    editSection(section: any) {
      console.log('Selected Section:', section);
    
      this.selectedSection = {
        section_id: section.id,
        grlevel: section.gradelvl_id,
        sectionName: section.section_name,
      };
    
      this.form.patchValue({
        grlevel: this.selectedSection.grlevel,
        sectionName: this.selectedSection.sectionName,
      });
    }
    
  
}



  

