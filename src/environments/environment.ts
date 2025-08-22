import { BrowserCacheLocation } from "@azure/msal-browser";

export const environment = {
    apiKey:'lb-apiT7X2mPptAkfYwOrQHghfB5dWqnml28maiZMJ9XHosHy8sLAPYf307n7UvU893vhmNrFnfjJxd8TiFMbDysHZWtegfBRgjLcN4TpPdV35Nwfi6qtKl0Xmz1OIc2',
    apiURL: 'https://labodega-boapi.cit.lat/api',
    // apiURL: 'http://localhost:5000/api',
    apiYalo: "https://apiextdevtmp.yalocobro.com/api/v1",
    keyYalo: 'yaloservices-TxBVVOi71WFPSJaEbiZQya8dWTJk4hSh4L0ZOtb9IBYBWD7LWxH',
    mapboxToken: 'pk.eyJ1IjoiY2FybG9zbGFyYWNoIiwiYSI6ImNtYTJtY3c2ZzJubXUyanEwZXFkd3pkbTEifQ.jXhBe25O9u7xI7ca3MNxNg',
    msalConfigs: {
        auth: {
            clientId: '28b49626-253a-441a-ae34-b7201aa009ad',
            authority: 'https://login.microsoftonline.com/21bf6fca-52fe-4e3b-828c-352c901d011b',
            redirectUri: 'http://localhost:4200/auth-callback',
            postLogoutRedirectUri: 'http://localhost:4200/login',
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: false,
        },
    },
    scopes: ['User.Read', 'email', 'openid', 'profile'],
};