import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSettingsComponent } from './teacher-settings.component';
import { TeacherPrivacyComponent } from './teacher-privacy/teacher-privacy.component';
const routes: Routes = [{
  path: 'profile',
  component: TeacherSettingsComponent
},
{
  path: 'privacy',
  component: TeacherPrivacyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherSettingsRoutingModule { }
