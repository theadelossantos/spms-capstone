import { transition, trigger, style, animate } from "@angular/animations";
export interface INavbarData {
    routeLink: string;
    icon?: string;
    label: string;
    expanded?: boolean;
    items?: INavbarData[],
    loadDepartments?:boolean
}

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('150ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('150ms', style({ opacity: 0 })),
    ]),
])