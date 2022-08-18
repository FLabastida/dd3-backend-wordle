import { Request, Response, NextFunction } from 'express'

export const forbiddenURL = (_req: Request, res: Response, _next: NextFunction): Response => {
  return res.status(403).json({
    message: 'Forbidden'
  })
}
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  return res.status(500).json({
    message: err.message
  })
}
