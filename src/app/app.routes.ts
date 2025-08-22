import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layouts/empty/empty.component').then(m => m.EmptyComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'main',
    loadComponent: () => import('./core/layout/layouts/main/main.component').then(m => m.MainComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      
    ]
  },
  {
    path: 'dashboard',
    redirectTo: '/main/dashboard'
  },
  {
    path: 'home',
    redirectTo: '/main/home'
  },
  {
    path: 'home/edit',
    redirectTo: '/main/home/edit'
  },
  {
    path: 'faqs',
    redirectTo: '/main/faqs'
  },
  {
    path: 'faqs/edit',
    redirectTo: '/main/faqs/edit'
  },
  {
    path: 'users',
    redirectTo: '/main/users'
  },
  {
    path: 'users/new',
    redirectTo: '/main/users/new'
  },
  {
    path: 'roles',
    redirectTo: '/main/roles'
  },
  {
    path: 'prize-wheel',
    redirectTo: '/main/prize-wheel'
  },
  {
    path: '**',
    redirectTo: '/main/dashboard'
  }
];
