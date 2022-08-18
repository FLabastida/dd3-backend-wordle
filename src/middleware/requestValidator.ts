import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
export const validateRequest = (req: Request, res: Response, next: NextFunction): NextFunction | Response | any => {
  // Validaciones desde el middleware express-validators
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ Error: errors.array() })
  }
  next()
}
