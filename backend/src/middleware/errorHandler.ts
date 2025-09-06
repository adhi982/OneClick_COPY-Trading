import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
   statusCode: number;
   isOperational: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
   const error = new Error(message) as AppError;
   error.statusCode = statusCode;
   error.isOperational = true;
   return error;
};

export const errorHandler = (
   error: AppError | Error,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   let statusCode = 500;
   let message = 'Internal server error';

   if ('statusCode' in error) {
      statusCode = error.statusCode;
      message = error.message;
   }

   // Log error details
   logger.error('API Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
   });

   // Don't leak error details in production
   if (process.env.NODE_ENV === 'production' && statusCode === 500) {
      message = 'Internal server error';
   }

   res.status(statusCode).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      path: req.path
   });
};
