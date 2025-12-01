import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'ph-gauge',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
                link: '/analytics',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARD.LIST.CRM',
                link: '/crm',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARD.LIST.LEARNING',
                link: '/learning',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARD.LIST.REALESTATE',
                link: '/real-estate',
                parentId: 2
            }
        ]
    },
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 24,
        label: 'MENUITEMS.APPS.LIST.VIAJES',
        icon: 'ri ri-bus-fill ',
        link: '/oper/viajes/list',
        parentId: 8
    },
    {
        id: 39,
        label: 'MENUITEMS.APPS.LIST.GENERAL',
        icon: 'ph-file-text',
        parentId: 8,
        subItems: [
            {
                id: 80,
                label: 'MENUITEMS.APPS.LIST.SUCURSALES',
                link: '/general/sucursales/list',
                parentId: 39
            },
            {
                id: 81,
                label: 'MENUITEMS.APPS.LIST.COLABORADORES',
                link: '/general/colaboradores/list',
                parentId: 39
            }

        ]
    },


    {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.ACCESO',
        icon: 'ri  ri-lock-2-fill ',
        parentId: 8,
        subItems: [
            {
                id: 47,
                label: 'MENUITEMS.APPS.LIST.USUARIO',
                link: '/acceso/usuarios/list',
                parentId: 46
            },
            {
                id: 50,
                label: 'MENUITEMS.APPS.LIST.ROLES',
                link: '/acceso/roles/list',
                parentId: 46
            }
        ]
    },



]