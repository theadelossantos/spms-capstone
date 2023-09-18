import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSettingsRoutingModule } from './student-settings-routing.module';
import { StudentPrivacyComponent } from './student-privacy/student-privacy.component';

@NgModule({
  declarations: [
    StudentPrivacyComponent

  ],
  imports: [
    CommonModule,
    StudentSettingsRoutingModule,  ]
})
export class StudentSettingsModule { }
