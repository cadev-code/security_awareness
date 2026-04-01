import cors from 'cors';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';
import path from 'path';
import { createAuthRouter } from './routes/auth';
import { createAdminRouter } from './routes/admin';
import { createPublicRouter } from './routes/public';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'security_awareness',
});

const app = express();
const PORT = process.env.PORT || 8089;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve uploaded cover images
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'public', 'uploads')),
);

// Serve podcast audio files
app.use(
  '/audio',
  express.static(path.join(__dirname, '..', 'public', 'podcasts')),
);

// ── Legacy endpoints (kept for backward compatibility) ────────

app.get('/posts', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/videos', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query('SELECT * FROM videos ORDER BY id ASC');
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/newsletters', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM newsletters ORDER BY id ASC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/videos_temporada3', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM videos_temporada3 ORDER BY id ASC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/videos_psswrd', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM videos_psswrd ORDER BY id ASC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/videos_temporada4', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM videos_temporada4 ORDER BY id ASC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get('/videos_temporada5', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM videos_temporada5 ORDER BY id ASC',
    );
    res.status(200).json({ error: null, data: result });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// ── New CMS routes ────────────────────────────────────────────

app.use('/admin/auth', createAuthRouter(pool));
app.use('/admin', authMiddleware, createAdminRouter(pool));
app.use('/', createPublicRouter(pool));

app.listen(PORT, () => {});
