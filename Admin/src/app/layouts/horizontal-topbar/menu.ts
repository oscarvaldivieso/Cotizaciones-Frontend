import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 7,
        label: 'MENUITEMS.APPS.LIST.HOME',
        icon: 'ph-calendar',
        link: '/website/home',
        parentId: 8
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.LIST.RESTAURANTES',
        icon: 'ph-calendar',
        link: '/website/restaurantes',
        parentId: 8
    },
    {
        id: 10,
        label: 'MENUITEMS.APPS.LIST.HOTELES',
        icon: 'ph-chats',
        link: '/website/hoteles',
        parentId: 8
    },
    {
        id: 11,
        label: 'MENUITEMS.APPS.LIST.VUELOS',
        icon: 'ph-envelope',
        link: '/website/vuelos',
        parentId: 8,
    },
    {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.PAQUETES',
        icon: 'ph-envelope',
        link: '/website/paquetes/list',
        parentId: 8,
    }
    
    
    
]