import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherSettingsRoutingModule } from './teacher-settings-routing.module';
import { TeacherPrivacyComponent } from './teacher-privacy/teacher-privacy.component';


@NgModule({
  declarations: [
    TeacherPrivacyComponent
  ],
  imports: [
    CommonModule,
    TeacherSettingsRoutingModule
  ]
})
export class TeacherSettingsModule { }
