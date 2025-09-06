import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
   user: {
      userId: string;
      walletAddress: string;
   };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
         return res.status(401).json({ error: 'No authorization header provided' });
      }

      const token = authHeader.split(' ')[1]; // Bearer <token>

      if (!token) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (req as AuthenticatedRequest).user = {
         userId: decoded.userId,
         walletAddress: decoded.walletAddress
      };

      next();
   } catch (error) {
      logger.error('Auth middleware error:', error);

      if (error instanceof jwt.TokenExpiredError) {
         return res.status(401).json({ error: 'Token expired' });
      }

      if (error instanceof jwt.JsonWebTokenError) {
         return res.status(401).json({ error: 'Invalid token' });
      }

      return res.status(500).json({ error: 'Internal server error' });
   }
};
