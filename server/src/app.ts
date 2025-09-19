import cors from 'cors';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';
import path from 'path';

const pool = createPool({
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'security_awareness',
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8089;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get('/posts', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC',
    );
    res.status(200).json({
      error: null,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }

  res.status(200).json({
    error: null,
  });
});

app.get('/videos', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query('SELECT * FROM videos ORDER BY id ASC');
    res.status(200).json({
      error: null,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }

  res.status(200).json({
    error: null,
  });
});

app.use(
  '/audio',
  express.static(path.join(__dirname, '..', 'public', 'podcasts')),
);

app.listen(PORT, () => {});
