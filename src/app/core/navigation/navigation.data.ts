import { NavigationItem } from './navigation.types';

export const navigationData: NavigationItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/main/dashboard'
    },
    {
        id: 2,
        title: 'Personalización',
        type: 'collapsable',
        icon: 'personalization',
        children: [
            {
                id: 21,
                title: 'Página de Inicio',
                type: 'basic',
                icon: 'home',
                link: '/main/home'
            },
            {
                id: 22,
                title: 'Programa de Lealtad',
                type: 'basic',
                icon: 'roulette',
                link: '/main/program-loyalty'
            },
            {
                id: 23,
                title: 'Preguntas Frecuentes',
                type: 'basic',
                icon: 'home',
                link: '/main/faqs'
            },
            {
                id: 24,
                title: 'Términos y Condiciones',
                type: 'basic',
                icon: 'home',
                link: '/main/terms-and-conditions'
            },
            {
                id: 25,
                title: 'Políticas de Devolución',
                type: 'basic',
                icon: 'home',
                link: '/main/return-policies'
            },
            {
                id: 26,
                title: 'Quienes Somos',
                type: 'basic',
                icon: 'home',
                link: '/main/about-us'
            },
            {
                id: 27,
                title: 'Mision / Vision',
                type: 'basic',
                icon: 'home',
                link: '/main/mission-vision'
            },
        ]
    },
    {
        id: 3,
        title: 'Áreas de Cobertura',
        type: 'basic',
        icon: 'truck',
        link: '/main/coverage-areas'
    },
    {
        id: 4,
        title: 'Credenciales y Permisos',
        type: 'collapsable',
        icon: 'personalization',
        children: [
            {
                id: 41,
                title: 'Usuarios',
                type: 'basic',
                icon: 'home',
                link: '/main/users'
            },
            {
                id: 42,
                title: 'Roles',
                type: 'basic',
                icon: 'roulette',
                link: '/main/roles'
            },
        ]
    },
    {
        id: 5,
        title: 'Ruleta de Premios',
        type: 'basic',
        icon: 'roulette',
        link: '/main/prize-wheel'
    },
    {
        id: 6,
        title: 'Cupones',
        type: 'basic',
        icon: 'roulette',
        link: '/main/coupons'
    },
    {
        id: 7,
        title: 'La Bodega TV',
        type: 'basic',
        icon: 'roulette',
        link: '/main/la-bodega-tv'
    },
    {
        id: 8,
        title: 'Notificaciones Push',
        type: 'basic',
        icon: 'roulette',
        link: '/main/push-notifications'
    },
];