// src/main.ts (Angular 20, sólo cliente/CSR)
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';

import { App } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

// MSAL global providers
import { MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { MSALInstanceFactory } from './app/app.config';

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    // MSAL: provide a single PublicClientApplication and initialize it before app start
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (msalInstance: PublicClientApplication) => () => msalInstance.initialize(),
      deps: [MSAL_INSTANCE],
      multi: true
    },
    MsalService,
  ],
}).catch(err => console.error(err));
