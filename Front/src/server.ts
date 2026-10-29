import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

import { INITIAL_POLLUTIONS } from './app/mock/mock-pollutions';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// Base de données simulée pour l'API mockée initialisée depuis la source unique
let mockPollutions = [...INITIAL_POLLUTIONS];

// Endpoints REST de gestion des pollutions (CRUD)
app.get('/api/pollutions', (_req, res) => {
  res.json(mockPollutions);
});

app.get('/api/pollutions/:id', (req, res) => {
  const id = parseInt(req.params['id'], 10);
  const found = mockPollutions.find((p) => p.id === id);
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: 'Pollution non trouvée' });
  }
});

app.post('/api/pollutions', (req, res) => {
  const maxId = mockPollutions.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newPollution = { ...req.body, id: maxId + 1 };
  mockPollutions = [newPollution, ...mockPollutions];
  res.status(201).json(newPollution);
});

app.put('/api/pollutions/:id', (req, res) => {
  const id = parseInt(req.params['id'], 10);
  const index = mockPollutions.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPollutions[index] = { ...mockPollutions[index], ...req.body, id };
    res.json(mockPollutions[index]);
  } else {
    res.status(404).json({ error: 'Pollution non trouvée' });
  }
});

app.delete('/api/pollutions/:id', (req, res) => {
  const id = parseInt(req.params['id'], 10);
  mockPollutions = mockPollutions.filter((p) => p.id !== id);
  res.status(200).json({ success: true });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
