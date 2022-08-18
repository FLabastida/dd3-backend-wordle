import { login as loginService, register as registerService, topTen as topTenService, stats as statsService } from '../users/service'
import { Request, Response } from 'express'
const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await loginService(req.body)
    if (response.token === '') {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      token: response.token,
      message: 'Successfully login'
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await registerService(req.body)
    if (response.token === '') {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      message: 'Successfully register'
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
const topTen = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const response = await topTenService()
    if (response.token === '') {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      top_ten: response,
      message: 'Successfully get top-ten users'
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
const stats = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const response = await statsService(res.locals)
    if (response.token === '') {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      user_stats: response,
      message: 'Successfully get user stats'
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
export { register, login, topTen, stats }
