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
  canMatch: [() => import('./core/auth/auth.guard').then(m => m.authGuard as any)],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'faqs',
        loadComponent: () => import('./modules/personalization/faqs/faqs.component').then(m => m.FaqsComponent)
      },
      {
        path: 'faqs/edit',
        loadComponent: () => import('./modules/personalization/faqs/faqs-edit/faqs-edit.component').then(m => m.FaqsEditComponent)
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () => import('./modules/personalization/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent)
      },
      {
        path: 'terms-and-conditions/edit',
        loadComponent: () => import('./modules/personalization/terms-and-conditions/terms-and-conditions-edit/terms-and-conditions-edit.component').then(m => m.TermsAndConditionsEditComponent)
      },
      {
        path: 'return-policies',
        loadComponent: () => import('./modules/personalization/return-policies/return-policies.component').then(m => m.ReturnPoliciesComponent)
      },
      {
        path: 'return-policies/edit',
        loadComponent: () => import('./modules/personalization/return-policies/return-policies-edit/return-policies-edit.component').then(m => m.ReturnPoliciesEditComponent)
      },
    ]
  },
  {
    path: 'auth-callback',
    loadComponent: () => import('./modules/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent)
  },
  {
    path: 'preview-faqs',
    loadComponent: () => import('./modules/personalization/faqs/preview-faq/preview-faq.component').then(m => m.PreviewFaqComponent)
  },
  {
    path: 'preview-terms-and-conditions',
    loadComponent: () => import('./modules/personalization/terms-and-conditions/preview-terms-and-conditions/preview-terms-and-conditions.component').then(m => m.PreviewTermsAndConditionsComponent)
  },
  {
    path: 'preview-return-policies',
    loadComponent: () => import('./modules/personalization/return-policies/preview-return-policies/preview-return-policies.component').then(m => m.PreviewReturnPoliciesComponent)
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
    path: 'terms-and-conditions',
    redirectTo: '/main/terms-and-conditions'
  },
  {
    path: 'terms-and-conditions/edit',
    redirectTo: '/main/terms-and-conditions/edit'
  },
  {
    path: 'return-policies',
    redirectTo: '/main/return-policies'
  },
  {
    path: 'return-policies/edit',
    redirectTo: '/main/return-policies/edit'
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
];
