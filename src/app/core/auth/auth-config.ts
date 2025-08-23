import { BrowserCacheLocation, LogLevel } from '@azure/msal-browser';

export function loggerCallback(logLevel: LogLevel, message: string) {
}

export const MSAL_CONFIG = {
  auth: {
    clientId: 'c24d4325-637e-45f8-b146-2c6779bae12e',
    authority: 'https://login.microsoftonline.com/275897eb-67e2-4ba9-afc9-1cc47ea167c5',
    redirectUri: 'http://localhost:4200/',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback,
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
};

