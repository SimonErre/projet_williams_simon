import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pollutions',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pollutions/new',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pollutions/edit/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pollutions/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pollution',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users/new',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'signup',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
