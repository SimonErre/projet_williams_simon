import { Routes } from '@angular/router';
import { PollutionForm } from './pollution-form/pollution-form';
import { PollutionList } from './pollution-list/pollution-list';
import { PollutionDetail } from './pollution-detail/pollution-detail';
import { Signup } from './signup/signup';
import { UserList } from './user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'pollutions', component: PollutionList },
  { path: 'pollution', component: PollutionForm },
  { path: 'pollutions/new', component: PollutionForm },
  { path: 'pollutions/edit/:id', component: PollutionForm },
  { path: 'pollutions/:id', component: PollutionDetail },
  { path: 'users', component: UserList },
  { path: 'users/new', component: Signup },
  { path: 'signup', component: Signup },
  { path: '**', redirectTo: 'pollutions' },
];
