import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassesHsComponent } from './classes-hs/classes-hs.component';
import { ClassesShsComponent } from './classes-shs/classes-shs.component';

const routes: Routes = [
  {
    path: ':departmentId', // This route captures the departmentId from the URL
    component: ClassesComponent, // Common component for handling department-specific logic
    children: [
      {
        path: 'elem', // Department-specific route
        component: ClassesComponent // Component for Elementary department
      },
      {
        path: 'hs', // Department-specific route
        component: ClassesHsComponent // Component for High School department
      },
      {
        path: 'shs', // Department-specific route
        component: ClassesShsComponent // Component for SHS department
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
