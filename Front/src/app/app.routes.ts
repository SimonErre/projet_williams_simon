import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Form } from './form/form';
import { PollutionForm } from './pollution-form/pollution-form';
import { PollutionList } from './pollution-list/pollution-list';
import { PollutionDetail } from './pollution-detail/pollution-detail';
import { Portal } from './portal/portal';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', component: Portal },
  { path: 'pollution', component: PollutionForm },
  { path: 'pollutions', component: PollutionList },
  { path: 'pollutions/edit/:id', component: PollutionForm },
  { path: 'pollutions/:id', component: PollutionDetail },
  { path: 'form', component: Form },
  { path: 'home', component: Home },
];

