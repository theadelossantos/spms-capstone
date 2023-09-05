import { ActivatedRoute } from '@angular/router';
import { ClassesShsComponent } from './classes-shs/classes-shs.component';
import { ClassesHsComponent } from './classes-hs/classes-hs.component';
import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent {
  departmentId: string;

  constructor(
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departmentId = params['departmentId'];

      this.viewContainerRef.clear();

      let component;
      switch (this.departmentId) {
        case 'elem':
          component = ClassesComponent;
          break;
        case 'hs':
          component = ClassesHsComponent;
          break;
        case 'shs':
          component = ClassesShsComponent;
          break;
        default:
          break;
      }

      if (component) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        this.viewContainerRef.createComponent(factory);
      }
    });
  }

}
