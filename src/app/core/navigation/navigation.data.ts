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
];