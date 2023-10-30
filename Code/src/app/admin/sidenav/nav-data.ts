import { INavbarData } from "./helper";
import { AuthService } from "src/app/services/auth.service";
import { map } from "rxjs/operators";

export const navbarData: INavbarData[] = [
    {
        routeLink: '/admin-home/dashboard',
        icon: 'fa-solid fa-home',
        label: 'Dashboard'
    },
    {
      routeLink: '/admin-home/queries',
      icon: 'fa-solid fa-message',
      label: 'Queries',
      items: [],

  },
    {
        routeLink: '/admin-home/teachers',
        icon: 'fa-solid fa-users',
        label: 'Teachers',
        items: [],
        loadDepartments: true,

    },
    {
        routeLink: '/admin-home/students',
        icon: 'fa-solid fa-user',
        label: 'Students',
        items: [],
        loadDepartments: true
    },
    {
        routeLink: '/admin-home/classes',
        icon: 'fa-solid fa-chalkboard-user',
        label: 'Classes',
        items: [],
        loadDepartments: true,
    },
    {
        routeLink: '/admin-home/courses',
        icon: 'fa-solid fa-table-list',
        label: 'Courses',
        items: [],
        loadDepartments: true
    },
    {
        routeLink: '/admin-home/settings',
        icon: 'fa-solid fa-gears',
        label: 'Settings',
        expanded: true,
        items: [
            {
                routeLink: '/admin-home/settings/profile',
                label: 'Profile'
            },
        ]
    },
    
];

export async function loadDepartments(navbarData: INavbarData[], authService: AuthService, routeLink: string) {
    const item = navbarData.find(item => item.routeLink === routeLink);  
    if (item) {
      try {
        const departments = await authService.getDepartments()
          .pipe(
            map((data: any) => {
              return data.departments.map((department: any) => ({
                routeLink: `${routeLink}/${department.id}`,
                label: department.name
              }));
            })
          )
          .toPromise();
            
        if (departments.length > 0) {
          item.items = departments;
        }
      } catch (error) {
        console.error('Error loading departments:');
      }
    }
  }
  