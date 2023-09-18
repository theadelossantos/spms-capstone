import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSettingsComponent } from './student-settings.component';
import { StudentPrivacyComponent } from './student-privacy/student-privacy.component';

const routes: Routes = [
  {
    path: 'profile',
    component: StudentSettingsComponent
  },
  {
    path: 'privacy',
    component: StudentPrivacyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSettingsRoutingModule { }
