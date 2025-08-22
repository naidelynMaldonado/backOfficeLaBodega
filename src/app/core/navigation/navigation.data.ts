import { NavigationItem } from './navigation.types';

export const navigationData: NavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/main/dashboard'
    },
    {
        id: 'users',
        title: 'Gestión de Usuarios',
        type: 'basic',
        icon: 'users', 
        link: '/main/users'
    },
    {
        id: 'roles',
        title: 'Gestión de Roles',
        type: 'basic',
        icon: 'users',
        link: '/main/roles'
    },
    {
        id: 'personalization',
        title: 'Personalización',
        type: 'collapsable',
        icon: 'personalization',
        children: [
            {
                id: 'home',
                title: 'Página de Inicio',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/home'
            },
            {
                id: 'program-loyalty',
                title: 'Programa de Lealtad',
                type: 'basic',
                icon: 'roulette',
                link: '/main/personalization/program-loyalty'
            },
            {
                id: 'faqs',
                title: 'Preguntas Frecuentes',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/faqs'
            },
            {
                id: 'terms-and-conditions',
                title: 'Términos y Condiciones',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/terms-and-conditions'
            },
            {
                id: 'return-policies',
                title: 'Políticas de Devolución',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/return-policies'
            },
            {
                id: 'contact-information',
                title: 'Información de Contacto',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/contact-information'
            }
        ]
    },
    {
        id: 'prize-wheel',
        title: 'Ruleta de Premios',
        type: 'basic',
        icon: 'roulette',
        link: '/main/prize-wheel'
    },
    {
        id: 'promotions',
        title: 'Promociones',
        type: 'basic',
        icon: 'truck',
        link: '/main/promotions'
    },
    {
        id: 'previews',
        title: 'Vistas Previas',
        type: 'collapsable',
        icon: 'personalization',
        children: [
            {
                id: 'preview-home',
                title: 'Vista Previa - Inicio',
                type: 'basic',
                icon: 'home',
                link: '/main/previews/preview-home'
            },
            {
                id: 'preview-program-loyalty',
                title: 'Vista Previa - Programa Lealtad',
                type: 'basic',
                icon: 'roulette',
                link: '/main/previews/preview-program-loyalty'
            },
            {
                id: 'preview-terms',
                title: 'Vista Previa - Términos',
                type: 'basic',
                icon: 'home',
                link: '/main/previews/preview-terms'
            },
            {
                id: 'preview-return',
                title: 'Vista Previa - Devoluciones',
                type: 'basic',
                icon: 'home',
                link: '/main/previews/preview-return'
            }
        ]
    }
];

export const compactNavigation: NavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/main/dashboard'
    },
    {
        id: 'users',
        title: 'Usuarios',
        type: 'basic',
        icon: 'users',
        link: '/main/users'
    },
    {
        id: 'roles',
        title: 'Roles',
        type: 'basic',
        icon: 'users',
        link: '/main/roles'
    },
    {
        id: 'personalization',
        title: 'Personalización',
        type: 'basic',
        icon: 'personalization',
        link: '/main/personalization/home'
    },
    {
        id: 'prize-wheel',
        title: 'Ruleta',
        type: 'basic',
        icon: 'roulette',
        link: '/main/prize-wheel'
    },
    {
        id: 'promotions',
        title: 'Promociones',
        type: 'basic',
        icon: 'truck',
        link: '/main/promotions'
    }
];

export const futuristicNavigation: NavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Centro de Control',
        type: 'basic',
        icon: 'dashboard',
        link: '/main/dashboard'
    },
    {
        id: 'users',
        title: 'Gestión de Agentes',
        type: 'basic',
        icon: 'users',
        link: '/main/users'
    },
    {
        id: 'roles',
        title: 'Permisos del Sistema',
        type: 'basic',
        icon: 'users',
        link: '/main/roles'
    },
    {
        id: 'personalization',
        title: 'Configuración de Interface',
        type: 'collapsable',
        icon: 'personalization',
        children: [
            {
                id: 'home',
                title: 'Portal Principal',
                type: 'basic',
                icon: 'home',
                link: '/main/personalization/home'
            },
            {
                id: 'program-loyalty',
                title: 'Sistema de Recompensas',
                type: 'basic',
                icon: 'roulette',
                link: '/main/personalization/program-loyalty'
            }
        ]
    },
    {
        id: 'prize-wheel',
        title: 'Generador de Premios',
        type: 'basic',
        icon: 'roulette',
        link: '/main/prize-wheel'
    },
    {
        id: 'promotions',
        title: 'Campaña de Marketing',
        type: 'basic',
        icon: 'truck',
        link: '/main/promotions'
    }
];