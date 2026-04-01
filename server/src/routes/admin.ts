import { Router, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { AuthRequest } from '../middleware/auth';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => cb(null, uploadsDir),
  filename: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

interface Section {
  id: number;
  name: string;
  slug: string;
  icon: string;
  type: string;
  layout: string;
  card_style: string;
  bg_image: string | null;
  section_logo: string | null;
  color_theme: string;
  items_per_page: number | null;
  sort_order: number;
  visible: number;
}

interface ContentItem {
  id: number;
  section_id: number;
  title: string | null;
  filename: string;
  cover: string | null;
  availability: string;
  url_questions: string;
  content_type: string;
  sort_order: number;
  visible: number;
}

export const createAdminRouter = (pool: Pool): Router => {
  const router = Router();

  // ── Sections ────────────────────────────────────────────────

  router.get('/sections', async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query('SELECT * FROM sections ORDER BY sort_order ASC');
      res.json({ error: null, data: rows });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener secciones' });
    }
  });

  router.post('/sections', async (req: AuthRequest, res: Response): Promise<void> => {
    const {
      name, slug, icon, type, layout, card_style,
      bg_image, section_logo, color_theme, items_per_page, sort_order, visible,
    } = req.body as Partial<Section>;

    if (!name || !slug || !type) {
      res.status(400).json({ error: 'name, slug y type son requeridos' });
      return;
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO sections
           (name, slug, icon, type, layout, card_style, bg_image, section_logo,
            color_theme, items_per_page, sort_order, visible)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, slug, icon || 'Clapperboard', type, layout || 'grid',
          card_style || 'default', bg_image || null, section_logo || null,
          color_theme || '#000d04', items_per_page || null,
          sort_order ?? 0, visible ?? 1,
        ],
      );
      const insertId = (result as { insertId: number }).insertId;
      res.status(201).json({ error: null, data: { id: insertId } });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear sección' });
    }
  });

  router.put('/sections/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      name, slug, icon, type, layout, card_style,
      bg_image, section_logo, color_theme, items_per_page, sort_order, visible,
    } = req.body as Partial<Section>;

    try {
      await pool.query(
        `UPDATE sections SET
           name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           icon = COALESCE(?, icon),
           type = COALESCE(?, type),
           layout = COALESCE(?, layout),
           card_style = COALESCE(?, card_style),
           bg_image = ?,
           section_logo = ?,
           color_theme = COALESCE(?, color_theme),
           items_per_page = ?,
           sort_order = COALESCE(?, sort_order),
           visible = COALESCE(?, visible)
         WHERE id = ?`,
        [
          name || null, slug || null, icon || null, type || null,
          layout || null, card_style || null,
          bg_image,
          section_logo,
          color_theme || null,
          items_per_page,
          sort_order ?? null, visible ?? null,
          id,
        ],
      );
      res.json({ error: null });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar sección' });
    }
  });

  router.delete('/sections/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM sections WHERE id = ?', [id]);
      res.json({ error: null });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar sección' });
    }
  });

  // ── Content items ────────────────────────────────────────────

  router.get('/sections/:id/content', async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query(
        'SELECT * FROM content_items WHERE section_id = ? ORDER BY sort_order ASC, id ASC',
        [id],
      );
      res.json({ error: null, data: rows });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener contenido' });
    }
  });

  router.post(
    '/sections/:id/content',
    upload.single('cover'),
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const {
        title, filename, availability, url_questions,
        content_type, sort_order, visible,
      } = req.body as Partial<ContentItem>;

      if (!filename) {
        res.status(400).json({ error: 'filename es requerido' });
        return;
      }

      const coverFilename = req.file ? req.file.filename : (req.body.cover as string | undefined) || null;

      try {
        const [result] = await pool.query(
          `INSERT INTO content_items
             (section_id, title, filename, cover, availability, url_questions,
              content_type, sort_order, visible)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, title || null, filename, coverFilename,
            availability || '2000-01-01', url_questions || 'not-url',
            content_type || 'video', sort_order ?? 0, visible ?? 1,
          ],
        );
        const insertId = (result as { insertId: number }).insertId;
        res.status(201).json({ error: null, data: { id: insertId } });
      } catch (error) {
        res.status(500).json({ error: 'Error al crear contenido' });
      }
    },
  );

  router.put(
    '/content/:id',
    upload.single('cover'),
    async (req: AuthRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const {
        title, filename, availability, url_questions,
        content_type, sort_order, visible,
      } = req.body as Partial<ContentItem>;

      const coverFilename = req.file ? req.file.filename : (req.body.cover as string | undefined);

      try {
        await pool.query(
          `UPDATE content_items SET
             title = ?,
             filename = COALESCE(?, filename),
             cover = COALESCE(?, cover),
             availability = COALESCE(?, availability),
             url_questions = COALESCE(?, url_questions),
             content_type = COALESCE(?, content_type),
             sort_order = COALESCE(?, sort_order),
             visible = COALESCE(?, visible)
           WHERE id = ?`,
          [
            title !== undefined ? title : null,
            filename || null, coverFilename || null,
            availability || null, url_questions || null,
            content_type || null, sort_order ?? null,
            visible ?? null, id,
          ],
        );
        res.json({ error: null });
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar contenido' });
      }
    },
  );

  router.delete('/content/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM content_items WHERE id = ?', [id]);
      res.json({ error: null });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar contenido' });
    }
  });

  return router;
};
