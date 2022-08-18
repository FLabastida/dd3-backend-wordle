import { Request, Response } from 'express'
import { topWords as topWordsService, gameWord as gameWordService } from './service'
// Main game
const gameWord = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await gameWordService(req.body, res.locals)
    if (response.message !== undefined) {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      response
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
// Top words
const topWords = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const response = await topWordsService()
    if (response.message !== undefined) {
      return res.status(400).json({ message: response.message })
    }
    return res.status(200).json({
      top_words: response
    })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}
export { gameWord, topWords }
