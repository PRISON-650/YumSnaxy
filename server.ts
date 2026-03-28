import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin
  const configPath = path.join(__dirname, 'firebase-applet-config.json');
  let adminInitialized = false;
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    try {
      // Force the project ID in the environment
      process.env.GOOGLE_CLOUD_PROJECT = config.projectId;
      process.env.FIREBASE_PROJECT_ID = config.projectId;
      
      // Check if already initialized to avoid errors on reload
      if (admin.apps.length === 0) {
        console.log(`Initializing Firebase Admin for project: ${config.projectId}`);
        admin.initializeApp({
          projectId: config.projectId,
          credential: admin.credential.applicationDefault()
        });
      }
      adminInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } catch (e) {
      console.error('Firebase Admin init error:', e);
    }
  } else {
    console.warn('firebase-applet-config.json not found, Admin API will be limited');
  }

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[Server] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
  });

  // Middleware to check if admin is initialized
  const checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!adminInitialized) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. Check server logs.' });
    }
    next();
  };

  // API Routes
  app.post('/api/auth/signup', checkAdmin, async (req, res) => {
    const { email, password, displayName } = req.body;
    try {
      const userRecord = await admin.auth().createUser({ email, password, displayName });
      res.json({ success: true, uid: userRecord.uid });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/update-user', checkAdmin, async (req, res) => {
    const { uid, email, password, displayName } = req.body;
    try {
      let targetUid = uid;
      if (!targetUid && email) {
        try {
          const user = await admin.auth().getUserByEmail(email);
          targetUid = user.uid;
        } catch (e: any) {
          if (e.code === 'auth/user-not-found') {
            const newUser = await admin.auth().createUser({ email, password, displayName });
            targetUid = newUser.uid;
          } else throw e;
        }
      }

      if (targetUid) {
        const updates: any = {};
        if (password) updates.password = password;
        if (displayName) updates.displayName = displayName;
        await admin.auth().updateUser(targetUid, updates);
        res.json({ success: true, uid: targetUid });
      } else {
        res.status(400).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback for development
    app.all('/api/*', (req, res) => {
      res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
    });

    app.get('*', async (req, res, next) => {
      const url = req.originalUrl.split('?')[0];
      
      // Skip requests that look like files (have an extension)
      if (url.includes('.') && !url.endsWith('.html')) {
        return next();
      }

      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // API catch-all for production
    app.all('/api/*', (req, res) => {
      res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
