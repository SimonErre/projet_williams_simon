import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Form } from './form/form';

export const routes: Routes = [
  { path: '', component: Form },
  { path: 'home', component: Home }
];
