import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import configSetup from '../config/appConfig'
import { Users } from '../api/users/entity'
import { AppDataSource } from '../db/db'

interface decodedToken {
  username: string
  id: string
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers['x-access-token']
    if (token === undefined || token.length === 0) {
      return res.status(403).json({
        message: 'Token not found, you need to login first'
      })
    }
    const decoded: decodedToken | any = jwt.verify(String(token), String(configSetup.SECRET))
    // Valid jwt with DB
    const userRepository = AppDataSource.getRepository(Users)
    const userExist = await userRepository.findOne({
      where: {
        username: decoded.username,
        id: parseInt(decoded.id)
      }
    })
    if (userExist === null) {
      return res.status(401).json({
        message: 'Forbidden, invalid token'
      })
    } else {
      res.locals.username = decoded.username
      res.locals.userId = decoded.id
      next()
    }
  } catch (error) {
    return res.status(401).json({ message: 'Forbidden!' })
  }
}
