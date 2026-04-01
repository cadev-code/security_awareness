import { Router, Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

export const createPublicRouter = (pool: Pool): Router => {
  const router = Router();

  // All visible sections ordered by sort_order
  router.get('/sections', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM sections WHERE visible = 1 ORDER BY sort_order ASC',
      );
      res.json({ error: null, data: rows });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener secciones' });
    }
  });

  // Content items for a section by slug (only visible, only already released)
  router.get('/sections/:slug/content', async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    try {
      const [rows] = await pool.query(
        `SELECT ci.*
         FROM content_items ci
         JOIN sections s ON s.id = ci.section_id
         WHERE s.slug = ? AND ci.visible = 1
         ORDER BY ci.sort_order ASC, ci.id ASC`,
        [slug],
      );
      res.json({ error: null, data: rows });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener contenido' });
    }
  });

  return router;
};
