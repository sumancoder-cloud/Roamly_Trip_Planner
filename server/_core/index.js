import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTrip } from '../services/ai.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mode: 'simple-js' });
  });

  app.post('/api/generate-trip', async (req, res) => {
    const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
    const result = await generateTrip(prompt);
    res.json(result);
  });

  // Simple nearby places endpoint using Overpass API (OpenStreetMap)
  app.get('/api/places', async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const radius = Number.parseInt(req.query.radius || '5000', 10);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'lat and lon are required query params' } });
    }

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"](around:${radius},${lat},${lon});
        node["amenity"](around:${radius},${lat},${lon});
        node["leisure"](around:${radius},${lat},${lon});
        way["tourism"](around:${radius},${lat},${lon});
        way["amenity"](around:${radius},${lat},${lon});
      );
      out center 30;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: query }).toString(),
      });

      if (!response.ok) {
        throw new Error(`overpass error ${response.status}`);
      }

      const data = await response.json();
      const items = (data.elements || [])
        .map((el) => {
          const name = el.tags?.name || el.tags?.operator || el.tags?.description || null;
          return {
            id: `${el.type}-${el.id}`,
            name: name || (el.tags && Object.values(el.tags)[0]) || 'Unknown place',
            category: el.tags?.tourism || el.tags?.amenity || el.tags?.leisure || 'other',
            lat: el.lat ?? el.center?.lat,
            lon: el.lon ?? el.center?.lon,
            tags: el.tags || {},
          };
        })
        .filter((p) => p.name && p.lat && p.lon)
        // dedupe by name
        .filter((v, i, a) => a.findIndex((x) => x.name === v.name) === i)
        .slice(0, 12);

      return res.json({ success: true, places: items });
    } catch (err) {
      console.error('[Places] error', err);
      // fallback: empty set
      return res.json({ success: false, places: [], error: { code: 'SERVICE_ERROR', message: 'Could not fetch nearby places' } });
    }
  });

  const distPath = path.join(rootDir, 'dist', 'public');
  const clientPath = path.join(rootDir, 'client');

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    app.use(express.static(clientPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }

  const preferredPort = Number.parseInt(process.env.PORT || '3000', 10);
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
