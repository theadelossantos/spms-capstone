import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData, loadDepartments } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '500ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  departments: any[] = [];
  departmentsExpanded = false;
  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    const classesRouteLink = '/admin-home/classes';
    loadDepartments(this.navData, this.authService, classesRouteLink);

    const teacherRouteLink = '/admin-home/teachers';
    loadDepartments(this.navData, this.authService, teacherRouteLink);

    const studentsRouteLink = '/admin-home/students';
    loadDepartments(this.navData, this.authService, studentsRouteLink)


    this.authService.getDepartments().subscribe((data) => {
      console.log('Departments:', data);
      this.departments = data.departments;
    });
    
  }

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav():void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});

  }
handleclick(item: INavbarData):void{
    if(!this.multiple){
      for(let modelItem of this.navData){
        if(item !== modelItem && modelItem.expanded){
          modelItem.expanded = false;
        }
      }
    }
  item.expanded = !item.expanded
  }
getActiveClass(data: INavbarData): string{
    return this.router.url.includes(data.routeLink) ? 'active':'';
  }
}
