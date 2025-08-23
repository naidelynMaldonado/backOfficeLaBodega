import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { provideQuillConfig } from 'ngx-quill';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export function MSALInstanceFactory() {
  return new PublicClientApplication(environment.msalConfigs);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideQuillConfig({
      modules: {
        syntax: false,
        toolbar: [
          [{'header': [1, 2, 3, 4, 5]}],
          ['bold', 'italic', 'underline'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'align': []}],
          ['link'],
          ['clean']
        ]
      }
    }),
  // MSAL providers moved to main.ts to ensure initialization via APP_INITIALIZER
  ]
};
