import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData, loadDepartments } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-teacher-sidenav',
  templateUrl: './teacher-sidenav.component.html',
  styleUrls: ['./teacher-sidenav.component.css'],
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
export class TeacherSidenavComponent {
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
  constructor(public router: Router, private authService: AuthService,private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    const classesRouteLink = '/student/classes';
    loadDepartments(this.navData, this.authService, classesRouteLink);

    const teacherRouteLink = '/student/teachers';
    loadDepartments(this.navData, this.authService, teacherRouteLink);

    const studentsRouteLink = '/student/students';
    loadDepartments(this.navData, this.authService, studentsRouteLink);

    const coursesRouteLink = '/student/courses';
    loadDepartments(this.navData, this.authService, coursesRouteLink);

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

  @Output() departmentSelected = new EventEmitter<any>(); 

  setSelectedDepartment(department: any) {
    this.departmentSelected.emit(department);
  }
  isGradesActive(): boolean {
    const urlSegments = this.activatedRoute.snapshot.url.map(segment => segment.path);
    
    return urlSegments.includes('teacher') && urlSegments.includes('grades');
  }

  logout(){
    console.log('Logout function called');
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully.');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error logging out:', error);
      }
    )
  }
}
