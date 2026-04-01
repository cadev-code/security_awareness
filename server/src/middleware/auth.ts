import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: number;
  file?: Express.Multer.File;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET || 'changeme_secret';

  try {
    const payload = jwt.verify(token, secret) as { id: number };
    req.adminId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
