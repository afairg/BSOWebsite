import { bootstrapApplication } from '@angular/platform-browser';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Importing Bootswatch Lux theme CSS}
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
