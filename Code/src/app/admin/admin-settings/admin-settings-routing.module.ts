import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSettingsComponent } from './admin-settings.component';
import { PrivacyComponent } from './privacy/privacy.component';
const routes: Routes = [{
  path: 'profile',
  component: AdminSettingsComponent
},
{
  path: 'privacy',
  component: PrivacyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSettingsRoutingModule { }
