import { Request, Response, NextFunction } from 'express'; 

export class DBError extends Error {
}

export function dbErrorHandler(error: Error, _req: Request, res: Response, next: NextFunction) {
  if (error instanceof DBError) {
    res.status(404).json({ error: error.message });
  } else {
    next(error)
  }
};