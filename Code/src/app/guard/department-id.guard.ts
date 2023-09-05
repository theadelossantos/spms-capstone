import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class departmentIdGuard implements CanActivate{
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const departmentId = route.paramMap.get('departmentId');

    if (departmentId !== '1' && departmentId !== '2' && departmentId !== '3') {
      const isTeachersRoute = state.url.startsWith('/admin-home/teachers');
      const isClassesRoute = state.url.startsWith('/admin-home/classes');
      const isStudentsRoute = state.url.startsWith('/admin-home/students');
      const courseRoute = state.url.startsWith('/admin-home/courses');

      if (isTeachersRoute) {
        this.router.navigate(['/admin-home/teachers/1']);
      } else if (isClassesRoute) {
        this.router.navigate(['/admin-home/classes/1']);
      } else if(isStudentsRoute){
        this.router.navigate(['/admin-home/students/1']);
      }else if(courseRoute){
        this.router.navigate(['/admin-home/courses/1'])
      }
      else {
        this.router.navigate(['/admin-home/dashboard']);
      }
      return false; 
    }

    return true; 
  }
};
