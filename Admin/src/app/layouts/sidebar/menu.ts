import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENÚ PRINCIPAL',
        isTitle: true
    },
    {
        id: 2,
        label: 'Clientes',
        icon: 'ri-user-line',
        link: '/general/clientes/list'
    },
    {
        id: 3,
        label: 'Cotizaciones',
        icon: 'ri-file-list-3-line',
        subItems: [
            {
                id: 4,
                label: 'Listado',
                link: '/general/cotizaciones/list',
                parentId: 3
            },
            {
                id: 5,
                label: 'Reporte',
                link: '/general/cotizaciones/report',
                parentId: 3
            }
        ]
    }
]