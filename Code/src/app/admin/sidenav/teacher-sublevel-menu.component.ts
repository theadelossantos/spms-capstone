import { Component, Input, Output, EventEmitter } from '@angular/core';
import { INavbarData, fadeInOut } from './helper';
import { trigger,state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-sublevel-menu',
  templateUrl: './teacher-sublevel-menu.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu',[
      state('hidden', style({
        height:'0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden',[style({
        overflow: 'hidden'
      }), 
      animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class TeacherSublevelMenuComponent {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items:[]
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean =false;

  constructor(public router: Router){

  }
  handleClick(item: any):void{
    if(!this.multiple){
      if(this.data.items && this.data.items.length > 0){
        for(let modelItem of this.data.items){
          if(item !== modelItem && modelItem.expanded){
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;

    if (item.routeLink) {
      this.router.navigateByUrl(item.routeLink);
    }
  }

  getActiveClass(item: INavbarData): string{
    return item.expanded && this.router.url.includes(item.routeLink) ? 'active-sublevel': '';
  }


}
