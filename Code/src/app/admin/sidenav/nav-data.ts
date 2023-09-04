import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: '/admin-home/dashboard',
        icon: 'fa-solid fa-home',
        label: 'Dashboard'
    },
    {
        routeLink: '/admin-home/teachers',
        icon: 'fa-solid fa-users',
        label: 'Teachers',
        items: [
            {
                routeLink: '/admin-home/teachers/elem',
                label: 'Elementary'
            },
            {
                routeLink: '/admin-home/teachers/hs',
                label: 'High School'
            },
            {
                routeLink: '/admin-home/teachers/shs',
                label: 'SHS'
            },
        ]
    },
    {
        routeLink: '/admin-home/students',
        icon: 'fa-solid fa-user',
        label: 'Students',
        items: [
            {
                routeLink: '/admin-home/students/elem',
                label: 'Elementary'
            },
            {
                routeLink: '/admin-home/students/hs',
                label: 'High School'
            },
            {
                routeLink: '/admin-home/students/shs',
                label: 'SHS'
            },
        ]
    },
    {
        routeLink: '/admin-home/classes',
        icon: 'fa-solid fa-chalkboard-user',
        label: 'Classes',
        items: []
    },
    {
        routeLink: '/admin-home/courses',
        icon: 'fa-solid fa-table-list',
        label: 'Courses',
        items: [
            {
                routeLink: '/admin-home/courses/elem',
                label: 'Elementary'
            },
            {
                routeLink: '/admin-home/courses/hs',
                label: 'High School'
            },
            {
                routeLink: '/admin-home/courses/shs',
                label: 'SHS'
            },
        ]
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
            {
                routeLink: '/admin-home/settings/privacy',
                label: 'Privacy'
            }
        ]
    },
]