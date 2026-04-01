import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'mysql2/promise';

export const createAuthRouter = (pool: Pool): Router => {
  const router = Router();

  router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña requeridos' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Configuración del servidor incompleta' });
      return;
    }

    try {
      const [rows] = await pool.query(
        'SELECT id, password_hash FROM admin_users WHERE username = ?',
        [username],
      );
      const users = rows as { id: number; password_hash: string }[];

      if (users.length === 0) {
        res.status(401).json({ error: 'Credenciales incorrectas' });
        return;
      }

      const user = users[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        res.status(401).json({ error: 'Credenciales incorrectas' });
        return;
      }

      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '8h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  return router;
};
