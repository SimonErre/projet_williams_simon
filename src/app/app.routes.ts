import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Form } from './form/form';
import { PollutionForm } from './pollution-form/pollution-form';
import { Portal } from './portal/portal';

export const routes: Routes = [
  { path: '', component: Portal },
  { path: 'pollution', component: PollutionForm },
  { path: 'form', component: Form },
  { path: 'home', component: Home }
];
