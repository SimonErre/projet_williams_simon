import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pollutions',
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
    path: 'users',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
