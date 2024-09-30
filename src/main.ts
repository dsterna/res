import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import localeSv from '@angular/common/locales/sv'; 
import { registerLocaleData } from '@angular/common';

// Register the Swedish locale data
registerLocaleData(localeSv);

const routes = [
  {
    path: '',
    loadComponent: () => import('./app/app.component').then(m => m.AppComponent), // Lazy load AppComponent
  },
  // Define more routes for other components as needed
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'sv' },
  ],
}).catch((err) => console.error('Error bootstrapping application:', err));
